/* ═══════════════════════════════════════════════════════════
   CONTATOS — Agenda de contatos pessoais
═══════════════════════════════════════════════════════════ */

const Contatos = (() => {

  function render() {
    const container = document.getElementById('contatos-content');
    if (!container) return;

    const contatos = DB.getContatos();

    container.innerHTML = `
      <div class="page-head">
        <div>
          <h2 class="page-title">Meus <em>contatos</em></h2>
          <div class="page-sub">${contatos.length} contato${contatos.length !== 1 ? 's' : ''}</div>
        </div>
        <button class="btn btn-primary" id="ctto-novo-btn">
          <span data-icon="plus" data-size="14"></span>
          Novo contato
        </button>
      </div>

      <div class="filter-bar" style="margin-bottom:var(--s-4)">
        <input type="text" id="ctto-busca" placeholder="Buscar por nome, telefone…" style="max-width:320px">
      </div>

      <div class="contatos-grid" id="contatos-grid">
        ${contatos.length
          ? contatos.map(c => contatoCard(c)).join('')
          : '<div class="empty-state"><span data-icon="users" data-size="40"></span><p>Nenhum contato cadastrado ainda.</p></div>'
        }
      </div>

      <button class="fab" id="ctto-fab-btn" title="Novo contato">
        <span data-icon="plus"></span>
      </button>
    `;

    Icons.render(container);
    bindContatoEvents(container);
  }

  function contatoCard(c) {
    const initial = c.nome.charAt(0).toUpperCase();
    const colors = ['#A78BFA','#F472B6','#FB923C','#5EE39A','#7BB6FF','#FBBF24'];
    let hash = 0;
    for (let i = 0; i < c.nome.length; i++) hash = c.nome.charCodeAt(i) + ((hash << 5) - hash);
    const cor = colors[Math.abs(hash) % colors.length];
    const tags = (c.tags || []).map(t => `<span class="crm-tag">${t}</span>`).join('');

    return `
      <div class="bento-card contato-card">
        <div class="contato-card-head">
          <div class="contato-avatar" style="background:${cor}">${initial}</div>
          <div class="contato-info">
            <div class="contato-nome">${escapeHtml(c.nome)}</div>
            ${tags ? `<div class="contato-tags">${tags}</div>` : ''}
          </div>
          <button class="contato-del-btn" data-del-ctto="${c.id}" title="Excluir">
            <span data-icon="trash-2" data-size="13"></span>
          </button>
        </div>
        ${c.telefone ? `
          <a class="contato-tel" href="tel:${c.telefone}">
            <span data-icon="phone" data-size="13"></span> ${escapeHtml(c.telefone)}
          </a>
          <a class="contato-wa" href="https://wa.me/55${c.telefone.replace(/\D/g,'')}" target="_blank" title="Abrir WhatsApp">
            <span data-icon="message-circle" data-size="13"></span> WhatsApp
          </a>
        ` : ''}
        ${c.email ? `<div class="contato-email"><span data-icon="mail" data-size="13"></span> ${escapeHtml(c.email)}</div>` : ''}
        ${c.notas ? `<div class="contato-notas">${escapeHtml(c.notas)}</div>` : ''}
      </div>
    `;
  }

  function bindContatoEvents(container) {
    container.querySelector('#ctto-novo-btn')?.addEventListener('click', novoContato);
    container.querySelector('#ctto-fab-btn')?.addEventListener('click', novoContato);

    container.querySelector('#ctto-busca')?.addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      const cards = DB.getContatos(q || undefined);
      const grid = document.getElementById('contatos-grid');
      if (grid) {
        grid.innerHTML = cards.length
          ? cards.map(c => contatoCard(c)).join('')
          : '<div class="empty-state"><p>Nenhum contato encontrado.</p></div>';
        Icons.render(grid);
        bindDelEvents(grid);
      }
    });

    bindDelEvents(container);
  }

  function bindDelEvents(container) {
    container.querySelectorAll('[data-del-ctto]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Excluir este contato?')) {
          DB.deleteContato(btn.dataset.delCtto);
          render();
        }
      });
    });
  }

  function novoContato() {
    const nome = prompt('Nome do contato:');
    if (!nome) return;
    const telefone = prompt('Telefone (com DDD):') || '';
    const email = prompt('E-mail:') || '';
    const tagsStr = prompt('Tags separadas por vírgula (família, trabalho…):') || '';
    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
    DB.saveContato({ nome, telefone, email, tags });
    render();
    Toast.success('Contato adicionado!', nome);
  }

  function escapeHtml(s) {
    return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  return { render };
})();
