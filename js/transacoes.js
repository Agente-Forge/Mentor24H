/* ═══════════════════════════════════════════════════════════
   TRANSAÇÕES — Histórico agrupado por data
═══════════════════════════════════════════════════════════ */

const Transacoes = (() => {
  const m = Utils.getMonthRange();
  let filtros = {
    tipo: 'todas', categoria: 'todas',
    dataInicio: m.start, dataFim: m.end,
  };

  const METODO_LABEL = {
    pix: 'Pix',
    dinheiro: 'Dinheiro',
    cartao_debito: 'Cartão Débito',
    cartao_credito: 'Cartão Crédito',
    ted: 'TED/DOC',
    outros: 'Outros',
  };

  function render() {
    renderKPIs();
    renderFiltros();
    renderLista();
  }

  function renderKPIs() {
    const txs = DB.getTransacoes(filtros);
    const ent = txs.filter(t => t.tipo === 'entrada').reduce((s, t) => s + t.valor, 0);
    const sai = txs.filter(t => t.tipo === 'saida').reduce((s, t) => s + t.valor, 0);
    const liq = ent - sai;

    const el = document.getElementById('tx-kpis');
    if (!el) return;
    el.innerHTML = [
      { lbl: 'Entradas', val: ent, color: 'var(--green)', accent: 'green', icon: 'arrow-down-left', prefix: '+' },
      { lbl: 'Saídas',   val: sai, color: 'var(--red)',   accent: 'red',   icon: 'arrow-up-right',  prefix: '-' },
      { lbl: 'Saldo do período', val: liq, color: liq >= 0 ? 'var(--green)' : 'var(--red)', accent: liq >= 0 ? 'green' : 'red', icon: 'wallet', prefix: liq >= 0 ? '+' : '' },
    ].map(k => `
      <div class="bento-card">
        <div class="card-head" style="margin-bottom:var(--s-3)">
          <span class="card-eyebrow">${esc(k.lbl)}</span>
          <div class="card-pill ${k.accent}">${Icons.html(k.icon, 14)}</div>
        </div>
        <div class="num" style="font-size:var(--t-xl);font-weight:600;color:${k.color}">${k.prefix}${fmt(k.val)}</div>
      </div>
    `).join('');
  }

  function renderFiltros() {
    const el = document.getElementById('tx-filtros');
    if (!el) return;
    const cats = DB.getCategorias();
    el.innerHTML = `
      <select onchange="Transacoes.setFiltro('tipo', this.value)">
        <option value="todas">Todos os tipos</option>
        <option value="entrada" ${filtros.tipo === 'entrada' ? 'selected' : ''}>Entradas</option>
        <option value="saida"   ${filtros.tipo === 'saida' ? 'selected' : ''}>Saídas</option>
      </select>
      <select onchange="Transacoes.setFiltro('categoria', this.value)">
        <option value="todas">Todas categorias</option>
        ${cats.map(c => `<option value="${c.id}" ${filtros.categoria === c.id ? 'selected' : ''}>${esc(c.nome)}</option>`).join('')}
      </select>
      <input type="date" value="${esc(filtros.dataInicio)}" onchange="Transacoes.setFiltro('dataInicio', this.value)" style="max-width:150px">
      <input type="date" value="${esc(filtros.dataFim)}" onchange="Transacoes.setFiltro('dataFim', this.value)" style="max-width:150px">
    `;
  }

  function renderLista() {
    const el = document.getElementById('tx-lista');
    if (!el) return;
    const txs = DB.getTransacoes(filtros);

    if (!txs.length) {
      el.innerHTML = `<div class="empty"><div class="empty-icon">${Icons.html('arrow-left-right', 22)}</div><h4>Sem transações</h4><p>Registre uma entrada ou saída no botão "+"</p></div>`;
      return;
    }

    const grupos = {};
    txs.forEach(t => {
      const k = Utils.formatDateLong(t.data);
      if (!grupos[k]) grupos[k] = [];
      grupos[k].push(t);
    });

    el.innerHTML = Object.entries(grupos).map(([date, items]) => `
      <div class="list-group-label">${esc(date)}</div>
      ${items.map(t => `
        <div class="list-item" style="grid-template-columns:38px 1fr auto auto">
          <div class="list-icon" style="background:${t.tipo === 'entrada' ? 'var(--green-bg)' : 'var(--red-bg)'};color:${t.tipo === 'entrada' ? 'var(--green)' : 'var(--red)'}">
            ${Icons.html(t.tipo === 'entrada' ? 'arrow-down-left' : 'arrow-up-right', 16)}
          </div>
          <div class="list-info">
            <h4>${esc(t.descricao || 'Transação')}</h4>
            <div class="meta">
              <span>${esc(METODO_LABEL[t.metodo] || t.metodo || '—')}</span>
              ${t.categoria ? `<span>·</span><span>${esc(DB.getCategoria(t.categoria)?.nome || '')}</span>` : ''}
            </div>
          </div>
          <div class="list-amount ${t.tipo === 'entrada' ? 'green' : 'red'}">
            ${t.tipo === 'entrada' ? '+' : '-'}${fmt(t.valor)}
          </div>
          <div class="list-actions">
            <button class="btn btn-danger btn-icon btn-sm" onclick="Transacoes.excluir('${esc(t.id)}')" title="Excluir">
              ${Icons.html('trash-2', 12)}
            </button>
          </div>
        </div>
      `).join('')}
    `).join('');
  }

  function setFiltro(k, v) {
    filtros[k] = v;
    renderLista();
    renderKPIs();
  }

  function excluir(id) {
    Modal.confirm(
      'Excluir transação?',
      'Esta ação não pode ser desfeita.',
      () => {
        DB.deleteTransacao(id);
        Toast.success('Transação removida');
        render();
      },
      'Excluir'
    );
  }

  return { render, setFiltro, excluir };
})();
