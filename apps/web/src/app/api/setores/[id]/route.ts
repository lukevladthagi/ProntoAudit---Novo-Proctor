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
      UPDATE setores
      SET unidade_id = ${data.unidade_id},
          nome = ${data.nome},
          codigo = ${data.codigo},
          tipo = ${data.tipo || null},
          ativo = ${ativo},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating setor:", error);
    return NextResponse.json({ error: "Failed to update setor" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await sql`DELETE FROM setores WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting setor:", error);
    return NextResponse.json({ error: "Failed to delete setor" }, { status: 500 });
  }
}
