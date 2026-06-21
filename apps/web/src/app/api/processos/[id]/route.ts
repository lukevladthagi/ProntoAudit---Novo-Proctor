import { NextRequest, NextResponse } from 'next/server';
import sql from '@/app/api/utils/sql';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();

    const setClauses: string[] = [];
    const values: (string | number | null)[] = [];
    let paramCount = 1;

    if (data.nome !== undefined) {
      setClauses.push(`nome = $${paramCount++}`);
      values.push(data.nome);
    }
    if (data.descricao !== undefined) {
      setClauses.push(`descricao = $${paramCount++}`);
      values.push(data.descricao);
    }
    if (data.setor_id !== undefined) {
      setClauses.push(`setor_id = $${paramCount++}`);
      values.push(data.setor_id || null);
    }
    if (data.responsavel_id !== undefined) {
      setClauses.push(`responsavel_id = $${paramCount++}`);
      values.push(data.responsavel_id || null);
    }
    if (data.ativo !== undefined) {
      setClauses.push(`ativo = $${paramCount++}`);
      values.push(data.ativo ? 1 : 0);
    }

    setClauses.push(`updated_at = $${paramCount++}`);
    values.push(new Date().toISOString());
    values.push(id);

    const query = `UPDATE processos SET ${setClauses.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const rows = await sql(query, values);
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error updating processo:', error);
    return NextResponse.json({ error: 'Failed to update processo' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await sql`UPDATE processos SET ativo = 0, updated_at = ${new Date().toISOString()} WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting processo:', error);
    return NextResponse.json({ error: 'Failed to delete processo' }, { status: 500 });
  }
}
