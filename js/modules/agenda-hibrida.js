/* ═══════════════════════════════════════════════════════════
   AGENDA HÍBRIDA — Pessoal (ouro) + Serviço (safira)
═══════════════════════════════════════════════════════════ */

const AgendaHibrida = (() => {
  let _filtro = 'todos';

  /* ── Render principal ── */
  function render() {
    const container = document.getElementById('agenda-hibrida-content');
    if (!container) return;
    _buildUI(container);
    _bindEvents(container);
    Icons.render(container);
  }

  function _buildUI(container) {
    const hoje = new Date().toISOString().slice(0, 10);
    const todos    = DB.getAgenda() || [];
    const pessoal  = todos.filter(e => (e.tipo || 'pessoal') !== 'servico').length;
    const servico  = todos.filter(e => e.tipo === 'servico').length;

    container.innerHTML = `
      <div class="page-head">
        <div>
          <h2 class="page-title">Agenda <em>híbrida</em></h2>
          <div class="page-sub">${todos.length} evento${todos.length !== 1 ? 's' : ''}</div>
        </div>
        <button class="btn btn-primary" id="ah-novo-btn">
          <span data-icon="plus" data-size="14"></span>
          Novo evento
        </button>
      </div>

      <div class="card" id="ah-form" style="display:none;margin-bottom:var(--s-5)">
        <h3 style="font-size:var(--t-md);font-weight:600;margin-bottom:var(--s-4)">Novo evento</h3>
        <div class="field">
          <label class="field-label">Título *</label>
          <input id="ah-f-titulo" type="text" placeholder="Ex: Atendimento cliente">
        </div>
        <div class="field-row">
          <div class="field">
            <label class="field-label">Data</label>
            <input id="ah-f-data" type="date" value="${hoje}">
          </div>
          <div class="field">
            <label class="field-label">Hora</label>
            <input id="ah-f-hora" type="time" value="09:00">
          </div>
        </div>
        <div class="field">
          <label class="field-label">Tipo</label>
          <select id="ah-f-tipo">
            <option value="pessoal">Pessoal</option>
            <option value="servico">Serviço</option>
          </select>
        </div>
        <div id="ah-servico-fields" style="display:none">
          <div class="field">
            <label class="field-label">Cliente</label>
            <select id="ah-f-cliente">${_buildContatosOptions()}</select>
          </div>
          <div class="field">
            <label class="field-label">Valor (R$)</label>
            <input id="ah-f-valor" type="number" min="0" step="0.01" placeholder="0,00">
          </div>
        </div>
        <div style="display:flex;gap:var(--s-3);justify-content:flex-end;margin-top:var(--s-4)">
          <button class="btn btn-ghost" id="ah-cancel-btn">Cancelar</button>
          <button class="btn btn-primary" id="ah-save-btn">
            <span data-icon="check" data-size="14"></span> Salvar
          </button>
        </div>
      </div>

      <div style="display:flex;gap:var(--s-2);flex-wrap:wrap;margin-bottom:var(--s-5)">
        <button class="filter-chip${_filtro === 'todos'   ? ' active' : ''}" data-ah-filter="todos">Todos (${todos.length})</button>
        <button class="filter-chip${_filtro === 'pessoal' ? ' active' : ''}" data-ah-filter="pessoal">Pessoal (${pessoal})</button>
        <button class="filter-chip${_filtro === 'servico' ? ' active' : ''}" data-ah-filter="servico">Serviço (${servico})</button>
      </div>

      <div id="ah-lista"></div>
    `;

    _renderLista(container);
  }

  /* ── Lista de eventos ── */
  function _renderLista(container) {
    const el = container.querySelector('#ah-lista');
    if (!el) return;

    const eventos = _getEventosFiltrados();

    if (!eventos.length) {
      el.innerHTML = `
        <div class="empty">
          <div class="empty-icon">${Icons.html('calendar', 26)}</div>
          <h4>${_filtro === 'todos' ? 'Nenhum evento cadastrado' : 'Nenhum evento ' + _filtro}</h4>
          <p>Crie um novo evento acima.</p>
        </div>
      `;
      Icons.render(el);
      return;
    }

    el.innerHTML = eventos.map(_buildItem).join('');
    _bindListEvents(el, container);
    Icons.render(el);
  }

  function _getEventosFiltrados() {
    let ev = DB.getAgenda() || [];
    if (_filtro === 'pessoal') ev = ev.filter(e => (e.tipo || 'pessoal') !== 'servico');
    else if (_filtro === 'servico') ev = ev.filter(e => e.tipo === 'servico');
    return ev.sort((a, b) => {
      const da = (a.data || '') + (a.hora || '');
      const db = (b.data || '') + (b.hora || '');
      return da < db ? -1 : da > db ? 1 : 0;
    });
  }

  function _buildItem(ev) {
    const tipo = ev.tipo === 'servico' ? 'servico' : 'pessoal';
    const label = tipo === 'servico' ? 'Serviço' : 'Pessoal';
    const meta = [
      ev.hora ? esc(ev.hora) : null,
      ev.data ? esc(ev.data.split('-').reverse().join('/')) : null,
      ev.tipo === 'servico' && ev.clienteNome ? esc(ev.clienteNome) : null,
      ev.tipo === 'servico' && ev.valor != null ? 'R$ ' + Number(ev.valor).toFixed(2).replace('.', ',') : null,
    ].filter(Boolean).join(' · ');

    return `
      <div class="ah-item ah-item--${esc(tipo)}">
        <div class="ah-badge ah-badge--${esc(tipo)}">${esc(label)}</div>
        <div class="ah-item-body">
          <div class="ah-item-titulo">${esc(ev.titulo)}</div>
          ${meta ? `<div class="ah-item-meta">${meta}</div>` : ''}
        </div>
        <button class="ah-del" data-del-ev="${esc(ev.id)}" title="Remover evento">
          <span data-icon="x" data-size="14"></span>
        </button>
      </div>
    `;
  }

  /* ── Eventos ── */
  function _bindEvents(container) {
    container.querySelector('#ah-novo-btn')?.addEventListener('click', () => {
      const form = document.getElementById('ah-form');
      if (form) { form.style.display = ''; document.getElementById('ah-f-titulo')?.focus(); }
    });

    container.querySelector('#ah-cancel-btn')?.addEventListener('click', () => {
      document.getElementById('ah-form').style.display = 'none';
    });

    container.querySelector('#ah-save-btn')?.addEventListener('click', () => _salvar(container));

    container.querySelector('#ah-f-titulo')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') _salvar(container);
    });

    container.querySelector('#ah-f-tipo')?.addEventListener('change', function () {
      const sf = document.getElementById('ah-servico-fields');
      if (sf) sf.style.display = this.value === 'servico' ? '' : 'none';
    });

    container.querySelectorAll('[data-ah-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        _filtro = btn.dataset.ahFilter;
        container.querySelectorAll('[data-ah-filter]').forEach(b =>
          b.classList.toggle('active', b.dataset.ahFilter === _filtro)
        );
        _renderLista(container);
      });
    });
  }

  function _bindListEvents(el, container) {
    el.querySelectorAll('[data-del-ev]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Remover este evento?')) {
          DB.deleteEvento(btn.dataset.delEv);
          _renderLista(container);
        }
      });
    });
  }

  function _salvar(container) {
    const titulo = document.getElementById('ah-f-titulo')?.value.trim();
    if (!titulo) { Toast.warning('Campo obrigatório', 'Informe o título.'); return; }

    const tipo = document.getElementById('ah-f-tipo')?.value || 'pessoal';
    const clienteSel = document.getElementById('ah-f-cliente');
    const clienteId   = tipo === 'servico' ? (clienteSel?.value || null) : null;
    const clienteNome = tipo === 'servico' ? (clienteSel?.selectedOptions[0]?.textContent?.trim() || null) : null;
    const valorRaw    = tipo === 'servico' ? parseFloat(document.getElementById('ah-f-valor')?.value) : NaN;

    Repository.save('agenda', {
      titulo,
      data:        document.getElementById('ah-f-data')?.value || null,
      hora:        document.getElementById('ah-f-hora')?.value || null,
      tipo,
      clienteId:   clienteId && clienteId !== '' ? clienteId : null,
      clienteNome: clienteNome && clienteNome !== 'Selecionar cliente...' ? clienteNome : null,
      valor:       isNaN(valorRaw) ? null : valorRaw,
    });

    document.getElementById('ah-f-titulo').value = '';
    document.getElementById('ah-f-valor') && (document.getElementById('ah-f-valor').value = '');
    document.getElementById('ah-form').style.display = 'none';
    Toast.success('Evento criado', titulo);
    _buildUI(container);
    Icons.render(container);
  }

  function _buildContatosOptions() {
    let clientes = [];
    try { clientes = (DB.getContatos ? DB.getContatos() : []).filter(c => c.contexto === 'cliente' || c.tag === 'cliente'); } catch (_) {}
    if (!clientes.length) return '<option value="">— Nenhum cliente cadastrado —</option>';
    return '<option value="">Selecionar cliente...</option>' +
      clientes.map(c => `<option value="${esc(c.id)}">${esc(c.nome)}</option>`).join('');
  }

  return { render };
})();
