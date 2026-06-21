import { useEffect, useState } from "react";

export interface RequisitoExecucao {
  id: number;
  codigo: string;
  titulo: string;
  descricao: string;
  dimensao_ona: number;
  dimensao_nome: string | null;
  eixo: string | null;
  nivel_criticidade: string;
  referencia_normativa: string | null;
  ordem: number;
  execucao_id: number | null;
  conformidade: "conforme" | "parcialmente_conforme" | "nao_conforme" | "nao_aplicavel" | null;
  observacoes: string | null;
  evidencias: string | null;
  tem_achado: boolean;
  avaliado_em: string | null;
}

export interface AuditoriaDetalhes {
  id: number;
  numero: string;
  titulo: string;
  tipo: string;
  status: string;
  unidade_nome: string;
  setor_nome: string;
  auditor_nome: string;
  coauditor_nome: string | null;
  data_programada: string;
  data_inicio: string | null;
  data_fim: string | null;
  checklist_nome: string;
}

export function useAuditoriaExecucao(auditoriaId: string) {
  const [auditoria, setAuditoria] = useState<AuditoriaDetalhes | null>(null);
  const [requisitos, setRequisitos] = useState<RequisitoExecucao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/auditorias/${auditoriaId}`).then((res) => res.json()),
      fetch(`/api/auditorias/${auditoriaId}/checklist`).then((res) => res.json()),
    ])
      .then(([auditoriaData, requisitosData]) => {
        setAuditoria(auditoriaData);
        setRequisitos(requisitosData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [auditoriaId]);

  const updateRequisito = async (
    requisitoId: number,
    conformidade: string,
    observacoes?: string,
    evidencias?: string
  ) => {
    try {
      const response = await fetch(`/api/auditorias/${auditoriaId}/execucao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requisito_id: requisitoId,
          conformidade,
          observacoes,
          evidencias,
          tem_achado: false,
        }),
      });

      if (!response.ok) throw new Error("Failed to update requisito");

      // Refresh requisitos
      const updatedRequisitos = await fetch(
        `/api/auditorias/${auditoriaId}/checklist`
      ).then((res) => res.json());
      setRequisitos(updatedRequisitos);

      return true;
    } catch (err) {
      console.error("Error updating requisito:", err);
      return false;
    }
  };

  const finalizarAuditoria = async () => {
    try {
      const response = await fetch(`/api/auditorias/${auditoriaId}/finalizar`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to finalize audit");
      return true;
    } catch (err) {
      console.error("Error finalizing audit:", err);
      return false;
    }
  };

  return {
    auditoria,
    requisitos,
    loading,
    error,
    updateRequisito,
    finalizarAuditoria,
  };
}
