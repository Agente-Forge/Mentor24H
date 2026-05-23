/* ═══════════════════════════════════════════════════════════
   NOTIFICATIONS — Web Push subscription layer
   Mentor24h | Lembretes de medicamentos
═══════════════════════════════════════════════════════════ */

const Notifications = (() => {
  const VAPID_PUBLIC_KEY = 'LZMhhj7o6AGJ5azEh8G5LLDnDAR1DAaPhJxevFtoWryxoV2BAyzwRCx2GNK5d9bRH5bci5-azXyU1lyNB9UZ0A';
  const SB_URL = 'https://qrnvykzozbnqmvicscbr.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFybnZ5a3pvemJucW12aWNzY2JyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0Nzk5NDQsImV4cCI6MjA5NTA1NTk0NH0.j_2HUS_UFLbW57_LzEUplehRp1lmhQdiNS889KcR5lg';

  function _b64ToUint8(b64) {
    const pad = '='.repeat((4 - b64.length % 4) % 4);
    const raw = atob((b64 + pad).replace(/-/g, '+').replace(/_/g, '/'));
    return Uint8Array.from(raw, c => c.charCodeAt(0));
  }

  async function supported() {
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  }

  async function status() {
    if (!await supported()) return 'unsupported';
    const reg = await navigator.serviceWorker.ready.catch(() => null);
    if (!reg) return 'no-sw';
    const sub = await reg.pushManager.getSubscription().catch(() => null);
    if (sub && Notification.permission === 'granted') return 'active';
    return Notification.permission;
  }

  async function activate() {
    if (!await supported()) {
      Toast.error('Não suportado', 'Seu navegador não suporta notificações push.');
      return false;
    }
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') {
      Toast.warn('Permissão negada', 'Habilite nas configurações do navegador.');
      return false;
    }
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: _b64ToUint8(VAPID_PUBLIC_KEY),
      });
      const userId = Cloud.getUserId();
      if (!userId) throw new Error('Sem usuário');
      const res = await fetch(`${SB_URL}/rest/v1/push_subscriptions`, {
        method: 'POST',
        headers: {
          'apikey': SB_KEY,
          'Authorization': `Bearer ${SB_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=ignore-duplicates,return=minimal',
        },
        body: JSON.stringify({
          user_id: userId,
          subscription: sub.toJSON(),
          device_name: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'Celular' : 'Computador',
          timezone_offset: -new Date().getTimezoneOffset(),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      Toast.success('Lembretes ativados!', 'Você receberá avisos nos horários dos remédios.');
      return true;
    } catch (e) {
      console.error('[Notifications] activate:', e);
      Toast.error('Erro ao ativar', 'Tente novamente.');
      return false;
    }
  }

  async function deactivate() {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (!sub) return;
      const endpoint = sub.endpoint;
      await sub.unsubscribe();
      await fetch(`${SB_URL}/rest/v1/push_subscriptions?select=id`, {
        method: 'DELETE',
        headers: {
          'apikey': SB_KEY,
          'Authorization': `Bearer ${SB_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      Toast.info('Lembretes desativados');
    } catch (e) {
      console.error('[Notifications] deactivate:', e);
    }
  }

  async function renderButton(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const s = await status();
    const isActive = s === 'active';
    const isDenied = s === 'denied';
    el.innerHTML = isDenied
      ? `<div class="cfg-action-row" style="opacity:.6;cursor:default">
           <span class="cfg-action-icon" style="background:rgba(239,68,68,.15)">🔕</span>
           <div class="cfg-action-info">
             <span class="cfg-action-label">Notificações bloqueadas</span>
             <span class="cfg-action-sub">Permita nas configurações do navegador</span>
           </div>
         </div>`
      : isActive
      ? `<button class="cfg-action-row" onclick="Notifications.deactivate().then(()=>Notifications.renderButton('notif-btn-area'))">
           <span class="cfg-action-icon" style="background:rgba(212,165,116,.15)">🔔</span>
           <div class="cfg-action-info">
             <span class="cfg-action-label">Lembretes ativos</span>
             <span class="cfg-action-sub">Toque para desativar</span>
           </div>
         </button>`
      : `<button class="cfg-action-row" onclick="Notifications.activate().then(()=>Notifications.renderButton('notif-btn-area'))">
           <span class="cfg-action-icon cfg-icon-amber">🔔</span>
           <div class="cfg-action-info">
             <span class="cfg-action-label">Ativar lembretes de remédios</span>
             <span class="cfg-action-sub">Receba avisos no horário de cada dose</span>
           </div>
           <span data-icon="chevron-right" data-size="14" class="cfg-action-arrow"></span>
         </button>`;
    Icons.render();
  }

  return { activate, deactivate, status, supported, renderButton };
})();
