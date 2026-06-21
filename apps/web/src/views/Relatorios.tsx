"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  RelatoriosFilters,
  RelatorioFilters,
} from "@/components/relatorios/RelatoriosFilters";
import { IndicadorCard } from "@/components/relatorios/IndicadorCard";
import { ConformidadeChart } from "@/components/relatorios/ConformidadeChart";
import { TendenciaChart } from "@/components/relatorios/TendenciaChart";
import { CriticidadeChart } from "@/components/relatorios/CriticidadeChart";
import { useRelatorios } from "@/hooks/useRelatorios";
import {
  Download,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export default function RelatoriosPage() {
  const { data, loading } = useRelatorios();
  const [filters, setFilters] = useState<RelatorioFilters>({});

  const handleFilterChange = (newFilters: RelatorioFilters) => {
    setFilters(newFilters);
    // TODO: Refetch data with filters
  };

  const handleExport = () => {
    console.log("Exportar relatório");
    // TODO: Implement export functionality
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="h-10 w-64 animate-pulse rounded bg-muted"></div>
          <div className="h-32 animate-pulse rounded-xl bg-muted"></div>
          <div className="grid grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-xl bg-muted"></div>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!data) {
    return (
      <MainLayout>
        <div className="flex h-96 items-center justify-center">
          <p className="text-muted-foreground">Erro ao carregar dados dos relatórios</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-outfit text-3xl font-bold text-foreground">
              Relatórios e Indicadores
            </h1>
            <p className="mt-1 text-muted-foreground">
              Análise de desempenho e indicadores de qualidade
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Gerar Relatório
            </Button>
          </div>
        </div>

        {/* Filters */}
        <RelatoriosFilters filters={filters} onChange={handleFilterChange} />

        {/* Indicadores Principais */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <IndicadorCard
            titulo="Total de Auditorias"
            valor={data.indicadores.total_auditorias}
            subtitulo="no período"
            variacao={data.indicadores.variacao_auditorias}
            icon={FileText}
            color="primary"
          />
          <IndicadorCard
            titulo="Aderência Geral"
            valor={`${data.indicadores.aderencia_geral}%`}
            subtitulo="conformidade média"
            variacao={data.indicadores.variacao_aderencia}
            icon={TrendingUp}
            color="success"
          />
          <IndicadorCard
            titulo="Total de Achados"
            valor={data.indicadores.total_achados}
            subtitulo="não conformidades"
            variacao={data.indicadores.variacao_achados}
            icon={AlertTriangle}
            color="warning"
          />
          <IndicadorCard
            titulo="Planos Concluídos"
            valor={data.indicadores.planos_concluidos}
            subtitulo="ações implementadas"
            icon={CheckCircle2}
            color="info"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <ConformidadeChart data={data.conformidade_dimensoes} />
          <CriticidadeChart data={data.achados_criticidade} />
        </div>

        {/* Charts Row 2 */}
        <TendenciaChart data={data.tendencia_temporal} />

        {/* Status dos Planos de Ação */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="mb-4 font-outfit text-lg font-semibold text-card-foreground">
            Status dos Planos de Ação
          </h3>
          <div className="grid grid-cols-5 gap-4">
            {data.planos_status.map((item) => (
              <div
                key={item.status}
                className="rounded-lg border border-border bg-muted/30 p-4 text-center"
              >
                <p className="text-2xl font-bold text-card-foreground">{item.total}</p>
                <p className="mt-1 text-xs capitalize text-muted-foreground">
                  {item.status.replace("_", " ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
