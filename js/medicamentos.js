/* ═══════════════════════════════════════════════════════════
   MEDICAMENTOS — Controle de remédios e doses
═══════════════════════════════════════════════════════════ */

const Medicamentos = (() => {

  function render() {
    const container = document.getElementById('medicamentos-content');
    if (!container) return;

    const meds = DB.getMedicamentos();
    const hoje = new Date().toISOString().split('T')[0];
    const dosesHoje = DB.getDoses(null, hoje);

    container.innerHTML = `
      <div class="page-head">
        <div>
          <h2 class="page-title">Meus <em>medicamentos</em></h2>
          <div class="page-sub">Controle de remédios e adesão</div>
        </div>
        <button class="btn btn-primary" id="med-novo-btn">
          <span data-icon="plus" data-size="14"></span>
          Novo medicamento
        </button>
      </div>

      <div class="med-grid" id="med-grid">
        ${meds.length
          ? meds.map(m => medCard(m, dosesHoje)).join('')
          : '<div class="empty-state"><span data-icon="pill" data-size="40"></span><p>Nenhum medicamento cadastrado ainda.</p></div>'
        }
      </div>

      <button class="fab" id="med-fab-btn" title="Novo medicamento">
        <span data-icon="plus"></span>
      </button>
    `;

    Icons.render(container);
    bindMedEvents(container, hoje);
  }

  function medCard(m, dosesHoje) {
    const tomouHoje = dosesHoje.some(d => d.medId === m.id);
    const estoqueAlerta = m.estoque <= m.estoqueMinimo;
    return `
      <div class="bento-card med-card">
        <div class="med-card-head">
          <div>
            <div class="med-nome">${escapeHtml(m.nome)}</div>
            <div class="med-dosagem">${escapeHtml(m.dosagem || '')}</div>
          </div>
          <div class="med-actions">
            <button class="med-del-btn" data-del-med="${m.id}" title="Excluir">
              <span data-icon="trash-2" data-size="13"></span>
            </button>
          </div>
        </div>

        <div class="med-horarios">
          ${(m.horarios || []).map(h => `<span class="med-horario-badge">${h}</span>`).join('') || '<span class="med-horario-badge muted">Sem horário</span>'}
        </div>

        ${estoqueAlerta ? `<div class="med-alerta-estoque"><span data-icon="alert-triangle" data-size="12"></span> Estoque baixo: ${m.estoque} unidades</div>` : ''}

        <button class="btn ${tomouHoje ? 'btn-secondary' : 'btn-primary'} btn-sm med-tomar-btn" data-tomar-med="${m.id}" style="margin-top:var(--s-3);width:100%">
          ${tomouHoje
            ? `<span data-icon="check" data-size="14"></span> Tomado hoje`
            : `<span data-icon="pill" data-size="14"></span> Marcar como tomado`
          }
        </button>
      </div>
    `;
  }

  function bindMedEvents(container, hoje) {
    container.querySelector('#med-novo-btn')?.addEventListener('click', novoMed);
    container.querySelector('#med-fab-btn')?.addEventListener('click', novoMed);

    container.querySelectorAll('[data-tomar-med]').forEach(btn => {
      btn.addEventListener('click', () => {
        DB.registrarDose(btn.dataset.tomarMed, hoje);
        render();
        Toast.success('Dose registrada!', 'Medicamento marcado como tomado.');
      });
    });

    container.querySelectorAll('[data-del-med]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Excluir este medicamento?')) {
          DB.deleteMedicamento(btn.dataset.delMed);
          render();
        }
      });
    });
  }

  function novoMed() {
    const nome = prompt('Nome do medicamento:');
    if (!nome) return;
    const dosagem = prompt('Dosagem (ex: 500mg):') || '';
    const horarioStr = prompt('Horário(s) separados por vírgula (ex: 08:00,20:00):') || '';
    const horarios = horarioStr.split(',').map(h => h.trim()).filter(Boolean);
    const estoque = parseInt(prompt('Quantidade em estoque:', '30')) || 30;
    DB.saveMedicamento({ nome, dosagem, horarios, estoque, estoqueMinimo: 5 });
    render();
    Toast.success('Medicamento adicionado!', nome);
  }

  function escapeHtml(s) {
    return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  return { render };
})();
