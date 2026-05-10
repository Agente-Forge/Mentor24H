/* ═══════════════════════════════════════════════════════════
   METAS — Caixinhas de poupança
═══════════════════════════════════════════════════════════ */

const Metas = (() => {
  function render() {
    const el = document.getElementById('metas-grid');
    if (!el) return;
    const metas = DB.getMetas();
    el.innerHTML = metas.map(renderCard).join('') + renderNova();
  }

  function renderCard(m) {
    const valorAtual = DB.getValorMeta(m.id);
    const pct = Utils.pct(valorAtual, m.valorAlvo);
    const falta = Math.max(0, m.valorAlvo - valorAtual);
    const STATUS_BADGE = { ativa: 'green', pausada: 'amber', concluida: 'green', cancelada: 'muted' };
    const STATUS_LABEL = { ativa: 'Ativa', pausada: 'Pausada', concluida: 'Concluída', cancelada: 'Cancelada' };

    let ritmo = '';
    if (m.status === 'ativa' && falta > 0 && m.prazo) {
      const dias = Utils.daysUntil(m.prazo);
      const semanas = dias / 7;
      const meses = dias / 30;
      const diario = dias > 0 ? falta / dias : 0;
      const semanal = semanas > 0 ? falta / semanas : 0;
      const mensal = meses > 0 ? falta / meses : 0;

      const totalDays = Utils.daysBetween(m.criadoEm.split('T')[0], m.prazo);
      const passados = Math.min(totalDays, Utils.daysBetween(m.criadoEm.split('T')[0], todayISO()));
      const esperado = (passados / totalDays) * m.valorAlvo;
      const atrasado = valorAtual < esperado * 0.95;
      const diff = Math.max(0, esperado - valorAtual);

      ritmo = `
        <div class="ritmo-box ${atrasado ? 'atrasado' : ''}">
          <div class="label">Para atingir até ${esc(Utils.formatDate(m.prazo))}</div>
          <div class="value" style="color:${m.cor}">${fmt(diario)}<span style="font-size:var(--t-xs);font-style:normal;font-family:var(--font-body);color:var(--text-3);font-weight:400">/dia</span></div>
          <div class="sub">${fmt(semanal)}/sem · ${fmt(mensal)}/mês</div>
          ${atrasado ? `<div class="warn">${Icons.html('alert-triangle', 11)} ${fmt(diff)} atrás do plano</div>` : ''}
        </div>
      `;
    } else if (m.status === 'ativa' && falta > 0) {
      ritmo = `
        <div class="ritmo-box">
          <div class="label">Falta para a meta</div>
          <div class="value">${fmt(falta)}</div>
          <div class="sub">Sem prazo definido</div>
        </div>
      `;
    } else if (m.status === 'concluida') {
      ritmo = `
        <div class="ritmo-box" style="background:var(--green-bg);border-color:rgba(94,227,154,0.25)">
          <div class="label" style="color:var(--green)">🎉 Meta atingida!</div>
          <div class="value" style="color:var(--green);font-size:var(--t-md)">Parabéns!</div>
        </div>
      `;
    }

    return `
      <div class="meta-card ${m.status} fade-in-up">
        <div class="meta-head">
          <div class="meta-icon-big" style="background:${m.cor}22;color:${m.cor}">
            ${Icons.html(m.icone, 22)}
          </div>
          <div class="meta-head-info">
            <div class="meta-name">${esc(m.nome)}</div>
            ${m.descricao ? `<div class="meta-desc">${esc(m.descricao)}</div>` : ''}
          </div>
          <span class="badge badge-${STATUS_BADGE[m.status]}">${esc(STATUS_LABEL[m.status])}</span>
        </div>
        <div class="meta-body">
          <div class="meta-amounts">
            <div class="meta-current" style="color:${m.cor}">${fmt(valorAtual)}</div>
            <div class="meta-target">
              <span class="pct">${pct.toFixed(0)}%</span>
              de ${fmt(m.valorAlvo)}
            </div>
          </div>
          <div class="progress lg">
            <div class="progress-fill" style="width:${pct}%;background:linear-gradient(90deg,${m.cor}88,${m.cor})"></div>
          </div>
          ${m.prazo ? `
            <div class="meta-prazo-row">
              <span class="badge badge-muted">${Icons.html('calendar', 9)} ${esc(Utils.formatDate(m.prazo))}</span>
              <span class="badge badge-muted">${Utils.daysUntil(m.prazo)} dias restantes</span>
            </div>
          ` : ''}
          ${ritmo}
        </div>
        <div class="meta-foot">
          ${m.status === 'ativa' ? `
            <button class="btn btn-success btn-sm" onclick="Modal.depositar('${esc(m.id)}')">
              ${Icons.html('plus', 13)} Guardar
            </button>
            <button class="btn btn-secondary btn-sm" onclick="Modal.sacar('${esc(m.id)}')">
              ${Icons.html('minus', 13)} Retirar
            </button>
          ` : ''}
          <button class="btn btn-ghost btn-icon btn-sm" onclick="Modal.historicoMeta('${esc(m.id)}')" title="Histórico">
            ${Icons.html('history', 12)}
          </button>
          <button class="btn btn-ghost btn-icon btn-sm" onclick="Modal.editarMeta('${esc(m.id)}')" title="Editar">
            ${Icons.html('pencil', 12)}
          </button>
          <button class="btn btn-danger btn-icon btn-sm" onclick="Metas.excluir('${esc(m.id)}')" title="Excluir">
            ${Icons.html('trash-2', 12)}
          </button>
        </div>
      </div>
    `;
  }

  function renderNova() {
    return `
      <div class="meta-new" onclick="Modal.novaMeta()">
        ${Icons.html('plus-circle', 32)}
        <span class="label">Nova caixinha</span>
      </div>
    `;
  }

  function excluir(id) {
    const m = DB.getMeta(id);
    Modal.confirm(
      'Excluir meta?',
      `"${m?.nome}" e todas as movimentações serão perdidas.`,
      () => {
        DB.deleteMeta(id);
        Toast.success('Meta excluída');
        render();
      },
      'Excluir'
    );
  }

  return { render, excluir };
})();
