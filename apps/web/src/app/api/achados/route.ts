import { NextResponse } from "next/server";
import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const achados = await sql`
      SELECT
        a.id,
        a.numero,
        a.titulo,
        a.descricao,
        a.tipo,
        a.classificacao,
        a.criticidade,
        a.status,
        a.data_identificacao,
        a.evidencias,
        a.impacto,
        s.nome as setor,
        s.codigo as setor_codigo,
        p.nome as processo,
        aud.numero as auditoria_numero,
        aud.titulo as auditoria_titulo,
        r.codigo as requisito_codigo,
        r.titulo as requisito_titulo,
        usr.nome as responsavel_analise
      FROM achados a
      LEFT JOIN setores s ON a.setor_id = s.id
      LEFT JOIN processos p ON a.processo_id = p.id
      LEFT JOIN auditorias aud ON a.auditoria_id = aud.id
      LEFT JOIN requisitos r ON a.requisito_id = r.id
      LEFT JOIN usuarios usr ON a.responsavel_analise_id = usr.id
      ORDER BY
        CASE a.criticidade
          WHEN 'critica' THEN 1
          WHEN 'alta' THEN 2
          WHEN 'moderada' THEN 3
          WHEN 'baixa' THEN 4
        END,
        a.created_at DESC
    `;

    return NextResponse.json(achados);
  } catch (error) {
    console.error("Error fetching achados:", error);
    return NextResponse.json({ error: "Failed to fetch achados" }, { status: 500 });
  }
}
