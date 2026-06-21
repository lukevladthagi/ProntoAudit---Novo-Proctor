import { NextRequest, NextResponse } from "next/server";
import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const usuarios = await sql`
      SELECT id, nome, email, perfil, ativo, ultimo_acesso, created_at, updated_at
      FROM usuarios
      ORDER BY nome
    `;
    return NextResponse.json(usuarios);
  } catch (error) {
    console.error("Error fetching usuarios:", error);
    return NextResponse.json({ error: "Failed to fetch usuarios" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const ativo = data.ativo ? 1 : 0;
    const [row] = await sql`
      INSERT INTO usuarios (nome, email, perfil, ativo)
      VALUES (
        ${data.nome},
        ${data.email},
        ${data.perfil},
        ${ativo}
      )
      RETURNING id
    `;
    return NextResponse.json({ id: row?.id, ...data });
  } catch (error) {
    console.error("Error creating usuario:", error);
    return NextResponse.json({ error: "Failed to create usuario" }, { status: 500 });
  }
}
