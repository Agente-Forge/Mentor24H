/* ═══════════════════════════════════════════════════════════
   VENDAS — Registro e acompanhamento de vendas
═══════════════════════════════════════════════════════════ */

const Vendas = (() => {
  let filtroStatus = 'todas';

  function render() {
    const container = document.getElementById('vendas-content');
    if (!container) return;

    const todas    = DB.getVendas();
    const pagas    = todas.filter(v => v.status === 'paga').length;
    const pend     = todas.filter(v => v.status === 'pendente').length;
    const totalMes = _totalMes(todas);

    container.innerHTML = `
      <button id="venda-nova-btn" style="display:none" aria-hidden="true"></button>

      <div class="card" id="venda-form" style="display:none;margin-bottom:var(--s-5)">
        <h3 style="font-size:var(--t-md);font-weight:600;margin-bottom:var(--s-4)">Nova venda</h3>
        <div class="field-row">
          <div class="field">
            <label class="field-label">Data</label>
            <input id="venda-f-data" type="date" value="${todayISO()}">
          </div>
          <div class="field">
            <label class="field-label">Cliente</label>
            <input id="venda-f-cliente" type="text" placeholder="Nome do cliente (opcional)" list="venda-cli-list">
            <datalist id="venda-cli-list">
              ${DB.getClientesNeg().map(c => `<option value="${esc(c.nome)}">`).join('')}
            </datalist>
          </div>
        </div>
        <div class="field">
          <label class="field-label">Descrição do pedido</label>
          <input id="venda-f-desc" type="text" placeholder="Ex: 2x Hambúrguer + 1x Suco">
        </div>
        <div class="field-row">
          <div class="field">
            <label class="field-label">Total (R$) *</label>
            <input id="venda-f-total" type="number" min="0" step="0.01" placeholder="0,00">
          </div>
          <div class="field">
            <label class="field-label">Forma de pagamento</label>
            <select id="venda-f-pag">
              <option value="dinheiro">Dinheiro</option>
              <option value="pix">PIX</option>
              <option value="cartao_credito">Cartão crédito</option>
              <option value="cartao_debito">Cartão débito</option>
              <option value="fiado">Fiado</option>
              <option value="transferencia">Transferência</option>
            </select>
          </div>
        </div>
        <div class="field">
          <label class="field-label">Status</label>
          <select id="venda-f-status">
            <option value="paga">Paga</option>
            <option value="pendente">Pendente</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
        <div style="display:flex;gap:var(--s-3);justify-content:flex-end">
          <button class="btn btn-ghost" id="venda-cancel-btn">Cancelar</button>
          <button class="btn btn-primary" id="venda-save-btn">
            <span data-icon="check" data-size="14"></span> Salvar
          </button>
        </div>
      </div>

      <div class="bento-grid" style="margin-bottom:var(--s-5)">
        <div class="bento-card span-4" style="padding:var(--s-4)">
          <div style="font-size:11px;color:var(--text-4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:var(--s-2)">Mês atual</div>
          <div style="font-size:var(--t-xl);font-weight:700;color:var(--violet);font-family:var(--font-mono)">R$ ${fmt(totalMes)}</div>
        </div>
        <div class="bento-card span-4" style="padding:var(--s-4)">
          <div style="font-size:11px;color:var(--text-4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:var(--s-2)">Pagas</div>
          <div style="font-size:var(--t-xl);font-weight:700;color:var(--green);font-family:var(--font-mono)">${pagas}</div>
        </div>
        <div class="bento-card span-4" style="padding:var(--s-4)">
          <div style="font-size:11px;color:var(--text-4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:var(--s-2)">Pendentes</div>
          <div style="font-size:var(--t-xl);font-weight:700;color:var(--amber);font-family:var(--font-mono)">${pend}</div>
        </div>
      </div>

      <div style="display:flex;gap:var(--s-2);flex-wrap:wrap;margin-bottom:var(--s-5)">
        <button class="filter-chip${filtroStatus === 'todas'     ? ' active' : ''}" data-venda-filter="todas">Todas (${todas.length})</button>
        <button class="filter-chip${filtroStatus === 'paga'      ? ' active' : ''}" data-venda-filter="paga">Pagas (${pagas})</button>
        <button class="filter-chip${filtroStatus === 'pendente'  ? ' active' : ''}" data-venda-filter="pendente">Pendentes (${pend})</button>
        <button class="filter-chip${filtroStatus === 'cancelada' ? ' active' : ''}" data-venda-filter="cancelada">Canceladas</button>
      </div>

      <div class="venda-lista" id="venda-lista"></div>
    `;

    renderLista();
    bindEvents(container);
    Icons.render(container);
  }

  function renderLista() {
    const el = document.getElementById('venda-lista');
    if (!el) return;

    let vendas = DB.getVendas();
    if (filtroStatus !== 'todas') vendas = vendas.filter(v => v.status === filtroStatus);
    vendas = vendas.slice().sort((a, b) => (b.data || '').localeCompare(a.data || ''));

    if (!vendas.length) {
      el.innerHTML = `
        <div class="empty">
          <div class="empty-icon">${Icons.html('shopping-cart', 26)}</div>
          <h4>Nenhuma venda</h4>
          <p>${filtroStatus === 'todas' ? 'Registre sua primeira venda.' : 'Nenhuma venda com este status.'}</p>
        </div>
      `;
      Icons.render(el);
      return;
    }

    el.innerHTML = vendas.map(v => vendaItem(v)).join('');

    el.querySelectorAll('[data-del-venda]').forEach(btn => {
      btn.addEventListener('click', () => {
        const v = DB.getVendas().find(x => x.id === btn.dataset.delVenda);
        if (!v) return;
        if (confirm('Remover esta venda?')) {
          DB.deleteVenda(btn.dataset.delVenda);
          renderLista();
          Icons.render(el);
        }
      });
    });

    Icons.render(el);
  }

  function vendaItem(v) {
    const dataFmt  = (v.data || '').split('-').reverse().join('/');
    const pagLabels = { dinheiro: 'Dinheiro', pix: 'PIX', cartao_credito: 'Crédito', cartao_debito: 'Débito', fiado: 'Fiado', transferencia: 'Trans.' };
    const pagLabel = pagLabels[v.formaPagamento] || v.formaPagamento || '—';
    const desc = v.itens && v.itens.length ? v.itens[0].produto : '';

    return `
      <div class="venda-item">
        <div class="venda-item-head">
          <span class="venda-data">${dataFmt}</span>
          <span class="venda-cliente">${esc(v.clienteNome || 'Avulso')}</span>
          <span class="venda-total">R$ ${fmt(v.total || 0)}</span>
          <button class="venda-del-btn" data-del-venda="${esc(v.id)}" title="Remover">
            <span data-icon="trash-2" data-size="13"></span>
          </button>
        </div>
        <div class="venda-meta">
          <span class="venda-badge ${v.status || 'paga'}">${(v.status || 'paga').charAt(0).toUpperCase() + (v.status || 'paga').slice(1)}</span>
          <span>${esc(pagLabel)}</span>
          ${desc ? `<span>${esc(desc)}</span>` : ''}
        </div>
      </div>
    `;
  }

  function bindEvents(container) {
    container.querySelector('#venda-nova-btn')?.addEventListener('click', showForm);
    container.querySelector('#venda-cancel-btn')?.addEventListener('click', () => {
      document.getElementById('venda-form').style.display = 'none';
    });
    container.querySelector('#venda-save-btn')?.addEventListener('click', salvar);
    container.querySelector('#venda-f-total')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') salvar();
    });
    container.querySelectorAll('[data-venda-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        filtroStatus = btn.dataset.vendaFilter;
        container.querySelectorAll('[data-venda-filter]').forEach(b =>
          b.classList.toggle('active', b.dataset.vendaFilter === filtroStatus)
        );
        renderLista();
        Icons.render(document.getElementById('venda-lista'));
      });
    });
  }

  function showForm() {
    const form = document.getElementById('venda-form');
    if (form) { form.style.display = ''; document.getElementById('venda-f-total')?.focus(); }
  }

  function salvar() {
    const totalStr = document.getElementById('venda-f-total')?.value;
    const total    = parseFloat(totalStr);
    if (!total || total <= 0) { Toast.warning('Campo obrigatório', 'Informe o total da venda.'); return; }

    const clienteNome = document.getElementById('venda-f-cliente')?.value.trim() || '';
    const cliente     = DB.getClientesNeg().find(c => c.nome.toLowerCase() === clienteNome.toLowerCase());
    const desc        = document.getElementById('venda-f-desc')?.value.trim() || '';
    const formaPag    = document.getElementById('venda-f-pag')?.value || 'dinheiro';
    const status      = document.getElementById('venda-f-status')?.value || 'paga';

    DB.saveVenda({
      data:           document.getElementById('venda-f-data')?.value || todayISO(),
      clienteId:      cliente ? cliente.id : null,
      clienteNome,
      itens:          desc ? [{ produto: desc, qtd: 1, preco: total }] : [],
      total,
      formaPagamento: formaPag,
      status,
    });

    if (formaPag === 'fiado' && cliente) {
      DB.saveClienteNeg({ id: cliente.id, saldoDevedor: (cliente.saldoDevedor || 0) + total });
    }

    ['venda-f-cliente','venda-f-desc','venda-f-total'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    document.getElementById('venda-form').style.display = 'none';

    Toast.success('Venda registrada', `R$ ${fmt(total)}`);
    render();
  }

  function _totalMes(vendas) {
    const mes = todayISO().slice(0, 7);
    return vendas
      .filter(v => (v.data || '').startsWith(mes) && v.status === 'paga')
      .reduce((s, v) => s + (v.total || 0), 0);
  }

  return { render, nova: showForm };
})();
