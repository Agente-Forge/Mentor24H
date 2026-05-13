/* ═══════════════════════════════════════════════════════════
   TAREFAS — Lista de tarefas com prioridade
═══════════════════════════════════════════════════════════ */

const Tarefas = (() => {
  let filtroStatus = 'pendente';

  function render() {
    const container = document.getElementById('tarefas-content');
    if (!container) return;

    const pendentes  = DB.getTarefas({ status: 'pendente' });
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

      <div class="card" id="trf-form" style="display:none;margin-bottom:var(--s-5)">
        <h3 style="font-size:var(--t-md);font-weight:600;margin-bottom:var(--s-4)">Nova tarefa</h3>
        <div class="field">
          <label class="field-label">Título *</label>
          <input id="trf-f-titulo" type="text" placeholder="Ex: Enviar relatório">
        </div>
        <div class="field">
          <label class="field-label">Descrição</label>
          <input id="trf-f-desc" type="text" placeholder="Detalhes (opcional)">
        </div>
        <div class="field-row">
          <div class="field">
            <label class="field-label">Prioridade</label>
            <select id="trf-f-pri">
              <option value="alta">Alta</option>
              <option value="media" selected>Média</option>
              <option value="baixa">Baixa</option>
            </select>
          </div>
          <div class="field">
            <label class="field-label">Data limite</label>
            <input id="trf-f-data" type="date">
          </div>
        </div>
        <div style="display:flex;gap:var(--s-3);justify-content:flex-end">
          <button class="btn btn-ghost" id="trf-cancel-btn">Cancelar</button>
          <button class="btn btn-primary" id="trf-save-btn">
            <span data-icon="check" data-size="14"></span> Salvar
          </button>
        </div>
      </div>

      <div style="display:flex;gap:var(--s-2);flex-wrap:wrap;margin-bottom:var(--s-5)">
        <button class="filter-chip${filtroStatus === 'pendente'  ? ' active' : ''}" data-trf-filter="pendente">Pendentes (${pendentes.length})</button>
        <button class="filter-chip${filtroStatus === 'concluida' ? ' active' : ''}" data-trf-filter="concluida">Concluídas (${concluidas.length})</button>
        <button class="filter-chip${filtroStatus === 'alta'      ? ' active' : ''}" data-trf-filter="alta">Urgentes</button>
        <button class="filter-chip${filtroStatus === 'todas'     ? ' active' : ''}" data-trf-filter="todas">Todas (${total})</button>
      </div>

      <div class="trf-lista" id="trf-lista"></div>
    `;

    renderLista();
    bindEvents(container);
    Icons.render(container);
  }

  function renderLista() {
    const el = document.getElementById('trf-lista');
    if (!el) return;

    let tarefas = DB.getTarefas();
    if (filtroStatus === 'pendente')  tarefas = tarefas.filter(t => t.status === 'pendente');
    else if (filtroStatus === 'concluida') tarefas = tarefas.filter(t => t.status === 'concluida');
    else if (filtroStatus === 'alta') tarefas = tarefas.filter(t => t.prioridade === 'alta' && t.status === 'pendente');

    if (!tarefas.length) {
      el.innerHTML = `
        <div class="empty">
          <div class="empty-icon">${Icons.html('check-square', 26)}</div>
          <h4>${filtroStatus === 'concluida' ? 'Nenhuma concluída ainda' : 'Nenhuma tarefa pendente'}</h4>
          <p>${filtroStatus === 'pendente' ? 'Tudo em dia!' : 'Tente outro filtro.'}</p>
        </div>
      `;
      Icons.render(el);
      return;
    }

    el.innerHTML = tarefas.map(t => tarefaItem(t)).join('');

    el.querySelectorAll('[data-trf-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const t = DB.getTarefas().find(t => t.id === btn.dataset.trfToggle);
        if (!t) return;
        DB.saveTarefa({ id: t.id, status: t.status === 'concluida' ? 'pendente' : 'concluida' });
        renderLista();
        Icons.render(el);
      });
    });

    el.querySelectorAll('[data-del-trf]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Remover esta tarefa?')) {
          DB.deleteTarefa(btn.dataset.delTrf);
          renderLista();
          Icons.render(el);
        }
      });
    });

    Icons.render(el);
  }

  function tarefaItem(t) {
    const done = t.status === 'concluida';
    const priColors = { alta: 'badge-red', media: 'badge-amber', baixa: 'badge-green' };
    const priLabels = { alta: 'Alta', media: 'Média', baixa: 'Baixa' };
    return `
      <div class="trf-item${done ? ' done' : ''}">
        <button class="trf-check" data-trf-toggle="${esc(t.id)}" title="${done ? 'Reabrir' : 'Concluir'}">
          <span data-icon="${done ? 'check-circle-2' : 'circle'}" data-size="18"></span>
        </button>
        <div class="trf-body">
          <div class="trf-titulo">${esc(t.titulo)}</div>
          ${t.descricao ? `<div class="trf-desc">${esc(t.descricao)}</div>` : ''}
          ${t.data ? `<div class="trf-data"><span data-icon="calendar" data-size="10"></span> ${t.data.split('-').reverse().join('/')}</div>` : ''}
        </div>
        <span class="trf-pri-badge ${priColors[t.prioridade] || 'badge-amber'}">${priLabels[t.prioridade] || 'Média'}</span>
        <button class="trf-del" data-del-trf="${esc(t.id)}" title="Remover">
          <span data-icon="x" data-size="14"></span>
        </button>
      </div>
    `;
  }

  function bindEvents(container) {
    container.querySelector('#trf-nova-btn')?.addEventListener('click', () => {
      const form = document.getElementById('trf-form');
      if (form) { form.style.display = ''; document.getElementById('trf-f-titulo')?.focus(); }
    });

    container.querySelector('#trf-cancel-btn')?.addEventListener('click', () => {
      document.getElementById('trf-form').style.display = 'none';
    });

    container.querySelector('#trf-save-btn')?.addEventListener('click', salvar);

    container.querySelector('#trf-f-titulo')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') salvar();
    });

    container.querySelectorAll('[data-trf-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        filtroStatus = btn.dataset.trfFilter;
        container.querySelectorAll('[data-trf-filter]').forEach(b =>
          b.classList.toggle('active', b.dataset.trfFilter === filtroStatus)
        );
        renderLista();
        Icons.render(document.getElementById('trf-lista'));
      });
    });
  }

  function salvar() {
    const titulo = document.getElementById('trf-f-titulo')?.value.trim();
    if (!titulo) { Toast.warning('Campo obrigatório', 'Informe o título.'); return; }

    DB.saveTarefa({
      titulo,
      descricao: document.getElementById('trf-f-desc')?.value.trim() || '',
      prioridade: document.getElementById('trf-f-pri')?.value || 'media',
      data:       document.getElementById('trf-f-data')?.value || null,
      status: 'pendente',
    });

    document.getElementById('trf-f-titulo').value = '';
    document.getElementById('trf-f-desc').value   = '';
    document.getElementById('trf-form').style.display = 'none';

    Toast.success('Tarefa criada', titulo);
    renderLista();
    Icons.render(document.getElementById('trf-lista'));
  }

  return { render };
})();
