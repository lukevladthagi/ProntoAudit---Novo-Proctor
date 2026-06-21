import { useState, useEffect } from "react";

interface Unidade {
  id: number;
  nome: string;
  codigo: string;
}

interface Setor {
  id: number;
  nome: string;
  codigo: string;
  unidade_id: number;
}

interface Usuario {
  id: number;
  nome: string;
  perfil: string;
}

interface Checklist {
  id: number;
  nome: string;
  descricao: string;
  dimensao_ona: number;
}

export function useNovaAuditoria() {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [setores, setSetores] = useState<Setor[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/unidades").then((res) => res.json()),
      fetch("/api/setores").then((res) => res.json()),
      fetch("/api/usuarios").then((res) => res.json()),
      fetch("/api/checklists").then((res) => res.json()),
    ])
      .then(([unidadesData, setoresData, usuariosData, checklistsData]) => {
        setUnidades(unidadesData);
        setSetores(setoresData);
        setUsuarios(usuariosData);
        setChecklists(checklistsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading data:", err);
        setLoading(false);
      });
  }, []);

  const createAuditoria = async (data: {
    titulo: string;
    tipo: string;
    unidade_id: number;
    setor_id: number;
    checklist_id: number;
    auditor_lider_id: number;
    auditor_tecnico_id?: number;
    data_programada: string;
    objetivo: string;
    escopo: string;
  }) => {
    try {
      // Get next audit number
      const auditorias = await fetch("/api/auditorias").then((res) => res.json());
      const currentYear = new Date().getFullYear();
      const auditsThisYear = auditorias.filter((a: any) =>
        a.numero.startsWith(`AUD-${currentYear}`)
      );
      const nextNum = String(auditsThisYear.length + 1).padStart(3, "0");
      const numero = `AUD-${currentYear}-${nextNum}`;

      const response = await fetch("/api/auditorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numero,
          ...data,
          status: "planejada",
        }),
      });

      if (!response.ok) throw new Error("Failed to create auditoria");

      const result = await response.json();
      return { success: true, id: result.id };
    } catch (err) {
      console.error("Error creating auditoria:", err);
      return { success: false, error: err };
    }
  };

  return {
    unidades,
    setores,
    usuarios,
    checklists,
    loading,
    createAuditoria,
  };
}
