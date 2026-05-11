/* ═══════════════════════════════════════════════════════════
   TAREFAS — Lista de tarefas com prioridade
═══════════════════════════════════════════════════════════ */

const Tarefas = (() => {

  let filtroStatus = 'pendente';

  function render() {
    const container = document.getElementById('tarefas-content');
    if (!container) return;

    const pendentes = DB.getTarefas({ status: 'pendente' });
    const concluidas = DB.getTarefas({ status: 'concluida' });
    const total = pendentes.length + concluidas.length;

    container.innerHTML = `
      <div class="page-head">
        <div>
          <h2 class="page-title">Minhas <em>tarefas</em></h2>
          <div class="page-sub">${pendentes.length} pendente${pendentes.length !== 1 ? 's' : ''} · ${concluidas.length} concluída${concluidas.length !== 1 ? 's' : ''}</div>
        </div>
        <button class="btn btn-primary" id="trf-nova-btn">
          <span data-icon="plus" data-size="14"></span>
          Nova tarefa
        </button>
      </div>

      <div class="filter-bar" style="margin-bottom:var(--s-4)">
        <button class="filter-chip ${filtroStatus === 'pendente' ? 'active' : ''}" data-trf-filter="pendente">Pendentes (${pendentes.length})</button>
        <button class="filter-chip ${filtroStatus === 'concluida' ? 'active' : ''}" data-trf-filter="concluida">Concluídas (${concluidas.length})</button>
        <button class="filter-chip ${filtroStatus === 'todas' ? 'active' : ''}" data-trf-filter="todas">Todas (${total})</button>
      </div>

      <div class="trf-lista" id="trf-lista">
        ${renderLista(filtroStatus === 'todas' ? [...pendentes, ...concluidas] : filtroStatus === 'pendente' ? pendentes : concluidas)}
      </div>

      <button class="fab" id="trf-fab-btn" title="Nova tarefa">
        <span data-icon="plus"></span>
      </button>
    `;

    Icons.render(container);
    bindTrfEvents(container);
  }

  function renderLista(tarefas) {
    if (!tarefas.length) {
      return '<div class="empty-state" style="padding:var(--s-8) 0"><span data-icon="check-square" data-size="36"></span><p>Nenhuma tarefa aqui.</p></div>';
    }
    return tarefas.map(t => tarefaItem(t)).join('');
  }

  function tarefaItem(t) {
    const priColors = { alta: 'red', media: 'amber', baixa: 'green' };
    const cor = priColors[t.prioridade] || 'amber';
    const done = t.status === 'concluida';
    return `
      <div class="trf-item${done ? ' done' : ''}">
        <button class="trf-check" data-trf-toggle="${t.id}" title="${done ? 'Reabrir' : 'Concluir'}">
          <span data-icon="${done ? 'check-circle-2' : 'circle'}" data-size="18"></span>
        </button>
        <div class="trf-body">
          <div class="trf-titulo">${escapeHtml(t.titulo)}</div>
          ${t.descricao ? `<div class="trf-desc">${escapeHtml(t.descricao)}</div>` : ''}
          ${t.data ? `<div class="trf-data"><span data-icon="calendar" data-size="11"></span> ${formatDate(t.data)}</div>` : ''}
        </div>
        <span class="trf-pri-badge badge-${cor}">${t.prioridade || 'média'}</span>
        <button class="trf-del" data-del-trf="${t.id}" title="Excluir">
          <span data-icon="trash-2" data-size="13"></span>
        </button>
      </div>
    `;
  }

  function bindTrfEvents(container) {
    container.querySelector('#trf-nova-btn')?.addEventListener('click', novaTarefa);
    container.querySelector('#trf-fab-btn')?.addEventListener('click', novaTarefa);

    container.querySelectorAll('[data-trf-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        filtroStatus = btn.dataset.trfFilter;
        render();
      });
    });

    container.querySelectorAll('[data-trf-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const todasTarefas = [...DB.getTarefas({ status: 'pendente' }), ...DB.getTarefas({ status: 'concluida' })];
        const t = todasTarefas.find(t => t.id === btn.dataset.trfToggle);
        if (t) {
          DB.saveTarefa({ id: t.id, status: t.status === 'concluida' ? 'pendente' : 'concluida' });
          render();
        }
      });
    });

    container.querySelectorAll('[data-del-trf]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Excluir esta tarefa?')) {
          DB.deleteTarefa(btn.dataset.delTrf);
          render();
        }
      });
    });
  }

  function novaTarefa() {
    const titulo = prompt('Título da tarefa:');
    if (!titulo) return;
    const priInput = prompt('Prioridade (alta/media/baixa):', 'media') || 'media';
    const prioridade = ['alta','media','baixa'].includes(priInput) ? priInput : 'media';
    DB.saveTarefa({ titulo, prioridade, status: 'pendente' });
    render();
    Toast.success('Tarefa criada!', titulo);
  }

  function formatDate(iso) {
    if (!iso) return '';
    const [y,m,d] = iso.split('-');
    return `${d}/${m}/${y}`;
  }

  function escapeHtml(s) {
    return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  return { render };
})();
