/* ═══════════════════════════════════════════════════════════
   AGENDA — Eventos e compromissos
═══════════════════════════════════════════════════════════ */

const Agenda = (() => {
  let filtro = 'hoje';

  function render() {
    const container = document.getElementById('agenda-content');
    if (!container) return;

    const hoje = todayISO();
    const pendentes = DB.getAgenda({ data: hoje });
    const proximos  = DB.getAgenda().filter(e => e.data > hoje).slice(0, 20);

    container.innerHTML = `
      <div class="page-head">
        <div>
          <h2 class="page-title">Minha <em>agenda</em></h2>
          <div class="page-sub">${pendentes.length} evento${pendentes.length !== 1 ? 's' : ''} hoje</div>
        </div>
        <button class="btn btn-primary" id="agenda-novo-btn">
          <span data-icon="plus" data-size="14"></span>
          Novo evento
        </button>
      </div>

      <div class="card" id="agenda-form" style="display:none;margin-bottom:var(--s-5)">
        <h3 style="font-size:var(--t-md);font-weight:600;margin-bottom:var(--s-4)">Novo evento</h3>
        <div class="field">
          <label class="field-label">Título *</label>
          <input id="agenda-f-titulo" type="text" placeholder="Ex: Consulta médica">
        </div>
        <div class="field-row">
          <div class="field">
            <label class="field-label">Data</label>
            <input id="agenda-f-data" type="date" value="${hoje}">
          </div>
          <div class="field">
            <label class="field-label">Hora</label>
            <input id="agenda-f-hora" type="time" value="09:00">
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label class="field-label">Tipo</label>
            <select id="agenda-f-tipo">
              <option value="pessoal">Pessoal</option>
              <option value="trabalho">Trabalho</option>
              <option value="saude">Saúde</option>
              <option value="social">Social</option>
            </select>
          </div>
          <div class="field">
            <label class="field-label">Descrição</label>
            <input id="agenda-f-desc" type="text" placeholder="Detalhes (opcional)">
          </div>
        </div>
        <div style="display:flex;gap:var(--s-3);justify-content:flex-end">
          <button class="btn btn-ghost" id="agenda-cancel-btn">Cancelar</button>
          <button class="btn btn-primary" id="agenda-save-btn">
            <span data-icon="check" data-size="14"></span> Salvar
          </button>
        </div>
      </div>

      <div style="display:flex;gap:var(--s-2);flex-wrap:wrap;margin-bottom:var(--s-5)">
        ${[['hoje','Hoje'],['proximos','Próximos'],['todos','Todos']].map(([val,lbl]) =>
          `<button class="filter-chip${val === filtro ? ' active' : ''}" data-agenda-filter="${val}">${lbl}</button>`
        ).join('')}
      </div>

      <div id="agenda-lista"></div>
    `;

    renderLista();
    bindEvents(container);
    Icons.render(container);
  }

  function renderLista() {
    const el = document.getElementById('agenda-lista');
    if (!el) return;

    const hoje = todayISO();
    let eventos = DB.getAgenda();

    if (filtro === 'hoje')    eventos = eventos.filter(e => e.data === hoje);
    else if (filtro === 'proximos') eventos = eventos.filter(e => e.data > hoje);

    if (!eventos.length) {
      el.innerHTML = `
        <div class="empty">
          <div class="empty-icon">${Icons.html('calendar', 26)}</div>
          <h4>Nenhum evento</h4>
          <p>${filtro === 'hoje' ? 'Agenda livre hoje.' : 'Nenhum evento neste período.'}</p>
        </div>
      `;
      Icons.render(el);
      return;
    }

    /* Agrupar por data */
    const groups = {};
    eventos.forEach(e => { if (!groups[e.data]) groups[e.data] = []; groups[e.data].push(e); });

    el.innerHTML = Object.entries(groups)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([data, items]) => `
        <div class="agenda-section-label">${formatDateLabel(data, hoje)}</div>
        <div class="agenda-lista" style="margin-bottom:var(--s-5)">
          ${items.map(e => eventoCard(e)).join('')}
        </div>
      `).join('');

    el.querySelectorAll('[data-del-evento]').forEach(btn => {
      btn.addEventListener('click', ev => {
        ev.stopPropagation();
        if (confirm('Remover este evento?')) {
          DB.deleteEvento(btn.dataset.delEvento);
          renderLista();
          Icons.render(el);
        }
      });
    });

    Icons.render(el);
  }

  function eventoCard(e) {
    const barClasses = { trabalho: 'accent-blue', saude: 'accent-green', social: 'accent-amber' };
    return `
      <div class="agenda-card">
        <div class="agenda-card-bar ${barClasses[e.tipo] || ''}"></div>
        <div class="agenda-card-body">
          <div class="agenda-card-hora">${esc(e.hora || '—')}</div>
          <div class="agenda-card-titulo">${esc(e.titulo)}</div>
          ${e.descricao ? `<div class="agenda-card-desc">${esc(e.descricao)}</div>` : ''}
        </div>
        <div class="agenda-card-data">${e.data.split('-').reverse().slice(0,2).join('/')}</div>
        <button class="agenda-card-del" data-del-evento="${esc(e.id)}" title="Remover">
          <span data-icon="x" data-size="14"></span>
        </button>
      </div>
    `;
  }

  function bindEvents(container) {
    container.querySelector('#agenda-novo-btn')?.addEventListener('click', () => {
      const form = document.getElementById('agenda-form');
      if (form) { form.style.display = ''; document.getElementById('agenda-f-titulo')?.focus(); }
    });

    container.querySelector('#agenda-cancel-btn')?.addEventListener('click', () => {
      document.getElementById('agenda-form').style.display = 'none';
    });

    container.querySelector('#agenda-save-btn')?.addEventListener('click', salvar);

    container.querySelector('#agenda-f-titulo')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') salvar();
    });

    container.querySelectorAll('[data-agenda-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        filtro = btn.dataset.agendaFilter;
        container.querySelectorAll('[data-agenda-filter]').forEach(b =>
          b.classList.toggle('active', b.dataset.agendaFilter === filtro)
        );
        renderLista();
        Icons.render(document.getElementById('agenda-lista'));
      });
    });
  }

  function salvar() {
    const titulo = document.getElementById('agenda-f-titulo')?.value.trim();
    if (!titulo) { Toast.warning('Campo obrigatório', 'Informe o título do evento.'); return; }

    DB.saveEvento({
      titulo,
      data:      document.getElementById('agenda-f-data')?.value  || todayISO(),
      hora:      document.getElementById('agenda-f-hora')?.value  || '09:00',
      tipo:      document.getElementById('agenda-f-tipo')?.value  || 'pessoal',
      descricao: document.getElementById('agenda-f-desc')?.value.trim() || '',
    });

    document.getElementById('agenda-f-titulo').value = '';
    document.getElementById('agenda-f-desc').value   = '';
    document.getElementById('agenda-form').style.display = 'none';

    Toast.success('Evento criado', titulo);
    renderLista();
    Icons.render(document.getElementById('agenda-lista'));
  }

  function formatDateLabel(iso, hoje) {
    const months   = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const weekdays = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
    const [y, m, d] = iso.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const prefix = iso === hoje ? 'Hoje · ' : '';
    return `${prefix}${weekdays[date.getDay()]}, ${d} ${months[m - 1]}`;
  }

  return { render };
})();
