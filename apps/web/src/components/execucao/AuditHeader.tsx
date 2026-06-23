"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  User,
  Building2,
  FileText,
  Save,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface AuditHeaderProps {
  numero: string;
  titulo: string;
  tipo: string;
  unidade: string;
  setor: string;
  auditor: string;
  data: string;
  progresso: number;
  conformes: number;
  parciais: number;
  nao_conformes: number;
  nao_avaliados: number;
  total: number;
  tempo_decorrido?: string;
  isSaving?: boolean;
  onSave?: () => void;
  onFinalize?: () => void;
}

export function AuditHeader({
  numero,
  titulo,
  tipo,
  unidade,
  setor,
  auditor,
  data,
  progresso,
  conformes,
  parciais,
  nao_conformes,
  nao_avaliados,
  total,
  tempo_decorrido,
  isSaving = false,
  onSave,
  onFinalize,
}: AuditHeaderProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      {/* Top Section */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-semibold text-primary">
              {numero}
            </span>
            <Badge
              variant="outline"
              className="bg-status-warning/15 text-status-warning border-status-warning/30"
            >
              Em Execução
            </Badge>
            {tempo_decorrido && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {tempo_decorrido}
              </div>
            )}
          </div>
          <h2 className="font-outfit text-2xl font-bold text-card-foreground">
            {titulo}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{tipo}</p>
        </div>
        <div className="ml-4 flex gap-2">
          <Button variant="outline" onClick={onSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Salvando..." : "Salvar Progresso"}
          </Button>
          <Button onClick={onFinalize} disabled={nao_avaliados > 0}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Finalizar Auditoria
          </Button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="mb-4 grid grid-cols-4 gap-4 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Building2 className="h-4 w-4" />
          <div className="flex flex-col">
            <span className="text-xs">Unidade</span>
            <span className="font-medium text-card-foreground">{unidade}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <FileText className="h-4 w-4" />
          <div className="flex flex-col">
            <span className="text-xs">Setor</span>
            <span className="font-medium text-card-foreground">{setor}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="h-4 w-4" />
          <div className="flex flex-col">
            <span className="text-xs">Auditor</span>
            <span className="font-medium text-card-foreground">{auditor}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <div className="flex flex-col">
            <span className="text-xs">Data</span>
            <span className="font-medium text-card-foreground">{data}</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-card-foreground">
            Progresso da Auditoria
          </span>
          <span className="font-outfit text-lg font-bold text-primary">
            {progresso}%
          </span>
        </div>
        <Progress value={progresso} className="mb-3 h-3" />
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-status-success"></div>
            <span className="text-muted-foreground">
              Conformes: <span className="font-semibold text-status-success">{conformes}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-status-warning"></div>
            <span className="text-muted-foreground">
              Parciais: <span className="font-semibold text-status-warning">{parciais}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-status-danger"></div>
            <span className="text-muted-foreground">
              Não Conformes:{" "}
              <span className="font-semibold text-status-danger">{nao_conformes}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-muted"></div>
            <span className="text-muted-foreground">
              Não Avaliados: <span className="font-semibold">{nao_avaliados}</span>
            </span>
          </div>
          <div className="ml-auto font-medium text-card-foreground">
            Total: {total} requisitos
          </div>
        </div>
      </div>
    </div>
  );
}
