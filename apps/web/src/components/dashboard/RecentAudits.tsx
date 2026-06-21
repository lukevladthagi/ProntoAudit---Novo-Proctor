"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Calendar, User, Building2 } from "lucide-react";

interface Audit {
  id: number;
  numero: string;
  titulo: string;
  unidade: string;
  setor: string;
  auditor: string;
  data: string;
  status: "planejada" | "em_execucao" | "em_revisao" | "concluida" | "cancelada";
  aderencia?: number;
}

const statusConfig = {
  planejada: { label: "Planejada", className: "bg-status-info/15 text-status-info border-status-info/30" },
  em_execucao: { label: "Em Execução", className: "bg-status-warning/15 text-status-warning border-status-warning/30" },
  em_revisao: { label: "Em Revisão", className: "bg-ona-gestao/15 text-ona-gestao border-ona-gestao/30" },
  concluida: { label: "Concluída", className: "bg-status-success/15 text-status-success border-status-success/30" },
  cancelada: { label: "Cancelada", className: "bg-muted text-muted-foreground border-border" },
};

const mockAudits: Audit[] = [
  {
    id: 1,
    numero: "AUD-2024-001",
    titulo: "Auditoria de Segurança do Paciente - UTI",
    unidade: "Hospital Central",
    setor: "UTI Adulto",
    auditor: "Dr. Carlos Silva",
    data: "15/01/2024",
    status: "concluida",
    aderencia: 87,
  },
  {
    id: 2,
    numero: "AUD-2024-002",
    titulo: "Auditoria Centro Cirúrgico",
    unidade: "Hospital Central",
    setor: "Centro Cirúrgico",
    auditor: "Dra. Ana Costa",
    data: "18/01/2024",
    status: "em_execucao",
    aderencia: 72,
  },
  {
    id: 3,
    numero: "AUD-2024-003",
    titulo: "Auditoria de Farmácia Hospitalar",
    unidade: "Hospital Central",
    setor: "Farmácia",
    auditor: "Dr. Carlos Silva",
    data: "22/01/2024",
    status: "planejada",
  },
  {
    id: 4,
    numero: "AUD-2024-004",
    titulo: "Auditoria de Prontuário Médico",
    unidade: "Ambulatório Norte",
    setor: "Arquivo Médico",
    auditor: "Enf. Maria Santos",
    data: "25/01/2024",
    status: "em_revisao",
    aderencia: 91,
  },
  {
    id: 5,
    numero: "AUD-2024-005",
    titulo: "Auditoria de CME",
    unidade: "Hospital Central",
    setor: "CME",
    auditor: "Dra. Ana Costa",
    data: "28/01/2024",
    status: "planejada",
  },
];

export function RecentAudits() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border p-4">
        <h3 className="font-outfit text-lg font-semibold text-card-foreground">
          Auditorias Recentes
        </h3>
        <p className="text-sm text-muted-foreground">
          Últimas auditorias planejadas e executadas
        </p>
      </div>
      <div className="divide-y divide-border">
        {mockAudits.map((audit) => (
          <div
            key={audit.id}
            className="flex items-center justify-between p-4 transition-colors hover:bg-muted/30"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground">
                  {audit.numero}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs font-medium",
                    statusConfig[audit.status].className
                  )}
                >
                  {statusConfig[audit.status].label}
                </Badge>
              </div>
              <h4 className="mt-1 font-medium text-card-foreground">
                {audit.titulo}
              </h4>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" />
                  {audit.setor}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  {audit.auditor}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {audit.data}
                </span>
              </div>
            </div>
            {audit.aderencia !== undefined && (
              <div className="ml-4 text-right">
                <span
                  className={cn(
                    "font-outfit text-2xl font-bold",
                    audit.aderencia >= 80
                      ? "text-status-success"
                      : audit.aderencia >= 60
                      ? "text-status-warning"
                      : "text-status-danger"
                  )}
                >
                  {audit.aderencia}%
                </span>
                <p className="text-xs text-muted-foreground">aderência</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="border-t border-border p-3 text-center">
        <button className="text-sm font-medium text-primary hover:underline">
          Ver todas as auditorias →
        </button>
      </div>
    </div>
  );
}
