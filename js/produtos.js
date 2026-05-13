/* ═══════════════════════════════════════════════════════════
   PRODUTOS — Catálogo de produtos e serviços
═══════════════════════════════════════════════════════════ */

const Produtos = (() => {
  let filtro = 'ativo';

  function render() {
    const container = document.getElementById('produtos-content');
    if (!container) return;

    const todos    = DB.getProdutos();
    const ativos   = todos.filter(p => p.status !== 'inativo').length;
    const inativos = todos.filter(p => p.status === 'inativo').length;

    container.innerHTML = `
      <button id="prod-novo-btn" style="display:none" aria-hidden="true"></button>

      <div class="card" id="prod-form" style="display:none;margin-bottom:var(--s-5)">
        <h3 style="font-size:var(--t-md);font-weight:600;margin-bottom:var(--s-4)">Novo produto</h3>
        <div class="field-row">
          <div class="field">
            <label class="field-label">Nome *</label>
            <input id="prod-f-nome" type="text" placeholder="Ex: Hambúrguer artesanal">
          </div>
          <div class="field">
            <label class="field-label">Categoria</label>
            <input id="prod-f-cat" type="text" placeholder="Ex: Lanches, Bebidas…">
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label class="field-label">Preço de venda (R$)</label>
            <input id="prod-f-preco" type="number" min="0" step="0.01" placeholder="0,00">
          </div>
          <div class="field">
            <label class="field-label">Custo (R$)</label>
            <input id="prod-f-custo" type="number" min="0" step="0.01" placeholder="0,00">
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label class="field-label">Estoque inicial</label>
            <input id="prod-f-estoque" type="number" min="0" value="0">
          </div>
          <div class="field">
            <label class="field-label">Alerta abaixo de</label>
            <input id="prod-f-min" type="number" min="0" value="5">
          </div>
        </div>
        <div class="field">
          <label class="field-label">Descrição</label>
          <input id="prod-f-desc" type="text" placeholder="Breve descrição (opcional)">
        </div>
        <div style="display:flex;gap:var(--s-3);justify-content:flex-end">
          <button class="btn btn-ghost" id="prod-cancel-btn">Cancelar</button>
          <button class="btn btn-primary" id="prod-save-btn">
            <span data-icon="check" data-size="14"></span> Salvar
          </button>
        </div>
      </div>

      <div style="display:flex;gap:var(--s-2);flex-wrap:wrap;margin-bottom:var(--s-5)">
        <button class="filter-chip${filtro === 'ativo'   ? ' active' : ''}" data-prod-filter="ativo">Ativos (${ativos})</button>
        <button class="filter-chip${filtro === 'inativo' ? ' active' : ''}" data-prod-filter="inativo">Inativos (${inativos})</button>
        <button class="filter-chip${filtro === 'todos'   ? ' active' : ''}" data-prod-filter="todos">Todos (${todos.length})</button>
      </div>

      <div class="prod-grid" id="prod-grid"></div>
    `;

    renderGrid();
    bindEvents(container);
    Icons.render(container);
  }

  function renderGrid() {
    const el = document.getElementById('prod-grid');
    if (!el) return;

    let produtos = DB.getProdutos();
    if (filtro === 'ativo')   produtos = produtos.filter(p => p.status !== 'inativo');
    else if (filtro === 'inativo') produtos = produtos.filter(p => p.status === 'inativo');

    if (!produtos.length) {
      el.innerHTML = `
        <div class="empty" style="grid-column:1/-1">
          <div class="empty-icon">${Icons.html('package', 26)}</div>
          <h4>${filtro === 'inativo' ? 'Nenhum produto inativo' : 'Nenhum produto ainda'}</h4>
          <p>${filtro === 'inativo' ? 'Todos os produtos estão ativos.' : 'Adicione seu primeiro produto ou serviço.'}</p>
        </div>
      `;
      Icons.render(el);
      return;
    }

    el.innerHTML = produtos.map(p => prodCard(p)).join('');

    el.querySelectorAll('[data-del-prod]').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = DB.getProdutos().find(x => x.id === btn.dataset.delProd);
        if (!p) return;
        if (confirm(`Remover "${p.nome}"?`)) {
          DB.deleteProduto(btn.dataset.delProd);
          renderGrid();
          Icons.render(el);
        }
      });
    });

    Icons.render(el);
  }

  function prodCard(p) {
    const lucro = (p.preco > 0 && p.custo > 0)
      ? ((p.preco - p.custo) / p.preco * 100).toFixed(0)
      : null;
    const estoqueAlerta = p.estoque !== undefined && p.estoqueMinimo !== undefined
      && p.estoque <= p.estoqueMinimo;

    return `
      <div class="bento-card prod-card${p.status === 'inativo' ? ' prod-inativo' : ''}">
        <div class="prod-card-head">
          <div>
            <div class="prod-nome">${esc(p.nome)}</div>
            ${p.categoria ? `<div class="prod-cat">${esc(p.categoria)}</div>` : ''}
          </div>
          <button class="prod-del-btn" data-del-prod="${esc(p.id)}" title="Remover">
            <span data-icon="trash-2" data-size="13"></span>
          </button>
        </div>
        <div class="prod-preco">R$ ${fmt(p.preco || 0)}</div>
        ${p.descricao ? `<div class="prod-desc">${esc(p.descricao)}</div>` : ''}
        <div class="prod-meta-row">
          ${lucro !== null ? `<span class="prod-lucro">Margem ${lucro}%</span>` : ''}
          ${estoqueAlerta
            ? `<span class="prod-estoque-alerta"><span data-icon="alert-triangle" data-size="10"></span> Estoque baixo</span>`
            : `<span class="prod-estoque-ok">Estoque: ${p.estoque ?? '–'}</span>`
          }
        </div>
      </div>
    `;
  }

  function bindEvents(container) {
    container.querySelector('#prod-novo-btn')?.addEventListener('click', showForm);
    container.querySelector('#prod-cancel-btn')?.addEventListener('click', () => {
      document.getElementById('prod-form').style.display = 'none';
    });
    container.querySelector('#prod-save-btn')?.addEventListener('click', salvar);
    container.querySelector('#prod-f-nome')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') salvar();
    });
    container.querySelectorAll('[data-prod-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        filtro = btn.dataset.prodFilter;
        container.querySelectorAll('[data-prod-filter]').forEach(b =>
          b.classList.toggle('active', b.dataset.prodFilter === filtro)
        );
        renderGrid();
        Icons.render(document.getElementById('prod-grid'));
      });
    });
  }

  function showForm() {
    const form = document.getElementById('prod-form');
    if (form) { form.style.display = ''; document.getElementById('prod-f-nome')?.focus(); }
  }

  function salvar() {
    const nome = document.getElementById('prod-f-nome')?.value.trim();
    if (!nome) { Toast.warning('Campo obrigatório', 'Informe o nome do produto.'); return; }

    DB.saveProduto({
      nome,
      categoria:     document.getElementById('prod-f-cat')?.value.trim()   || '',
      preco:         parseFloat(document.getElementById('prod-f-preco')?.value) || 0,
      custo:         parseFloat(document.getElementById('prod-f-custo')?.value) || 0,
      estoque:       parseInt(document.getElementById('prod-f-estoque')?.value)  || 0,
      estoqueMinimo: parseInt(document.getElementById('prod-f-min')?.value)      || 5,
      descricao:     document.getElementById('prod-f-desc')?.value.trim()   || '',
      status: 'ativo',
    });

    ['prod-f-nome','prod-f-cat','prod-f-preco','prod-f-custo','prod-f-estoque','prod-f-desc'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    document.getElementById('prod-form').style.display = 'none';

    Toast.success('Produto salvo', nome);
    renderGrid();
    Icons.render(document.getElementById('prod-grid'));
  }

  return { render, novo: showForm };
})();
