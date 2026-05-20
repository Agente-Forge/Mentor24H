/* ═══════════════════════════════════════════════════════════
   NOTAS RÁPIDAS — CRUD + Pin + Busca textual
═══════════════════════════════════════════════════════════ */

const Notas = (() => {
  const MAX_CHARS = 280;
  let _busca = '';

  /* ── Render principal ── */
  function render() {
    const container = document.getElementById('notas-content');
    if (!container) return;
    _buildUI(container);
    _bindEvents(container);
    Icons.render(container);
  }

  function _buildUI(container) {
    const total = _getNotas().length;
    container.innerHTML = `
      <div class="page-head">
        <div>
          <h2 class="page-title">Notas <em>rápidas</em></h2>
          <div class="page-sub">${total} nota${total !== 1 ? 's' : ''}</div>
        </div>
      </div>

      <div class="card" style="margin-bottom:var(--s-5)">
        <textarea id="notas-input" maxlength="${MAX_CHARS}"
          placeholder="Escreva uma nota rápida... (máx. ${MAX_CHARS} caracteres)"
          rows="3"
          style="width:100%;resize:vertical;background:transparent;border:none;color:var(--text-primary);font-family:var(--font-body);font-size:var(--t-sm);outline:none;line-height:1.6"></textarea>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:var(--s-3)">
          <span id="notas-chars" style="font-size:11px;color:var(--text-muted)">0 / ${MAX_CHARS}</span>
          <button class="btn btn-primary btn-sm" id="notas-save-btn">
            <span data-icon="plus" data-size="14"></span> Salvar nota
          </button>
        </div>
      </div>

      <div style="margin-bottom:var(--s-4)">
        <input id="notas-busca" type="search" placeholder="Buscar nas notas..."
          style="width:100%" value="${esc(_busca)}">
      </div>

      <div id="notas-lista"></div>
    `;

    _renderLista(container);
  }

  /* ── Lista ── */
  function _renderLista(container) {
    const el = container.querySelector('#notas-lista');
    if (!el) return;

    let notas = _getNotas();
    if (_busca.trim()) {
      const q = _busca.toLowerCase();
      notas = notas.filter(n => n.texto.toLowerCase().includes(q));
    }

    const pinadas  = notas.filter(n => n.pinada).sort((a, b) => b.createdAt > a.createdAt ? 1 : -1);
    const restantes = notas.filter(n => !n.pinada).sort((a, b) => b.createdAt > a.createdAt ? 1 : -1);
    const ordenadas = [...pinadas, ...restantes];

    if (!ordenadas.length) {
      el.innerHTML = `
        <div class="empty">
          <div class="empty-icon">${Icons.html('file-text', 26)}</div>
          <h4>${_busca ? 'Nenhuma nota encontrada' : 'Nenhuma nota ainda'}</h4>
          <p>${_busca ? 'Tente outra busca.' : 'Escreva sua primeira nota acima.'}</p>
        </div>
      `;
      Icons.render(el);
      return;
    }

    el.innerHTML = ordenadas.map(_buildItem).join('');
    _bindListEvents(el, container);
    Icons.render(el);
  }

  function _buildItem(n) {
    const data = n.createdAt ? new Date(n.createdAt).toLocaleDateString('pt-BR') : '';
    return `
      <div class="nota-item${n.pinada ? ' pinada' : ''}" data-nota-id="${esc(n.id)}">
        <div class="nota-texto">${esc(n.texto)}</div>
        <div class="nota-meta">
          <span>${data}</span>
          <button class="nota-pin-btn${n.pinada ? ' ativa' : ''}" data-pin-nota="${esc(n.id)}" title="${n.pinada ? 'Desafixar' : 'Fixar nota'}">
            <span data-icon="pin" data-size="13"></span>
          </button>
          <button class="nota-del-btn" data-del-nota="${esc(n.id)}" title="Remover nota">
            <span data-icon="x" data-size="13"></span>
          </button>
        </div>
      </div>
    `;
  }

  /* ── Eventos ── */
  function _bindEvents(container) {
    const input = container.querySelector('#notas-input');
    const charEl = container.querySelector('#notas-chars');

    input?.addEventListener('input', () => {
      const len = input.value.length;
      if (charEl) charEl.textContent = `${len} / ${MAX_CHARS}`;
    });

    container.querySelector('#notas-save-btn')?.addEventListener('click', () => _salvar(container));

    input?.addEventListener('keydown', e => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) _salvar(container);
    });

    const buscaEl = container.querySelector('#notas-busca');
    buscaEl?.addEventListener('input', () => {
      _busca = buscaEl.value;
      _renderLista(container);
    });
  }

  function _bindListEvents(el, container) {
    el.querySelectorAll('[data-pin-nota]').forEach(btn => {
      btn.addEventListener('click', () => {
        const notas = _getNotas();
        const n = notas.find(x => x.id === btn.dataset.pinNota);
        if (!n) return;
        Repository.save('notas', { ...n, pinada: !n.pinada });
        _renderLista(container);
      });
    });

    el.querySelectorAll('[data-del-nota]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Remover esta nota?')) {
          Repository.remove('notas', btn.dataset.delNota);
          _renderLista(container);
        }
      });
    });

    Icons.render(el);
  }

  function _salvar(container) {
    const input = document.getElementById('notas-input');
    const texto = input?.value.trim();
    if (!texto) { Toast.warning('Nota vazia', 'Escreva algo antes de salvar.'); return; }

    Repository.save('notas', { texto, pinada: false });
    input.value = '';
    const charEl = container.querySelector('#notas-chars');
    if (charEl) charEl.textContent = `0 / ${MAX_CHARS}`;
    Toast.success('Nota salva');
    _renderLista(container);
  }

  /* ── Persistência ── */
  function _getNotas() {
    return Repository.get('notas') || [];
  }

  /* ── Widget para dashboard (retorna HTML das N notas pinadas) ── */
  function widget(limit) {
    limit = limit || 3;
    const pinadas = _getNotas().filter(n => n.pinada)
      .sort((a, b) => b.createdAt > a.createdAt ? 1 : -1)
      .slice(0, limit);
    if (!pinadas.length) return '';
    return pinadas.map(n =>
      `<div class="nota-widget-item" title="${esc(n.texto)}">${esc(n.texto)}</div>`
    ).join('');
  }

  return { render, widget };
})();
