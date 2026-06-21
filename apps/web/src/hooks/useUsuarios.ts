import { useEffect, useState } from "react";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: string;
  ativo: boolean;
  ultimo_acesso: string | null;
  created_at: string;
  updated_at: string;
}

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuarios = () => {
    setLoading(true);
    fetch("/api/usuarios")
      .then((res) => res.json())
      .then((data) => {
        setUsuarios(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const createUsuario = async (data: Partial<Usuario>) => {
    const response = await fetch("/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create usuario");
    fetchUsuarios();
    return response.json();
  };

  const updateUsuario = async (id: number, data: Partial<Usuario>) => {
    const response = await fetch(`/api/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update usuario");
    fetchUsuarios();
    return response.json();
  };

  const deleteUsuario = async (id: number) => {
    const response = await fetch(`/api/usuarios/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete usuario");
    fetchUsuarios();
  };

  return { usuarios, loading, error, createUsuario, updateUsuario, deleteUsuario, refetch: fetchUsuarios };
}
