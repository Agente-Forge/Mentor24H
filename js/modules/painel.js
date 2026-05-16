/* ═══════════════════════════════════════════════════════════
   PAINEL — Dashboard Negócio com KPIs
   Mentor24h | OBSIDIAN Design System | Forge v5.2
═══════════════════════════════════════════════════════════ */

const Painel = (() => {
  function getMes() {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() + 1 };
  }

  function calcularReceitaMes() {
    const { year, month } = getMes();
    const txs = DB.getTransacoes() || [];
    return txs
      .filter(t => t.tipo === 'receita' && t.data)
      .filter(t => {
        const [a, m] = t.data.split('-').map(Number);
        return a === year && m === month;
      })
      .reduce((sum, t) => sum + (t.valor || 0), 0);
  }

  function calcularClientesAtivos() {
    const contatos = DB.getContatos() || [];
    return contatos.filter(c => (c.contextos || []).includes('cliente')).length;
  }

  function calcularTemperaturaMedia() {
    const contatos = DB.getContatos() || [];
    const clientes = contatos.filter(c => (c.contextos || []).includes('cliente'));
    if (!clientes.length) return '--';

    const temps = clientes.map(c => c.temperatura || 'lead');
    const frequencia = {};
    temps.forEach(t => {
      frequencia[t] = (frequencia[t] || 0) + 1;
    });

    const ordem = ['vip', 'quente', 'morno', 'lead', 'frio', 'inativo'];
    let maxTemp = 'lead';
    let maxCount = 0;
    ordem.forEach(t => {
      if ((frequencia[t] || 0) > maxCount) {
        maxCount = frequencia[t];
        maxTemp = t;
      }
    });

    const labels = {
      'vip': 'VIP', 'quente': 'Quente', 'morno': 'Morno',
      'lead': 'Lead', 'frio': 'Frio', 'inativo': 'Inativo'
    };
    return labels[maxTemp] || 'Lead';
  }

  function getAtividadeRecente() {
    const txs = DB.getTransacoes() || [];
    return txs
      .slice(-5)
      .reverse()
      .map(t => ({
        tipo: t.tipo,
        valor: t.valor,
        data: t.data,
        descricao: t.descricao || 'Transação'
      }));
  }

  function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  function formatarData(dataStr) {
    if (!dataStr) return '—';
    const [a, m, d] = dataStr.split('-');
    return `${d}/${m}/${a}`;
  }

  function render() {
    const container = document.getElementById('painel-negocio-content');
    if (!container) return;

    const receitaMes = calcularReceitaMes();
    const clientesAtivos = calcularClientesAtivos();
    const tempMedia = calcularTemperaturaMedia();
    const atividade = getAtividadeRecente();

    let html = `
      <section class="painel-negocio">
        <div class="page-head">
          <div>
            <h2 class="page-title">Seu <em>negócio</em></h2>
            <div class="page-sub">Visão geral e métricas do mês</div>
          </div>
        </div>

        <!-- KPI Grid -->
        <div class="painel-kpi-grid">
          <!-- KPI 1: Receitas -->
          <div class="painel-kpi-card">
            <div class="painel-kpi-header">
              <span data-icon="trending-up" data-size="18"></span>
              <span class="painel-kpi-label">Receitas do mês</span>
            </div>
            <div class="painel-kpi-valor">${receitaMes > 0 ? formatarMoeda(receitaMes) : '—'}</div>
            <div class="painel-kpi-sub">${receitaMes > 0 ? 'mês atual' : 'sem dados'}</div>
          </div>

          <!-- KPI 2: Clientes -->
          <div class="painel-kpi-card">
            <div class="painel-kpi-header">
              <span data-icon="users" data-size="18"></span>
              <span class="painel-kpi-label">Clientes ativos</span>
            </div>
            <div class="painel-kpi-valor">${clientesAtivos || '—'}</div>
            <div class="painel-kpi-sub">${clientesAtivos > 0 ? 'cadastrados' : 'comece aqui'}</div>
          </div>

          <!-- KPI 3: Temperatura -->
          <div class="painel-kpi-card">
            <div class="painel-kpi-header">
              <span data-icon="thermometer" data-size="18"></span>
              <span class="painel-kpi-label">Temperatura média</span>
            </div>
            <div class="painel-kpi-valor">${tempMedia}</div>
            <div class="painel-kpi-sub">${tempMedia !== '—' ? 'dos clientes' : 'sem clientes'}</div>
          </div>

          <!-- KPI 4: Em Breve -->
          <div class="painel-kpi-card painel-kpi-embreve">
            <div class="painel-kpi-header">
              <span data-icon="zap" data-size="18"></span>
              <span class="painel-kpi-label">Vendas & Estoque</span>
            </div>
            <div class="painel-kpi-badge">Em breve</div>
            <div class="painel-kpi-sub">funcionalidades a caminho</div>
          </div>
        </div>

        <!-- Atividade Recente -->
        <div class="painel-atividade-section">
          <h3 class="painel-atividade-title">Atividade recente</h3>
          ${atividade.length > 0 ? `
            <div class="painel-atividade-list">
              ${atividade.map((tx, i) => `
                <div class="painel-atividade-item">
                  <div class="painel-atividade-icon ${tx.tipo}">
                    <span data-icon="${tx.tipo === 'receita' ? 'arrow-down-left' : 'arrow-up-right'}" data-size="14"></span>
                  </div>
                  <div class="painel-atividade-info">
                    <div class="painel-atividade-desc">${esc(tx.descricao)}</div>
                    <div class="painel-atividade-data">${formatarData(tx.data)}</div>
                  </div>
                  <div class="painel-atividade-valor ${tx.tipo}">${formatarMoeda(tx.valor)}</div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="painel-estado-vazio">
              <span data-icon="inbox" data-size="32"></span>
              <p>Nenhuma transação registrada</p>
              <span class="painel-vazio-hint">Comece registrando sua primeira venda</span>
            </div>
          `}
        </div>
      </section>
    `;

    container.innerHTML = html;
    Icons.render();
  }

  return { render };
})();
