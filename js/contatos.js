/* ═══════════════════════════════════════════════════════════
   CONTATOS — Agenda de contatos pessoais
═══════════════════════════════════════════════════════════ */

const Contatos = (() => {
  let busca = '';

  function render() {
    const container = document.getElementById('contatos-content');
    if (!container) return;

    const total = DB.getContatos().length;

    container.innerHTML = `
      <div class="page-head">
        <div>
          <h2 class="page-title">Meus <em>contatos</em></h2>
          <div class="page-sub">${total} contato${total !== 1 ? 's' : ''}</div>
        </div>
        <button class="btn btn-primary" id="ctto-novo-btn">
          <span data-icon="user-plus" data-size="14"></span>
          Novo contato
        </button>
      </div>

      <div class="card" id="ctto-form" style="display:none;margin-bottom:var(--s-5)">
        <h3 style="font-size:var(--t-md);font-weight:600;margin-bottom:var(--s-4)">Novo contato</h3>
        <div class="field-row">
          <div class="field">
            <label class="field-label">Nome *</label>
            <input id="ctto-f-nome" type="text" placeholder="Nome completo">
          </div>
          <div class="field">
            <label class="field-label">Telefone</label>
            <input id="ctto-f-tel" type="tel" placeholder="(11) 99999-9999">
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label class="field-label">E-mail</label>
            <input id="ctto-f-email" type="email" placeholder="email@exemplo.com">
          </div>
          <div class="field">
            <label class="field-label">Tags (vírgula)</label>
            <input id="ctto-f-tags" type="text" placeholder="amigo, trabalho, família">
          </div>
        </div>
        <div class="field">
          <label class="field-label">Notas</label>
          <input id="ctto-f-notas" type="text" placeholder="Observações (opcional)">
        </div>
        <div style="display:flex;gap:var(--s-3);justify-content:flex-end">
          <button class="btn btn-ghost" id="ctto-cancel-btn">Cancelar</button>
          <button class="btn btn-primary" id="ctto-save-btn">
            <span data-icon="check" data-size="14"></span> Salvar
          </button>
        </div>
      </div>

      <div class="filter-bar" style="margin-bottom:var(--s-5)">
        <input type="text" id="ctto-busca" placeholder="Buscar por nome, telefone ou email…" value="${esc(busca)}" style="max-width:360px">
      </div>

      <div class="contatos-grid" id="contatos-grid"></div>
    `;

    renderGrid();
    bindEvents(container);
    Icons.render(container);
  }

  function renderGrid() {
    const el = document.getElementById('contatos-grid');
    if (!el) return;

    const contatos = DB.getContatos(busca || undefined);

    if (!contatos.length) {
      el.innerHTML = `
        <div class="empty" style="grid-column:1/-1">
          <div class="empty-icon">${Icons.html('users', 26)}</div>
          <h4>${busca ? `Nenhum resultado para "${esc(busca)}"` : 'Nenhum contato ainda'}</h4>
          <p>${busca ? 'Tente outro termo.' : 'Adicione contatos para construir sua rede.'}</p>
        </div>
      `;
      Icons.render(el);
      return;
    }

    el.innerHTML = contatos.map(c => contatoCard(c)).join('');

    el.querySelectorAll('[data-del-ctto]').forEach(btn => {
      btn.addEventListener('click', () => {
        const c = DB.getContatos().find(x => x.id === btn.dataset.delCtto);
        if (!c) return;
        if (confirm(`Remover ${c.nome}?`)) {
          DB.deleteContato(btn.dataset.delCtto);
          renderGrid();
          Icons.render(el);
        }
      });
    });

    Icons.render(el);
  }

  function contatoCard(c) {
    const initial = (c.nome || '?')[0].toUpperCase();
    const cor = avatarColor(c.nome);
    const tags = (c.tags || []);
    const tel = (c.telefone || '').replace(/\D/g, '');

    return `
      <div class="bento-card contato-card">
        <div class="contato-card-head">
          <div class="contato-avatar" style="background:${cor}">${initial}</div>
          <div class="contato-info">
            <div class="contato-nome">${esc(c.nome)}</div>
            ${tags.length ? `<div class="contato-tags">${tags.map(t => `<span class="crm-tag">${esc(t)}</span>`).join('')}</div>` : ''}
          </div>
          <button class="contato-del-btn" data-del-ctto="${esc(c.id)}" title="Remover">
            <span data-icon="trash-2" data-size="13"></span>
          </button>
        </div>

        ${c.telefone ? `
          <a class="contato-tel" href="tel:${esc(c.telefone)}">
            <span data-icon="phone" data-size="12"></span> ${esc(c.telefone)}
          </a>
          ${tel ? `
            <a class="contato-wa" href="https://wa.me/55${tel}" target="_blank" rel="noopener">
              <span data-icon="message-circle" data-size="12"></span> WhatsApp
            </a>
          ` : ''}
        ` : ''}

        ${c.email ? `
          <a class="contato-email" href="mailto:${esc(c.email)}">
            <span data-icon="mail" data-size="12"></span> ${esc(c.email)}
          </a>
        ` : ''}

        ${c.notas ? `<div class="contato-notas">${esc(c.notas)}</div>` : ''}
      </div>
    `;
  }

  function bindEvents(container) {
    container.querySelector('#ctto-novo-btn')?.addEventListener('click', () => {
      const form = document.getElementById('ctto-form');
      if (form) { form.style.display = ''; document.getElementById('ctto-f-nome')?.focus(); }
    });

    container.querySelector('#ctto-cancel-btn')?.addEventListener('click', () => {
      document.getElementById('ctto-form').style.display = 'none';
    });

    container.querySelector('#ctto-save-btn')?.addEventListener('click', salvar);

    container.querySelector('#ctto-f-nome')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') salvar();
    });

    container.querySelector('#ctto-busca')?.addEventListener('input', e => {
      busca = e.target.value;
      renderGrid();
      Icons.render(document.getElementById('contatos-grid'));
    });
  }

  function salvar() {
    const nome = document.getElementById('ctto-f-nome')?.value.trim();
    if (!nome) { Toast.warning('Campo obrigatório', 'Informe o nome do contato.'); return; }

    const telefone = document.getElementById('ctto-f-tel')?.value.trim() || '';
    const email    = document.getElementById('ctto-f-email')?.value.trim() || '';
    const tagsStr  = document.getElementById('ctto-f-tags')?.value || '';
    const tags     = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
    const notas    = document.getElementById('ctto-f-notas')?.value.trim() || '';

    DB.saveContato({ nome, telefone, email, tags, notas });

    ['ctto-f-nome','ctto-f-tel','ctto-f-email','ctto-f-tags','ctto-f-notas'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    document.getElementById('ctto-form').style.display = 'none';

    Toast.success('Contato salvo', nome);
    renderGrid();
    Icons.render(document.getElementById('contatos-grid'));
  }

  function avatarColor(str) {
    const palette = ['#A78BFA','#F472B6','#FB923C','#5EE39A','#7BB6FF','#FBBF24','#22D3EE','#D4A574'];
    let h = 0;
    for (let i = 0; i < (str || '').length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xFFFF;
    return palette[h % palette.length];
  }

  return { render };
})();
