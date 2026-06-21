import { NextResponse } from "next/server";
import sql from "@/app/api/utils/sql";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    await sql`
      UPDATE auditorias
      SET status = 'concluida',
          data_fim = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error finalizing audit:", error);
    return NextResponse.json({ error: "Failed to finalize audit" }, { status: 500 });
  }
}
