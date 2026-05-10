/* ═══════════════════════════════════════════════════════════
   TOAST — Notification system
═══════════════════════════════════════════════════════════ */

const Toast = (() => {
  function root() { return document.getElementById('toast-root'); }

  function show(title, desc = '', type = 'info', duration = 4000) {
    const r = root();
    if (!r) return;

    const el = document.createElement('div');
    el.className = `toast toast-${type}`;

    const iconMap = {
      success: 'check-circle',
      error:   'alert-circle',
      warning: 'alert-triangle',
      info:    'sparkles',
    };

    el.innerHTML = `
      <div class="toast-icon">${Icons.html(iconMap[type] || 'sparkles', 16)}</div>
      <div class="toast-content">
        <div class="toast-title">${esc(title)}</div>
        ${desc ? `<div class="toast-desc">${esc(desc)}</div>` : ''}
      </div>
      <button class="modal-close" style="background:transparent;border:none;width:24px;height:24px;color:var(--text-4)" aria-label="Fechar">${Icons.html('x', 12)}</button>
      <div class="toast-progress" style="animation-duration:${duration}ms"></div>
    `;

    el.querySelector('.modal-close').addEventListener('click', () => remove(el));
    r.appendChild(el);

    setTimeout(() => remove(el), duration);
  }

  function remove(el) {
    if (!el || !el.parentNode) return;
    el.classList.add('removing');
    setTimeout(() => el.remove(), 250);
  }

  function success(title, desc) { show(title, desc, 'success'); }
  function error(title, desc)   { show(title, desc, 'error'); }
  function warning(title, desc) { show(title, desc, 'warning'); }
  function info(title, desc)    { show(title, desc, 'info'); }

  function confetti() {
    const stage = document.createElement('div');
    stage.className = 'confetti-stage';
    document.body.appendChild(stage);
    const colors = ['#A78BFA', '#F472B6', '#FBBF24', '#5EE39A', '#7BB6FF', '#FF6B7A', '#FB923C'];
    for (let i = 0; i < 90; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      p.style.cssText = `
        left: ${Math.random() * 100}vw;
        width: ${5 + Math.random() * 7}px;
        height: ${8 + Math.random() * 10}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation-duration: ${1.6 + Math.random() * 2}s;
        animation-delay: ${Math.random() * 0.4}s;
      `;
      stage.appendChild(p);
    }
    setTimeout(() => stage.remove(), 4500);
  }

  return { show, success, error, warning, info, confetti };
})();
