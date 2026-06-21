"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";

interface AchadosFiltersProps {
  onFilterChange: (filters: AchadoFilters) => void;
}

export interface AchadoFilters {
  busca?: string;
  classificacao?: string;
  status?: string;
  auditoria?: string;
  responsavel?: string;
  periodo?: string;
  tem_plano_acao?: string;
}

export function AchadosFilters({ onFilterChange }: AchadosFiltersProps) {
  const [filters, setFilters] = useState<AchadoFilters>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof AchadoFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some((v) => v);

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="font-outfit text-lg font-semibold text-card-foreground">
            Filtros
          </h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar filtros
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por número, título ou descrição..."
            className="pl-9"
            value={filters.busca || ""}
            onChange={(e) => updateFilter("busca", e.target.value)}
          />
        </div>

        {/* Quick Filters Row */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Classificação
            </label>
            <Select
              value={filters.classificacao}
              onValueChange={(value) => updateFilter("classificacao", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="critico">Crítico</SelectItem>
                <SelectItem value="maior">Maior</SelectItem>
                <SelectItem value="menor">Menor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Status
            </label>
            <Select
              value={filters.status}
              onValueChange={(value) => updateFilter("status", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="aberto">Aberto</SelectItem>
                <SelectItem value="em_analise">Em Análise</SelectItem>
                <SelectItem value="plano_acao">Plano de Ação</SelectItem>
                <SelectItem value="em_execucao">Em Execução</SelectItem>
                <SelectItem value="resolvido">Resolvido</SelectItem>
                <SelectItem value="verificado">Verificado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Período
            </label>
            <Select
              value={filters.periodo}
              onValueChange={(value) => updateFilter("periodo", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="mes_atual">Mês Atual</SelectItem>
                <SelectItem value="trimestre">Último Trimestre</SelectItem>
                <SelectItem value="semestre">Último Semestre</SelectItem>
                <SelectItem value="ano">Último Ano</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showAdvanced ? "Menos filtros" : "Mais filtros"}
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 gap-3 border-t border-border pt-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Auditoria
              </label>
              <Select
                value={filters.auditoria}
                onValueChange={(value) => updateFilter("auditoria", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="aud_001">AUD-2024-001</SelectItem>
                  <SelectItem value="aud_002">AUD-2024-002</SelectItem>
                  <SelectItem value="aud_008">AUD-2024-008</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Responsável
              </label>
              <Select
                value={filters.responsavel}
                onValueChange={(value) => updateFilter("responsavel", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="carlos">Dr. Carlos Silva</SelectItem>
                  <SelectItem value="ana">Dra. Ana Costa</SelectItem>
                  <SelectItem value="maria">Enf. Maria Santos</SelectItem>
                  <SelectItem value="coordenador_uti">Coord. UTI</SelectItem>
                  <SelectItem value="coordenador_cc">Coord. Centro Cirúrgico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Plano de Ação
              </label>
              <Select
                value={filters.tem_plano_acao}
                onValueChange={(value) => updateFilter("tem_plano_acao", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="sim">Com Plano de Ação</SelectItem>
                  <SelectItem value="nao">Sem Plano de Ação</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
