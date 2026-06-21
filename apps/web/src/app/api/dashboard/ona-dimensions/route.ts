import { NextResponse } from "next/server";
import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const dimensions: Array<{
      dimension: number;
      percentage: number;
      conformes: number;
      parciais: number;
      naoConformes: number;
    }> = [];

    for (let dim = 1; dim <= 3; dim++) {
      const execucoes = (await sql`
        SELECT ae.conformidade, COUNT(*)::int as count
        FROM auditoria_execucoes ae
        INNER JOIN requisitos r ON ae.requisito_id = r.id
        WHERE r.dimensao_ona = ${dim}
        GROUP BY ae.conformidade
      `) as Array<{ conformidade: string; count: number }>;

      let total = 0;
      let conformes = 0;
      let parciais = 0;
      let naoConformes = 0;

      for (const row of execucoes) {
        total += row.count;
        if (row.conformidade === "conforme") conformes += row.count;
        if (row.conformidade === "parcialmente_conforme") parciais += row.count;
        if (row.conformidade === "nao_conforme") naoConformes += row.count;
      }

      const percentage = total > 0
        ? Math.round(((conformes + parciais * 0.5) / total) * 100)
        : 0;

      dimensions.push({
        dimension: dim,
        percentage,
        conformes,
        parciais,
        naoConformes,
      });
    }

    return NextResponse.json(dimensions);
  } catch (error) {
    console.error("Error fetching ONA dimensions:", error);
    return NextResponse.json({ error: "Failed to fetch dimensions" }, { status: 500 });
  }
}
