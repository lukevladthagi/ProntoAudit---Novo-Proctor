"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Calendar,
  User,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Flag,
} from "lucide-react";

export interface Achado {
  id: number;
  numero: string;
  titulo: string;
  auditoria_numero: string;
  auditoria_titulo: string;
  requisito_codigo: string;
  requisito_titulo?: string;
  tipo?: string;
  classificacao?: string;
  criticidade: "baixa" | "moderada" | "alta" | "critica";
  status: "aberto" | "em_analise" | "plano_criado" | "em_execucao" | "resolvido" | "verificado";
  descricao: string;
  evidencias?: string;
  impacto?: string;
  setor?: string;
  setor_codigo?: string;
  processo?: string;
  responsavel_analise?: string;
  data_identificacao: string;
}

const criticidadeConfig = {
  baixa: {
    label: "Baixa",
    icon: Flag,
    color: "text-risk-low",
    bgColor: "bg-risk-low/15",
    borderColor: "border-risk-low/30",
  },
  moderada: {
    label: "Moderada",
    icon: Flag,
    color: "text-risk-moderate",
    bgColor: "bg-risk-moderate/15",
    borderColor: "border-risk-moderate/30",
  },
  alta: {
    label: "Alta",
    icon: AlertTriangle,
    color: "text-risk-high",
    bgColor: "bg-risk-high/15",
    borderColor: "border-risk-high/30",
  },
  critica: {
    label: "Crítica",
    icon: AlertTriangle,
    color: "text-risk-critical",
    bgColor: "bg-risk-critical/15",
    borderColor: "border-risk-critical/30",
  },
};

const statusConfig = {
  aberto: {
    label: "Aberto",
    color: "bg-status-danger/15 text-status-danger border-status-danger/30",
  },
  em_analise: {
    label: "Em Análise",
    color: "bg-status-info/15 text-status-info border-status-info/30",
  },
  plano_criado: {
    label: "Plano Criado",
    color: "bg-ona-gestao/15 text-ona-gestao border-ona-gestao/30",
  },
  em_execucao: {
    label: "Em Execução",
    color: "bg-status-warning/15 text-status-warning border-status-warning/30",
  },
  resolvido: {
    label: "Resolvido",
    color: "bg-ona-excelencia/15 text-ona-excelencia border-ona-excelencia/30",
  },
  verificado: {
    label: "Verificado",
    color: "bg-status-success/15 text-status-success border-status-success/30",
  },
};

interface AchadoCardProps {
  achado: Achado;
  onViewDetails?: (id: number) => void;
  onCreateActionPlan?: (id: number) => void;
}

export function AchadoCard({ achado, onViewDetails, onCreateActionPlan }: AchadoCardProps) {
  const criticidade = criticidadeConfig[achado.criticidade];
  const CriticidadeIcon = criticidade.icon;

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md",
        criticidade.borderColor
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-semibold text-primary">
              {achado.numero}
            </span>
            <Badge
              variant="outline"
              className={cn("text-xs", criticidade.bgColor, criticidade.color, criticidade.borderColor)}
            >
              <CriticidadeIcon className="mr-1 h-3 w-3" />
              {criticidade.label}
            </Badge>
            <Badge variant="outline" className={cn("text-xs", statusConfig[achado.status].color)}>
              {statusConfig[achado.status].label}
            </Badge>
          </div>
          <h3 className="font-outfit text-lg font-semibold text-card-foreground">
            {achado.titulo}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {achado.descricao}
          </p>
        </div>
      </div>

      {/* Reference Info */}
      <div className="mb-4 rounded-lg bg-muted/50 p-3">
        <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <div>
            <span className="text-xs text-muted-foreground">Auditoria</span>
            <p className="font-medium text-card-foreground">{achado.auditoria_numero}</p>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {achado.auditoria_titulo}
            </p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Requisito</span>
            <p className="font-medium text-card-foreground">{achado.requisito_codigo}</p>
            {achado.requisito_titulo && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {achado.requisito_titulo}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <div className="flex flex-col">
            <span className="text-xs">Identificado em</span>
            <span className="font-medium text-card-foreground">
              {new Date(achado.data_identificacao).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>
        {achado.setor && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Flag className="h-4 w-4" />
            <div className="flex flex-col">
              <span className="text-xs">Setor</span>
              <span className="font-medium text-card-foreground">{achado.setor}</span>
            </div>
          </div>
        )}
        {achado.responsavel_analise && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <div className="flex flex-col">
              <span className="text-xs">Responsável</span>
              <span className="font-medium text-card-foreground">{achado.responsavel_analise}</span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 border-t border-border pt-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onViewDetails?.(achado.id)}
        >
          Ver Detalhes
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
        {achado.status === "aberto" && (
          <Button
            className="flex-1"
            onClick={() => onCreateActionPlan?.(achado.id)}
          >
            Criar Plano de Ação
          </Button>
        )}
        {achado.status !== "aberto" && achado.status !== "em_analise" && (
          <Button variant="outline" className="flex-1">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Ver Plano de Ação
          </Button>
        )}
      </div>
    </div>
  );
}
