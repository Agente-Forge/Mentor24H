/* ═══════════════════════════════════════════════════════════
   DB — LocalStorage data layer
═══════════════════════════════════════════════════════════ */

const DB = (() => {
  const KEY = {
    config:       'finflow.config',
    contas:       'finflow.contas',
    cats:         'finflow.cats',
    txs:          'finflow.txs',
    metas:        'finflow.metas',
    movs:         'finflow.movs',
    kanban:       'finflow.kanban',
    seeded:       'finflow.seeded',
    agenda:       'mentor24h.agenda',
    medicamentos: 'mentor24h.medicamentos',
    medDoses:     'mentor24h.med-doses',
    consultas:    'mentor24h.consultas',
    tarefas:      'mentor24h.tarefas',
    contatos:     'mentor24h.contatos',
    produtos:     'mentor24h.produtos',
    vendas:       'mentor24h.vendas',
    clientesNeg:  'mentor24h.clientes-neg',
    chatContatos: 'mentor24h.chat-contatos',
    chatMsgs:     'mentor24h.chat-msgs',
    llmConfig:    'mentor24h.llm-config',
    llmConversas: 'mentor24h.llm-conversas',
    schemaVersion:'mentor24h.schema-version',
  };

  function read(k, def = []) {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : def;
    } catch {
      return def;
    }
  }

  function write(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
      if (window.Cloud && Cloud.getUserId()) {
        Cloud.sync(k, v).catch(e => console.warn('[DB] sync error:', e));
      }
      return true;
    } catch (e) {
      console.error('Storage error:', e);
      return false;
    }
  }

  /* ═══ CONFIG ═══ */
  function getConfig() {
    return Object.assign({
      tema: 'dark', moeda: 'BRL',
      nomeUsuario: 'Você',
      saldoInicial: 0,
      avatarCor: '#A78BFA',
      avatar: 'masc-1',
    }, read(KEY.config, null) || {});
  }

  function saveConfig(patch) {
    const merged = Object.assign(getConfig(), patch || {});
    write(KEY.config, merged);
    return merged;
  }

  /* ═══ CATEGORIAS ═══ */
  const CATS_DEFAULT = [
    { id: 'moradia',     nome: 'Moradia',      cor: '#A78BFA', icone: 'home', ordem: 0 },
    { id: 'alimentacao', nome: 'Alimentação',  cor: '#F472B6', icone: 'utensils', ordem: 1 },
    { id: 'transporte',  nome: 'Transporte',   cor: '#FB923C', icone: 'car', ordem: 2 },
    { id: 'saude',       nome: 'Saúde',        cor: '#5EE39A', icone: 'heart-pulse', ordem: 3 },
    { id: 'educacao',    nome: 'Educação',      cor: '#7BB6FF', icone: 'graduation-cap', ordem: 4 },
    { id: 'lazer',       nome: 'Lazer',         cor: '#FBBF24', icone: 'gamepad-2', ordem: 5 },
    { id: 'servicos',    nome: 'Serviços',      cor: '#22D3EE', icone: 'wifi', ordem: 6 },
    { id: 'investimento',nome: 'Investimento',  cor: '#D4A843', icone: 'trending-up', ordem: 7 },
    { id: 'outros',      nome: 'Outros',        cor: '#8085A8', icone: 'circle-dot', ordem: 8 },
  ];

  function getCategorias() {
    const stored = read(KEY.cats, null);
    return (stored && stored.length) ? stored : CATS_DEFAULT;
  }

  function getCategoria(id) {
    return getCategorias().find(c => c.id === id) || CATS_DEFAULT[CATS_DEFAULT.length - 1];
  }

  function saveCategoria(data) {
    const cats = getCategorias().slice();
    if (data.id) {
      const idx = cats.findIndex(c => c.id === data.id);
      if (idx >= 0) {
        cats[idx] = Object.assign({}, cats[idx], data);
      } else {
        cats.push(Object.assign({ ordem: cats.length }, data));
      }
    } else {
      cats.push(Object.assign({ id: Utils.uid(), ordem: cats.length }, data));
    }
    write(KEY.cats, cats);
    return cats;
  }

  function deleteCategoria(id) {
    if (CATS_DEFAULT.find(c => c.id === id)) return false;
    const cats = getCategorias().filter(c => c.id !== id);
    write(KEY.cats, cats);
    return true;
  }

  /* ═══ CONTAS ═══ */
  function getContas(filtros = {}) {
    let arr = read(KEY.contas, []);
    if (filtros.status && filtros.status !== 'todas') arr = arr.filter(c => c.status === filtros.status);
    if (filtros.categoria && filtros.categoria !== 'todas') arr = arr.filter(c => c.categoria === filtros.categoria);
    if (filtros.tipo && filtros.tipo !== 'todas') {
      if (filtros.tipo === 'recorrente') arr = arr.filter(c => c.recorrente);
      else if (filtros.tipo === 'parcelada') arr = arr.filter(c => c.parcelado);
      else if (filtros.tipo === 'normal') arr = arr.filter(c => !c.recorrente && !c.parcelado);
    }
    if (filtros.dataInicio) arr = arr.filter(c => !c.dataVencimento || c.dataVencimento >= filtros.dataInicio);
    if (filtros.dataFim)    arr = arr.filter(c => !c.dataVencimento || c.dataVencimento <= filtros.dataFim);
    if (filtros.busca) {
      const q = filtros.busca.toLowerCase();
      arr = arr.filter(c =>
        (c.descricao || '').toLowerCase().includes(q) ||
        (c.observacoes || '').toLowerCase().includes(q)
      );
    }
    return arr.sort((a, b) => {
      if (!a.dataVencimento && !b.dataVencimento) return 0;
      if (!a.dataVencimento) return 1;
      if (!b.dataVencimento) return -1;
      return a.dataVencimento.localeCompare(b.dataVencimento);
    });
  }

  function getConta(id) {
    return read(KEY.contas, []).find(c => c.id === id) || null;
  }

  function saveConta(data) {
    const arr = read(KEY.contas, []);
    const now = new Date().toISOString();
    if (data.id) {
      const idx = arr.findIndex(c => c.id === data.id);
      if (idx >= 0) {
        arr[idx] = Object.assign({}, arr[idx], data, { atualizadoEm: now });
        write(KEY.contas, arr);
        return arr[idx];
      }
    }
    const novo = Object.assign({
      id: Utils.uid(),
      descricao: '', valor: 0,
      dataVencimento: null, dataPagamento: null,
      categoria: 'outros', observacoes: '',
      status: 'pendente',
      recorrente: false, intervaloRecorrencia: null, recorrenciaAtiva: false,
      parcelado: false, totalParcelas: null, parcelaAtual: null, grupoParcelamento: null,
      criadoEm: now, atualizadoEm: now,
    }, data, { id: Utils.uid() });
    arr.push(novo);
    write(KEY.contas, arr);
    return novo;
  }

  function gerarParcelas(base, n) {
    const grupo = Utils.uid();
    const valorPorParcela = +(base.valor / n).toFixed(2);
    const startDate = base.dataVencimento || todayISO();
    const out = [];
    for (let i = 1; i <= n; i++) {
      const d = Utils.parseISO(startDate);
      d.setMonth(d.getMonth() + (i - 1));
      const venc = d.toISOString().split('T')[0];
      out.push(saveConta({
        descricao: base.descricao,
        valor: valorPorParcela,
        dataVencimento: venc,
        categoria: base.categoria,
        observacoes: base.observacoes || '',
        parcelado: true,
        totalParcelas: n,
        parcelaAtual: i,
        grupoParcelamento: grupo,
        status: 'pendente',
      }));
    }
    return out;
  }

  function pagarConta(id, data, metodo, obs) {
    const arr = read(KEY.contas, []);
    const idx = arr.findIndex(c => c.id === id);
    if (idx < 0) return null;
    const c = arr[idx];
    c.status = 'paga';
    c.dataPagamento = data || todayISO();
    c.atualizadoEm = new Date().toISOString();
    write(KEY.contas, arr);

    saveTransacao({
      contaId: id,
      tipo: 'saida',
      valor: c.valor,
      data: c.dataPagamento,
      descricao: c.descricao,
      categoria: c.categoria,
      metodo: metodo || 'outros',
      observacao: obs || '',
    });

    if (c.recorrente && c.recorrenciaAtiva && c.intervaloRecorrencia) {
      saveConta({
        descricao: c.descricao,
        valor: c.valor,
        categoria: c.categoria,
        observacoes: c.observacoes,
        recorrente: true,
        intervaloRecorrencia: c.intervaloRecorrencia,
        recorrenciaAtiva: true,
        dataVencimento: Utils.nextRecurrence(c.dataVencimento || c.dataPagamento, c.intervaloRecorrencia),
        status: 'pendente',
      });
    }
    return c;
  }

  function deleteConta(id) {
    write(KEY.contas, read(KEY.contas, []).filter(c => c.id !== id));
  }

  function deleteGrupoParcelamento(grupo) {
    write(KEY.contas, read(KEY.contas, []).filter(c => c.grupoParcelamento !== grupo));
  }

  function updateStatusContas() {
    const today = todayISO();
    const arr = read(KEY.contas, []);
    let dirty = false;
    arr.forEach(c => {
      if (c.status === 'pendente' && c.dataVencimento && c.dataVencimento < today) {
        c.status = 'atrasada';
        dirty = true;
      }
    });
    if (dirty) write(KEY.contas, arr);
  }

  /* ═══ TRANSAÇÕES ═══ */
  function getTransacoes(filtros = {}) {
    let arr = read(KEY.txs, []);
    if (filtros.tipo && filtros.tipo !== 'todas') arr = arr.filter(t => t.tipo === filtros.tipo);
    if (filtros.dataInicio) arr = arr.filter(t => t.data >= filtros.dataInicio);
    if (filtros.dataFim)    arr = arr.filter(t => t.data <= filtros.dataFim);
    if (filtros.categoria && filtros.categoria !== 'todas') arr = arr.filter(t => t.categoria === filtros.categoria);
    return arr.sort((a, b) => {
      const cmp = (b.data || '').localeCompare(a.data || '');
      return cmp !== 0 ? cmp : (b.criadoEm || '').localeCompare(a.criadoEm || '');
    });
  }

  function saveTransacao(data) {
    const arr = read(KEY.txs, []);
    const novo = Object.assign({
      id: Utils.uid(),
      contaId: null, tipo: 'saida',
      valor: 0, data: todayISO(),
      descricao: '', categoria: null,
      metodo: 'outros',
      criadoEm: new Date().toISOString(),
    }, data, { id: Utils.uid() });
    arr.push(novo);
    write(KEY.txs, arr);
    return novo;
  }

  function deleteTransacao(id) {
    write(KEY.txs, read(KEY.txs, []).filter(t => t.id !== id));
  }

  /* ═══ METAS ═══ */
  function getMetas() {
    return read(KEY.metas, []).slice().sort((a, b) => (a.criadoEm || '').localeCompare(b.criadoEm || ''));
  }

  function getMeta(id) {
    return read(KEY.metas, []).find(m => m.id === id) || null;
  }

  function saveMeta(data) {
    const arr = read(KEY.metas, []);
    const now = new Date().toISOString();
    if (data.id) {
      const idx = arr.findIndex(m => m.id === data.id);
      if (idx >= 0) {
        arr[idx] = Object.assign({}, arr[idx], data, { atualizadoEm: now });
        write(KEY.metas, arr);
        return arr[idx];
      }
    }
    const novo = Object.assign({
      id: Utils.uid(),
      nome: '', descricao: '',
      icone: 'piggy-bank', cor: '#A78BFA',
      valorAlvo: 0, prazo: null,
      status: 'ativa',
      criadoEm: now, atualizadoEm: now,
    }, data, { id: Utils.uid() });
    arr.push(novo);
    write(KEY.metas, arr);
    return novo;
  }

  function deleteMeta(id) {
    write(KEY.metas, read(KEY.metas, []).filter(m => m.id !== id));
    write(KEY.movs, read(KEY.movs, []).filter(m => m.metaId !== id));
  }

  function getValorMeta(metaId) {
    return getMovimentos(metaId).reduce((s, m) => s + (m.tipo === 'deposito' ? m.valor : -m.valor), 0);
  }

  function getMovimentos(metaId) {
    return read(KEY.movs, [])
      .filter(m => m.metaId === metaId)
      .sort((a, b) => (b.data || '').localeCompare(a.data || ''));
  }

  function saveMovimento(data) {
    const arr = read(KEY.movs, []);
    const novo = Object.assign({
      id: Utils.uid(),
      metaId: '', tipo: 'deposito',
      valor: 0, descricao: '',
      data: todayISO(),
      criadoEm: new Date().toISOString(),
    }, data, { id: Utils.uid() });
    arr.push(novo);
    write(KEY.movs, arr);

    const meta = getMeta(novo.metaId);
    if (meta && meta.status === 'ativa') {
      const total = getValorMeta(novo.metaId);
      if (total >= meta.valorAlvo) {
        saveMeta({ id: meta.id, status: 'concluida' });
      }
    }
    return novo;
  }

  function deleteMovimento(id) {
    write(KEY.movs, read(KEY.movs, []).filter(m => m.id !== id));
  }

  /* ═══ KANBAN ═══ */
  function getKanban(coluna) {
    let arr = read(KEY.kanban, []);
    if (coluna) arr = arr.filter(c => c.coluna === coluna);
    return arr.slice().sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
  }

  function getKanbanCard(id) {
    return read(KEY.kanban, []).find(c => c.id === id) || null;
  }

  function saveKanbanCard(data) {
    const arr = read(KEY.kanban, []);
    const now = new Date().toISOString();
    if (data.id) {
      const idx = arr.findIndex(c => c.id === data.id);
      if (idx >= 0) {
        arr[idx] = Object.assign({}, arr[idx], data);
        write(KEY.kanban, arr);
        return arr[idx];
      }
    }
    const colCount = arr.filter(c => c.coluna === (data.coluna || 'todo')).length;
    const novo = Object.assign({
      id: Utils.uid(),
      coluna: 'todo', titulo: '', descricao: null,
      prioridade: null, etiquetas: [],
      ordem: colCount,
      criadoEm: now,
    }, data, { id: Utils.uid() });
    arr.push(novo);
    write(KEY.kanban, arr);
    return novo;
  }

  function moveKanbanCard(id, novaColuna) {
    const arr = read(KEY.kanban, []);
    const idx = arr.findIndex(c => c.id === id);
    if (idx < 0) return;
    arr[idx].coluna = novaColuna;
    arr[idx].ordem = arr.filter(c => c.coluna === novaColuna && c.id !== id).length;
    write(KEY.kanban, arr);
  }

  function deleteKanbanCard(id) {
    write(KEY.kanban, read(KEY.kanban, []).filter(c => c.id !== id));
  }

  /* ═══ STATS ═══ */
  function getStats(start, end) {
    const contas = getContas({ dataInicio: start, dataFim: end });
    const total      = contas.reduce((s, c) => s + c.valor, 0);
    const pagas      = contas.filter(c => c.status === 'paga');
    const totalPago  = pagas.reduce((s, c) => s + c.valor, 0);
    const pendentes  = contas.filter(c => c.status === 'pendente');
    const atrasadas  = contas.filter(c => c.status === 'atrasada');
    const txs        = getTransacoes({ dataInicio: start, dataFim: end });
    const entradas   = txs.filter(t => t.tipo === 'entrada').reduce((s, t) => s + t.valor, 0);
    const saidas     = txs.filter(t => t.tipo === 'saida').reduce((s, t) => s + t.valor, 0);
    const cfg        = getConfig();
    const saldo      = (cfg.saldoInicial || 0) + entradas - saidas;
    const health     = healthScore(total, totalPago, atrasadas.length, pendentes.length);
    return { total, totalPago, totalPendente: total - totalPago, pagas, pendentes, atrasadas, entradas, saidas, saldo, health, contas };
  }

  function healthScore(total, pago, nAtrasadas, nPendentes) {
    if (total === 0) return 100;
    const pctPago = pago / total;
    let score = pctPago * 70;
    score += Math.max(0, 30 - nAtrasadas * 12);
    return Utils.clamp(Math.round(score), 0, 100);
  }

  /* ═══ EXPORT/IMPORT ═══ */
  function exportAll() {
    return {
      version: 3,
      exportedAt: new Date().toISOString(),
      /* finflow.* */
      config:       getConfig(),
      categorias:   getCategorias(),
      contas:       read(KEY.contas, []),
      transacoes:   read(KEY.txs, []),
      metas:        read(KEY.metas, []),
      movimentos:   read(KEY.movs, []),
      kanban:       read(KEY.kanban, []),
      /* mentor24h.* */
      agenda:       read(KEY.agenda, []),
      medicamentos: read(KEY.medicamentos, []),
      medDoses:     read(KEY.medDoses, []),
      tarefas:      read(KEY.tarefas, []),
      contatos:     read(KEY.contatos, []),
      produtos:     read(KEY.produtos, []),
      vendas:       read(KEY.vendas, []),
      clientesNeg:  read(KEY.clientesNeg, []),
      chatContatos: read(KEY.chatContatos, []),
      chatMsgs:     read(KEY.chatMsgs, []),
      llmConversas: read(KEY.llmConversas, []),
    };
  }

  function importAll(data) {
    if (!data || typeof data !== 'object') return false;
    /* finflow.* */
    if (data.config)       write(KEY.config, data.config);
    if (data.categorias)   write(KEY.cats, data.categorias);
    if (data.contas)       write(KEY.contas, data.contas);
    if (data.transacoes)   write(KEY.txs, data.transacoes);
    if (data.metas)        write(KEY.metas, data.metas);
    if (data.movimentos)   write(KEY.movs, data.movimentos);
    if (data.kanban)       write(KEY.kanban, data.kanban);
    /* mentor24h.* */
    if (data.agenda)       write(KEY.agenda, data.agenda);
    if (data.medicamentos) write(KEY.medicamentos, data.medicamentos);
    if (data.medDoses)     write(KEY.medDoses, data.medDoses);
    if (data.tarefas)      write(KEY.tarefas, data.tarefas);
    if (data.contatos)     write(KEY.contatos, data.contatos);
    if (data.produtos)     write(KEY.produtos, data.produtos);
    if (data.vendas)       write(KEY.vendas, data.vendas);
    if (data.clientesNeg)  write(KEY.clientesNeg, data.clientesNeg);
    if (data.chatContatos) write(KEY.chatContatos, data.chatContatos);
    if (data.chatMsgs)     write(KEY.chatMsgs, data.chatMsgs);
    if (data.llmConversas) write(KEY.llmConversas, data.llmConversas);
    return true;
  }

  function clearAll() {
    Object.values(KEY).forEach(k => localStorage.removeItem(k));
  }

  /* ═══ SEED ═══ */
  function isSeeded() { return localStorage.getItem(KEY.seeded) === '1'; }

  function seed() {
    if (isSeeded()) return;
    const off = (n) => Utils.addDays(todayISO(), n);

    write(KEY.cats, CATS_DEFAULT);

    const contasBase = [
      { descricao: 'Aluguel', valor: 1850, dataVencimento: off(5), categoria: 'moradia', recorrente: true, intervaloRecorrencia: 'mensal', recorrenciaAtiva: true },
      { descricao: 'Internet 500MB', valor: 119.90, dataVencimento: off(3), categoria: 'servicos', recorrente: true, intervaloRecorrencia: 'mensal', recorrenciaAtiva: true },
      { descricao: 'Conta de Luz', valor: 245.30, dataVencimento: off(8), categoria: 'moradia' },
      { descricao: 'Academia', valor: 129.90, dataVencimento: off(2), categoria: 'saude', recorrente: true, intervaloRecorrencia: 'mensal', recorrenciaAtiva: true },
      { descricao: 'Mercado', valor: 384.50, dataVencimento: off(1), categoria: 'alimentacao', status: 'paga', dataPagamento: off(-1) },
      { descricao: 'Combustível', valor: 230.00, dataVencimento: off(-3), categoria: 'transporte', status: 'atrasada' },
      { descricao: 'Spotify Family', valor: 21.90, dataVencimento: off(10), categoria: 'lazer', recorrente: true, intervaloRecorrencia: 'mensal', recorrenciaAtiva: true },
      { descricao: 'Netflix', valor: 55.90, dataVencimento: off(12), categoria: 'lazer', recorrente: true, intervaloRecorrencia: 'mensal', recorrenciaAtiva: true },
      { descricao: 'Farmácia', valor: 145.00, dataVencimento: off(-2), categoria: 'saude', status: 'paga', dataPagamento: off(-2) },
      { descricao: 'Plano de Saúde', valor: 487.00, dataVencimento: off(15), categoria: 'saude', recorrente: true, intervaloRecorrencia: 'mensal', recorrenciaAtiva: true },
      { descricao: 'Aporte Tesouro', valor: 500, dataVencimento: off(20), categoria: 'investimento', recorrente: true, intervaloRecorrencia: 'mensal', recorrenciaAtiva: true },
    ];
    contasBase.forEach(c => saveConta(c));

    // Parcelamento: TV em 12x
    const grupo = Utils.uid();
    for (let i = 1; i <= 12; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() + (i - 3));
      saveConta({
        descricao: 'Smart TV 65"',
        valor: 419.90,
        categoria: 'lazer',
        parcelado: true, totalParcelas: 12, parcelaAtual: i,
        grupoParcelamento: grupo,
        dataVencimento: d.toISOString().split('T')[0],
        status: i <= 3 ? 'paga' : 'pendente',
        dataPagamento: i <= 3 ? d.toISOString().split('T')[0] : null,
      });
    }

    const txsBase = [
      { tipo: 'entrada', valor: 6500, data: off(-5), descricao: 'Salário', metodo: 'ted' },
      { tipo: 'entrada', valor: 1200, data: off(-12), descricao: 'Freelance design', metodo: 'pix' },
      { tipo: 'entrada', valor: 380, data: off(-18), descricao: 'Venda Marketplace', metodo: 'pix' },
      { tipo: 'saida', valor: 145, data: off(-2), descricao: 'Farmácia', categoria: 'saude', metodo: 'pix' },
      { tipo: 'saida', valor: 384.50, data: off(-1), descricao: 'Mercado semanal', categoria: 'alimentacao', metodo: 'cartao_debito' },
      { tipo: 'saida', valor: 89.90, data: off(-6), descricao: 'Restaurante', categoria: 'alimentacao', metodo: 'pix' },
      { tipo: 'saida', valor: 1850, data: off(-30), descricao: 'Aluguel', categoria: 'moradia', metodo: 'ted' },
    ];
    txsBase.forEach(t => saveTransacao(t));

    const metasBase = [
      { nome: 'Viagem Europa', descricao: 'Portugal, Espanha e Itália — 21 dias', icone: 'plane', cor: '#A78BFA', valorAlvo: 18000, prazo: off(330) },
      { nome: 'Carro Novo', descricao: 'Trocar por um SUV compacto', icone: 'car', cor: '#5EE39A', valorAlvo: 45000, prazo: off(720) },
      { nome: 'Reserva de Emergência', descricao: '6 meses de despesas', icone: 'shield', cor: '#FBBF24', valorAlvo: 24000, prazo: off(180) },
      { nome: 'Notebook M4', descricao: 'MacBook Pro 14" novo', icone: 'laptop', cor: '#F472B6', valorAlvo: 14000, prazo: off(120) },
    ];
    metasBase.forEach(m => {
      const meta = saveMeta(m);
      const initialDeposit = m.valorAlvo * (0.15 + Math.random() * 0.25);
      saveMovimento({ metaId: meta.id, tipo: 'deposito', valor: Math.round(initialDeposit / 2), descricao: 'Depósito inicial', data: off(-30) });
      saveMovimento({ metaId: meta.id, tipo: 'deposito', valor: Math.round(initialDeposit / 2), descricao: 'Aporte mensal', data: off(-7) });
    });

    const kanbanBase = [
      { coluna: 'todo', titulo: 'Comparar planos de saúde', prioridade: 'alta', etiquetas: ['saúde', 'pesquisa'] },
      { coluna: 'todo', titulo: 'Renegociar internet', prioridade: 'media', etiquetas: ['economia'] },
      { coluna: 'todo', titulo: 'Estudar sobre Tesouro Direto', prioridade: 'baixa', etiquetas: ['investimento'] },
      { coluna: 'doing', titulo: 'Organizar documentos do IR', descricao: 'Reunir comprovantes e fazer declaração até abril', prioridade: 'alta', etiquetas: ['imposto'] },
      { coluna: 'doing', titulo: 'Revisar assinaturas', prioridade: 'media', etiquetas: ['economia'] },
      { coluna: 'done', titulo: 'Abrir conta no banco digital', prioridade: 'baixa', etiquetas: ['banco'] },
      { coluna: 'done', titulo: 'Cancelar assinatura jornal', prioridade: 'baixa', etiquetas: ['economia'] },
    ];
    kanbanBase.forEach((k, i) => saveKanbanCard(Object.assign({ ordem: i }, k)));

    saveConfig({
      tema: 'dark', moeda: 'BRL',
      nomeUsuario: 'Léo', saldoInicial: 3500,
      avatarCor: '#A78BFA',
    });

    localStorage.setItem(KEY.seeded, '1');
  }

  /* ═══ AGENDA ═══ */
  function getAgenda(filtros = {}) {
    let arr = read(KEY.agenda, []);
    if (filtros.data) arr = arr.filter(e => e.data === filtros.data);
    return arr.sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
  }
  function saveEvento(data) {
    const arr = read(KEY.agenda, []);
    const now = new Date().toISOString();
    if (data.id) {
      const idx = arr.findIndex(e => e.id === data.id);
      if (idx >= 0) { arr[idx] = Object.assign({}, arr[idx], data); write(KEY.agenda, arr); return arr[idx]; }
    }
    const novo = Object.assign({ id: Utils.uid(), titulo: '', data: todayISO(), hora: '09:00', tipo: 'pessoal', descricao: '', recorrente: false, criadoEm: now }, data, { id: Utils.uid() });
    arr.push(novo); write(KEY.agenda, arr); return novo;
  }
  function deleteEvento(id) { write(KEY.agenda, read(KEY.agenda, []).filter(e => e.id !== id)); }

  /* ═══ MEDICAMENTOS ═══ */
  function getMedicamentos() { return read(KEY.medicamentos, []); }
  function saveMedicamento(data) {
    const arr = read(KEY.medicamentos, []);
    const now = new Date().toISOString();
    if (data.id) {
      const idx = arr.findIndex(m => m.id === data.id);
      if (idx >= 0) { arr[idx] = Object.assign({}, arr[idx], data); write(KEY.medicamentos, arr); return arr[idx]; }
    }
    const novo = Object.assign({ id: Utils.uid(), nome: '', dosagem: '', horarios: [], frequencia: 'diario', estoque: 0, estoqueMinimo: 5, criadoEm: now }, data, { id: Utils.uid() });
    arr.push(novo); write(KEY.medicamentos, arr); return novo;
  }
  function deleteMedicamento(id) { write(KEY.medicamentos, read(KEY.medicamentos, []).filter(m => m.id !== id)); }
  function registrarDose(medId, data, doseIdx) {
    const doses = read(KEY.medDoses, []);
    doses.push({ id: Utils.uid(), medId, data: data || todayISO(), hora: new Date().toTimeString().slice(0, 5), doseIdx: doseIdx ?? 0 });
    write(KEY.medDoses, doses);
  }
  function getDoses(medId, data) {
    const doses = read(KEY.medDoses, []);
    return doses.filter(d => (!medId || d.medId === medId) && (!data || d.data === data));
  }
  function isDoseTomada(medId, data, doseIdx) {
    const d = doseIdx ?? 0;
    return read(KEY.medDoses, []).some(x => x.medId === medId && x.data === data && (x.doseIdx ?? 0) === d);
  }
  function desmarcarDose(medId, data, doseIdx) {
    const d = doseIdx ?? 0;
    write(KEY.medDoses, read(KEY.medDoses, []).filter(x => !(x.medId === medId && x.data === data && (x.doseIdx ?? 0) === d)));
  }

  /* ═══ CONSULTAS ═══ */
  function getConsultas() { return read(KEY.consultas, []); }
  function saveConsulta(data) {
    const arr = read(KEY.consultas, []);
    const novo = Object.assign({ id: Utils.uid(), criadoEm: new Date().toISOString(), status: 'agendada' }, data);
    arr.push(novo);
    write(KEY.consultas, arr);
    return novo;
  }
  function deleteConsulta(id) { write(KEY.consultas, read(KEY.consultas, []).filter(c => c.id !== id)); }
  function updateConsulta(id, patch) {
    const arr = read(KEY.consultas, []);
    const idx = arr.findIndex(c => c.id === id);
    if (idx >= 0) { arr[idx] = Object.assign({}, arr[idx], patch); write(KEY.consultas, arr); }
  }

  /* ═══ TAREFAS ═══ */
  function getTarefas(filtros = {}) {
    let arr = read(KEY.tarefas, []);
    if (filtros.status) arr = arr.filter(t => t.status === filtros.status);
    if (filtros.prioridade) arr = arr.filter(t => t.prioridade === filtros.prioridade);
    return arr.sort((a, b) => {
      const p = { alta: 0, media: 1, baixa: 2 };
      return (p[a.prioridade] || 1) - (p[b.prioridade] || 1);
    });
  }
  function saveTarefa(data) {
    const arr = read(KEY.tarefas, []);
    const now = new Date().toISOString();
    if (data.id) {
      const idx = arr.findIndex(t => t.id === data.id);
      if (idx >= 0) { arr[idx] = Object.assign({}, arr[idx], data); write(KEY.tarefas, arr); return arr[idx]; }
    }
    const novo = Object.assign({ id: Utils.uid(), titulo: '', descricao: '', prioridade: 'media', status: 'pendente', data: null, hora: null, recorrente: false, subtarefas: [], criadoEm: now }, data, { id: Utils.uid() });
    arr.push(novo); write(KEY.tarefas, arr); return novo;
  }
  function deleteTarefa(id) { write(KEY.tarefas, read(KEY.tarefas, []).filter(t => t.id !== id)); }

  /* ═══ CONTATOS ═══ */
  function _normalizeContato(c) {
    return Object.assign({
      empresa: '', cargo: '', contextos: [], kanbanStage: 'ativo',
      googleResourceName: null, atualizadoEm: c.criadoEm || new Date().toISOString(),
    }, c);
  }

  function getContatos(filtros = {}) {
    // backward-compat: string = busca simples
    if (typeof filtros === 'string') filtros = { busca: filtros };
    let arr = read(KEY.contatos, []).map(_normalizeContato);
    if (filtros.contexto && filtros.contexto !== 'todos')
      arr = arr.filter(c => (c.contextos || []).includes(filtros.contexto));
    if (filtros.tag)
      arr = arr.filter(c => (c.tags || []).includes(filtros.tag));
    if (filtros.busca) {
      const q = filtros.busca.toLowerCase();
      arr = arr.filter(c =>
        [c.nome, c.telefone, c.email, c.empresa, c.cargo,
          ...(c.tags || []), ...(c.contextos || [])].join(' ').toLowerCase().includes(q));
    }
    return arr.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
  }

  function saveContato(data) {
    const arr = read(KEY.contatos, []);
    const now = new Date().toISOString();
    if (data.id) {
      const idx = arr.findIndex(c => c.id === data.id);
      if (idx >= 0) {
        arr[idx] = Object.assign({}, arr[idx], data, { atualizadoEm: now });
        write(KEY.contatos, arr);
        return _normalizeContato(arr[idx]);
      }
    }
    const novo = _normalizeContato(Object.assign(
      { id: Utils.uid(), nome: '', telefone: '', email: '',
        tags: [], contextos: [], empresa: '', cargo: '',
        aniversario: null, notas: '', kanbanStage: 'ativo',
        googleResourceName: null, criadoEm: now, atualizadoEm: now },
      data, { id: Utils.uid() }
    ));
    arr.push(novo);
    write(KEY.contatos, arr);
    return novo;
  }

  function deleteContato(id) { write(KEY.contatos, read(KEY.contatos, []).filter(c => c.id !== id)); }

  /* ═══ PRODUTOS ═══ */
  function getProdutos(filtros = {}) {
    let arr = read(KEY.produtos, []);
    if (filtros.status) arr = arr.filter(p => p.status === filtros.status);
    if (filtros.busca) { const q = filtros.busca.toLowerCase(); arr = arr.filter(p => p.nome.toLowerCase().includes(q)); }
    return arr.sort((a, b) => a.nome.localeCompare(b.nome));
  }
  function saveProduto(data) {
    const arr = read(KEY.produtos, []);
    const now = new Date().toISOString();
    if (data.id) {
      const idx = arr.findIndex(p => p.id === data.id);
      if (idx >= 0) { arr[idx] = Object.assign({}, arr[idx], data); write(KEY.produtos, arr); return arr[idx]; }
    }
    const novo = Object.assign({ id: Utils.uid(), nome: '', descricao: '', preco: 0, custo: 0, categoria: '', estoque: 0, estoqueMinimo: 5, status: 'ativo', criadoEm: now }, data, { id: Utils.uid() });
    arr.push(novo); write(KEY.produtos, arr); return novo;
  }
  function deleteProduto(id) { write(KEY.produtos, read(KEY.produtos, []).filter(p => p.id !== id)); }

  /* ═══ VENDAS ═══ */
  function getVendas(filtros = {}) {
    let arr = read(KEY.vendas, []);
    if (filtros.dataInicio) arr = arr.filter(v => v.data >= filtros.dataInicio);
    if (filtros.dataFim)    arr = arr.filter(v => v.data <= filtros.dataFim);
    if (filtros.clienteId)  arr = arr.filter(v => v.clienteId === filtros.clienteId);
    return arr.sort((a, b) => b.data.localeCompare(a.data));
  }
  function saveVenda(data) {
    const arr = read(KEY.vendas, []);
    const now = new Date().toISOString();
    const novo = Object.assign({ id: Utils.uid(), data: todayISO(), clienteId: null, clienteNome: '', itens: [], total: 0, formaPagamento: 'dinheiro', status: 'paga', criadoEm: now }, data, { id: Utils.uid() });
    arr.push(novo); write(KEY.vendas, arr); return novo;
  }
  function deleteVenda(id) { write(KEY.vendas, read(KEY.vendas, []).filter(v => v.id !== id)); }

  /* ═══ CLIENTES NEGÓCIO ═══ */
  function getClientesNeg(busca) {
    let arr = read(KEY.clientesNeg, []);
    if (busca) { const q = busca.toLowerCase(); arr = arr.filter(c => (c.nome + c.telefone).toLowerCase().includes(q)); }
    return arr.sort((a, b) => a.nome.localeCompare(b.nome));
  }
  function saveClienteNeg(data) {
    const arr = read(KEY.clientesNeg, []);
    const now = new Date().toISOString();
    if (data.id) {
      const idx = arr.findIndex(c => c.id === data.id);
      if (idx >= 0) { arr[idx] = Object.assign({}, arr[idx], data); write(KEY.clientesNeg, arr); return arr[idx]; }
    }
    const novo = Object.assign({ id: Utils.uid(), nome: '', telefone: '', email: '', aniversario: null, notas: '', saldoDevedor: 0, criadoEm: now }, data, { id: Utils.uid() });
    arr.push(novo); write(KEY.clientesNeg, arr); return novo;
  }
  function deleteClienteNeg(id) { write(KEY.clientesNeg, read(KEY.clientesNeg, []).filter(c => c.id !== id)); }

  /* ═══ CHAT CONTATOS (WhatsApp) ═══ */
  function getChatContatos() { return read(KEY.chatContatos, []); }
  function saveChatContato(data) {
    const arr = read(KEY.chatContatos, []);
    if (data.id) {
      const idx = arr.findIndex(c => c.id === data.id);
      if (idx >= 0) { arr[idx] = Object.assign({}, arr[idx], data); write(KEY.chatContatos, arr); return arr[idx]; }
    }
    const novo = Object.assign({ id: Utils.uid(), nome: '', tel: '', avatar: '', tags: [], ultimaMensagem: '', naoLidas: 0 }, data, { id: Utils.uid() });
    arr.push(novo); write(KEY.chatContatos, arr); return novo;
  }

  function deleteChatContato(id) {
    write(KEY.chatContatos, read(KEY.chatContatos, []).filter(c => c.id !== id));
    write(KEY.chatMsgs, read(KEY.chatMsgs, []).filter(m => m.contatoId !== id));
  }

  /* ═══ CHAT MSGS (WhatsApp) ═══ */
  function getChatMsgs(contatoId) {
    return read(KEY.chatMsgs, []).filter(m => m.contatoId === contatoId);
  }
  function saveChatMsg(data) {
    const arr = read(KEY.chatMsgs, []);
    const novo = Object.assign({ id: Utils.uid(), contatoId: '', texto: '', de: 'eu', hora: new Date().toTimeString().slice(0, 5), status: 'enviado', criadoEm: new Date().toISOString() }, data, { id: Utils.uid() });
    arr.push(novo); write(KEY.chatMsgs, arr); return novo;
  }

  /* ═══ LLM CONFIG ═══
     Estrutura: { provider, apiKeys: {provider: key}, models: {provider: model}, systemPrompt }
     Cada provedor tem chave + modelo próprios (não compartilhados).
     `apiKey` e `model` são getters convenientes do provider atual.
  */
  function getLlmConfig() {
    const raw = read(KEY.llmConfig, null) || {};

    /* Migração v1 → v2: campo antigo `apiKey`/`model` vira por-provedor */
    if (raw.apiKey !== undefined && !raw.apiKeys) {
      raw.apiKeys = {};
      if (raw.apiKey) raw.apiKeys[raw.provider || 'openrouter'] = raw.apiKey;
      delete raw.apiKey;
    }
    if (raw.model !== undefined && !raw.models) {
      raw.models = {};
      if (raw.model) raw.models[raw.provider || 'openrouter'] = raw.model;
      delete raw.model;
    }

    /* Migração: systemPrompts antigos padrão → novo (Function Calling).
       Só substitui se for um dos prompts padrão. Customizações ficam intactas. */
    const SYSTEM_PROMPT_V1 = 'Você é o Mentor24h, um assistente pessoal e empresarial. Responda sempre em português brasileiro.';
    const SYSTEM_PROMPT_V2_PREFIX = 'Você é o Mentor24h, assistente pessoal e empresarial do usuário. Você tem acesso aos dados';
    const SYSTEM_PROMPT_V3_PREFIX = 'Você é o Mentor24h, assistente pessoal e empresarial do usuário. A cada mensagem você recebe um snapshot';
    const sp = raw.systemPrompt || '';
    if (sp === SYSTEM_PROMPT_V1 ||
        sp.startsWith(SYSTEM_PROMPT_V2_PREFIX) ||
        sp.startsWith(SYSTEM_PROMPT_V3_PREFIX)) {
      delete raw.systemPrompt;
    }

    const cfg = Object.assign({
      provider: 'openrouter',
      apiKeys: {},
      models: {},
      systemPrompt: 'Você é o Mentor24h, assistente pessoal e empresarial do usuário. Você tem ACESSO DIRETO aos dados do app dele via Function Calling — pode consultar contas, vendas, tarefas, metas, agenda, clientes, produtos, medicamentos a qualquer momento. REGRAS: (1) Sempre que o usuário pedir dados (quanto devo, quais contas, vendas do mês, etc.), CHAME a ferramenta apropriada — nunca invente. (2) Para datas relativas (hoje, ontem, mês passado, dezembro, semana que vem), chame getDataAtual() PRIMEIRO para obter as datas reais. (3) Os valores retornados pelas ferramentas já estão calculados — apresente-os ao usuário sem fazer aritmética. (4) Pode chamar várias ferramentas em sequência se precisar. (5) Responda em português brasileiro, valores em R$ X.XXX,XX (vírgula decimal). (6) Se a informação não existir no app, diga "Essa informação ainda não está cadastrada". (7) Para ações (criar conta, registrar venda), explique onde clicar no app.',
    }, raw);

    /* Getters convenientes do provider atual (usado pelas funções call*) */
    cfg.apiKey = (cfg.apiKeys && cfg.apiKeys[cfg.provider]) || '';
    cfg.model  = (cfg.models  && cfg.models[cfg.provider])  || '';
    return cfg;
  }

  function saveLlmConfig(patch) {
    const raw = read(KEY.llmConfig, {}) || {};
    if (!raw.apiKeys) raw.apiKeys = {};
    if (!raw.models)  raw.models  = {};

    /* Limpa campos legados v1 */
    delete raw.apiKey;
    delete raw.model;

    if (patch.provider)              raw.provider     = patch.provider;
    if (patch.systemPrompt !== undefined) raw.systemPrompt = patch.systemPrompt;

    const target = patch.provider || raw.provider || 'openrouter';
    if (patch.apiKey !== undefined) raw.apiKeys[target] = patch.apiKey;
    if (patch.model !== undefined)  raw.models[target]  = patch.model;

    write(KEY.llmConfig, raw);
    return getLlmConfig();
  }

  /* ═══ LLM CONVERSAS ═══ */
  function getLlmConversas() { return read(KEY.llmConversas, []); }
  function saveLlmConversa(data) {
    const arr = read(KEY.llmConversas, []);
    if (data.id) {
      const idx = arr.findIndex(c => c.id === data.id);
      if (idx >= 0) { arr[idx] = Object.assign({}, arr[idx], data); write(KEY.llmConversas, arr); return arr[idx]; }
    }
    const novo = Object.assign({ id: Utils.uid(), titulo: 'Nova conversa', msgs: [], criadoEm: new Date().toISOString() }, data, { id: Utils.uid() });
    arr.push(novo); write(KEY.llmConversas, arr); return novo;
  }
  function deleteLlmConversa(id) { write(KEY.llmConversas, read(KEY.llmConversas, []).filter(c => c.id !== id)); }

  /* ═══ SCHEMA MIGRATIONS ═══ */
  function runMigrations() {
    const v = parseInt(localStorage.getItem(KEY.schemaVersion) || '1', 10);

    if (v < 2) {
      /* v1 → v2: agenda ganha tipo/clienteId/valor;
                  tarefas ganha recorrencia;
                  produtos ganha custo/margemPct */
      const agenda = read(KEY.agenda, []);
      if (agenda.length) {
        write(KEY.agenda, agenda.map(ev =>
          Object.assign({ tipo: null, clienteId: null, valor: null }, ev)
        ));
      }

      const tarefas = read(KEY.tarefas, []);
      if (tarefas.length) {
        write(KEY.tarefas, tarefas.map(t =>
          Object.assign({ recorrencia: null }, t)
        ));
      }

      const produtos = read(KEY.produtos, []);
      if (produtos.length) {
        write(KEY.produtos, produtos.map(p =>
          Object.assign({ custo: null, margemPct: null }, p)
        ));
      }

      localStorage.setItem(KEY.schemaVersion, '2');
    }
  }

  /* Rodar migrations na carga do módulo */
  runMigrations();

  /* ═══ GENERIC CRUD (usado pelo Repository) ═══ */
  function getAll(collection) {
    const k = KEY[collection] || ('mentor24h.' + collection);
    return read(k, []);
  }

  function getById(collection, id) {
    return getAll(collection).find(x => x.id === id) || null;
  }

  function save(collection, item) {
    const k = KEY[collection] || ('mentor24h.' + collection);
    const arr = read(k, []);
    const idx = arr.findIndex(x => x.id === item.id);
    if (idx >= 0) {
      arr[idx] = item;
    } else {
      arr.push(item);
    }
    write(k, arr);
    return item;
  }

  function remove(collection, id) {
    const k = KEY[collection] || ('mentor24h.' + collection);
    write(k, read(k, []).filter(x => x.id !== id));
  }

  return {
    getConfig, saveConfig,
    getCategorias, getCategoria, saveCategoria, deleteCategoria,
    getContas, getConta, saveConta, gerarParcelas, pagarConta,
    deleteConta, deleteGrupoParcelamento, updateStatusContas,
    getTransacoes, saveTransacao, deleteTransacao,
    getMetas, getMeta, saveMeta, deleteMeta, getValorMeta,
    getMovimentos, saveMovimento, deleteMovimento,
    getKanban, getKanbanCard, saveKanbanCard, moveKanbanCard, deleteKanbanCard,
    getStats,
    getAgenda, saveEvento, deleteEvento,
    getMedicamentos, saveMedicamento, deleteMedicamento, registrarDose, getDoses, isDoseTomada, desmarcarDose,
    getConsultas, saveConsulta, deleteConsulta, updateConsulta,
    getTarefas, saveTarefa, deleteTarefa,
    getContatos, saveContato, deleteContato,
    getProdutos, saveProduto, deleteProduto,
    getVendas, saveVenda, deleteVenda,
    getClientesNeg, saveClienteNeg, deleteClienteNeg,
    getChatContatos, saveChatContato, deleteChatContato,
    getChatMsgs, saveChatMsg,
    getLlmConfig, saveLlmConfig,
    getLlmConversas, saveLlmConversa, deleteLlmConversa,
    exportAll, importAll, clearAll,
    seed, isSeeded,
    getAll, getById, save, remove,
    runMigrations,
  };
})();
