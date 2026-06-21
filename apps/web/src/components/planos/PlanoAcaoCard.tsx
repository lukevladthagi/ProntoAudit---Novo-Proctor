"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Calendar,
  User,
  Flag,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

export interface PlanoAcao {
  id: number;
  numero: string;
  titulo: string;
  achado_numero: string;
  achado_titulo: string;
  what_o_que: string;
  why_por_que: string;
  where_onde?: string;
  when_quando: string;
  who_quem: string;
  how_como: string;
  how_much_quanto?: string;
  status: "pendente" | "em_andamento" | "concluido" | "atrasado" | "verificado";
  progresso: number;
  data_inicio?: string;
  data_conclusao?: string;
  responsavel_execucao: string;
  responsavel_verificacao?: string;
}

const statusConfig = {
  pendente: {
    label: "Pendente",
    color: "bg-muted/50 text-muted-foreground border-border",
    icon: Clock,
  },
  em_andamento: {
    label: "Em Andamento",
    color: "bg-status-info/15 text-status-info border-status-info/30",
    icon: TrendingUp,
  },
  concluido: {
    label: "Concluído",
    color: "bg-ona-excelencia/15 text-ona-excelencia border-ona-excelencia/30",
    icon: CheckCircle2,
  },
  atrasado: {
    label: "Atrasado",
    color: "bg-status-danger/15 text-status-danger border-status-danger/30",
    icon: AlertTriangle,
  },
  verificado: {
    label: "Verificado",
    color: "bg-status-success/15 text-status-success border-status-success/30",
    icon: CheckCircle2,
  },
};

interface PlanoAcaoCardProps {
  plano: PlanoAcao;
  onViewDetails?: (id: number) => void;
  onUpdateProgress?: (id: number) => void;
  onComplete?: (id: number) => void;
}

export function PlanoAcaoCard({
  plano,
  onViewDetails,
  onUpdateProgress,
  onComplete,
}: PlanoAcaoCardProps) {
  const statusInfo = statusConfig[plano.status];
  const StatusIcon = statusInfo.icon;

  const prazoDate = plano.when_quando ? new Date(plano.when_quando) : null;
  const isOverdue = plano.status === "atrasado";
  const diasParaVencimento = prazoDate ? Math.ceil((prazoDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;
  const isUrgent = diasParaVencimento !== null && diasParaVencimento <= 7 && diasParaVencimento > 0;

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md",
        isOverdue && "border-status-danger/30"
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-semibold text-primary">
              {plano.numero}
            </span>
            <Badge variant="outline" className={cn("text-xs", statusInfo.color)}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {statusInfo.label}
            </Badge>
            {isUrgent && !isOverdue && diasParaVencimento !== null && (
              <Badge
                variant="outline"
                className="text-xs bg-status-warning/15 text-status-warning border-status-warning/30"
              >
                <Clock className="mr-1 h-3 w-3" />
                Vence em {diasParaVencimento} dias
              </Badge>
            )}
          </div>
          <h3 className="font-outfit text-lg font-semibold text-card-foreground">
            {plano.titulo}
          </h3>
        </div>
      </div>

      {/* Achado Reference */}
      <div className="mb-4 rounded-lg bg-status-danger/5 border border-status-danger/20 p-3">
        <div className="flex items-start gap-2">
          <Flag className="mt-0.5 h-4 w-4 text-status-danger" />
          <div className="flex-1">
            <span className="text-xs font-medium text-status-danger">Achado Relacionado</span>
            <p className="mt-0.5 font-mono text-sm font-semibold text-card-foreground">
              {plano.achado_numero}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {plano.achado_titulo}
            </p>
          </div>
        </div>
      </div>

      {/* 5W2H Summary */}
      <div className="mb-4 space-y-2">
        <div>
          <span className="text-xs font-medium text-muted-foreground">O Que:</span>
          <p className="text-sm text-card-foreground line-clamp-2">{plano.what_o_que}</p>
        </div>
        <div>
          <span className="text-xs font-medium text-muted-foreground">Como:</span>
          <p className="text-sm text-card-foreground line-clamp-2">{plano.how_como}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-card-foreground">Progresso</span>
          <span className="font-outfit text-sm font-bold text-primary">{plano.progresso}%</span>
        </div>
        <Progress value={plano.progresso} className="h-2" />
      </div>

      {/* Info Grid */}
      <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="h-4 w-4" />
          <div className="flex flex-col">
            <span className="text-xs">Responsável</span>
            <span className="font-medium text-card-foreground">{plano.responsavel_execucao}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <div className="flex flex-col">
            <span className="text-xs">Prazo</span>
            <span
              className={cn(
                "font-medium",
                isOverdue ? "text-status-danger" : "text-card-foreground"
              )}
            >
              {prazoDate ? new Date(plano.when_quando).toLocaleDateString('pt-BR') : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 border-t border-border pt-4">
        {plano.status !== "verificado" && plano.status !== "concluido" && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onUpdateProgress?.(plano.id)}
          >
            Atualizar Progresso
          </Button>
        )}
        {(plano.status === "em_andamento" || plano.status === "atrasado") && (
          <Button className="flex-1" onClick={() => onComplete?.(plano.id)}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Concluir
          </Button>
        )}
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onViewDetails?.(plano.id)}
        >
          Ver Detalhes
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
