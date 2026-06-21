import { useEffect, useState } from "react";

export interface Achado {
  id: number;
  numero: string;
  titulo: string;
  descricao: string;
  tipo?: string;
  classificacao?: string;
  criticidade: "baixa" | "moderada" | "alta" | "critica";
  status: "aberto" | "em_analise" | "plano_criado" | "em_execucao" | "resolvido" | "verificado";
  data_identificacao: string;
  evidencias?: string;
  impacto?: string;
  setor?: string;
  setor_codigo?: string;
  processo?: string;
  auditoria_numero: string;
  auditoria_titulo: string;
  requisito_codigo: string;
  requisito_titulo?: string;
  responsavel_analise?: string;
}

export function useAchados() {
  const [achados, setAchados] = useState<Achado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/achados")
      .then((res) => res.json())
      .then((data) => {
        setAchados(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { achados, loading, error };
}
