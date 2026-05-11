/* ═══════════════════════════════════════════════════════════
   AGENDA — Eventos e compromissos
═══════════════════════════════════════════════════════════ */

const Agenda = (() => {

  function render() {
    const container = document.getElementById('agenda-content');
    if (!container) return;

    const hoje = new Date().toISOString().split('T')[0];
    const eventos = DB.getAgenda();
    const eventosHoje = eventos.filter(e => e.data === hoje);
    const proximos = eventos.filter(e => e.data > hoje).slice(0, 10);

    container.innerHTML = `
      <div class="page-head">
        <div>
          <h2 class="page-title">Minha <em>agenda</em></h2>
          <div class="page-sub">Eventos e compromissos</div>
        </div>
        <button class="btn btn-primary" id="agenda-novo-btn">
          <span data-icon="plus" data-size="14"></span>
          Novo evento
        </button>
      </div>

      ${eventosHoje.length ? `
        <div class="agenda-section-label">Hoje</div>
        <div class="agenda-lista" id="agenda-hoje-lista">
          ${eventosHoje.map(eventoCard).join('')}
        </div>
      ` : ''}

      <div class="agenda-section-label" style="margin-top:var(--s-5)">Próximos eventos</div>
      <div class="agenda-lista" id="agenda-proximos-lista">
        ${proximos.length
          ? proximos.map(eventoCard).join('')
          : '<div class="empty-state" style="padding:var(--s-8) 0"><p>Nenhum evento futuro cadastrado.</p></div>'
        }
      </div>

      <button class="fab" id="agenda-fab-btn" title="Novo evento">
        <span data-icon="plus"></span>
      </button>
    `;

    Icons.render(container);
    bindAgendaEvents(container);
  }

  function eventoCard(e) {
    const tipoColors = { pessoal: 'violet', trabalho: 'blue', saude: 'green', social: 'amber' };
    const cor = tipoColors[e.tipo] || 'violet';
    return `
      <div class="agenda-card" data-evento-id="${e.id}">
        <div class="agenda-card-bar accent-${cor}"></div>
        <div class="agenda-card-body">
          <div class="agenda-card-hora">${e.hora || '—'}</div>
          <div class="agenda-card-titulo">${escapeHtml(e.titulo)}</div>
          ${e.descricao ? `<div class="agenda-card-desc">${escapeHtml(e.descricao)}</div>` : ''}
        </div>
        <div class="agenda-card-data">${formatDate(e.data)}</div>
        <button class="agenda-card-del" data-del-evento="${e.id}" title="Excluir">
          <span data-icon="trash-2" data-size="13"></span>
        </button>
      </div>
    `;
  }

  function bindAgendaEvents(container) {
    container.querySelector('#agenda-novo-btn')?.addEventListener('click', novoEvento);
    container.querySelector('#agenda-fab-btn')?.addEventListener('click', novoEvento);

    container.querySelectorAll('[data-del-evento]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        if (confirm('Excluir este evento?')) {
          DB.deleteEvento(btn.dataset.delEvento);
          render();
        }
      });
    });
  }

  function novoEvento() {
    const titulo = prompt('Título do evento:');
    if (!titulo) return;
    const data = prompt('Data (AAAA-MM-DD):', new Date().toISOString().split('T')[0]);
    if (!data) return;
    const hora = prompt('Hora (HH:MM):', '09:00') || '09:00';
    const tipo = prompt('Tipo (pessoal/trabalho/saude/social):', 'pessoal') || 'pessoal';
    DB.saveEvento({ titulo, data, hora, tipo });
    render();
    Toast.success('Evento criado!', titulo);
  }

  function formatDate(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  }

  function escapeHtml(s) {
    return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  return { render };
})();
