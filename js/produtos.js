/* ═══════════════════════════════════════════════════════════
   PRODUTOS — Catálogo de produtos e serviços
═══════════════════════════════════════════════════════════ */

const Produtos = (() => {
  let filtro = 'ativo';
  let modoCatalogo = false;

  function render() {
    const container = document.getElementById('produtos-content');
    if (!container) return;
    modoCatalogo = false;
    _renderMain(container);
  }

  function _renderMain(container) {
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
            <label class="field-label">Custo (R$)</label>
            <input id="prod-f-custo" type="number" min="0" step="0.01" placeholder="0,00">
          </div>
          <div class="field">
            <label class="field-label">Margem %</label>
            <input id="prod-f-margem" type="number" min="0" step="0.1" placeholder="Ex: 50">
          </div>
        </div>
        <div class="field">
          <label class="field-label">Preço de venda (R$)</label>
          <input id="prod-f-preco" type="text" readonly placeholder="Calculado automaticamente"
            style="background:var(--bg-secondary);cursor:default;opacity:.8">
        </div>
        <div class="field">
          <label class="field-label">Foto (URL)</label>
          <input id="prod-f-foto" type="url" placeholder="https://... (opcional)">
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

      <div style="display:flex;gap:var(--s-3);flex-wrap:wrap;align-items:center;margin-bottom:var(--s-5)">
        <div style="display:flex;gap:var(--s-2);flex-wrap:wrap;flex:1">
          <button class="filter-chip${filtro === 'ativo'   ? ' active' : ''}" data-prod-filter="ativo">Ativos (${ativos})</button>
          <button class="filter-chip${filtro === 'inativo' ? ' active' : ''}" data-prod-filter="inativo">Inativos (${inativos})</button>
          <button class="filter-chip${filtro === 'todos'   ? ' active' : ''}" data-prod-filter="todos">Todos (${todos.length})</button>
        </div>
        <button class="btn btn-ghost btn-sm" id="prod-catalogo-btn">
          <span data-icon="layout-grid" data-size="14"></span> Ver catálogo
        </button>
      </div>

      <div class="prod-grid" id="prod-grid"></div>
    `;

    _renderGrid();
    _bindMainEvents(container);
    Icons.render(container);
  }

  /* ─── Task 3.3 — Catálogo público (modo leitura) ─── */
  function renderCatalogo() {
    const container = document.getElementById('produtos-content');
    if (!container) return;
    modoCatalogo = true;

    const produtos = DB.getProdutos().filter(p => p.status !== 'inativo');

    container.innerHTML = `
      <div style="display:flex;align-items:center;gap:var(--s-3);margin-bottom:var(--s-5)">
        <button class="btn btn-ghost btn-sm" id="prod-back-btn">
          <span data-icon="arrow-left" data-size="14"></span> Voltar
        </button>
        <h2 style="font-size:var(--t-lg);font-weight:600;flex:1">Catálogo</h2>
      </div>
      ${!produtos.length
        ? `<div class="empty"><div class="empty-icon">${Icons.html('package', 26)}</div><h4>Nenhum produto ativo</h4><p>Adicione produtos para exibir no catálogo.</p></div>`
        : `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:var(--s-4)">${produtos.map(p => _catalogoCard(p)).join('')}</div>`
      }
    `;

    document.getElementById('prod-back-btn')?.addEventListener('click', () => { render(); });
    Icons.render(container);
  }

  function _catalogoCard(p) {
    const preco = p.preco || (p.custo && p.margemPct != null ? p.custo * (1 + p.margemPct / 100) : 0);
    return `
      <div class="bento-card" style="display:flex;flex-direction:column;gap:var(--s-3);padding:var(--s-4)">
        ${p.fotoUrl
          ? `<img src="${esc(p.fotoUrl)}" alt="${esc(p.nome)}" style="width:100%;height:160px;object-fit:cover;border-radius:var(--radius-sm)" onerror="this.style.display='none'">`
          : `<div style="height:160px;background:var(--bg-secondary);border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;color:var(--text-4)">${Icons.html('image', 32)}</div>`
        }
        <div>
          <div style="font-weight:600;font-size:var(--t-md)">${esc(p.nome)}</div>
          ${p.categoria ? `<div style="font-size:12px;color:var(--text-4);margin-top:2px">${esc(p.categoria)}</div>` : ''}
          ${p.descricao ? `<div style="font-size:13px;color:var(--text-3);margin-top:var(--s-2)">${esc(p.descricao)}</div>` : ''}
        </div>
        <div style="font-size:var(--t-lg);font-weight:700;color:var(--color-gold);font-family:var(--font-mono)">R$ ${fmt(preco)}</div>
      </div>
    `;
  }

  function _renderGrid() {
    const el = document.getElementById('prod-grid');
    if (!el) return;

    let produtos = DB.getProdutos();
    if (filtro === 'ativo')        produtos = produtos.filter(p => p.status !== 'inativo');
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

    el.innerHTML = produtos.map(p => _prodCard(p)).join('');

    el.querySelectorAll('[data-del-prod]').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = DB.getProdutos().find(x => x.id === btn.dataset.delProd);
        if (!p) return;
        if (confirm(`Remover "${p.nome}"?`)) {
          DB.deleteProduto(btn.dataset.delProd);
          _renderGrid();
          Icons.render(el);
        }
      });
    });

    Icons.render(el);
  }

  function _prodCard(p) {
    const margemLabel = p.margemPct != null
      ? `Margem ${Number(p.margemPct).toFixed(0)}%`
      : (p.preco > 0 && p.custo > 0 ? `Margem ${((p.preco - p.custo) / p.preco * 100).toFixed(0)}%` : null);
    const estoqueAlerta = p.estoque !== undefined && p.estoqueMinimo !== undefined
      && p.estoque <= p.estoqueMinimo;

    return `
      <div class="bento-card prod-card${p.status === 'inativo' ? ' prod-inativo' : ''}">
        ${p.fotoUrl ? `<img src="${esc(p.fotoUrl)}" alt="${esc(p.nome)}" style="width:100%;height:100px;object-fit:cover;border-radius:var(--radius-sm);margin-bottom:var(--s-3)" onerror="this.style.display='none'">` : ''}
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
          ${margemLabel ? `<span class="prod-lucro">${esc(margemLabel)}</span>` : ''}
          ${estoqueAlerta
            ? `<span class="prod-estoque-alerta"><span data-icon="alert-triangle" data-size="10"></span> Estoque baixo</span>`
            : `<span class="prod-estoque-ok">Estoque: ${p.estoque ?? '–'}</span>`
          }
        </div>
      </div>
    `;
  }

  function _bindMainEvents(container) {
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
        _renderGrid();
        Icons.render(document.getElementById('prod-grid'));
      });
    });
    container.querySelector('#prod-catalogo-btn')?.addEventListener('click', renderCatalogo);
    ['prod-f-custo', 'prod-f-margem'].forEach(id => {
      container.querySelector(`#${id}`)?.addEventListener('input', _atualizarPreco);
    });
  }

  function _atualizarPreco() {
    const custo  = parseFloat(document.getElementById('prod-f-custo')?.value) || 0;
    const margem = parseFloat(document.getElementById('prod-f-margem')?.value) || 0;
    const preco  = custo * (1 + margem / 100);
    const el     = document.getElementById('prod-f-preco');
    if (el) el.value = preco > 0 ? `R$ ${fmt(preco)}` : '';
  }

  function showForm() {
    const form = document.getElementById('prod-form');
    if (form) { form.style.display = ''; document.getElementById('prod-f-nome')?.focus(); }
  }

  function salvar() {
    const nome = document.getElementById('prod-f-nome')?.value.trim();
    if (!nome) { Toast.warning('Campo obrigatório', 'Informe o nome do produto.'); return; }

    const custo    = parseFloat(document.getElementById('prod-f-custo')?.value)  || 0;
    const margemPct = parseFloat(document.getElementById('prod-f-margem')?.value) || 0;
    const preco    = custo * (1 + margemPct / 100);

    DB.saveProduto({
      nome,
      categoria:     document.getElementById('prod-f-cat')?.value.trim()  || '',
      custo,
      margemPct,
      preco,
      fotoUrl:       document.getElementById('prod-f-foto')?.value.trim() || '',
      estoque:       parseInt(document.getElementById('prod-f-estoque')?.value) || 0,
      estoqueMinimo: parseInt(document.getElementById('prod-f-min')?.value)     || 5,
      descricao:     document.getElementById('prod-f-desc')?.value.trim()  || '',
      status: 'ativo',
    });

    ['prod-f-nome','prod-f-cat','prod-f-custo','prod-f-margem','prod-f-preco',
     'prod-f-foto','prod-f-estoque','prod-f-desc'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    document.getElementById('prod-form').style.display = 'none';

    Toast.success('Produto salvo', nome);
    _renderGrid();
    Icons.render(document.getElementById('prod-grid'));
  }

  return { render, novo: showForm, catalogo: renderCatalogo };
})();
