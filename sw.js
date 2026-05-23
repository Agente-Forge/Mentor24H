/* ═══════════════════════════════════════════════════════════
   SERVICE WORKER — Cache-First, Offline-First
   Mentor24h | Forge v5.2 | Sprint 1

   Caminhos relativos → funciona em qualquer subpasta
   (GitHub Pages /controle-financeiro-v2/ ou Live Server /)
═══════════════════════════════════════════════════════════ */

const CACHE_NAME = 'mentor24h-v7';

const ASSETS = [
  './',
  './index.html',
  /* CSS */
  './css/tokens.css',
  './css/base.css',
  './css/layout.css',
  './css/bento.css',
  './css/components.css',
  './css/pages.css',
  './css/motion.css',
  './css/negocio.css',
  './css/themes.css',
  './css/sidebar.css',
  './css/dashboard-pessoal.css',
  './css/painel-negocio.css',
  './css/medicamentos.css',
  /* JS — core */
  './js/supabase.min.js',
  './js/cloud.js',
  './js/icons.js',
  './js/utils.js',
  './js/avatars.js',
  './js/db.js',
  './js/repository.js',
  './js/toast.js',
  './js/theme.js',
  './js/router.js',
  './js/charts.js',
  './js/modal.js',
  /* JS — módulos Sprint 1 + 2 */
  './js/modules/painel.js',
  './js/modules/dashboard-pessoal.js',
  './js/modules/timeline.js',
  './js/modules/agenda-hibrida.js',
  './js/modules/habitos.js',
  './js/modules/notas.js',
  './js/dashboard.js',
  './js/contas.js',
  './js/transacoes.js',
  './js/metas.js',
  './js/kanban.js',
  './js/categorias.js',
  './js/config.js',
  './js/llm-tools.js',
  './js/llm.js',
  './js/chat-wa.js',
  './js/agenda.js',
  './js/medicamentos.js',
  './js/tarefas.js',
  './js/contatos.js',
  './js/produtos.js',
  './js/vendas.js',
  './js/estoque.js',
  './js/clientes.js',
  './js/command-palette.js',
  './js/leo-data.js',
  './js/app.js',
  './js/notifications.js',
  './js/sidebar-dot.js',
  /* Dados */
  './manifest.json',
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
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      });
    })
  );
});

const SB_URL = 'https://qrnvykzozbnqmvicscbr.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFybnZ5a3pvemJucW12aWNzY2JyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0Nzk5NDQsImV4cCI6MjA5NTA1NTk0NH0.j_2HUS_UFLbW57_LzEUplehRp1lmhQdiNS889KcR5lg';

/* ─── Push: notificação de medicamento com botões de ação ─── */
self.addEventListener('push', event => {
  let data = { title: 'Mentor24h', body: 'Nova notificação', tag: 'default', data: {} };
  try { if (event.data) data = { ...data, ...event.data.json() }; } catch (_) {
    try { if (event.data) data.body = event.data.text(); } catch (_) {}
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: './favicon.svg',
      badge: './favicon.svg',
      tag: data.tag,
      renotify: true,
      data: data.data || {},
      actions: [
        { action: 'taken', title: '✅ Tomei' },
        { action: 'snooze', title: '⏰ +30min' },
        { action: 'ignore', title: '✖ Ignorar' },
      ],
    })
  );
});

/* ─── Clique na notificação ou em um botão de ação ─── */
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const action   = event.action;
  const payload  = event.notification.data || {};
  const doseId   = payload.dose_id;
  const userId   = payload.user_id;
  const medId    = payload.med_id;

  if (action === 'taken' && doseId) {
    event.waitUntil(
      fetch(`${SB_URL}/rest/v1/dose_logs`, {
        method: 'POST',
        headers: {
          'apikey': SB_KEY,
          'Authorization': `Bearer ${SB_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=ignore-duplicates,return=minimal',
        },
        body: JSON.stringify({ dose_id: doseId, user_id: userId, med_id: medId, taken_at: new Date().toISOString() }),
      }).catch(() => {})
    );
  } else if (action === 'snooze' && doseId) {
    const snoozeUntil = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    event.waitUntil(
      fetch(`${SB_URL}/rest/v1/dose_snoozes`, {
        method: 'POST',
        headers: {
          'apikey': SB_KEY,
          'Authorization': `Bearer ${SB_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=ignore-duplicates,return=minimal',
        },
        body: JSON.stringify({ dose_id: doseId, user_id: userId, snooze_until: snoozeUntil }),
      }).catch(() => {})
    );
  }
  /* ignore → apenas fecha a notificação (já feito acima) */
});

/* ─── Message: controle externo ─── */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
