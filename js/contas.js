/* ═══════════════════════════════════════════════════════════
   CONTAS — Lista, filtros, CRUD
═══════════════════════════════════════════════════════════ */

const Contas = (() => {
  let filtros = {
    status: 'todas', categoria: 'todas', tipo: 'todas',
    busca: '', dataInicio: '', dataFim: '',
    periodo: 'mes', periodoOffset: 0,
  };

  /* ── Helpers de período ── */

  function toDateStr(d) {
    return d.toISOString().slice(0, 10);
  }

  function getPeriodoDates() {
    if (filtros.periodo === 'custom') {
      return { inicio: filtros.dataInicio, fim: filtros.dataFim };
    }
    const hoje = new Date();
    const off   = filtros.periodoOffset;

    if (filtros.periodo === 'dia') {
      const d = new Date(hoje);
      d.setDate(d.getDate() + off);
      const s = toDateStr(d);
      return { inicio: s, fim: s };
    }

    if (filtros.periodo === 'semana') {
      const d   = new Date(hoje);
      const dow = d.getDay(); // 0=dom … 6=sab
      d.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1) + off * 7);
      const sunday = new Date(d);
      sunday.setDate(d.getDate() + 6);
      return { inicio: toDateStr(d), fim: toDateStr(sunday) };
    }

    // 'mes'
    const d   = new Date(hoje.getFullYear(), hoje.getMonth() + off, 1);
    const fim = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return { inicio: toDateStr(d), fim: toDateStr(fim) };
  }

  function getPeriodoLabel() {
    const off = filtros.periodoOffset;
    if (filtros.periodo === 'custom') return 'Período personalizado';

    if (filtros.periodo === 'dia') {
      if (off === 0)  return 'Hoje';
      if (off === -1) return 'Ontem';
      if (off === 1)  return 'Amanhã';
      const d = new Date();
      d.setDate(d.getDate() + off);
      return d.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
    }

    if (filtros.periodo === 'semana') {
      if (off === 0) return 'Esta semana';
      const { inicio, fim } = getPeriodoDates();
      return `${fmtCurta(inicio)} — ${fmtCurta(fim)}`;
    }

    // mes
    if (off === 0) return 'Este mês';
    const hoje = new Date();
    const d = new Date(hoje.getFullYear(), hoje.getMonth() + off, 1);
    return d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }

  function fmtCurta(iso) {
    if (!iso) return '';
    const [, m, d] = iso.split('-');
    return `${d}/${m}`;
  }

  function buildDbFiltros() {
    const f = Object.assign({}, filtros);
    if (filtros.periodo !== 'custom') {
      const { inicio, fim } = getPeriodoDates();
      f.dataInicio = inicio;
      f.dataFim    = fim;
    }
    return f;
  }

  /* ── Render principal ── */

  function render() {
    DB.updateStatusContas();
    renderKPIs();
    renderFiltros();
    renderLista();
  }

  function renderKPIs() {
    const arr   = DB.getContas(buildDbFiltros());
    const total = arr.reduce((s, c) => s + c.valor, 0);
    const pagas = arr.filter(c => c.status === 'paga').reduce((s, c) => s + c.valor, 0);
    const pend  = arr.filter(c => c.status === 'pendente').reduce((s, c) => s + c.valor, 0);
    const atr   = arr.filter(c => c.status === 'atrasada').reduce((s, c) => s + c.valor, 0);

    const el = document.getElementById('contas-kpis');
    if (!el) return;
    el.innerHTML = [
      { lbl: 'Total filtrado', val: total, accent: 'violet', icon: 'list' },
      { lbl: 'Pagas',          val: pagas, accent: 'green',  icon: 'check-circle-2' },
      { lbl: 'Pendentes',      val: pend,  accent: 'amber',  icon: 'clock' },
      { lbl: 'Atrasadas',      val: atr,   accent: 'red',    icon: 'alert-circle' },
    ].map(k => `
      <div class="bento-card">
        <div class="card-head" style="margin-bottom:var(--s-3)">
          <span class="card-eyebrow">${esc(k.lbl)}</span>
          <div class="card-pill ${k.accent}">${Icons.html(k.icon, 14)}</div>
        </div>
        <div class="num" style="font-size:var(--t-xl);font-weight:600;color:var(--text-1)">${fmt(k.val)}</div>
      </div>
    `).join('');
  }

  function renderFiltros() {
    const el = document.getElementById('contas-filtros');
    if (!el) return;

    const cats      = DB.getCategorias();
    const arr       = DB.getContas(buildDbFiltros());
    const nPend     = arr.filter(c => c.status === 'pendente').length;
    const nAtr      = arr.filter(c => c.status === 'atrasada').length;
    const nPaga     = arr.filter(c => c.status === 'paga').length;
    const isCustom  = filtros.periodo === 'custom';
    const temFiltro = filtros.status !== 'todas' || filtros.categoria !== 'todas' || filtros.tipo !== 'todas' || filtros.busca;

    el.innerHTML = `
      <div class="contas-filtros-wrap">

        <!-- Linha 1: seletor de período + navegador -->
        <div class="cf-row cf-row-period">
          <div class="seg-ctrl">
            <button class="seg-btn ${filtros.periodo === 'dia'    ? 'active' : ''}" onclick="Contas.setPeriodo('dia')">Dia</button>
            <button class="seg-btn ${filtros.periodo === 'semana' ? 'active' : ''}" onclick="Contas.setPeriodo('semana')">Semana</button>
            <button class="seg-btn ${filtros.periodo === 'mes'    ? 'active' : ''}" onclick="Contas.setPeriodo('mes')">Mês</button>
            <button class="seg-btn ${isCustom                     ? 'active' : ''}" onclick="Contas.setPeriodo('custom')">${Icons.html('calendar', 11)} Intervalo</button>
          </div>

          ${!isCustom ? `
            <div class="period-nav">
              <button class="btn btn-ghost btn-icon btn-sm" onclick="Contas.navPeriodo(-1)" title="Período anterior">
                ${Icons.html('chevron-left', 14)}
              </button>
              <span class="period-nav-label">${esc(getPeriodoLabel())}</span>
              <button class="btn btn-ghost btn-icon btn-sm" onclick="Contas.navPeriodo(1)" title="Próximo período">
                ${Icons.html('chevron-right', 14)}
              </button>
            </div>
            ${filtros.periodoOffset !== 0
              ? `<button class="btn btn-ghost btn-sm cf-hoje-btn" onclick="Contas.irHoje()">${Icons.html('home', 11)} Hoje</button>`
              : ''}
          ` : `
            <div class="period-custom-range">
              <input type="date" value="${esc(filtros.dataInicio)}" onchange="Contas.setFiltro('dataInicio', this.value)" title="Data inicial">
              <span class="period-range-sep">${Icons.html('arrow-right', 12)}</span>
              <input type="date" value="${esc(filtros.dataFim)}" onchange="Contas.setFiltro('dataFim', this.value)" title="Data final">
            </div>
            <div class="period-presets">
              <button class="btn btn-ghost btn-sm" onclick="Contas.setPreset('ultimos7')">7 dias</button>
              <button class="btn btn-ghost btn-sm" onclick="Contas.setPreset('ultimos30')">30 dias</button>
              <button class="btn btn-ghost btn-sm" onclick="Contas.setPreset('mesAtual')">Este mês</button>
              <button class="btn btn-ghost btn-sm" onclick="Contas.setPreset('anoAtual')">Este ano</button>
            </div>
          `}
        </div>

        <!-- Linha 2: faixa de informações -->
        <div class="info-strip">
          <div class="info-strip-item">
            ${Icons.html('file-text', 11)}
            <span>${arr.length} conta${arr.length !== 1 ? 's' : ''} no período</span>
          </div>
          ${nPend ? `
          <div class="info-strip-item amber">
            ${Icons.html('clock', 11)}
            <span>${nPend} pendente${nPend !== 1 ? 's' : ''}</span>
          </div>` : ''}
          ${nAtr ? `
          <div class="info-strip-item red">
            ${Icons.html('alert-circle', 11)}
            <span>${nAtr} atrasada${nAtr !== 1 ? 's' : ''}</span>
          </div>` : ''}
          ${nPaga ? `
          <div class="info-strip-item green">
            ${Icons.html('check-circle-2', 11)}
            <span>${nPaga} paga${nPaga !== 1 ? 's' : ''}</span>
          </div>` : ''}
          ${!arr.length ? `
          <div class="info-strip-item muted">
            ${Icons.html('inbox', 11)}
            <span>Nenhuma conta neste período</span>
          </div>` : ''}
        </div>

        <!-- Linha 3: filtros avançados -->
        <div class="cf-adv-row">
          <input type="text" class="cf-busca" placeholder="Buscar descrição..." value="${esc(filtros.busca)}"
                 oninput="Contas.setFiltro('busca', this.value)">
          <select onchange="Contas.setFiltro('status', this.value)" class="${filtros.status !== 'todas' ? 'filter-active' : ''}">
            <option value="todas">Todos status</option>
            <option value="pendente"  ${filtros.status === 'pendente'  ? 'selected' : ''}>Pendentes</option>
            <option value="paga"      ${filtros.status === 'paga'      ? 'selected' : ''}>Pagas</option>
            <option value="atrasada"  ${filtros.status === 'atrasada'  ? 'selected' : ''}>Atrasadas</option>
          </select>
          <select onchange="Contas.setFiltro('tipo', this.value)" class="${filtros.tipo !== 'todas' ? 'filter-active' : ''}">
            <option value="todas">Todos tipos</option>
            <option value="normal"     ${filtros.tipo === 'normal'     ? 'selected' : ''}>Normal</option>
            <option value="recorrente" ${filtros.tipo === 'recorrente' ? 'selected' : ''}>Recorrente</option>
            <option value="parcelada"  ${filtros.tipo === 'parcelada'  ? 'selected' : ''}>Parcelada</option>
          </select>
          <select onchange="Contas.setFiltro('categoria', this.value)" class="${filtros.categoria !== 'todas' ? 'filter-active' : ''}">
            <option value="todas">Todas categorias</option>
            ${cats.map(c => `<option value="${c.id}" ${filtros.categoria === c.id ? 'selected' : ''}>${esc(c.nome)}</option>`).join('')}
          </select>
          ${temFiltro ? `
          <button class="btn btn-ghost btn-sm cf-clear-btn" onclick="Contas.limparAvancados()" title="Remover filtros ativos">
            ${Icons.html('x', 12)} Limpar
          </button>` : ''}
        </div>

      </div>
    `;
  }

  function renderLista() {
    const el = document.getElementById('contas-lista');
    if (!el) return;
    const arr = DB.getContas(buildDbFiltros());

    if (!arr.length) {
      el.innerHTML = `
        <div class="empty">
          <div class="empty-icon">${Icons.html('inbox', 22)}</div>
          <h4>Nada por aqui</h4>
          <p>Ajuste os filtros ou adicione uma nova conta no botão "+"</p>
        </div>
      `;
      return;
    }

    el.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:6px">
        ${arr.map(c => renderItem(c)).join('')}
      </div>
    `;
  }

  function labelPagamento(c) {
    if (c.status !== 'paga' || !c.dataPagamento) return '';
    const hoje   = toDateStr(new Date());
    const ontem  = toDateStr(new Date(Date.now() - 86400000));
    const pago   = c.dataPagamento.slice(0, 10);
    const foiAtrasada = c.dataVencimento && pago > c.dataVencimento;

    let label;
    if (pago === hoje)  label = 'Pago hoje';
    else if (pago === ontem) label = 'Pago ontem';
    else {
      const [y, m, d] = pago.split('-');
      label = `Pago em ${d}/${m}/${y}`;
    }
    return foiAtrasada
      ? `<span class="badge badge-green" title="Pago após vencimento">${Icons.html('check-circle-2', 9)} ${label} · com atraso</span>`
      : `<span class="badge badge-green">${Icons.html('check-circle-2', 9)} ${label}</span>`;
  }

  function renderItem(c) {
    const cat        = DB.getCategoria(c.categoria);
    const urg        = Utils.urgencyOf(c.dataVencimento, c.status);
    const statusBadge = { pendente: 'amber', paga: 'green', atrasada: 'red' }[c.status] || 'muted';

    return `
      <div class="list-item ${c.status === 'paga' ? 'dim' : ''}">
        <div class="list-icon" style="background:${cat.cor}22;color:${cat.cor}">
          ${Icons.html(cat.icone, 16)}
        </div>
        <div class="list-info">
          <h4>${esc(c.descricao)}</h4>
          <div class="meta">
            <span class="badge badge-${statusBadge}">${esc(c.status)}</span>
            <span class="badge badge-muted">${esc(cat.nome)}</span>
            ${c.parcelado ? `<span class="badge badge-violet">${c.parcelaAtual}/${c.totalParcelas}</span>` : ''}
            ${c.recorrente ? `<span class="badge badge-blue">${Icons.html('repeat', 9)} ${esc(c.intervaloRecorrencia || '')}</span>` : ''}
            ${c.status !== 'paga' && c.dataVencimento ? `<span style="color:var(--${urg === 'muted' ? 'text-3' : urg});font-weight:500">${esc(Utils.urgencyLabel(c.dataVencimento, c.status))}</span>` : ''}
            ${labelPagamento(c)}
          </div>
        </div>
        <div class="list-amount" style="${c.status === 'paga' ? 'color:var(--green)' : ''}">${fmt(c.valor)}</div>
        <div class="list-actions">
          ${c.status !== 'paga' ? `
            <button class="btn btn-success btn-icon btn-sm" onclick="Modal.pagarConta('${esc(c.id)}')" title="Marcar como paga">
              ${Icons.html('check', 12)}
            </button>` : ''}
          <button class="btn btn-secondary btn-icon btn-sm" onclick="Modal.editarConta('${esc(c.id)}')" title="Editar">
            ${Icons.html('pencil', 12)}
          </button>
          <button class="btn btn-danger btn-icon btn-sm" onclick="Contas.confirmar('${esc(c.id)}', '${esc(c.grupoParcelamento || '')}')" title="Excluir">
            ${Icons.html('trash-2', 12)}
          </button>
        </div>
      </div>
    `;
  }

  /* ── Ações de filtro ── */

  function setFiltro(k, v) {
    filtros[k] = v;
    renderFiltros();
    renderLista();
    renderKPIs();
  }

  function setPeriodo(p) {
    filtros.periodo       = p;
    filtros.periodoOffset = 0;
    renderFiltros();
    renderLista();
    renderKPIs();
  }

  function navPeriodo(dir) {
    filtros.periodoOffset += dir;
    renderFiltros();
    renderLista();
    renderKPIs();
  }

  function irHoje() {
    filtros.periodoOffset = 0;
    renderFiltros();
    renderLista();
    renderKPIs();
  }

  function setPreset(p) {
    const hoje = new Date();
    if (p === 'ultimos7') {
      const ini = new Date(hoje); ini.setDate(hoje.getDate() - 6);
      filtros.dataInicio = toDateStr(ini);
      filtros.dataFim    = toDateStr(hoje);
    } else if (p === 'ultimos30') {
      const ini = new Date(hoje); ini.setDate(hoje.getDate() - 29);
      filtros.dataInicio = toDateStr(ini);
      filtros.dataFim    = toDateStr(hoje);
    } else if (p === 'mesAtual') {
      filtros.dataInicio = toDateStr(new Date(hoje.getFullYear(), hoje.getMonth(), 1));
      filtros.dataFim    = toDateStr(new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0));
    } else if (p === 'anoAtual') {
      filtros.dataInicio = toDateStr(new Date(hoje.getFullYear(), 0, 1));
      filtros.dataFim    = toDateStr(new Date(hoje.getFullYear(), 11, 31));
    }
    renderFiltros();
    renderLista();
    renderKPIs();
  }

  function limpar() {
    filtros = {
      status: 'todas', categoria: 'todas', tipo: 'todas',
      busca: '', dataInicio: '', dataFim: '',
      periodo: 'mes', periodoOffset: 0,
    };
    render();
  }

  function limparAvancados() {
    filtros.status    = 'todas';
    filtros.categoria = 'todas';
    filtros.tipo      = 'todas';
    filtros.busca     = '';
    renderFiltros();
    renderLista();
    renderKPIs();
  }

  /* ── CRUD ── */

  function confirmar(id, grupo) {
    const c = DB.getConta(id);
    if (!c) return;
    if (grupo) {
      Modal.open(`
        <div class="confirm">
          <div class="confirm-icon-wrap">${Icons.html('alert-triangle', 28)}</div>
          <h3>Excluir parcelamento?</h3>
          <p>Esta conta faz parte de um parcelamento de ${c.totalParcelas} parcelas.</p>
          <div class="confirm-actions">
            <button class="btn btn-ghost" onclick="Modal.close()">Cancelar</button>
            <button class="btn btn-secondary" onclick="Contas._delOne('${esc(id)}')">Apenas esta</button>
            <button class="btn btn-danger" onclick="Contas._delGrupo('${esc(grupo)}')">Todas (${c.totalParcelas})</button>
          </div>
        </div>
      `, 'modal-sm');
    } else {
      Modal.confirm(
        'Excluir conta?',
        `"${c.descricao}" será removida permanentemente.`,
        () => { DB.deleteConta(id); afterDelete(); },
        'Excluir'
      );
    }
  }

  function _delOne(id) {
    Modal.close();
    DB.deleteConta(id);
    afterDelete();
  }

  function _delGrupo(grupo) {
    Modal.close();
    DB.deleteGrupoParcelamento(grupo);
    afterDelete();
  }

  function afterDelete() {
    Toast.success('Excluído com sucesso');
    render();
    Dashboard.updateBadges();
  }

  return {
    render, setFiltro,
    setPeriodo, navPeriodo, irHoje, setPreset,
    limpar, limparAvancados,
    confirmar, _delOne, _delGrupo,
  };
})();
