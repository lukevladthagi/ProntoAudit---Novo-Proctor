"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface IndicadorCardProps {
  titulo: string;
  valor: string | number;
  subtitulo?: string;
  variacao?: number;
  icon: LucideIcon;
  color?: "primary" | "success" | "warning" | "danger" | "info";
}

const colorClasses = {
  primary: {
    icon: "bg-primary/10 text-primary",
    text: "text-primary",
  },
  success: {
    icon: "bg-status-success/10 text-status-success",
    text: "text-status-success",
  },
  warning: {
    icon: "bg-status-warning/10 text-status-warning",
    text: "text-status-warning",
  },
  danger: {
    icon: "bg-status-danger/10 text-status-danger",
    text: "text-status-danger",
  },
  info: {
    icon: "bg-status-info/10 text-status-info",
    text: "text-status-info",
  },
};

export function IndicadorCard({
  titulo,
  valor,
  subtitulo,
  variacao,
  icon: Icon,
  color = "primary",
}: IndicadorCardProps) {
  const classes = colorClasses[color];

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{titulo}</p>
          <p className={cn("mt-2 font-outfit text-3xl font-bold", classes.text)}>
            {valor}
          </p>
          {subtitulo && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitulo}</p>
          )}
          {variacao !== undefined && (
            <p
              className={cn(
                "mt-2 text-xs font-medium",
                variacao >= 0 ? "text-status-success" : "text-status-danger"
              )}
            >
              {variacao >= 0 ? "+" : ""}
              {variacao}% vs período anterior
            </p>
          )}
        </div>
        <div className={cn("rounded-lg p-3", classes.icon)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
