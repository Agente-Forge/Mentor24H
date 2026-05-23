/* ═══════════════════════════════════════════════════════════
   NOTIFICATIONS — Web Push subscription layer
   Mentor24h | Lembretes de medicamentos
═══════════════════════════════════════════════════════════ */

const Notifications = (() => {
  const VAPID_PUBLIC_KEY = 'BLdSTOUqGlAuOTb5W55jq31OFxWJFfHvFVvgNp8PJBA6U5faLFwKErUglTcvLtAyK-0YSdgX5fX0s3OiRTaDX3A';

  function _b64ToUint8(b64) {
    const pad = '='.repeat((4 - b64.length % 4) % 4);
    const raw = atob((b64 + pad).replace(/-/g, '+').replace(/_/g, '/'));
    return Uint8Array.from(raw, c => c.charCodeAt(0));
  }

  function supported() {
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  }

  /* serviceWorker.ready trava para sempre se o SW não ativar — limita a 5s */
  function _swReady(timeoutMs = 5000) {
    return Promise.race([
      navigator.serviceWorker.ready,
      new Promise((_, rej) => setTimeout(() => rej(new Error('SW timeout')), timeoutMs)),
    ]);
  }

  async function status() {
    if (!supported()) return 'unsupported';
    const reg = await _swReady().catch(() => null);
    if (!reg) return 'no-sw';
    const sub = await reg.pushManager.getSubscription().catch(() => null);
    if (sub && Notification.permission === 'granted') return 'active';
    return Notification.permission;
  }

  async function activate() {
    if (!supported()) {
      Toast.error('Não suportado', 'Seu navegador não suporta notificações push.');
      return false;
    }
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') {
      Toast.warn('Permissão negada', 'Habilite nas configurações do navegador.');
      return false;
    }
    try {
      const reg = await _swReady(10000);
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: _b64ToUint8(VAPID_PUBLIC_KEY),
      });
      const userId = Cloud.getUserId();
      if (!userId) throw new Error('Sem usuário');
      const { error } = await Cloud.db().from('push_subscriptions').insert({
        user_id: userId,
        subscription: sub.toJSON(),
        device_name: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'Celular' : 'Computador',
        timezone_offset: -new Date().getTimezoneOffset(),
      });
      if (error && !/duplicate|unique|already exists/i.test(error.message)) throw error;
      Toast.success('Lembretes ativados!', 'Você receberá avisos nos horários dos remédios.');
      return true;
    } catch (e) {
      console.error('[Notifications] activate:', e);
      Toast.error('Erro ao ativar', e.message || 'Tente novamente.');
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
      await Cloud.db().from('push_subscriptions').delete().eq('subscription->>endpoint', endpoint);
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
    const isUnsupported = s === 'unsupported';

    if (isUnsupported) {
      el.innerHTML = `<div class="cfg-action-row" style="opacity:.6;cursor:default">
           <span class="cfg-action-icon" style="background:rgba(239,68,68,.15)">🔕</span>
           <div class="cfg-action-info">
             <span class="cfg-action-label">Não suportado</span>
             <span class="cfg-action-sub">Este navegador não suporta notificações push</span>
           </div>
         </div>`;
    } else if (isDenied) {
      el.innerHTML = `<div class="cfg-action-row" style="opacity:.6;cursor:default">
           <span class="cfg-action-icon" style="background:rgba(239,68,68,.15)">🔕</span>
           <div class="cfg-action-info">
             <span class="cfg-action-label">Notificações bloqueadas</span>
             <span class="cfg-action-sub">Permita nas configurações do navegador</span>
           </div>
         </div>`;
    } else if (isActive) {
      el.innerHTML = `<button id="notif-deactivate-btn" class="cfg-action-row">
           <span class="cfg-action-icon" style="background:rgba(212,165,116,.15)">🔔</span>
           <div class="cfg-action-info">
             <span class="cfg-action-label">Lembretes ativos</span>
             <span class="cfg-action-sub">Toque para desativar</span>
           </div>
         </button>`;
      el.querySelector('#notif-deactivate-btn').addEventListener('click', async () => {
        await deactivate();
        renderButton(containerId);
      });
    } else {
      el.innerHTML = `<button id="notif-activate-btn" class="cfg-action-row">
           <span class="cfg-action-icon cfg-icon-amber">🔔</span>
           <div class="cfg-action-info">
             <span class="cfg-action-label">Ativar lembretes de remédios</span>
             <span class="cfg-action-sub">Receba avisos no horário de cada dose</span>
           </div>
           <span data-icon="chevron-right" data-size="14" class="cfg-action-arrow"></span>
         </button>`;
      el.querySelector('#notif-activate-btn').addEventListener('click', async () => {
        const ok = await activate();
        if (ok) renderButton(containerId);
      });
    }

    Icons.render(el);
  }

  return { activate, deactivate, status, supported, renderButton };
})();
