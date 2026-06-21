'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  GitBranch,
  User,
  Edit,
  Trash2,
  CheckCircle2,
  X,
  Save,
  FolderTree,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Processo {
  id: number;
  nome: string;
  descricao: string | null;
  setor_id: number | null;
  responsavel_id: number | null;
  setor_nome: string | null;
  responsavel_nome: string | null;
  ativo: number;
}

interface Setor {
  id: number;
  nome: string;
  unidade_nome: string;
}

interface Usuario {
  id: number;
  nome: string;
  perfil: string;
}

// ─── Form ─────────────────────────────────────────────────────────────────────

function ProcessoForm({
  initial,
  onSubmit,
  onCancel,
  loading,
}: {
  initial: Partial<Processo>;
  onSubmit: (d: Partial<Processo>) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [form, setForm] = useState(initial);
  const set = (k: keyof Processo, v: string | number | null) => setForm((f) => ({ ...f, [k]: v }));

  const { data: setores = [] } = useQuery<Setor[]>({
    queryKey: ['setores'],
    queryFn: async () => {
      const res = await fetch('/api/setores');
      if (!res.ok) throw new Error('Erro ao carregar setores');
      return res.json();
    },
  });

  const { data: usuarios = [] } = useQuery<Usuario[]>({
    queryKey: ['usuarios'],
    queryFn: async () => {
      const res = await fetch('/api/usuarios');
      if (!res.ok) throw new Error('Erro ao carregar usuários');
      return res.json();
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-card border border-border shadow-xl">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-outfit text-lg font-semibold text-card-foreground">
            {initial.id ? 'Editar Processo' : 'Novo Processo'}
          </h2>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 p-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-card-foreground">
              Nome do Processo *
            </label>
            <input
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={form.nome || ''}
              onChange={(e) => set('nome', e.target.value)}
              placeholder="Ex: Gestão de Medicamentos"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-card-foreground">
              Descrição
            </label>
            <textarea
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              value={form.descricao || ''}
              onChange={(e) => set('descricao', e.target.value)}
              placeholder="Descrição do processo"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-card-foreground">Setor</label>
            <select
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={form.setor_id || ''}
              onChange={(e) => set('setor_id', e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">— Nenhum —</option>
              {setores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome} ({s.unidade_nome})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-card-foreground">
              Responsável
            </label>
            <select
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={form.responsavel_id || ''}
              onChange={(e) =>
                set('responsavel_id', e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">— Nenhum —</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-border p-5">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={() => onSubmit(form)} disabled={loading || !form.nome}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ProcessosPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Processo | null>(null);

  const { data: processos = [], isLoading } = useQuery<Processo[]>({
    queryKey: ['processos'],
    queryFn: async () => {
      const res = await fetch('/api/processos');
      if (!res.ok) throw new Error('Erro ao carregar processos');
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Processo>) => {
      const res = await fetch('/api/processos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erro ao criar processo');
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['processos'] });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Processo> }) => {
      const res = await fetch(`/api/processos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erro ao atualizar processo');
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['processos'] });
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/processos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao excluir processo');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['processos'] }),
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="h-10 w-64 rounded bg-muted" />
          <div className="h-96 rounded-xl bg-muted" />
        </div>
      </MainLayout>
    );
  }

  // Group by setor
  const grouped = processos.reduce<Record<string, Processo[]>>((acc, p) => {
    const key = p.setor_nome || 'Sem Setor';
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-outfit text-3xl font-bold text-foreground">Processos</h1>
            <p className="mt-1 text-muted-foreground">
              Gerenciamento de processos assistenciais e administrativos
            </p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Processo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-5">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <GitBranch className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Processos</p>
                <p className="font-outfit text-2xl font-bold text-card-foreground">
                  {processos.length}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent p-3">
                <FolderTree className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Setores Envolvidos</p>
                <p className="font-outfit text-2xl font-bold text-card-foreground">
                  {new Set(processos.filter((p) => p.setor_id).map((p) => p.setor_id)).size}
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
                <p className="text-sm text-muted-foreground">Com Responsável</p>
                <p className="font-outfit text-2xl font-bold text-card-foreground">
                  {processos.filter((p) => p.responsavel_id).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grouped table */}
        {processos.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
            <GitBranch className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 font-outfit text-lg font-semibold text-foreground">
              Nenhum processo cadastrado
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Crie o primeiro processo para organizar as auditorias
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Processo
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([setor, items]) => (
              <div key={setor} className="rounded-xl border border-border bg-card shadow-sm">
                <div className="flex items-center gap-2 border-b border-border px-5 py-3 bg-muted/30">
                  <FolderTree className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-card-foreground">{setor}</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {items.length} processo{items.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                <div className="divide-y divide-border">
                  {items.map((proc) => (
                    <div
                      key={proc.id}
                      className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-muted/20"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <GitBranch className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-card-foreground">{proc.nome}</p>
                          {proc.descricao && (
                            <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
                              {proc.descricao}
                            </p>
                          )}
                          {proc.responsavel_nome && (
                            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                              <User className="h-3 w-3" />
                              <span>{proc.responsavel_nome}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setEditing(proc)}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Excluir processo "${proc.nome}"?`)) {
                              deleteMutation.mutate(proc.id);
                            }
                          }}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-red-100 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <ProcessoForm
          initial={{ nome: '', descricao: '' }}
          onSubmit={(data) => createMutation.mutate(data)}
          onCancel={() => setShowForm(false)}
          loading={createMutation.isPending}
        />
      )}
      {editing && (
        <ProcessoForm
          initial={editing}
          onSubmit={(data) => updateMutation.mutate({ id: editing.id, data })}
          onCancel={() => setEditing(null)}
          loading={updateMutation.isPending}
        />
      )}
    </MainLayout>
  );
}
