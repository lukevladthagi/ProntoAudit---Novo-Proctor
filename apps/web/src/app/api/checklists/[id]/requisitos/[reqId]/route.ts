import { NextRequest, NextResponse } from 'next/server';
import sql from '@/app/api/utils/sql';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; reqId: string }> }
) {
  try {
    const { reqId } = await params;
    const data = await request.json();

    const setClauses: string[] = [];
    const values: (string | number | null)[] = [];
    let paramCount = 1;

    if (data.codigo !== undefined) {
      setClauses.push(`codigo = $${paramCount++}`);
      values.push(data.codigo);
    }
    if (data.titulo !== undefined) {
      setClauses.push(`titulo = $${paramCount++}`);
      values.push(data.titulo);
    }
    if (data.descricao !== undefined) {
      setClauses.push(`descricao = $${paramCount++}`);
      values.push(data.descricao);
    }
    if (data.dimensao_ona !== undefined) {
      setClauses.push(`dimensao_ona = $${paramCount++}`);
      values.push(data.dimensao_ona);
    }
    if (data.dimensao_nome !== undefined) {
      setClauses.push(`dimensao_nome = $${paramCount++}`);
      values.push(data.dimensao_nome);
    }
    if (data.eixo !== undefined) {
      setClauses.push(`eixo = $${paramCount++}`);
      values.push(data.eixo);
    }
    if (data.nivel_criticidade !== undefined) {
      setClauses.push(`nivel_criticidade = $${paramCount++}`);
      values.push(data.nivel_criticidade);
    }
    if (data.referencia_normativa !== undefined) {
      setClauses.push(`referencia_normativa = $${paramCount++}`);
      values.push(data.referencia_normativa);
    }
    if (data.ordem !== undefined) {
      setClauses.push(`ordem = $${paramCount++}`);
      values.push(data.ordem);
    }

    setClauses.push(`updated_at = $${paramCount++}`);
    values.push(new Date().toISOString());
    values.push(reqId);

    const query = `UPDATE requisitos SET ${setClauses.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const rows = await sql(query, values);
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error updating requisito:', error);
    return NextResponse.json({ error: 'Failed to update requisito' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; reqId: string }> }
) {
  try {
    const { reqId } = await params;
    await sql`UPDATE requisitos SET ativo = 0, updated_at = ${new Date().toISOString()} WHERE id = ${reqId}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting requisito:', error);
    return NextResponse.json({ error: 'Failed to delete requisito' }, { status: 500 });
  }
}
