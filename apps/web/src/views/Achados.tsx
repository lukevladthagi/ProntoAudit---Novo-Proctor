"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { AchadosFilters, AchadoFilters } from "@/components/achados/AchadosFilters";
import { AchadoCard } from "@/components/achados/AchadoCard";
import { useAchados, Achado } from "@/hooks/useAchados";
import { Button } from "@/components/ui/button";
import { Plus, Download, FileSpreadsheet, AlertTriangle } from "lucide-react";

export default function AchadosPage() {
  const { achados, loading } = useAchados();
  const [filters, setFilters] = useState<AchadoFilters>({});
  const [filteredAchados, setFilteredAchados] = useState<Achado[]>([]);

  useEffect(() => {
    if (!loading) {
      applyFilters(filters);
    }
  }, [achados, loading]);

  const applyFilters = (newFilters: AchadoFilters) => {
    let filtered = [...achados];

    if (newFilters.busca) {
      const searchLower = newFilters.busca.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.numero.toLowerCase().includes(searchLower) ||
          a.titulo.toLowerCase().includes(searchLower) ||
          a.descricao.toLowerCase().includes(searchLower)
      );
    }

    if (newFilters.classificacao && newFilters.classificacao !== "all") {
      filtered = filtered.filter((a) => a.classificacao === newFilters.classificacao);
    }

    if (newFilters.status && newFilters.status !== "all") {
      filtered = filtered.filter((a) => a.status === newFilters.status);
    }

    setFilteredAchados(filtered);
  };

  const handleFilterChange = (newFilters: AchadoFilters) => {
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleViewDetails = (id: number) => {
    console.log("View achado details:", id);
    // TODO: Navigate to details page
  };

  const handleCreateActionPlan = (id: number) => {
    console.log("Create action plan for achado:", id);
    // TODO: Navigate to action plan creation
  };

  // Calculate stats
  const stats = {
    total: achados.length,
    criticos: achados.filter((a) => a.criticidade === "critica").length,
    maiores: achados.filter((a) => a.criticidade === "alta").length,
    menores: achados.filter((a) => a.criticidade === "moderada" || a.criticidade === "baixa").length,
    abertos: achados.filter((a) => a.status === "aberto").length,
    em_tratamento: achados.filter(
      (a) =>
        a.status === "em_analise" || a.status === "plano_criado" || a.status === "em_execucao"
    ).length,
    resolvidos: achados.filter(
      (a) => a.status === "resolvido" || a.status === "verificado"
    ).length,
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-outfit text-3xl font-bold text-foreground">
            Achados e Não Conformidades
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gestão completa de achados identificados nas auditorias
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Relatório
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Achado
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-7">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="font-outfit text-2xl font-bold text-card-foreground">
            {stats.total}
          </p>
        </div>
        <div className="rounded-lg border border-risk-critical/30 bg-risk-critical/5 p-4">
          <p className="text-sm text-risk-critical">Críticos</p>
          <p className="font-outfit text-2xl font-bold text-risk-critical">
            {stats.criticos}
          </p>
        </div>
        <div className="rounded-lg border border-status-danger/30 bg-status-danger/5 p-4">
          <p className="text-sm text-status-danger">Maiores</p>
          <p className="font-outfit text-2xl font-bold text-status-danger">
            {stats.maiores}
          </p>
        </div>
        <div className="rounded-lg border border-status-warning/30 bg-status-warning/5 p-4">
          <p className="text-sm text-status-warning">Menores</p>
          <p className="font-outfit text-2xl font-bold text-status-warning">
            {stats.menores}
          </p>
        </div>
        <div className="rounded-lg border border-status-danger/30 bg-status-danger/5 p-4">
          <p className="text-sm text-status-danger">Abertos</p>
          <p className="font-outfit text-2xl font-bold text-status-danger">
            {stats.abertos}
          </p>
        </div>
        <div className="rounded-lg border border-status-warning/30 bg-status-warning/5 p-4">
          <p className="text-sm text-status-warning">Em Tratamento</p>
          <p className="font-outfit text-2xl font-bold text-status-warning">
            {stats.em_tratamento}
          </p>
        </div>
        <div className="rounded-lg border border-status-success/30 bg-status-success/5 p-4">
          <p className="text-sm text-status-success">Resolvidos</p>
          <p className="font-outfit text-2xl font-bold text-status-success">
            {stats.resolvidos}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <AchadosFilters onFilterChange={handleFilterChange} />
      </div>

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredAchados.length}{" "}
          {filteredAchados.length === 1 ? "achado encontrado" : "achados encontrados"}
        </p>
      </div>

      {/* Achados Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-xl border border-border bg-muted/30"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {filteredAchados.map((achado) => (
            <AchadoCard
              key={achado.id}
              achado={achado}
              onViewDetails={handleViewDetails}
              onCreateActionPlan={handleCreateActionPlan}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredAchados.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16">
          <AlertTriangle className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 font-outfit text-lg font-semibold text-foreground">
            Nenhum achado encontrado
          </h3>
          <p className="mb-6 text-sm text-muted-foreground">
            Tente ajustar os filtros ou registre um novo achado
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Achado
          </Button>
        </div>
      )}
    </MainLayout>
  );
}
