import { useEffect, useState } from "react";

export interface Setor {
  id: number;
  unidade_id: number;
  unidade_nome?: string;
  nome: string;
  codigo: string;
  tipo: string;
  responsavel_id: number | null;
  responsavel_nome?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export function useSetores() {
  const [setores, setSetores] = useState<Setor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSetores = () => {
    setLoading(true);
    fetch("/api/setores")
      .then((res) => res.json())
      .then((data) => {
        setSetores(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSetores();
  }, []);

  const createSetor = async (data: Partial<Setor>) => {
    const response = await fetch("/api/setores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create setor");
    fetchSetores();
    return response.json();
  };

  const updateSetor = async (id: number, data: Partial<Setor>) => {
    const response = await fetch(`/api/setores/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update setor");
    fetchSetores();
    return response.json();
  };

  const deleteSetor = async (id: number) => {
    const response = await fetch(`/api/setores/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete setor");
    fetchSetores();
  };

  return { setores, loading, error, createSetor, updateSetor, deleteSetor, refetch: fetchSetores };
}
