import { NextRequest, NextResponse } from "next/server";
import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const unidades = await sql`
      SELECT
        u.*,
        usr.nome as responsavel_nome
      FROM unidades u
      LEFT JOIN usuarios usr ON u.responsavel_id = usr.id
      ORDER BY u.nome
    `;
    return NextResponse.json(unidades);
  } catch (error) {
    console.error("Error fetching unidades:", error);
    return NextResponse.json({ error: "Failed to fetch unidades" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const ativa = data.ativa ? 1 : 0;
    const [row] = await sql`
      INSERT INTO unidades (nome, codigo, endereco, cidade, estado, ativa)
      VALUES (
        ${data.nome},
        ${data.codigo},
        ${data.endereco || null},
        ${data.cidade || null},
        ${data.estado || null},
        ${ativa}
      )
      RETURNING id
    `;
    return NextResponse.json({ id: row?.id, ...data });
  } catch (error) {
    console.error("Error creating unidade:", error);
    return NextResponse.json({ error: "Failed to create unidade" }, { status: 500 });
  }
}
