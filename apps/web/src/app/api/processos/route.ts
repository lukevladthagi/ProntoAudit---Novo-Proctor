import { NextRequest, NextResponse } from 'next/server';
import sql from '@/app/api/utils/sql';

export async function GET() {
  try {
    const processos = await sql`
      SELECT
        p.*,
        s.nome AS setor_nome,
        u.nome AS responsavel_nome
      FROM processos p
      LEFT JOIN setores s ON s.id = p.setor_id
      LEFT JOIN usuarios u ON u.id = p.responsavel_id
      WHERE p.ativo = 1
      ORDER BY p.nome
    `;
    return NextResponse.json(processos);
  } catch (error) {
    console.error('Error fetching processos:', error);
    return NextResponse.json({ error: 'Failed to fetch processos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const [row] = await sql`
      INSERT INTO processos (nome, descricao, setor_id, responsavel_id, ativo)
      VALUES (
        ${data.nome},
        ${data.descricao || null},
        ${data.setor_id || null},
        ${data.responsavel_id || null},
        1
      )
      RETURNING *
    `;
    return NextResponse.json(row);
  } catch (error) {
    console.error('Error creating processo:', error);
    return NextResponse.json({ error: 'Failed to create processo' }, { status: 500 });
  }
}
