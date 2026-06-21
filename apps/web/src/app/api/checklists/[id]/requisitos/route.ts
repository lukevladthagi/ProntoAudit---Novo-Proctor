import { NextRequest, NextResponse } from 'next/server';
import sql from '@/app/api/utils/sql';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const requisitos = await sql`
      SELECT * FROM requisitos
      WHERE checklist_id = ${id} AND ativo = 1
      ORDER BY COALESCE(ordem, 9999), codigo
    `;
    return NextResponse.json(requisitos);
  } catch (error) {
    console.error('Error fetching requisitos:', error);
    return NextResponse.json({ error: 'Failed to fetch requisitos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();

    // Get next order
    const [countRow] =
      await sql`SELECT COALESCE(MAX(ordem), 0) + 1 AS next_ordem FROM requisitos WHERE checklist_id = ${id}`;
    const nextOrdem = countRow?.next_ordem || 1;

    const [row] = await sql`
      INSERT INTO requisitos (
        checklist_id, codigo, titulo, descricao, dimensao_ona, dimensao_nome, eixo,
        nivel_criticidade, referencia_normativa, ordem, ativo
      )
      VALUES (
        ${id},
        ${data.codigo},
        ${data.titulo},
        ${data.descricao},
        ${data.dimensao_ona},
        ${data.dimensao_nome || null},
        ${data.eixo || null},
        ${data.nivel_criticidade},
        ${data.referencia_normativa || null},
        ${data.ordem || nextOrdem},
        1
      )
      RETURNING *
    `;
    return NextResponse.json(row);
  } catch (error) {
    console.error('Error creating requisito:', error);
    return NextResponse.json({ error: 'Failed to create requisito' }, { status: 500 });
  }
}
