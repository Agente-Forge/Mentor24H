const Rotinas = (() => {
  function render() {
    const el = document.getElementById('rotinas-content');
    if (!el) return;
    el.innerHTML = `
      <div class="page-head">
        <div>
          <h1 class="page-title">Minhas <em>Rotinas</em></h1>
          <p class="page-sub">Sequências de atividades por horário</p>
        </div>
      </div>
      <div class="bento-card" style="text-align:center;padding:var(--s-8)">
        <p style="color:var(--text-3);font-size:var(--t-sm)">Em breve — Sprint 4</p>
      </div>`;
    if (typeof Icons !== 'undefined') Icons.render(el);
  }
  return { render };
})();
