"use client";

import { Verificacao } from "@/hooks/useVerificacoes";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  User,
  FileText,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificacaoCardProps {
  verificacao: Verificacao;
}

export function VerificacaoCard({ verificacao }: VerificacaoCardProps) {
  const getResultadoColor = () => {
    if (verificacao.eficaz === true) return "text-status-success";
    if (verificacao.eficaz === false) return "text-status-danger";
    return "text-status-warning";
  };

  const getResultadoBg = () => {
    if (verificacao.eficaz === true) return "bg-status-success/10 border-status-success/20";
    if (verificacao.eficaz === false) return "bg-status-danger/10 border-status-danger/20";
    return "bg-status-warning/10 border-status-warning/20";
  };

  const getResultadoIcon = () => {
    if (verificacao.eficaz === true) return <CheckCircle2 className="h-5 w-5" />;
    if (verificacao.eficaz === false) return <XCircle className="h-5 w-5" />;
    return <AlertTriangle className="h-5 w-5" />;
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-lg border",
                getResultadoBg(),
                getResultadoColor()
              )}
            >
              {getResultadoIcon()}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium text-muted-foreground">
                      {verificacao.numero_plano}
                    </span>
                    {verificacao.requer_nova_acao && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-status-warning/10 px-2 py-0.5 text-xs font-medium text-status-warning">
                        <AlertTriangle className="h-3 w-3" />
                        Nova ação necessária
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1 font-outfit text-lg font-semibold text-foreground">
                    {verificacao.titulo_plano}
                  </h3>
                </div>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-sm font-medium",
                    getResultadoBg(),
                    getResultadoColor()
                  )}
                >
                  {verificacao.resultado}
                </span>
              </div>

              {/* Info Grid */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Data:</span>
                  <span className="font-medium text-foreground">
                    {verificacao.data_verificacao}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Verificador:</span>
                  <span className="font-medium text-foreground">
                    {verificacao.verificador}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Método:</span>
                  <span className="font-medium text-foreground">
                    {verificacao.metodo_verificacao}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Achado:</span>
                  <span className="font-medium text-foreground">
                    {verificacao.numero_achado}
                  </span>
                </div>
              </div>

              {/* Evidências */}
              {verificacao.evidencias && (
                <div className="mt-4 rounded-lg bg-muted/50 p-3">
                  <p className="text-sm font-medium text-foreground">Evidências:</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {verificacao.evidencias}
                  </p>
                </div>
              )}

              {/* Observações */}
              {verificacao.observacoes && (
                <div className="mt-3 rounded-lg bg-muted/50 p-3">
                  <p className="text-sm font-medium text-foreground">Observações:</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {verificacao.observacoes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-end gap-2 border-t border-border pt-4">
        <Button variant="outline" size="sm" className="gap-2">
          <ExternalLink className="h-4 w-4" />
          Ver Plano de Ação
        </Button>
        <Button variant="outline" size="sm">
          Editar Verificação
        </Button>
        {verificacao.requer_nova_acao && (
          <Button size="sm" className="gap-2 bg-status-warning hover:bg-status-warning/90">
            <AlertTriangle className="h-4 w-4" />
            Criar Nova Ação
          </Button>
        )}
      </div>
    </div>
  );
}
