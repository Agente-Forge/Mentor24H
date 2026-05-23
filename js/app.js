/* ═══════════════════════════════════════════════════════════
   APP — Bootstrap, init, global handlers
═══════════════════════════════════════════════════════════ */

const App = (() => {
  function init() {
    importarDadosLeo();
    DB.updateStatusContas();
    Theme.init();
    initModoSwitcher();        /* Iniciá-lo ANTES de initSidebar */
    initSidebar();
    initNavGroups();   /* precisa ser antes de initRouter para o navigate wrapper estar pronto */
    initRouter();
    syncUserUI();
    initSaudacao();
    startClock();
    Alarm.init();
    CommandPalette.init();
    Icons.render();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => {
          reg.addEventListener('updatefound', () => {
            Toast.info('Nova versão disponível!', 'Atualize a página para aplicar.');
          });
        })
        .catch(err => console.error('[SW]', err));
    }
  }

  function initModoSwitcher() {
    const modo = localStorage.getItem('mentor24h_modoAtivo') || 'pessoal';
    applyMode(modo);
    /* Navegar para posição inicial sem fade (primeiro load) */
    Router.navigate(restorePosition(modo));

    document.querySelectorAll('.modo-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        toggleModo(btn.dataset.modo);
      });
    });
  }

  /* Sync puro — sem fade, sem toast, sem navegação. Usado em: init, toggleModo interno */
  function applyMode(modo) {
    if (!['pessoal', 'negocio'].includes(modo)) modo = 'pessoal';
    localStorage.setItem('mentor24h_modoAtivo', modo);
    document.documentElement.setAttribute('data-mode', modo);

    document.querySelectorAll('.modo-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.modo === modo);
    });

    const modoLabel = modo === 'pessoal' ? 'Modo Pessoal' : 'Modo Negócio';
    const headerLabel = document.getElementById('modo-label-header');
    if (headerLabel) headerLabel.textContent = `— ${modoLabel}`;

    document.querySelectorAll('[data-context]').forEach(group => {
      group.style.display = group.dataset.context === modo ? '' : 'none';
    });

    document.querySelectorAll('.nav-group').forEach(g => g.classList.remove('open'));
    const firstGroup = document.querySelector(`[data-context="${modo}"]`);
    if (firstGroup) firstGroup.classList.add('open');
  }

  /* Troca de modo com fade 400ms + position memory + toast — chamado pelo usuário */
  function toggleModo(modo) {
    if (!['pessoal', 'negocio'].includes(modo)) modo = 'pessoal';
    const modoAtual = localStorage.getItem('mentor24h_modoAtivo') || 'pessoal';
    if (modo === modoAtual) return;

    const main = document.getElementById('main');
    if (!main) { applyMode(modo); Router.navigate(getHomePage(modo)); return; }

    /* ① Fade-out 160ms */
    main.classList.add('env-transitioning');

    setTimeout(() => {
      /* ② Trocar modo (sync) */
      applyMode(modo);

      /* ③ Botão de modo SEMPRE vai pra home (UX previsível) */
      Router.navigate(getHomePage(modo));

      /* ④ Fade-in 240ms */
      requestAnimationFrame(() => main.classList.remove('env-transitioning'));

      /* ⑤ Toast de confirmação */
      const label = modo === 'pessoal' ? 'Ambiente Pessoal ativado' : 'Ambiente Negócio ativado';
      showToast(label, modo);
    }, 160);
  }

  /* Páginas válidas para cada modo (config/chat-ai/kanban/categorias são compartilhadas) */
  const PAGES_BY_MODE = {
    pessoal: ['dashboard', 'agenda', 'medicamentos', 'tarefas', 'contatos', 'contas', 'transacoes', 'metas'],
    negocio: ['painel', 'clientes', 'produtos', 'vendas', 'estoque'],
  };

  /* Salva a posição atual — só se a página pertencer ao modo ativo */
  function savePosition(modulo) {
    const modo = localStorage.getItem('mentor24h_modoAtivo') || 'pessoal';
    if (!PAGES_BY_MODE[modo]?.includes(modulo)) return;
    localStorage.setItem(`mentor24h_pos_${modo}`, modulo);
  }

  /* Home page de cada modo — usada no clique do botão de modo (UX previsível) */
  function getHomePage(modo) {
    return modo === 'negocio' ? 'painel' : 'dashboard';
  }

  /* Restaura a posição salva — valida que ainda pertence ao modo. Usada APENAS no init/refresh. */
  function restorePosition(modo) {
    const saved = localStorage.getItem(`mentor24h_pos_${modo}`);
    if (saved && PAGES_BY_MODE[modo]?.includes(saved)) return saved;
    localStorage.removeItem(`mentor24h_pos_${modo}`);
    return getHomePage(modo);
  }

  /* Toast de confirmação de troca de modo */
  function showToast(msg, tipo) {
    const container = document.querySelector('.app-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `app-toast app-toast--${tipo}`;
    const icone = tipo === 'pessoal' ? 'user-circle' : 'briefcase';
    toast.innerHTML =
      `<span class="app-toast-icon" data-icon="${icone}" data-size="16"></span>` +
      `<span class="app-toast-text">${msg}</span>`;
    container.appendChild(toast);
    Icons.render();

    setTimeout(() => {
      toast.classList.add('app-toast--saindo');
      setTimeout(() => toast.remove(), 400);
    }, 2500);
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
        'produtos': 'group-negocio', 'vendas': 'group-negocio', 'estoque': 'group-negocio', 'clientes': 'group-negocio',
        'contatos': 'group-organizacao', 'contas': 'group-organizacao', 'transacoes': 'group-organizacao',
        'agenda-hibrida': 'group-organizacao', 'chat-ai': 'group-organizacao', 'medicamentos': 'group-organizacao', 'datas-importantes': 'group-organizacao',
        'tarefas': 'group-produtividade', 'notas': 'group-produtividade', 'habitos': 'group-produtividade',
        'rotinas': 'group-produtividade', 'estudos': 'group-produtividade', 'metas': 'group-produtividade',
      };
      const groupId = groupMap[page];
      if (groupId) {
        document.querySelectorAll('.nav-group').forEach(g => g.classList.remove('open'));
        document.getElementById(groupId)?.classList.add('open');
      }
    };

    const originalNavigate = Router.navigate;
    Router.navigate = function(page) {
      savePosition(page);
      openGroupFor(page);
      return originalNavigate.call(Router, page);
    };
  }

  /* ─── Importação automática dos dados do Léo (única vez, só sem usuário cloud) ─── */
  function importarDadosLeo() {
    /* Multi-usuário: com usuário na nuvem, os dados vêm do Cloud, nunca do seed do Léo */
    if (window.Cloud && Cloud.getUserId()) return;
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
    const avatarKey = cfg.avatar || (window.Avatars && Avatars.getDefault()) || 'masc-1';
    Config.syncSidebarAvatar(avatarKey, cfg.nomeUsuario || 'Você');
  }

  function initSaudacao() {
    const updateGreeting = () => {
      const h = new Date().getHours();
      const cfg = DB.getConfig();
      const nome = cfg.nomeUsuario ? cfg.nomeUsuario.split(' ')[0] : 'Léo';
      let saudacao;
      if (h >= 5 && h < 12) {
        saudacao = `Bom dia, ${nome}!`;
      } else if (h >= 12 && h < 18) {
        saudacao = `Boa tarde, ${nome}!`;
      } else {
        saudacao = `Boa noite, ${nome}!`;
      }
      const span = document.getElementById('sidebar-saudacao');
      if (span) span.textContent = saudacao;
    };
    updateGreeting();
    setInterval(updateGreeting, 3600000);
  }

  function initSidebar() {
    /* Restaurar estado de collapse do localStorage */
    const isCollapsed = localStorage.getItem('mentor24h_sidebarColapsada') === '1';
    const sb = document.getElementById('sidebar');
    if (isCollapsed && sb) {
      sb.classList.add('collapsed');
      document.body.classList.add('sidebar-colapsada');
    }
    /* Sincronizar aria-expanded no toggle externo */
    const toggleBtnInit = document.getElementById('sidebar-toggle');
    if (toggleBtnInit) {
      toggleBtnInit.setAttribute('aria-expanded', String(!isCollapsed));
    }

    /* Botão collapse legado (dentro do footer) */
    const btn = document.getElementById('btn-collapse');
    if (btn) btn.addEventListener('click', toggleSidebar);

    /* Novo sidebar-toggle externo (fora do sidebar-inner) */
    const toggleBtn = document.getElementById('sidebar-toggle');
    if (toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);

    /* Hamburger mobile */
    const mobileBtn = document.getElementById('btn-mobile-menu');
    if (mobileBtn) mobileBtn.addEventListener('click', toggleMobileSidebar);

    /* Overlay — fecha drawer mobile */
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
    const isCollapsed = sb.classList.toggle('collapsed');
    document.body.classList.toggle('sidebar-colapsada', isCollapsed);
    localStorage.setItem('mentor24h_sidebarColapsada', isCollapsed ? '1' : '0');

    /* Atualizar ícone do botão legado */
    const btn = document.getElementById('btn-collapse');
    if (btn) {
      btn.innerHTML = Icons.html(isCollapsed ? 'panel-left-open' : 'panel-left-close', 16);
    }

    /* Atualizar aria-expanded no novo sidebar-toggle externo */
    const toggleBtn = document.getElementById('sidebar-toggle');
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', String(!isCollapsed));
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
    'painel': 'vendas', 'produtos': 'vendas', 'vendas': 'vendas', 'estoque': 'vendas', 'clientes': 'vendas',
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
    Router.register('dashboard',  () => DashboardPessoal.render());
    Router.register('painel',     () => Painel.render());
    Router.register('contas',     () => Contas.render());
    Router.register('transacoes', () => Transacoes.render());
    Router.register('metas',      () => Metas.render());
    Router.register('kanban',     () => Kanban.render());
    Router.register('categorias', () => Categorias.render());
    Router.register('config',     () => { Config.render(); LLM.renderConfig(); Notifications.renderButton('notif-btn-area'); });
    Router.register('chat-ai',    () => LLM.render());
    Router.register('chat-wa',    () => ChatWA.render());
    Router.register('agenda',     () => Agenda.render());
    Router.register('medicamentos', () => Medicamentos.render());
    Router.register('tarefas',    () => Tarefas.render());
    Router.register('contatos',   () => Contatos.render());
    Router.register('produtos',   () => Produtos.render());
    Router.register('vendas',     () => Vendas.render());
    Router.register('estoque',         () => Estoque.render());
    Router.register('clientes',        () => Clientes.render());
    Router.register('agenda-hibrida',  () => AgendaHibrida.render());
    Router.register('habitos',         () => Habitos.render());
    Router.register('notas',           () => Notas.render());
    Router.register('relatorios',      () => Relatorios.render());
    Router.register('datas-importantes', () => DatasImportantes.render());
    Router.register('rotinas',           () => Rotinas.render());
    Router.register('estudos',           () => Estudos.render());
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

    /* Abrir/fechar painel — posiciona via fixed para funcionar dentro da sidebar */
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = panel.classList.contains('open');
      if (!isOpen) {
        const rect = toggleBtn.getBoundingClientRect();
        const panelW = 240;
        let left = rect.right + 8;
        if (left + panelW > window.innerWidth) left = rect.left - panelW - 8;
        panel.style.top  = `${rect.top}px`;
        panel.style.left = `${Math.max(8, left)}px`;
      }
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

document.addEventListener('DOMContentLoaded', async () => {
  const loggedIn = await Cloud.init();
  if (loggedIn) {
    await Cloud.loadUserData();
  } else {
    await Auth.requireLogin();   // exibe tela de login; resolve após autenticar
  }
  App.init();
  Cloud.syncAll();
});
