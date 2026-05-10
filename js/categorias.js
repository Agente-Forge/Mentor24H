/* ═══════════════════════════════════════════════════════════
   CATEGORIAS
═══════════════════════════════════════════════════════════ */

const Categorias = (() => {
  function render() {
    const el = document.getElementById('cats-grid');
    if (!el) return;
    const cats = DB.getCategorias();
    const contas = DB.getContas();
    const totalGeral = contas.reduce((s, c) => s + c.valor, 0);

    el.innerHTML = cats.map(c => {
      const items = contas.filter(co => co.categoria === c.id);
      const total = items.reduce((s, co) => s + co.valor, 0);
      const pctTotal = totalGeral ? (total / totalGeral) * 100 : 0;
      return `
        <div class="cat-card fade-in-up" style="--cat-cor:${c.cor}">
          <span style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,${c.cor},${c.cor}88)"></span>
          <div class="cat-head">
            <div class="cat-icon" style="background:${c.cor}22;color:${c.cor}">
              ${Icons.html(c.icone, 20)}
            </div>
            <div class="cat-info">
              <div class="cat-name">${esc(c.nome)}</div>
              <div class="cat-stats">${items.length} ${items.length === 1 ? 'conta' : 'contas'} · ${fmt(total)}</div>
            </div>
            <div class="cat-actions">
              <button class="btn btn-ghost btn-icon btn-sm" onclick="Modal.editarCategoria('${esc(c.id)}')">${Icons.html('pencil', 12)}</button>
              <button class="btn btn-danger btn-icon btn-sm" onclick="Categorias.excluir('${esc(c.id)}')">${Icons.html('trash-2', 12)}</button>
            </div>
          </div>
          <div class="cat-bar">
            <div class="cat-bar-fill" style="width:${pctTotal}%;background:${c.cor}"></div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-4);margin-top:6px;font-family:var(--font-mono)">
            <span>${pctTotal.toFixed(1)}% do total</span>
            <span>${esc(c.cor)}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  function excluir(id) {
    const PROTECTED = ['moradia','alimentacao','transporte','saude','educacao','lazer','servicos','investimento','outros'];
    if (PROTECTED.includes(id)) {
      Toast.warning('Categoria padrão', 'Categorias do sistema não podem ser excluídas');
      return;
    }
    const c = DB.getCategoria(id);
    Modal.confirm('Excluir categoria?', `"${c?.nome}" será removida.`, () => {
      DB.deleteCategoria(id);
      Toast.success('Categoria excluída');
      render();
    }, 'Excluir');
  }

  return { render, excluir };
})();
