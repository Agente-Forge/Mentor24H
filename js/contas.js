/* ═══════════════════════════════════════════════════════════
   CONTAS — Lista, filtros, CRUD
═══════════════════════════════════════════════════════════ */

const Contas = (() => {
  let filtros = {
    status: 'todas', categoria: 'todas', tipo: 'todas',
    busca: '', dataInicio: '', dataFim: '',
  };

  function render() {
    DB.updateStatusContas();
    renderKPIs();
    renderFiltros();
    renderLista();
  }

  function renderKPIs() {
    const arr = DB.getContas(filtros);
    const total = arr.reduce((s, c) => s + c.valor, 0);
    const pagas = arr.filter(c => c.status === 'paga').reduce((s, c) => s + c.valor, 0);
    const pend  = arr.filter(c => c.status === 'pendente').reduce((s, c) => s + c.valor, 0);
    const atr   = arr.filter(c => c.status === 'atrasada').reduce((s, c) => s + c.valor, 0);

    const el = document.getElementById('contas-kpis');
    if (!el) return;
    el.innerHTML = [
      { lbl: 'Total filtrado', val: total, accent: 'violet', icon: 'list' },
      { lbl: 'Pagas',  val: pagas, accent: 'green', icon: 'check-circle-2' },
      { lbl: 'Pendentes', val: pend, accent: 'amber', icon: 'clock' },
      { lbl: 'Atrasadas', val: atr,  accent: 'red',   icon: 'alert-circle' },
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
    const cats = DB.getCategorias();
    el.innerHTML = `
      <input type="text" placeholder="Buscar..." value="${esc(filtros.busca)}" oninput="Contas.setFiltro('busca', this.value)" style="flex:1 1 200px;max-width:300px">
      <select onchange="Contas.setFiltro('status', this.value)">
        <option value="todas">Todos status</option>
        <option value="pendente"  ${filtros.status === 'pendente' ? 'selected' : ''}>Pendentes</option>
        <option value="paga"      ${filtros.status === 'paga' ? 'selected' : ''}>Pagas</option>
        <option value="atrasada"  ${filtros.status === 'atrasada' ? 'selected' : ''}>Atrasadas</option>
      </select>
      <select onchange="Contas.setFiltro('tipo', this.value)">
        <option value="todas">Todos tipos</option>
        <option value="normal"     ${filtros.tipo === 'normal' ? 'selected' : ''}>Normal</option>
        <option value="recorrente" ${filtros.tipo === 'recorrente' ? 'selected' : ''}>Recorrente</option>
        <option value="parcelada"  ${filtros.tipo === 'parcelada' ? 'selected' : ''}>Parcelada</option>
      </select>
      <select onchange="Contas.setFiltro('categoria', this.value)">
        <option value="todas">Todas categorias</option>
        ${cats.map(c => `<option value="${c.id}" ${filtros.categoria === c.id ? 'selected' : ''}>${esc(c.nome)}</option>`).join('')}
      </select>
      <input type="date" value="${esc(filtros.dataInicio)}" onchange="Contas.setFiltro('dataInicio', this.value)" title="Início" style="max-width:140px">
      <input type="date" value="${esc(filtros.dataFim)}" onchange="Contas.setFiltro('dataFim', this.value)" title="Fim" style="max-width:140px">
      <button class="btn btn-ghost btn-sm" onclick="Contas.limpar()" title="Limpar filtros">${Icons.html('x', 13)}</button>
    `;
  }

  function renderLista() {
    const el = document.getElementById('contas-lista');
    if (!el) return;
    const arr = DB.getContas(filtros);

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

  function renderItem(c) {
    const cat = DB.getCategoria(c.categoria);
    const urg = Utils.urgencyOf(c.dataVencimento, c.status);
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
            ${c.dataVencimento ? `<span style="color:var(--${urg === 'muted' ? 'text-3' : urg});font-weight:500">${esc(Utils.urgencyLabel(c.dataVencimento, c.status))}</span>` : ''}
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

  function setFiltro(k, v) {
    filtros[k] = v;
    renderLista();
    renderKPIs();
  }

  function limpar() {
    filtros = { status: 'todas', categoria: 'todas', tipo: 'todas', busca: '', dataInicio: '', dataFim: '' };
    render();
  }

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

  return { render, setFiltro, limpar, confirmar, _delOne, _delGrupo };
})();
