/* ═══════════════════════════════════════════════════════════
   UTILS — Formatting, dates, helpers
═══════════════════════════════════════════════════════════ */

const Utils = (() => {
  const MOEDA_SYMBOL = { BRL: 'R$', USD: '$', EUR: '€' };

  function formatCurrency(value, moeda) {
    const cfg = window.DB?.getConfig?.() || { moeda: 'BRL' };
    const m = moeda || cfg.moeda || 'BRL';
    try {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: m,
        minimumFractionDigits: 2,
      }).format(Number(value) || 0);
    } catch {
      return `${MOEDA_SYMBOL[m] || 'R$'} ${(Number(value) || 0).toFixed(2)}`;
    }
  }

  function formatNumber(value) {
    return new Intl.NumberFormat('pt-BR').format(Number(value) || 0);
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = parseISO(dateStr);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function formatDateShort(dateStr) {
    if (!dateStr) return '—';
    const d = parseISO(dateStr);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  }

  function formatDateLong(dateStr) {
    if (!dateStr) return '—';
    const d = parseISO(dateStr);
    return d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  }

  function formatRelative(dateStr) {
    if (!dateStr) return '—';
    const today = startOfDay(new Date());
    const d = startOfDay(parseISO(dateStr));
    const diff = Math.round((d - today) / 86400000);
    if (diff === 0) return 'Hoje';
    if (diff === 1) return 'Amanhã';
    if (diff === -1) return 'Ontem';
    if (diff > 0 && diff <= 7) return `Em ${diff} dias`;
    if (diff < 0 && diff >= -7) return `${Math.abs(diff)} dias atrás`;
    return formatDate(dateStr);
  }

  function parseISO(s) {
    if (s instanceof Date) return s;
    if (typeof s !== 'string') return new Date(s);
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(s + 'T00:00:00');
    return new Date(s);
  }

  function startOfDay(d) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }

  function todayISO() {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }

  function addDays(dateStr, n) {
    const d = parseISO(dateStr);
    d.setDate(d.getDate() + n);
    return d.toISOString().split('T')[0];
  }

  function getMonthRange(offset = 0) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + offset);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end   = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return {
      start: start.toISOString().split('T')[0],
      end:   end.toISOString().split('T')[0],
      monthName: start.toLocaleDateString('pt-BR', { month: 'long' }),
      monthShort: start.toLocaleDateString('pt-BR', { month: 'short' }),
    };
  }

  function getWeekRange() {
    const d = new Date();
    const day = d.getDay();
    const diffStart = d.getDate() - day + (day === 0 ? -6 : 1);
    const start = new Date(d);
    start.setDate(diffStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return {
      start: start.toISOString().split('T')[0],
      end:   end.toISOString().split('T')[0],
    };
  }

  function daysBetween(startStr, endStr) {
    const s = parseISO(startStr);
    const e = parseISO(endStr);
    return Math.max(1, Math.round((e - s) / 86400000) + 1);
  }

  function daysUntil(endStr) {
    if (!endStr) return 0;
    const today = startOfDay(new Date());
    const end   = startOfDay(parseISO(endStr));
    return Math.max(0, Math.round((end - today) / 86400000));
  }

  function isOverdue(dateStr) {
    if (!dateStr) return false;
    return dateStr < todayISO();
  }

  function urgencyOf(dateStr, status) {
    if (status === 'paga') return 'green';
    if (!dateStr) return 'muted';
    if (dateStr < todayISO()) return 'red';
    const d = daysUntil(dateStr);
    if (d <= 3) return 'red';
    if (d <= 7) return 'amber';
    return 'muted';
  }

  function urgencyLabel(dateStr, status) {
    if (status === 'paga') return 'Paga';
    if (!dateStr) return '—';
    if (dateStr < todayISO()) return `Atrasada ${Math.abs(daysUntil(dateStr) - daysBetween(dateStr, todayISO()) + 1)} d`;
    const d = daysUntil(dateStr);
    if (d === 0) return 'Vence hoje';
    if (d === 1) return 'Vence amanhã';
    if (d <= 7) return `Vence em ${d}d`;
    return formatDateShort(dateStr);
  }

  function nextRecurrence(dateStr, intervalo) {
    const d = parseISO(dateStr);
    switch (intervalo) {
      case 'diario':    d.setDate(d.getDate() + 1); break;
      case 'semanal':   d.setDate(d.getDate() + 7); break;
      case 'quinzenal': d.setDate(d.getDate() + 15); break;
      case 'mensal':    d.setMonth(d.getMonth() + 1); break;
      case 'anual':     d.setFullYear(d.getFullYear() + 1); break;
      default: break;
    }
    return d.toISOString().split('T')[0];
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function pct(part, total) {
    if (!total) return 0;
    return clamp((part / total) * 100, 0, 100);
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
  }

  function escapeHtml(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function debounce(fn, wait = 250) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  function animateCount(el, from, to, duration = 800, isCurrency = true) {
    if (!el) return;
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = from + (to - from) * eased;
      el.textContent = isCurrency ? formatCurrency(current) : formatNumber(Math.round(current));
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function capitalize(s) {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  return {
    formatCurrency, formatNumber,
    formatDate, formatDateShort, formatDateLong, formatRelative,
    parseISO, startOfDay, todayISO, addDays,
    getMonthRange, getWeekRange,
    daysBetween, daysUntil, isOverdue,
    urgencyOf, urgencyLabel,
    nextRecurrence,
    clamp, pct, uid, escapeHtml, debounce,
    animateCount, capitalize,
  };
})();

const fmt = Utils.formatCurrency;
const todayISO = Utils.todayISO;
const esc = Utils.escapeHtml;
