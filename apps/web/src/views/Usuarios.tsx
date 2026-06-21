"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useUsuarios, Usuario } from "@/hooks/useUsuarios";
import { UsuarioForm } from "@/components/cadastros/UsuarioForm";
import {
  Plus,
  Users,
  Mail,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const perfilLabels: Record<string, string> = {
  admin: "Administrador",
  auditor: "Auditor",
  gestor: "Gestor de Setor",
  qualidade: "Qualidade",
  diretoria: "Diretoria",
};

export default function UsuariosPage() {
  const { usuarios, loading, createUsuario, updateUsuario, deleteUsuario } =
    useUsuarios();
  const [showForm, setShowForm] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | undefined>();

  const handleCreate = () => {
    setEditingUsuario(undefined);
    setShowForm(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setShowForm(true);
  };

  const handleSubmit = async (data: Partial<Usuario>) => {
    if (editingUsuario) {
      await updateUsuario(editingUsuario.id, data);
    } else {
      await createUsuario(data);
    }
    setShowForm(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      await deleteUsuario(id);
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
              Usuários do Sistema
            </h1>
            <p className="mt-1 text-muted-foreground">
              Gerenciamento de usuários e perfis de acesso
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Usuário
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-5">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Usuários</p>
                <p className="font-outfit text-2xl font-bold text-card-foreground">
                  {usuarios.length}
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
                  {usuarios.filter((u) => u.ativo).length}
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
                  {usuarios.filter((u) => !u.ativo).length}
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
                    Usuário
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                    E-mail
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                    Perfil
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
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-muted/20">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Users className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">
                            {usuario.nome}
                          </p>
                          {usuario.ultimo_acesso && (
                            <p className="text-xs text-muted-foreground">
                              Último acesso:{" "}
                              {new Date(usuario.ultimo_acesso).toLocaleDateString(
                                "pt-BR"
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {usuario.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Shield className="h-3 w-3 text-primary" />
                        <span className="text-sm text-card-foreground">
                          {perfilLabels[usuario.perfil] || usuario.perfil}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                          usuario.ativo
                            ? "bg-status-success/10 text-status-success"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {usuario.ativo ? (
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
                          onClick={() => handleEdit(usuario)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(usuario.id)}
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
        <UsuarioForm
          usuario={editingUsuario}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </MainLayout>
  );
}
