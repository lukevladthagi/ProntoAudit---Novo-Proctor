"use client";

import { useState } from "react";
import { useNavigate } from "@/lib/router-shim";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Send } from "lucide-react";
import { useNovaAuditoria } from "@/hooks/useNovaAuditoria";

interface AuditoriaFormData {
  titulo: string;
  tipo: string;
  unidade_id: string;
  setor_id: string;
  processo: string;
  tema: string;
  auditor_id: string;
  coauditor_id: string;
  data_programada: string;
  data_inicio: string;
  data_fim: string;
  objetivo: string;
  escopo: string;
  criterios: string;
  checklist_id: string;
}

export default function NovaAuditoriaPage() {
  const navigate = useNavigate();
  const { unidades, setores, usuarios, checklists, loading, createAuditoria } = useNovaAuditoria();
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<AuditoriaFormData>({
    titulo: "",
    tipo: "",
    unidade_id: "",
    setor_id: "",
    processo: "",
    tema: "",
    auditor_id: "",
    coauditor_id: "",
    data_programada: "",
    data_inicio: "",
    data_fim: "",
    objetivo: "",
    escopo: "",
    criterios: "",
    checklist_id: "",
  });

  const updateField = (field: keyof AuditoriaFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveDraft = () => {
    console.log("Salvando rascunho:", formData);
    // TODO: API call to save draft
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.titulo || !formData.tipo || !formData.unidade_id || !formData.setor_id || 
        !formData.auditor_id || !formData.data_programada || !formData.objetivo || 
        !formData.escopo || !formData.checklist_id) {
      alert("Por favor, preencha todos os campos obrigatórios (*)");
      return;
    }

    setSubmitting(true);
    const result = await createAuditoria({
      titulo: formData.titulo,
      tipo: formData.tipo,
      unidade_id: parseInt(formData.unidade_id),
      setor_id: parseInt(formData.setor_id),
      checklist_id: parseInt(formData.checklist_id),
      auditor_lider_id: parseInt(formData.auditor_id),
      auditor_tecnico_id: formData.coauditor_id ? parseInt(formData.coauditor_id) : undefined,
      data_programada: formData.data_programada,
      objetivo: formData.objetivo,
      escopo: formData.escopo,
    });

    setSubmitting(false);

    if (result.success) {
      navigate("/auditorias");
    } else {
      alert("Erro ao criar auditoria. Tente novamente.");
    }
  };

  // Filter setores by selected unidade
  const filteredSetores = formData.unidade_id
    ? setores.filter((s) => s.unidade_id === parseInt(formData.unidade_id))
    : setores;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
            <p className="text-muted-foreground">Carregando formulário...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/auditorias")}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Auditorias
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <h1 className="font-outfit text-3xl font-bold text-foreground">
                Nova Auditoria
              </h1>
            </div>
            <p className="text-muted-foreground">
              Planeje e configure uma nova auditoria de qualidade hospitalar
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Rascunho
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              <Send className="mr-2 h-4 w-4" />
              {submitting ? "Criando..." : "Criar Auditoria"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Básicas */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 font-outfit text-xl font-semibold text-card-foreground">
              Informações Básicas
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Título da Auditoria <span className="text-destructive">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Ex: Auditoria de Segurança do Paciente - UTI"
                  value={formData.titulo}
                  onChange={(e) => updateField("titulo", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Tipo de Auditoria <span className="text-destructive">*</span>
                  </label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value) => updateField("tipo", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interna">Auditoria Interna</SelectItem>
                      <SelectItem value="acompanhamento">Auditoria de Acompanhamento</SelectItem>
                      <SelectItem value="tematica">Auditoria Temática</SelectItem>
                      <SelectItem value="preparacao_acreditacao">
                        Preparação para Acreditação
                      </SelectItem>
                      <SelectItem value="extraordinaria">Auditoria Extraordinária</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Tema <span className="text-destructive">*</span>
                  </label>
                  <Select
                    value={formData.tema}
                    onValueChange={(value) => updateField("tema", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o tema" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seguranca_paciente">Segurança do Paciente</SelectItem>
                      <SelectItem value="assistencia">Assistência</SelectItem>
                      <SelectItem value="farmacia">Farmácia</SelectItem>
                      <SelectItem value="cme">CME</SelectItem>
                      <SelectItem value="centro_cirurgico">Centro Cirúrgico</SelectItem>
                      <SelectItem value="uti">UTI</SelectItem>
                      <SelectItem value="prontuario">Prontuário</SelectItem>
                      <SelectItem value="manutencao">Manutenção</SelectItem>
                      <SelectItem value="hotelaria">Hotelaria</SelectItem>
                      <SelectItem value="higienizacao">Higienização</SelectItem>
                      <SelectItem value="suprimentos">Suprimentos</SelectItem>
                      <SelectItem value="ti">Tecnologia da Informação</SelectItem>
                      <SelectItem value="rh">Recursos Humanos</SelectItem>
                      <SelectItem value="faturamento">Faturamento</SelectItem>
                      <SelectItem value="administrativo">Administrativo</SelectItem>
                      <SelectItem value="gestao_documental">Gestão Documental</SelectItem>
                      <SelectItem value="indicadores">Indicadores</SelectItem>
                      <SelectItem value="comissoes">Comissões Obrigatórias</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Unidade <span className="text-destructive">*</span>
                  </label>
                  <Select
                    value={formData.unidade_id}
                    onValueChange={(value) => {
                      updateField("unidade_id", value);
                      updateField("setor_id", ""); // Reset setor when unidade changes
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {unidades.map((unidade) => (
                        <SelectItem key={unidade.id} value={String(unidade.id)}>
                          {unidade.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Setor <span className="text-destructive">*</span>
                  </label>
                  <Select
                    value={formData.setor_id}
                    onValueChange={(value) => updateField("setor_id", value)}
                    disabled={!formData.unidade_id}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={formData.unidade_id ? "Selecione" : "Selecione uma unidade primeiro"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredSetores.map((setor) => (
                        <SelectItem key={setor.id} value={String(setor.id)}>
                          {setor.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Processo Auditado
                  </label>
                  <Select
                    value={formData.processo}
                    onValueChange={(value) => updateField("processo", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="identificacao_paciente">Identificação do Paciente</SelectItem>
                      <SelectItem value="medicacao_segura">Medicação Segura</SelectItem>
                      <SelectItem value="cirurgia_segura">Cirurgia Segura</SelectItem>
                      <SelectItem value="prevencao_infeccao">Prevenção de Infecção</SelectItem>
                      <SelectItem value="prevencao_quedas">Prevenção de Quedas</SelectItem>
                      <SelectItem value="prevencao_lesao">Prevenção de Lesão por Pressão</SelectItem>
                      <SelectItem value="higienizacao_maos">Higienização das Mãos</SelectItem>
                      <SelectItem value="gestao_prontuario">Gestão de Prontuário</SelectItem>
                      <SelectItem value="rastreabilidade">Rastreabilidade</SelectItem>
                      <SelectItem value="gestao_residuos">Gestão de Resíduos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Equipe e Cronograma */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 font-outfit text-xl font-semibold text-card-foreground">
              Equipe e Cronograma
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Auditor Responsável <span className="text-destructive">*</span>
                  </label>
                  <Select
                    value={formData.auditor_id}
                    onValueChange={(value) => updateField("auditor_id", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o auditor" />
                    </SelectTrigger>
                    <SelectContent>
                      {usuarios.map((usuario) => (
                        <SelectItem key={usuario.id} value={String(usuario.id)}>
                          {usuario.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Co-auditor
                  </label>
                  <Select
                    value={formData.coauditor_id || "none"}
                    onValueChange={(value) =>
                      updateField("coauditor_id", value === "none" ? "" : value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
                      {usuarios.map((usuario) => (
                        <SelectItem key={usuario.id} value={String(usuario.id)}>
                          {usuario.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Data Programada <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="date"
                    value={formData.data_programada}
                    onChange={(e) => updateField("data_programada", e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Data de Início Prevista
                  </label>
                  <Input
                    type="date"
                    value={formData.data_inicio}
                    onChange={(e) => updateField("data_inicio", e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Data de Término Prevista
                  </label>
                  <Input
                    type="date"
                    value={formData.data_fim}
                    onChange={(e) => updateField("data_fim", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Objetivo e Escopo */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 font-outfit text-xl font-semibold text-card-foreground">
              Objetivo e Escopo
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Objetivo da Auditoria <span className="text-destructive">*</span>
                </label>
                <Textarea
                  placeholder="Descreva o objetivo principal desta auditoria..."
                  rows={3}
                  value={formData.objetivo}
                  onChange={(e) => updateField("objetivo", e.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Exemplo: Avaliar a conformidade dos processos de identificação segura do
                  paciente conforme protocolo institucional e requisitos ONA Dimensão 1.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Escopo da Auditoria <span className="text-destructive">*</span>
                </label>
                <Textarea
                  placeholder="Defina o escopo e abrangência..."
                  rows={3}
                  value={formData.escopo}
                  onChange={(e) => updateField("escopo", e.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Exemplo: Todos os leitos da UTI Adulto, incluindo admissões, transferências
                  e procedimentos realizados no período de 01/01 a 31/01/2024.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Critérios Utilizados
                </label>
                <Textarea
                  placeholder="Liste os critérios, normas e protocolos de referência..."
                  rows={3}
                  value={formData.criterios}
                  onChange={(e) => updateField("criterios", e.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Exemplo: Manual ONA, Protocolo de Identificação do Paciente (POP-001),
                  RDC 36/2013 ANVISA.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Checklist */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-3 font-outfit text-lg font-semibold text-card-foreground">
              Checklist
            </h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Selecionar Checklist <span className="text-destructive">*</span>
                </label>
                <Select
                  value={formData.checklist_id}
                  onValueChange={(value) => updateField("checklist_id", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Escolher" />
                  </SelectTrigger>
                  <SelectContent>
                    {checklists.map((checklist) => (
                      <SelectItem key={checklist.id} value={String(checklist.id)}>
                        {checklist.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {formData.checklist_id && (() => {
                const selectedChecklist = checklists.find(c => c.id === parseInt(formData.checklist_id));
                return selectedChecklist ? (
                  <div className="rounded-lg bg-muted/50 p-3 text-sm">
                    <p className="mb-2 font-medium text-foreground">
                      Detalhes do Checklist
                    </p>
                    <div className="space-y-1 text-muted-foreground">
                      <p>• {selectedChecklist.descricao}</p>
                      <p>• Dimensão ONA: {selectedChecklist.dimensao_ona}</p>
                      <p>• Tipo: {selectedChecklist.nome}</p>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          </div>

          {/* Informações ONA */}
          <div className="rounded-xl border border-ona-seguranca/30 bg-gradient-to-br from-ona-seguranca/10 to-ona-seguranca/5 p-5">
            <h3 className="mb-3 font-outfit text-lg font-semibold text-card-foreground">
              Dimensões ONA
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-lg bg-white/50 p-2 dark:bg-black/20">
                <div className="h-2 w-2 rounded-full bg-ona-seguranca"></div>
                <span className="text-sm font-medium">D1 - Segurança</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/50 p-2 dark:bg-black/20">
                <div className="h-2 w-2 rounded-full bg-ona-gestao"></div>
                <span className="text-sm font-medium">D2 - Gestão</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/50 p-2 dark:bg-black/20">
                <div className="h-2 w-2 rounded-full bg-ona-excelencia"></div>
                <span className="text-sm font-medium">D3 - Excelência</span>
              </div>
            </div>
          </div>

          {/* Dicas */}
          <div className="rounded-xl border border-status-info/30 bg-status-info/5 p-5">
            <h3 className="mb-3 font-outfit text-lg font-semibold text-card-foreground">
              Dicas
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-status-info">✓</span>
                <span>Defina objetivos claros e mensuráveis</span>
              </li>
              <li className="flex gap-2">
                <span className="text-status-info">✓</span>
                <span>Comunique a equipe auditada com antecedência</span>
              </li>
              <li className="flex gap-2">
                <span className="text-status-info">✓</span>
                <span>Escolha o checklist adequado à dimensão ONA</span>
              </li>
              <li className="flex gap-2">
                <span className="text-status-info">✓</span>
                <span>Reserve tempo suficiente para análise de evidências</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
