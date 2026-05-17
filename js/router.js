/* ═══════════════════════════════════════════════════════════
   ROUTER — SPA-style navigation
═══════════════════════════════════════════════════════════ */

const Router = (() => {
  const PAGES = {
    dashboard:      { title: 'Visão geral do',  em: 'dia',            icon: 'layout-dashboard' },
    'chat-ai':      { title: 'Chat',            em: 'inteligente',    icon: 'bot' },
    'chat-wa':      { title: 'Chat',            em: 'WhatsApp',       icon: 'message-circle' },
    produtos:       { title: 'Meus',            em: 'produtos',       icon: 'package' },
    vendas:         { title: 'Minhas',          em: 'vendas',         icon: 'shopping-cart' },
    estoque:        { title: 'Controle de',     em: 'estoque',        icon: 'archive' },
    clientes:       { title: 'Meus',            em: 'clientes',       icon: 'users' },
    contas:         { title: 'Suas',            em: 'contas',         icon: 'receipt' },
    transacoes:     { title: 'Histórico de',    em: 'transações',     icon: 'arrow-left-right' },
    metas:          { title: 'Caixinhas de',    em: 'poupança',       icon: 'target' },
    agenda:         { title: 'Minha',           em: 'agenda',         icon: 'calendar' },
    medicamentos:   { title: 'Meus',            em: 'medicamentos',   icon: 'pill' },
    tarefas:        { title: 'Minhas',          em: 'tarefas',        icon: 'check-square' },
    contatos:       { title: 'Meus',            em: 'contatos',       icon: 'users' },
    kanban:         { title: 'Quadro',          em: 'kanban',         icon: 'columns-3' },
    categorias:     { title: 'Suas',            em: 'categorias',     icon: 'folder-open' },
    painel:         { title: 'Painel',           em: 'Executivo',      icon: 'bar-chart-2' },
    config:         { title: 'Ajustar',         em: 'preferências',   icon: 'settings-2' },
  };

  let current = 'dashboard';
  const renderers = {};

  function register(page, fn) { renderers[page] = fn; }

  function navigate(page) {
    if (!PAGES[page]) page = 'dashboard';

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    const pageEl = document.querySelector(`[data-page="${page}"]`);
    if (pageEl) pageEl.classList.add('active');

    const navEl = document.querySelector(`[data-nav="${page}"]`);
    if (navEl) navEl.classList.add('active');

    const cfg = PAGES[page];
    const titleEl = document.getElementById('topbar-title-text');
    const emEl    = document.getElementById('topbar-title-em');
    const crumbEl = document.getElementById('topbar-crumb');
    if (titleEl) titleEl.textContent = cfg.title + ' ';
    if (emEl)    emEl.textContent = cfg.em;
    if (crumbEl) crumbEl.textContent = page;

    current = page;

    /* Sincroniza bottom nav mobile */
    if (typeof App !== 'undefined' && App.syncBottomNav) App.syncBottomNav(page);

    requestAnimationFrame(() => {
      if (renderers[page]) {
        try { renderers[page](); } catch(e) { console.error(`Render failed for ${page}:`, e); }
      }
      Icons.render(pageEl);
    });
  }

  function getCurrent() { return current; }

  function init() {
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', () => Router.navigate(el.dataset.nav));
    });
    Router.navigate('dashboard');
  }

  return { register, navigate, getCurrent, init, PAGES };
})();
