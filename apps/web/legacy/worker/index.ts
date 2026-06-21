import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

// Dashboard stats endpoint
app.get("/api/dashboard/stats", async (c) => {
  const db = c.env.DB;

  try {
    // Get audit stats
    const totalAuditorias = await db.prepare("SELECT COUNT(*) as count FROM auditorias").first();
    const concluidas = await db.prepare("SELECT COUNT(*) as count FROM auditorias WHERE status = 'concluida'").first();
    const emExecucao = await db.prepare("SELECT COUNT(*) as count FROM auditorias WHERE status = 'em_execucao'").first();

    // Get achados stats
    const totalAchados = await db.prepare("SELECT COUNT(*) as count FROM achados WHERE status != 'verificado'").first();
    const achadosCriticos = await db.prepare("SELECT COUNT(*) as count FROM achados WHERE criticidade = 'critica' AND status != 'verificado'").first();
    const achadosAltos = await db.prepare("SELECT COUNT(*) as count FROM achados WHERE criticidade = 'alta' AND status != 'verificado'").first();

    // Get planos de acao stats
    const totalPlanos = await db.prepare("SELECT COUNT(*) as count FROM planos_acao").first();
    const planosAtrasados = await db.prepare("SELECT COUNT(*) as count FROM planos_acao WHERE status = 'atrasado'").first();

    // Calculate overall adherence
    const execucoes = await db.prepare(`
      SELECT conformidade, COUNT(*) as count
      FROM auditoria_execucoes
      GROUP BY conformidade
    `).all();

    let totalExecucoes = 0;
    let conformes = 0;
    let parciais = 0;

    execucoes.results.forEach((row: any) => {
      totalExecucoes += row.count;
      if (row.conformidade === 'conforme') conformes += row.count;
      if (row.conformidade === 'parcialmente_conforme') parciais += row.count * 0.5;
    });

    const aderenciaGeral = totalExecucoes > 0 
      ? Math.round(((conformes + parciais) / totalExecucoes) * 100)
      : 0;

    return c.json({
      auditorias: {
        total: totalAuditorias?.count || 0,
        concluidas: concluidas?.count || 0,
        em_execucao: emExecucao?.count || 0,
      },
      achados: {
        total: totalAchados?.count || 0,
        criticos: achadosCriticos?.count || 0,
        altos: achadosAltos?.count || 0,
      },
      planos: {
        total: totalPlanos?.count || 0,
        atrasados: planosAtrasados?.count || 0,
      },
      aderencia_geral: aderenciaGeral,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return c.json({ error: "Failed to fetch stats" }, 500);
  }
});

// Dashboard ONA dimensions endpoint
app.get("/api/dashboard/ona-dimensions", async (c) => {
  const db = c.env.DB;

  try {
    const dimensions = [];

    for (let dim = 1; dim <= 3; dim++) {
      const execucoes = await db.prepare(`
        SELECT ae.conformidade, COUNT(*) as count
        FROM auditoria_execucoes ae
        INNER JOIN requisitos r ON ae.requisito_id = r.id
        WHERE r.dimensao_ona = ?
        GROUP BY ae.conformidade
      `).bind(dim).all();

      let total = 0;
      let conformes = 0;
      let parciais = 0;
      let naoConformes = 0;

      execucoes.results.forEach((row: any) => {
        total += row.count;
        if (row.conformidade === 'conforme') conformes += row.count;
        if (row.conformidade === 'parcialmente_conforme') parciais += row.count;
        if (row.conformidade === 'nao_conforme') naoConformes += row.count;
      });

      const percentage = total > 0
        ? Math.round(((conformes + parciais * 0.5) / total) * 100)
        : 0;

      dimensions.push({
        dimension: dim,
        percentage,
        conformes,
        parciais,
        naoConformes,
      });
    }

    return c.json(dimensions);
  } catch (error) {
    console.error("Error fetching ONA dimensions:", error);
    return c.json({ error: "Failed to fetch dimensions" }, 500);
  }
});

// Recent audits endpoint
app.get("/api/dashboard/recent-audits", async (c) => {
  const db = c.env.DB;

  try {
    const audits = await db.prepare(`
      SELECT 
        a.id,
        a.numero,
        a.titulo,
        a.status,
        a.data_programada,
        a.data_inicio,
        a.data_fim,
        u.nome as unidade,
        s.nome as setor,
        usr.nome as auditor
      FROM auditorias a
      LEFT JOIN unidades u ON a.unidade_id = u.id
      LEFT JOIN setores s ON a.setor_id = s.id
      LEFT JOIN usuarios usr ON a.auditor_lider_id = usr.id
      ORDER BY a.created_at DESC
      LIMIT 5
    `).all();

    return c.json(audits.results);
  } catch (error) {
    console.error("Error fetching recent audits:", error);
    return c.json({ error: "Failed to fetch audits" }, 500);
  }
});

// Critical findings endpoint
app.get("/api/dashboard/critical-findings", async (c) => {
  const db = c.env.DB;

  try {
    const findings = await db.prepare(`
      SELECT 
        a.id,
        a.numero,
        a.titulo,
        a.criticidade,
        a.status,
        a.data_identificacao,
        s.nome as setor,
        aud.numero as auditoria_numero
      FROM achados a
      LEFT JOIN setores s ON a.setor_id = s.id
      LEFT JOIN auditorias aud ON a.auditoria_id = aud.id
      WHERE a.criticidade IN ('critica', 'alta')
      AND a.status != 'verificado'
      ORDER BY 
        CASE a.criticidade
          WHEN 'critica' THEN 1
          WHEN 'alta' THEN 2
        END,
        a.created_at DESC
      LIMIT 5
    `).all();

    return c.json(findings.results);
  } catch (error) {
    console.error("Error fetching critical findings:", error);
    return c.json({ error: "Failed to fetch findings" }, 500);
  }
});

// Overdue actions endpoint
app.get("/api/dashboard/overdue-actions", async (c) => {
  const db = c.env.DB;

  try {
    const actions = await db.prepare(`
      SELECT 
        pa.id,
        pa.numero,
        pa.titulo,
        pa.when_quando as prazo,
        pa.progresso,
        pa.status,
        usr.nome as responsavel,
        ach.numero as achado_numero
      FROM planos_acao pa
      LEFT JOIN usuarios usr ON pa.responsavel_execucao_id = usr.id
      LEFT JOIN achados ach ON pa.achado_id = ach.id
      WHERE pa.status = 'atrasado'
      ORDER BY pa.when_quando ASC
      LIMIT 5
    `).all();

    return c.json(actions.results);
  } catch (error) {
    console.error("Error fetching overdue actions:", error);
    return c.json({ error: "Failed to fetch actions" }, 500);
  }
});

// Auditorias list endpoint
app.get("/api/auditorias", async (c) => {
  const db = c.env.DB;

  try {
    const audits = await db.prepare(`
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
        (SELECT COUNT(*) FROM auditoria_execucoes ae WHERE ae.auditoria_id = a.id AND ae.conformidade = 'conforme') as conformes,
        (SELECT COUNT(*) FROM auditoria_execucoes ae WHERE ae.auditoria_id = a.id AND ae.conformidade = 'parcialmente_conforme') as parciais,
        (SELECT COUNT(*) FROM auditoria_execucoes ae WHERE ae.auditoria_id = a.id AND ae.conformidade = 'nao_conforme') as nao_conformes,
        (SELECT COUNT(*) FROM achados ach WHERE ach.auditoria_id = a.id AND ach.criticidade = 'critica') as achados_criticos
      FROM auditorias a
      LEFT JOIN unidades u ON a.unidade_id = u.id
      LEFT JOIN setores s ON a.setor_id = s.id
      LEFT JOIN usuarios usr1 ON a.auditor_lider_id = usr1.id
      LEFT JOIN usuarios usr2 ON a.auditor_tecnico_id = usr2.id
      LEFT JOIN checklists c ON a.checklist_id = c.id
      ORDER BY a.created_at DESC
    `).all();

    // Calculate aderencia for each audit
    const auditsWithAderencia = audits.results.map((audit: any) => {
      const total = audit.conformes + audit.parciais + audit.nao_conformes;
      const aderencia = total > 0
        ? Math.round(((audit.conformes + audit.parciais * 0.5) / total) * 100)
        : null;
      
      return {
        ...audit,
        aderencia,
      };
    });

    return c.json(auditsWithAderencia);
  } catch (error) {
    console.error("Error fetching auditorias:", error);
    return c.json({ error: "Failed to fetch auditorias" }, 500);
  }
});

// Achados list endpoint
app.get("/api/achados", async (c) => {
  const db = c.env.DB;

  try {
    const achados = await db.prepare(`
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
    `).all();

    return c.json(achados.results);
  } catch (error) {
    console.error("Error fetching achados:", error);
    return c.json({ error: "Failed to fetch achados" }, 500);
  }
});

// Planos de ação list endpoint
app.get("/api/planos-acao", async (c) => {
  const db = c.env.DB;

  try {
    const planos = await db.prepare(`
      SELECT 
        pa.id,
        pa.numero,
        pa.titulo,
        pa.what_o_que,
        pa.why_por_que,
        pa.where_onde,
        pa.when_quando,
        pa.who_quem,
        pa.how_como,
        pa.how_much_quanto,
        pa.status,
        pa.progresso,
        pa.data_inicio,
        pa.data_conclusao,
        usr1.nome as responsavel_execucao,
        usr2.nome as responsavel_verificacao,
        ach.numero as achado_numero,
        ach.titulo as achado_titulo
      FROM planos_acao pa
      LEFT JOIN usuarios usr1 ON pa.responsavel_execucao_id = usr1.id
      LEFT JOIN usuarios usr2 ON pa.responsavel_verificacao_id = usr2.id
      LEFT JOIN achados ach ON pa.achado_id = ach.id
      ORDER BY pa.created_at DESC
    `).all();

    return c.json(planos.results);
  } catch (error) {
    console.error("Error fetching planos de ação:", error);
    return c.json({ error: "Failed to fetch planos" }, 500);
  }
});

// Verificações de eficácia list endpoint
app.get("/api/verificacoes", async (c) => {
  const db = c.env.DB;

  try {
    const verificacoes = await db.prepare(`
      SELECT 
        v.id,
        pa.numero as numero_plano,
        pa.titulo as titulo_plano,
        a.numero as numero_achado,
        DATE(v.data_verificacao) as data_verificacao,
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
    `).all();

    // Formatar datas e converter booleans
    const formattedVerificacoes = verificacoes.results.map((v: any) => ({
      ...v,
      data_verificacao: new Date(v.data_verificacao + "T00:00:00").toLocaleDateString("pt-BR"),
      eficaz: v.eficaz === 1 ? true : v.eficaz === 0 ? false : null,
      requer_nova_acao: v.requer_nova_acao === 1,
    }));

    return c.json(formattedVerificacoes);
  } catch (error) {
    console.error("Error fetching verificações:", error);
    return c.json({ error: "Failed to fetch verificações" }, 500);
  }
});

// Create new auditoria
app.post("/api/auditorias", async (c) => {
  const db = c.env.DB;
  try {
    const data = await c.req.json();
    const result = await db.prepare(`
      INSERT INTO auditorias (
        numero, titulo, tipo, status, unidade_id, setor_id, checklist_id,
        auditor_lider_id, auditor_tecnico_id, data_programada, escopo, objetivo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.numero,
      data.titulo,
      data.tipo,
      data.status || 'planejada',
      data.unidade_id,
      data.setor_id,
      data.checklist_id,
      data.auditor_lider_id,
      data.auditor_tecnico_id || null,
      data.data_programada,
      data.escopo || null,
      data.objetivo || null
    ).run();
    return c.json({ id: result.meta.last_row_id, ...data });
  } catch (error) {
    console.error("Error creating auditoria:", error);
    return c.json({ error: "Failed to create auditoria" }, 500);
  }
});

// Auditoria details endpoint
app.get("/api/auditorias/:id", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");

  try {
    const auditoria = await db.prepare(`
      SELECT 
        a.*,
        u.nome as unidade_nome,
        s.nome as setor_nome,
        usr1.nome as auditor_nome,
        usr2.nome as coauditor_nome,
        c.nome as checklist_nome
      FROM auditorias a
      LEFT JOIN unidades u ON a.unidade_id = u.id
      LEFT JOIN setores s ON a.setor_id = s.id
      LEFT JOIN usuarios usr1 ON a.auditor_lider_id = usr1.id
      LEFT JOIN usuarios usr2 ON a.auditor_tecnico_id = usr2.id
      LEFT JOIN checklists c ON a.checklist_id = c.id
      WHERE a.id = ?
    `).bind(id).first();

    if (!auditoria) {
      return c.json({ error: "Auditoria not found" }, 404);
    }

    return c.json(auditoria);
  } catch (error) {
    console.error("Error fetching auditoria:", error);
    return c.json({ error: "Failed to fetch auditoria" }, 500);
  }
});

// Auditoria execution checklist endpoint
app.get("/api/auditorias/:id/checklist", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");

  try {
    const requisitos = await db.prepare(`
      SELECT 
        r.id,
        r.codigo,
        r.titulo,
        r.descricao,
        r.dimensao_ona,
        r.nivel_criticidade,
        r.referencia_normativa,
        r.ordem,
        ae.id as execucao_id,
        ae.conformidade,
        ae.observacoes,
        ae.evidencias,
        ae.tem_achado,
        ae.avaliado_em
      FROM requisitos r
      INNER JOIN auditorias a ON r.checklist_id = a.checklist_id
      LEFT JOIN auditoria_execucoes ae ON ae.requisito_id = r.id AND ae.auditoria_id = a.id
      WHERE a.id = ?
      ORDER BY r.ordem
    `).bind(id).all();

    return c.json(requisitos.results);
  } catch (error) {
    console.error("Error fetching checklist:", error);
    return c.json({ error: "Failed to fetch checklist" }, 500);
  }
});

// Update audit execution item
app.post("/api/auditorias/:id/execucao", async (c) => {
  const db = c.env.DB;
  const auditoriaId = c.req.param("id");
  
  try {
    const data = await c.req.json();
    
    // Check if execution record exists
    const existing = await db.prepare(`
      SELECT id FROM auditoria_execucoes 
      WHERE auditoria_id = ? AND requisito_id = ?
    `).bind(auditoriaId, data.requisito_id).first();

    if (existing) {
      // Update existing
      await db.prepare(`
        UPDATE auditoria_execucoes 
        SET conformidade = ?, observacoes = ?, evidencias = ?, tem_achado = ?, 
            avaliado_em = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(
        data.conformidade,
        data.observacoes || null,
        data.evidencias || null,
        data.tem_achado ? 1 : 0,
        existing.id
      ).run();
      
      return c.json({ id: existing.id, ...data });
    } else {
      // Create new
      const result = await db.prepare(`
        INSERT INTO auditoria_execucoes 
        (auditoria_id, requisito_id, conformidade, observacoes, evidencias, tem_achado, avaliado_em)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `).bind(
        auditoriaId,
        data.requisito_id,
        data.conformidade,
        data.observacoes || null,
        data.evidencias || null,
        data.tem_achado ? 1 : 0
      ).run();
      
      return c.json({ id: result.meta.last_row_id, ...data });
    }
  } catch (error) {
    console.error("Error saving execution:", error);
    return c.json({ error: "Failed to save execution" }, 500);
  }
});

// Finalize audit
app.post("/api/auditorias/:id/finalizar", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  
  try {
    await db.prepare(`
      UPDATE auditorias 
      SET status = 'concluida', data_fim = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(id).run();
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error finalizing audit:", error);
    return c.json({ error: "Failed to finalize audit" }, 500);
  }
});

// Relatórios endpoint
app.get("/api/relatorios", async (c) => {
  const db = c.env.DB;

  try {
    // Indicadores principais
    const totalAuditorias = await db.prepare("SELECT COUNT(*) as count FROM auditorias").first();
    const totalAchados = await db.prepare("SELECT COUNT(*) as count FROM achados").first();
    const planosConcluidos = await db.prepare("SELECT COUNT(*) as count FROM planos_acao WHERE status = 'concluido' OR status = 'verificado'").first();

    // Calcular aderência geral
    const execucoes = await db.prepare(`
      SELECT conformidade, COUNT(*) as count
      FROM auditoria_execucoes
      WHERE conformidade IS NOT NULL
      GROUP BY conformidade
    `).all();

    let totalExecucoes = 0;
    let conformes = 0;
    let parciais = 0;

    execucoes.results.forEach((row: any) => {
      totalExecucoes += row.count;
      if (row.conformidade === 'conforme') conformes += row.count;
      if (row.conformidade === 'parcialmente_conforme') parciais += row.count * 0.5;
    });

    const aderenciaGeral = totalExecucoes > 0 
      ? Math.round(((conformes + parciais) / totalExecucoes) * 100)
      : 0;

    // Conformidade por dimensão ONA
    const conformidadeDimensoes = await db.prepare(`
      SELECT 
        r.dimensao_ona,
        SUM(CASE WHEN ae.conformidade = 'conforme' THEN 1 ELSE 0 END) as conformes,
        SUM(CASE WHEN ae.conformidade = 'parcialmente_conforme' THEN 1 ELSE 0 END) as parciais,
        SUM(CASE WHEN ae.conformidade = 'nao_conforme' THEN 1 ELSE 0 END) as nao_conformes
      FROM auditoria_execucoes ae
      INNER JOIN requisitos r ON ae.requisito_id = r.id
      WHERE ae.conformidade IS NOT NULL
      GROUP BY r.dimensao_ona
      ORDER BY r.dimensao_ona
    `).all();

    const dimensaoNames = ['Segurança', 'Gestão Integrada', 'Excelência'];
    const conformidade_dimensoes = conformidadeDimensoes.results.map((row: any) => ({
      dimensao: `Dim ${row.dimensao_ona} - ${dimensaoNames[row.dimensao_ona - 1]}`,
      conformes: row.conformes,
      parciais: row.parciais,
      nao_conformes: row.nao_conformes,
    }));

    // Tendência temporal (últimos 6 meses)
    const tendenciaTemporal = await db.prepare(`
      SELECT 
        strftime('%Y-%m', a.data_programada) as mes,
        COUNT(DISTINCT a.id) as total_auditorias,
        COUNT(DISTINCT ach.id) as total_achados
      FROM auditorias a
      LEFT JOIN achados ach ON ach.auditoria_id = a.id
      WHERE a.data_programada >= date('now', '-6 months')
      GROUP BY mes
      ORDER BY mes
    `).all();

    const tendencia_temporal = tendenciaTemporal.results.map((row: any) => {
      // Calculate average adherence for the month
      const monthDate = row.mes + '-01';
      return {
        periodo: new Date(monthDate).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        aderencia: Math.floor(Math.random() * 20) + 70, // Mock data for now
        achados: row.total_achados,
      };
    });

    // Achados por criticidade
    const achadosCriticidade = await db.prepare(`
      SELECT 
        criticidade,
        COUNT(*) as total
      FROM achados
      GROUP BY criticidade
    `).all();

    const criticidadeColors: Record<string, string> = {
      'baixa': 'hsl(var(--status-info))',
      'moderada': 'hsl(var(--status-warning))',
      'alta': 'hsl(var(--ona-seguranca))',
      'critica': 'hsl(var(--status-danger))',
    };

    const achados_criticidade = achadosCriticidade.results.map((row: any) => ({
      name: row.criticidade.charAt(0).toUpperCase() + row.criticidade.slice(1),
      value: row.total,
      color: criticidadeColors[row.criticidade] || 'hsl(var(--muted))',
    }));

    // Status dos planos de ação
    const planosStatus = await db.prepare(`
      SELECT 
        status,
        COUNT(*) as total
      FROM planos_acao
      GROUP BY status
    `).all();

    const planos_status = planosStatus.results.map((row: any) => ({
      status: row.status,
      total: row.total,
    }));

    return c.json({
      indicadores: {
        total_auditorias: totalAuditorias?.count || 0,
        aderencia_geral: aderenciaGeral,
        total_achados: totalAchados?.count || 0,
        planos_concluidos: planosConcluidos?.count || 0,
        variacao_auditorias: 12,
        variacao_aderencia: 5,
        variacao_achados: -8,
      },
      conformidade_dimensoes,
      tendencia_temporal,
      achados_criticidade,
      planos_status,
    });
  } catch (error) {
    console.error("Error fetching relatórios:", error);
    return c.json({ error: "Failed to fetch relatórios" }, 500);
  }
});

// Unidades endpoints
app.get("/api/unidades", async (c) => {
  const db = c.env.DB;
  try {
    const unidades = await db.prepare(`
      SELECT 
        u.*,
        usr.nome as responsavel_nome
      FROM unidades u
      LEFT JOIN usuarios usr ON u.responsavel_id = usr.id
      ORDER BY u.nome
    `).all();
    return c.json(unidades.results);
  } catch (error) {
    console.error("Error fetching unidades:", error);
    return c.json({ error: "Failed to fetch unidades" }, 500);
  }
});

app.post("/api/unidades", async (c) => {
  const db = c.env.DB;
  try {
    const data = await c.req.json();
    const result = await db.prepare(`
      INSERT INTO unidades (nome, codigo, endereco, cidade, estado, ativa)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      data.nome,
      data.codigo,
      data.endereco || null,
      data.cidade || null,
      data.estado || null,
      data.ativa ? 1 : 0
    ).run();
    return c.json({ id: result.meta.last_row_id, ...data });
  } catch (error) {
    console.error("Error creating unidade:", error);
    return c.json({ error: "Failed to create unidade" }, 500);
  }
});

app.put("/api/unidades/:id", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  try {
    const data = await c.req.json();
    await db.prepare(`
      UPDATE unidades 
      SET nome = ?, codigo = ?, endereco = ?, cidade = ?, estado = ?, ativa = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      data.nome,
      data.codigo,
      data.endereco || null,
      data.cidade || null,
      data.estado || null,
      data.ativa ? 1 : 0,
      id
    ).run();
    return c.json({ success: true });
  } catch (error) {
    console.error("Error updating unidade:", error);
    return c.json({ error: "Failed to update unidade" }, 500);
  }
});

app.delete("/api/unidades/:id", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  try {
    await db.prepare("DELETE FROM unidades WHERE id = ?").bind(id).run();
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting unidade:", error);
    return c.json({ error: "Failed to delete unidade" }, 500);
  }
});

// Setores endpoints
app.get("/api/setores", async (c) => {
  const db = c.env.DB;
  try {
    const setores = await db.prepare(`
      SELECT 
        s.*,
        u.nome as unidade_nome,
        usr.nome as responsavel_nome
      FROM setores s
      LEFT JOIN unidades u ON s.unidade_id = u.id
      LEFT JOIN usuarios usr ON s.responsavel_id = usr.id
      ORDER BY u.nome, s.nome
    `).all();
    return c.json(setores.results);
  } catch (error) {
    console.error("Error fetching setores:", error);
    return c.json({ error: "Failed to fetch setores" }, 500);
  }
});

app.post("/api/setores", async (c) => {
  const db = c.env.DB;
  try {
    const data = await c.req.json();
    const result = await db.prepare(`
      INSERT INTO setores (unidade_id, nome, codigo, tipo, ativo)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      data.unidade_id,
      data.nome,
      data.codigo,
      data.tipo || null,
      data.ativo ? 1 : 0
    ).run();
    return c.json({ id: result.meta.last_row_id, ...data });
  } catch (error) {
    console.error("Error creating setor:", error);
    return c.json({ error: "Failed to create setor" }, 500);
  }
});

app.put("/api/setores/:id", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  try {
    const data = await c.req.json();
    await db.prepare(`
      UPDATE setores 
      SET unidade_id = ?, nome = ?, codigo = ?, tipo = ?, ativo = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      data.unidade_id,
      data.nome,
      data.codigo,
      data.tipo || null,
      data.ativo ? 1 : 0,
      id
    ).run();
    return c.json({ success: true });
  } catch (error) {
    console.error("Error updating setor:", error);
    return c.json({ error: "Failed to update setor" }, 500);
  }
});

app.delete("/api/setores/:id", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  try {
    await db.prepare("DELETE FROM setores WHERE id = ?").bind(id).run();
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting setor:", error);
    return c.json({ error: "Failed to delete setor" }, 500);
  }
});

// Checklists endpoint
app.get("/api/checklists", async (c) => {
  const db = c.env.DB;
  try {
    const checklists = await db.prepare(`
      SELECT id, nome, descricao, tipo, dimensao_ona, versao, ativo
      FROM checklists
      WHERE ativo = 1
      ORDER BY nome
    `).all();
    return c.json(checklists.results);
  } catch (error) {
    console.error("Error fetching checklists:", error);
    return c.json({ error: "Failed to fetch checklists" }, 500);
  }
});

// Usuarios endpoints
app.get("/api/usuarios", async (c) => {
  const db = c.env.DB;
  try {
    const usuarios = await db.prepare(`
      SELECT id, nome, email, perfil, ativo, ultimo_acesso, created_at, updated_at
      FROM usuarios
      ORDER BY nome
    `).all();
    return c.json(usuarios.results);
  } catch (error) {
    console.error("Error fetching usuarios:", error);
    return c.json({ error: "Failed to fetch usuarios" }, 500);
  }
});

app.post("/api/usuarios", async (c) => {
  const db = c.env.DB;
  try {
    const data = await c.req.json();
    const result = await db.prepare(`
      INSERT INTO usuarios (nome, email, perfil, ativo)
      VALUES (?, ?, ?, ?)
    `).bind(
      data.nome,
      data.email,
      data.perfil,
      data.ativo ? 1 : 0
    ).run();
    return c.json({ id: result.meta.last_row_id, ...data });
  } catch (error) {
    console.error("Error creating usuario:", error);
    return c.json({ error: "Failed to create usuario" }, 500);
  }
});

app.put("/api/usuarios/:id", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  try {
    const data = await c.req.json();
    await db.prepare(`
      UPDATE usuarios 
      SET nome = ?, email = ?, perfil = ?, ativo = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      data.nome,
      data.email,
      data.perfil,
      data.ativo ? 1 : 0,
      id
    ).run();
    return c.json({ success: true });
  } catch (error) {
    console.error("Error updating usuario:", error);
    return c.json({ error: "Failed to update usuario" }, 500);
  }
});

app.delete("/api/usuarios/:id", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  try {
    await db.prepare("DELETE FROM usuarios WHERE id = ?").bind(id).run();
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting usuario:", error);
    return c.json({ error: "Failed to delete usuario" }, 500);
  }
});

// Upload photo evidence
app.post("/api/upload/evidencia", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    const auditoriaId = formData.get("auditoria_id") as string;
    const requisitoId = formData.get("requisito_id") as string;

    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split(".").pop() || "jpg";
    const filename = `${timestamp}.${extension}`;
    const key = `evidencias/${auditoriaId}/${requisitoId}/${filename}`;

    // Upload to R2
    await c.env.R2_BUCKET.put(key, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
    });

    // Return public URL
    const url = `/api/files/${key}`;
    return c.json({ url });
  } catch (error) {
    console.error("Error uploading file:", error);
    return c.json({ error: "Failed to upload file" }, 500);
  }
});

// Download file from R2
app.get("/api/files/*", async (c) => {
  try {
    const key = c.req.path.replace("/api/files/", "");
    const object = await c.env.R2_BUCKET.get(key);

    if (!object) {
      return c.json({ error: "File not found" }, 404);
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("cache-control", "public, max-age=31536000");

    return c.body(object.body, { headers });
  } catch (error) {
    console.error("Error downloading file:", error);
    return c.json({ error: "Failed to download file" }, 500);
  }
});

export default app;
