import { useEffect, useState } from "react";

export interface Auditoria {
  id: number;
  numero: string;
  titulo: string;
  tipo: string;
  status: "planejada" | "em_execucao" | "em_revisao" | "concluida" | "cancelada";
  unidade: string;
  setor: string;
  auditor: string;
  coauditor?: string;
  data_programada: string;
  data_inicio?: string;
  data_fim?: string;
  dimensao_ona: 1 | 2 | 3;
  aderencia?: number;
  conformes?: number;
  parciais?: number;
  nao_conformes?: number;
  achados_criticos?: number;
}

export function useAuditorias() {
  const [auditorias, setAuditorias] = useState<Auditoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auditorias")
      .then((res) => res.json())
      .then((data) => {
        setAuditorias(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { auditorias, loading, error };
}
