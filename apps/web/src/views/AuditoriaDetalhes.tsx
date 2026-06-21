"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "@/lib/router-shim";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Building2,
  Calendar,
  ClipboardCheck,
  FileText,
  PlayCircle,
  User,
} from "lucide-react";

interface AuditoriaDetalhes {
  id: number;
  numero: string;
  titulo: string;
  tipo: string;
  status: string;
  unidade_nome: string | null;
  setor_nome: string | null;
  auditor_nome: string | null;
  coauditor_nome: string | null;
  data_programada: string | null;
  data_inicio: string | null;
  data_fim: string | null;
  checklist_nome: string | null;
  escopo?: string | null;
  objetivo?: string | null;
}

const statusLabels: Record<string, string> = {
  planejada: "Planejada",
  em_execucao: "Em Execução",
  em_revisao: "Em Revisão",
  concluida: "Concluída",
  cancelada: "Cancelada",
};

const tipoLabels: Record<string, string> = {
  interna: "Auditoria Interna",
  acompanhamento: "Acompanhamento",
  tematica: "Temática",
  preparacao_acreditacao: "Preparação Acreditação",
  extraordinaria: "Extraordinária",
};

function formatDate(value: string | null) {
  if (!value) return "Não informado";
  return new Date(value).toLocaleDateString("pt-BR");
}

export default function AuditoriaDetalhesPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [auditoria, setAuditoria] = useState<AuditoriaDetalhes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/auditorias/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Auditoria não encontrada");
        return res.json();
      })
      .then((data) => setAuditoria(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Carregando auditoria...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !auditoria) {
    return (
      <MainLayout>
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">{error || "Auditoria não encontrada"}</p>
          <Button onClick={() => navigate("/auditorias")} className="mt-4">
            Voltar para Auditorias
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Button
        variant="ghost"
        onClick={() => navigate("/auditorias")}
        className="mb-4 -ml-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para Auditorias
      </Button>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="font-mono">
              {auditoria.numero}
            </Badge>
            <Badge variant="outline">
              {statusLabels[auditoria.status] || auditoria.status}
            </Badge>
          </div>
          <h1 className="font-outfit text-3xl font-bold text-foreground">
            {auditoria.titulo}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {tipoLabels[auditoria.tipo] || auditoria.tipo}
          </p>
        </div>

        {auditoria.status !== "concluida" && (
          <Button onClick={() => navigate(`/auditorias/${auditoria.id}/execucao`)}>
            <PlayCircle className="mr-2 h-4 w-4" />
            {auditoria.status === "planejada" ? "Iniciar Auditoria" : "Continuar Execução"}
          </Button>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-4 font-outfit text-lg font-semibold text-card-foreground">
            Informações da auditoria
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoItem icon={Building2} label="Unidade" value={auditoria.unidade_nome} />
            <InfoItem icon={FileText} label="Setor" value={auditoria.setor_nome} />
            <InfoItem icon={User} label="Auditor líder" value={auditoria.auditor_nome} />
            <InfoItem icon={User} label="Auditor técnico" value={auditoria.coauditor_nome} />
            <InfoItem
              icon={Calendar}
              label="Data programada"
              value={formatDate(auditoria.data_programada)}
            />
            <InfoItem
              icon={ClipboardCheck}
              label="Checklist"
              value={auditoria.checklist_nome}
            />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 font-outfit text-lg font-semibold text-card-foreground">
            Execução
          </h2>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Início</p>
              <p className="font-medium text-card-foreground">
                {formatDate(auditoria.data_inicio)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Fim</p>
              <p className="font-medium text-card-foreground">
                {formatDate(auditoria.data_fim)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {(auditoria.objetivo || auditoria.escopo) && (
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {auditoria.objetivo && (
            <TextPanel title="Objetivo" value={auditoria.objetivo} />
          )}
          {auditoria.escopo && <TextPanel title="Escopo" value={auditoria.escopo} />}
        </div>
      )}
    </MainLayout>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-muted/30 p-3">
      <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium text-card-foreground">{value || "Não informado"}</p>
      </div>
    </div>
  );
}

function TextPanel({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="mb-2 font-outfit text-lg font-semibold text-card-foreground">
        {title}
      </h2>
      <p className="text-sm leading-6 text-muted-foreground">{value}</p>
    </div>
  );
}
