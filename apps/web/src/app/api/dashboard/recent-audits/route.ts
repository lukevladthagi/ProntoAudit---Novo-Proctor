import { NextResponse } from "next/server";
import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const audits = await sql`
      SELECT
        a.id,
        a.numero,
        a.titulo,
        a.status,
        a.data_programada,
        a.data_inicio,
        a.data_fim,
        u.nome as unidade,
        s.nome as setor,
        usr.nome as auditor
      FROM auditorias a
      LEFT JOIN unidades u ON a.unidade_id = u.id
      LEFT JOIN setores s ON a.setor_id = s.id
      LEFT JOIN usuarios usr ON a.auditor_lider_id = usr.id
      ORDER BY a.created_at DESC
      LIMIT 5
    `;

    return NextResponse.json(audits);
  } catch (error) {
    console.error("Error fetching recent audits:", error);
    return NextResponse.json({ error: "Failed to fetch audits" }, { status: 500 });
  }
}
