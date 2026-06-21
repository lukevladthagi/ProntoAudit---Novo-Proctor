"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Calendar,
  User,
  Building2,
  FileText,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export interface Auditoria {
  id: number;
  numero: string;
  titulo: string;
  tipo: string;
  unidade: string;
  setor: string;
  auditor: string;
  coauditor?: string;
  data_programada: string;
  data_inicio?: string;
  data_fim?: string;
  status: "planejada" | "em_execucao" | "em_revisao" | "concluida" | "cancelada";
  aderencia?: number;
  conformes?: number;
  parciais?: number;
  nao_conformes?: number;
  dimensao_ona?: 1 | 2 | 3;
  achados_criticos?: number;
}

const statusConfig = {
  planejada: {
    label: "Planejada",
    className: "bg-status-info/15 text-status-info border-status-info/30",
  },
  em_execucao: {
    label: "Em Execução",
    className: "bg-status-warning/15 text-status-warning border-status-warning/30",
  },
  em_revisao: {
    label: "Em Revisão",
    className: "bg-ona-gestao/15 text-ona-gestao border-ona-gestao/30",
  },
  concluida: {
    label: "Concluída",
    className: "bg-status-success/15 text-status-success border-status-success/30",
  },
  cancelada: {
    label: "Cancelada",
    className: "bg-muted text-muted-foreground border-border",
  },
};

const tipoLabels: Record<string, string> = {
  interna: "Auditoria Interna",
  acompanhamento: "Acompanhamento",
  tematica: "Temática",
  preparacao_acreditacao: "Preparação Acreditação",
  extraordinaria: "Extraordinária",
};

const dimensaoLabels = {
  1: "D1 - Segurança",
  2: "D2 - Gestão",
  3: "D3 - Excelência",
};

interface AuditoriaCardProps {
  auditoria: Auditoria;
  onViewDetails?: (id: number) => void;
  onContinueExecution?: (id: number) => void;
}

export function AuditoriaCard({
  auditoria,
  onViewDetails,
  onContinueExecution,
}: AuditoriaCardProps) {
  return (
    <div className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-semibold text-primary">
              {auditoria.numero}
            </span>
            <Badge
              variant="outline"
              className={cn("text-xs", statusConfig[auditoria.status].className)}
            >
              {statusConfig[auditoria.status].label}
            </Badge>
            {auditoria.achados_criticos && auditoria.achados_criticos > 0 && (
              <Badge
                variant="outline"
                className="bg-status-danger/15 text-status-danger border-status-danger/30"
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                {auditoria.achados_criticos} críticos
              </Badge>
            )}
          </div>
          <h3 className="font-outfit text-lg font-semibold text-card-foreground">
            {auditoria.titulo}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {tipoLabels[auditoria.tipo] || auditoria.tipo}
            {auditoria.dimensao_ona && (
              <span className="ml-2">• {dimensaoLabels[auditoria.dimensao_ona]}</span>
            )}
          </p>
        </div>
        {auditoria.aderencia !== undefined && (
          <div className="ml-4 text-right">
            <span
              className={cn(
                "font-outfit text-3xl font-bold",
                auditoria.aderencia >= 80
                  ? "text-status-success"
                  : auditoria.aderencia >= 60
                  ? "text-status-warning"
                  : "text-status-danger"
              )}
            >
              {auditoria.aderencia}%
            </span>
            <p className="text-xs text-muted-foreground">aderência</p>
          </div>
        )}
      </div>

      {/* Progress Bar - Only for completed audits */}
      {auditoria.aderencia !== undefined && (
        <div className="mb-4">
          <Progress value={auditoria.aderencia} className="h-2" />
          {(auditoria.conformes !== undefined ||
            auditoria.parciais !== undefined ||
            auditoria.nao_conformes !== undefined) && (
            <div className="mt-2 flex gap-4 text-xs">
              {auditoria.conformes !== undefined && (
                <span className="text-status-success">
                  ✓ {auditoria.conformes} conformes
                </span>
              )}
              {auditoria.parciais !== undefined && (
                <span className="text-status-warning">
                  ⚠ {auditoria.parciais} parciais
                </span>
              )}
              {auditoria.nao_conformes !== undefined && (
                <span className="text-status-danger">
                  ✗ {auditoria.nao_conformes} não conformes
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Info Grid */}
      <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Building2 className="h-4 w-4" />
          <div className="flex flex-col">
            <span className="text-xs">Unidade</span>
            <span className="font-medium text-card-foreground">
              {auditoria.unidade}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <FileText className="h-4 w-4" />
          <div className="flex flex-col">
            <span className="text-xs">Setor</span>
            <span className="font-medium text-card-foreground">
              {auditoria.setor}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="h-4 w-4" />
          <div className="flex flex-col">
            <span className="text-xs">Auditor</span>
            <span className="font-medium text-card-foreground">
              {auditoria.auditor}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <div className="flex flex-col">
            <span className="text-xs">Data</span>
            <span className="font-medium text-card-foreground">
              {auditoria.data_programada}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 border-t border-border pt-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onViewDetails?.(auditoria.id)}
        >
          Ver Detalhes
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
        {auditoria.status === "em_execucao" && (
          <Button className="flex-1" onClick={() => onContinueExecution?.(auditoria.id)}>
            Continuar Execução
          </Button>
        )}
        {auditoria.status === "planejada" && (
          <Button className="flex-1" onClick={() => onContinueExecution?.(auditoria.id)}>
            Iniciar Auditoria
          </Button>
        )}
      </div>
    </div>
  );
}
