/* ═══════════════════════════════════════════════════════════
   CHARTS — Custom SVG charts (zero dependency on Chart.js)
   Bespoke, premium, animated, themable
═══════════════════════════════════════════════════════════ */

const Charts = (() => {
  const instances = new Map();

  function colors() {
    const cs = getComputedStyle(document.documentElement);
    return {
      text2:    cs.getPropertyValue('--text-2').trim(),
      text3:    cs.getPropertyValue('--text-3').trim(),
      text4:    cs.getPropertyValue('--text-4').trim(),
      surface3: cs.getPropertyValue('--surface-3').trim(),
      surface4: cs.getPropertyValue('--surface-4').trim(),
      line2:    cs.getPropertyValue('--line-2').trim(),
      violet:   cs.getPropertyValue('--violet').trim(),
      magenta:  cs.getPropertyValue('--magenta').trim(),
      amber:    cs.getPropertyValue('--amber').trim(),
      green:    cs.getPropertyValue('--green').trim(),
      red:      cs.getPropertyValue('--red').trim(),
      blue:     cs.getPropertyValue('--blue').trim(),
    };
  }

  /* ─── DONUT (categorias) ─── */
  function donut(containerId, data, options = {}) {
    const el = document.getElementById(containerId);
    if (!el) return;

    if (!data.length || data.every(d => d.value === 0)) {
      el.innerHTML = `<div class="empty"><div class="empty-icon">${Icons.html('chart-pie', 22)}</div><h4>Sem dados</h4><p>Adicione contas pagas para ver a distribuição.</p></div>`;
      return;
    }

    const total = data.reduce((s, d) => s + d.value, 0);
    const c = colors();
    const w = Math.max(el.clientWidth || 0, el.parentElement?.clientWidth || 0, 280);
    const h = Math.max(el.clientHeight || 0, 220);
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) / 2 - 12;
    const inner = radius * 0.62;

    let cumulative = 0;
    const segs = data.map(d => {
      const start = cumulative / total;
      const end   = (cumulative + d.value) / total;
      cumulative += d.value;
      return Object.assign({}, d, { start, end });
    });

    function arc(s, e, r, ri) {
      if (e - s >= 0.99999) e = s + 0.99999;
      const sa = s * Math.PI * 2 - Math.PI / 2;
      const ea = e * Math.PI * 2 - Math.PI / 2;
      const x1 = cx + Math.cos(sa) * r;
      const y1 = cy + Math.sin(sa) * r;
      const x2 = cx + Math.cos(ea) * r;
      const y2 = cy + Math.sin(ea) * r;
      const xi1 = cx + Math.cos(ea) * ri;
      const yi1 = cy + Math.sin(ea) * ri;
      const xi2 = cx + Math.cos(sa) * ri;
      const yi2 = cy + Math.sin(sa) * ri;
      const large = (e - s) > 0.5 ? 1 : 0;
      return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi1} ${yi1} A ${ri} ${ri} 0 ${large} 0 ${xi2} ${yi2} Z`;
    }

    const svg = `
      <svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" style="overflow:visible">
        <defs>
          ${segs.map((s, i) => `
            <linearGradient id="${containerId}-g${i}" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="${s.color}" stop-opacity="0.95"/>
              <stop offset="100%" stop-color="${s.color}" stop-opacity="0.7"/>
            </linearGradient>
          `).join('')}
        </defs>
        ${segs.map((s, i) => `
          <path d="${arc(s.start, s.end, radius, inner)}"
            fill="url(#${containerId}-g${i})"
            stroke="${c.surface3}" stroke-width="2"
            data-i="${i}"
            style="opacity:0; transform-origin:${cx}px ${cy}px; animation:donutIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; animation-delay:${i * 60}ms; cursor:pointer; transition:transform 0.25s"
            onmouseenter="this.style.transform='scale(1.04)'"
            onmouseleave="this.style.transform=''"
          />
        `).join('')}
        <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-family="var(--font-display)" font-size="11" font-style="italic" fill="${c.text3}">total</text>
        <text x="${cx}" y="${cy + 18}" text-anchor="middle" font-family="var(--font-display)" font-size="20" fill="${c.text2 || c.text3}" font-variant-numeric="tabular-nums">${Utils.formatCurrency(total)}</text>
      </svg>
      <style>
        @keyframes donutIn { to { opacity: 1; } }
      </style>
    `;

    el.innerHTML = svg;
  }

  /* ─── BARS (fluxo de caixa) ─── */
  function bars(containerId, data, options = {}) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const c = colors();
    const w = Math.max(el.clientWidth || 0, el.parentElement?.clientWidth || 0, 480);
    const h = Math.max(el.clientHeight || 0, 240);
    const padTop = 24, padBot = 36, padLeft = 36, padRight = 12;
    const innerW = w - padLeft - padRight;
    const innerH = h - padTop - padBot;

    const max = Math.max(1, ...data.flatMap(d => [d.entrada || 0, d.saida || 0]));
    const niceMax = Math.ceil(max / 500) * 500;

    const groupW = innerW / data.length;
    const barW = Math.min(18, groupW / 3);

    const labelEl = data[0]?.label;

    const bars = data.map((d, i) => {
      const gx = padLeft + i * groupW + groupW / 2;
      const ent = (d.entrada || 0) / niceMax * innerH;
      const sai = (d.saida || 0) / niceMax * innerH;
      const yEnt = padTop + innerH - ent;
      const ySai = padTop + innerH - sai;
      return `
        <g style="opacity:0; animation:barIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; animation-delay:${i * 80}ms">
          <rect x="${gx - barW - 2}" y="${yEnt}" width="${barW}" height="${ent}" rx="3" fill="url(#${containerId}-grad-ent)"/>
          <rect x="${gx + 2}" y="${ySai}" width="${barW}" height="${sai}" rx="3" fill="url(#${containerId}-grad-sai)"/>
          <text x="${gx}" y="${h - 12}" text-anchor="middle" font-size="10" fill="${c.text4}" font-family="var(--font-mono)">${d.label}</text>
        </g>
      `;
    }).join('');

    const gridLines = [0, 0.25, 0.5, 0.75, 1].map(p => {
      const y = padTop + innerH * (1 - p);
      const v = Math.round(niceMax * p);
      return `
        <line x1="${padLeft}" y1="${y}" x2="${w - padRight}" y2="${y}" stroke="${c.line2}" stroke-dasharray="2 4"/>
        <text x="${padLeft - 4}" y="${y + 3}" text-anchor="end" font-size="9" fill="${c.text4}" font-family="var(--font-mono)">${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}</text>
      `;
    }).join('');

    el.innerHTML = `
      <svg viewBox="0 0 ${w} ${h}" width="100%" height="100%">
        <defs>
          <linearGradient id="${containerId}-grad-ent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${c.green}" stop-opacity="1"/>
            <stop offset="100%" stop-color="${c.green}" stop-opacity="0.4"/>
          </linearGradient>
          <linearGradient id="${containerId}-grad-sai" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${c.red}" stop-opacity="1"/>
            <stop offset="100%" stop-color="${c.red}" stop-opacity="0.4"/>
          </linearGradient>
        </defs>
        ${gridLines}
        ${bars}
      </svg>
      <style>
        @keyframes barIn { to { opacity: 1; } }
      </style>
    `;
  }

  /* ─── LINE (evolução) ─── */
  function line(containerId, data, options = {}) {
    const el = document.getElementById(containerId);
    if (!el) return;

    if (!data.length) {
      el.innerHTML = `<div class="empty"><h4>Sem histórico</h4></div>`;
      return;
    }

    const c = colors();
    const accent = options.color || c.violet;
    const w = el.clientWidth || 400;
    const h = el.clientHeight || 180;
    const padTop = 16, padBot = 24, padLeft = 8, padRight = 8;
    const innerW = w - padLeft - padRight;
    const innerH = h - padTop - padBot;

    const max = Math.max(1, ...data.map(d => d.value));
    const min = Math.min(0, ...data.map(d => d.value));
    const range = max - min || 1;

    const stepX = data.length > 1 ? innerW / (data.length - 1) : innerW;

    const points = data.map((d, i) => ({
      x: padLeft + i * stepX,
      y: padTop + innerH - ((d.value - min) / range) * innerH,
      v: d.value,
      label: d.label,
    }));

    let path = '';
    points.forEach((p, i) => {
      if (i === 0) path += `M ${p.x} ${p.y}`;
      else {
        const prev = points[i - 1];
        const cx1 = prev.x + (p.x - prev.x) / 2;
        const cy1 = prev.y;
        const cx2 = prev.x + (p.x - prev.x) / 2;
        const cy2 = p.y;
        path += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p.x} ${p.y}`;
      }
    });

    const fillPath = path + ` L ${points[points.length-1].x} ${padTop + innerH} L ${points[0].x} ${padTop + innerH} Z`;

    const dots = points.map(p => `
      <circle cx="${p.x}" cy="${p.y}" r="3" fill="${accent}" stroke="${c.surface3}" stroke-width="2"/>
    `).join('');

    el.innerHTML = `
      <svg viewBox="0 0 ${w} ${h}" width="100%" height="100%">
        <defs>
          <linearGradient id="${containerId}-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${accent}" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <path d="${fillPath}" fill="url(#${containerId}-fill)" style="opacity:0;animation:lineIn 0.6s ease forwards"/>
        <path d="${path}" stroke="${accent}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="stroke-dasharray:2000;stroke-dashoffset:2000;animation:lineDraw 1s ease forwards"/>
        ${dots}
      </svg>
      <style>
        @keyframes lineIn { to { opacity: 1; } }
        @keyframes lineDraw { to { stroke-dashoffset: 0; } }
      </style>
    `;
  }

  /* ─── SPARK (mini bar chart) ─── */
  function spark(containerId, data) {
    const el = document.getElementById(containerId);
    if (!el || !data.length) return;
    const c = colors();
    const max = Math.max(1, ...data);
    el.innerHTML = `
      <div class="spark-row">
        ${data.map((v, i) => `
          <div class="spark-bar" style="height:${(v / max) * 100}%; animation:barIn 0.4s ease ${i * 30}ms backwards"></div>
        `).join('')}
      </div>
    `;
  }

  function refreshAll() {
    setTimeout(() => {
      if (typeof Dashboard !== 'undefined' && Router.getCurrent() === 'dashboard') Dashboard.render();
    }, 100);
  }

  return { donut, bars, line, spark, refreshAll };
})();
