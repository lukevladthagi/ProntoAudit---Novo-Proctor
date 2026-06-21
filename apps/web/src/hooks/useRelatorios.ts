import { useEffect, useState } from "react";

export interface RelatorioData {
  indicadores: {
    total_auditorias: number;
    aderencia_geral: number;
    total_achados: number;
    planos_concluidos: number;
    variacao_auditorias?: number;
    variacao_aderencia?: number;
    variacao_achados?: number;
  };
  conformidade_dimensoes: Array<{
    dimensao: string;
    conformes: number;
    parciais: number;
    nao_conformes: number;
  }>;
  tendencia_temporal: Array<{
    periodo: string;
    aderencia: number;
    achados: number;
  }>;
  achados_criticidade: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  planos_status: Array<{
    status: string;
    total: number;
  }>;
}

export function useRelatorios() {
  const [data, setData] = useState<RelatorioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/relatorios")
      .then((res) => res.json())
      .then((responseData) => {
        setData(responseData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
