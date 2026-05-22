/* ═══════════════════════════════════════════════════════════
   RELATÓRIOS — Analytics do negócio (Tasks 3.6, 3.7, 3.8)
   Fontes: DB.getVendas() para receita, DB.getTransacoes() para despesas
═══════════════════════════════════════════════════════════ */

const Relatorios = (() => {
  let periodo = 'mes'; // 'mes' | 'trimestre' | 'ano'

  function render() {
    const container = document.getElementById('relatorios-content');
    if (!container) return;

    container.innerHTML = `
      <div style="display:flex;gap:var(--s-2);flex-wrap:wrap;margin-bottom:var(--s-5)">
        <button class="filter-chip${periodo === 'mes'       ? ' active' : ''}" data-rel-periodo="mes">Este mês</button>
        <button class="filter-chip${periodo === 'trimestre' ? ' active' : ''}" data-rel-periodo="trimestre">Trimestre</button>
        <button class="filter-chip${periodo === 'ano'       ? ' active' : ''}" data-rel-periodo="ano">Este ano</button>
      </div>

      <div id="rel-financeiro"></div>
      <div id="rel-grafico" style="margin-top:var(--s-6)"></div>
      <div id="rel-top5" style="margin-top:var(--s-6)"></div>
    `;

    _renderFinanceiro();
    _renderGrafico();
    _renderTop5();
    _bindEvents(container);
    Icons.render(container);
  }

  /* ─── Task 3.6 — Relatório financeiro mensal ─── */
  function _renderFinanceiro() {
    const el = document.getElementById('rel-financeiro');
    if (!el) return;

    const { inicio, fim } = _intervalo(periodo);
    const { inicioAnt, fimAnt } = _intervaloAnterior(periodo);

    const receita    = _somaVendas(inicio, fim);
    const despesa    = _somaDespesas(inicio, fim);
    const lucro      = receita - despesa;
    const receitaAnt = _somaVendas(inicioAnt, fimAnt);
    const despesaAnt = _somaDespesas(inicioAnt, fimAnt);
    const lucroAnt   = receitaAnt - despesaAnt;

    el.innerHTML = `
      <h3 style="font-size:var(--t-md);font-weight:600;margin-bottom:var(--s-4)">Resumo financeiro</h3>
      <div class="bento-grid">
        ${_kpiCard('Receita', receita, receitaAnt, 'var(--success)', 'trending-up')}
        ${_kpiCard('Despesa', despesa, despesaAnt, 'var(--error)', 'trending-down', true)}
        ${_kpiCard('Lucro', lucro, lucroAnt, lucro >= 0 ? 'var(--success)' : 'var(--error)', lucro >= 0 ? 'dollar-sign' : 'alert-circle')}
      </div>
    `;
    Icons.render(el);
  }

  function _kpiCard(label, valor, valorAnt, cor, icone, inverteDelta) {
    const delta    = valorAnt > 0 ? ((valor - valorAnt) / valorAnt * 100) : (valor > 0 ? 100 : 0);
    const positivo = inverteDelta ? delta < 0 : delta >= 0;
    const seta     = positivo ? '▲' : '▼';
    const corDelta = positivo ? 'var(--success)' : 'var(--error)';

    return `
      <div class="bento-card span-4" style="padding:var(--s-4)">
        <div style="display:flex;align-items:center;gap:var(--s-2);margin-bottom:var(--s-2)">
          <span data-icon="${icone}" data-size="14" style="color:${cor}"></span>
          <span style="font-size:11px;color:var(--text-4);text-transform:uppercase;letter-spacing:.08em">${label}</span>
        </div>
        <div style="font-size:var(--t-xl);font-weight:700;color:${cor};font-family:var(--font-mono)">R$ ${fmt(valor)}</div>
        ${valorAnt > 0 || valor > 0
          ? `<div style="font-size:11px;color:${corDelta};margin-top:var(--s-1)">${seta} ${Math.abs(delta).toFixed(1)}% vs período anterior</div>`
          : `<div style="font-size:11px;color:var(--text-4);margin-top:var(--s-1)">Sem dados anteriores</div>`
        }
      </div>
    `;
  }

  /* ─── Task 3.8 — Gráfico SVG (últimos 6 meses) ─── */
  function _renderGrafico() {
    const el = document.getElementById('rel-grafico');
    if (!el) return;

    const meses = _ultimos6Meses();
    const maxVal = Math.max(...meses.map(m => m.valor), 1);

    const W = 520, H = 200, PAD = 40, BAR_W = 50, GAP = 16;
    const totalW = meses.length * (BAR_W + GAP) - GAP;
    const offsetX = (W - totalW) / 2;

    const barras = meses.map((m, i) => {
      const x      = offsetX + i * (BAR_W + GAP);
      const altura = Math.max((m.valor / maxVal) * (H - PAD - 20), m.valor > 0 ? 4 : 0);
      const y      = H - PAD - altura;
      const cor    = i === meses.length - 1 ? 'var(--color-gold)' : 'var(--info)';

      return `
        <g class="rel-barra" style="cursor:default">
          <rect x="${x}" y="${y}" width="${BAR_W}" height="${altura}"
            fill="${cor}" rx="4" opacity=".85"
            data-label="${esc(m.label)}" data-valor="R$ ${fmt(m.valor)}">
          </rect>
          <text x="${x + BAR_W / 2}" y="${H - PAD + 14}" text-anchor="middle"
            font-size="10" fill="var(--text-4)">${esc(m.labelCurto)}</text>
          ${m.valor > 0 ? `<text x="${x + BAR_W / 2}" y="${y - 5}" text-anchor="middle"
            font-size="9" fill="var(--text-3)">R$ ${_fmtK(m.valor)}</text>` : ''}
        </g>
      `;
    }).join('');

    el.innerHTML = `
      <h3 style="font-size:var(--t-md);font-weight:600;margin-bottom:var(--s-4)">Receita — últimos 6 meses</h3>
      <div style="overflow-x:auto">
        <svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px;display:block"
             role="img" aria-label="Gráfico de barras: receita dos últimos 6 meses">
          <!-- linha de base -->
          <line x1="${offsetX - 8}" y1="${H - PAD}" x2="${offsetX + totalW + 8}" y2="${H - PAD}"
            stroke="var(--text-4)" stroke-width="1" opacity=".4"/>
          ${barras}
        </svg>
      </div>
      <div id="rel-tooltip" style="font-size:12px;color:var(--text-3);margin-top:var(--s-2);min-height:18px"></div>
    `;

    // hover tooltip
    el.querySelectorAll('.rel-barra rect').forEach(rect => {
      const tt = el.querySelector('#rel-tooltip');
      rect.addEventListener('mouseenter', () => {
        if (tt) tt.textContent = `${rect.dataset.label}: ${rect.dataset.valor}`;
      });
      rect.addEventListener('mouseleave', () => {
        if (tt) tt.textContent = '';
      });
    });
  }

  function _fmtK(v) {
    return v >= 1000 ? `${(v / 1000).toFixed(1)}k` : fmt(v);
  }

  /* ─── Task 3.7 — Top 5 clientes + top 5 produtos ─── */
  function _renderTop5() {
    const el = document.getElementById('rel-top5');
    if (!el) return;

    const { inicio, fim } = _intervalo(periodo);
    const vendas = DB.getVendas().filter(v =>
      v.status === 'paga' && v.data >= inicio && v.data <= fim
    );

    // top 5 clientes por total
    const mapClientes = {};
    vendas.forEach(v => {
      const nome = v.clienteNome || 'Avulso';
      mapClientes[nome] = (mapClientes[nome] || 0) + (v.total || 0);
    });
    const topClientes = Object.entries(mapClientes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // top 5 produtos por quantidade vendida
    const mapProd = {};
    vendas.forEach(v => {
      (v.itens || []).forEach(it => {
        const nome = it.produto || '—';
        mapProd[nome] = (mapProd[nome] || 0) + (it.qtd || 1);
      });
    });
    const topProd = Object.entries(mapProd)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const maxCli  = topClientes[0]?.[1] || 1;
    const maxProd = topProd[0]?.[1] || 1;

    el.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--s-5);flex-wrap:wrap">
        <div>
          <h3 style="font-size:var(--t-md);font-weight:600;margin-bottom:var(--s-4)">Top 5 clientes</h3>
          ${!topClientes.length
            ? `<p style="color:var(--text-4);font-size:13px">Nenhuma venda no período.</p>`
            : topClientes.map(([nome, total], i) => _barraRanking(i + 1, nome, `R$ ${fmt(total)}`, total / maxCli)).join('')
          }
        </div>
        <div>
          <h3 style="font-size:var(--t-md);font-weight:600;margin-bottom:var(--s-4)">Top 5 produtos</h3>
          ${!topProd.length
            ? `<p style="color:var(--text-4);font-size:13px">Sem itens registrados no período.</p>`
            : topProd.map(([nome, qtd], i) => _barraRanking(i + 1, nome, `${qtd} un.`, qtd / maxProd)).join('')
          }
        </div>
      </div>
    `;
  }

  function _barraRanking(pos, label, valor, proporcao) {
    const pct = Math.max(Math.round(proporcao * 100), 4);
    return `
      <div style="margin-bottom:var(--s-3)">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
          <span style="color:var(--text-2)">${pos}. ${esc(label)}</span>
          <span style="font-family:var(--font-mono);color:var(--text-1)">${esc(valor)}</span>
        </div>
        <div style="height:6px;background:var(--bg-secondary);border-radius:3px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:var(--color-gold);border-radius:3px;transition:width .3s"></div>
        </div>
      </div>
    `;
  }

  /* ─── Eventos ─── */
  function _bindEvents(container) {
    container.querySelectorAll('[data-rel-periodo]').forEach(btn => {
      btn.addEventListener('click', () => {
        periodo = btn.dataset.relPeriodo;
        container.querySelectorAll('[data-rel-periodo]').forEach(b =>
          b.classList.toggle('active', b.dataset.relPeriodo === periodo)
        );
        _renderFinanceiro();
        _renderGrafico();
        _renderTop5();
        Icons.render(container);
      });
    });
  }

  /* ─── Helpers de período ─── */
  function _intervalo(p) {
    const hoje  = new Date();
    const ano   = hoje.getFullYear();
    const mes   = hoje.getMonth();
    if (p === 'mes') {
      return {
        inicio: `${ano}-${String(mes + 1).padStart(2, '0')}-01`,
        fim:    `${ano}-${String(mes + 1).padStart(2, '0')}-31`,
      };
    }
    if (p === 'trimestre') {
      const q = Math.floor(mes / 3);
      return {
        inicio: `${ano}-${String(q * 3 + 1).padStart(2, '0')}-01`,
        fim:    `${ano}-${String(Math.min(q * 3 + 3, 12)).padStart(2, '0')}-31`,
      };
    }
    return { inicio: `${ano}-01-01`, fim: `${ano}-12-31` };
  }

  function _intervaloAnterior(p) {
    const hoje = new Date();
    const ano  = hoje.getFullYear();
    const mes  = hoje.getMonth();
    if (p === 'mes') {
      const antMes = mes === 0 ? 12 : mes;
      const antAno = mes === 0 ? ano - 1 : ano;
      return {
        inicioAnt: `${antAno}-${String(antMes).padStart(2, '0')}-01`,
        fimAnt:    `${antAno}-${String(antMes).padStart(2, '0')}-31`,
      };
    }
    if (p === 'trimestre') {
      const q    = Math.floor(mes / 3);
      const antQ = q === 0 ? 3 : q - 1;
      const antA = q === 0 ? ano - 1 : ano;
      return {
        inicioAnt: `${antA}-${String(antQ * 3 + 1).padStart(2, '0')}-01`,
        fimAnt:    `${antA}-${String(Math.min(antQ * 3 + 3, 12)).padStart(2, '0')}-31`,
      };
    }
    return { inicioAnt: `${ano - 1}-01-01`, fimAnt: `${ano - 1}-12-31` };
  }

  function _somaVendas(inicio, fim) {
    return DB.getVendas()
      .filter(v => v.status === 'paga' && v.data >= inicio && v.data <= fim)
      .reduce((s, v) => s + (v.total || 0), 0);
  }

  function _somaDespesas(inicio, fim) {
    return DB.getTransacoes({ dataInicio: inicio, dataFim: fim })
      .filter(t => t.tipo === 'saida')
      .reduce((s, t) => s + (t.valor || 0), 0);
  }

  function _ultimos6Meses() {
    const hoje  = new Date();
    const meses = [];
    for (let i = 5; i >= 0; i--) {
      const d   = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const ano = d.getFullYear();
      const m   = d.getMonth() + 1;
      const ini = `${ano}-${String(m).padStart(2, '0')}-01`;
      const fim = `${ano}-${String(m).padStart(2, '0')}-31`;
      const receita = _somaVendas(ini, fim);
      const nomesMes = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
      meses.push({
        label:      `${nomesMes[m - 1]}/${ano}`,
        labelCurto: nomesMes[m - 1],
        valor:      receita,
      });
    }
    return meses;
  }

  return { render };
})();
