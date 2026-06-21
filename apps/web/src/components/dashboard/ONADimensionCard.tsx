"use client";

import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface ONADimensionCardProps {
  dimension: 1 | 2 | 3;
  title: string;
  description: string;
  percentage: number;
  conformes: number;
  parciais: number;
  naoConformes: number;
}

const dimensionStyles = {
  1: {
    gradient: "from-ona-seguranca/20 to-ona-seguranca/5",
    border: "border-ona-seguranca/30",
    progressBg: "bg-ona-seguranca",
    badge: "bg-ona-seguranca text-white",
    label: "Segurança",
  },
  2: {
    gradient: "from-ona-gestao/20 to-ona-gestao/5",
    border: "border-ona-gestao/30",
    progressBg: "bg-ona-gestao",
    badge: "bg-ona-gestao text-white",
    label: "Gestão",
  },
  3: {
    gradient: "from-ona-excelencia/20 to-ona-excelencia/5",
    border: "border-ona-excelencia/30",
    progressBg: "bg-ona-excelencia",
    badge: "bg-ona-excelencia text-white",
    label: "Excelência",
  },
};

export function ONADimensionCard({
  dimension,
  title,
  description,
  percentage,
  conformes,
  parciais,
  naoConformes,
}: ONADimensionCardProps) {
  const styles = dimensionStyles[dimension];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-gradient-to-br p-5 shadow-sm",
        styles.gradient,
        styles.border
      )}
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div
            className={cn(
              "mb-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
              styles.badge
            )}
          >
            Dimensão {dimension} - {styles.label}
          </div>
          <h3 className="font-outfit text-lg font-semibold text-card-foreground">
            {title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="text-right">
          <span className="font-outfit text-3xl font-bold text-card-foreground">
            {percentage}%
          </span>
          <p className="text-xs text-muted-foreground">aderência</p>
        </div>
      </div>

      <div className="mb-3">
        <Progress value={percentage} className="h-2" />
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-white/50 p-2 dark:bg-black/20">
          <span className="text-lg font-semibold text-status-success">
            {conformes}
          </span>
          <p className="text-xs text-muted-foreground">Conformes</p>
        </div>
        <div className="rounded-lg bg-white/50 p-2 dark:bg-black/20">
          <span className="text-lg font-semibold text-status-warning">
            {parciais}
          </span>
          <p className="text-xs text-muted-foreground">Parciais</p>
        </div>
        <div className="rounded-lg bg-white/50 p-2 dark:bg-black/20">
          <span className="text-lg font-semibold text-status-danger">
            {naoConformes}
          </span>
          <p className="text-xs text-muted-foreground">Não Conf.</p>
        </div>
      </div>
    </div>
  );
}
