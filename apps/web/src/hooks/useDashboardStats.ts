import { useEffect, useState } from "react";

interface DashboardStats {
  auditorias: {
    total: number;
    concluidas: number;
    em_execucao: number;
  };
  achados: {
    total: number;
    criticos: number;
    altos: number;
  };
  planos: {
    total: number;
    atrasados: number;
  };
  aderencia_geral: number;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { stats, loading, error };
}
