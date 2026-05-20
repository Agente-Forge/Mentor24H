/* ═══════════════════════════════════════════════════════════
   HÁBITOS — Streak + Calendário semanal + Push local
═══════════════════════════════════════════════════════════ */

const Habitos = (() => {
  const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  /* ── Render principal ── */
  function render() {
    const container = document.getElementById('habitos-content');
    if (!container) return;
    _buildUI(container);
    _bindEvents(container);
    Icons.render(container);
    _reagendarTodos();
  }

  function _buildUI(container) {
    const habitos = _getHabitos();
    container.innerHTML = `
      <div class="page-head">
        <div>
          <h2 class="page-title">Meus <em>hábitos</em></h2>
          <div class="page-sub">${habitos.length} hábito${habitos.length !== 1 ? 's' : ''} cadastrado${habitos.length !== 1 ? 's' : ''}</div>
        </div>
        <button class="btn btn-primary" id="hab-novo-btn">
          <span data-icon="plus" data-size="14"></span>
          Novo hábito
        </button>
      </div>

      <div class="card" id="hab-form" style="display:none;margin-bottom:var(--s-5)">
        <h3 style="font-size:var(--t-md);font-weight:600;margin-bottom:var(--s-4)">Novo hábito</h3>
        <div class="field">
          <label class="field-label">Nome *</label>
          <input id="hab-f-nome" type="text" placeholder="Ex: Beber 2L de água">
        </div>
        <div class="field-row">
          <div class="field">
            <label class="field-label">Horário (push local)</label>
            <input id="hab-f-hora" type="time" placeholder="08:00">
          </div>
          <div class="field">
            <label class="field-label">Frequência</label>
            <select id="hab-f-freq">
              <option value="diario" selected>Diário</option>
              <option value="semanal">Semanal</option>
            </select>
          </div>
        </div>
        <div style="display:flex;gap:var(--s-3);justify-content:flex-end;margin-top:var(--s-4)">
          <button class="btn btn-ghost" id="hab-cancel-btn">Cancelar</button>
          <button class="btn btn-primary" id="hab-save-btn">
            <span data-icon="check" data-size="14"></span> Salvar
          </button>
        </div>
      </div>

      <div id="hab-lista">${_buildLista(habitos)}</div>
    `;

    _bindListEvents(container.querySelector('#hab-lista'), container);
  }

  /* ── Lista ── */
  function _buildLista(habitos) {
    if (!habitos.length) {
      return `
        <div class="empty">
          <div class="empty-icon">${Icons.html('repeat', 26)}</div>
          <h4>Nenhum hábito ainda</h4>
          <p>Crie seu primeiro hábito acima.</p>
        </div>
      `;
    }
    return habitos.map(_buildItem).join('');
  }

  function _buildItem(h) {
    const feitoHoje = _feitoHoje(h);
    const cal = _buildCalendario(h);
    return `
      <div class="hab-item" data-hab-id="${esc(h.id)}">
        <button class="hab-check-btn${feitoHoje ? ' feito' : ''}" data-hab-check="${esc(h.id)}" title="${feitoHoje ? 'Desmarcar' : 'Marcar como feito'}">
          <span data-icon="${feitoHoje ? 'check' : 'circle'}" data-size="16"></span>
        </button>
        <div class="hab-body">
          <div class="hab-nome">${esc(h.nome)}</div>
          <div class="hab-meta">
            ${h.hora ? esc(h.hora) + ' · ' : ''}${esc(h.frequencia === 'semanal' ? 'Semanal' : 'Diário')}
          </div>
          <div class="hab-cal">${cal}</div>
        </div>
        <div class="hab-streak">
          <div class="hab-streak-num" id="streak-num-${esc(h.id)}">${h.streak || 0}</div>
          <div class="hab-streak-label">🔥 dias</div>
        </div>
        <button class="hab-del" data-del-hab="${esc(h.id)}" title="Remover hábito">
          <span data-icon="x" data-size="14"></span>
        </button>
      </div>
    `;
  }

  function _buildCalendario(h) {
    const hoje = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(hoje);
      d.setDate(hoje.getDate() - (6 - i));
      const iso = d.toISOString().slice(0, 10);
      const feito = (h.checkins || []).includes(iso);
      const label = DIAS_SEMANA[d.getDay()];
      return `<div class="hab-cal-day${feito ? ' feito' : ''}" title="${iso}">${label}</div>`;
    }).join('');
  }

  /* ── Check-in ── */
  function _marcarFeito(id, container) {
    const habitos = _getHabitos();
    const h = habitos.find(x => x.id === id);
    if (!h) return;

    const hoje = new Date().toISOString().slice(0, 10);
    const checkins = h.checkins || [];
    const jaFez = checkins.includes(hoje);

    if (jaFez) {
      h.checkins = checkins.filter(d => d !== hoje);
      h.streak = Math.max(0, (h.streak || 0) - 1);
    } else {
      h.checkins = [...checkins, hoje];
      const ontem = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().slice(0, 10);
      const streakValido = checkins.includes(ontem) || checkins.length === 0;
      h.streak = streakValido ? (h.streak || 0) + 1 : 1;
      if (!jaFez) Toast.success('Hábito concluído!', `🔥 Streak: ${h.streak} dia${h.streak !== 1 ? 's' : ''}`);
    }

    Repository.save('habitos', h);
    _atualizarItemDOM(h, container);
  }

  function _atualizarItemDOM(h, container) {
    const item = container.querySelector(`[data-hab-id="${h.id}"]`);
    if (!item) { _rebuildLista(container); return; }

    const feitoHoje = _feitoHoje(h);
    const btn = item.querySelector('[data-hab-check]');
    if (btn) {
      btn.className = 'hab-check-btn' + (feitoHoje ? ' feito' : '');
      btn.title = feitoHoje ? 'Desmarcar' : 'Marcar como feito';
      btn.innerHTML = `<span data-icon="${feitoHoje ? 'check' : 'circle'}" data-size="16"></span>`;
    }

    const streakEl = item.querySelector(`#streak-num-${h.id}`);
    if (streakEl) {
      streakEl.textContent = h.streak || 0;
      streakEl.classList.remove('animar');
      void streakEl.offsetWidth;
      streakEl.classList.add('animar');
    }

    const cal = item.querySelector('.hab-cal');
    if (cal) cal.innerHTML = _buildCalendario(h);

    Icons.render(item);
  }

  function _rebuildLista(container) {
    const lista = container.querySelector('#hab-lista');
    if (!lista) return;
    const habitos = _getHabitos();
    lista.innerHTML = _buildLista(habitos);
    _bindListEvents(lista, container);
    Icons.render(lista);
  }

  /* ── Push notifications ── */
  function _solicitarPermissao(callback) {
    if (!('Notification' in window)) { callback(false); return; }
    if (Notification.permission === 'granted') { callback(true); return; }
    if (Notification.permission === 'denied') { callback(false); return; }
    Notification.requestPermission().then(p => callback(p === 'granted'));
  }

  function _agendarPush(h) {
    if (!h.hora || !('Notification' in window)) return;
    const [hh, mm] = h.hora.split(':').map(Number);
    const agora = new Date();
    const disparo = new Date();
    disparo.setHours(hh, mm, 0, 0);
    if (disparo <= agora) disparo.setDate(disparo.getDate() + 1);
    const delay = disparo.getTime() - agora.getTime();
    const timerId = setTimeout(() => {
      if (Notification.permission === 'granted') {
        try {
          new Notification('Mentor24h — Hábito', {
            body: h.nome,
            icon: '/favicon.svg',
            tag: 'hab-' + h.id,
          });
        } catch (_) {}
      }
      _agendarPush(h);
    }, delay);
    h._timerId = timerId;
  }

  function _reagendarTodos() {
    _getHabitos().filter(h => h.hora).forEach(_agendarPush);
  }

  /* ── Persistência ── */
  function _getHabitos() {
    return Repository.get('habitos') || [];
  }

  function _feitoHoje(h) {
    const hoje = new Date().toISOString().slice(0, 10);
    return (h.checkins || []).includes(hoje);
  }

  /* ── Eventos ── */
  function _bindEvents(container) {
    container.querySelector('#hab-novo-btn')?.addEventListener('click', () => {
      const form = document.getElementById('hab-form');
      if (form) { form.style.display = ''; document.getElementById('hab-f-nome')?.focus(); }
    });

    container.querySelector('#hab-cancel-btn')?.addEventListener('click', () => {
      document.getElementById('hab-form').style.display = 'none';
    });

    container.querySelector('#hab-save-btn')?.addEventListener('click', () => _salvar(container));

    container.querySelector('#hab-f-nome')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') _salvar(container);
    });
  }

  function _bindListEvents(lista, container) {
    if (!lista) return;

    lista.querySelectorAll('[data-hab-check]').forEach(btn => {
      btn.addEventListener('click', () => _marcarFeito(btn.dataset.habCheck, container));
    });

    lista.querySelectorAll('[data-del-hab]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Remover este hábito?')) {
          Repository.remove('habitos', btn.dataset.delHab);
          _rebuildLista(container);
        }
      });
    });

    Icons.render(lista);
  }

  function _salvar(container) {
    const nome = document.getElementById('hab-f-nome')?.value.trim();
    if (!nome) { Toast.warning('Campo obrigatório', 'Informe o nome do hábito.'); return; }

    const hora  = document.getElementById('hab-f-hora')?.value || null;
    const freq  = document.getElementById('hab-f-freq')?.value || 'diario';

    const salvarHabito = () => {
      const h = Repository.save('habitos', { nome, hora, frequencia: freq, streak: 0, checkins: [] });
      if (hora) _agendarPush(h);
      document.getElementById('hab-f-nome').value = '';
      document.getElementById('hab-f-hora') && (document.getElementById('hab-f-hora').value = '');
      document.getElementById('hab-form').style.display = 'none';
      Toast.success('Hábito criado', nome);
      _rebuildLista(container);
    };

    if (hora) {
      _solicitarPermissao(ok => {
        if (!ok) Toast.info('Notificações bloqueadas', 'Hábito criado sem push local.');
        salvarHabito();
      });
    } else {
      salvarHabito();
    }
  }

  return { render };
})();
