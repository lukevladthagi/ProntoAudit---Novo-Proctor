"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "@/lib/router-shim";
import { MainLayout } from "@/components/layout/MainLayout";
import { AuditHeader } from "@/components/execucao/AuditHeader";
import {
  RequisitoItem,
  RequisitoData,
} from "@/components/execucao/RequisitoItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuditoriaExecucao } from "@/hooks/useAuditoriaExecucao";

export default function ExecucaoAuditoriaPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const { auditoria, requisitos: requisitosData, loading, updateRequisito, finalizarAuditoria } = useAuditoriaExecucao(id || "");
  
  const [requisitos, setRequisitos] = useState<RequisitoData[]>([]);
  const [filtroConformidade, setFiltroConformidade] = useState<string>("todos");
  const [filtroBusca, setFiltroBusca] = useState<string>("");

  // Update local state when data loads
  useEffect(() => {
    if (requisitosData.length > 0) {
      const mapped = requisitosData.map((req) => {
        // Map database conformidade to component conformidade
        let conformidade: RequisitoData["conformidade"] = undefined;
        if (req.conformidade === "conforme") conformidade = "conforme";
        else if (req.conformidade === "parcialmente_conforme") conformidade = "parcial";
        else if (req.conformidade === "nao_conforme") conformidade = "nao_conforme";
        else if (req.conformidade === "nao_aplicavel") conformidade = "nao_aplicavel";

        return {
          id: req.id,
          codigo: req.codigo,
          titulo: req.titulo,
          descricao: req.descricao,
          dimensao_ona: req.dimensao_ona as 1 | 2 | 3,
          dimensao_nome: req.dimensao_nome,
          eixo: req.eixo,
          nivel_criticidade: req.nivel_criticidade as "baixo" | "moderado" | "alto" | "critico",
          conformidade,
          observacoes: req.observacoes || undefined,
          evidencias: req.evidencias || undefined,
          tem_achado: req.tem_achado,
        };
      });
      setRequisitos(mapped);
    }
  }, [requisitosData]);

  // Calculate progress stats
  const stats = requisitos.reduce(
    (acc, req) => {
      if (req.conformidade === "conforme") acc.conformes++;
      else if (req.conformidade === "parcial") acc.parciais++;
      else if (req.conformidade === "nao_conforme") acc.nao_conformes++;
      else acc.nao_avaliados++;
      return acc;
    },
    { conformes: 0, parciais: 0, nao_conformes: 0, nao_avaliados: 0 }
  );

  const total = requisitos.length;
  const avaliados = total - stats.nao_avaliados;
  const progresso = Math.round((avaliados / total) * 100);

  const handleRequisitoChange = async (requisitoId: number, data: Partial<RequisitoData>) => {
    // Update local state immediately for UI feedback
    setRequisitos((prev) =>
      prev.map((req) => (req.id === requisitoId ? { ...req, ...data } : req))
    );

    // Save to backend
    if (data.conformidade) {
      // Map component conformidade to database conformidade
      let dbConformidade: string = data.conformidade;
      if (data.conformidade === "parcial") {
        dbConformidade = "parcialmente_conforme";
      }

      const success = await updateRequisito(
        requisitoId,
        dbConformidade,
        data.observacoes,
        data.evidencias
      );

      if (!success) {
        console.error("Failed to save requisito evaluation");
      }
    }
    
    // Save photos if provided
    if (data.fotos !== undefined) {
      // Photos are already uploaded to R2, just update the state
      // The URLs are stored in the local state
    }
  };

  const handleCreateFinding = (requisitoId: number) => {
    console.log("Create finding for requisito:", requisitoId);
    // Mark as having finding
    setRequisitos((prev) =>
      prev.map((req) => (req.id === requisitoId ? { ...req, tem_achado: true } : req))
    );
    // TODO: Open dialog to create finding
  };

  const handleSaveProgress = () => {
    console.log("Progress auto-saved");
  };

  const handleFinalize = async () => {
    const success = await finalizarAuditoria();
    
    if (success) {
      navigate("/auditorias");
    } else {
      console.error("Failed to finalize audit");
    }
  };

  // Filter requisitos
  const filteredRequisitos = requisitos.filter((req) => {
    // Filter by conformidade
    if (filtroConformidade !== "todos") {
      if (filtroConformidade === "nao_avaliados" && req.conformidade !== undefined)
        return false;
      if (
        filtroConformidade !== "nao_avaliados" &&
        req.conformidade !== filtroConformidade
      )
        return false;
    }

    // Filter by search
    if (filtroBusca) {
      const searchLower = filtroBusca.toLowerCase();
      return (
        req.codigo.toLowerCase().includes(searchLower) ||
        req.titulo.toLowerCase().includes(searchLower) ||
        req.descricao.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  const groupedRequisitos = filteredRequisitos.reduce<
    { key: string; dimensao: string; eixo: string; requisitos: RequisitoData[] }[]
  >((groups, requisito) => {
    const dimensao = requisito.dimensao_nome || `Dimensão ${requisito.dimensao_ona}`;
    const eixo = requisito.eixo || "Sem eixo";
    const key = `${dimensao}::${eixo}`;
    let group = groups.find((item) => item.key === key);
    if (!group) {
      group = { key, dimensao, eixo, requisitos: [] };
      groups.push(group);
    }
    group.requisitos.push(requisito);
    return groups;
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Carregando auditoria...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!auditoria) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Auditoria não encontrada</p>
          <Button onClick={() => navigate("/auditorias")} className="mt-4">
            Voltar para Auditorias
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/auditorias")}
        className="mb-4 -ml-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para Auditorias
      </Button>

      {/* Header */}
      <div className="mb-6">
        <AuditHeader
          numero={auditoria.numero}
          titulo={auditoria.titulo}
          tipo={auditoria.tipo}
          unidade={auditoria.unidade_nome}
          setor={auditoria.setor_nome}
          auditor={auditoria.auditor_nome}
          data={new Date(auditoria.data_programada).toLocaleDateString("pt-BR")}
          progresso={progresso}
          conformes={stats.conformes}
          parciais={stats.parciais}
          nao_conformes={stats.nao_conformes}
          nao_avaliados={stats.nao_avaliados}
          total={total}
          tempo_decorrido="--"
          onSave={handleSaveProgress}
          onFinalize={handleFinalize}
        />
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar requisitos..."
            className="pl-9"
            value={filtroBusca}
            onChange={(e) => setFiltroBusca(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={filtroConformidade} onValueChange={setFiltroConformidade}>
            <SelectTrigger className="w-[200px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Requisitos</SelectItem>
              <SelectItem value="nao_avaliados">Não Avaliados</SelectItem>
              <SelectItem value="conforme">Conformes</SelectItem>
              <SelectItem value="parcial">Parciais</SelectItem>
              <SelectItem value="nao_conforme">Não Conformes</SelectItem>
              <SelectItem value="nao_aplicavel">N/A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Exibindo {filteredRequisitos.length} de {total} requisitos
        </p>
      </div>

      {/* Requisitos List */}
      <div className="space-y-5">
        {groupedRequisitos.map((group) => (
          <section key={group.key} className="space-y-3">
            <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.dimensao}
              </p>
              <h2 className="font-outfit text-lg font-semibold text-foreground">
                {group.eixo}
              </h2>
            </div>
            {group.requisitos.map((requisito, index) => (
              <RequisitoItem
                key={requisito.id}
                requisito={requisito}
                numero={index + 1}
                auditoriaId={id || ""}
                onChange={handleRequisitoChange}
                onCreateFinding={handleCreateFinding}
              />
            ))}
          </section>
        ))}
      </div>

      {/* Empty State */}
      {filteredRequisitos.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16">
          <Search className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 font-outfit text-lg font-semibold text-foreground">
            Nenhum requisito encontrado
          </h3>
          <p className="text-sm text-muted-foreground">
            Tente ajustar os filtros de busca
          </p>
        </div>
      )}

      {/* Floating Action Bar */}
      {stats.nao_avaliados === 0 && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform">
          <div className="rounded-full border border-primary/30 bg-primary/95 px-6 py-3 shadow-lg backdrop-blur-sm">
            <p className="text-center text-sm font-medium text-primary-foreground">
              Todos os requisitos foram avaliados! Você pode finalizar a auditoria.
            </p>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
