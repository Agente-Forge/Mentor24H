/* ═══════════════════════════════════════════════════════════
   ESTOQUE — Visão de estoque baseada nos produtos
═══════════════════════════════════════════════════════════ */

const Estoque = (() => {
  let filtro = 'todos';

  function render() {
    const container = document.getElementById('estoque-content');
    if (!container) return;

    const produtos = DB.getProdutos().filter(p => p.status !== 'inativo');
    const baixo    = produtos.filter(p => p.estoque !== undefined && p.estoqueMinimo !== undefined && p.estoque <= p.estoqueMinimo).length;
    const ok       = produtos.length - baixo;

    container.innerHTML = `
      <div style="display:flex;gap:var(--s-2);flex-wrap:wrap;margin-bottom:var(--s-5)">
        <button class="filter-chip${filtro === 'todos' ? ' active' : ''}" data-est-filter="todos">Todos (${produtos.length})</button>
        <button class="filter-chip${filtro === 'baixo' ? ' active' : ''}" data-est-filter="baixo">Estoque baixo (${baixo})</button>
        <button class="filter-chip${filtro === 'ok'    ? ' active' : ''}" data-est-filter="ok">OK (${ok})</button>
      </div>

      ${baixo > 0 ? `
        <div style="display:flex;align-items:center;gap:var(--s-2);padding:var(--s-3) var(--s-4);background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.3);border-radius:var(--r-md);margin-bottom:var(--s-5);font-size:var(--t-xs);color:var(--amber)">
          <span data-icon="alert-triangle" data-size="14"></span>
          ${baixo} produto${baixo !== 1 ? 's' : ''} com estoque abaixo do mínimo.
          <button class="btn btn-ghost" style="margin-left:auto;font-size:11px;padding:2px 8px" onclick="Router.navigate('produtos')">Ver produtos</button>
        </div>
      ` : ''}

      <div class="estoque-grid" id="estoque-grid"></div>
    `;

    renderGrid();
    bindEvents(container);
    Icons.render(container);
  }

  function renderGrid() {
    const el = document.getElementById('estoque-grid');
    if (!el) return;

    let produtos = DB.getProdutos().filter(p => p.status !== 'inativo');

    if (filtro === 'baixo') {
      produtos = produtos.filter(p => p.estoque !== undefined && p.estoqueMinimo !== undefined && p.estoque <= p.estoqueMinimo);
    } else if (filtro === 'ok') {
      produtos = produtos.filter(p => !(p.estoque !== undefined && p.estoqueMinimo !== undefined && p.estoque <= p.estoqueMinimo));
    }

    if (!produtos.length) {
      el.innerHTML = `
        <div class="empty" style="grid-column:1/-1">
          <div class="empty-icon">${Icons.html('archive', 26)}</div>
          <h4>${filtro === 'baixo' ? 'Nenhum produto com estoque baixo' : 'Nenhum produto cadastrado'}</h4>
          <p>${filtro === 'baixo' ? 'Todos os estoques estão adequados.' : 'Cadastre produtos para controlar o estoque.'}</p>
        </div>
      `;
      Icons.render(el);
      return;
    }

    el.innerHTML = produtos.map(p => estoqueCard(p)).join('');
    Icons.render(el);
  }

  function estoqueCard(p) {
    const qty      = p.estoque ?? 0;
    const min      = p.estoqueMinimo ?? 5;
    const max      = Math.max(qty, min * 3, 1);
    const pct      = Math.min(100, Math.round((qty / max) * 100));
    const nivel    = qty === 0 ? 'danger' : qty <= min ? 'warn' : 'ok';

    return `
      <div class="bento-card estoque-card">
        <div class="estoque-card-head">
          <div>
            <div class="estoque-nome">${esc(p.nome)}</div>
            ${p.categoria ? `<div class="estoque-cat">${esc(p.categoria)}</div>` : ''}
          </div>
          ${nivel !== 'ok' ? `<span data-icon="alert-triangle" data-size="14" style="color:var(--${nivel === 'danger' ? 'red' : 'amber'})"></span>` : ''}
        </div>
        <div class="estoque-qty ${nivel}">${qty}</div>
        <div class="estoque-label">unidade${qty !== 1 ? 's' : ''} em estoque</div>
        <div class="estoque-bar">
          <div class="estoque-bar-fill ${nivel}" style="width:${pct}%"></div>
        </div>
        <div class="estoque-min-label">Mínimo: ${min} · Preço: R$ ${fmt(p.preco || 0)}</div>
      </div>
    `;
  }

  function bindEvents(container) {
    container.querySelectorAll('[data-est-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        filtro = btn.dataset.estFilter;
        container.querySelectorAll('[data-est-filter]').forEach(b =>
          b.classList.toggle('active', b.dataset.estFilter === filtro)
        );
        renderGrid();
        Icons.render(document.getElementById('estoque-grid'));
      });
    });
  }

  return { render };
})();
