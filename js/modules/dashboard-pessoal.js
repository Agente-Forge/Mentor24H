/* ═══════════════════════════════════════════════════════════
   DASHBOARD PESSOAL — Hub de Vida
   Mentor24h | OBSIDIAN Design System | Forge v5.2
═══════════════════════════════════════════════════════════ */

const DashboardPessoal = (() => {
  const NOTA_KEY = 'mentor24h_nota_rapida';
  let _debounceTimer = null;

  /* ─── Helpers ─── */
  function fmt(valor) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
  }

  function getSaudacao() {
    const h = new Date().getHours();
    const cfg = DB.getConfig ? DB.getConfig() : {};
    const nome = cfg.nomeUsuario ? cfg.nomeUsuario.split(' ')[0] : 'Léo';
    if (h >= 5 && h < 12) return `Bom dia, ${nome}!`;
    if (h >= 12 && h < 18) return `Boa tarde, ${nome}!`;
    return `Boa noite, ${nome}!`;
  }

  function getDataCompleta() {
    const now = new Date();
    const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return `${diasSemana[now.getDay()]}, ${now.getDate()} de ${meses[now.getMonth()]} de ${now.getFullYear()}`;
  }

  /* ─── Widget: Agenda ─── */
  function buildWidgetAgenda() {
    let eventos = [];
    try { eventos = (DB.getAgenda ? DB.getAgenda() : []) || []; } catch (_) {}
    const hoje = new Date().toISOString().slice(0, 10);
    const hoje_eventos = eventos.filter(e => (e.data || e.inicio || '').slice(0, 10) === hoje);
    const proxEvent = hoje_eventos[0];
    return `
      <div class="dp-widget dp-widget--agenda">
        <div class="dp-widget-icon" data-icon="calendar" data-size="20"></div>
        <div class="dp-widget-body">
          <span class="dp-widget-label">Agenda</span>
          <span class="dp-widget-valor">${hoje_eventos.length > 0 ? `${hoje_eventos.length} compromisso${hoje_eventos.length > 1 ? 's' : ''} hoje` : 'Nenhum hoje'}</span>
          ${proxEvent ? `<span class="dp-widget-sub">${esc(proxEvent.titulo || proxEvent.nome || 'Compromisso')}${proxEvent.hora ? ' · ' + proxEvent.hora : ''}</span>` : ''}
        </div>
      </div>`;
  }

  /* ─── Widget: Saúde ─── */
  function buildWidgetSaude() {
    const saude = null; /* saúde integrada no Sprint 2 */
    if (saude && saude.passos) {
      const perc = Math.min(100, Math.round((saude.passos / (saude.meta || 10000)) * 100));
      return `
        <div class="dp-widget dp-widget--saude">
          <div class="dp-widget-icon" data-icon="heart-pulse" data-size="20"></div>
          <div class="dp-widget-body">
            <span class="dp-widget-label">Saúde</span>
            <span class="dp-widget-valor">${saude.passos.toLocaleString('pt-BR')} passos</span>
            <span class="dp-widget-sub">${perc}% da meta diária</span>
          </div>
        </div>`;
    }
    return `
      <div class="dp-widget dp-widget--saude dp-widget--vazio">
        <div class="dp-widget-icon" data-icon="heart-pulse" data-size="20"></div>
        <div class="dp-widget-body">
          <span class="dp-widget-label">Saúde & Hábitos</span>
          <span class="dp-widget-valor dp-vazio">Nenhum dado ainda</span>
          <span class="dp-widget-sub">Registre no módulo Saúde</span>
        </div>
      </div>`;
  }

  /* ─── Widget: Finanças ─── */
  function buildWidgetFinancas() {
    const txs = (DB.getTransacoes ? DB.getTransacoes() : []) || [];
    const contas = (DB.getContas ? DB.getContas() : []) || [];
    const hoje = new Date().toISOString().slice(0, 10);
    const deltaHoje = txs
      .filter(t => (t.data || '').slice(0, 10) === hoje)
      .reduce((sum, t) => sum + ((t.tipo === 'receita' || t.tipo === 'entrada') ? (t.valor || 0) : -(t.valor || 0)), 0);
    const pendentes = contas.filter(c => c.status === 'pendente' || c.status === 'atrasada').length;
    return `
      <div class="dp-widget dp-widget--financas">
        <div class="dp-widget-icon" data-icon="wallet" data-size="20"></div>
        <div class="dp-widget-body">
          <span class="dp-widget-label">Finanças</span>
          <span class="dp-widget-valor">${pendentes > 0 ? `${pendentes} conta${pendentes > 1 ? 's' : ''} pendente${pendentes > 1 ? 's' : ''}` : 'Tudo em dia'}</span>
          <span class="dp-widget-sub ${deltaHoje >= 0 ? 'dp-positivo' : 'dp-negativo'}">${deltaHoje !== 0 ? (deltaHoje > 0 ? '▲ ' : '▼ ') + fmt(Math.abs(deltaHoje)) + ' hoje' : 'Sem movimentações hoje'}</span>
        </div>
      </div>`;
  }

  /* ─── Widget: Contatos ─── */
  function buildWidgetContatos() {
    const contatos = (DB.getContatos ? DB.getContatos() : []) || [];
    const hoje = new Date();
    const em7dias = new Date(hoje); em7dias.setDate(hoje.getDate() + 7);
    const aniversariantes = contatos.filter(c => {
      if (!c.dataNascimento) return false;
      try {
        const [, mes, dia] = c.dataNascimento.split('-').map(Number);
        const aniv = new Date(hoje.getFullYear(), mes - 1, dia);
        return aniv >= hoje && aniv <= em7dias;
      } catch (_) { return false; }
    });
    return `
      <div class="dp-widget dp-widget--contatos">
        <div class="dp-widget-icon" data-icon="users" data-size="20"></div>
        <div class="dp-widget-body">
          <span class="dp-widget-label">Contatos</span>
          <span class="dp-widget-valor">${aniversariantes.length > 0 ? `${aniversariantes.length} aniversário${aniversariantes.length > 1 ? 's' : ''} esta semana` : `${contatos.length} contatos`}</span>
          ${aniversariantes[0] ? `<span class="dp-widget-sub">🎂 ${esc(aniversariantes[0].nome)}</span>` : ''}
        </div>
      </div>`;
  }

  /* ─── Tarefas prioritárias ─── */
  function buildTarefas() {
    const todas = (DB.getTarefas ? DB.getTarefas() : []) || [];
    const pendentes = todas
      .filter(t => t.status === 'pendente' || t.status === 'em-andamento')
      .slice(0, 3);

    if (!pendentes.length) {
      return `<div class="dp-tarefas-vazio"><span data-icon="check-circle" data-size="24"></span><p>Nenhuma tarefa pendente 🎉</p></div>`;
    }

    return pendentes.map(t => `
      <label class="dp-tarefa-item">
        <input type="checkbox" class="dp-tarefa-check" data-id="${esc(String(t.id))}"
               onchange="DashboardPessoal.concluirTarefa(this)">
        <span class="dp-tarefa-texto">${esc(t.texto || t.titulo || t.nome || 'Tarefa')}</span>
        ${t.prioridade ? `<span class="dp-tarefa-prioridade dp-prior-${esc(t.prioridade)}">${esc(t.prioridade)}</span>` : ''}
      </label>`).join('');
  }

  function concluirTarefa(checkbox) {
    const id = checkbox.dataset.id;
    if (!id || !DB.saveTarefa) return;
    try {
      DB.saveTarefa({ id, status: 'concluida' });
      const item = checkbox.closest('.dp-tarefa-item');
      if (item) item.classList.add('dp-tarefa--concluida');
    } catch (_) {}
  }

  /* ─── Nota rápida ─── */
  function bindNota() {
    const textarea = document.querySelector('.dp-nota-input');
    if (!textarea) return;
    textarea.value = localStorage.getItem(NOTA_KEY) || '';
    textarea.addEventListener('input', () => {
      clearTimeout(_debounceTimer);
      _debounceTimer = setTimeout(() => {
        localStorage.setItem(NOTA_KEY, textarea.value);
      }, 800);
    });
  }

  /* ─── Render principal ─── */
  function render() {
    const container = document.getElementById('dashboard-content');
    if (!container) return;

    container.innerHTML = `
      <div id="dashboard-pessoal" class="modulo modulo-pessoal">

        <!-- Saudação -->
        <div class="dp-greeting">
          <h1 class="dp-greeting-texto">${getSaudacao()}</h1>
          <p class="dp-greeting-data">${getDataCompleta()}</p>
        </div>

        <!-- Widgets -->
        <div class="dp-widgets-grid">
          ${buildWidgetAgenda()}
          ${buildWidgetSaude()}
          ${buildWidgetFinancas()}
          ${buildWidgetContatos()}
        </div>

        <!-- Timeline do dia -->
        <div class="dp-timeline" id="dp-timeline-widget"></div>

        <!-- Notas fixadas -->
        <div class="dp-notas-widget">
          <h2 class="dp-section-title">
            <span data-icon="pin" data-size="16"></span> Notas fixadas
            <button class="btn btn-ghost btn-sm" style="margin-left:auto" onclick="Router.navigate('notas')">Ver todas</button>
          </h2>
          <div id="dp-notas-widget"></div>
        </div>

        <!-- Tarefas prioritárias -->
        <div class="dp-tarefas">
          <h2 class="dp-section-title"><span data-icon="list-checks" data-size="16"></span> Tarefas prioritárias</h2>
          <div class="dp-tarefas-lista">
            ${buildTarefas()}
          </div>
        </div>

        <!-- Assistente — insights proativos (Task 3.10) -->
        <div class="dp-section">
          <div id="dp-insights-wrapper"></div>
        </div>

        <!-- Nota rápida -->
        <div class="dp-nota">
          <h2 class="dp-section-title"><span data-icon="pencil-line" data-size="16"></span> Nota rápida</h2>
          <textarea class="dp-nota-input" placeholder="Nota rápida do dia..." rows="4"></textarea>
        </div>

      </div>`;

    Icons.render();
    bindNota();
    _renderInsights(container);

    const tlContainer = document.getElementById('dp-timeline-widget');
    if (tlContainer && typeof Timeline !== 'undefined') {
      Timeline.render(tlContainer);
    }

    const notasContainer = document.getElementById('dp-notas-widget');
    if (notasContainer && typeof Notas !== 'undefined') {
      const html = Notas.widget(3);
      notasContainer.innerHTML = html || '<p style="font-size:11px;color:var(--text-muted);padding:var(--s-2)">Nenhuma nota fixada.</p>';
      notasContainer.querySelectorAll('.nota-widget-item').forEach(el => {
        el.addEventListener('click', () => Router.navigate('notas'));
      });
    }
  }

  /* ─── Task 3.10 — Insights do Assistente ─── */
  function _renderInsights(container) {
    const wrapper = container.querySelector('#dp-insights-wrapper');
    if (!wrapper) return;
    if (typeof Assistente === 'undefined') return;

    const insights = Assistente.getInsights().slice(0, 3);
    if (!insights.length) { wrapper.innerHTML = ''; return; }

    wrapper.innerHTML = `
      <h2 class="dp-section-title" style="margin-bottom:var(--s-3)">
        <span data-icon="zap" data-size="16"></span> Assistente
      </h2>
      <div id="dp-insights-lista">${insights.map(_insightCard).join('')}</div>
    `;
    Icons.render(wrapper);

    wrapper.querySelectorAll('[data-dispensar]').forEach(btn => {
      btn.addEventListener('click', () => {
        Assistente.dispensar(btn.dataset.dispensar);
        btn.closest('.dp-insight-card')?.remove();
      });
    });

    wrapper.querySelectorAll('[data-insight-pagina]').forEach(btn => {
      btn.addEventListener('click', () => Router.navigate(btn.dataset.insightPagina));
    });
  }

  function _insightCard(ins) {
    const icones = { alerta: 'alert-triangle', dica: 'lightbulb', conquista: 'trophy', lembrete: 'bell' };
    const cores  = { alerta: 'var(--warning)', dica: 'var(--info)', conquista: 'var(--success)', lembrete: 'var(--color-gold)' };
    const icone  = icones[ins.tipo] || 'zap';
    const cor    = cores[ins.tipo]  || 'var(--info)';

    return `
      <div class="dp-insight-card bento-card" style="display:flex;align-items:flex-start;gap:var(--s-3);padding:var(--s-4);margin-bottom:var(--s-3)">
        <span data-icon="${icone}" data-size="18" style="color:${cor};flex-shrink:0;margin-top:2px"></span>
        <div style="flex:1">
          <p style="font-size:13px;color:var(--text-1);margin:0 0 var(--s-2)">${ins.texto}</p>
          ${ins.acao ? `<button class="btn btn-ghost btn-sm" data-insight-pagina="${esc(ins.acao.pagina)}">${esc(ins.acao.label)}</button>` : ''}
        </div>
        <button class="btn btn-ghost btn-sm" data-dispensar="${esc(ins.id)}" title="Dispensar" style="padding:4px;flex-shrink:0">
          <span data-icon="x" data-size="14"></span>
        </button>
      </div>
    `;
  }

  return { render, concluirTarefa };
})();
