import { NextResponse } from "next/server";
import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const actions = await sql`
      SELECT
        pa.id,
        pa.numero,
        pa.titulo,
        pa.when_quando as prazo,
        pa.progresso,
        pa.status,
        usr.nome as responsavel,
        ach.numero as achado_numero
      FROM planos_acao pa
      LEFT JOIN usuarios usr ON pa.responsavel_execucao_id = usr.id
      LEFT JOIN achados ach ON pa.achado_id = ach.id
      WHERE pa.status = 'atrasado'
      ORDER BY pa.when_quando ASC
      LIMIT 5
    `;

    return NextResponse.json(actions);
  } catch (error) {
    console.error("Error fetching overdue actions:", error);
    return NextResponse.json({ error: "Failed to fetch actions" }, { status: 500 });
  }
}
