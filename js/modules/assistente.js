/* ═══════════════════════════════════════════════════════════
   ASSISTENTE — Insights proativos locais (Task 3.9)
   5 tipos de insight + dismiss persiste 7 dias em localStorage
═══════════════════════════════════════════════════════════ */

const Assistente = (() => {
  const KEY_DISMISS = 'mentor24h.insights-dispensados';
  const TTL_DIAS    = 7;

  /* ─── API pública ─── */

  function getInsights() {
    const dispensados = _getDispensados();
    const todos       = _gerarTodos();
    return todos.filter(ins => !dispensados[ins.id]);
  }

  function dispensar(insightId) {
    const dispensados    = _getDispensados();
    dispensados[insightId] = Date.now();
    _salvarDispensados(dispensados);
  }

  /* ─── Geração dos 5 tipos de insight ─── */

  function _gerarTodos() {
    const insights = [];
    const hoje     = new Date();

    // TIPO 1 — Conta vencendo nos próximos 3 dias
    try {
      const contas = DB.getContas({ status: 'pendente' });
      contas.forEach(c => {
        if (!c.vencimento) return;
        const venc   = new Date(c.vencimento + 'T00:00:00');
        const diffMs = venc - hoje;
        const dias   = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        if (dias >= 0 && dias <= 3) {
          insights.push({
            id:      `conta-vence-${c.id}`,
            tipo:    'alerta',
            texto:   dias === 0
              ? `Conta "${esc(c.descricao || c.nome || 'sem nome')}" vence hoje!`
              : `Conta "${esc(c.descricao || c.nome || 'sem nome')}" vence em ${dias} dia${dias !== 1 ? 's' : ''}.`,
            acao:    { label: 'Ver contas', pagina: 'financas' },
          });
        }
      });
    } catch (_) {}

    // TIPO 2 — Cliente inativo há 30 dias
    try {
      const vendas    = DB.getVendas();
      const clientes  = DB.getClientesNeg();
      const limite    = new Date(hoje);
      limite.setDate(limite.getDate() - 30);
      const limiteISO = limite.toISOString().slice(0, 10);

      clientes.forEach(c => {
        const ultimaVenda = vendas
          .filter(v => (v.clienteId === c.id || v.clienteNome === c.nome) && v.status === 'paga')
          .sort((a, b) => (b.data || '').localeCompare(a.data || ''))[0];
        if (ultimaVenda && ultimaVenda.data < limiteISO) {
          insights.push({
            id:   `cliente-inativo-${c.id}`,
            tipo: 'dica',
            texto: `${esc(c.nome)} não compra há mais de 30 dias. Que tal entrar em contato?`,
            acao:  { label: 'Ver clientes', pagina: 'clientes' },
          });
        }
      });
    } catch (_) {}

    // TIPO 3 — Meta ≥ 80% do limite
    try {
      const metas = DB.getMetas();
      metas.forEach(m => {
        if (!m.valorAlvo || m.status !== 'ativa') return;
        const atual = DB.getValorMeta ? DB.getValorMeta(m.id) : 0;
        const pct   = atual / m.valorAlvo * 100;
        if (pct >= 80) {
          insights.push({
            id:   `meta-quase-${m.id}`,
            tipo: 'conquista',
            texto: `Meta "${esc(m.nome)}" está em ${pct.toFixed(0)}%! Quase lá!`,
            acao:  { label: 'Ver meta', pagina: 'metas' },
          });
        }
      });
    } catch (_) {}

    // TIPO 4 — Streak de hábito quebrado ontem
    try {
      const habitos  = Repository.get('habitos');
      const ontem    = new Date(hoje);
      ontem.setDate(ontem.getDate() - 1);
      const ontemISO = ontem.toISOString().slice(0, 10);

      habitos.forEach(h => {
        if (!h.streak || h.streak <= 0) return;
        const ultimoCheck = h.ultimoCheck || '';
        if (ultimoCheck && ultimoCheck < ontemISO) {
          insights.push({
            id:   `streak-quebrado-${h.id}`,
            tipo: 'alerta',
            texto: `O streak de "${esc(h.nome)}" foi interrompido. Retome hoje!`,
            acao:  { label: 'Ver hábitos', pagina: 'habitos' },
          });
        }
      });
    } catch (_) {}

    // TIPO 5 — Próximo serviço (evento de negócio) em 24h
    try {
      const agora   = hoje.getTime();
      const em24h   = agora + 24 * 60 * 60 * 1000;
      const eventos = DB.getAgenda();
      eventos.forEach(ev => {
        if (ev.tipo !== 'servico') return;
        if (!ev.data || !ev.hora) return;
        const dtEv = new Date(`${ev.data}T${ev.hora}:00`).getTime();
        if (dtEv >= agora && dtEv <= em24h) {
          insights.push({
            id:   `servico-24h-${ev.id}`,
            tipo: 'lembrete',
            texto: `Serviço "${esc(ev.titulo || 'sem título')}" está agendado para amanhã${ev.hora ? ' às ' + esc(ev.hora) : ''}.`,
            acao:  { label: 'Ver agenda', pagina: 'agenda' },
          });
        }
      });
    } catch (_) {}

    return insights;
  }

  /* ─── Dismiss helpers ─── */

  function _getDispensados() {
    try {
      const raw     = localStorage.getItem(KEY_DISMISS);
      const obj     = raw ? JSON.parse(raw) : {};
      const agora   = Date.now();
      const ttlMs   = TTL_DIAS * 24 * 60 * 60 * 1000;
      // limpa entradas expiradas
      Object.keys(obj).forEach(k => {
        if (agora - obj[k] > ttlMs) delete obj[k];
      });
      return obj;
    } catch (_) {
      return {};
    }
  }

  function _salvarDispensados(obj) {
    try {
      localStorage.setItem(KEY_DISMISS, JSON.stringify(obj));
    } catch (_) {}
  }

  return { getInsights, dispensar };
})();
