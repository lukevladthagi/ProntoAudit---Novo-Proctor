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
    if (data.tipo !== undefined) {
      setClauses.push(`tipo = $${paramCount++}`);
      values.push(data.tipo);
    }
    if (data.dimensao_ona !== undefined) {
      setClauses.push(`dimensao_ona = $${paramCount++}`);
      values.push(data.dimensao_ona);
    }
    if (data.versao !== undefined) {
      setClauses.push(`versao = $${paramCount++}`);
      values.push(data.versao);
    }
    if (data.ativo !== undefined) {
      setClauses.push(`ativo = $${paramCount++}`);
      values.push(data.ativo ? 1 : 0);
    }

    setClauses.push(`updated_at = $${paramCount++}`);
    values.push(new Date().toISOString());
    values.push(id);

    const query = `UPDATE checklists SET ${setClauses.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const rows = await sql(query, values);
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error updating checklist:', error);
    return NextResponse.json({ error: 'Failed to update checklist' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await sql`UPDATE checklists SET ativo = 0, updated_at = ${new Date().toISOString()} WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting checklist:', error);
    return NextResponse.json({ error: 'Failed to delete checklist' }, { status: 500 });
  }
}
