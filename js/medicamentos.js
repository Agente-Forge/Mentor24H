/* ═══════════════════════════════════════════════════════════
   MEDICAMENTOS v2.0 — Health Hub (Timeline + Consultas)
   Mentor24h | OBSIDIAN Design System
═══════════════════════════════════════════════════════════ */

const Medicamentos = (() => {
  const CIRC = 2 * Math.PI * 32;

  const TIPOS = [
    { id: 'capsula',    label: 'Cápsula',    icon: '💊', unit: 'cápsulas'    },
    { id: 'comprimido', label: 'Comprimido', icon: '🔵', unit: 'comprimidos' },
    { id: 'liquido',    label: 'Líquido',    icon: '🧪', unit: 'mL'          },
    { id: 'injecao',    label: 'Injeção',    icon: '💉', unit: 'doses'       },
  ];

  const DURACOES = [
    { id: '1',      label: '1 dia'        },
    { id: '2',      label: '2 dias'       },
    { id: '3',      label: '3 dias'       },
    { id: '5',      label: '5 dias'       },
    { id: '7',      label: '7 dias'       },
    { id: '10',     label: '10 dias'      },
    { id: '14',     label: '14 dias'      },
    { id: '21',     label: '21 dias'      },
    { id: '30',     label: '30 dias'      },
    { id: '0',      label: 'Contínuo'     },
    { id: 'custom', label: 'Personalizado'},
  ];

  const HRS = [
    '06:00','07:00','08:00','09:00','10:00','11:00','12:00',
    '13:00','14:00','15:00','16:00','18:00','19:00','20:00','21:00','22:00',
  ];

  // ─── STATE ────────────────────────────────────────────────
  let s = _fresh();

  function _fresh(keepDate) {
    return {
      date:       keepDate || todayISO(),
      showMonth:  false,
      wizard:     null,   // null | 'choose' | 'med' | 'consulta'
      step:       1,
      // Med wizard
      nome: '', tipo: 'capsula', dataInicio: todayISO(), duracao: '0', duracaoCustom: '',
      vezesPorDia: 1, doses: [{ hora: '08:00', quantidade: 1 }],
      estoque: 30, estoqueMinimo: 5,
      // Consulta wizard
      cEsp: '', cMed: '', cData: todayISO(), cHora: '09:00', cNota: '',
    };
  }

  // ─── COMPAT: garante que med tem doses[] ──────────────────
  function _norm(m) {
    if (m.doses && m.doses.length) return m;
    const doses = (m.horarios || []).map(h => ({ hora: h, quantidade: 1 }));
    return Object.assign({}, m, { doses: doses.length ? doses : [{ hora: '08:00', quantidade: 1 }] });
  }

  // ─── DATE HELPERS ─────────────────────────────────────────
  function _addDays(iso, n) {
    const d = new Date(iso + 'T00:00:00');
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  }

  function _fmtShort(iso) {
    return new Date(iso + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  }

  function _fmtDOW(iso) {
    return new Date(iso + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
  }

  // ─── ACTIVE-ON-DATE ───────────────────────────────────────
  function _isActiveOnDate(med, date) {
    if (!med.dataInicio) return true;
    if (date < med.dataInicio) return false;
    const dur = parseInt(med.duracao, 10);
    if (isNaN(dur) || dur <= 0) return true;
    return date <= _addDays(med.dataInicio, dur - 1);
  }

  function _isEndedOnDate(med, date) {
    if (!med.dataInicio) return false;
    const dur = parseInt(med.duracao, 10);
    if (isNaN(dur) || dur <= 0) return false;
    return date >= med.dataInicio && date > _addDays(med.dataInicio, dur - 1);
  }

  // ─── UNIDADE / ESTOQUE LABEL ──────────────────────────────
  function _doseUnit(qtd, tipoId) {
    const q = Number(qtd);
    if (tipoId === 'liquido')    return 'mL';
    if (tipoId === 'injecao')    return q === 1 ? 'aplicação'  : 'aplicações';
    if (tipoId === 'comprimido') return q === 1 ? 'comprimido' : 'comprimidos';
    if (tipoId === 'capsula')    return q === 1 ? 'cápsula'    : 'cápsulas';
    return q === 1 ? 'unidade' : 'unidades';
  }

  function _estoqueLabel(qtd, tipoId) {
    const q = Number(qtd);
    if (isNaN(q) || q <= 0) return '';
    return `${q} ${_doseUnit(q, tipoId)} restante${q === 1 ? '' : 's'}`;
  }

  function _relDate(data, hora) {
    const today    = todayISO();
    const tomorrow = _addDays(today, 1);
    if (data === today)    return hora ? `hoje às ${hora}`   : 'hoje';
    if (data === tomorrow) return hora ? `amanhã às ${hora}` : 'amanhã';
    if (data < today) {
      const diff = Math.round((new Date(today + 'T00:00:00') - new Date(data + 'T00:00:00')) / 86400000);
      return `há ${diff} dia${diff !== 1 ? 's' : ''}`;
    }
    const diff = Math.round((new Date(data + 'T00:00:00') - new Date(today + 'T00:00:00')) / 86400000);
    return `em ${diff} dia${diff !== 1 ? 's' : ''}`;
  }

  // ─── TIMELINE ─────────────────────────────────────────────
  function _buildItems(date) {
    const meds      = DB.getMedicamentos().map(_norm);
    const consultas = DB.getConsultas().filter(c => c.data === date);
    const items     = [];

    meds.forEach(med => {
      // E3: sem estoque — não aparece
      if (med.estoque !== undefined && med.estoque !== null && med.estoque <= 0) return;
      // B2: ainda não começou — não aparece
      if (med.dataInicio && date < med.dataInicio) return;
      // E4: tratamento encerrado — item renovar
      if (_isEndedOnDate(med, date)) {
        items.push({ type: 'renovar', hora: '00:00', med });
        return;
      }
      med.doses.forEach((dose, doseIdx) => {
        const tomado = DB.isDoseTomada(med.id, date, doseIdx);
        const state  = tomado ? 'tomado' : _slotState(dose.hora, date);
        items.push({ type: 'med', hora: dose.hora, med, doseIdx, dose, tomado, state });
      });
    });

    consultas.forEach(c => {
      items.push({ type: 'consulta', hora: c.hora || '00:00', consulta: c, state: c.status || 'agendada' });
    });

    return items.sort((a, b) => a.hora.localeCompare(b.hora));
  }

  function _slotState(hora, date) {
    if (date !== todayISO()) return 'pendente';
    const now = new Date();
    const [hh, mm] = hora.split(':').map(Number);
    return (hh * 60 + mm) < now.getHours() * 60 + now.getMinutes() - 30 ? 'atrasado' : 'pendente';
  }

  function _ringStats(meds, date) {
    let total = 0, taken = 0;
    meds.forEach(m => {
      if (!_isActiveOnDate(m, date)) return;
      if (m.estoque !== undefined && m.estoque !== null && m.estoque <= 0) return;
      m.doses.forEach((_, i) => {
        total++;
        if (DB.isDoseTomada(m.id, date, i)) taken++;
      });
    });
    return { total, taken };
  }

  function _calcStreak(meds) {
    if (!meds.length) return 0;
    let streak = 0;
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      const activeMeds = meds.filter(m => _isActiveOnDate(m, iso));
      if (!activeMeds.length) break;
      const allTaken = activeMeds.every(m => m.doses.every((_, idx) => DB.isDoseTomada(m.id, iso, idx)));
      if (!allTaken) break;
      streak++;
    }
    return streak;
  }

  function _dayDots(dateISO, meds) {
    const consultas  = DB.getConsultas();
    const activeMeds = meds.filter(m => {
      if (m.estoque !== undefined && m.estoque !== null && m.estoque <= 0) return false;
      return _isActiveOnDate(m, dateISO);
    });
    let gold = false, amber = false;
    if (activeMeds.length) {
      let total = 0, taken = 0;
      activeMeds.forEach(m => m.doses.forEach((_, i) => {
        total++;
        if (DB.isDoseTomada(m.id, dateISO, i)) taken++;
      }));
      if (total > 0) { if (taken === total) gold = true; else if (taken > 0) amber = true; }
    }
    return { gold, amber, blue: consultas.some(c => c.data === dateISO) };
  }

  // ─── RENDER PRINCIPAL ─────────────────────────────────────
  function render() {
    const container = document.getElementById('medicamentos-content');
    if (!container) return;

    if (s.wizard === 'choose') {
      container.innerHTML = `<div class="card">${_renderChoose()}</div>`;
      Icons.render(container);
      _bindEvents(container);
      return;
    }
    if (s.wizard === 'med') {
      container.innerHTML = `<div class="card">${_renderMedWiz()}</div>`;
      Icons.render(container);
      _bindEvents(container);
      return;
    }
    if (s.wizard === 'consulta') {
      container.innerHTML = `<div class="card">${_renderConWiz()}</div>`;
      Icons.render(container);
      _bindEvents(container);
      return;
    }

    const meds       = DB.getMedicamentos().map(_norm);
    const items      = _buildItems(s.date);
    const { total, taken } = _ringStats(meds, s.date);
    const streak     = _calcStreak(meds);
    const isToday    = s.date === todayISO();
    const subLabel   = total === 0 ? 'Nenhum medicamento' :
                       taken === total ? 'Todos tomados ✓' :
                       `${total - taken} pendente${total - taken !== 1 ? 's' : ''}`;

    container.innerHTML = `
      <div class="card">
        ${_renderDateNav(meds)}
        ${s.showMonth ? _renderMonth(meds) : ''}

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
              <div class="med-ring-fraction">
                <span class="med-ring-num">${taken}</span>
                <div class="med-ring-sep"></div>
                <span class="med-ring-den">${total}</span>
              </div>
            </div>
          </div>
          <div>
            <h2 class="page-title" style="margin:0">Saúde</h2>
            <div class="page-sub">${subLabel}</div>
          </div>
          ${streak > 0 ? `
            <div class="med-streak">
              <span class="med-streak-fire">🔥</span>
              <span class="med-streak-num">${streak}</span>
              <span class="med-streak-label">dias</span>
            </div>
          ` : ''}
          <button class="btn btn-primary" id="med-novo-btn" style="margin-left:auto">
            <span data-icon="plus" data-size="14"></span> Novo
          </button>
        </div>

        <div class="med-timeline">
          ${items.length ? items.map((item, i) => {
              const last = i === items.length - 1;
              if (item.type === 'med')     return _renderMedItem(item, last);
              if (item.type === 'consulta') return _renderConItem(item, last);
              if (item.type === 'renovar') return _renderRenovarItem(item, last);
              return '';
            }).join('') : _renderEmpty()}
        </div>
      </div>
    `;

    Icons.render(container);
    _bindEvents(container);
    requestAnimationFrame(() => _animateRing(total, taken));
  }

  // ─── DATE NAV ─────────────────────────────────────────────
  function _renderDateNav(meds = []) {
    const today   = todayISO();
    const isToday = s.date === today;
    const days    = [-3, -2, -1, 0, 1, 2, 3].map(n => _addDays(s.date, n));

    return `
      <div class="med-date-nav">
        <div class="med-date-row">
          <button class="med-date-arrow" id="med-prev-day" aria-label="Dia anterior">
            <span data-icon="chevron-left" data-size="16"></span>
          </button>
          <div class="med-date-strip">
            ${days.map(d => {
              const dots      = _dayDots(d, meds);
              const isActive  = d === s.date;
              const isTodayD  = d === today;
              return `
                <button class="med-date-item${isActive ? ' active' : ''}${isTodayD ? ' is-today' : ''}"
                        data-nav-date="${d}">
                  <span class="med-date-dow">${_fmtDOW(d)}</span>
                  <span class="med-date-num">${d.slice(8)}</span>
                  <span class="med-date-dots">
                    ${dots.gold  ? '<span class="med-date-dot gold"></span>'  : ''}
                    ${dots.amber ? '<span class="med-date-dot amber"></span>' : ''}
                    ${dots.blue  ? '<span class="med-date-dot blue"></span>'  : ''}
                  </span>
                </button>
              `;
            }).join('')}
          </div>
          <button class="med-date-arrow" id="med-next-day" aria-label="Próximo dia">
            <span data-icon="chevron-right" data-size="16"></span>
          </button>
          <button class="med-month-toggle" id="med-month-toggle" title="${s.showMonth ? 'Fechar calendário' : 'Ver mês'}">
            <span data-icon="calendar" data-size="15"></span>
          </button>
        </div>
        ${!isToday ? `
          <div class="med-back-today-row">
            <button class="med-back-today-btn" id="med-back-today">
              <span data-icon="corner-up-left" data-size="12"></span>
              Hoje
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }

  // ─── MONTH CALENDAR ───────────────────────────────────────
  function _renderMonth(meds = []) {
    const sel   = new Date(s.date + 'T00:00:00');
    const year  = sel.getFullYear();
    const month = sel.getMonth();
    const today = todayISO();

    const firstDay = new Date(year, month, 1);
    const lastDay  = new Date(year, month + 1, 0);
    const startDow = firstDay.getDay();

    const monthName = firstDay.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    const prev1     = new Date(year, month - 1, 1).toISOString().slice(0, 10);
    const next1     = new Date(year, month + 1, 1).toISOString().slice(0, 10);

    let cells = Array(startDow).fill('<div class="med-month-cell"></div>').join('');

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const iso    = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dots   = _dayDots(iso, meds);
      const active = iso === s.date;
      const isT    = iso === today;
      const future = iso > today;
      cells += `
        <button class="med-month-cell med-month-day${active ? ' active' : ''}${isT ? ' is-today' : ''}${future ? ' future' : ''}"
                data-month-date="${iso}">
          <span class="med-month-num">${d}</span>
          <span class="med-date-dots">
            ${dots.gold  ? '<span class="med-date-dot gold"></span>'  : ''}
            ${dots.amber ? '<span class="med-date-dot amber"></span>' : ''}
            ${dots.blue  ? '<span class="med-date-dot blue"></span>'  : ''}
          </span>
        </button>
      `;
    }

    return `
      <div class="med-month-overlay">
        <div class="med-month-cal">
          <div class="med-month-head">
            <button class="med-date-arrow" data-month-nav="${prev1}">
              <span data-icon="chevron-left" data-size="14"></span>
            </button>
            <span class="med-month-title">${monthName}</span>
            <button class="med-date-arrow" data-month-nav="${next1}">
              <span data-icon="chevron-right" data-size="14"></span>
            </button>
            <button class="med-month-close-btn" id="med-month-close">
              <span data-icon="x" data-size="14"></span>
            </button>
          </div>
          <div class="med-month-dow-row">
            ${['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(d => `<span>${d}</span>`).join('')}
          </div>
          <div class="med-month-grid">${cells}</div>
          <div class="med-month-legend">
            <span><span class="med-date-dot gold"></span> Tudo tomado</span>
            <span><span class="med-date-dot amber"></span> Parcial</span>
            <span><span class="med-date-dot blue"></span> Consulta</span>
          </div>
        </div>
      </div>
    `;
  }

  // ─── CHOOSE SCREEN ────────────────────────────────────────
  function _renderChoose() {
    return `
      <div class="med-choose">
        <h3 class="med-choose-title">O que deseja adicionar?</h3>
        <div class="med-choose-grid">
          <button class="med-choose-card" id="choose-med">
            <span class="med-choose-icon">💊</span>
            <span class="med-choose-label">Medicamento</span>
            <span class="med-choose-sub">Controle de remédios, doses e horários</span>
          </button>
          <button class="med-choose-card" id="choose-consulta">
            <span class="med-choose-icon">🏥</span>
            <span class="med-choose-label">Consulta</span>
            <span class="med-choose-sub">Agendar ou registrar consulta médica</span>
          </button>
        </div>
        <button class="btn btn-ghost btn-sm" id="choose-cancel" style="margin-top:var(--s-5)">
          Cancelar
        </button>
      </div>
    `;
  }

  // ─── MED WIZARD ───────────────────────────────────────────
  function _renderMedWiz() {
    const dots = [1,2,3,4,5,6].map(n =>
      `<div class="wiz-dot${s.step === n ? ' active' : ''}"></div>`
    ).join('');
    return `
      <div class="wiz-top">
        <span class="wiz-titulo">Novo medicamento</span>
        <div class="wiz-dots">${dots}</div>
      </div>
      <div class="wiz-step" id="wiz-step-content">${_medStep()}</div>
      <div class="wiz-nav">
        <button class="btn btn-ghost btn-sm" id="wiz-back-btn">${s.step === 1 ? 'Cancelar' : '← Voltar'}</button>
        <button class="btn btn-primary btn-sm" id="wiz-next-btn">${s.step === 6 ? 'Salvar ✓' : 'Avançar →'}</button>
      </div>
    `;
  }

  function _medStep() {
    const tipo = TIPOS.find(t => t.id === s.tipo) || TIPOS[0];
    switch (s.step) {
      case 1: return `
        <label class="wiz-label">Nome do medicamento</label>
        <input class="wiz-input" id="wiz-nome" type="text" placeholder="Ex: Losartana 50mg" value="${esc(s.nome)}">
        <div style="margin-top:var(--s-4)">
          <label class="wiz-label">Tipo</label>
          <div class="wiz-tipos">
            ${TIPOS.map(t => `
              <button class="wiz-tipo-btn${s.tipo === t.id ? ' active' : ''}" data-tipo="${t.id}">
                <span class="wiz-tipo-icon">${t.icon}</span>
                <span class="wiz-tipo-label">${t.label}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;
      case 2: return `
        <label class="wiz-label">Quando começa o tratamento?</label>
        <input class="wiz-input" id="wiz-data-inicio" type="date" value="${esc(s.dataInicio)}" style="width:auto">
        <div style="margin-top:var(--s-4)">
          <label class="wiz-label">Duração</label>
          <div class="wiz-chips">
            ${DURACOES.map(d => `
              <button class="wiz-chip${s.duracao === d.id ? ' active' : ''}" data-dur="${d.id}">${d.label}</button>
            `).join('')}
          </div>
          ${s.duracao === 'custom' ? `
            <div style="margin-top:var(--s-3)">
              <label class="wiz-label">Quantos dias?</label>
              <input class="wiz-input" id="wiz-duracao-custom" type="number" min="1" placeholder="Ex: 45"
                     value="${esc(s.duracaoCustom)}" style="width:auto">
            </div>
          ` : ''}
        </div>
      `;
      case 3: return `
        <label class="wiz-label">Quantas vezes por dia?</label>
        <div class="wiz-vpd-grid">
          ${[1,2,3,4,5].map(n => `
            <button class="wiz-vpd-btn${s.vezesPorDia === n ? ' active' : ''}" data-vpd="${n}">${n}×</button>
          `).join('')}
        </div>
      `;
      case 4: return `
        <label class="wiz-label">Configure cada dose</label>
        <div class="wiz-doses-list">
          ${s.doses.map((dose, i) => `
            <div class="wiz-dose-row">
              <span class="wiz-dose-num">Dose ${i + 1}</span>
              <div class="wiz-dose-fields">
                <div class="wiz-dose-field">
                  <label class="wiz-label">Horário</label>
                  <select class="wiz-input wiz-input-sm" data-dose-hora="${i}">
                    ${HRS.map(h => `<option value="${h}"${dose.hora === h ? ' selected' : ''}>${h}</option>`).join('')}
                  </select>
                </div>
                <div class="wiz-dose-field">
                  <label class="wiz-label">${tipo.unit}</label>
                  <div class="wiz-counter" style="gap:var(--s-2)">
                    <button class="wiz-counter-btn" data-dose-minus="${i}">−</button>
                    <span class="wiz-counter-val" id="dose-qty-${i}">${dose.quantidade}</span>
                    <button class="wiz-counter-btn" data-dose-plus="${i}">+</button>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      case 5: return `
        <label class="wiz-label">Estoque atual</label>
        <div class="wiz-counter">
          <button class="wiz-counter-btn" id="wiz-est-minus">−</button>
          <span class="wiz-counter-val" id="wiz-est-val">${s.estoque}</span>
          <span class="wiz-counter-unit">unidades</span>
          <button class="wiz-counter-btn" id="wiz-est-plus">+</button>
        </div>
        <div style="margin-top:var(--s-4)">
          <label class="wiz-label">Alertar quando abaixo de</label>
          <div class="wiz-counter">
            <button class="wiz-counter-btn" id="wiz-min-minus">−</button>
            <span class="wiz-counter-val" id="wiz-min-val">${s.estoqueMinimo}</span>
            <span class="wiz-counter-unit">unidades</span>
            <button class="wiz-counter-btn" id="wiz-min-plus">+</button>
          </div>
        </div>
      `;
      case 6: {
        const inicio   = s.dataInicio ? new Date(s.dataInicio + 'T00:00:00').toLocaleDateString('pt-BR') : '—';
        const dur      = s.duracao === 'custom'
          ? (s.duracaoCustom ? `${s.duracaoCustom} dias` : 'Personalizado')
          : DURACOES.find(d => d.id === s.duracao)?.label || 'Contínuo';
        const dosesStr = s.doses.map((d, i) => `Dose ${i+1}: ${d.hora} · ${d.quantidade} ${tipo.unit}`).join('<br>');
        return `
          <div class="wiz-confirm">
            <div class="wiz-confirm-icon">${tipo.icon}</div>
            <h3 class="wiz-confirm-nome">${esc(s.nome) || '—'}</h3>
            <div class="wiz-confirm-rows">
              <div class="wiz-confirm-row"><span class="wiz-confirm-lbl">Tipo</span><span>${tipo.label}</span></div>
              <div class="wiz-confirm-row"><span class="wiz-confirm-lbl">Início</span><span>${inicio} · ${dur}</span></div>
              <div class="wiz-confirm-row"><span class="wiz-confirm-lbl">Doses</span><span>${s.vezesPorDia}× ao dia<br><small style="color:var(--text-4)">${dosesStr}</small></span></div>
              <div class="wiz-confirm-row"><span class="wiz-confirm-lbl">Estoque</span><span>${s.estoque} un. · Alerta em ${s.estoqueMinimo}</span></div>
            </div>
          </div>
        `;
      }
    }
    return '';
  }

  // ─── CONSULTA WIZARD ──────────────────────────────────────
  function _renderConWiz() {
    const dots = [1,2,3].map(n =>
      `<div class="wiz-dot${s.step === n ? ' active' : ''}"></div>`
    ).join('');
    return `
      <div class="wiz-top">
        <span class="wiz-titulo">Nova consulta</span>
        <div class="wiz-dots">${dots}</div>
      </div>
      <div class="wiz-step" id="wiz-step-content">${_conStep()}</div>
      <div class="wiz-nav">
        <button class="btn btn-ghost btn-sm" id="wiz-back-btn">${s.step === 1 ? 'Cancelar' : '← Voltar'}</button>
        <button class="btn btn-primary btn-sm" id="wiz-next-btn">${s.step === 3 ? 'Salvar ✓' : 'Avançar →'}</button>
      </div>
    `;
  }

  function _conStep() {
    switch (s.step) {
      case 1: return `
        <label class="wiz-label">Especialidade</label>
        <input class="wiz-input" id="con-esp" type="text" placeholder="Ex: Cardiologia" value="${esc(s.cEsp)}">
        <div style="margin-top:var(--s-3)">
          <label class="wiz-label">Médico(a) <span style="font-weight:400;text-transform:none;color:var(--text-4)">(opcional)</span></label>
          <input class="wiz-input" id="con-med" type="text" placeholder="Ex: Dr. Silva" value="${esc(s.cMed)}">
        </div>
      `;
      case 2: return `
        <label class="wiz-label">Data da consulta</label>
        <input class="wiz-input" id="con-data" type="date" value="${esc(s.cData)}" style="width:auto">
        <div style="margin-top:var(--s-3)">
          <label class="wiz-label">Horário</label>
          <input class="wiz-input" id="con-hora" type="time" value="${esc(s.cHora)}" style="width:auto">
        </div>
      `;
      case 3: return `
        <label class="wiz-label">Observação <span style="font-weight:400;text-transform:none;color:var(--text-4)">(opcional)</span></label>
        <textarea class="wiz-input" id="con-nota" rows="4" placeholder="Ex: Levar exames de sangue, carteirinha do plano...">${esc(s.cNota)}</textarea>
      `;
    }
    return '';
  }

  // ─── TIMELINE ITEMS ───────────────────────────────────────
  function _renderMedItem(item, isLast) {
    const { med, dose, doseIdx, state } = item;
    const tipo         = TIPOS.find(t => t.id === med.tipo) || TIPOS[0];
    const estoqueAlert = med.estoque <= med.estoqueMinimo;
    const dotCls       = state === 'tomado' ? 'tl-dot-done' : state === 'atrasado' ? 'tl-dot-late' : 'tl-dot-pend';

    return `
      <div class="med-tl-item${state === 'tomado' ? ' tl-done' : ''}${state === 'atrasado' ? ' tl-late' : ''}">
        <div class="med-tl-left">
          <span class="med-tl-hora">${esc(dose.hora)}</span>
          ${!isLast ? '<div class="med-tl-line"></div>' : ''}
        </div>
        <div class="med-tl-dot ${dotCls}">${state === 'tomado' ? '✓' : ''}</div>
        <div class="med-tl-right">
          <div class="med-tl-main">
            <span class="med-tl-icon">${tipo.icon}</span>
            <div class="med-tl-info">
              <span class="med-tl-title">${esc(med.nome)}</span>
              <span class="med-tl-sub">
                ${dose.quantidade} ${_doseUnit(dose.quantidade, med.tipo)}
                ${med.estoque !== undefined ? `· <span class="${estoqueAlert ? 'tl-stock-alert' : ''}">${estoqueAlert ? '⚠️ ' : ''}${_estoqueLabel(med.estoque, med.tipo)}</span>` : ''}
              </span>
            </div>
            <div class="med-tl-actions">
              ${state !== 'tomado' ? `
                <button class="btn btn-primary btn-sm tl-btn" data-marcar-med="${esc(med.id)}" data-marcar-idx="${doseIdx}">
                  <span data-icon="check" data-size="12"></span> Marcar
                </button>
              ` : `
                <span class="tl-done-badge"><span data-icon="check-circle" data-size="13"></span> Tomado</span>
              `}
              <button class="med-del-btn" data-del-med="${esc(med.id)}" title="Remover medicamento">
                <span data-icon="trash-2" data-size="12"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function _renderConItem(item, isLast) {
    const { consulta, state } = item;
    const realizada = state === 'realizada';
    const label     = _relDate(consulta.data, consulta.hora);

    return `
      <div class="med-tl-item med-tl-consulta${realizada ? ' tl-done' : ''}">
        <div class="med-tl-left">
          <span class="med-tl-hora">${esc(consulta.hora || '—')}</span>
          ${!isLast ? '<div class="med-tl-line"></div>' : ''}
        </div>
        <div class="med-tl-dot tl-dot-con">${realizada ? '✓' : '🏥'}</div>
        <div class="med-tl-right">
          <div class="med-tl-main">
            <div class="med-tl-info">
              <span class="med-tl-title">${esc(consulta.especialidade || '—')}</span>
              <span class="med-tl-sub">${consulta.medico ? esc(consulta.medico) + ' · ' : ''}${label}</span>
              ${consulta.nota ? `<span class="med-tl-nota">📝 ${esc(consulta.nota)}</span>` : ''}
            </div>
            <div class="med-tl-actions">
              ${!realizada ? `
                <button class="btn btn-ghost btn-sm tl-btn" data-marcar-con="${esc(consulta.id)}">Realizada</button>
              ` : `
                <span class="tl-done-badge"><span data-icon="check-circle" data-size="13"></span> Realizada</span>
              `}
              <button class="med-del-btn" data-del-con="${esc(consulta.id)}" title="Remover consulta">
                <span data-icon="trash-2" data-size="12"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function _renderRenovarItem(item, isLast) {
    const { med } = item;
    const tipo = TIPOS.find(t => t.id === med.tipo) || TIPOS[0];
    return `
      <div class="med-tl-item med-tl-renovar">
        <div class="med-tl-left">
          <span class="med-tl-hora">—</span>
          ${!isLast ? '<div class="med-tl-line"></div>' : ''}
        </div>
        <div class="med-tl-dot tl-dot-ended">↻</div>
        <div class="med-tl-right">
          <div class="med-tl-main">
            <span class="med-tl-icon">${tipo.icon}</span>
            <div class="med-tl-info">
              <span class="med-tl-title">${esc(med.nome)}</span>
              <span class="med-tl-sub">Tratamento encerrado</span>
            </div>
            <div class="med-tl-actions">
              <button class="btn btn-ghost btn-sm tl-btn" data-renovar-med="${esc(med.id)}">
                <span data-icon="refresh-cw" data-size="12"></span> Renovar
              </button>
              <button class="med-del-btn" data-del-med="${esc(med.id)}" title="Remover medicamento">
                <span data-icon="trash-2" data-size="12"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function _renderEmpty() {
    const isToday = s.date === todayISO();
    return `
      <div class="med-tl-empty">
        <div class="med-empty-icon">${Icons.html('heart-pulse', 28)}</div>
        <h4 class="med-empty-titulo">Nada para ${isToday ? 'hoje' : _fmtShort(s.date)}</h4>
        <p class="med-empty-sub">Adicione medicamentos ou consultas usando o botão Novo.</p>
      </div>
    `;
  }

  // ─── RING ─────────────────────────────────────────────────
  function _animateRing(total, taken) {
    const el = document.getElementById('med-ring-fill');
    if (!el) return;
    const target = total ? CIRC * (1 - taken / total) : CIRC;
    el.style.transition = 'none';
    el.setAttribute('stroke-dashoffset', CIRC.toFixed(2));
    requestAnimationFrame(() => {
      el.style.transition = 'stroke-dashoffset 800ms cubic-bezier(0.34,1.56,0.64,1)';
      el.setAttribute('stroke-dashoffset', target.toFixed(2));
    });
  }

  // ─── EVENTS ───────────────────────────────────────────────
  function _bindEvents(container) {
    // Choose screen
    container.querySelector('#choose-med')?.addEventListener('click', () => {
      s.wizard = 'med'; s.step = 1; render();
      setTimeout(() => document.getElementById('wiz-nome')?.focus(), 50);
    });
    container.querySelector('#choose-consulta')?.addEventListener('click', () => {
      s.wizard = 'consulta'; s.step = 1; render();
      setTimeout(() => document.getElementById('con-esp')?.focus(), 50);
    });
    container.querySelector('#choose-cancel')?.addEventListener('click', () => { s.wizard = null; render(); });

    // Novo
    container.querySelector('#med-novo-btn')?.addEventListener('click', () => { s.wizard = 'choose'; render(); });

    // Date nav arrows
    container.querySelector('#med-prev-day')?.addEventListener('click', () => { s.date = _addDays(s.date, -1); s.showMonth = false; render(); });
    container.querySelector('#med-next-day')?.addEventListener('click', () => { s.date = _addDays(s.date, 1);  s.showMonth = false; render(); });
    container.querySelector('#med-back-today')?.addEventListener('click', () => { s.date = todayISO(); s.showMonth = false; render(); });

    // Month toggle
    container.querySelector('#med-month-toggle')?.addEventListener('click', () => { s.showMonth = !s.showMonth; render(); });
    container.querySelector('#med-month-close')?.addEventListener('click', () => { s.showMonth = false; render(); });

    // Date strip items
    container.querySelectorAll('[data-nav-date]').forEach(btn => {
      btn.addEventListener('click', () => { s.date = btn.dataset.navDate; s.showMonth = false; render(); });
    });

    // Month nav (prev/next month)
    container.querySelectorAll('[data-month-nav]').forEach(btn => {
      btn.addEventListener('click', () => { s.date = btn.dataset.monthNav; render(); });
    });

    // Month day cells
    container.querySelectorAll('[data-month-date]').forEach(btn => {
      btn.addEventListener('click', () => { s.date = btn.dataset.monthDate; s.showMonth = false; render(); });
    });

    // Wizard nav
    container.querySelector('#wiz-back-btn')?.addEventListener('click', _wizBack);
    container.querySelector('#wiz-next-btn')?.addEventListener('click', _wizNext);
    _bindStepEvents(container);

    // Marcar dose
    container.querySelectorAll('[data-marcar-med]').forEach(btn => {
      btn.addEventListener('click', () => {
        const medId   = btn.dataset.marcarMed;
        const doseIdx = parseInt(btn.dataset.marcarIdx, 10);
        const med     = DB.getMedicamentos().find(m => m.id === medId);
        if (!med) return;
        if (DB.isDoseTomada(medId, s.date, doseIdx)) { Toast.info('Já registrado', 'Esta dose já foi marcada.'); return; }
        const medNorm = _norm(med);
        const qty     = medNorm.doses[doseIdx]?.quantidade || 1;
        if (med.estoque > 0) DB.saveMedicamento({ id: medId, estoque: Math.max(0, med.estoque - qty) });
        DB.registrarDose(medId, s.date, doseIdx);
        Toast.success('Dose registrada', `${med.nome} ✓`);
        render();
      });
    });

    // Marcar consulta realizada
    container.querySelectorAll('[data-marcar-con]').forEach(btn => {
      btn.addEventListener('click', () => {
        DB.updateConsulta(btn.dataset.marcarCon, { status: 'realizada' });
        Toast.success('Consulta realizada', '✓');
        render();
      });
    });

    // Renovar ciclo
    container.querySelectorAll('[data-renovar-med]').forEach(btn => {
      btn.addEventListener('click', () => {
        const med = DB.getMedicamentos().find(m => m.id === btn.dataset.renovarMed);
        if (!med) return;
        DB.saveMedicamento({ id: med.id, dataInicio: todayISO() });
        Toast.success('Ciclo renovado', `${med.nome} · iniciando hoje`);
        render();
      });
    });

    // Deletar med
    container.querySelectorAll('[data-del-med]').forEach(btn => {
      btn.addEventListener('click', () => {
        const med = DB.getMedicamentos().find(m => m.id === btn.dataset.delMed);
        if (!med || !confirm(`Remover ${med.nome}?`)) return;
        DB.deleteMedicamento(btn.dataset.delMed);
        render();
      });
    });

    // Deletar consulta
    container.querySelectorAll('[data-del-con]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!confirm('Remover consulta?')) return;
        DB.deleteConsulta(btn.dataset.delCon);
        render();
      });
    });
  }

  function _bindStepEvents(container) {
    // Tipo buttons
    container.querySelectorAll('[data-tipo]').forEach(btn => {
      btn.addEventListener('click', () => {
        s.tipo = btn.dataset.tipo;
        container.querySelectorAll('[data-tipo]').forEach(b => b.classList.toggle('active', b.dataset.tipo === s.tipo));
      });
    });
    // Duração chips
    container.querySelectorAll('[data-dur]').forEach(btn => {
      btn.addEventListener('click', () => {
        const prev = s.duracao;
        s.duracao = btn.dataset.dur;
        // se mudou de/para 'custom', re-renderiza o step para mostrar/esconder o input
        if ((prev === 'custom') !== (s.duracao === 'custom')) {
          const dateEl = document.getElementById('wiz-data-inicio');
          if (dateEl) s.dataInicio = dateEl.value;
          _refreshStep();
        } else {
          container.querySelectorAll('[data-dur]').forEach(b => b.classList.toggle('active', b.dataset.dur === s.duracao));
        }
      });
    });
    // Vezes por dia
    container.querySelectorAll('[data-vpd]').forEach(btn => {
      btn.addEventListener('click', () => {
        const n = parseInt(btn.dataset.vpd, 10);
        s.vezesPorDia = n;
        while (s.doses.length < n) s.doses.push({ hora: HRS[Math.min(s.doses.length * 3, HRS.length - 1)], quantidade: 1 });
        s.doses = s.doses.slice(0, n);
        container.querySelectorAll('[data-vpd]').forEach(b => b.classList.toggle('active', parseInt(b.dataset.vpd) === n));
      });
    });
    // Dose hora
    container.querySelectorAll('[data-dose-hora]').forEach(sel => {
      sel.addEventListener('change', () => {
        const i = parseInt(sel.dataset.doseHora, 10);
        if (s.doses[i]) s.doses[i].hora = sel.value;
      });
    });
    // Dose qty
    container.querySelectorAll('[data-dose-minus]').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.dataset.doseMinus, 10);
        if (s.doses[i]) { s.doses[i].quantidade = Math.max(1, s.doses[i].quantidade - 1); const el = document.getElementById(`dose-qty-${i}`); if (el) el.textContent = s.doses[i].quantidade; }
      });
    });
    container.querySelectorAll('[data-dose-plus]').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.dataset.dosePlus, 10);
        if (s.doses[i]) { s.doses[i].quantidade++; const el = document.getElementById(`dose-qty-${i}`); if (el) el.textContent = s.doses[i].quantidade; }
      });
    });
    // Estoque counters
    container.querySelector('#wiz-est-minus')?.addEventListener('click', () => { s.estoque = Math.max(0, s.estoque - 1); const el = document.getElementById('wiz-est-val'); if (el) el.textContent = s.estoque; });
    container.querySelector('#wiz-est-plus')?.addEventListener('click',  () => { s.estoque++; const el = document.getElementById('wiz-est-val'); if (el) el.textContent = s.estoque; });
    container.querySelector('#wiz-min-minus')?.addEventListener('click', () => { s.estoqueMinimo = Math.max(1, s.estoqueMinimo - 1); const el = document.getElementById('wiz-min-val'); if (el) el.textContent = s.estoqueMinimo; });
    container.querySelector('#wiz-min-plus')?.addEventListener('click',  () => { s.estoqueMinimo++; const el = document.getElementById('wiz-min-val'); if (el) el.textContent = s.estoqueMinimo; });
  }

  // ─── WIZARD FLOW ──────────────────────────────────────────
  function _wizBack() {
    if (s.step === 1) { s.wizard = null; render(); return; }
    _captureStep();
    s.step--;
    _refreshStep();
  }

  function _wizNext() {
    _captureStep();
    const maxStep = s.wizard === 'med' ? 6 : 3;
    if (!_validateStep()) return;
    if (s.step === maxStep) { s.wizard === 'med' ? _saveMed() : _saveCon(); return; }
    s.step++;
    _refreshStep();
  }

  function _captureStep() {
    if (s.wizard === 'med') {
      if (s.step === 1) s.nome = document.getElementById('wiz-nome')?.value.trim() || s.nome;
      if (s.step === 2) {
        s.dataInicio = document.getElementById('wiz-data-inicio')?.value || s.dataInicio;
        if (s.duracao === 'custom') s.duracaoCustom = document.getElementById('wiz-duracao-custom')?.value || s.duracaoCustom;
      }
    }
    if (s.wizard === 'consulta') {
      if (s.step === 1) { s.cEsp = document.getElementById('con-esp')?.value.trim() || s.cEsp; s.cMed = document.getElementById('con-med')?.value.trim() || s.cMed; }
      if (s.step === 2) { s.cData = document.getElementById('con-data')?.value || s.cData; s.cHora = document.getElementById('con-hora')?.value || s.cHora; }
      if (s.step === 3) s.cNota = document.getElementById('con-nota')?.value.trim() || s.cNota;
    }
  }

  function _validateStep() {
    if (s.wizard === 'med' && s.step === 1 && !s.nome) {
      Toast.warning('Campo obrigatório', 'Informe o nome do medicamento.');
      document.getElementById('wiz-nome')?.focus();
      return false;
    }
    if (s.wizard === 'consulta' && s.step === 1 && !s.cEsp) {
      Toast.warning('Campo obrigatório', 'Informe a especialidade.');
      document.getElementById('con-esp')?.focus();
      return false;
    }
    return true;
  }

  function _refreshStep() {
    const content = document.getElementById('wiz-step-content');
    if (content) {
      content.innerHTML = s.wizard === 'med' ? _medStep() : _conStep();
      _bindStepEvents(document.getElementById('medicamentos-content'));
    }
    document.querySelectorAll('.wiz-dot').forEach((d, i) => d.classList.toggle('active', i + 1 === s.step));
    const maxStep = s.wizard === 'med' ? 6 : 3;
    const back = document.getElementById('wiz-back-btn');
    const next = document.getElementById('wiz-next-btn');
    if (back) back.textContent = s.step === 1 ? 'Cancelar' : '← Voltar';
    if (next) next.textContent = s.step === maxStep ? 'Salvar ✓' : 'Avançar →';
    setTimeout(() => content?.querySelector('input, textarea')?.focus(), 50);
  }

  function _saveMed() {
    const nome    = s.nome;
    const duracao = s.duracao === 'custom' ? parseInt(s.duracaoCustom, 10) || 0 : parseInt(s.duracao, 10);
    DB.saveMedicamento({
      nome, tipo: s.tipo, dosagem: '',
      dataInicio: s.dataInicio, duracao,
      vezesPorDia: s.vezesPorDia, doses: s.doses.slice(),
      estoque: s.estoque, estoqueMinimo: s.estoqueMinimo,
    });
    s = _fresh(s.date);
    Toast.success('Medicamento salvo', nome);
    render();
  }

  function _saveCon() {
    const esp = s.cEsp;
    DB.saveConsulta({ especialidade: esp, medico: s.cMed, data: s.cData, hora: s.cHora, nota: s.cNota, status: 'agendada' });
    s = _fresh(s.date);
    Toast.success('Consulta salva', esp);
    render();
  }

  return { render };
})();
