"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock, AlertCircle, User } from "lucide-react";

interface Action {
  id: number;
  descricao: string;
  responsavel: string;
  setor: string;
  prazo: string;
  diasAtrasados: number;
  prioridade: "baixa" | "media" | "alta" | "urgente";
}

const priorityConfig = {
  baixa: { label: "Baixa", className: "bg-muted text-muted-foreground" },
  media: { label: "Média", className: "bg-status-info/15 text-status-info" },
  alta: { label: "Alta", className: "bg-status-warning/15 text-status-warning" },
  urgente: { label: "Urgente", className: "bg-status-danger/15 text-status-danger" },
};

const mockActions: Action[] = [
  {
    id: 1,
    descricao: "Implementar dupla checagem para medicamentos de alta vigilância",
    responsavel: "Farm. João Oliveira",
    setor: "Farmácia",
    prazo: "10/01/2024",
    diasAtrasados: 8,
    prioridade: "urgente",
  },
  {
    id: 2,
    descricao: "Atualizar POPs do setor de internação",
    responsavel: "Enf. Patricia Lima",
    setor: "Internação",
    prazo: "12/01/2024",
    diasAtrasados: 6,
    prioridade: "alta",
  },
  {
    id: 3,
    descricao: "Capacitar equipe no protocolo de identificação segura",
    responsavel: "Coord. Roberto Santos",
    setor: "UTI Adulto",
    prazo: "15/01/2024",
    diasAtrasados: 3,
    prioridade: "urgente",
  },
];

export function OverdueActions() {
  return (
    <div className="rounded-xl border border-status-danger/30 bg-status-danger/5 shadow-sm">
      <div className="flex items-center gap-3 border-b border-status-danger/20 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-status-danger/10">
          <AlertCircle className="h-5 w-5 text-status-danger" />
        </div>
        <div>
          <h3 className="font-outfit text-lg font-semibold text-card-foreground">
            Ações Vencidas
          </h3>
          <p className="text-sm text-muted-foreground">
            {mockActions.length} ações necessitam atenção imediata
          </p>
        </div>
      </div>
      <div className="divide-y divide-status-danger/10">
        {mockActions.map((action) => (
          <div key={action.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge className={cn("text-xs", priorityConfig[action.prioridade].className)}>
                    {priorityConfig[action.prioridade].label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {action.setor}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-card-foreground">
                  {action.descricao}
                </p>
                <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  {action.responsavel}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1 text-status-danger">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-semibold">
                    {action.diasAtrasados}d atrasada
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Prazo: {action.prazo}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
