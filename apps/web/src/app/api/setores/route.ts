import { NextRequest, NextResponse } from "next/server";
import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const setores = await sql`
      SELECT
        s.*,
        u.nome as unidade_nome,
        usr.nome as responsavel_nome
      FROM setores s
      LEFT JOIN unidades u ON s.unidade_id = u.id
      LEFT JOIN usuarios usr ON s.responsavel_id = usr.id
      ORDER BY u.nome, s.nome
    `;
    return NextResponse.json(setores);
  } catch (error) {
    console.error("Error fetching setores:", error);
    return NextResponse.json({ error: "Failed to fetch setores" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const ativo = data.ativo ? 1 : 0;
    const [row] = await sql`
      INSERT INTO setores (unidade_id, nome, codigo, tipo, ativo)
      VALUES (
        ${data.unidade_id},
        ${data.nome},
        ${data.codigo},
        ${data.tipo || null},
        ${ativo}
      )
      RETURNING id
    `;
    return NextResponse.json({ id: row?.id, ...data });
  } catch (error) {
    console.error("Error creating setor:", error);
    return NextResponse.json({ error: "Failed to create setor" }, { status: 500 });
  }
}
