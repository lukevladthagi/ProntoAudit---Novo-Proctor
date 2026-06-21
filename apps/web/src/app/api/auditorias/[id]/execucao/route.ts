import { NextRequest, NextResponse } from "next/server";
import sql from "@/app/api/utils/sql";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: auditoriaId } = await params;

  try {
    const data = await request.json();

    const [existing] = await sql`
      SELECT id FROM auditoria_execucoes
      WHERE auditoria_id = ${auditoriaId} AND requisito_id = ${data.requisito_id}
    `;

    const temAchado = data.tem_achado ? 1 : 0;

    if (existing) {
      await sql`
        UPDATE auditoria_execucoes
        SET conformidade = ${data.conformidade},
            observacoes = ${data.observacoes || null},
            evidencias = ${data.evidencias || null},
            tem_achado = ${temAchado},
            avaliado_em = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${existing.id}
      `;

      return NextResponse.json({ id: existing.id, ...data });
    } else {
      const [row] = await sql`
        INSERT INTO auditoria_execucoes
        (auditoria_id, requisito_id, conformidade, observacoes, evidencias, tem_achado, avaliado_em)
        VALUES (
          ${auditoriaId},
          ${data.requisito_id},
          ${data.conformidade},
          ${data.observacoes || null},
          ${data.evidencias || null},
          ${temAchado},
          CURRENT_TIMESTAMP
        )
        RETURNING id
      `;

      return NextResponse.json({ id: row?.id, ...data });
    }
  } catch (error) {
    console.error("Error saving execution:", error);
    return NextResponse.json({ error: "Failed to save execution" }, { status: 500 });
  }
}
