"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { useAuditorias } from "@/hooks/useAuditorias";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "@/lib/router-shim";
import {
  PlayCircle,
  Clock,
  Building2,
  FolderTree,
  User,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ExecucaoPage() {
  const { auditorias, loading } = useAuditorias();
  const navigate = useNavigate();

  // Filter auditorias that are ready for execution
  const auditoriasParaExecutar = auditorias.filter(
    (aud) => aud.status === "planejada" || aud.status === "em_execucao"
  );

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "planejada":
        return {
          label: "Planejada",
          color: "bg-accent text-accent-foreground border-border",
          icon: Clock,
        };
      case "em_execucao":
        return {
          label: "Em Execução",
          color: "bg-yellow-100 text-yellow-700 border-yellow-200",
          icon: PlayCircle,
        };
      default:
        return {
          label: status,
          color: "bg-muted text-muted-foreground border-border",
          icon: AlertCircle,
        };
    }
  };

  const getDimensaoInfo = (dimensao: number) => {
    switch (dimensao) {
      case 1:
        return { label: "Dimensão 1 - Segurança", color: "text-ona-seguranca" };
      case 2:
        return { label: "Dimensão 2 - Gestão", color: "text-ona-gestao" };
      case 3:
        return { label: "Dimensão 3 - Excelência", color: "text-ona-excelencia" };
      default:
        return { label: "Sem dimensão", color: "text-muted-foreground" };
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="mb-6">
          <h1 className="font-outfit text-3xl font-bold text-foreground">
            Execução de Auditorias
          </h1>
          <p className="mt-2 text-muted-foreground">
            Auditorias disponíveis para execução
          </p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="font-outfit text-3xl font-bold text-foreground">
          Execução de Auditorias
        </h1>
        <p className="mt-2 text-muted-foreground">
          Auditorias disponíveis para execução
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent p-2.5">
              <Clock className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Planejadas</p>
              <p className="font-outfit text-2xl font-bold text-foreground">
                {auditorias.filter((a) => a.status === "planejada").length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-2.5">
              <PlayCircle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Em Execução</p>
              <p className="font-outfit text-2xl font-bold text-foreground">
                {auditorias.filter((a) => a.status === "em_execucao").length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-status-success/10 p-2.5">
              <CheckCircle2 className="h-5 w-5 text-status-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Concluídas Hoje</p>
              <p className="font-outfit text-2xl font-bold text-foreground">
                {auditorias.filter((a) => a.status === "concluida").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Auditorias List */}
      {auditoriasParaExecutar.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16">
          <CheckCircle2 className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 font-outfit text-lg font-semibold text-foreground">
            Nenhuma auditoria para executar
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Todas as auditorias planejadas foram concluídas
          </p>
          <Button onClick={() => navigate("/auditorias/nova")}>
            Planejar Nova Auditoria
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {auditoriasParaExecutar.map((auditoria) => {
            const statusInfo = getStatusInfo(auditoria.status);
            const dimensaoInfo = getDimensaoInfo(auditoria.dimensao_ona);
            const StatusIcon = statusInfo.icon;

            const progresso =
              auditoria.status === "em_execucao"
                ? auditoria.aderencia || 0
                : 0;

            return (
              <div
                key={auditoria.id}
                className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="font-mono text-xs font-medium"
                      >
                        {auditoria.numero}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn("text-xs", statusInfo.color)}
                      >
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {statusInfo.label}
                      </Badge>
                    </div>
                    <h3 className="mb-2 font-outfit text-xl font-semibold text-foreground">
                      {auditoria.titulo}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {auditoria.tipo}
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate(`/auditorias/${auditoria.id}/execucao`)}
                    size="lg"
                    className="shrink-0"
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    {auditoria.status === "em_execucao"
                      ? "Continuar"
                      : "Iniciar Execução"}
                  </Button>
                </div>

                {/* Info Grid */}
                <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Unidade:</span>
                    <span className="font-medium text-foreground">
                      {auditoria.unidade}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FolderTree className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Setor:</span>
                    <span className="font-medium text-foreground">
                      {auditoria.setor}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Auditor:</span>
                    <span className="font-medium text-foreground">
                      {auditoria.auditor}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Data:</span>
                    <span className="font-medium text-foreground">
                      {auditoria.data_programada}
                    </span>
                  </div>
                </div>

                {/* ONA Dimension */}
                <div className="mb-4">
                  <Badge variant="outline" className={cn("text-xs", dimensaoInfo.color)}>
                    {dimensaoInfo.label}
                  </Badge>
                </div>

                {/* Progress (for audits in execution) */}
                {auditoria.status === "em_execucao" && (
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Progresso da Execução
                      </span>
                      <span className="font-medium text-foreground">
                        {progresso}%
                      </span>
                    </div>
                    <Progress value={progresso} className="h-2" />
                    {auditoria.conformes !== undefined && (
                      <div className="mt-3 flex gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-status-success" />
                          <span className="text-muted-foreground">
                            Conformes: {auditoria.conformes}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-yellow-500" />
                          <span className="text-muted-foreground">
                            Parciais: {auditoria.parciais}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-red-500" />
                          <span className="text-muted-foreground">
                            Não Conformes: {auditoria.nao_conformes}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </MainLayout>
  );
}
