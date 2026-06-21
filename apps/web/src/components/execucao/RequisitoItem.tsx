"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  MinusCircle,
  ChevronDown,
  ChevronUp,
  Flag,
} from "lucide-react";
import { PhotoUpload } from "@/components/execucao/PhotoUpload";

export type ConformidadeStatus = "conforme" | "parcial" | "nao_conforme" | "nao_aplicavel" | null;

export interface RequisitoData {
  id: number;
  codigo: string;
  titulo: string;
  descricao: string;
  dimensao_ona: 1 | 2 | 3;
  dimensao_nome?: string | null;
  eixo?: string | null;
  nivel_criticidade: "baixo" | "moderado" | "alto" | "critico";
  conformidade?: ConformidadeStatus;
  observacoes?: string;
  evidencias?: string;
  fotos?: string[];
  tem_achado?: boolean;
}

interface RequisitoItemProps {
  requisito: RequisitoData;
  numero: number;
  auditoriaId: string;
  onChange: (id: number, data: Partial<RequisitoData>) => void;
  onCreateFinding?: (requisitoId: number) => void;
}

const conformidadeOptions = [
  {
    value: "conforme" as const,
    label: "Conforme",
    icon: CheckCircle2,
    color: "text-status-success",
    bgColor: "bg-status-success/10 hover:bg-status-success/20",
    borderColor: "border-status-success",
  },
  {
    value: "parcial" as const,
    label: "Parcial",
    icon: AlertCircle,
    color: "text-status-warning",
    bgColor: "bg-status-warning/10 hover:bg-status-warning/20",
    borderColor: "border-status-warning",
  },
  {
    value: "nao_conforme" as const,
    label: "Não Conforme",
    icon: XCircle,
    color: "text-status-danger",
    bgColor: "bg-status-danger/10 hover:bg-status-danger/20",
    borderColor: "border-status-danger",
  },
  {
    value: "nao_aplicavel" as const,
    label: "N/A",
    icon: MinusCircle,
    color: "text-muted-foreground",
    bgColor: "bg-muted/50 hover:bg-muted",
    borderColor: "border-border",
  },
];

const criticidadeConfig = {
  baixo: { label: "Baixo", color: "bg-risk-low text-white" },
  moderado: { label: "Moderado", color: "bg-risk-moderate text-white" },
  alto: { label: "Alto", color: "bg-risk-high text-white" },
  critico: { label: "Crítico", color: "bg-risk-critical text-white" },
};

const dimensaoLabels = {
  1: "D1",
  2: "D2",
  3: "D3",
};

export function RequisitoItem({
  requisito,
  numero,
  auditoriaId,
  onChange,
  onCreateFinding,
}: RequisitoItemProps) {
  const [expanded, setExpanded] = useState(false);

  const handleConformidadeChange = (status: ConformidadeStatus) => {
    onChange(requisito.id, { conformidade: status });
  };

  const handleObservacoesChange = (observacoes: string) => {
    onChange(requisito.id, { observacoes });
  };

  const handleEvidenciasChange = (evidencias: string) => {
    onChange(requisito.id, { evidencias });
  };

  const handlePhotosChange = (fotos: string[]) => {
    onChange(requisito.id, { fotos });
  };

  const isNaoConforme = requisito.conformidade === "nao_conforme";
  const isParcial = requisito.conformidade === "parcial";

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-4 shadow-sm transition-all",
        requisito.conformidade === "conforme" && "border-status-success/30",
        requisito.conformidade === "parcial" && "border-status-warning/30",
        requisito.conformidade === "nao_conforme" && "border-status-danger/30",
        requisito.conformidade === "nao_aplicavel" && "border-border",
        !requisito.conformidade && "border-border"
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="font-mono text-sm font-semibold text-primary">
              {requisito.codigo}
            </span>
            <Badge
              variant="outline"
              className="text-xs bg-primary/10 text-primary border-primary/30"
            >
              {requisito.dimensao_nome || dimensaoLabels[requisito.dimensao_ona]}
            </Badge>
            {requisito.eixo && (
              <Badge variant="outline" className="text-xs bg-accent text-accent-foreground">
                {requisito.eixo}
              </Badge>
            )}
            <Badge
              variant="outline"
              className={cn("text-xs", criticidadeConfig[requisito.nivel_criticidade].color)}
            >
              {criticidadeConfig[requisito.nivel_criticidade].label}
            </Badge>
            {requisito.tem_achado && (
              <Badge
                variant="outline"
                className="text-xs bg-status-danger/10 text-status-danger border-status-danger/30"
              >
                <Flag className="mr-1 h-3 w-3" />
                Achado
              </Badge>
            )}
          </div>
          <h4 className="font-semibold text-card-foreground">
            {numero}. {requisito.titulo}
          </h4>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="-mr-2"
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Description */}
      {expanded && (
        <p className="mb-3 text-sm text-muted-foreground">{requisito.descricao}</p>
      )}

      {/* Conformidade Options */}
      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {conformidadeOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = requisito.conformidade === option.value;
          return (
            <button
              key={option.value}
              onClick={() => handleConformidadeChange(option.value)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                isSelected
                  ? cn(option.bgColor, option.borderColor, option.color)
                  : "border-border bg-card hover:bg-muted text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Expanded Fields - Show when not conforme or parcial */}
      {expanded && requisito.conformidade && requisito.conformidade !== "nao_aplicavel" && (
        <div className="space-y-3 border-t border-border pt-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-foreground">
              Observações
            </label>
            <Textarea
              placeholder="Descreva os detalhes da avaliação..."
              rows={2}
              value={requisito.observacoes || ""}
              onChange={(e) => handleObservacoesChange(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-foreground">
              Evidências (Texto)
            </label>
            <Input
              type="text"
              placeholder="Ex: Prontuário 12345, Checklist 001"
              value={requisito.evidencias || ""}
              onChange={(e) => handleEvidenciasChange(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-foreground">
              Fotos
            </label>
            <PhotoUpload
              auditoriaId={auditoriaId}
              requisitoId={requisito.id}
              photos={requisito.fotos || []}
              onPhotosChange={handlePhotosChange}
            />
          </div>

          {/* Create Finding Button - Only for non-conformities */}
          {(isNaoConforme || isParcial) && (
            <div className="flex gap-2">
              {!requisito.tem_achado && onCreateFinding && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCreateFinding(requisito.id)}
                  className="border-status-danger/30 text-status-danger hover:bg-status-danger/10"
                >
                  <Flag className="mr-2 h-4 w-4" />
                  Registrar Achado
                </Button>
              )}
              {requisito.tem_achado && (
                <div className="flex items-center gap-2 rounded-lg bg-status-danger/10 px-3 py-2 text-sm text-status-danger">
                  <Flag className="h-4 w-4" />
                  Achado registrado
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
