'use client';

import { useRef, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  ClipboardCheck,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  CheckCircle2,
  ListOrdered,
  X,
  Save,
  Shield,
  TrendingUp,
  Upload,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ──────────────────────────────────────────────────────────────────

interface Checklist {
  id: number;
  nome: string;
  descricao: string | null;
  tipo: string;
  dimensao_ona: number;
  versao: string;
  ativo: number;
  total_requisitos: number;
}

interface Requisito {
  id: number;
  checklist_id: number;
  codigo: string;
  titulo: string;
  descricao: string;
  dimensao_ona: number;
  dimensao_nome?: string | null;
  eixo?: string | null;
  nivel_criticidade: string;
  referencia_normativa: string | null;
  ordem: number;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const TIPOS = [
  { value: 'ona_nivel_1', label: 'ONA Nível 1' },
  { value: 'ona_nivel_2', label: 'ONA Nível 2' },
  { value: 'ona_nivel_3', label: 'ONA Nível 3' },
  { value: 'interno', label: 'Interno' },
  { value: 'vigilancia_sanitaria', label: 'Vigilância Sanitária' },
];

const CRITICIDADES = [
  { value: 'critico', label: 'Crítico', color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'alto', label: 'Alto', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { value: 'medio', label: 'Médio', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  {
    value: 'baixo',
    label: 'Baixo',
    color: 'bg-status-success/10 text-status-success border-status-success/20',
  },
];

const DIMENSOES = [
  { value: 1, label: 'Dimensão 1 – Segurança', icon: Shield, color: 'text-ona-seguranca' },
  {
    value: 2,
    label: 'Dimensão 2 – Gestão Integrada',
    icon: ClipboardCheck,
    color: 'text-ona-gestao',
  },
  { value: 3, label: 'Dimensão 3 – Excelência', icon: TrendingUp, color: 'text-ona-excelencia' },
];

// ─── Empty forms ─────────────────────────────────────────────────────────────

const emptyChecklist = (): Partial<Checklist> => ({
  nome: '',
  descricao: '',
  tipo: 'ona_nivel_1',
  dimensao_ona: 1,
  versao: '1.0',
});

const emptyRequisito = (): Partial<Requisito> => ({
  codigo: '',
  titulo: '',
  descricao: '',
  dimensao_ona: 1,
  dimensao_nome: '',
  eixo: '',
  nivel_criticidade: 'critico',
  referencia_normativa: '',
});

// ─── ChecklistForm ───────────────────────────────────────────────────────────

function ChecklistForm({
  initial,
  onSubmit,
  onCancel,
  loading,
}: {
  initial: Partial<Checklist>;
  onSubmit: (d: Partial<Checklist>) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [form, setForm] = useState(initial);
  const set = (k: keyof Checklist, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-card border border-border shadow-xl">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-outfit text-lg font-semibold text-card-foreground">
            {initial.id ? 'Editar Checklist' : 'Novo Checklist'}
          </h2>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 p-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-card-foreground">Nome *</label>
            <input
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={form.nome || ''}
              onChange={(e) => set('nome', e.target.value)}
              placeholder="Ex: Checklist UTI Adulto - Nível 1"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-card-foreground">
              Descrição
            </label>
            <textarea
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              rows={2}
              value={form.descricao || ''}
              onChange={(e) => set('descricao', e.target.value)}
              placeholder="Descrição do checklist"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">
                Tipo *
              </label>
              <select
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={form.tipo || 'ona_nivel_1'}
                onChange={(e) => set('tipo', e.target.value)}
              >
                {TIPOS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">
                Dimensão ONA *
              </label>
              <select
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={form.dimensao_ona || 1}
                onChange={(e) => set('dimensao_ona', Number(e.target.value))}
              >
                {DIMENSOES.map((d) => (
                  <option key={d.value} value={d.value}>{`D${d.value}`}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-card-foreground">Versão</label>
            <input
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={form.versao || '1.0'}
              onChange={(e) => set('versao', e.target.value)}
              placeholder="1.0"
            />
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

// ─── RequisitoForm ───────────────────────────────────────────────────────────

function RequisitoForm({
  initial,
  onSubmit,
  onCancel,
  loading,
}: {
  initial: Partial<Requisito>;
  onSubmit: (d: Partial<Requisito>) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [form, setForm] = useState(initial);
  const set = (k: keyof Requisito, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-card border border-border shadow-xl">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-outfit text-lg font-semibold text-card-foreground">
            {initial.id ? 'Editar Requisito' : 'Novo Requisito'}
          </h2>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 p-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">
                Código *
              </label>
              <input
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={form.codigo || ''}
                onChange={(e) => set('codigo', e.target.value)}
                placeholder="Ex: D1-SEG-001"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">
                Criticidade *
              </label>
              <select
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={form.nivel_criticidade || 'critico'}
                onChange={(e) => set('nivel_criticidade', e.target.value)}
              >
                {CRITICIDADES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-card-foreground">
              Título *
            </label>
            <input
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={form.titulo || ''}
              onChange={(e) => set('titulo', e.target.value)}
              placeholder="Título do requisito"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-card-foreground">
              Descrição *
            </label>
            <textarea
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              value={form.descricao || ''}
              onChange={(e) => set('descricao', e.target.value)}
              placeholder="Descrição detalhada do critério de avaliação"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">
                Dimensão ONA
              </label>
              <select
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={form.dimensao_ona || 1}
                onChange={(e) => set('dimensao_ona', Number(e.target.value))}
              >
                {DIMENSOES.map((d) => (
                  <option key={d.value} value={d.value}>{`D${d.value}`}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">
                Ref. Normativa
              </label>
              <input
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={form.referencia_normativa || ''}
                onChange={(e) => set('referencia_normativa', e.target.value)}
                placeholder="Ex: RDC 36/2013"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">
                Dimensão da visita
              </label>
              <input
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={form.dimensao_nome || ''}
                onChange={(e) => set('dimensao_nome', e.target.value)}
                placeholder="Ex: ASSISTENCIAL"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">
                Eixo
              </label>
              <input
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={form.eixo || ''}
                onChange={(e) => set('eixo', e.target.value)}
                placeholder="Ex: HIGIENIZAÇÃO DE MÃOS"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-border p-5">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            onClick={() => onSubmit(form)}
            disabled={loading || !form.codigo || !form.titulo || !form.descricao}
          >
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── RequisitosList ──────────────────────────────────────────────────────────

function RequisitosList({ checklist }: { checklist: Checklist }) {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partial<Requisito> | null>(null);

  const { data: requisitos = [], isLoading } = useQuery<Requisito[]>({
    queryKey: ['requisitos', checklist.id],
    queryFn: async () => {
      const res = await fetch(`/api/checklists/${checklist.id}/requisitos`);
      if (!res.ok) throw new Error('Erro ao carregar requisitos');
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Requisito>) => {
      const res = await fetch(`/api/checklists/${checklist.id}/requisitos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erro ao criar requisito');
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['requisitos', checklist.id] });
      qc.invalidateQueries({ queryKey: ['checklists'] });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Requisito> }) => {
      const res = await fetch(`/api/checklists/${checklist.id}/requisitos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erro ao atualizar requisito');
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['requisitos', checklist.id] });
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/checklists/${checklist.id}/requisitos/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erro ao deletar requisito');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['requisitos', checklist.id] });
      qc.invalidateQueries({ queryKey: ['checklists'] });
    },
  });

  const criticidadeInfo = (nivel: string) =>
    CRITICIDADES.find((c) => c.value === nivel) || CRITICIDADES[2];

  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 animate-pulse rounded bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="border-t border-border bg-muted/20 px-5 py-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-card-foreground">
          {requisitos.length} requisito{requisitos.length !== 1 ? 's' : ''}
        </span>
        <Button size="sm" variant="outline" onClick={() => setShowForm(true)}>
          <Plus className="mr-1 h-3.5 w-3.5" />
          Novo Requisito
        </Button>
      </div>

      {requisitos.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-8 text-center">
          <ListOrdered className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Nenhum requisito cadastrado</p>
        </div>
      ) : (
        <div className="space-y-2">
          {requisitos.map((req) => {
            const crit = criticidadeInfo(req.nivel_criticidade);
            return (
              <div
                key={req.id}
                className="rounded-lg border border-border bg-card p-3 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-primary">
                        {req.codigo}
                      </span>
                      <Badge variant="outline" className={cn('text-xs py-0', crit.color)}>
                        {crit.label}
                      </Badge>
                      {req.dimensao_nome && (
                        <Badge variant="outline" className="text-xs py-0">
                          {req.dimensao_nome}
                        </Badge>
                      )}
                      {req.eixo && (
                        <Badge variant="outline" className="text-xs py-0 bg-accent text-accent-foreground">
                          {req.eixo}
                        </Badge>
                      )}
                      {req.referencia_normativa && (
                        <span className="text-xs text-muted-foreground">
                          {req.referencia_normativa}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-card-foreground">{req.titulo}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                      {req.descricao}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => setEditing(req)}
                      className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Excluir requisito "${req.titulo}"?`)) {
                          deleteMutation.mutate(req.id);
                        }
                      }}
                      className="rounded p-1 text-muted-foreground hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <RequisitoForm
          initial={emptyRequisito()}
          onSubmit={(data) => createMutation.mutate(data)}
          onCancel={() => setShowForm(false)}
          loading={createMutation.isPending}
        />
      )}
      {editing && (
        <RequisitoForm
          initial={editing}
          onSubmit={(data) => updateMutation.mutate({ id: editing.id!, data })}
          onCancel={() => setEditing(null)}
          loading={updateMutation.isPending}
        />
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ChecklistsPage() {
  const qc = useQueryClient();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Checklist | null>(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: checklists = [], isLoading } = useQuery<Checklist[]>({
    queryKey: ['checklists'],
    queryFn: async () => {
      const res = await fetch('/api/checklists');
      if (!res.ok) throw new Error('Erro ao carregar checklists');
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Checklist>) => {
      const res = await fetch('/api/checklists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erro ao criar checklist');
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['checklists'] });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Checklist> }) => {
      const res = await fetch(`/api/checklists/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erro ao atualizar checklist');
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['checklists'] });
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/checklists/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao desativar checklist');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['checklists'] }),
  });

  const tipoLabel = (tipo: string) => TIPOS.find((t) => t.value === tipo)?.label || tipo;

  const dimensaoInfo = (d: number) => DIMENSOES.find((x) => x.value === d) || DIMENSOES[0];

  const handleImportFile = async (file: File | undefined) => {
    if (!file) return;
    setImporting(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/importar-visitas', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Falha ao importar planilha');

      const result = await response.json();
      await qc.invalidateQueries({ queryKey: ['checklists'] });
      const total = result.imported?.reduce(
        (sum: number, item: { requisitos: number }) => sum + item.requisitos,
        0
      );
      alert(`Importação concluída: ${result.imported?.length || 0} checklists e ${total || 0} requisitos.`);
    } catch (error) {
      console.error(error);
      alert('Não foi possível importar a planilha. Verifique se o arquivo segue o modelo de visitas.');
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="h-10 w-64 animate-pulse rounded bg-muted" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  const ativos = checklists.filter((c) => c.ativo).length;
  const totalRequisitos = checklists.reduce((sum, c) => sum + (c.total_requisitos || 0), 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-outfit text-3xl font-bold text-foreground">
              Checklists e Requisitos
            </h1>
            <p className="mt-1 text-muted-foreground">
              Gerenciamento de checklists ONA e seus critérios de avaliação
            </p>
          </div>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx"
              className="hidden"
              onChange={(event) => {
                void handleImportFile(event.target.files?.[0]);
              }}
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
            >
              <Upload className="mr-2 h-4 w-4" />
              {importing ? 'Importando...' : 'Importar Planilha'}
            </Button>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Checklist
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-5">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <ClipboardCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Checklists</p>
                <p className="font-outfit text-2xl font-bold text-card-foreground">
                  {checklists.length}
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
                <p className="font-outfit text-2xl font-bold text-card-foreground">{ativos}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent p-3">
                <ListOrdered className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Requisitos</p>
                <p className="font-outfit text-2xl font-bold text-card-foreground">
                  {totalRequisitos}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Checklists List */}
        <div className="space-y-3">
          {checklists.map((cl) => {
            const isExpanded = expandedId === cl.id;
            const dim = dimensaoInfo(cl.dimensao_ona);
            const DimIcon = dim.icon;

            return (
              <div
                key={cl.id}
                className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
              >
                {/* Header row */}
                <div className="flex items-center gap-4 p-5">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : cl.id)}
                    className="flex-1 flex items-center gap-4 text-left"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <ClipboardCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-outfit text-base font-semibold text-card-foreground">
                          {cl.nome}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {tipoLabel(cl.tipo)}
                        </Badge>
                        <Badge variant="outline" className={cn('text-xs', dim.color)}>
                          <DimIcon className="mr-1 h-3 w-3" />D{cl.dimensao_ona}
                        </Badge>
                        {!cl.ativo && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-muted text-muted-foreground"
                          >
                            Inativo
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {cl.descricao && <span className="truncate">{cl.descricao}</span>}
                        <span className="shrink-0 font-medium">
                          {cl.total_requisitos} requisito{cl.total_requisitos !== 1 ? 's' : ''}
                        </span>
                        <span className="shrink-0">v{cl.versao}</span>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                    )}
                  </button>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setEditing(cl)}
                      className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Desativar checklist "${cl.nome}"?`)) {
                          deleteMutation.mutate(cl.id);
                        }
                      }}
                      className="rounded-lg p-2 text-muted-foreground hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded: requisitos */}
                {isExpanded && <RequisitosList checklist={cl} />}
              </div>
            );
          })}

          {checklists.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
              <ClipboardCheck className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 font-outfit text-lg font-semibold text-foreground">
                Nenhum checklist cadastrado
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Crie o primeiro checklist ONA para começar
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Checklist
              </Button>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <ChecklistForm
          initial={emptyChecklist()}
          onSubmit={(data) => createMutation.mutate(data)}
          onCancel={() => setShowForm(false)}
          loading={createMutation.isPending}
        />
      )}
      {editing && (
        <ChecklistForm
          initial={editing}
          onSubmit={(data) => updateMutation.mutate({ id: editing.id, data })}
          onCancel={() => setEditing(null)}
          loading={updateMutation.isPending}
        />
      )}
    </MainLayout>
  );
}
