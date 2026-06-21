import { NextResponse } from "next/server";
import sql from "@/app/api/utils/sql";

type VerificacaoRow = {
  id: number;
  data_verificacao: string | Date;
  eficaz: number | null;
  requer_nova_acao: number | null;
  [key: string]: unknown;
};

export async function GET() {
  try {
    const verificacoes = (await sql`
      SELECT
        v.id,
        pa.numero as numero_plano,
        pa.titulo as titulo_plano,
        a.numero as numero_achado,
        v.data_verificacao::date as data_verificacao,
        u.nome as verificador,
        v.metodo_verificacao,
        v.resultado,
        v.eficaz,
        v.evidencias,
        v.observacoes,
        v.requer_nova_acao,
        v.novo_plano_id
      FROM verificacoes_eficacia v
      INNER JOIN planos_acao pa ON v.plano_acao_id = pa.id
      INNER JOIN achados a ON pa.achado_id = a.id
      INNER JOIN usuarios u ON v.verificador_id = u.id
      ORDER BY v.data_verificacao DESC
    `) as VerificacaoRow[];

    const formattedVerificacoes = verificacoes.map((v) => {
      const dateStr = v.data_verificacao instanceof Date
        ? v.data_verificacao.toISOString().slice(0, 10)
        : String(v.data_verificacao).slice(0, 10);
      return {
        ...v,
        data_verificacao: new Date(dateStr + "T00:00:00").toLocaleDateString("pt-BR"),
        eficaz: v.eficaz === 1 ? true : v.eficaz === 0 ? false : null,
        requer_nova_acao: v.requer_nova_acao === 1,
      };
    });

    return NextResponse.json(formattedVerificacoes);
  } catch (error) {
    console.error("Error fetching verificações:", error);
    return NextResponse.json({ error: "Failed to fetch verificações" }, { status: 500 });
  }
}
