import { useState, useEffect } from "react";

export interface Verificacao {
  id: number;
  numero_plano: string;
  titulo_plano: string;
  numero_achado: string;
  data_verificacao: string;
  verificador: string;
  metodo_verificacao: string;
  resultado: string;
  eficaz: boolean | null;
  evidencias: string | null;
  observacoes: string | null;
  requer_nova_acao: boolean;
  novo_plano_id: number | null;
}

export function useVerificacoes() {
  const [verificacoes, setVerificacoes] = useState<Verificacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVerificacoes() {
      try {
        const response = await fetch("/api/verificacoes");
        if (response.ok) {
          const data = await response.json();
          setVerificacoes(data);
        }
      } catch (error) {
        console.error("Erro ao carregar verificações:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVerificacoes();
  }, []);

  return { verificacoes, loading };
}
