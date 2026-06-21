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

interface PlanosFiltersProps {
  onFilterChange: (filters: PlanoFilters) => void;
}

export interface PlanoFilters {
  busca?: string;
  status?: string;
  responsavel?: string;
  prazo?: string;
  achado?: string;
  progresso?: string;
}

export function PlanosFilters({ onFilterChange }: PlanosFiltersProps) {
  const [filters, setFilters] = useState<PlanoFilters>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof PlanoFilters, value: string) => {
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
            placeholder="Buscar por número, título ou achado..."
            className="pl-9"
            value={filters.busca || ""}
            onChange={(e) => updateFilter("busca", e.target.value)}
          />
        </div>

        {/* Quick Filters Row */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="atrasado">Atrasado</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="verificado">Verificado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Prazo
            </label>
            <Select
              value={filters.prazo}
              onValueChange={(value) => updateFilter("prazo", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="vencidos">Vencidos</SelectItem>
                <SelectItem value="7dias">Próximos 7 dias</SelectItem>
                <SelectItem value="15dias">Próximos 15 dias</SelectItem>
                <SelectItem value="30dias">Próximos 30 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Progresso
            </label>
            <Select
              value={filters.progresso}
              onValueChange={(value) => updateFilter("progresso", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="0">Não Iniciado (0%)</SelectItem>
                <SelectItem value="1-49">Iniciado (1-49%)</SelectItem>
                <SelectItem value="50-99">Em Progresso (50-99%)</SelectItem>
                <SelectItem value="100">Completo (100%)</SelectItem>
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
          <div className="grid grid-cols-1 gap-3 border-t border-border pt-4 sm:grid-cols-2">
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
                  <SelectItem value="ccih">CCIH</SelectItem>
                  <SelectItem value="hotelaria">Hotelaria</SelectItem>
                  <SelectItem value="farmacia">Farmácia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Achado
              </label>
              <Select
                value={filters.achado}
                onValueChange={(value) => updateFilter("achado", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="ACH-2024-001">ACH-2024-001</SelectItem>
                  <SelectItem value="ACH-2024-002">ACH-2024-002</SelectItem>
                  <SelectItem value="ACH-2024-003">ACH-2024-003</SelectItem>
                  <SelectItem value="ACH-2024-004">ACH-2024-004</SelectItem>
                  <SelectItem value="ACH-2024-005">ACH-2024-005</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
