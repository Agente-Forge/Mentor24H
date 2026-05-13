/* ═══════════════════════════════════════════════════════════
   CLIENTES — CRM simples para negócio
═══════════════════════════════════════════════════════════ */

const Clientes = (() => {
  let busca = '';

  function render() {
    const container = document.getElementById('clientes-content');
    if (!container) return;

    const total = DB.getClientesNeg().length;

    container.innerHTML = `
      <button id="cli-novo-btn" style="display:none" aria-hidden="true"></button>

      <div class="card" id="cli-form" style="display:none;margin-bottom:var(--s-5)">
        <h3 style="font-size:var(--t-md);font-weight:600;margin-bottom:var(--s-4)">Novo cliente</h3>
        <div class="field-row">
          <div class="field">
            <label class="field-label">Nome *</label>
            <input id="cli-f-nome" type="text" placeholder="Nome completo">
          </div>
          <div class="field">
            <label class="field-label">Telefone</label>
            <input id="cli-f-tel" type="tel" placeholder="(11) 99999-9999">
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label class="field-label">E-mail</label>
            <input id="cli-f-email" type="email" placeholder="email@exemplo.com">
          </div>
          <div class="field">
            <label class="field-label">Aniversário</label>
            <input id="cli-f-aniv" type="date">
          </div>
        </div>
        <div class="field">
          <label class="field-label">Notas</label>
          <input id="cli-f-notas" type="text" placeholder="Observações (opcional)">
        </div>
        <div style="display:flex;gap:var(--s-3);justify-content:flex-end">
          <button class="btn btn-ghost" id="cli-cancel-btn">Cancelar</button>
          <button class="btn btn-primary" id="cli-save-btn">
            <span data-icon="check" data-size="14"></span> Salvar
          </button>
        </div>
      </div>

      <div class="filter-bar" style="margin-bottom:var(--s-5)">
        <input type="text" id="cli-busca" placeholder="Buscar por nome ou telefone…" value="${esc(busca)}" style="max-width:360px">
      </div>

      <div class="page-sub" style="margin-bottom:var(--s-4)">${total} cliente${total !== 1 ? 's' : ''} cadastrado${total !== 1 ? 's' : ''}</div>

      <div class="clientes-lista" id="clientes-lista"></div>
    `;

    renderLista();
    bindEvents(container);
    Icons.render(container);
  }

  function renderLista() {
    const el = document.getElementById('clientes-lista');
    if (!el) return;

    const clientes = DB.getClientesNeg(busca || undefined);
    const vendas   = DB.getVendas();

    if (!clientes.length) {
      el.innerHTML = `
        <div class="empty">
          <div class="empty-icon">${Icons.html('users', 26)}</div>
          <h4>${busca ? `Nenhum resultado para "${esc(busca)}"` : 'Nenhum cliente ainda'}</h4>
          <p>${busca ? 'Tente outro termo.' : 'Adicione clientes para organizar seu CRM.'}</p>
        </div>
      `;
      Icons.render(el);
      return;
    }

    el.innerHTML = clientes.map(c => {
      const vendasCliente = vendas.filter(v => v.clienteId === c.id || v.clienteNome === c.nome);
      const totalGasto    = vendasCliente.reduce((s, v) => s + (v.total || 0), 0);
      return clienteItem(c, vendasCliente.length, totalGasto);
    }).join('');

    el.querySelectorAll('[data-del-cli]').forEach(btn => {
      btn.addEventListener('click', () => {
        const c = DB.getClientesNeg().find(x => x.id === btn.dataset.delCli);
        if (!c) return;
        if (confirm(`Remover ${c.nome}?`)) {
          DB.deleteClienteNeg(btn.dataset.delCli);
          renderLista();
          Icons.render(el);
        }
      });
    });

    Icons.render(el);
  }

  function clienteItem(c, numVendas, totalGasto) {
    const initial = (c.nome || '?')[0].toUpperCase();
    const cor     = avatarColor(c.nome);
    const contato = [c.telefone, c.email].filter(Boolean).join(' · ');

    return `
      <div class="cliente-item">
        <div class="cliente-avatar" style="background:${cor}">${initial}</div>
        <div class="cliente-info">
          <div class="cliente-nome">${esc(c.nome)}</div>
          ${contato ? `<div class="cliente-contato">${esc(contato)}</div>` : ''}
          ${numVendas > 0 ? `<div class="cliente-contato">${numVendas} venda${numVendas !== 1 ? 's' : ''} · R$ ${fmt(totalGasto)}</div>` : ''}
        </div>
        ${c.saldoDevedor > 0 ? `<div class="cliente-saldo">Deve R$ ${fmt(c.saldoDevedor)}</div>` : ''}
        <button class="cliente-del-btn" data-del-cli="${esc(c.id)}" title="Remover">
          <span data-icon="trash-2" data-size="13"></span>
        </button>
      </div>
    `;
  }

  function bindEvents(container) {
    container.querySelector('#cli-novo-btn')?.addEventListener('click', showForm);
    container.querySelector('#cli-cancel-btn')?.addEventListener('click', () => {
      document.getElementById('cli-form').style.display = 'none';
    });
    container.querySelector('#cli-save-btn')?.addEventListener('click', salvar);
    container.querySelector('#cli-f-nome')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') salvar();
    });
    container.querySelector('#cli-busca')?.addEventListener('input', e => {
      busca = e.target.value;
      renderLista();
      Icons.render(document.getElementById('clientes-lista'));
    });
  }

  function showForm() {
    const form = document.getElementById('cli-form');
    if (form) { form.style.display = ''; document.getElementById('cli-f-nome')?.focus(); }
  }

  function salvar() {
    const nome = document.getElementById('cli-f-nome')?.value.trim();
    if (!nome) { Toast.warning('Campo obrigatório', 'Informe o nome do cliente.'); return; }

    DB.saveClienteNeg({
      nome,
      telefone:    document.getElementById('cli-f-tel')?.value.trim()   || '',
      email:       document.getElementById('cli-f-email')?.value.trim() || '',
      aniversario: document.getElementById('cli-f-aniv')?.value         || null,
      notas:       document.getElementById('cli-f-notas')?.value.trim() || '',
    });

    ['cli-f-nome','cli-f-tel','cli-f-email','cli-f-aniv','cli-f-notas'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    document.getElementById('cli-form').style.display = 'none';

    Toast.success('Cliente salvo', nome);
    renderLista();
    Icons.render(document.getElementById('clientes-lista'));
  }

  function avatarColor(str) {
    const palette = ['#A78BFA','#F472B6','#FB923C','#5EE39A','#7BB6FF','#FBBF24','#22D3EE','#D4A574'];
    let h = 0;
    for (let i = 0; i < (str || '').length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xFFFF;
    return palette[h % palette.length];
  }

  return { render, novo: showForm };
})();
