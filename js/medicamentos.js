/* ═══════════════════════════════════════════════════════════
   MEDICAMENTOS — Controle de remédios e doses
═══════════════════════════════════════════════════════════ */

const Medicamentos = (() => {

  function render() {
    const container = document.getElementById('medicamentos-content');
    if (!container) return;

    const meds = DB.getMedicamentos();
    const hoje = todayISO();
    const dosesHoje = DB.getDoses(null, hoje);
    const tomados = new Set(dosesHoje.map(d => d.medId));
    const pendentes = meds.filter(m => !tomados.has(m.id)).length;

    container.innerHTML = `
      <div class="page-head">
        <div>
          <h2 class="page-title">Meus <em>medicamentos</em></h2>
          <div class="page-sub">${pendentes > 0 ? `${pendentes} pendente${pendentes > 1 ? 's' : ''} hoje` : 'Todos tomados hoje ✓'}</div>
        </div>
        <button class="btn btn-primary" id="med-novo-btn">
          <span data-icon="plus" data-size="14"></span>
          Novo
        </button>
      </div>

      <div class="card" id="med-form" style="display:none;margin-bottom:var(--s-5)">
        <h3 style="font-size:var(--t-md);font-weight:600;margin-bottom:var(--s-4)">Novo medicamento</h3>
        <div class="field-row">
          <div class="field">
            <label class="field-label">Nome *</label>
            <input id="med-f-nome" type="text" placeholder="Ex: Vitamina D">
          </div>
          <div class="field">
            <label class="field-label">Dosagem</label>
            <input id="med-f-dosagem" type="text" placeholder="Ex: 1 comprimido">
          </div>
        </div>
        <div class="field">
          <label class="field-label">Horários (separados por vírgula)</label>
          <input id="med-f-horarios" type="text" placeholder="Ex: 08:00, 20:00">
          <span class="field-hint">Deixe em branco para sem horário fixo</span>
        </div>
        <div class="field-row">
          <div class="field">
            <label class="field-label">Estoque atual</label>
            <input id="med-f-estoque" type="number" value="30" min="0">
          </div>
          <div class="field">
            <label class="field-label">Alerta abaixo de</label>
            <input id="med-f-min" type="number" value="5" min="1">
          </div>
        </div>
        <div style="display:flex;gap:var(--s-3);justify-content:flex-end">
          <button class="btn btn-ghost" id="med-cancel-btn">Cancelar</button>
          <button class="btn btn-primary" id="med-save-btn">
            <span data-icon="check" data-size="14"></span> Salvar
          </button>
        </div>
      </div>

      <div class="med-grid" id="med-grid">
        ${meds.length ? meds.map(m => medCard(m, tomados)).join('') : emptyState()}
      </div>
    `;

    Icons.render(container);
    bindEvents(container, hoje);
  }

  function medCard(m, tomados) {
    const tomado = tomados.has(m.id);
    const alertaEstoque = m.estoque <= m.estoqueMinimo;
    const horarios = m.horarios && m.horarios.length ? m.horarios : [];

    return `
      <div class="bento-card med-card">
        <div class="med-card-head">
          <div>
            <div class="med-nome">${esc(m.nome)}</div>
            <div class="med-dosagem">${esc(m.dosagem || '')}</div>
          </div>
          <div class="med-actions">
            <button class="med-del-btn" data-del-med="${esc(m.id)}" title="Remover">
              <span data-icon="trash-2" data-size="13"></span>
            </button>
          </div>
        </div>

        ${horarios.length ? `
          <div class="med-horarios">
            ${horarios.map(h => `<span class="med-horario-badge${tomado ? ' muted' : ''}">${esc(h)}</span>`).join('')}
          </div>
        ` : ''}

        ${alertaEstoque ? `
          <div class="med-alerta-estoque">
            <span data-icon="alert-triangle" data-size="12"></span>
            Estoque baixo: ${m.estoque} unidade${m.estoque !== 1 ? 's' : ''}
          </div>
        ` : ''}

        <button class="btn ${tomado ? 'btn-secondary' : 'btn-primary'} btn-sm" data-dose-med="${esc(m.id)}" style="margin-top:var(--s-3);width:100%">
          <span data-icon="${tomado ? 'check-circle' : 'pill'}" data-size="13"></span>
          ${tomado ? 'Tomado hoje' : 'Marcar como tomado'}
        </button>

        <div style="margin-top:var(--s-2);font-size:11px;color:var(--text-4)">
          Estoque: ${m.estoque} unidade${m.estoque !== 1 ? 's' : ''}
        </div>
      </div>
    `;
  }

  function emptyState() {
    return `
      <div class="empty" style="grid-column:1/-1">
        <div class="empty-icon">${Icons.html('pill', 26)}</div>
        <h4>Nenhum medicamento</h4>
        <p>Adicione seus medicamentos para controlar as doses diárias.</p>
      </div>
    `;
  }

  function bindEvents(container, hoje) {
    container.querySelector('#med-novo-btn')?.addEventListener('click', () => {
      const form = document.getElementById('med-form');
      if (form) { form.style.display = ''; document.getElementById('med-f-nome')?.focus(); }
    });

    container.querySelector('#med-cancel-btn')?.addEventListener('click', () => {
      document.getElementById('med-form').style.display = 'none';
    });

    container.querySelector('#med-save-btn')?.addEventListener('click', salvar);

    container.querySelector('#med-f-nome')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') salvar();
    });

    container.querySelectorAll('[data-dose-med]').forEach(btn => {
      btn.addEventListener('click', () => {
        const med = DB.getMedicamentos().find(m => m.id === btn.dataset.doseMed);
        if (!med) return;
        const dosesHoje = DB.getDoses(null, hoje);
        if (dosesHoje.some(d => d.medId === med.id)) {
          Toast.info('Já registrado', `${med.nome} já foi tomado hoje.`);
          return;
        }
        DB.registrarDose(med.id, hoje);
        Toast.success('Dose registrada', `${med.nome} ✓`);
        render();
      });
    });

    container.querySelectorAll('[data-del-med]').forEach(btn => {
      btn.addEventListener('click', () => {
        const med = DB.getMedicamentos().find(m => m.id === btn.dataset.delMed);
        if (!med) return;
        if (confirm(`Remover ${med.nome}?`)) {
          DB.deleteMedicamento(btn.dataset.delMed);
          render();
        }
      });
    });
  }

  function salvar() {
    const nome = document.getElementById('med-f-nome')?.value.trim();
    if (!nome) { Toast.warning('Campo obrigatório', 'Informe o nome do medicamento.'); return; }

    const dosagem = document.getElementById('med-f-dosagem')?.value.trim() || '';
    const horStr  = document.getElementById('med-f-horarios')?.value || '';
    const horarios = horStr.split(',').map(h => h.trim()).filter(Boolean);
    const estoque  = parseInt(document.getElementById('med-f-estoque')?.value) || 30;
    const estoqueMinimo = parseInt(document.getElementById('med-f-min')?.value) || 5;

    DB.saveMedicamento({ nome, dosagem, horarios, estoque, estoqueMinimo });

    document.getElementById('med-f-nome').value     = '';
    document.getElementById('med-f-dosagem').value  = '';
    document.getElementById('med-f-horarios').value = '';
    document.getElementById('med-form').style.display = 'none';

    Toast.success('Medicamento salvo', nome);
    render();
  }

  return { render };
})();
