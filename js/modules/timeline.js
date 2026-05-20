/* ═══════════════════════════════════════════════════════════
   TIMELINE — Widget Linha do Tempo do Dia
   Mentor24h | OBSIDIAN Design System | Forge v5.2 | Sprint 1
═══════════════════════════════════════════════════════════ */

const Timeline = (() => {

  function _esc(str) {
    return (str || '').toString()
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function _hoje() {
    return new Date().toISOString().slice(0, 10);
  }

  /* Busca eventos das próximas 24h a partir de agora */
  function _getEventos() {
    let agenda = [];
    try { agenda = DB.getAgenda ? DB.getAgenda() : []; } catch (_) {}

    const hoje = _hoje();
    const agora = new Date();
    const limite = new Date(agora.getTime() + 24 * 60 * 60 * 1000);

    return agenda
      .filter(ev => {
        if (!ev.hora) return false;
        const dataEv = ev.data || hoje;
        const dtEv = new Date(dataEv + 'T' + ev.hora + ':00');
        return dtEv >= agora && dtEv <= limite;
      })
      .sort((a, b) => {
        const da = (a.data || hoje) + 'T' + (a.hora || '00:00');
        const db_ = (b.data || hoje) + 'T' + (b.hora || '00:00');
        return da.localeCompare(db_);
      });
  }

  function _tipoClasse(ev) {
    const tipo = (ev.tipo || 'pessoal').toLowerCase();
    return tipo === 'servico' || tipo === 'serviço' ? 'tl-item--servico' : 'tl-item--pessoal';
  }

  function _buildItem(ev) {
    const cls = _tipoClasse(ev);
    const hora = _esc(ev.hora || '');
    const titulo = _esc(ev.titulo || ev.nome || 'Evento');
    const sub = ev.local ? `<span class="tl-item-sub">${_esc(ev.local)}</span>` : '';
    return `
      <div class="tl-item ${cls}" role="listitem">
        <span class="tl-item-hora">${hora}</span>
        <span class="tl-item-dot" aria-hidden="true"></span>
        <div class="tl-item-body">
          <span class="tl-item-titulo">${titulo}</span>
          ${sub}
        </div>
      </div>`;
  }

  function _buildVazio() {
    return `
      <div class="tl-vazio">
        <span class="tl-vazio-icon" data-icon="sun" data-size="24" aria-hidden="true"></span>
        <span class="tl-vazio-texto">Dia livre nas próximas 24h</span>
      </div>`;
  }

  /* render(container?) injeta o HTML no elemento passado
     ou retorna a string HTML para inclusão inline */
  function render(container) {
    const eventos = _getEventos();
    const html = `
      <div class="tl-widget" role="list" aria-label="Próximos eventos">
        <h2 class="tl-titulo">
          <span data-icon="clock" data-size="16" aria-hidden="true"></span>
          Próximas 24h
        </h2>
        <div class="tl-lista">
          ${eventos.length > 0
            ? eventos.map(_buildItem).join('')
            : _buildVazio()}
        </div>
        <button class="tl-ver-mais" onclick="Router.navigate('agenda')" type="button">
          Ver agenda completa
        </button>
      </div>`;

    if (container) {
      container.innerHTML = html;
      if (typeof Icons !== 'undefined') Icons.render(container);
      return;
    }
    return html;
  }

  return { render };
})();
