import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import sql from "@/app/api/utils/sql";

type ImportedChecklist = {
  nome: string;
  descricao: string;
  tipo: string;
  dimensao_ona: number;
  versao: string;
  requisitos: ImportedRequisito[];
};

type ImportedRequisito = {
  codigo: string;
  titulo: string;
  descricao: string;
  dimensao_ona: number;
  dimensao_nome: string;
  eixo: string;
  nivel_criticidade: string;
  referencia_normativa: string | null;
  ordem: number;
};

const SHEET_NAME_MAP: Record<string, string> = {
  INTERNAÇÃO: "Visitas - Internação",
  CC: "Visitas - Centro Cirúrgico",
  CLÍNICA: "Visitas - Clínica",
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Arquivo .xlsx não enviado" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const checklists = await parseVisitasWorkbook(buffer);
    const imported = [];

    for (const checklist of checklists) {
      const [existing] = await sql`
        SELECT id FROM checklists WHERE nome = ${checklist.nome} LIMIT 1
      `;

      let checklistId: number | string;
      if (existing) {
        checklistId = existing.id;
        await sql`
          UPDATE checklists
          SET descricao = ${checklist.descricao},
              tipo = ${checklist.tipo},
              dimensao_ona = ${checklist.dimensao_ona},
              versao = ${checklist.versao},
              ativo = 1,
              updated_at = now()::text
          WHERE id = ${checklistId}
        `;
        await sql`DELETE FROM requisitos WHERE checklist_id = ${checklistId}`;
      } else {
        const [created] = await sql`
          INSERT INTO checklists (nome, descricao, tipo, dimensao_ona, versao, ativo)
          VALUES (
            ${checklist.nome},
            ${checklist.descricao},
            ${checklist.tipo},
            ${checklist.dimensao_ona},
            ${checklist.versao},
            1
          )
          RETURNING id
        `;
        checklistId = created.id;
      }

      for (const requisito of checklist.requisitos) {
        await sql`
          INSERT INTO requisitos (
            checklist_id, codigo, titulo, descricao, dimensao_ona, dimensao_nome, eixo,
            nivel_criticidade, referencia_normativa, ordem, ativo
          )
          VALUES (
            ${checklistId},
            ${requisito.codigo},
            ${requisito.titulo},
            ${requisito.descricao},
            ${requisito.dimensao_ona},
            ${requisito.dimensao_nome},
            ${requisito.eixo},
            ${requisito.nivel_criticidade},
            ${requisito.referencia_normativa},
            ${requisito.ordem},
            1
          )
        `;
      }

      imported.push({
        id: checklistId,
        nome: checklist.nome,
        requisitos: checklist.requisitos.length,
      });
    }

    return NextResponse.json({ imported });
  } catch (error) {
    console.error("Error importing visitas:", error);
    return NextResponse.json({ error: "Falha ao importar planilha" }, { status: 500 });
  }
}

async function parseVisitasWorkbook(buffer: Buffer): Promise<ImportedChecklist[]> {
  const zip = await JSZip.loadAsync(buffer);
  const workbookXml = await readZipText(zip, "xl/workbook.xml");
  const workbookRelsXml = await readZipText(zip, "xl/_rels/workbook.xml.rels");
  const sharedStrings = await readSharedStrings(zip);
  const relTargets = readWorkbookRelationships(workbookRelsXml);
  const sheets = readWorkbookSheets(workbookXml);

  const result: ImportedChecklist[] = [];

  for (const sheet of sheets) {
    const target = relTargets.get(sheet.rid);
    if (!target) continue;

    const worksheetPath = `xl/${target.replace(/^\//, "")}`;
    const xml = await readZipText(zip, worksheetPath);
    const rows = readWorksheetRows(xml, sharedStrings);
    const requisitos: ImportedRequisito[] = [];
    const seen = new Set<string>();

    let ordem = 1;
    for (const rowIndex of [...rows.keys()].sort((a, b) => a - b)) {
      if (rowIndex === 1) continue;
      const row = rows.get(rowIndex);
      if (!row) continue;

      const dimensao = clean(row.get(3)) || "Não informado";
      const eixo = clean(row.get(4)) || "Sem eixo";
      const pergunta = clean(row.get(5));
      if (!pergunta) continue;

      const key = `${dimensao}::${eixo}::${pergunta}`;
      if (seen.has(key)) continue;
      seen.add(key);

      requisitos.push({
        codigo: `${sheet.name.slice(0, 3).normalize("NFD").replace(/[^\w]/g, "").toUpperCase()}-${String(ordem).padStart(3, "0")}`,
        titulo: pergunta.slice(0, 120),
        descricao: pergunta,
        dimensao_ona: 1,
        dimensao_nome: dimensao,
        eixo,
        nivel_criticidade: "moderado",
        referencia_normativa: null,
        ordem,
      });
      ordem += 1;
    }

    if (requisitos.length === 0) continue;

    result.push({
      nome: SHEET_NAME_MAP[sheet.name] || `Visitas - ${titleCase(sheet.name)}`,
      descricao: `Checklist importado da aba ${sheet.name}.`,
      tipo: "visita_setorial",
      dimensao_ona: 1,
      versao: "1.0",
      requisitos,
    });
  }

  return result;
}

async function readZipText(zip: JSZip, path: string) {
  const file = zip.file(path);
  if (!file) throw new Error(`Arquivo interno não encontrado: ${path}`);
  return file.async("text");
}

async function readSharedStrings(zip: JSZip) {
  const file = zip.file("xl/sharedStrings.xml");
  if (!file) return [];
  const xml = await file.async("text");
  return [...xml.matchAll(/<si>([\s\S]*?)<\/si>/g)].map((match) =>
    [...match[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)]
      .map((textMatch) => decodeXml(textMatch[1]))
      .join("")
  );
}

function readWorkbookRelationships(xml: string) {
  const relationships = new Map<string, string>();
  for (const match of xml.matchAll(/<Relationship\b([^>]*)\/>/g)) {
    const attrs = readAttributes(match[1]);
    if (attrs.Id && attrs.Target) relationships.set(attrs.Id, attrs.Target);
  }
  return relationships;
}

function readWorkbookSheets(xml: string) {
  return [...xml.matchAll(/<sheet\b([^>]*)\/>/g)].map((match) => {
    const attrs = readAttributes(match[1]);
    return {
      name: decodeXml(attrs.name || ""),
      rid: attrs["r:id"] || "",
    };
  });
}

function readWorksheetRows(xml: string, sharedStrings: string[]) {
  const rows = new Map<number, Map<number, string>>();

  for (const match of xml.matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/g)) {
    const attrs = readAttributes(match[1]);
    const ref = attrs.r;
    if (!ref) continue;

    const [, letters, rowText] = ref.match(/^([A-Z]+)(\d+)$/) || [];
    if (!letters || !rowText) continue;

    const row = Number(rowText);
    const col = columnToNumber(letters);
    const rawValue = match[2].match(/<v>([\s\S]*?)<\/v>/)?.[1];
    if (rawValue == null) continue;

    const value = attrs.t === "s" ? sharedStrings[Number(rawValue)] : decodeXml(rawValue);
    if (!rows.has(row)) rows.set(row, new Map());
    rows.get(row)?.set(col, value);
  }

  return rows;
}

function readAttributes(input: string) {
  const attrs: Record<string, string> = {};
  for (const match of input.matchAll(/([\w:]+)="([^"]*)"/g)) {
    attrs[match[1]] = decodeXml(match[2]);
  }
  return attrs;
}

function decodeXml(value: string) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&");
}

function clean(value: string | undefined) {
  return value?.replace(/\u00a0/g, " ").trim().replace(/\s+/g, " ") || null;
}

function columnToNumber(letters: string) {
  return [...letters].reduce((total, char) => total * 26 + char.charCodeAt(0) - 64, 0);
}

function titleCase(value: string) {
  return value.toLocaleLowerCase("pt-BR").replace(/(^|\s)\S/g, (char) =>
    char.toLocaleUpperCase("pt-BR")
  );
}
