"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "@/lib/router-shim";
import { MainLayout } from "@/components/layout/MainLayout";
import { AuditoriasFilters, AuditFilters } from "@/components/auditorias/AuditoriasFilters";
import { AuditoriaCard } from "@/components/auditorias/AuditoriaCard";
import { useAuditorias, Auditoria } from "@/hooks/useAuditorias";
import { Button } from "@/components/ui/button";
import { Plus, Download, FileSpreadsheet } from "lucide-react";

export default function AuditoriasPage() {
  const navigate = useNavigate();
  const { auditorias, loading } = useAuditorias();
  const [filters, setFilters] = useState<AuditFilters>({});
  const [filteredAuditorias, setFilteredAuditorias] = useState<Auditoria[]>([]);

  useEffect(() => {
    if (!loading) {
      applyFilters(filters);
    }
  }, [auditorias, loading]);

  const applyFilters = (newFilters: AuditFilters) => {
    let filtered = [...auditorias];

    if (newFilters.busca) {
      const searchLower = newFilters.busca.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.numero.toLowerCase().includes(searchLower) ||
          a.titulo.toLowerCase().includes(searchLower)
      );
    }

    if (newFilters.status && newFilters.status !== "all") {
      filtered = filtered.filter((a) => a.status === newFilters.status);
    }

    if (newFilters.unidade && newFilters.unidade !== "all") {
      const unidadeMap: Record<string, string> = {
        hospital_central: "Hospital Central",
        ambulatorio_norte: "Ambulatório Norte",
        clinica_sul: "Clínica Sul",
      };
      filtered = filtered.filter((a) => a.unidade === unidadeMap[newFilters.unidade!]);
    }

    if (newFilters.setor && newFilters.setor !== "all") {
      const setorMap: Record<string, string> = {
        uti: "UTI Adulto",
        uti_neo: "UTI Neonatal",
        centro_cirurgico: "Centro Cirúrgico",
        farmacia: "Farmácia",
        cme: "CME",
        emergencia: "Emergência",
        internacao: "Internação",
      };
      filtered = filtered.filter((a) => a.setor === setorMap[newFilters.setor!]);
    }

    if (newFilters.tipo && newFilters.tipo !== "all") {
      filtered = filtered.filter((a) => a.tipo === newFilters.tipo);
    }

    if (newFilters.auditor && newFilters.auditor !== "all") {
      const auditorMap: Record<string, string> = {
        carlos: "Dr. Carlos Silva",
        ana: "Dra. Ana Costa",
        maria: "Enf. Maria Santos",
        roberto: "Coord. Roberto Santos",
      };
      filtered = filtered.filter((a) => a.auditor === auditorMap[newFilters.auditor!]);
    }

    setFilteredAuditorias(filtered);
  };

  const handleFilterChange = (newFilters: AuditFilters) => {
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-outfit text-3xl font-bold text-foreground">
            Auditorias
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gerenciamento completo de auditorias de qualidade hospitalar
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Relatório
          </Button>
          <Button onClick={() => navigate("/auditorias/nova")}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Auditoria
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="font-outfit text-2xl font-bold text-card-foreground">
            {filteredAuditorias.length}
          </p>
        </div>
        <div className="rounded-lg border border-status-info/30 bg-status-info/5 p-4">
          <p className="text-sm text-status-info">Planejadas</p>
          <p className="font-outfit text-2xl font-bold text-status-info">
            {filteredAuditorias.filter((a) => a.status === "planejada").length}
          </p>
        </div>
        <div className="rounded-lg border border-status-warning/30 bg-status-warning/5 p-4">
          <p className="text-sm text-status-warning">Em Execução</p>
          <p className="font-outfit text-2xl font-bold text-status-warning">
            {filteredAuditorias.filter((a) => a.status === "em_execucao").length}
          </p>
        </div>
        <div className="rounded-lg border border-ona-gestao/30 bg-ona-gestao/5 p-4">
          <p className="text-sm text-ona-gestao">Em Revisão</p>
          <p className="font-outfit text-2xl font-bold text-ona-gestao">
            {filteredAuditorias.filter((a) => a.status === "em_revisao").length}
          </p>
        </div>
        <div className="rounded-lg border border-status-success/30 bg-status-success/5 p-4">
          <p className="text-sm text-status-success">Concluídas</p>
          <p className="font-outfit text-2xl font-bold text-status-success">
            {filteredAuditorias.filter((a) => a.status === "concluida").length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <AuditoriasFilters onFilterChange={handleFilterChange} />
      </div>

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredAuditorias.length} {filteredAuditorias.length === 1 ? "auditoria encontrada" : "auditorias encontradas"}
        </p>
      </div>

      {/* Auditorias Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-xl border border-border bg-muted/30"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {filteredAuditorias.map((auditoria) => (
            <AuditoriaCard
              key={auditoria.id}
              auditoria={auditoria}
              onViewDetails={(id) => navigate(`/auditorias/${id}`)}
              onContinueExecution={(id) => navigate(`/auditorias/${id}/execucao`)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredAuditorias.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16">
          <FileSpreadsheet className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 font-outfit text-lg font-semibold text-foreground">
            Nenhuma auditoria encontrada
          </h3>
          <p className="mb-6 text-sm text-muted-foreground">
            Tente ajustar os filtros ou crie uma nova auditoria
          </p>
          <Button onClick={() => navigate("/auditorias/nova")}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Auditoria
          </Button>
        </div>
      )}
    </MainLayout>
  );
}
