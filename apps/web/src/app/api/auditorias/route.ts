import { NextRequest, NextResponse } from "next/server";
import sql from "@/app/api/utils/sql";

type AuditRow = {
  id: number;
  conformes: number;
  parciais: number;
  nao_conformes: number;
  [key: string]: unknown;
};

export async function GET() {
  try {
    const audits = (await sql`
      SELECT
        a.id,
        a.numero,
        a.titulo,
        a.tipo,
        a.status,
        a.data_programada,
        a.data_inicio,
        a.data_fim,
        u.nome as unidade,
        s.nome as setor,
        usr1.nome as auditor,
        usr2.nome as coauditor,
        c.dimensao_ona,
        (SELECT COUNT(*)::int FROM auditoria_execucoes ae WHERE ae.auditoria_id = a.id AND ae.conformidade = 'conforme') as conformes,
        (SELECT COUNT(*)::int FROM auditoria_execucoes ae WHERE ae.auditoria_id = a.id AND ae.conformidade = 'parcialmente_conforme') as parciais,
        (SELECT COUNT(*)::int FROM auditoria_execucoes ae WHERE ae.auditoria_id = a.id AND ae.conformidade = 'nao_conforme') as nao_conformes,
        (SELECT COUNT(*)::int FROM achados ach WHERE ach.auditoria_id = a.id AND ach.criticidade = 'critica') as achados_criticos
      FROM auditorias a
      LEFT JOIN unidades u ON a.unidade_id = u.id
      LEFT JOIN setores s ON a.setor_id = s.id
      LEFT JOIN usuarios usr1 ON a.auditor_lider_id = usr1.id
      LEFT JOIN usuarios usr2 ON a.auditor_tecnico_id = usr2.id
      LEFT JOIN checklists c ON a.checklist_id = c.id
      ORDER BY a.created_at DESC
    `) as AuditRow[];

    const auditsWithAderencia = audits.map((audit) => {
      const total = audit.conformes + audit.parciais + audit.nao_conformes;
      const aderencia = total > 0
        ? Math.round(((audit.conformes + audit.parciais * 0.5) / total) * 100)
        : null;

      return {
        ...audit,
        aderencia,
      };
    });

    return NextResponse.json(auditsWithAderencia);
  } catch (error) {
    console.error("Error fetching auditorias:", error);
    return NextResponse.json({ error: "Failed to fetch auditorias" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const [row] = await sql`
      INSERT INTO auditorias (
        numero, titulo, tipo, status, unidade_id, setor_id, checklist_id,
        auditor_lider_id, auditor_tecnico_id, data_programada, escopo, objetivo
      ) VALUES (
        ${data.numero},
        ${data.titulo},
        ${data.tipo},
        ${data.status || "planejada"},
        ${data.unidade_id},
        ${data.setor_id},
        ${data.checklist_id},
        ${data.auditor_lider_id},
        ${data.auditor_tecnico_id || null},
        ${data.data_programada},
        ${data.escopo || null},
        ${data.objetivo || null}
      )
      RETURNING id
    `;
    return NextResponse.json({ id: row?.id, ...data });
  } catch (error) {
    console.error("Error creating auditoria:", error);
    return NextResponse.json({ error: "Failed to create auditoria" }, { status: 500 });
  }
}
