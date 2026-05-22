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

  /* ─── Pipeline de Temperatura ─── */
  function buildPipelineTemperatura(contatos) {
    contatos = contatos ?? [];
    const cols = { frio: 0, morno: 0, quente: 0, vip: 0 };
    contatos.forEach(c => {
      const temp = c.temperatura || 'frio';
      if (temp in cols) cols[temp]++;
    });
    const total = Object.values(cols).reduce((a, b) => a + b, 0);
    const labels = { frio: '❄️ Frio', morno: '🌤️ Morno', quente: '🔥 Quente', vip: '⭐ VIP' };
    const maxVal = Math.max(...Object.values(cols)) || 1;
    return `
      <div class="painel-pipeline-wrap">
        <h2 class="pn-section-title"><span data-icon="layers" data-size="16"></span> Pipeline de Temperatura</h2>
        <div class="painel-pipeline-cols">
          ${Object.entries(cols).map(([col, count]) => {
            const perc = total > 0 ? (count / total) * 100 : 0;
            const barH = (count / maxVal) * 100;
            return `
              <div class="painel-pipeline-col">
                <div class="painel-pipeline-label">${labels[col]}</div>
                <div class="painel-pipeline-count">${count}</div>
                <div class="painel-pipeline-bar"><div class="painel-pipeline-bar-fill" style="height:0%" data-h="${barH}"></div></div>
              </div>`;
          }).join('')}
        </div>
      </div>`;
  }

  /* ─── Alertas ─── */
  function buildAlertas(contatos) {
    contatos = contatos ?? [];
    const txs = (DB.getTransacoes ? DB.getTransacoes() : []) ?? [];
    const tarefas = (DB.getTarefas ? DB.getTarefas() : []) ?? [];
    const hoje = new Date().toISOString().slice(0, 10);
    const alertas = [];

    tarefas.forEach(t => {
      if (t.status === 'concluida') return;
      if (t.prazo && t.prazo < hoje) {
        alertas.push({ tipo: 'tarefa_vencida', texto: `Tarefa vencida: ${esc(t.titulo || 'sem título')}`, icon: 'alert-triangle' });
      }
    });

    const meta30dias = 30000;
    const receita6m = txs
      .filter(t => (t.tipo === 'receita' || t.tipo === 'entrada') && t.data)
      .reduce((sum, t) => sum + (t.valor || 0), 0);
    if (receita6m < meta30dias * 0.3) {
      alertas.push({ tipo: 'meta_baixa', texto: `Receita baixa: ${fmt(receita6m)} (meta: ${fmt(meta30dias)})`, icon: 'trending-down' });
    }

    contatos.forEach(c => {
      if (!c.ultima_interacao) return;
      const dias = Math.floor((new Date() - new Date(c.ultima_interacao)) / 86400000);
      if (dias > 30) {
        alertas.push({ tipo: 'sem_contato', texto: `${esc(c.nome)}: sem contato há ${dias} dias`, icon: 'user-x' });
      }
    });

    if (alertas.length === 0) {
      return `
        <div class="painel-alertas-wrap">
          <h2 class="pn-section-title"><span data-icon="bell" data-size="16"></span> Alertas</h2>
          <div class="painel-alerta-vazio">✅ Tudo em ordem!</div>
        </div>`;
    }

    return `
      <div class="painel-alertas-wrap">
        <h2 class="pn-section-title"><span data-icon="bell" data-size="16"></span> Alertas</h2>
        <div class="painel-alertas-list">
          ${alertas.slice(0, 5).map((a, i) => `
            <div class="painel-alerta-item">
              <span class="painel-alerta-icon" data-icon="${a.icon}" data-size="16"></span>
              <span class="painel-alerta-text">${a.texto}</span>
              <span class="painel-alerta-badge">${i + 1}</span>
            </div>`).join('')}
        </div>
      </div>`;
  }

  /* ─── Gráfico de Vendas (últimos 6 meses) ─── */
  function buildGraficoVendas(txs) {
    txs = txs ?? [];
    const meses = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      meses.push({ year: d.getFullYear(), month: d.getMonth() + 1 });
    }
    const dados = meses.map(m => {
      const val = receitaDoMes(txs, m.year, m.month);
      return { mes: new Date(m.year, m.month - 1).toLocaleDateString('pt-BR', { month: 'short' }), valor: val };
    });
    const maxVal = Math.max(...dados.map(d => d.valor)) || 1;
    return `
      <div class="painel-chart-wrap">
        <h2 class="pn-section-title"><span data-icon="bar-chart" data-size="16"></span> Vendas — últimos 6 meses</h2>
        <div class="painel-chart-bars">
          ${dados.map(d => {
            const h = (d.valor / maxVal) * 100;
            return `
              <div class="painel-chart-col">
                <div class="painel-chart-bar"><div class="painel-chart-bar-fill" style="height:0%" data-h="${h}"></div></div>
                <div class="painel-chart-label">${d.mes}</div>
                <div class="painel-chart-value">${d.valor > 0 ? fmt(d.valor) : 'R$ 0'}</div>
              </div>`;
          }).join('')}
        </div>
      </div>`;
  }

  /* ─── Top Produtos ─── */
  function buildTopProdutos(txs) {
    txs = txs ?? [];
    const produtos = {};
    txs
      .filter(t => (t.tipo === 'receita' || t.tipo === 'entrada') && t.descricao)
      .forEach(t => {
        const desc = esc(t.descricao);
        if (!produtos[desc]) {
          produtos[desc] = { qtd: 0, total: 0 };
        }
        produtos[desc].qtd += 1;
        produtos[desc].total += (t.valor || 0);
      });
    const top5 = Object.entries(produtos)
      .sort((a, b) => b[1].qtd - a[1].qtd)
      .slice(0, 5);

    if (top5.length === 0) {
      return `
        <div class="painel-top-produtos-wrap">
          <h2 class="pn-section-title"><span data-icon="package" data-size="16"></span> Top Produtos</h2>
          <div class="pn-estado-vazio"><p>Nenhuma venda registrada</p></div>
        </div>`;
    }

    const maxQtd = Math.max(...top5.map(p => p[1].qtd)) || 1;
    return `
      <div class="painel-top-produtos-wrap">
        <h2 class="pn-section-title"><span data-icon="package" data-size="16"></span> Top Produtos</h2>
        <div class="painel-top-produtos-list">
          ${top5.map((p, i) => {
            const perc = (p[1].qtd / maxQtd) * 100;
            return `
              <div class="painel-top-produto-item">
                <span class="pn-rank">${i + 1}.</span>
                <span class="painel-top-produto-name">${p[0]}</span>
                <div class="painel-top-produto-meta">
                  <span class="painel-top-produto-qtd">${p[1].qtd}x</span>
                  <span class="painel-top-produto-total">${fmt(p[1].total)}</span>
                </div>
                <div class="painel-top-produto-bar"><div class="painel-top-produto-bar-fill" style="width:0%" data-w="${perc}"></div></div>
              </div>`;
          }).join('')}
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

  /* ─── Animação de barras ao entrar no viewport ─── */
  function initBarAnimations(root) {
    const targets = root.querySelectorAll(
      '.painel-pipeline-wrap, .painel-chart-wrap, .painel-top-produtos-wrap'
    );
    function animateTarget(el) {
      el.querySelectorAll('[data-h]').forEach(b => { b.style.height = b.dataset.h + '%'; });
      el.querySelectorAll('[data-w]').forEach(b => { b.style.width  = b.dataset.w + '%'; });
    }
    if (!targets.length) return;
    if (!('IntersectionObserver' in window)) {
      targets.forEach(animateTarget);
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateTarget(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15 });
    targets.forEach(el => observer.observe(el));
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

        ${buildPipelineTemperatura(contatos)}

        ${buildAlertas(contatos)}

        <div class="pn-section">
          <h2 class="pn-section-title"><span data-icon="clock" data-size="16"></span> Últimas Vendas</h2>
          ${buildVendasRecentes(txs)}
        </div>

        <div class="pn-two-col">
          <div class="pn-left-col">
            ${buildGraficoVendas(txs)}
          </div>
          <div class="pn-right-col">
            <div class="pn-top-clientes">
              <h2 class="pn-section-title"><span data-icon="star" data-size="16"></span> Top Clientes</h2>
              ${buildTopClientes(contatos)}
            </div>
            ${buildTopProdutos(txs)}
          </div>
        </div>

        ${buildQuickActions()}

        <!-- Assistente — insights proativos (Task 3.10) -->
        <div class="pn-section">
          <div id="pn-insights-wrapper"></div>
        </div>

      </div>`;

    Icons.render();
    initBarAnimations(container);
    _renderInsights(container);
  }

  /* ─── Task 3.10 — Insights do Assistente ─── */
  function _renderInsights(container) {
    const wrapper = container.querySelector('#pn-insights-wrapper');
    if (!wrapper) return;
    if (typeof Assistente === 'undefined') return;

    const insights = Assistente.getInsights().slice(0, 3);
    if (!insights.length) { wrapper.innerHTML = ''; return; }

    wrapper.innerHTML = `
      <h2 class="pn-section-title" style="margin-bottom:var(--s-3)">
        <span data-icon="zap" data-size="16"></span> Assistente
      </h2>
      <div id="pn-insights-lista">${insights.map(_insightCard).join('')}</div>
    `;
    Icons.render(wrapper);

    wrapper.querySelectorAll('[data-dispensar]').forEach(btn => {
      btn.addEventListener('click', () => {
        Assistente.dispensar(btn.dataset.dispensar);
        btn.closest('.pn-insight-card')?.remove();
      });
    });

    wrapper.querySelectorAll('[data-insight-pagina]').forEach(btn => {
      btn.addEventListener('click', () => Router.navigate(btn.dataset.insightPagina));
    });
  }

  function _insightCard(ins) {
    const icones = { alerta: 'alert-triangle', dica: 'lightbulb', conquista: 'trophy', lembrete: 'bell' };
    const cores  = { alerta: 'var(--warning)', dica: 'var(--info)', conquista: 'var(--success)', lembrete: 'var(--color-gold)' };
    const icone  = icones[ins.tipo] || 'zap';
    const cor    = cores[ins.tipo]  || 'var(--info)';

    return `
      <div class="pn-insight-card bento-card" style="display:flex;align-items:flex-start;gap:var(--s-3);padding:var(--s-4);margin-bottom:var(--s-3)">
        <span data-icon="${icone}" data-size="18" style="color:${cor};flex-shrink:0;margin-top:2px"></span>
        <div style="flex:1">
          <p style="font-size:13px;color:var(--text-1);margin:0 0 var(--s-2)">${ins.texto}</p>
          ${ins.acao ? `<button class="btn btn-ghost btn-sm" data-insight-pagina="${esc(ins.acao.pagina)}">${esc(ins.acao.label)}</button>` : ''}
        </div>
        <button class="btn btn-ghost btn-sm" data-dispensar="${esc(ins.id)}" title="Dispensar" style="padding:4px;flex-shrink:0">
          <span data-icon="x" data-size="14"></span>
        </button>
      </div>
    `;
  }

  return { render };
})();
