import { NextResponse } from "next/server";
import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const planos = await sql`
      SELECT
        pa.id,
        pa.numero,
        pa.titulo,
        pa.what_o_que,
        pa.why_por_que,
        pa.where_onde,
        pa.when_quando,
        pa.who_quem,
        pa.how_como,
        pa.how_much_quanto,
        pa.status,
        pa.progresso,
        pa.data_inicio,
        pa.data_conclusao,
        usr1.nome as responsavel_execucao,
        usr2.nome as responsavel_verificacao,
        ach.numero as achado_numero,
        ach.titulo as achado_titulo
      FROM planos_acao pa
      LEFT JOIN usuarios usr1 ON pa.responsavel_execucao_id = usr1.id
      LEFT JOIN usuarios usr2 ON pa.responsavel_verificacao_id = usr2.id
      LEFT JOIN achados ach ON pa.achado_id = ach.id
      ORDER BY pa.created_at DESC
    `;

    return NextResponse.json(planos);
  } catch (error) {
    console.error("Error fetching planos de ação:", error);
    return NextResponse.json({ error: "Failed to fetch planos" }, { status: 500 });
  }
}
