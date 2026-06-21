"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TendenciaChartProps {
  data: Array<{
    periodo: string;
    aderencia: number;
    achados: number;
  }>;
}

export function TendenciaChart({ data }: TendenciaChartProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="mb-4 font-outfit text-lg font-semibold text-card-foreground">
        Evolução Temporal da Aderência
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="periodo"
            className="text-xs"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            yAxisId="left"
            className="text-xs"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
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
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="aderencia"
            name="Aderência (%)"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))" }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="achados"
            name="Achados"
            stroke="hsl(var(--status-danger))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--status-danger))" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
