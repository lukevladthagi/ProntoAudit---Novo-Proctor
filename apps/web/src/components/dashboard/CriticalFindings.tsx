"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertTriangle, Clock, ArrowRight } from "lucide-react";

interface Finding {
  id: number;
  descricao: string;
  setor: string;
  dimensao: 1 | 2 | 3;
  risco: "baixo" | "moderado" | "alto" | "critico";
  prazo: string;
  diasRestantes: number;
  status: "aberto" | "em_tratativa" | "aguardando_evidencia" | "em_validacao";
}

const riskConfig = {
  baixo: { label: "Baixo", className: "bg-risk-low/15 text-risk-low border-risk-low/30" },
  moderado: { label: "Moderado", className: "bg-risk-moderate/15 text-risk-moderate border-risk-moderate/30" },
  alto: { label: "Alto", className: "bg-risk-high/15 text-risk-high border-risk-high/30" },
  critico: { label: "Crítico", className: "bg-risk-critical/15 text-risk-critical border-risk-critical/30" },
};

const dimensionLabels = {
  1: "D1 - Segurança",
  2: "D2 - Gestão",
  3: "D3 - Excelência",
};

const mockFindings: Finding[] = [
  {
    id: 1,
    descricao: "Identificação do paciente ausente em 15% dos leitos da UTI",
    setor: "UTI Adulto",
    dimensao: 1,
    risco: "critico",
    prazo: "20/01/2024",
    diasRestantes: 2,
    status: "em_tratativa",
  },
  {
    id: 2,
    descricao: "Protocolo de cirurgia segura não seguido integralmente",
    setor: "Centro Cirúrgico",
    dimensao: 1,
    risco: "critico",
    prazo: "22/01/2024",
    diasRestantes: 4,
    status: "aberto",
  },
  {
    id: 3,
    descricao: "Medicamentos de alta vigilância sem dupla checagem",
    setor: "Farmácia",
    dimensao: 1,
    risco: "alto",
    prazo: "25/01/2024",
    diasRestantes: 7,
    status: "em_tratativa",
  },
  {
    id: 4,
    descricao: "POPs desatualizados na unidade de internação",
    setor: "Internação",
    dimensao: 2,
    risco: "alto",
    prazo: "28/01/2024",
    diasRestantes: 10,
    status: "aguardando_evidencia",
  },
  {
    id: 5,
    descricao: "Indicadores de qualidade sem análise crítica mensal",
    setor: "Qualidade",
    dimensao: 3,
    risco: "moderado",
    prazo: "30/01/2024",
    diasRestantes: 12,
    status: "em_validacao",
  },
];

export function CriticalFindings() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div>
          <h3 className="font-outfit text-lg font-semibold text-card-foreground">
            Achados Prioritários
          </h3>
          <p className="text-sm text-muted-foreground">
            Não conformidades que requerem atenção imediata
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-status-danger/10">
          <AlertTriangle className="h-5 w-5 text-status-danger" />
        </div>
      </div>
      <div className="divide-y divide-border">
        {mockFindings.map((finding) => (
          <div
            key={finding.id}
            className="p-4 transition-colors hover:bg-muted/30"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-medium",
                      riskConfig[finding.risco].className
                    )}
                  >
                    {riskConfig[finding.risco].label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {dimensionLabels[finding.dimensao]}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {finding.setor}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-card-foreground">
                  {finding.descricao}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <Clock
                  className={cn(
                    "h-4 w-4",
                    finding.diasRestantes <= 3
                      ? "text-status-danger"
                      : finding.diasRestantes <= 7
                      ? "text-status-warning"
                      : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "font-medium",
                    finding.diasRestantes <= 3
                      ? "text-status-danger"
                      : finding.diasRestantes <= 7
                      ? "text-status-warning"
                      : "text-muted-foreground"
                  )}
                >
                  {finding.diasRestantes}d
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border p-3 text-center">
        <button className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          Ver todos os achados
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
