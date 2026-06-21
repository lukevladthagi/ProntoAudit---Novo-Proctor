"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Building2, Filter, X } from "lucide-react";

export interface RelatorioFilters {
  periodo?: string;
  unidade_id?: string;
  setor_id?: string;
  dimensao_ona?: string;
  data_inicio?: string;
  data_fim?: string;
}

interface RelatoriosFiltersProps {
  filters: RelatorioFilters;
  onChange: (filters: RelatorioFilters) => void;
}

export function RelatoriosFilters({ filters, onChange }: RelatoriosFiltersProps) {
  const [localFilters, setLocalFilters] = useState<RelatorioFilters>(filters);

  const handleFilterChange = (key: keyof RelatorioFilters, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handleClearFilters = () => {
    const emptyFilters: RelatorioFilters = {};
    setLocalFilters(emptyFilters);
    onChange(emptyFilters);
  };

  const hasActiveFilters = Object.keys(localFilters).length > 0;

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-card-foreground">Filtros</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-7 text-xs"
          >
            <X className="mr-1 h-3 w-3" />
            Limpar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {/* Período Predefinido */}
        <Select
          value={localFilters.periodo || "all"}
          onValueChange={(value) =>
            handleFilterChange("periodo", value === "all" ? "" : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os períodos</SelectItem>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="3m">Últimos 3 meses</SelectItem>
            <SelectItem value="6m">Últimos 6 meses</SelectItem>
            <SelectItem value="1y">Último ano</SelectItem>
          </SelectContent>
        </Select>

        {/* Data Início */}
        <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            value={localFilters.data_inicio || ""}
            onChange={(e) => handleFilterChange("data_inicio", e.target.value)}
            className="border-0 p-0 text-sm focus-visible:ring-0"
            placeholder="Data início"
          />
        </div>

        {/* Data Fim */}
        <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            value={localFilters.data_fim || ""}
            onChange={(e) => handleFilterChange("data_fim", e.target.value)}
            className="border-0 p-0 text-sm focus-visible:ring-0"
            placeholder="Data fim"
          />
        </div>

        {/* Unidade */}
        <Select
          value={localFilters.unidade_id || "all"}
          onValueChange={(value) =>
            handleFilterChange("unidade_id", value === "all" ? "" : value)
          }
        >
          <SelectTrigger>
            <Building2 className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Unidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as unidades</SelectItem>
            <SelectItem value="1">Hospital Central</SelectItem>
            <SelectItem value="2">Clínica Ambulatorial</SelectItem>
          </SelectContent>
        </Select>

        {/* Dimensão ONA */}
        <Select
          value={localFilters.dimensao_ona || "all"}
          onValueChange={(value) =>
            handleFilterChange("dimensao_ona", value === "all" ? "" : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Dimensão ONA" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as dimensões</SelectItem>
            <SelectItem value="1">Dimensão 1 - Segurança</SelectItem>
            <SelectItem value="2">Dimensão 2 - Gestão</SelectItem>
            <SelectItem value="3">Dimensão 3 - Excelência</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
