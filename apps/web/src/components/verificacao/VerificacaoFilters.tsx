"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

export interface VerificacaoFilterType {
  busca?: string;
  resultado?: string;
  periodo?: string;
  requer_nova_acao?: boolean;
}

interface VerificacaoFiltersProps {
  filters: VerificacaoFilterType;
  onFilterChange: (filters: VerificacaoFilterType) => void;
}

export function VerificacaoFilters({
  filters,
  onFilterChange,
}: VerificacaoFiltersProps) {
  const handleClearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters =
    filters.busca ||
    (filters.resultado && filters.resultado !== "all") ||
    (filters.periodo && filters.periodo !== "all") ||
    filters.requer_nova_acao !== undefined;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Busca */}
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por número ou título do plano..."
              value={filters.busca || ""}
              onChange={(e) =>
                onFilterChange({ ...filters, busca: e.target.value })
              }
              className="pl-9"
            />
          </div>
        </div>

        {/* Resultado */}
        <Select
          value={filters.resultado || "all"}
          onValueChange={(value) =>
            onFilterChange({ ...filters, resultado: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Resultado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os resultados</SelectItem>
            <SelectItem value="eficaz">Eficaz</SelectItem>
            <SelectItem value="nao_eficaz">Não eficaz</SelectItem>
            <SelectItem value="parcial">Parcialmente eficaz</SelectItem>
          </SelectContent>
        </Select>

        {/* Período */}
        <Select
          value={filters.periodo || "all"}
          onValueChange={(value) =>
            onFilterChange({ ...filters, periodo: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os períodos</SelectItem>
            <SelectItem value="mes_atual">Mês atual</SelectItem>
            <SelectItem value="trimestre">Último trimestre</SelectItem>
            <SelectItem value="semestre">Último semestre</SelectItem>
            <SelectItem value="ano">Este ano</SelectItem>
          </SelectContent>
        </Select>

        {/* Nova Ação */}
        <Select
          value={
            filters.requer_nova_acao === undefined
              ? "all"
              : filters.requer_nova_acao
              ? "sim"
              : "nao"
          }
          onValueChange={(value) => {
            const newValue =
              value === "all" ? undefined : value === "sim" ? true : false;
            onFilterChange({ ...filters, requer_nova_acao: newValue });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Nova ação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="sim">Requer nova ação</SelectItem>
            <SelectItem value="nao">Não requer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Limpar Filtros */}
      {hasActiveFilters && (
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <p className="text-sm text-muted-foreground">
            Filtros ativos aplicados
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
}
