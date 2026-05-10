/* ═══════════════════════════════════════════════════════════
   KANBAN — Drag & drop board
═══════════════════════════════════════════════════════════ */

const Kanban = (() => {
  let dragId = null;

  function render() {
    ['todo', 'doing', 'done'].forEach(col => {
      const cards = DB.getKanban(col);
      const wrap = document.getElementById(`kb-${col}`);
      if (!wrap) return;
      wrap.innerHTML = cards.length
        ? cards.map(renderCard).join('')
        : `<div class="kanban-drop">arraste cards aqui</div>`;
      const cnt = document.getElementById(`kb-count-${col}`);
      if (cnt) cnt.textContent = cards.length;
    });
    initDrag();
  }

  function renderCard(c) {
    return `
      <div class="kanban-card prio-${c.prioridade || 'baixa'}" draggable="true" data-id="${esc(c.id)}">
        <div class="kc-head">
          ${c.prioridade ? `<div class="kc-prio-dot" style="background:var(--${c.prioridade === 'alta' ? 'red' : c.prioridade === 'media' ? 'amber' : 'text-4'})"></div>` : ''}
          <div class="kc-title flex-1">${esc(c.titulo)}</div>
        </div>
        ${c.descricao ? `<div class="kc-desc">${esc(c.descricao)}</div>` : ''}
        ${c.etiquetas?.length ? `
          <div class="kc-tags">
            ${c.etiquetas.map(t => `<span class="kc-tag">${esc(t)}</span>`).join('')}
          </div>
        ` : ''}
        <div class="kc-foot">
          <span class="kc-date">${esc(Utils.formatDateShort(c.criadoEm?.split('T')[0]))}</span>
          <div class="kc-actions">
            ${['todo','doing','done'].filter(col => col !== c.coluna).map(col => `
              <button onclick="Kanban.mover('${esc(c.id)}','${col}')" title="Mover para ${col}">
                ${Icons.html(col === 'done' ? 'check' : col === 'doing' ? 'play' : 'rotate-ccw', 11)}
              </button>
            `).join('')}
            <button onclick="Modal.editarKanban('${esc(c.id)}')" title="Editar">${Icons.html('pencil', 11)}</button>
            <button onclick="Kanban.excluir('${esc(c.id)}')" title="Excluir">${Icons.html('trash-2', 11)}</button>
          </div>
        </div>
      </div>
    `;
  }

  function initDrag() {
    document.querySelectorAll('.kanban-card').forEach(card => {
      card.addEventListener('dragstart', (e) => {
        dragId = card.dataset.id;
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', dragId);
      });
      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        document.querySelectorAll('.drag-target').forEach(el => el.classList.remove('drag-target'));
      });
    });

    document.querySelectorAll('.kanban-col').forEach(col => {
      col.addEventListener('dragover', (e) => {
        e.preventDefault();
        col.classList.add('drag-target');
      });
      col.addEventListener('dragleave', (e) => {
        if (!col.contains(e.relatedTarget)) col.classList.remove('drag-target');
      });
      col.addEventListener('drop', (e) => {
        e.preventDefault();
        col.classList.remove('drag-target');
        const id = dragId || e.dataTransfer.getData('text/plain');
        const target = col.dataset.col;
        if (id && target) mover(id, target);
        dragId = null;
      });
    });
  }

  function mover(id, novaColuna) {
    DB.moveKanbanCard(id, novaColuna);
    render();
  }

  function excluir(id) {
    DB.deleteKanbanCard(id);
    Toast.success('Card excluído');
    render();
  }

  return { render, mover, excluir };
})();
