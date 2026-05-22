const DatasImportantes = (() => {
  function render() {
    const el = document.getElementById('datas-importantes-content');
    if (!el) return;
    el.innerHTML = `
      <div class="page-head">
        <div>
          <h1 class="page-title">Datas <em>Importantes</em></h1>
          <p class="page-sub">Aniversários, casamentos e datas especiais</p>
        </div>
      </div>
      <div class="bento-card" style="text-align:center;padding:var(--s-8)">
        <p style="color:var(--text-3);font-size:var(--t-sm)">Em breve — Sprint 4</p>
      </div>`;
    if (typeof Icons !== 'undefined') Icons.render(el);
  }
  return { render };
})();
