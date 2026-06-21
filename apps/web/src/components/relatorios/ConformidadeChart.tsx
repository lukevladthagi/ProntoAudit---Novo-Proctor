"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ConformidadeChartProps {
  data: Array<{
    dimensao: string;
    conformes: number;
    parciais: number;
    nao_conformes: number;
  }>;
}

export function ConformidadeChart({ data }: ConformidadeChartProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="mb-4 font-outfit text-lg font-semibold text-card-foreground">
        Conformidade por Dimensão ONA
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="dimensao"
            className="text-xs"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            className="text-xs"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Bar
            dataKey="conformes"
            name="Conformes"
            fill="hsl(var(--status-success))"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="parciais"
            name="Parciais"
            fill="hsl(var(--status-warning))"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="nao_conformes"
            name="Não Conformes"
            fill="hsl(var(--status-danger))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
