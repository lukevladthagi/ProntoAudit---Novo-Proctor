import { useEffect, useState } from "react";

export interface PlanoAcao {
  id: number;
  numero: string;
  titulo: string;
  what_o_que: string;
  why_por_que: string;
  where_onde?: string;
  when_quando: string;
  who_quem: string;
  how_como: string;
  how_much_quanto?: string;
  status: "pendente" | "em_andamento" | "concluido" | "atrasado" | "verificado";
  progresso: number;
  data_inicio?: string;
  data_conclusao?: string;
  responsavel_execucao: string;
  responsavel_verificacao?: string;
  achado_numero: string;
  achado_titulo: string;
}

export function usePlanosAcao() {
  const [planos, setPlanos] = useState<PlanoAcao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/planos-acao")
      .then((res) => res.json())
      .then((data) => {
        setPlanos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { planos, loading, error };
}
