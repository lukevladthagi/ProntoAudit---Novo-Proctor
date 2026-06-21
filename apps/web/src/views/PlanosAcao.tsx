"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PlanosFilters, PlanoFilters } from "@/components/planos/PlanosFilters";
import { PlanoAcaoCard, PlanoAcao } from "@/components/planos/PlanoAcaoCard";
import { usePlanosAcao } from "@/hooks/usePlanosAcao";
import { Button } from "@/components/ui/button";
import { Plus, Download, FileSpreadsheet, ListChecks } from "lucide-react";

export default function PlanosAcaoPage() {
  const { planos, loading } = usePlanosAcao();
  const [filters, setFilters] = useState<PlanoFilters>({});
  const [filteredPlanos, setFilteredPlanos] = useState<PlanoAcao[]>([]);

  useEffect(() => {
    if (!loading) {
      applyFilters(filters);
    }
  }, [planos, loading]);

  const applyFilters = (newFilters: PlanoFilters) => {
    let filtered = [...planos];

    if (newFilters.busca) {
      const searchLower = newFilters.busca.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.numero.toLowerCase().includes(searchLower) ||
          p.titulo.toLowerCase().includes(searchLower) ||
          p.achado_numero.toLowerCase().includes(searchLower) ||
          p.achado_titulo.toLowerCase().includes(searchLower)
      );
    }

    if (newFilters.status && newFilters.status !== "all") {
      filtered = filtered.filter((p) => p.status === newFilters.status);
    }

    if (newFilters.progresso && newFilters.progresso !== "all") {
      filtered = filtered.filter((p) => {
        if (newFilters.progresso === "0") return p.progresso === 0;
        if (newFilters.progresso === "1-49")
          return p.progresso >= 1 && p.progresso <= 49;
        if (newFilters.progresso === "50-99")
          return p.progresso >= 50 && p.progresso <= 99;
        if (newFilters.progresso === "100") return p.progresso === 100;
        return true;
      });
    }

    setFilteredPlanos(filtered);
  };

  const handleFilterChange = (newFilters: PlanoFilters) => {
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleViewDetails = (id: number) => {
    console.log("View plano details:", id);
    // TODO: Navigate to details page or open dialog
  };

  const handleUpdateProgress = (id: number) => {
    console.log("Update progress for plano:", id);
    // TODO: Open dialog to update progress
  };

  const handleComplete = (id: number) => {
    console.log("Complete plano:", id);
    // TODO: Open dialog to complete action plan
  };

  // Calculate stats
  const stats = {
    total: planos.length,
    pendentes: planos.filter((p) => p.status === "pendente").length,
    em_andamento: planos.filter((p) => p.status === "em_andamento").length,
    atrasados: planos.filter((p) => p.status === "atrasado").length,
    concluidos: planos.filter((p) => p.status === "concluido").length,
    verificados: planos.filter((p) => p.status === "verificado").length,
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-outfit text-3xl font-bold text-foreground">
            Planos de Ação
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gestão e acompanhamento de ações corretivas (5W2H)
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
            Novo Plano
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="font-outfit text-2xl font-bold text-card-foreground">
            {stats.total}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">Pendentes</p>
          <p className="font-outfit text-2xl font-bold text-card-foreground">
            {stats.pendentes}
          </p>
        </div>
        <div className="rounded-lg border border-status-info/30 bg-status-info/5 p-4">
          <p className="text-sm text-status-info">Em Andamento</p>
          <p className="font-outfit text-2xl font-bold text-status-info">
            {stats.em_andamento}
          </p>
        </div>
        <div className="rounded-lg border border-status-danger/30 bg-status-danger/5 p-4">
          <p className="text-sm text-status-danger">Atrasados</p>
          <p className="font-outfit text-2xl font-bold text-status-danger">
            {stats.atrasados}
          </p>
        </div>
        <div className="rounded-lg border border-ona-excelencia/30 bg-ona-excelencia/5 p-4">
          <p className="text-sm text-ona-excelencia">Concluídos</p>
          <p className="font-outfit text-2xl font-bold text-ona-excelencia">
            {stats.concluidos}
          </p>
        </div>
        <div className="rounded-lg border border-status-success/30 bg-status-success/5 p-4">
          <p className="text-sm text-status-success">Verificados</p>
          <p className="font-outfit text-2xl font-bold text-status-success">
            {stats.verificados}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <PlanosFilters onFilterChange={handleFilterChange} />
      </div>

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredPlanos.length}{" "}
          {filteredPlanos.length === 1 ? "plano encontrado" : "planos encontrados"}
        </p>
      </div>

      {/* Planos Grid */}
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
          {filteredPlanos.map((plano) => (
            <PlanoAcaoCard
              key={plano.id}
              plano={plano}
              onViewDetails={handleViewDetails}
              onUpdateProgress={handleUpdateProgress}
              onComplete={handleComplete}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredPlanos.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16">
          <ListChecks className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 font-outfit text-lg font-semibold text-foreground">
            Nenhum plano de ação encontrado
          </h3>
          <p className="mb-6 text-sm text-muted-foreground">
            Tente ajustar os filtros ou crie um novo plano de ação
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Plano
          </Button>
        </div>
      )}
    </MainLayout>
  );
}
