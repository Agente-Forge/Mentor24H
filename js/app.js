/* ═══════════════════════════════════════════════════════════
   APP — Bootstrap, init, global handlers
═══════════════════════════════════════════════════════════ */

const App = (() => {
  function init() {
    importarDadosLeo();
    DB.updateStatusContas();
    Theme.init();
    initSidebar();
    initNavGroups();   /* precisa ser antes de initRouter para o navigate wrapper estar pronto */
    initRouter();
    syncUserUI();
    startClock();
    Alarm.init();
    CommandPalette.init();
    Icons.render();
  }

  function initNavGroups() {
    document.querySelectorAll('.nav-group-header').forEach(header => {
      header.addEventListener('click', () => {
        const group = header.closest('.nav-group');
        if (!group) return;
        const wasOpen = group.classList.contains('open');
        /* Fechar todos os grupos */
        document.querySelectorAll('.nav-group').forEach(g => g.classList.remove('open'));
        /* Abrir o clicado se estava fechado */
        if (!wasOpen) group.classList.add('open');
      });
    });

    /* Abrir automaticamente o grupo da página ativa */
    const openGroupFor = (page) => {
      const groupMap = {
        'chat-ai': 'group-chat', 'chat-wa': 'group-chat',
        'produtos': 'group-negocio', 'vendas': 'group-negocio', 'estoque': 'group-negocio', 'clientes': 'group-negocio',
        'contas': 'group-financas', 'transacoes': 'group-financas', 'metas': 'group-financas',
        'agenda': 'group-pessoal', 'medicamentos': 'group-pessoal', 'tarefas': 'group-pessoal', 'contatos': 'group-pessoal',
      };
      const groupId = groupMap[page];
      if (groupId) {
        document.querySelectorAll('.nav-group').forEach(g => g.classList.remove('open'));
        document.getElementById(groupId)?.classList.add('open');
      }
    };

    const originalNavigate = Router.navigate;
    Router.navigate = function(page) {
      openGroupFor(page);
      return originalNavigate.call(Router, page);
    };
  }

  /* ─── Importação automática dos dados do Léo (única vez) ─── */
  function importarDadosLeo() {
    const JA_IMPORTADO = 'finflow.leo-v1';
    if (localStorage.getItem(JA_IMPORTADO)) return;
    DB.clearAll();
    if (typeof LEO_IMPORT_DATA !== 'undefined') {
      DB.importAll(LEO_IMPORT_DATA);
    }
    localStorage.setItem(JA_IMPORTADO, '1');
  }

  function syncUserUI() {
    const cfg = DB.getConfig();
    const initials = (cfg.nomeUsuario || 'V').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'V';
    Config.syncSidebarAvatar(initials, cfg.avatarCor || '#D4A574', cfg.nomeUsuario || 'Você');
  }

  function initSidebar() {
    const btn = document.getElementById('btn-collapse');
    if (btn) btn.addEventListener('click', toggleSidebar);

    const mobileBtn = document.getElementById('btn-mobile-menu');
    if (mobileBtn) mobileBtn.addEventListener('click', toggleMobileSidebar);

    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) overlay.addEventListener('click', closeMobileSidebar);

    /* Fechar sidebar mobile ao clicar em nav item */
    document.querySelectorAll('#sidebar .nav-item[data-nav]').forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 640) closeMobileSidebar();
      });
    });

    /* Bottom nav */
    document.querySelectorAll('.bnav-item[data-nav]').forEach(item => {
      item.addEventListener('click', () => {
        const page = item.dataset.nav;
        Router.navigate(page);
        closeMobileSidebar();
      });
    });
  }

  function toggleSidebar() {
    const sb = document.getElementById('sidebar');
    if (!sb) return;
    sb.classList.toggle('collapsed');
    const btn = document.getElementById('btn-collapse');
    if (btn) {
      btn.innerHTML = Icons.html(sb.classList.contains('collapsed') ? 'panel-left-open' : 'panel-left-close', 16);
    }
  }

  function toggleMobileSidebar() {
    const sb = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (!sb) return;
    const isOpen = sb.classList.contains('mobile-open');
    if (isOpen) {
      closeMobileSidebar();
    } else {
      sb.classList.add('mobile-open');
      overlay.classList.add('visible');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileSidebar() {
    const sb = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (!sb) return;
    sb.classList.remove('mobile-open');
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  const BNAV_GROUP = {
    'chat-ai': 'chat-ai', 'chat-wa': 'chat-ai',
    'produtos': 'vendas', 'vendas': 'vendas', 'estoque': 'vendas', 'clientes': 'vendas',
    'contas': 'contas', 'transacoes': 'contas', 'metas': 'contas',
    'kanban': 'contas', 'categorias': 'contas',
    'agenda': 'tarefas', 'medicamentos': 'tarefas', 'tarefas': 'tarefas', 'contatos': 'tarefas',
  };

  function syncBottomNav(page) {
    const activeNav = BNAV_GROUP[page] || page;
    document.querySelectorAll('.bnav-item[data-nav]').forEach(item => {
      item.classList.toggle('active', item.dataset.nav === activeNav);
    });
  }

  function initRouter() {
    Router.register('dashboard',  () => Dashboard.render());
    Router.register('contas',     () => Contas.render());
    Router.register('transacoes', () => Transacoes.render());
    Router.register('metas',      () => Metas.render());
    Router.register('kanban',     () => Kanban.render());
    Router.register('categorias', () => Categorias.render());
    Router.register('config',     () => { Config.render(); LLM.renderConfig(); });
    Router.register('chat-ai',    () => LLM.render());
    Router.register('chat-wa',    () => ChatWA.render());
    Router.register('agenda',     () => Agenda.render());
    Router.register('medicamentos', () => Medicamentos.render());
    Router.register('tarefas',    () => Tarefas.render());
    Router.register('contatos',   () => Contatos.render());
    Router.register('produtos',   () => Produtos.render());
    Router.register('vendas',     () => Vendas.render());
    Router.register('estoque',    () => Estoque.render());
    Router.register('clientes',   () => Clientes.render());
    Router.init();
  }

  /* ─── Relógio digital (tick a cada 1s) ─── */
  function startClock() {
    renderClock();
    setInterval(renderClock, 1000);
  }

  function renderClock() {
    const d = new Date();
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    const s = String(d.getSeconds()).padStart(2, '0');

    const clockEl = document.getElementById('topbar-clock');
    if (clockEl) {
      clockEl.innerHTML =
        `<span class="tc-h">${h}</span>` +
        `<span class="tc-sep">:</span>` +
        `<span class="tc-m">${m}</span>` +
        `<span class="tc-sep tc-sep-s">:</span>` +
        `<span class="tc-s">${s}</span>`;
    }

    const dateEl = document.getElementById('topbar-date');
    if (dateEl) {
      dateEl.textContent = d.toLocaleDateString('pt-BR', {
        weekday: 'long', day: '2-digit', month: 'short', year: 'numeric',
      });
    }
  }

  function handleGlobalAdd() {
    const page = Router.getCurrent();
    const map = {
      dashboard:    () => CommandPalette.open(),
      contas:       () => Modal.novaConta(),
      transacoes:   () => Modal.novaTransacao(),
      metas:        () => Modal.novaMeta(),
      kanban:       () => Modal.novoKanban(),
      categorias:   () => Modal.novaCategoria(),
      'chat-ai':    () => LLM.novaConversa(),
      agenda:       () => document.getElementById('agenda-novo-btn')?.click(),
      medicamentos: () => document.getElementById('med-novo-btn')?.click(),
      tarefas:      () => document.getElementById('trf-nova-btn')?.click(),
      contatos:     () => document.getElementById('ctto-novo-btn')?.click(),
      produtos:     () => Produtos.novo(),
      vendas:       () => Vendas.nova(),
      clientes:     () => Clientes.novo(),
      estoque:      () => Router.navigate('produtos'),
      config:       () => Toast.info('Use os botões na página', ''),
    };
    if (map[page]) map[page]();
    else CommandPalette.open();
  }

  window.handleGlobalAdd = handleGlobalAdd;

  return { init, toggleSidebar, syncUserUI, syncBottomNav, closeMobileSidebar };
})();

/* ═══════════════════════════════════════════════════════════
   ALARM — Timer com som e countdown
═══════════════════════════════════════════════════════════ */
const Alarm = (() => {
  let timerInterval = null;
  let endTime = null;
  let totalMs = 0;
  let audioCtx = null;

  function init() {
    const toggleBtn = document.getElementById('alarm-toggle');
    const panel     = document.getElementById('alarm-panel');
    const cancelBtn = document.getElementById('alarm-cancel');
    const customGo  = document.getElementById('alarm-custom-go');

    if (!toggleBtn) return;

    /* Abrir/fechar painel */
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.toggle('open');
    });

    /* Fechar clicando fora */
    document.addEventListener('click', (e) => {
      const widget = document.getElementById('alarm-widget');
      if (widget && !widget.contains(e.target)) {
        panel.classList.remove('open');
      }
    });

    /* Presets */
    document.querySelectorAll('.alarm-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const min = parseInt(btn.dataset.min);
        startTimer(min * 60);
        panel.classList.remove('open');
      });
    });

    /* Custom */
    customGo.addEventListener('click', () => {
      const min = parseInt(document.getElementById('alarm-custom-min').value) || 0;
      if (min < 1) return;
      startTimer(min * 60);
      panel.classList.remove('open');
    });

    /* Cancelar */
    cancelBtn.addEventListener('click', cancelTimer);
  }

  function startTimer(seconds) {
    cancelTimer();
    totalMs  = seconds * 1000;
    endTime  = Date.now() + totalMs;

    const widget  = document.getElementById('alarm-widget');
    const running = document.getElementById('alarm-running');
    if (widget)  widget.classList.add('alarm-active');
    if (running) running.style.display = 'flex';

    timerInterval = setInterval(tick, 500);
    tick();
  }

  function tick() {
    const remaining = Math.max(0, endTime - Date.now());
    const remain    = document.getElementById('alarm-remain');
    const fill      = document.getElementById('alarm-fill');
    const countdown = document.getElementById('alarm-countdown');

    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    const label = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;

    if (remain)    remain.textContent    = label;
    if (countdown) countdown.textContent = remaining > 0 ? label : '';

    const pct = remaining / totalMs;
    if (fill) fill.style.width = `${pct * 100}%`;

    if (remaining <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      playAlarm();
      resetUI();
      Toast.success('Tempo esgotado!', 'O alarme disparou.');
    }
  }

  function cancelTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
    endTime = null;
    resetUI();
  }

  function resetUI() {
    const widget    = document.getElementById('alarm-widget');
    const running   = document.getElementById('alarm-running');
    const countdown = document.getElementById('alarm-countdown');
    if (widget)    widget.classList.remove('alarm-active');
    if (running)   running.style.display = 'none';
    if (countdown) countdown.textContent = '';
    document.querySelectorAll('.alarm-preset').forEach(b => b.classList.remove('active'));
  }

  /* Som sintetizado via Web Audio API — 3 bipes ascendentes */
  function playAlarm() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtx;
      const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
      notes.forEach((freq, i) => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        const t = ctx.currentTime + i * 0.18;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.35, t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.start(t);
        osc.stop(t + 0.4);
      });
    } catch (e) {
      console.warn('Audio not available', e);
    }
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', App.init);
