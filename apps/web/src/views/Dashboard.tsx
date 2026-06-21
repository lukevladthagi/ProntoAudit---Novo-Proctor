'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { ONADimensionCard } from '@/components/dashboard/ONADimensionCard';
import { RecentAudits } from '@/components/dashboard/RecentAudits';
import { CriticalFindings } from '@/components/dashboard/CriticalFindings';
import { OverdueActions } from '@/components/dashboard/OverdueActions';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useONADimensions } from '@/hooks/useONADimensions';
import { useQuery } from '@tanstack/react-query';
import { ClipboardCheck, AlertTriangle, ListTodo, TrendingUp, Calendar } from 'lucide-react';

interface SetorConformidade {
  setor: string;
  aderencia: number | null;
  total: number;
}

export default function DashboardPage() {
  const { stats, loading: statsLoading } = useDashboardStats();
  const { dimensions, loading: dimensionsLoading } = useONADimensions();

  const { data: setoresData = [], isLoading: setoresLoading } = useQuery<SetorConformidade[]>({
    queryKey: ['dashboard-conformidade-setor'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard/conformidade-setor');
      if (!res.ok) throw new Error('Erro ao carregar dados');
      return res.json();
    },
  });

  const dimensionNames = ['Segurança', 'Gestão Integrada', 'Excelência em Gestão'];
  const dimensionDescriptions = [
    'Estrutura e processos assistenciais seguros',
    'Padronização e integração de processos',
    'Melhoria contínua e indicadores',
  ];

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-outfit text-3xl font-bold text-foreground">Dashboard Executivo</h1>
            <p className="mt-1 text-muted-foreground">
              Visão geral do sistema de auditoria e qualidade hospitalar
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-card border border-border px-4 py-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Período:</span>
            <span className="text-sm font-medium">Janeiro 2024</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Auditorias no Mês"
          value={statsLoading ? '...' : String(stats?.auditorias.total || 0)}
          subtitle={
            statsLoading
              ? 'Carregando...'
              : `${stats?.auditorias.concluidas || 0} concluídas, ${stats?.auditorias.em_execucao || 0} em execução`
          }
          icon={ClipboardCheck}
        />
        <StatCard
          title="Achados Abertos"
          value={statsLoading ? '...' : String(stats?.achados.total || 0)}
          subtitle={
            statsLoading
              ? 'Carregando...'
              : `${stats?.achados.criticos || 0} críticos, ${stats?.achados.altos || 0} altos`
          }
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title="Ações Pendentes"
          value={statsLoading ? '...' : String(stats?.planos.total || 0)}
          subtitle={statsLoading ? 'Carregando...' : `${stats?.planos.atrasados || 0} vencidas`}
          icon={ListTodo}
          variant="danger"
        />
        <StatCard
          title="Aderência Geral"
          value={statsLoading ? '...' : `${stats?.aderencia_geral || 0}%`}
          subtitle="Média das auditorias"
          icon={TrendingUp}
          variant="success"
        />
      </div>

      {/* ONA Dimensions */}
      <div className="mb-8">
        <h2 className="mb-4 font-outfit text-xl font-semibold text-foreground">
          Conformidade por Dimensão ONA
        </h2>
        {dimensionsLoading ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-xl border border-border bg-muted/30"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {dimensions.map((dim) => (
              <ONADimensionCard
                key={dim.dimension}
                dimension={dim.dimension as 1 | 2 | 3}
                title={dimensionNames[dim.dimension - 1]}
                description={dimensionDescriptions[dim.dimension - 1]}
                percentage={dim.percentage}
                conformes={dim.conformes}
                parciais={dim.parciais}
                naoConformes={dim.naoConformes}
              />
            ))}
          </div>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RecentAudits />
        <CriticalFindings />
      </div>

      {/* Overdue Actions */}
      <div className="mb-8">
        <OverdueActions />
      </div>

      {/* Conformity by Sector Heatmap */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 font-outfit text-lg font-semibold text-card-foreground">
          Mapa de Conformidade por Setor
        </h3>
        {setoresLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-16 rounded-lg bg-muted" />
            ))}
          </div>
        ) : setoresData.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Nenhum setor com dados de execução ainda.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {setoresData.map((item) => {
              const aderencia = item.aderencia;
              const colorClass =
                aderencia === null || item.total === 0
                  ? 'bg-muted/40 text-muted-foreground'
                  : aderencia >= 90
                    ? 'bg-status-success/20 text-status-success'
                    : aderencia >= 80
                      ? 'bg-status-success/10 text-status-success'
                      : aderencia >= 70
                        ? 'bg-status-warning/15 text-status-warning'
                        : 'bg-status-danger/15 text-status-danger';

              return (
                <div
                  key={item.setor}
                  className={`rounded-lg p-3 text-center transition-transform hover:scale-105 ${colorClass}`}
                >
                  <span className="block text-2xl font-bold">
                    {aderencia !== null && item.total > 0 ? `${aderencia}%` : '—'}
                  </span>
                  <span className="block text-xs font-medium opacity-80">{item.setor}</span>
                </div>
              );
            })}
          </div>
        )}
        <div className="mt-4 flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-status-success/20"></div>
            <span className="text-muted-foreground">≥90% Excelente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-status-success/10"></div>
            <span className="text-muted-foreground">80-89% Bom</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-status-warning/15"></div>
            <span className="text-muted-foreground">70-79% Regular</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-status-danger/15"></div>
            <span className="text-muted-foreground">&lt;70% Crítico</span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
