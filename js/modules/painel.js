/* ═══════════════════════════════════════════════════════════
   PAINEL NEGÓCIO — Dashboard Executivo
   Mentor24h | OBSIDIAN Design System | Forge v5.2
═══════════════════════════════════════════════════════════ */

const Painel = (() => {
  const META_RECEITA = 20000;
  const META_CLIENTES = 30;
  const TEMP_ORDEM = ['vip', 'quente', 'morno', 'lead', 'frio', 'inativo'];
  const TEMP_LABELS = { vip: 'VIP', quente: 'Quente', morno: 'Morno', lead: 'Lead', frio: 'Frio', inativo: 'Inativo' };
  const TEMP_PESO  = { vip: 6, quente: 5, morno: 4, lead: 3, frio: 2, inativo: 1 };

  /* ─── Helpers ─── */
  function fmt(v) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);
  }

  function fmtData(s) {
    if (!s) return '—';
    const [a, m, d] = s.split('-');
    return `${d}/${m}`;
  }

  function getMes(offset = 0) {
    const d = new Date();
    d.setMonth(d.getMonth() + offset);
    return { year: d.getFullYear(), month: d.getMonth() + 1 };
  }

  function receitaDoMes(txs, year, month) {
    return txs
      .filter(t => (t.tipo === 'receita' || t.tipo === 'entrada') && t.data)
      .filter(t => {
        const [a, m] = t.data.split('-').map(Number);
        return a === year && m === month;
      })
      .reduce((sum, t) => sum + (t.valor || 0), 0);
  }

  /* ─── KPI: Receita ─── */
  function buildKpiReceita(txs) {
    const { year, month } = getMes();
    const valor = receitaDoMes(txs, year, month);
    const perc = Math.min(100, Math.round((valor / META_RECEITA) * 100));
    return `
      <div class="pn-kpi pn-kpi--receita">
        <div class="pn-kpi-header">
          <span data-icon="trending-up" data-size="18"></span>
          <span class="pn-kpi-label">Receita do mês</span>
        </div>
        <div class="pn-kpi-valor">${valor > 0 ? fmt(valor) : '—'}</div>
        <div class="pn-kpi-progress"><div class="kpi-bar-fill" style="width:${perc}%"></div></div>
        <span class="pn-kpi-meta">meta: ${fmt(META_RECEITA)}</span>
      </div>`;
  }

  /* ─── KPI: Clientes Ativos ─── */
  function buildKpiClientes(contatos) {
    const ativos = contatos.filter(c => {
      const temp = c.temperatura || 'lead';
      return temp !== 'inativo' && (c.contextos || []).some(ctx => ['cliente', 'prospecto'].includes(ctx));
    });
    const perc = Math.min(100, Math.round((ativos.length / META_CLIENTES) * 100));
    return `
      <div class="pn-kpi pn-kpi--clientes">
        <div class="pn-kpi-header">
          <span data-icon="users" data-size="18"></span>
          <span class="pn-kpi-label">Clientes ativos</span>
        </div>
        <div class="pn-kpi-valor">${ativos.length || '—'}</div>
        <div class="pn-kpi-progress"><div class="kpi-bar-fill" style="width:${perc}%"></div></div>
        <span class="pn-kpi-meta">meta: ${META_CLIENTES} clientes</span>
      </div>`;
  }

  /* ─── KPI: Ticket Médio ─── */
  function buildKpiTicket(txs, contatos) {
    const { year, month } = getMes();
    const { year: ya, month: ma } = getMes(-1);
    const receita = receitaDoMes(txs, year, month);
    const receitaAnt = receitaDoMes(txs, ya, ma);
    const ativos = contatos.filter(c => c.temperatura !== 'inativo' && (c.contextos || []).includes('cliente')).length;
    const ticket = ativos > 0 ? receita / ativos : 0;
    const ticketAnt = ativos > 0 ? receitaAnt / ativos : 0;
    const delta = ticketAnt > 0 ? ((ticket - ticketAnt) / ticketAnt * 100).toFixed(1) : null;
    return `
      <div class="pn-kpi pn-kpi--ticket">
        <div class="pn-kpi-header">
          <span data-icon="receipt" data-size="18"></span>
          <span class="pn-kpi-label">Ticket médio</span>
        </div>
        <div class="pn-kpi-valor">${ticket > 0 ? fmt(ticket) : '—'}</div>
        ${delta !== null ? `<span class="pn-kpi-delta ${Number(delta) >= 0 ? 'pn-delta--up' : 'pn-delta--down'}">${Number(delta) >= 0 ? '▲' : '▼'} ${Math.abs(delta)}% vs anterior</span>` : '<span class="pn-kpi-delta">sem dados anteriores</span>'}
      </div>`;
  }

  /* ─── KPI: Pendências ─── */
  function buildKpiPendencias() {
    const tarefas = (DB.getTarefas ? DB.getTarefas() : []) || [];
    const hoje = new Date().toISOString().slice(0, 10);
    const urgentes = tarefas.filter(t => {
      if (t.status === 'concluida') return false;
      if (t.prioridade === 'alta' || t.prioridade === 'urgente') return true;
      if (t.prazo && t.prazo < hoje) return true;
      return false;
    }).length;
    return `
      <div class="pn-kpi pn-kpi--pendencias">
        <div class="pn-kpi-header">
          <span data-icon="${urgentes > 0 ? 'alert-triangle' : 'check-circle'}" data-size="18"></span>
          <span class="pn-kpi-label">Pendências</span>
        </div>
        <div class="pn-kpi-valor">${urgentes}</div>
        <span class="pn-kpi-status ${urgentes > 0 ? 'pn-status--urgente' : 'pn-status--ok'}">${urgentes > 0 ? '⚠️ urgente' : '✅ em dia'}</span>
      </div>`;
  }

  /* ─── Header com delta ─── */
  function buildHeader(txs) {
    const { year, month } = getMes();
    const { year: ya, month: ma } = getMes(-1);
    const atual = receitaDoMes(txs, year, month);
    const anterior = receitaDoMes(txs, ya, ma);
    const delta = anterior > 0 ? ((atual - anterior) / anterior * 100).toFixed(1) : null;
    const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    return `
      <div class="pn-header">
        <div class="pn-header-titulo">
          <h1>Painel <em>Executivo</em></h1>
          <span class="pn-periodo">${meses[month - 1]} ${year}</span>
        </div>
        <div class="pn-header-delta">
          ${delta !== null
            ? `<span class="pn-delta-valor ${Number(delta) >= 0 ? 'pn-delta--up' : 'pn-delta--down'}">${Number(delta) >= 0 ? '▲' : '▼'} ${Math.abs(delta)}%</span>
               <span class="pn-delta-label">vs mês anterior</span>`
            : `<span class="pn-delta-label">primeiro mês</span>`}
        </div>
      </div>`;
  }

  /* ─── Top Clientes ─── */
  function buildTopClientes(contatos) {
    const clientes = contatos
      .filter(c => (c.contextos || []).some(ctx => ['cliente', 'prospecto'].includes(ctx)))
      .sort((a, b) => (TEMP_PESO[b.temperatura] || 0) - (TEMP_PESO[a.temperatura] || 0))
      .slice(0, 3);

    if (!clientes.length) {
      return `<div class="pn-estado-vazio"><span data-icon="users" data-size="28"></span><p>Nenhum cliente cadastrado</p></div>`;
    }

    const maxPeso = TEMP_PESO[clientes[0].temperatura] || 1;
    return clientes.map((c, i) => {
      const temp = c.temperatura || 'lead';
      const perc = Math.round((TEMP_PESO[temp] / maxPeso) * 100);
      return `
        <div class="pn-cliente-item">
          <span class="pn-cliente-rank">${i + 1}.</span>
          <span class="pn-cliente-nome">${esc(c.nome)}</span>
          <span class="pn-cliente-temp badge-${esc(temp)}">${TEMP_LABELS[temp] || temp}</span>
          <div class="pn-cliente-bar"><div class="pn-cliente-bar-fill" style="width:${perc}%"></div></div>
        </div>`;
    }).join('');
  }

  /* ─── Vendas recentes ─── */
  function buildVendasRecentes(txs) {
    const entradas = txs
      .filter(t => t.tipo === 'receita' || t.tipo === 'entrada')
      .slice(-5)
      .reverse();

    if (!entradas.length) {
      return `<div class="pn-estado-vazio"><span data-icon="shopping-cart" data-size="28"></span><p>Nenhuma venda registrada ainda</p></div>`;
    }

    return `<div class="pn-vendas-lista">${entradas.map(t => `
      <div class="pn-venda-item">
        <div class="pn-venda-info">
          <span class="pn-venda-desc">${esc(t.descricao || 'Venda')}</span>
          <span class="pn-venda-data">${fmtData(t.data)}</span>
        </div>
        <span class="pn-venda-valor">${fmt(t.valor)}</span>
      </div>`).join('')}</div>`;
  }

  /* ─── Quick Actions ─── */
  function buildQuickActions() {
    return `
      <div class="pn-quick-actions">
        <button class="pn-qa-btn" onclick="Router.navigate('transacoes')" type="button">
          <span data-icon="plus-circle" data-size="16"></span>
          <span>Registrar Venda</span>
        </button>
        <button class="pn-qa-btn" onclick="Router.navigate('contatos')" type="button">
          <span data-icon="user-plus" data-size="16"></span>
          <span>Novo Cliente</span>
        </button>
        <button class="pn-qa-btn pn-qa-btn--secondary" onclick="Router.navigate('vendas')" type="button">
          <span data-icon="bar-chart-2" data-size="16"></span>
          <span>Ver Relatório</span>
        </button>
      </div>`;
  }

  /* ─── Render principal ─── */
  function render() {
    const container = document.getElementById('painel-negocio-content');
    if (!container) return;

    const txs = (DB.getTransacoes ? DB.getTransacoes() : []) || [];
    const contatos = (DB.getContatos ? DB.getContatos() : []) || [];

    container.innerHTML = `
      <div id="painel-negocio" class="modulo modulo-negocio">

        ${buildHeader(txs)}

        <div class="pn-kpis-grid">
          ${buildKpiReceita(txs)}
          ${buildKpiClientes(contatos)}
          ${buildKpiTicket(txs, contatos)}
          ${buildKpiPendencias()}
        </div>

        <div class="pn-secoes-grid">
          <div class="pn-top-clientes">
            <h2 class="pn-section-title"><span data-icon="star" data-size="16"></span> Top Clientes</h2>
            ${buildTopClientes(contatos)}
          </div>

          <div class="pn-vendas-recentes">
            <h2 class="pn-section-title"><span data-icon="zap" data-size="16"></span> Vendas Recentes</h2>
            ${buildVendasRecentes(txs)}
          </div>
        </div>

        ${buildQuickActions()}

      </div>`;

    Icons.render();
  }

  return { render };
})();
