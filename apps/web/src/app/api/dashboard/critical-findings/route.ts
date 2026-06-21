import { NextResponse } from "next/server";
import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const findings = await sql`
      SELECT
        a.id,
        a.numero,
        a.titulo,
        a.criticidade,
        a.status,
        a.data_identificacao,
        s.nome as setor,
        aud.numero as auditoria_numero
      FROM achados a
      LEFT JOIN setores s ON a.setor_id = s.id
      LEFT JOIN auditorias aud ON a.auditoria_id = aud.id
      WHERE a.criticidade IN ('critica', 'alta')
      AND a.status != 'verificado'
      ORDER BY
        CASE a.criticidade
          WHEN 'critica' THEN 1
          WHEN 'alta' THEN 2
        END,
        a.created_at DESC
      LIMIT 5
    `;

    return NextResponse.json(findings);
  } catch (error) {
    console.error("Error fetching critical findings:", error);
    return NextResponse.json({ error: "Failed to fetch findings" }, { status: 500 });
  }
}
