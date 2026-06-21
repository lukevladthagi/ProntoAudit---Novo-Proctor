import { useEffect, useState } from "react";

export interface Unidade {
  id: number;
  nome: string;
  codigo: string;
  endereco: string;
  cidade: string;
  estado: string;
  responsavel_id: number | null;
  responsavel_nome?: string;
  ativa: boolean;
  created_at: string;
  updated_at: string;
}

export function useUnidades() {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUnidades = () => {
    setLoading(true);
    fetch("/api/unidades")
      .then((res) => res.json())
      .then((data) => {
        setUnidades(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUnidades();
  }, []);

  const createUnidade = async (data: Partial<Unidade>) => {
    const response = await fetch("/api/unidades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create unidade");
    fetchUnidades();
    return response.json();
  };

  const updateUnidade = async (id: number, data: Partial<Unidade>) => {
    const response = await fetch(`/api/unidades/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update unidade");
    fetchUnidades();
    return response.json();
  };

  const deleteUnidade = async (id: number) => {
    const response = await fetch(`/api/unidades/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete unidade");
    fetchUnidades();
  };

  return { unidades, loading, error, createUnidade, updateUnidade, deleteUnidade, refetch: fetchUnidades };
}
