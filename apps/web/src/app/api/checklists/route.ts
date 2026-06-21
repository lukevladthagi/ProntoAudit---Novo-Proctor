import { NextRequest, NextResponse } from 'next/server';
import sql from '@/app/api/utils/sql';

export async function GET() {
  try {
    const checklists = await sql`
      SELECT c.id, c.nome, c.descricao, c.tipo, c.dimensao_ona, c.versao, c.ativo,
             c.created_at, c.updated_at,
             COUNT(r.id)::int AS total_requisitos
      FROM checklists c
      LEFT JOIN requisitos r ON r.checklist_id = c.id AND r.ativo = 1
      GROUP BY c.id
      ORDER BY c.nome
    `;
    return NextResponse.json(checklists);
  } catch (error) {
    console.error('Error fetching checklists:', error);
    return NextResponse.json({ error: 'Failed to fetch checklists' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const [row] = await sql`
      INSERT INTO checklists (nome, descricao, tipo, dimensao_ona, versao, ativo)
      VALUES (${data.nome}, ${data.descricao || null}, ${data.tipo}, ${data.dimensao_ona}, ${data.versao || '1.0'}, 1)
      RETURNING *
    `;
    return NextResponse.json(row);
  } catch (error) {
    console.error('Error creating checklist:', error);
    return NextResponse.json({ error: 'Failed to create checklist' }, { status: 500 });
  }
}
