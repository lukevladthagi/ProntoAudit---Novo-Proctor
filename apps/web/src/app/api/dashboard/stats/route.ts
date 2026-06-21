import { NextResponse } from "next/server";
import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const [totalAuditorias] = await sql`SELECT COUNT(*)::int as count FROM auditorias`;
    const [concluidas] = await sql`SELECT COUNT(*)::int as count FROM auditorias WHERE status = 'concluida'`;
    const [emExecucao] = await sql`SELECT COUNT(*)::int as count FROM auditorias WHERE status = 'em_execucao'`;

    const [totalAchados] = await sql`SELECT COUNT(*)::int as count FROM achados WHERE status != 'verificado'`;
    const [achadosCriticos] = await sql`SELECT COUNT(*)::int as count FROM achados WHERE criticidade = 'critica' AND status != 'verificado'`;
    const [achadosAltos] = await sql`SELECT COUNT(*)::int as count FROM achados WHERE criticidade = 'alta' AND status != 'verificado'`;

    const [totalPlanos] = await sql`SELECT COUNT(*)::int as count FROM planos_acao`;
    const [planosAtrasados] = await sql`SELECT COUNT(*)::int as count FROM planos_acao WHERE status = 'atrasado'`;

    const execucoes = await sql`
      SELECT conformidade, COUNT(*)::int as count
      FROM auditoria_execucoes
      GROUP BY conformidade
    `;

    let totalExecucoes = 0;
    let conformes = 0;
    let parciais = 0;

    for (const row of execucoes as Array<{ conformidade: string; count: number }>) {
      totalExecucoes += row.count;
      if (row.conformidade === "conforme") conformes += row.count;
      if (row.conformidade === "parcialmente_conforme") parciais += row.count * 0.5;
    }

    const aderenciaGeral = totalExecucoes > 0
      ? Math.round(((conformes + parciais) / totalExecucoes) * 100)
      : 0;

    return NextResponse.json({
      auditorias: {
        total: totalAuditorias?.count ?? 0,
        concluidas: concluidas?.count ?? 0,
        em_execucao: emExecucao?.count ?? 0,
      },
      achados: {
        total: totalAchados?.count ?? 0,
        criticos: achadosCriticos?.count ?? 0,
        altos: achadosAltos?.count ?? 0,
      },
      planos: {
        total: totalPlanos?.count ?? 0,
        atrasados: planosAtrasados?.count ?? 0,
      },
      aderencia_geral: aderenciaGeral,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
