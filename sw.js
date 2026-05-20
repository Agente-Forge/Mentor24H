/* ═══════════════════════════════════════════════════════════
   SERVICE WORKER — Cache-First, Offline-First
   Mentor24h | Forge v5.2 | Sprint 1

   Arquitetura agnóstica: push virá de Supabase no futuro.
   O SW já tem o hook push definido — sem lógica acoplada.
═══════════════════════════════════════════════════════════ */

const CACHE_NAME = 'mentor24h-v1';

const ASSETS = [
  '/',
  '/index.html',
  /* CSS */
  '/css/tokens.css',
  '/css/base.css',
  '/css/layout.css',
  '/css/bento.css',
  '/css/components.css',
  '/css/pages.css',
  '/css/motion.css',
  '/css/negocio.css',
  '/css/themes.css',
  '/css/sidebar.css',
  '/css/dashboard-pessoal.css',
  '/css/painel-negocio.css',
  /* JS — core */
  '/js/icons.js',
  '/js/utils.js',
  '/js/avatars.js',
  '/js/db.js',
  '/js/repository.js',
  '/js/toast.js',
  '/js/theme.js',
  '/js/router.js',
  '/js/charts.js',
  '/js/modal.js',
  /* JS — módulos */
  '/js/modules/painel.js',
  '/js/modules/dashboard-pessoal.js',
  '/js/modules/timeline.js',
  '/js/dashboard.js',
  '/js/contas.js',
  '/js/transacoes.js',
  '/js/metas.js',
  '/js/kanban.js',
  '/js/categorias.js',
  '/js/config.js',
  '/js/llm-tools.js',
  '/js/llm.js',
  '/js/chat-wa.js',
  '/js/agenda.js',
  '/js/medicamentos.js',
  '/js/tarefas.js',
  '/js/contatos.js',
  '/js/produtos.js',
  '/js/vendas.js',
  '/js/estoque.js',
  '/js/clientes.js',
  '/js/command-palette.js',
  '/js/leo-data.js',
  '/js/app.js',
  '/js/sidebar-dot.js',
  /* Dados */
  '/manifest.json',
];

/* ─── Install: pré-cachear todos os assets ─── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

/* ─── Activate: limpar caches antigos ─── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

/* ─── Fetch: cache-first, fallback para rede ─── */
self.addEventListener('fetch', event => {
  /* Ignorar requisições externas (fontes Google, APIs LLM) */
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        /* Não cachear respostas de erro */
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      });
    })
  );
});

/* ─── Message: cliente pede verificação de update ─── */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/* ─── Push: hook agnóstico (Supabase vai preencher no futuro) ─── */
self.addEventListener('push', event => {
  if (!event.data) return;
  let payload = {};
  try { payload = event.data.json(); } catch (_) {
    payload = { title: 'Mentor24h', body: event.data.text() };
  }
  event.waitUntil(
    self.registration.showNotification(payload.title || 'Mentor24h', {
      body: payload.body || '',
      icon: '/manifest.json',
      data: payload.data || {},
    })
  );
});
