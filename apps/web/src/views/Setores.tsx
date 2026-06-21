"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useSetores, Setor } from "@/hooks/useSetores";
import { SetorForm } from "@/components/cadastros/SetorForm";
import {
  Plus,
  FolderTree,
  Building2,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SetoresPage() {
  const { setores, loading, createSetor, updateSetor, deleteSetor } = useSetores();
  const [showForm, setShowForm] = useState(false);
  const [editingSetor, setEditingSetor] = useState<Setor | undefined>();

  const handleCreate = () => {
    setEditingSetor(undefined);
    setShowForm(true);
  };

  const handleEdit = (setor: Setor) => {
    setEditingSetor(setor);
    setShowForm(true);
  };

  const handleSubmit = async (data: Partial<Setor>) => {
    if (editingSetor) {
      await updateSetor(editingSetor.id, data);
    } else {
      await createSetor(data);
    }
    setShowForm(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este setor?")) {
      await deleteSetor(id);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="h-10 w-64 animate-pulse rounded bg-muted"></div>
          <div className="h-96 animate-pulse rounded-xl bg-muted"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-outfit text-3xl font-bold text-foreground">Setores</h1>
            <p className="mt-1 text-muted-foreground">
              Gerenciamento de setores e departamentos
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Setor
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-5">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <FolderTree className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Setores</p>
                <p className="font-outfit text-2xl font-bold text-card-foreground">
                  {setores.length}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-status-success/10 p-3">
                <CheckCircle2 className="h-5 w-5 text-status-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ativos</p>
                <p className="font-outfit text-2xl font-bold text-card-foreground">
                  {setores.filter((s) => s.ativo).length}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted p-3">
                <XCircle className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inativos</p>
                <p className="font-outfit text-2xl font-bold text-card-foreground">
                  {setores.filter((s) => !s.ativo).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                    Setor
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                    Código
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                    Unidade
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-card-foreground">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {setores.map((setor) => (
                  <tr key={setor.id} className="hover:bg-muted/20">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <FolderTree className="h-4 w-4 text-primary" />
                        </div>
                        <p className="font-medium text-card-foreground">{setor.nome}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
                        {setor.codigo}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-3 w-3" />
                        {setor.unidade_nome || `Unidade ${setor.unidade_id}`}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-card-foreground">{setor.tipo}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                          setor.ativo
                            ? "bg-status-success/10 text-status-success"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {setor.ativo ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            Ativo
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            Inativo
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(setor)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(setor.id)}
                        >
                          <Trash2 className="h-4 w-4 text-status-danger" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showForm && (
        <SetorForm
          setor={editingSetor}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </MainLayout>
  );
}
