import { NextResponse } from "next/server";
import sql from "@/app/api/utils/sql";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const [auditoria] = await sql`
      SELECT
        a.*,
        u.nome as unidade_nome,
        s.nome as setor_nome,
        usr1.nome as auditor_nome,
        usr2.nome as coauditor_nome,
        c.nome as checklist_nome
      FROM auditorias a
      LEFT JOIN unidades u ON a.unidade_id = u.id
      LEFT JOIN setores s ON a.setor_id = s.id
      LEFT JOIN usuarios usr1 ON a.auditor_lider_id = usr1.id
      LEFT JOIN usuarios usr2 ON a.auditor_tecnico_id = usr2.id
      LEFT JOIN checklists c ON a.checklist_id = c.id
      WHERE a.id = ${id}
    `;

    if (!auditoria) {
      return NextResponse.json({ error: "Auditoria not found" }, { status: 404 });
    }

    return NextResponse.json(auditoria);
  } catch (error) {
    console.error("Error fetching auditoria:", error);
    return NextResponse.json({ error: "Failed to fetch auditoria" }, { status: 500 });
  }
}
