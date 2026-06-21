import { NextRequest, NextResponse } from "next/server";
import sql from "@/app/api/utils/sql";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const data = await request.json();
    const ativo = data.ativo ? 1 : 0;
    await sql`
      UPDATE usuarios
      SET nome = ${data.nome},
          email = ${data.email},
          perfil = ${data.perfil},
          ativo = ${ativo},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating usuario:", error);
    return NextResponse.json({ error: "Failed to update usuario" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await sql`DELETE FROM usuarios WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting usuario:", error);
    return NextResponse.json({ error: "Failed to delete usuario" }, { status: 500 });
  }
}
