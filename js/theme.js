/* ═══════════════════════════════════════════════════════════
   THEME — Dark/Light toggle with persistence
═══════════════════════════════════════════════════════════ */

const Theme = (() => {
  function get() { return DB.getConfig().tema || 'dark'; }

  function set(t) {
    document.documentElement.setAttribute('data-theme', t);
    DB.saveConfig({ tema: t });
    const input = document.getElementById('theme-input');
    if (input) input.checked = (t === 'light');
    const themeIcon = document.querySelector('.theme-toggle-row [data-icon]');
    if (themeIcon) {
      themeIcon.setAttribute('data-icon', t === 'light' ? 'sun' : 'moon');
      Icons.render(themeIcon.closest('.theme-toggle-row'));
    }
    setTimeout(() => {
      const page = window.Router?.getCurrent?.();
      if (page === 'dashboard' && window.Dashboard) Dashboard.render();
    }, 50);
  }

  function toggle() {
    set(get() === 'dark' ? 'light' : 'dark');
  }

  function init() {
    const t = get();
    document.documentElement.setAttribute('data-theme', t);
    const input = document.getElementById('theme-input');
    if (input) {
      input.checked = (t === 'light');
      input.addEventListener('change', toggle);
    }
    const themeIcon = document.querySelector('.theme-toggle-row [data-icon]');
    if (themeIcon) themeIcon.setAttribute('data-icon', t === 'light' ? 'sun' : 'moon');
  }

  return { get, set, toggle, init };
})();
