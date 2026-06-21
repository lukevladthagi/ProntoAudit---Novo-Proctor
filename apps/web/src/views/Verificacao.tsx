"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { VerificacaoCard } from "@/components/verificacao/VerificacaoCard";
import { VerificacaoFilters, VerificacaoFilterType } from "@/components/verificacao/VerificacaoFilters";
import { useVerificacoes, Verificacao } from "@/hooks/useVerificacoes";
import {
  Plus,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

export default function VerificacaoPage() {
  const { verificacoes, loading } = useVerificacoes();
  const [filters, setFilters] = useState<VerificacaoFilterType>({});
  const [filteredVerificacoes, setFilteredVerificacoes] = useState<Verificacao[]>([]);

  useEffect(() => {
    if (!loading) {
      applyFilters(filters);
    }
  }, [verificacoes, loading]);

  const applyFilters = (newFilters: VerificacaoFilterType) => {
    let filtered = [...verificacoes];

    if (newFilters.busca) {
      const searchLower = newFilters.busca.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.numero_plano.toLowerCase().includes(searchLower) ||
          v.titulo_plano.toLowerCase().includes(searchLower)
      );
    }

    if (newFilters.resultado && newFilters.resultado !== "all") {
      if (newFilters.resultado === "eficaz") {
        filtered = filtered.filter((v) => v.eficaz === true);
      } else if (newFilters.resultado === "nao_eficaz") {
        filtered = filtered.filter((v) => v.eficaz === false);
      } else if (newFilters.resultado === "parcial") {
        filtered = filtered.filter((v) => v.resultado === "Parcialmente eficaz");
      }
    }

    if (newFilters.periodo && newFilters.periodo !== "all") {
      const hoje = new Date();
      filtered = filtered.filter((v) => {
        const dataVerif = new Date(v.data_verificacao.split("/").reverse().join("-"));
        
        switch (newFilters.periodo) {
          case "mes_atual":
            return dataVerif.getMonth() === hoje.getMonth() && 
                   dataVerif.getFullYear() === hoje.getFullYear();
          case "trimestre":
            const threeMonthsAgo = new Date(hoje);
            threeMonthsAgo.setMonth(hoje.getMonth() - 3);
            return dataVerif >= threeMonthsAgo;
          case "semestre":
            const sixMonthsAgo = new Date(hoje);
            sixMonthsAgo.setMonth(hoje.getMonth() - 6);
            return dataVerif >= sixMonthsAgo;
          case "ano":
            return dataVerif.getFullYear() === hoje.getFullYear();
          default:
            return true;
        }
      });
    }

    if (newFilters.requer_nova_acao !== undefined) {
      filtered = filtered.filter((v) => v.requer_nova_acao === newFilters.requer_nova_acao);
    }

    setFilteredVerificacoes(filtered);
  };

  const handleFilterChange = (newFilters: VerificacaoFilterType) => {
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  // Estatísticas
  const totalVerificacoes = filteredVerificacoes.length;
  const eficazes = filteredVerificacoes.filter((v) => v.eficaz === true).length;
  const naoEficazes = filteredVerificacoes.filter((v) => v.eficaz === false).length;
  const requeremNovaAcao = filteredVerificacoes.filter((v) => v.requer_nova_acao).length;

  const taxaEficacia = totalVerificacoes > 0 
    ? Math.round((eficazes / totalVerificacoes) * 100) 
    : 0;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-outfit text-3xl font-bold text-foreground">
              Verificação de Eficácia
            </h1>
            <p className="mt-1 text-muted-foreground">
              Acompanhamento e avaliação da efetividade das ações implementadas
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Verificação
            </Button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Total de Verificações
              </p>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 font-outfit text-3xl font-bold text-foreground">
              {totalVerificacoes}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Ações Eficazes
              </p>
              <CheckCircle2 className="h-4 w-4 text-status-success" />
            </div>
            <p className="mt-2 font-outfit text-3xl font-bold text-status-success">
              {eficazes}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Não Eficazes
              </p>
              <XCircle className="h-4 w-4 text-status-danger" />
            </div>
            <p className="mt-2 font-outfit text-3xl font-bold text-status-danger">
              {naoEficazes}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Taxa de Eficácia
              </p>
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 font-outfit text-3xl font-bold text-foreground">
              {taxaEficacia}%
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Requerem Nova Ação
              </p>
              <AlertTriangle className="h-4 w-4 text-status-warning" />
            </div>
            <p className="mt-2 font-outfit text-3xl font-bold text-status-warning">
              {requeremNovaAcao}
            </p>
          </div>
        </div>

        {/* Filtros */}
        <VerificacaoFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Lista de Verificações */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <Clock className="mx-auto h-12 w-12 animate-spin text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Carregando verificações...
                </p>
              </div>
            </div>
          ) : filteredVerificacoes.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-border">
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-outfit text-lg font-semibold text-foreground">
                  Nenhuma verificação encontrada
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Tente ajustar os filtros ou criar uma nova verificação
                </p>
              </div>
            </div>
          ) : (
            filteredVerificacoes.map((verificacao) => (
              <VerificacaoCard
                key={verificacao.id}
                verificacao={verificacao}
              />
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
