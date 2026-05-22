/* ═══════════════════════════════════════════════════════════
   MEDICAMENTOS — Premium Health Dashboard
   Mentor24h | OBSIDIAN Design System
═══════════════════════════════════════════════════════════ */

const Medicamentos = (() => {
  const CIRC = 2 * Math.PI * 32; // 201.06px — raio 32 no SVG 80x80

  const TIPOS = [
    { id: 'capsula',    label: 'Cápsula',    icon: '💊' },
    { id: 'comprimido', label: 'Comprimido', icon: '🔵' },
    { id: 'liquido',    label: 'Líquido',    icon: '🧪' },
    { id: 'outro',      label: 'Outro',      icon: '💉' },
  ];

  const HORARIOS_PADRAO = [
    '06:00','07:00','08:00','09:00','10:00','11:00',
    '12:00','13:00','14:00','15:00','16:00',
    '18:00','19:00','20:00','21:00','22:00',
  ];

  const FREQUENCIAS = [
    { id: 'diario',  label: 'Diário' },
    { id: 'seg-sex', label: 'Seg–Sex' },
    { id: 'semana',  label: 'Semanal' },
    { id: 'livre',   label: 'Livre' },
  ];

  let wiz = _resetWiz();

  function _resetWiz() {
    return {
      active: false, step: 1,
      nome: '', tipo: 'capsula', dosagem: '',
      frequencia: 'diario', horarios: [],
      estoque: 30, estoqueMinimo: 5,
    };
  }

  // ─── HELPERS ──────────────────────────────────────────────
  function _getPeriod(hora) {
    const h = parseInt((hora || '00').split(':')[0], 10);
    if (h >= 5  && h <= 11) return 'MANHÃ';
    if (h >= 12 && h <= 17) return 'TARDE';
    if (h >= 18 && h <= 23) return 'NOITE';
    return 'LIVRE';
  }

  function _getCardState(med, tomados) {
    if (tomados.has(med.id)) return 'tomado';
    if (!med.horarios || !med.horarios.length) return 'pendente';
    const now   = new Date();
    const atual = now.getHours() * 60 + now.getMinutes();
    const passou = med.horarios.some(h => {
      const [hh, mm] = h.split(':').map(Number);
      return (hh * 60 + mm) < atual - 30;
    });
    return passou ? 'atrasado' : 'pendente';
  }

  function _calcStreak(meds) {
    if (!meds.length) return 0;
    let streak = 0;
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      const doses = DB.getDoses(null, iso);
      const tomadosNoDia = new Set(doses.map(dx => dx.medId));
      if (!meds.every(m => tomadosNoDia.has(m.id))) break;
      streak++;
    }
    return streak;
  }

  function _groupByPeriod(meds) {
    const groups = { 'MANHÃ': [], 'TARDE': [], 'NOITE': [], 'LIVRE': [] };
    meds.forEach(m => {
      const period = (m.horarios && m.horarios.length)
        ? _getPeriod(m.horarios[0])
        : 'LIVRE';
      groups[period].push(m);
    });
    return groups;
  }

  // ─── RENDER PRINCIPAL ──────────────────────────────────────
  function render() {
    const container = document.getElementById('medicamentos-content');
    if (!container) return;

    const meds       = DB.getMedicamentos();
    const hoje       = todayISO();
    const dosesHoje  = DB.getDoses(null, hoje);
    const tomados    = new Set(dosesHoje.map(d => d.medId));
    const total      = meds.length;
    const qtdTomados = meds.filter(m => tomados.has(m.id)).length;
    const streak     = _calcStreak(meds);

    const subLabel = total === 0
      ? 'Nenhum medicamento cadastrado'
      : qtdTomados === total
        ? 'Todos tomados hoje ✓'
        : `${total - qtdTomados} pendente${total - qtdTomados !== 1 ? 's' : ''} hoje`;

    container.innerHTML = `
      <div class="card">

        <!-- ── Header ── -->
        <div class="med-header">
          <div class="med-ring-area">
            <svg class="med-ring-svg" viewBox="0 0 80 80">
              <circle class="med-ring-bg"   cx="40" cy="40" r="32"/>
              <circle class="med-ring-fill" cx="40" cy="40" r="32"
                id="med-ring-fill"
                stroke-dasharray="${CIRC.toFixed(2)}"
                stroke-dashoffset="${CIRC.toFixed(2)}"
                transform="rotate(-90 40 40)"/>
            </svg>
            <div class="med-ring-label">
              <span class="med-ring-num">${qtdTomados}</span>
              <span class="med-ring-den">/${total}</span>
              <span class="med-ring-sub">hoje</span>
            </div>
          </div>

          <div>
            <h2 class="page-title" style="margin:0">Meus <em>medicamentos</em></h2>
            <div class="page-sub">${subLabel}</div>
          </div>

          ${streak > 0 ? `
            <div class="med-streak">
              <span class="med-streak-fire">🔥</span>
              <span class="med-streak-num">${streak}</span>
              <span class="med-streak-label">dias</span>
            </div>
          ` : ''}

          <button class="btn btn-primary med-novo-btn" id="med-novo-btn">
            <span data-icon="plus" data-size="14"></span>
            Novo
          </button>
        </div>

        <!-- ── Wizard ── -->
        ${wiz.active ? _renderWizard() : ''}

        <!-- ── Seções por período ── -->
        <div class="med-sections">
          ${_renderSections(meds, tomados)}
        </div>

      </div>
    `;

    Icons.render(container);
    _bindEvents(container, hoje, meds);
    requestAnimationFrame(() => _animateRing(total, qtdTomados));
  }

  // ─── SEÇÕES ────────────────────────────────────────────────
  function _renderSections(meds, tomados) {
    if (!meds.length) return `
      <div class="med-empty">
        <div class="med-empty-icon">${Icons.html('pill', 28)}</div>
        <h4 class="med-empty-titulo">Nenhum medicamento</h4>
        <p class="med-empty-sub">Adicione seus medicamentos para controlar as doses diárias.</p>
      </div>
    `;

    const groups = _groupByPeriod(meds);
    const LABELS = {
      'MANHÃ': '🌅 Manhã',
      'TARDE': '☀️ Tarde',
      'NOITE': '🌙 Noite',
      'LIVRE': '🕐 Horário livre',
    };

    return Object.entries(groups)
      .filter(([, arr]) => arr.length)
      .map(([period, arr]) => `
        <div class="med-section-label">${LABELS[period]}</div>
        <div class="med-cards-grid">
          ${arr.map(m => _renderCard(m, tomados)).join('')}
        </div>
      `)
      .join('');
  }

  function _renderCard(m, tomados) {
    const state        = _getCardState(m, tomados);
    const tipo         = TIPOS.find(t => t.id === m.tipo) || TIPOS[0];
    const estoqueAlerta = m.estoque <= m.estoqueMinimo;
    const estoqueRatio  = m.estoqueMinimo > 0
      ? Math.min(m.estoque / (m.estoqueMinimo * 4), 1)
      : m.estoque > 0 ? 1 : 0;

    return `
      <div class="bento-card med-card${state === 'atrasado' ? ' med-card--atrasado' : ''}${state === 'tomado' ? ' med-card--tomado' : ''}">
        <div class="med-card-head">
          <div class="med-card-info">
            <span class="med-card-icon">${esc(tipo.icon)}</span>
            <div style="min-width:0">
              <div class="med-card-nome">${esc(m.nome)}</div>
              ${m.dosagem ? `<div class="med-card-dosagem">${esc(m.dosagem)}</div>` : ''}
            </div>
          </div>
          <div class="med-card-actions">
            ${m.horarios && m.horarios.length ? `
              <span class="med-card-hora">${esc(m.horarios[0])}${m.horarios.length > 1 ? ` +${m.horarios.length - 1}` : ''}</span>
            ` : ''}
            <button class="med-del-btn" data-del-med="${esc(m.id)}" title="Remover">
              <span data-icon="trash-2" data-size="13"></span>
            </button>
          </div>
        </div>

        ${state === 'atrasado' ? `
          <div class="med-badge-atrasado">
            <span data-icon="clock" data-size="10"></span> Atrasado
          </div>
        ` : ''}
        ${state === 'tomado' ? `
          <div class="med-badge-tomado">
            <span data-icon="check-circle" data-size="12"></span> Tomado hoje
          </div>
        ` : ''}

        <div>
          <div class="med-estoque-bar-wrap">
            <div class="med-estoque-bar${estoqueAlerta ? ' alerta' : ''}" style="width:${(estoqueRatio * 100).toFixed(0)}%"></div>
          </div>
          <div class="med-estoque-txt${estoqueAlerta ? ' alerta' : ''}">
            ${estoqueAlerta ? `<span data-icon="alert-triangle" data-size="10"></span>` : ''}
            ${m.estoque} unid${m.estoque !== 1 ? 's' : ''}
          </div>
        </div>

        ${state !== 'tomado' ? `
          <button class="btn btn-primary btn-sm" data-dose-med="${esc(m.id)}" style="width:100%">
            <span data-icon="check" data-size="13"></span>
            Marcar tomado
          </button>
        ` : ''}
      </div>
    `;
  }

  // ─── WIZARD ────────────────────────────────────────────────
  function _renderWizard() {
    return `
      <div class="card med-wizard">
        <div class="wiz-top">
          <span class="wiz-titulo">Novo medicamento</span>
          <div class="wiz-dots">
            ${[1, 2, 3, 4].map(s => `<div class="wiz-dot${wiz.step === s ? ' active' : ''}"></div>`).join('')}
          </div>
        </div>
        <div class="wiz-step" id="wiz-step-content">
          ${_renderWizStep()}
        </div>
        <div class="wiz-nav">
          <button class="btn btn-ghost btn-sm" id="wiz-back-btn">
            ${wiz.step === 1 ? 'Cancelar' : '← Voltar'}
          </button>
          <button class="btn btn-primary btn-sm" id="wiz-next-btn">
            ${wiz.step === 4 ? 'Salvar' : 'Avançar →'}
          </button>
        </div>
      </div>
    `;
  }

  function _renderWizStep() {
    switch (wiz.step) {
      case 1: return `
        <label class="wiz-label">Nome do medicamento</label>
        <input class="wiz-input" id="wiz-nome" type="text" placeholder="Ex: Vitamina D" value="${esc(wiz.nome)}">
        <div style="margin-top:var(--s-4)">
          <label class="wiz-label">Tipo</label>
          <div class="wiz-tipos">
            ${TIPOS.map(t => `
              <button class="wiz-tipo-btn${wiz.tipo === t.id ? ' active' : ''}" data-tipo="${t.id}">
                <span class="wiz-tipo-icon">${t.icon}</span>
                <span class="wiz-tipo-label">${t.label}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;
      case 2: return `
        <label class="wiz-label">Dosagem</label>
        <input class="wiz-input" id="wiz-dosagem" type="text" placeholder="Ex: 1 comprimido, 500mg" value="${esc(wiz.dosagem)}">
        <div style="margin-top:var(--s-4)">
          <label class="wiz-label">Frequência</label>
          <div class="wiz-chips">
            ${FREQUENCIAS.map(f => `
              <button class="wiz-chip${wiz.frequencia === f.id ? ' active' : ''}" data-freq="${f.id}">${f.label}</button>
            `).join('')}
          </div>
        </div>
      `;
      case 3: return `
        <label class="wiz-label">Horários de uso</label>
        <div class="wiz-horarios-grid">
          ${HORARIOS_PADRAO.map(h => `
            <button class="wiz-chip${wiz.horarios.includes(h) ? ' active' : ''}" data-horario="${h}">${h}</button>
          `).join('')}
        </div>
      `;
      case 4: return `
        <label class="wiz-label">Estoque atual</label>
        <div class="wiz-counter">
          <button class="wiz-counter-btn" id="wiz-est-minus">−</button>
          <span class="wiz-counter-val" id="wiz-est-val">${wiz.estoque}</span>
          <span class="wiz-counter-unit">unidades</span>
          <button class="wiz-counter-btn" id="wiz-est-plus">+</button>
        </div>
        <div style="margin-top:var(--s-4)">
          <label class="wiz-label">Alertar quando abaixo de</label>
          <div class="wiz-counter">
            <button class="wiz-counter-btn" id="wiz-min-minus">−</button>
            <span class="wiz-counter-val" id="wiz-min-val">${wiz.estoqueMinimo}</span>
            <span class="wiz-counter-unit">unidades</span>
            <button class="wiz-counter-btn" id="wiz-min-plus">+</button>
          </div>
        </div>
      `;
    }
    return '';
  }

  // ─── RING ──────────────────────────────────────────────────
  function _animateRing(total, tomados) {
    const el = document.getElementById('med-ring-fill');
    if (!el) return;
    const target = total ? CIRC * (1 - tomados / total) : CIRC;
    el.style.transition = 'none';
    el.setAttribute('stroke-dashoffset', String(CIRC.toFixed(2)));
    requestAnimationFrame(() => {
      el.style.transition = 'stroke-dashoffset 800ms cubic-bezier(0.34,1.56,0.64,1)';
      el.setAttribute('stroke-dashoffset', String(target.toFixed(2)));
    });
  }

  // ─── EVENTS ────────────────────────────────────────────────
  function _bindEvents(container, hoje, meds) {
    // Abrir wizard
    container.querySelector('#med-novo-btn')?.addEventListener('click', () => {
      wiz = _resetWiz();
      wiz.active = true;
      render();
      setTimeout(() => document.getElementById('wiz-nome')?.focus(), 50);
    });

    // Wizard — voltar / cancelar
    container.querySelector('#wiz-back-btn')?.addEventListener('click', () => {
      if (wiz.step === 1) {
        wiz.active = false;
        render();
      } else {
        _captureStep();
        wiz.step--;
        _refreshStep();
      }
    });

    // Wizard — avançar / salvar
    container.querySelector('#wiz-next-btn')?.addEventListener('click', () => {
      _captureStep();
      if (!_validateStep()) return;
      if (wiz.step === 4) {
        _saveWizard();
      } else {
        wiz.step++;
        _refreshStep();
      }
    });

    _bindStepEvents(container);

    // Marcar dose
    container.querySelectorAll('[data-dose-med]').forEach(btn => {
      btn.addEventListener('click', () => {
        const medId = btn.dataset.doseMed;
        const med   = DB.getMedicamentos().find(m => m.id === medId);
        if (!med) return;
        if (DB.getDoses(medId, hoje).length > 0) {
          Toast.info('Já registrado', `${med.nome} já foi tomado hoje.`);
          return;
        }
        if (med.estoque > 0) DB.saveMedicamento({ id: med.id, estoque: med.estoque - 1 });
        DB.registrarDose(med.id, hoje);
        Toast.success('Dose registrada', `${med.nome} ✓`);
        const card = btn.closest('.med-card');
        if (card) {
          card.style.transition = 'opacity 200ms, transform 200ms';
          card.style.opacity    = '0.5';
          card.style.transform  = 'scale(0.98)';
          setTimeout(() => render(), 220);
        } else {
          render();
        }
      });
    });

    // Deletar
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

  function _bindStepEvents(container) {
    if (!container) container = document.getElementById('medicamentos-content');
    if (!container) return;

    container.querySelectorAll('[data-tipo]').forEach(btn => {
      btn.addEventListener('click', () => {
        wiz.tipo = btn.dataset.tipo;
        container.querySelectorAll('[data-tipo]').forEach(b =>
          b.classList.toggle('active', b.dataset.tipo === wiz.tipo)
        );
      });
    });

    container.querySelectorAll('[data-freq]').forEach(btn => {
      btn.addEventListener('click', () => {
        wiz.frequencia = btn.dataset.freq;
        container.querySelectorAll('[data-freq]').forEach(b =>
          b.classList.toggle('active', b.dataset.freq === wiz.frequencia)
        );
      });
    });

    container.querySelectorAll('[data-horario]').forEach(btn => {
      btn.addEventListener('click', () => {
        const h = btn.dataset.horario;
        if (wiz.horarios.includes(h)) {
          wiz.horarios = wiz.horarios.filter(x => x !== h);
          btn.classList.remove('active');
        } else {
          wiz.horarios.push(h);
          wiz.horarios.sort();
          btn.classList.add('active');
        }
      });
    });

    container.querySelector('#wiz-est-minus')?.addEventListener('click', () => {
      wiz.estoque = Math.max(0, wiz.estoque - 1);
      const el = document.getElementById('wiz-est-val');
      if (el) el.textContent = wiz.estoque;
    });
    container.querySelector('#wiz-est-plus')?.addEventListener('click', () => {
      wiz.estoque++;
      const el = document.getElementById('wiz-est-val');
      if (el) el.textContent = wiz.estoque;
    });
    container.querySelector('#wiz-min-minus')?.addEventListener('click', () => {
      wiz.estoqueMinimo = Math.max(1, wiz.estoqueMinimo - 1);
      const el = document.getElementById('wiz-min-val');
      if (el) el.textContent = wiz.estoqueMinimo;
    });
    container.querySelector('#wiz-min-plus')?.addEventListener('click', () => {
      wiz.estoqueMinimo++;
      const el = document.getElementById('wiz-min-val');
      if (el) el.textContent = wiz.estoqueMinimo;
    });
  }

  // ─── WIZARD HELPERS ────────────────────────────────────────
  function _captureStep() {
    if (wiz.step === 1) {
      wiz.nome    = document.getElementById('wiz-nome')?.value.trim()    || wiz.nome;
    }
    if (wiz.step === 2) {
      wiz.dosagem = document.getElementById('wiz-dosagem')?.value.trim() || wiz.dosagem;
    }
  }

  function _validateStep() {
    if (wiz.step === 1 && !wiz.nome) {
      Toast.warning('Campo obrigatório', 'Informe o nome do medicamento.');
      document.getElementById('wiz-nome')?.focus();
      return false;
    }
    return true;
  }

  function _refreshStep() {
    const content = document.getElementById('wiz-step-content');
    if (content) {
      content.innerHTML = _renderWizStep();
      _bindStepEvents();
    }
    // Atualizar dots
    document.querySelectorAll('.wiz-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i + 1 === wiz.step);
    });
    // Atualizar texto dos botões de nav
    const back = document.getElementById('wiz-back-btn');
    const next = document.getElementById('wiz-next-btn');
    if (back) back.textContent = wiz.step === 1 ? 'Cancelar' : '← Voltar';
    if (next) next.textContent = wiz.step === 4 ? 'Salvar'   : 'Avançar →';
    // Foco automático nos inputs de texto
    setTimeout(() => {
      const input = document.getElementById('wiz-nome') || document.getElementById('wiz-dosagem');
      input?.focus();
    }, 50);
  }

  function _saveWizard() {
    if (!wiz.nome) { Toast.warning('Campo obrigatório', 'Informe o nome.'); return; }
    const nome = wiz.nome;
    DB.saveMedicamento({
      nome, tipo: wiz.tipo, dosagem: wiz.dosagem,
      frequencia: wiz.frequencia, horarios: [...wiz.horarios].sort(),
      estoque: wiz.estoque, estoqueMinimo: wiz.estoqueMinimo,
    });
    wiz = _resetWiz();
    Toast.success('Medicamento salvo', nome);
    render();
  }

  return { render };
})();
