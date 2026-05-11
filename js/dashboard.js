/* ═══════════════════════════════════════════════════════════
   DASHBOARD — Bento layout, premium fintech
═══════════════════════════════════════════════════════════ */

const Dashboard = (() => {
  let chartPeriod = 'mes';
  let calcPeriod  = 'semana';

  function render() {
    ensureBentoStructure();
    DB.updateStatusContas();
    const monthRange = Utils.getMonthRange();
    const stats = DB.getStats(monthRange.start, monthRange.end);

    renderHero(stats);
    renderKPIs(stats);
    renderCalc();
    renderCharts(stats);
    renderProximas();
    renderAtividade();
    updateBadges();
  }

  function ensureBentoStructure() {
    const wrapper = document.getElementById('dashboard-content');
    if (!wrapper) return;
    if (wrapper.querySelector('.bento')) return;
    wrapper.innerHTML = `
      <div class="bento stagger">
        <div class="bento-card hero span-5 row-2" id="hero-card"></div>
        <div class="bento-card span-4" id="kpi-1"></div>
        <div class="bento-card span-3" id="kpi-2"></div>
        <div class="bento-card span-3" id="kpi-3"></div>
        <div class="bento-card accent-violet span-4" id="calc-card"></div>
        <div class="bento-card span-5">
          <div class="card-head">
            <div>
              <span class="card-eyebrow">Distribuição</span>
              <div class="card-title display">Despesas por <em style="font-style:italic;color:var(--violet)">categoria</em></div>
            </div>
            <div class="period-tabs">
              <button class="period-tab" data-period-chart="semana" onclick="Dashboard.setChartPeriod('semana')">Semana</button>
              <button class="period-tab active" data-period-chart="mes" onclick="Dashboard.setChartPeriod('mes')">Mês</button>
              <button class="period-tab" data-period-chart="ano" onclick="Dashboard.setChartPeriod('ano')">Ano</button>
            </div>
          </div>
          <div class="chart-wrap" id="chart-donut"></div>
          <div class="chart-legend" id="chart-donut-legend"></div>
        </div>
        <div class="bento-card span-7">
          <div class="card-head">
            <div>
              <span class="card-eyebrow">Fluxo de caixa</span>
              <div class="card-title display">Últimos <em style="font-style:italic;color:var(--violet)">6 meses</em></div>
            </div>
            <div style="display:flex;gap:var(--s-3);font-size:var(--t-xs);color:var(--text-3)">
              <span><span class="dot" style="background:var(--green)"></span> Entradas</span>
              <span><span class="dot" style="background:var(--red)"></span> Saídas</span>
            </div>
          </div>
          <div class="chart-wrap tall" id="chart-bars"></div>
        </div>
        <div class="bento-card span-7">
          <div class="card-head">
            <div>
              <span class="card-eyebrow">14 dias</span>
              <div class="card-title display">Próximas <em style="font-style:italic;color:var(--violet)">contas</em></div>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="Router.navigate('contas')">
              Ver todas <span data-icon="arrow-right" data-size="13"></span>
            </button>
          </div>
          <div id="proximas-list"></div>
        </div>
        <div class="bento-card span-5">
          <div class="card-head">
            <div>
              <span class="card-eyebrow">Histórico</span>
              <div class="card-title display">Atividade <em style="font-style:italic;color:var(--violet)">recente</em></div>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="Router.navigate('transacoes')">
              Ver tudo <span data-icon="arrow-right" data-size="13"></span>
            </button>
          </div>
          <div id="atividade-list"></div>
        </div>
      </div>
    `;
  }

  function renderHero(stats) {
    const score = stats.health;
    const cor = score >= 71 ? 'var(--green)' : score >= 41 ? 'var(--amber)' : 'var(--red)';
    const label = score >= 71 ? 'Saudável' : score >= 41 ? 'Atenção' : 'Crítico';
    const r = 80, circ = 2 * Math.PI * r;
    const offset = circ - (score / 100) * circ;

    const el = document.getElementById('hero-card');
    if (!el) return;
    el.innerHTML = `
      <div class="card-head">
        <div>
          <span class="card-eyebrow">Saúde Financeira</span>
          <div class="card-title display">Sua jornada <em style="font-style:italic;color:var(--violet)">do mês</em></div>
        </div>
        <div class="card-pill violet">${Icons.html('activity', 16)}</div>
      </div>
      <div class="health-row">
        <div class="health-gauge">
          <svg viewBox="0 0 200 200">
            <circle class="track" cx="100" cy="100" r="${r}"/>
            <circle class="fill" cx="100" cy="100" r="${r}"
              stroke="${cor}"
              stroke-dasharray="${circ}"
              stroke-dashoffset="${offset}"/>
          </svg>
          <div class="health-gauge-text">
            <div class="num" style="color:${cor}">${score}</div>
            <div class="label">de 100</div>
            <div class="status" style="color:${cor}">${label}</div>
          </div>
        </div>
        <div class="health-side">
          <div class="health-stat">
            <div class="label"><span class="dot" style="background:var(--green)"></span> Pagas</div>
            <div class="value">${stats.pagas.length}</div>
          </div>
          <div class="health-stat">
            <div class="label"><span class="dot" style="background:var(--amber)"></span> Pendentes</div>
            <div class="value">${stats.pendentes.length}</div>
          </div>
          <div class="health-stat">
            <div class="label"><span class="dot" style="background:var(--red)"></span> Atrasadas</div>
            <div class="value">${stats.atrasadas.length}</div>
          </div>
          <div class="health-stat" style="background:linear-gradient(135deg, var(--violet-glow), transparent);border-color:var(--line-3)">
            <div class="label">Saldo</div>
            <div class="value" style="color:${stats.saldo >= 0 ? 'var(--green)' : 'var(--red)'}">${fmt(stats.saldo)}</div>
          </div>
        </div>
      </div>
    `;
  }

  function renderKPIs(stats) {
    const week = Utils.getWeekRange();
    const venceSemana = DB.getContas({ dataInicio: week.start, dataFim: week.end, status: 'pendente' });
    const totalSemana = venceSemana.reduce((s, c) => s + c.valor, 0);

    const cards = [
      {
        id: 'kpi-1',
        eyebrow: 'A pagar',
        title: 'Total do mês',
        value: stats.total,
        icon: 'wallet',
        accent: 'red',
        sub: `${stats.contas.length} contas no período`,
      },
      {
        id: 'kpi-2',
        eyebrow: 'Esta semana',
        title: 'Vence em 7 dias',
        value: totalSemana,
        icon: 'clock',
        accent: 'amber',
        sub: `${venceSemana.length} contas`,
      },
      {
        id: 'kpi-3',
        eyebrow: 'Já pago',
        title: 'No mês',
        value: stats.totalPago,
        icon: 'check-circle',
        accent: 'green',
        sub: `${stats.pagas.length} pagas`,
      },
    ];

    cards.forEach(card => {
      const el = document.getElementById(card.id);
      if (!el) return;
      el.innerHTML = `
        <div class="card-head">
          <div>
            <span class="card-eyebrow">${esc(card.eyebrow)}</span>
            <div class="card-title">${esc(card.title)}</div>
          </div>
          <div class="card-pill ${card.accent}">${Icons.html(card.icon, 16)}</div>
        </div>
        <div class="kpi">
          <div class="kpi-number" style="font-style:italic;color:var(--text-1)" data-value="${card.value}">${fmt(card.value)}</div>
          <div class="kpi-meta">
            <span>${esc(card.sub)}</span>
          </div>
        </div>
      `;
      const num = el.querySelector('.kpi-number');
      if (num) Utils.animateCount(num, 0, card.value, 700);
    });
  }

  function renderCalc() {
    const el = document.getElementById('calc-card');
    if (!el) return;

    let start, end, lbl, dias;
    if (calcPeriod === 'semana') {
      const w = Utils.getWeekRange();
      start = w.start; end = w.end;
      lbl = 'Esta semana';
      dias = Utils.daysUntil(end) + 1;
    } else if (calcPeriod === 'mes') {
      const m = Utils.getMonthRange();
      start = m.start; end = m.end;
      lbl = 'Este mês';
      dias = Utils.daysUntil(end) + 1;
    } else {
      const m = Utils.getMonthRange(1);
      start = m.start; end = m.end;
      lbl = Utils.capitalize(m.monthName);
      dias = Utils.daysBetween(start, end);
    }

    const contas = DB.getContas({ dataInicio: start, dataFim: end });
    const total = contas.reduce((s, c) => s + c.valor, 0);
    const pago  = contas.filter(c => c.status === 'paga').reduce((s, c) => s + c.valor, 0);
    const falta = Math.max(0, total - pago);
    const diario = dias > 0 ? falta / dias : falta;

    el.innerHTML = `
      <div class="card-head">
        <div>
          <span class="card-eyebrow">Calculadora</span>
          <div class="card-title display">Quanto guardar <em>por dia</em></div>
        </div>
        <div class="period-tabs">
          ${['semana','mes','prox'].map(p => `
            <button class="period-tab ${p === calcPeriod ? 'active' : ''}" onclick="Dashboard.setCalcPeriod('${p}')">
              ${p === 'semana' ? 'Semana' : p === 'mes' ? 'Mês' : 'Próximo'}
            </button>
          `).join('')}
        </div>
      </div>
      <div class="calc-card">
        <div class="calc-stats">
          <div class="calc-stat">
            <div class="label">Total</div>
            <div class="value">${fmt(total)}</div>
          </div>
          <div class="calc-stat">
            <div class="label">Pago</div>
            <div class="value text-green">${fmt(pago)}</div>
          </div>
          <div class="calc-stat">
            <div class="label">Falta</div>
            <div class="value text-red">${fmt(falta)}</div>
          </div>
        </div>
        ${falta > 0 ? `
          <div class="calc-hero">
            <div class="eyebrow">${esc(lbl)} · ${dias} ${dias === 1 ? 'dia' : 'dias'} restantes</div>
            <div class="number">${fmt(diario)}</div>
            <div class="sub">Guarde por dia para quitar tudo a tempo</div>
          </div>
        ` : `
          <div class="calc-done">
            <div class="check">${Icons.html('check', 22)}</div>
            <div class="title">Tudo pago</div>
            <p>Todas as contas de ${esc(lbl.toLowerCase())} foram quitadas</p>
          </div>
        `}
      </div>
    `;
  }

  function renderCharts(stats) {
    /* ─── Donut (categorias) ─── */
    let inicio, fim;
    if (chartPeriod === 'semana') { const w = Utils.getWeekRange(); inicio = w.start; fim = w.end; }
    else if (chartPeriod === 'mes') { const m = Utils.getMonthRange(); inicio = m.start; fim = m.end; }
    else { const m = Utils.getMonthRange(-11); inicio = m.start; fim = Utils.getMonthRange().end; }

    const contas = DB.getContas({ dataInicio: inicio, dataFim: fim });
    const cats = DB.getCategorias();
    const totaisByCat = {};
    contas.forEach(c => { totaisByCat[c.categoria] = (totaisByCat[c.categoria] || 0) + c.valor; });
    const sorted = Object.entries(totaisByCat).sort((a, b) => b[1] - a[1]).slice(0, 8);

    const dataDonut = sorted.map(([id, v]) => {
      const ct = cats.find(c => c.id === id);
      return { name: ct?.nome || id, value: v, color: ct?.cor || '#888' };
    });

    Charts.donut('chart-donut', dataDonut);

    const legendEl = document.getElementById('chart-donut-legend');
    if (legendEl) {
      const total = dataDonut.reduce((s, d) => s + d.value, 0);
      legendEl.innerHTML = dataDonut.map(d => `
        <div class="legend-item">
          <span class="legend-dot" style="background:${d.color}"></span>
          <span class="name">${esc(d.name)}</span>
          <strong>${total ? Math.round(d.value / total * 100) : 0}%</strong>
        </div>
      `).join('');
    }

    /* ─── Bars (fluxo) ─── */
    const fluxoData = [];
    for (let i = 5; i >= 0; i--) {
      const r = Utils.getMonthRange(-i);
      const txs = DB.getTransacoes({ dataInicio: r.start, dataFim: r.end });
      fluxoData.push({
        label: r.monthShort.slice(0, 3),
        entrada: txs.filter(t => t.tipo === 'entrada').reduce((s, t) => s + t.valor, 0),
        saida:   txs.filter(t => t.tipo === 'saida').reduce((s, t) => s + t.valor, 0),
      });
    }
    Charts.bars('chart-bars', fluxoData);
  }

  function renderProximas() {
    const el = document.getElementById('proximas-list');
    if (!el) return;
    const next14 = Utils.addDays(todayISO(), 14);
    const arr = DB.getContas({
      dataInicio: todayISO(),
      dataFim: next14,
      status: 'pendente',
    }).slice(0, 5);

    if (!arr.length) {
      el.innerHTML = `<div class="empty"><div class="empty-icon">${Icons.html('check-circle', 22)}</div><h4>Tudo em ordem</h4><p>Nenhuma conta vencendo nos próximos 14 dias</p></div>`;
      return;
    }

    el.innerHTML = arr.map(c => {
      const cat = DB.getCategoria(c.categoria);
      const urg = Utils.urgencyOf(c.dataVencimento, c.status);
      return `
        <div class="list-item" style="margin-bottom:6px">
          <div class="list-icon" style="background:${cat.cor}22;color:${cat.cor}">
            ${Icons.html(cat.icone, 16)}
          </div>
          <div class="list-info">
            <h4>${esc(c.descricao)}</h4>
            <div class="meta">
              <span class="badge badge-${urg}">${esc(Utils.urgencyLabel(c.dataVencimento, c.status))}</span>
              ${c.parcelado ? `<span class="badge badge-violet">${c.parcelaAtual}/${c.totalParcelas}</span>` : ''}
              ${c.recorrente ? `<span class="badge badge-blue">${Icons.html('repeat', 9)} ${esc(c.intervaloRecorrencia || '')}</span>` : ''}
            </div>
          </div>
          <div class="list-amount">${fmt(c.valor)}</div>
          <div class="list-actions">
            <button class="btn btn-success btn-icon btn-sm" onclick="Modal.pagarConta('${esc(c.id)}')" title="Pagar agora">
              ${Icons.html('check', 12)}
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderAtividade() {
    const el = document.getElementById('atividade-list');
    if (!el) return;
    const txs = DB.getTransacoes().slice(0, 6);

    if (!txs.length) {
      el.innerHTML = `<div class="empty"><div class="empty-icon">${Icons.html('arrow-left-right', 22)}</div><h4>Sem atividade</h4><p>Suas transações aparecerão aqui</p></div>`;
      return;
    }

    el.innerHTML = txs.map(t => `
      <div class="list-item" style="grid-template-columns: 38px 1fr auto;margin-bottom:6px">
        <div class="list-icon" style="background:${t.tipo === 'entrada' ? 'var(--green-bg)' : 'var(--red-bg)'};color:${t.tipo === 'entrada' ? 'var(--green)' : 'var(--red)'}">
          ${Icons.html(t.tipo === 'entrada' ? 'arrow-down-left' : 'arrow-up-right', 16)}
        </div>
        <div class="list-info">
          <h4>${esc(t.descricao || 'Transação')}</h4>
          <div class="meta">
            <span>${esc(Utils.formatRelative(t.data))}</span>
            <span>·</span>
            <span>${esc((t.metodo || '').replace('_', ' '))}</span>
          </div>
        </div>
        <div class="list-amount ${t.tipo === 'entrada' ? 'green' : 'red'}">
          ${t.tipo === 'entrada' ? '+' : '-'}${fmt(t.valor)}
        </div>
      </div>
    `).join('');
  }

  function updateBadges() {
    const atrasadas = DB.getContas({ status: 'atrasada' }).length;
    const badge = document.getElementById('nav-badge-contas');
    if (badge) {
      badge.textContent = atrasadas || '';
      badge.style.display = atrasadas ? 'inline-block' : 'none';
    }
  }

  function setChartPeriod(p) {
    chartPeriod = p;
    document.querySelectorAll('[data-period-chart]').forEach(b => {
      b.classList.toggle('active', b.dataset.periodChart === p);
    });
    const m = Utils.getMonthRange();
    const stats = DB.getStats(m.start, m.end);
    renderCharts(stats);
  }

  function setCalcPeriod(p) {
    calcPeriod = p;
    renderCalc();
  }

  return { render, setChartPeriod, setCalcPeriod, updateBadges };
})();
