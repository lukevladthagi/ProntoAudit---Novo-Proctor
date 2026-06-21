import { NextResponse } from 'next/server';
import sql from '@/app/api/utils/sql';

export async function GET() {
  try {
    // Get conformance rate per sector from execucoes
    const rows = await sql`
      SELECT
        s.id,
        s.nome AS setor,
        COUNT(ae.id)::int AS total,
        SUM(CASE WHEN ae.conformidade = 'conforme' THEN 1 ELSE 0 END)::int AS conformes,
        SUM(CASE WHEN ae.conformidade = 'nao_conforme' THEN 1 ELSE 0 END)::int AS nao_conformes,
        SUM(CASE WHEN ae.conformidade = 'parcialmente_conforme' THEN 1 ELSE 0 END)::int AS parciais
      FROM setores s
      LEFT JOIN auditorias a ON a.setor_id = s.id
      LEFT JOIN auditoria_execucoes ae ON ae.auditoria_id = a.id
      WHERE s.ativo = 1
      GROUP BY s.id, s.nome
      ORDER BY s.nome
    `;

    const result = (
      rows as Array<{
        id: number;
        setor: string;
        total: number;
        conformes: number;
        nao_conformes: number;
        parciais: number;
      }>
    ).map((r) => {
      const aderencia =
        r.total > 0 ? Math.round(((r.conformes + r.parciais * 0.5) / r.total) * 100) : null; // null means no data yet
      return {
        setor: r.setor,
        aderencia,
        total: r.total,
        conformes: r.conformes,
        nao_conformes: r.nao_conformes,
        parciais: r.parciais,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching conformidade por setor:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
