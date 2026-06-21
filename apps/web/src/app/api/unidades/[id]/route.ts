import { NextRequest, NextResponse } from "next/server";
import sql from "@/app/api/utils/sql";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const data = await request.json();
    const ativa = data.ativa ? 1 : 0;
    await sql`
      UPDATE unidades
      SET nome = ${data.nome},
          codigo = ${data.codigo},
          endereco = ${data.endereco || null},
          cidade = ${data.cidade || null},
          estado = ${data.estado || null},
          ativa = ${ativa},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating unidade:", error);
    return NextResponse.json({ error: "Failed to update unidade" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await sql`DELETE FROM unidades WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting unidade:", error);
    return NextResponse.json({ error: "Failed to delete unidade" }, { status: 500 });
  }
}
