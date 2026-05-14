/* ═══════════════════════════════════════════════════════════
   LLM-TOOLS — Function Calling para IA acessar dados do app
   A IA pode chamar essas ferramentas dinamicamente para
   responder perguntas sobre QUALQUER dado, em QUALQUER período,
   sem depender de contexto pré-calculado.
═══════════════════════════════════════════════════════════ */

const LLMTools = (() => {

  /* ─── DEFINIÇÕES DAS FERRAMENTAS (formato OpenAI/Groq/OpenRouter) ─── */
  const TOOLS = [
    {
      type: "function",
      function: {
        name: "getDataAtual",
        description: "Retorna data atual e datas relativas calculadas (hoje, ontem, amanhã, mês atual, mês passado, semana atual, etc.). SEMPRE chame esta função PRIMEIRO quando o usuário usar termos relativos como 'hoje', 'amanhã', 'mês passado', 'semana que vem', 'dezembro'. Não tente calcular datas sozinho.",
        parameters: { type: "object", properties: {} }
      }
    },
    {
      type: "function",
      function: {
        name: "getContas",
        description: "Lista contas/dívidas/boletos do usuário com filtros opcionais. Use para responder perguntas sobre contas a pagar, contas pagas, dívidas, vencimentos, atrasadas. Retorna quantidade, valor total e lista detalhada.",
        parameters: {
          type: "object",
          properties: {
            mes: { type: "string", description: "Filtro por mês no formato YYYY-MM (ex: '2026-04' para abril/2026). Use 'atual' para o mês corrente. Omita para todas as datas." },
            status: { type: "string", enum: ["pendente", "paga", "atrasada", "todas"], description: "Filtro por status. 'todas' = sem filtro." },
            dataInicio: { type: "string", description: "Data de início no formato YYYY-MM-DD." },
            dataFim: { type: "string", description: "Data de fim no formato YYYY-MM-DD." },
            busca: { type: "string", description: "Busca por palavra na descrição (ex: 'aluguel', 'cartão')." }
          }
        }
      }
    },
    {
      type: "function",
      function: {
        name: "getResumoFinanceiroMes",
        description: "Retorna resumo financeiro consolidado de um mês: total original, total já pago, total ainda a pagar, total atrasado. Use quando perguntarem 'quanto devo em [mês]', 'quanto era o total de [mês]', etc.",
        parameters: {
          type: "object",
          properties: {
            mes: { type: "string", description: "Mês no formato YYYY-MM (ex: '2026-04'). Use 'atual' para o mês corrente." }
          },
          required: ["mes"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "getVendas",
        description: "Lista vendas do negócio com filtros opcionais. Use para perguntas sobre vendas, faturamento, vendas pendentes/fiado, vendas por cliente.",
        parameters: {
          type: "object",
          properties: {
            mes: { type: "string", description: "Filtro por mês YYYY-MM ou 'atual'." },
            data: { type: "string", description: "Filtro por dia específico YYYY-MM-DD. Use para 'vendas de hoje', 'vendas de ontem'." },
            status: { type: "string", enum: ["paga", "pendente", "fiado", "cancelada", "todas"], description: "Filtro por status." },
            cliente: { type: "string", description: "Busca por nome do cliente." }
          }
        }
      }
    },
    {
      type: "function",
      function: {
        name: "getClientes",
        description: "Lista clientes do negócio com filtros. Use para perguntas sobre clientes, quem está devendo, buscar cliente por nome.",
        parameters: {
          type: "object",
          properties: {
            busca: { type: "string", description: "Busca por nome ou telefone." },
            comDebito: { type: "boolean", description: "Se true, retorna só clientes com saldo devedor > 0." }
          }
        }
      }
    },
    {
      type: "function",
      function: {
        name: "getProdutos",
        description: "Lista produtos do catálogo com filtros. Use para perguntas sobre produtos, estoque baixo, produtos sem estoque, buscar produto.",
        parameters: {
          type: "object",
          properties: {
            busca: { type: "string", description: "Busca por nome." },
            status: { type: "string", enum: ["ativo", "inativo", "todos"], description: "Filtro por status." },
            estoqueBaixo: { type: "boolean", description: "Se true, retorna só produtos com estoque ≤ mínimo (e > 0)." },
            semEstoque: { type: "boolean", description: "Se true, retorna só produtos com estoque zerado." }
          }
        }
      }
    },
    {
      type: "function",
      function: {
        name: "getTarefas",
        description: "Lista tarefas/lembretes do usuário com filtros. Use para perguntas sobre tarefas, o que fazer hoje, tarefas atrasadas, pendentes.",
        parameters: {
          type: "object",
          properties: {
            status: { type: "string", enum: ["pendente", "concluida", "todas"], description: "Filtro por status." },
            data: { type: "string", description: "Filtro por dia específico YYYY-MM-DD." },
            atrasadas: { type: "boolean", description: "Se true, retorna só tarefas pendentes com data anterior a hoje." },
            hoje: { type: "boolean", description: "Se true, retorna só tarefas para hoje." }
          }
        }
      }
    },
    {
      type: "function",
      function: {
        name: "getEventos",
        description: "Lista eventos da agenda/calendário com filtros. Use para perguntas sobre agenda, compromissos, reuniões.",
        parameters: {
          type: "object",
          properties: {
            data: { type: "string", description: "Filtro por dia específico YYYY-MM-DD." },
            dataInicio: { type: "string", description: "Início do range YYYY-MM-DD." },
            dataFim: { type: "string", description: "Fim do range YYYY-MM-DD." }
          }
        }
      }
    },
    {
      type: "function",
      function: {
        name: "getMedicamentos",
        description: "Lista medicamentos cadastrados pelo usuário. Use para perguntas sobre remédios, posologia.",
        parameters: { type: "object", properties: {} }
      }
    },
    {
      type: "function",
      function: {
        name: "getMetas",
        description: "Lista metas/caixinhas de poupança com progresso atual calculado. Use para perguntas sobre objetivos financeiros, poupança, quanto falta para uma meta.",
        parameters: { type: "object", properties: {} }
      }
    },
    {
      type: "function",
      function: {
        name: "getConfigUsuario",
        description: "Retorna configuração do usuário: nome, moeda, saldo inicial configurado. Use para personalizar respostas.",
        parameters: { type: "object", properties: {} }
      }
    },
  ];

  /* ─── CONVERSORES DE FORMATO ─── */
  function forAnthropic() {
    return TOOLS.map(t => ({
      name: t.function.name,
      description: t.function.description,
      input_schema: t.function.parameters
    }));
  }

  function forGemini() {
    return [{
      function_declarations: TOOLS.map(t => ({
        name: t.function.name,
        description: t.function.description,
        parameters: t.function.parameters
      }))
    }];
  }

  /* ─── EXECUTORES — funções reais que rodam no browser ─── */
  function resolveMes(mes) {
    if (!mes || mes === 'atual') return new Date().toISOString().slice(0, 7);
    return mes;
  }

  function ehAtrasada(c) {
    const hoje = new Date().toISOString().slice(0, 10);
    return c.status !== 'paga' && c.dataVencimento && c.dataVencimento < hoje;
  }

  function mapConta(c) {
    return {
      descricao: c.descricao || '(sem descrição)',
      valor: c.valor || 0,
      dataVencimento: c.dataVencimento,
      dataPagamento: c.dataPagamento || null,
      status: c.status || 'pendente',
      categoria: c.categoria || null,
      atrasada: ehAtrasada(c),
    };
  }

  const EXECUTORS = {
    getDataAtual: () => {
      const hoje = new Date();
      const hojeISO = hoje.toISOString().slice(0, 10);
      const ontem  = new Date(hoje.getTime() - 86400000).toISOString().slice(0, 10);
      const amanha = new Date(hoje.getTime() + 86400000).toISOString().slice(0, 10);
      const mesAtual = hojeISO.slice(0, 7);

      const mesPassadoDate = new Date(hoje);
      mesPassadoDate.setMonth(mesPassadoDate.getMonth() - 1);
      const mesPassado = mesPassadoDate.toISOString().slice(0, 7);

      const mesProximoDate = new Date(hoje);
      mesProximoDate.setMonth(mesProximoDate.getMonth() + 1);
      const mesProximo = mesProximoDate.toISOString().slice(0, 7);

      const diaSemana = hoje.getDay();
      const inicioSemanaDate = new Date(hoje.getTime() - diaSemana * 86400000);
      const fimSemanaDate    = new Date(hoje.getTime() + (6 - diaSemana) * 86400000);

      return {
        hoje: hojeISO,
        ontem,
        amanha,
        mesAtual,
        mesPassado,
        mesProximo,
        inicioSemana: inicioSemanaDate.toISOString().slice(0, 10),
        fimSemana: fimSemanaDate.toISOString().slice(0, 10),
        diaSemanaTexto: hoje.toLocaleDateString('pt-BR', { weekday: 'long' }),
      };
    },

    getContas: (p = {}) => {
      let contas = DB.getContas();

      if (p.mes) {
        const mes = resolveMes(p.mes);
        contas = contas.filter(c => (c.dataVencimento || '').startsWith(mes));
      }
      if (p.status && p.status !== 'todas') {
        if (p.status === 'atrasada') {
          contas = contas.filter(c => ehAtrasada(c));
        } else {
          contas = contas.filter(c => c.status === p.status);
        }
      }
      if (p.dataInicio) contas = contas.filter(c => (c.dataVencimento || '') >= p.dataInicio);
      if (p.dataFim)    contas = contas.filter(c => (c.dataVencimento || '') <= p.dataFim);
      if (p.busca) {
        const q = p.busca.toLowerCase();
        contas = contas.filter(c => (c.descricao || '').toLowerCase().includes(q));
      }

      contas = contas.sort((a, b) => (a.dataVencimento || '').localeCompare(b.dataVencimento || ''));

      return {
        quantidade: contas.length,
        valorTotal: contas.reduce((s, c) => s + (c.valor || 0), 0),
        filtros: p,
        contas: contas.map(mapConta),
      };
    },

    getResumoFinanceiroMes: (p = {}) => {
      const mes = resolveMes(p.mes);
      const contas = DB.getContas().filter(c => (c.dataVencimento || '').startsWith(mes));
      const pagas = contas.filter(c => c.status === 'paga');
      const pendentes = contas.filter(c => c.status === 'pendente' || c.status === 'atrasada' || ehAtrasada(c));
      const atrasadas = contas.filter(c => ehAtrasada(c));

      return {
        mes,
        quantidadeTotal: contas.length,
        totalOriginal: contas.reduce((s, c) => s + (c.valor || 0), 0),
        quantidadePagas: pagas.length,
        totalPago: pagas.reduce((s, c) => s + (c.valor || 0), 0),
        quantidadePendentes: pendentes.length,
        totalAindaPagar: pendentes.reduce((s, c) => s + (c.valor || 0), 0),
        quantidadeAtrasadas: atrasadas.length,
        totalAtrasado: atrasadas.reduce((s, c) => s + (c.valor || 0), 0),
      };
    },

    getVendas: (p = {}) => {
      let vendas = DB.getVendas();

      if (p.mes) {
        const mes = resolveMes(p.mes);
        vendas = vendas.filter(v => (v.data || '').startsWith(mes));
      }
      if (p.data) vendas = vendas.filter(v => v.data === p.data);
      if (p.status && p.status !== 'todas') vendas = vendas.filter(v => v.status === p.status);
      if (p.cliente) {
        const q = p.cliente.toLowerCase();
        vendas = vendas.filter(v => (v.clienteNome || '').toLowerCase().includes(q));
      }

      vendas = vendas.sort((a, b) => (b.data || '').localeCompare(a.data || ''));

      return {
        quantidade: vendas.length,
        valorTotal: vendas.reduce((s, v) => s + (v.total || 0), 0),
        filtros: p,
        vendas: vendas.map(v => ({
          data: v.data,
          clienteNome: v.clienteNome || null,
          total: v.total || 0,
          status: v.status,
          formaPagamento: v.formaPagamento || null,
          itens: (v.itens || []).length,
        })),
      };
    },

    getClientes: (p = {}) => {
      let clientes = DB.getClientesNeg();

      if (p.busca) {
        const q = p.busca.toLowerCase();
        clientes = clientes.filter(c => (c.nome || '').toLowerCase().includes(q) || (c.telefone || '').includes(q));
      }
      if (p.comDebito) clientes = clientes.filter(c => (c.saldoDevedor || 0) > 0);

      clientes = clientes.sort((a, b) => (b.saldoDevedor || 0) - (a.saldoDevedor || 0));

      return {
        quantidade: clientes.length,
        totalDevedor: clientes.reduce((s, c) => s + (c.saldoDevedor || 0), 0),
        clientes: clientes.map(c => ({
          nome: c.nome,
          telefone: c.telefone || null,
          email: c.email || null,
          saldoDevedor: c.saldoDevedor || 0,
          notas: c.notas || null,
        })),
      };
    },

    getProdutos: (p = {}) => {
      let produtos = DB.getProdutos();

      if (p.busca) {
        const q = p.busca.toLowerCase();
        produtos = produtos.filter(prod => (prod.nome || '').toLowerCase().includes(q));
      }
      if (p.status && p.status !== 'todos') produtos = produtos.filter(prod => prod.status === p.status);
      if (p.estoqueBaixo) produtos = produtos.filter(prod => (prod.estoque || 0) > 0 && (prod.estoque || 0) <= (prod.estoqueMinimo || 0));
      if (p.semEstoque)   produtos = produtos.filter(prod => (prod.estoque || 0) === 0);

      return {
        quantidade: produtos.length,
        produtos: produtos.map(prod => ({
          nome: prod.nome,
          preco: prod.preco || 0,
          custo: prod.custo || 0,
          estoque: prod.estoque || 0,
          estoqueMinimo: prod.estoqueMinimo || 0,
          categoria: prod.categoria || null,
          status: prod.status || 'ativo',
        })),
      };
    },

    getTarefas: (p = {}) => {
      const hoje = new Date().toISOString().slice(0, 10);
      let tarefas = DB.getTarefas();

      if (p.status && p.status !== 'todas') tarefas = tarefas.filter(t => t.status === p.status);
      if (p.data) tarefas = tarefas.filter(t => t.data === p.data);
      if (p.atrasadas) tarefas = tarefas.filter(t => t.status !== 'concluida' && t.data && t.data < hoje);
      if (p.hoje)      tarefas = tarefas.filter(t => t.data === hoje);

      tarefas = tarefas.sort((a, b) => (a.data || '9999').localeCompare(b.data || '9999'));

      return {
        quantidade: tarefas.length,
        tarefas: tarefas.map(t => ({
          titulo: t.titulo,
          descricao: t.descricao || null,
          data: t.data || null,
          hora: t.hora || null,
          prioridade: t.prioridade || 'media',
          status: t.status,
        })),
      };
    },

    getEventos: (p = {}) => {
      let eventos = DB.getAgenda();

      if (p.data) eventos = eventos.filter(e => e.data === p.data);
      if (p.dataInicio) eventos = eventos.filter(e => (e.data || '') >= p.dataInicio);
      if (p.dataFim)    eventos = eventos.filter(e => (e.data || '') <= p.dataFim);

      eventos = eventos.sort((a, b) => (a.data + (a.hora || '')).localeCompare(b.data + (b.hora || '')));

      return {
        quantidade: eventos.length,
        eventos: eventos.map(e => ({
          titulo: e.titulo,
          data: e.data,
          hora: e.hora || null,
          tipo: e.tipo || null,
          descricao: e.descricao || null,
        })),
      };
    },

    getMedicamentos: () => {
      const meds = DB.getMedicamentos();
      return {
        quantidade: meds.length,
        medicamentos: meds.map(m => ({
          nome: m.nome,
          dosagem: m.dosagem || null,
          frequencia: m.frequencia || null,
          horarios: m.horarios || [],
          observacoes: m.observacoes || null,
        })),
      };
    },

    getMetas: () => {
      const metas = DB.getMetas();
      return {
        quantidade: metas.length,
        metas: metas.map(m => {
          const valorAtual = (DB.getValorMeta && DB.getValorMeta(m.id)) || 0;
          const valorAlvo = m.valorAlvo || 0;
          return {
            nome: m.nome,
            valorAlvo,
            valorAtual,
            percentual: valorAlvo ? Math.round(valorAtual / valorAlvo * 100) : 0,
            prazo: m.prazo || null,
            descricao: m.descricao || null,
          };
        }),
      };
    },

    getConfigUsuario: () => {
      const cfg = DB.getConfig();
      return {
        nome: cfg.nomeUsuario || 'Você',
        moeda: cfg.moeda || 'BRL',
        saldoInicial: cfg.saldoInicial || 0,
      };
    },
  };

  /* Execução com tratamento de erros */
  function execute(toolName, params) {
    const fn = EXECUTORS[toolName];
    if (!fn) return { erro: `Ferramenta '${toolName}' não existe` };
    try {
      return fn(params || {});
    } catch (e) {
      console.error(`[LLMTools] Erro em ${toolName}:`, e);
      return { erro: e.message };
    }
  }

  /* Nomes das tools (para debug e logs) */
  function listNames() {
    return TOOLS.map(t => t.function.name);
  }

  return {
    TOOLS,
    forAnthropic,
    forGemini,
    execute,
    listNames,
  };
})();
