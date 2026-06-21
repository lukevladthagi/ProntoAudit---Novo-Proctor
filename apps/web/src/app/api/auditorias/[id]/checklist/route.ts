import { NextResponse } from "next/server";
import sql from "@/app/api/utils/sql";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const requisitos = await sql`
      SELECT
        r.id,
        r.codigo,
        r.titulo,
        r.descricao,
        r.dimensao_ona,
        r.dimensao_nome,
        r.eixo,
        r.nivel_criticidade,
        r.referencia_normativa,
        r.ordem,
        ae.id as execucao_id,
        ae.conformidade,
        ae.observacoes,
        ae.evidencias,
        ae.tem_achado,
        ae.avaliado_em
      FROM requisitos r
      INNER JOIN auditorias a ON r.checklist_id = a.checklist_id
      LEFT JOIN auditoria_execucoes ae ON ae.requisito_id = r.id AND ae.auditoria_id = a.id
      WHERE a.id = ${id}
      ORDER BY r.ordem
    `;

    return NextResponse.json(requisitos);
  } catch (error) {
    console.error("Error fetching checklist:", error);
    return NextResponse.json({ error: "Failed to fetch checklist" }, { status: 500 });
  }
}
