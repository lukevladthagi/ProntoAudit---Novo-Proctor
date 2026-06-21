"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useUnidades, Unidade } from "@/hooks/useUnidades";
import { UnidadeForm } from "@/components/cadastros/UnidadeForm";
import {
  Plus,
  Building2,
  MapPin,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function UnidadesPage() {
  const { unidades, loading, createUnidade, updateUnidade, deleteUnidade } =
    useUnidades();
  const [showForm, setShowForm] = useState(false);
  const [editingUnidade, setEditingUnidade] = useState<Unidade | undefined>();

  const handleCreate = () => {
    setEditingUnidade(undefined);
    setShowForm(true);
  };

  const handleEdit = (unidade: Unidade) => {
    setEditingUnidade(unidade);
    setShowForm(true);
  };

  const handleSubmit = async (data: Partial<Unidade>) => {
    if (editingUnidade) {
      await updateUnidade(editingUnidade.id, data);
    } else {
      await createUnidade(data);
    }
    setShowForm(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta unidade?")) {
      await deleteUnidade(id);
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
            <h1 className="font-outfit text-3xl font-bold text-foreground">
              Unidades de Saúde
            </h1>
            <p className="mt-1 text-muted-foreground">
              Gerenciamento de unidades e estabelecimentos
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Unidade
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-5">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Unidades</p>
                <p className="font-outfit text-2xl font-bold text-card-foreground">
                  {unidades.length}
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
                <p className="text-sm text-muted-foreground">Ativas</p>
                <p className="font-outfit text-2xl font-bold text-card-foreground">
                  {unidades.filter((u) => u.ativa).length}
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
                <p className="text-sm text-muted-foreground">Inativas</p>
                <p className="font-outfit text-2xl font-bold text-card-foreground">
                  {unidades.filter((u) => !u.ativa).length}
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
                    Unidade
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                    Código
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                    Localização
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
                {unidades.map((unidade) => (
                  <tr key={unidade.id} className="hover:bg-muted/20">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">
                            {unidade.nome}
                          </p>
                          {unidade.endereco && (
                            <p className="text-xs text-muted-foreground">
                              {unidade.endereco}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
                        {unidade.codigo}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {unidade.cidade}, {unidade.estado}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                          unidade.ativa
                            ? "bg-status-success/10 text-status-success"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {unidade.ativa ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            Ativa
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            Inativa
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(unidade)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(unidade.id)}
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
        <UnidadeForm
          unidade={editingUnidade}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </MainLayout>
  );
}
