/* ═══════════════════════════════════════════════════════════
   CONTATOS — Agenda com Contexto Duplo (Pessoal + Trabalho)
   Views: Cards · Lista · Kanban | Import/Export vCard & CSV
═══════════════════════════════════════════════════════════ */

const Contatos = (() => {

  /* ── Estado ── */
  let st = {
    view: 'cards',       // 'cards' | 'lista' | 'kanban'
    contexto: 'todos',
    tag: null,
    busca: '',
    ativoId: null,       // detail panel
  };

  /* ── Contextos ── */
  const CTXS = [
    { id: 'pessoal',    label: 'Pessoal',    icon: 'home',        cor: '#7BB6FF' },
    { id: 'trabalho',   label: 'Trabalho',   icon: 'briefcase',   cor: '#A78BFA' },
    { id: 'cliente',    label: 'Cliente',    icon: 'dollar-sign', cor: '#5EE39A' },
    { id: 'parceiro',   label: 'Parceiro',   icon: 'link-2',      cor: '#FB923C' },
    { id: 'fornecedor', label: 'Fornecedor', icon: 'building',    cor: '#FBBF24' },
    { id: 'familia',    label: 'Família',    icon: 'heart',       cor: '#F472B6' },
  ];

  const STAGES = [
    { id: 'prospect',  label: 'Prospect',  cor: 'amber' },
    { id: 'ativo',     label: 'Ativo',     cor: 'green' },
    { id: 'inativo',   label: 'Inativo',   cor: 'muted' },
    { id: 'arquivado', label: 'Arquivado', cor: 'red'   },
  ];

  /* ── Form drawer state ── */
  let _formSt = {
    id: null, tags: [], phoneType: 'celular',
    country: { flag: '🇧🇷', code: '+55', name: 'Brasil' },
  };

  const COUNTRIES = [
    { flag: '🇧🇷', code: '+55',  name: 'Brasil'       },
    { flag: '🇵🇹', code: '+351', name: 'Portugal'      },
    { flag: '🇺🇸', code: '+1',   name: 'EUA / Canadá'  },
    { flag: '🇦🇷', code: '+54',  name: 'Argentina'     },
    { flag: '🇨🇴', code: '+57',  name: 'Colômbia'      },
    { flag: '🇲🇽', code: '+52',  name: 'México'        },
    { flag: '🇦🇴', code: '+244', name: 'Angola'        },
    { flag: '🇲🇿', code: '+258', name: 'Moçambique'    },
  ];

  /* ════════════════════════════════════════════
     RENDER PRINCIPAL
  ════════════════════════════════════════════ */

  function render() {
    const container = document.getElementById('contatos-content');
    if (!container) return;

    container.innerHTML = `
      <div class="ctto-shell" id="ctto-shell">
        <!-- Sidebar esquerda -->
        <aside class="ctto-sidebar" id="ctto-sidebar">
          ${renderSidebarHTML()}
        </aside>

        <!-- Área principal -->
        <div class="ctto-main">
          ${renderToolbarHTML()}
          <div class="ctto-content" id="ctto-content"></div>
        </div>

        <!-- Backdrop sidebar mobile -->
        <div class="ctto-sb-backdrop" id="ctto-sb-backdrop" onclick="Contatos._toggleSidebar()"></div>

        <!-- Painel de detalhe (slide-in) -->
        <div class="ctto-detail-backdrop" id="ctto-backdrop" onclick="Contatos.fecharDetalhe()"></div>
        <aside class="ctto-detail-panel" id="ctto-detail"></aside>
      </div>
    `;

    renderContent();
    bindEvents(container);
    Icons.render(container);

    if (st.ativoId) abrirDetalhe(st.ativoId);
  }

  /* ── Sidebar ── */
  function renderSidebarHTML() {
    const todos = DB.getContatos();
    const counts = {};
    CTXS.forEach(cx => {
      counts[cx.id] = todos.filter(c => (c.contextos || []).includes(cx.id)).length;
    });
    // tags únicas
    const tagMap = {};
    todos.forEach(c => (c.tags || []).forEach(t => { tagMap[t] = (tagMap[t] || 0) + 1; }));
    const tags = Object.entries(tagMap).sort((a, b) => b[1] - a[1]);

    return `
      <div class="ctto-sidebar-inner">
        <div class="ctto-sidebar-section">
          <div class="ctto-sidebar-title">Contexto</div>
          <div class="ctto-ctx-list">
            <button class="ctto-ctx-item ${st.contexto === 'todos' ? 'active' : ''}"
                    onclick="Contatos.setContexto('todos')">
              ${Icons.html('users', 13)}
              <span>Todos</span>
              <span class="ctto-ctx-count">${todos.length}</span>
            </button>
            ${CTXS.map(cx => `
              <button class="ctto-ctx-item ${st.contexto === cx.id ? 'active' : ''}"
                      onclick="Contatos.setContexto('${cx.id}')"
                      style="${st.contexto === cx.id ? `--ctx-cor:${cx.cor}` : ''}">
                <span style="color:${cx.cor}">${Icons.html(cx.icon, 13)}</span>
                <span>${cx.label}</span>
                <span class="ctto-ctx-count">${counts[cx.id] || 0}</span>
              </button>
            `).join('')}
          </div>
        </div>

        ${tags.length ? `
        <div class="ctto-sidebar-section">
          <div class="ctto-sidebar-title">Tags</div>
          <div class="ctto-tag-cloud">
            ${tags.map(([t, n]) => `
              <button class="ctto-tag-pill ${st.tag === t ? 'active' : ''}"
                      onclick="Contatos.setTag('${esc(t)}')">
                ${esc(t)} <span>${n}</span>
              </button>
            `).join('')}
            ${st.tag ? `<button class="ctto-tag-clear" onclick="Contatos.setTag(null)">${Icons.html('x', 10)} Limpar</button>` : ''}
          </div>
        </div>` : ''}

      </div>
    `;
  }

  /* ── Toolbar ── */
  function renderToolbarHTML() {
    const total = getFiltered().length;
    const all   = DB.getContatos().length;
    const hasFilter = st.busca || st.tag || st.contexto !== 'todos';

    return `
      <div class="ctto-toolbar">

        <!-- Linha 1: toggle filtros + busca (desktop: ficam inline na row 1) -->
        <div class="ctto-tb-r1">
          <button class="ctto-sidebar-toggle btn btn-ghost btn-icon"
                  onclick="Contatos._toggleSidebar()"
                  title="Abrir filtros e contextos"
                  aria-label="Filtros">
            ${Icons.html('sliders', 15)}
          </button>

          <div class="ctto-search-wrap" role="search">
            <span class="ctto-search-icon" aria-hidden="true">${Icons.html('search', 14)}</span>
            <input id="ctto-busca" class="ctto-search" type="search"
                   placeholder="Buscar por nome, empresa ou telefone…"
                   value="${esc(st.busca)}"
                   autocomplete="off"
                   aria-label="Buscar contatos">
            ${st.busca
              ? `<button class="ctto-search-clear" onclick="Contatos.setBusca('')" aria-label="Limpar busca" title="Limpar">
                   ${Icons.html('x-circle', 14)}
                 </button>`
              : `<span class="ctto-search-hint">${hasFilter ? total + ' de ' + all : all + (all === 1 ? ' contato' : ' contatos')}</span>`
            }
          </div>

          <!-- Desktop only: importar + exportar aparecem inline -->
          <div class="ctto-tb-acts-desktop">
            <button class="btn btn-ghost btn-sm" onclick="Contatos.abrirImport()"
                    title="Importar contatos (.vcf, .csv, Google Contacts)">
              ${Icons.html('upload', 13)} Importar
            </button>
            <button class="btn btn-ghost btn-sm ctto-export-btn" onclick="Contatos.toggleExportMenu(event)"
                    title="Exportar contatos">
              ${Icons.html('download', 13)} Exportar ${Icons.html('chevron-down', 10)}
            </button>
            <button class="btn btn-primary" onclick="Contatos.abrirForm(null)">
              ${Icons.html('user-plus', 14)} Novo contato
            </button>
          </div>
        </div>

        <!-- Linha 2: view selector (full-width no mobile, inline no desktop) -->
        <div class="ctto-tb-r2">
          <div class="ctto-seg-ctrl" role="group" aria-label="Modo de visualização">
            <button class="ctto-seg-btn ${st.view === 'cards'  ? 'active' : ''}"
                    onclick="Contatos.setView('cards')"
                    aria-pressed="${st.view === 'cards'}"
                    title="Visualizar como cards">
              ${Icons.html('layout-grid', 13)} <span>Cards</span>
            </button>
            <button class="ctto-seg-btn ${st.view === 'lista'  ? 'active' : ''}"
                    onclick="Contatos.setView('lista')"
                    aria-pressed="${st.view === 'lista'}"
                    title="Visualizar como lista">
              ${Icons.html('list', 13)} <span>Lista</span>
            </button>
            <button class="ctto-seg-btn ${st.view === 'kanban' ? 'active' : ''}"
                    onclick="Contatos.setView('kanban')"
                    aria-pressed="${st.view === 'kanban'}"
                    title="Visualizar kanban de clientes">
              ${Icons.html('columns', 13)} <span>Kanban</span>
            </button>
          </div>
        </div>

        <!-- Linha 3: ações secundárias + novo (mobile only) -->
        <div class="ctto-tb-r3">
          <div class="ctto-tb-acts-mobile">
            <button class="btn btn-ghost btn-sm" onclick="Contatos.abrirImport()"
                    title="Importar contatos (.vcf, .csv, Google Contacts)">
              ${Icons.html('upload', 13)} Importar
            </button>
            <button class="btn btn-ghost btn-sm ctto-export-btn" onclick="Contatos.toggleExportMenu(event)"
                    title="Exportar contatos">
              ${Icons.html('download', 13)} Exportar ${Icons.html('chevron-down', 10)}
            </button>
          </div>
          <button class="btn btn-primary ctto-novo-mobile" onclick="Contatos.abrirForm(null)">
            ${Icons.html('user-plus', 14)} Novo contato
          </button>
        </div>

      </div>
    `;
  }

  /* ── Content router ── */
  function renderContent() {
    const el = document.getElementById('ctto-content');
    if (!el) return;
    const lista = getFiltered();

    if (!lista.length) {
      el.innerHTML = `
        <div class="empty" style="padding:var(--s-12) var(--s-6)">
          <div class="empty-icon">${Icons.html('users', 28)}</div>
          <h4>${st.busca || st.tag || st.contexto !== 'todos'
            ? 'Nenhum contato encontrado'
            : 'Nenhum contato ainda'}</h4>
          <p>${st.busca || st.tag || st.contexto !== 'todos'
            ? 'Tente outros filtros.'
            : 'Clique em "Novo contato" ou importe sua agenda.'}</p>
          ${st.contexto !== 'todos' || st.tag || st.busca
            ? `<button class="btn btn-ghost btn-sm" onclick="Contatos.limparFiltros()">Limpar filtros</button>` : ''}
        </div>
      `;
      Icons.render(el);
      return;
    }

    if (st.view === 'cards') renderCards(el, lista);
    else if (st.view === 'lista') renderLista(el, lista);
    else renderKanban(el, lista);
    Icons.render(el);
  }

  /* ══ View: CARDS ══ */
  function renderCards(el, lista) {
    el.innerHTML = `
      <div class="ctto-cards-grid">
        ${lista.map(c => cardHTML(c)).join('')}
      </div>
    `;
  }

  function cardHTML(c) {
    const ini = (c.nome || '?')[0].toUpperCase();
    const cor  = avatarCor(c.nome);
    const tel  = (c.telefone || '').replace(/\D/g, '');
    const ctxs = (c.contextos || []).slice(0, 3);
    const aniLabel = proximoAniversario(c.aniversario);
    const sub  = [c.cargo, c.empresa].filter(Boolean).join(' · ');

    // Monta as ações disponíveis para este contato
    const acts = [];
    if (c.telefone) acts.push(`
      <a class="ctto-act-item ctto-act-call" href="tel:${esc(c.telefone)}"
         onclick="event.stopPropagation()" title="Ligar para ${esc(c.nome)}">
        ${Icons.html('phone', 17)}
        <span>Ligar</span>
      </a>`);
    if (tel) acts.push(`
      <a class="ctto-act-item ctto-act-wa" href="https://wa.me/55${tel}"
         target="_blank" rel="noopener" onclick="event.stopPropagation()" title="WhatsApp">
        ${Icons.html('message-circle', 17)}
        <span>WhatsApp</span>
      </a>`);
    if (c.email) acts.push(`
      <a class="ctto-act-item ctto-act-mail" href="mailto:${esc(c.email)}"
         onclick="event.stopPropagation()" title="Enviar e-mail">
        ${Icons.html('mail', 17)}
        <span>E-mail</span>
      </a>`);
    acts.push(`
      <button class="ctto-act-item ctto-act-edit"
              onclick="event.stopPropagation(); Contatos.abrirForm('${esc(c.id)}')"
              title="Editar contato">
        ${Icons.html('pencil', 17)}
        <span>Editar</span>
      </button>`);
    acts.push(`
      <button class="ctto-act-item ctto-act-del"
              onclick="event.stopPropagation(); Contatos.confirmarDeletar('${esc(c.id)}')"
              title="Excluir contato">
        ${Icons.html('trash-2', 17)}
        <span>Excluir</span>
      </button>`);

    return `
      <div class="ctto-card ${st.ativoId === c.id ? 'active' : ''}"
           data-contact-id="${esc(c.id)}"
           onclick="Contatos.abrirDetalhe('${esc(c.id)}')">

        <div class="ctto-card-header">
          <div class="ctto-avatar ctto-av-card" style="--av-cor:${cor}">${ini}</div>
          <div class="ctto-card-meta">
            <div class="ctto-card-nome">${esc(c.nome)}</div>
            ${sub ? `<div class="ctto-card-sub">${esc(sub)}</div>` : ''}
          </div>
        </div>

        ${ctxs.length || aniLabel ? `
          <div class="ctto-card-chips">
            ${ctxs.map(id => ctxBadge(id)).join('')}
            ${aniLabel ? `<span class="ctto-chip-bday">${Icons.html('cake', 9)} ${aniLabel}</span>` : ''}
          </div>` : ''}

        <div class="ctto-card-actions">
          ${acts.join('')}
        </div>
      </div>
    `;
  }

  /* ══ View: LISTA (Apple-style rows) ══ */
  function renderLista(el, lista) {
    el.innerHTML = `
      <div class="ctto-list-view">
        ${lista.map(c => listRowHTML(c)).join('')}
      </div>
    `;
  }

  function listRowHTML(c) {
    const cor   = avatarCor(c.nome);
    const ini   = (c.nome || '?')[0].toUpperCase();
    const tel   = (c.telefone || '').replace(/\D/g, '');
    const sub   = [c.cargo, c.empresa].filter(Boolean).join(' · ');
    const ctxs  = (c.contextos || []).slice(0, 2);
    const aniLabel = proximoAniversario(c.aniversario);

    return `
      <div class="ctto-row ${st.ativoId === c.id ? 'active' : ''}"
           data-contact-id="${esc(c.id)}"
           onclick="Contatos.abrirDetalhe('${esc(c.id)}')">

        <!-- Avatar -->
        <div class="ctto-avatar ctto-av-row" style="--av-cor:${cor}">${ini}</div>

        <!-- Identidade: nome + sub -->
        <div class="ctto-row-identity">
          <div class="ctto-row-nome">${esc(c.nome)}</div>
          ${sub ? `<div class="ctto-row-sub">${esc(sub)}</div>` : ''}
        </div>

        <!-- Contato + chips (oculto mobile) -->
        <div class="ctto-row-mid">
          ${c.telefone ? `
            <div class="ctto-row-contact-line">
              <span class="ctto-row-contact-icon">${Icons.html('phone', 10)}</span>
              <span>${esc(c.telefone)}</span>
            </div>` : ''}
          ${c.email ? `
            <div class="ctto-row-contact-line ctto-row-email-line">
              <span class="ctto-row-contact-icon">${Icons.html('mail', 10)}</span>
              <span>${esc(c.email)}</span>
            </div>` : ''}
        </div>

        <!-- Contextos (oculto mobile) -->
        <div class="ctto-row-chips">
          ${ctxs.map(id => ctxBadge(id)).join('')}
          ${aniLabel ? `<span class="ctto-chip-bday">${Icons.html('cake', 9)} ${aniLabel}</span>` : ''}
        </div>

        <!-- Ações rápidas -->
        <div class="ctto-row-acts" onclick="event.stopPropagation()">
          ${c.telefone ? `
            <a class="ctto-row-act ctto-row-call" href="tel:${esc(c.telefone)}" title="Ligar">
              ${Icons.html('phone', 14)}
            </a>` : ''}
          ${tel ? `
            <a class="ctto-row-act ctto-row-wa" href="https://wa.me/55${tel}"
               target="_blank" rel="noopener" title="WhatsApp">
              ${Icons.html('message-circle', 14)}
            </a>` : ''}
          ${c.email ? `
            <a class="ctto-row-act ctto-row-mail" href="mailto:${esc(c.email)}" title="E-mail">
              ${Icons.html('mail', 14)}
            </a>` : ''}
          <button class="ctto-row-act ctto-row-edit"
                  onclick="Contatos.abrirForm('${esc(c.id)}')" title="Editar">
            ${Icons.html('pencil', 14)}
          </button>
          <button class="ctto-row-act ctto-row-del"
                  onclick="Contatos.confirmarDeletar('${esc(c.id)}')" title="Excluir">
            ${Icons.html('trash-2', 14)}
          </button>
        </div>

        <!-- Chevron: indica detalhes ao tocar (sempre visível) -->
        <div class="ctto-row-chevron" aria-hidden="true">${Icons.html('chevron-right', 14)}</div>

      </div>
    `;
  }

  /* ══ View: KANBAN ══ */
  function renderKanban(el, lista) {
    const clientes = lista.filter(c => (c.contextos || []).includes('cliente'));
    if (!clientes.length) {
      el.innerHTML = `
        <div class="empty" style="padding:var(--s-12) var(--s-6)">
          <div class="empty-icon">${Icons.html('columns', 26)}</div>
          <h4>Kanban é para contatos com contexto "Cliente"</h4>
          <p>Classifique um contato como <strong>Cliente</strong> para vê-lo aqui.</p>
        </div>
      `;
      Icons.render(el);
      return;
    }

    el.innerHTML = `
      <div class="ctto-kanban">
        ${STAGES.map(stage => {
          const cols = clientes.filter(c => (c.kanbanStage || 'ativo') === stage.id);
          return `
            <div class="ctto-kanban-col">
              <div class="ctto-kanban-header">
                <span class="badge badge-${stage.cor}">${stage.label}</span>
                <span class="ctto-kanban-count">${cols.length}</span>
              </div>
              <div class="ctto-kanban-cards" data-stage="${stage.id}">
                ${cols.map(c => kanbanCardHTML(c)).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function kanbanCardHTML(c) {
    const ini = (c.nome || '?')[0].toUpperCase();
    return `
      <div class="ctto-kb-card" onclick="Contatos.abrirDetalhe('${esc(c.id)}')">
        <div class="ctto-kb-top">
          <div class="ctto-avatar sm" style="--av-cor:${avatarCor(c.nome)}">${ini}</div>
          <div>
            <div class="ctto-kb-nome">${esc(c.nome)}</div>
            ${c.empresa ? `<div class="ctto-kb-empresa">${esc(c.empresa)}</div>` : ''}
          </div>
        </div>
        ${c.telefone ? `<div class="ctto-kb-tel">${Icons.html('phone', 10)} ${esc(c.telefone)}</div>` : ''}
        <div class="ctto-kb-stages">
          ${STAGES.filter(s => s.id !== (c.kanbanStage || 'ativo')).map(s => `
            <button class="ctto-kb-move badge-${s.cor}" title="Mover para ${s.label}"
                    onclick="event.stopPropagation(); Contatos.moverStage('${esc(c.id)}','${s.id}')">
              → ${s.label}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  /* ════════════════════════════════════════════
     DETAIL PANEL
  ════════════════════════════════════════════ */

  function abrirDetalhe(id) {
    st.ativoId = id;
    const c = DB.getContatos().find(x => x.id === id);
    if (!c) return;

    const el = document.getElementById('ctto-detail');
    const backdrop = document.getElementById('ctto-backdrop');
    const shell = document.getElementById('ctto-shell');
    if (!el) return;

    const tel = (c.telefone || '').replace(/\D/g, '');
    const aniLabel = proximoAniversario(c.aniversario);
    const aniFull  = c.aniversario ? fmtAniversario(c.aniversario) : null;

    el.innerHTML = `
      <div class="ctto-detail-inner">
        <div class="ctto-detail-header">
          <button class="btn btn-secondary btn-sm" onclick="Contatos.abrirForm('${esc(c.id)}')">
            ${Icons.html('pencil', 12)} Editar
          </button>
          <button class="btn btn-ghost btn-sm ctto-detail-close-btn" onclick="Contatos.fecharDetalhe()">
            Fechar ${Icons.html('x', 13)}
          </button>
        </div>

        <div class="ctto-detail-hero">
          <div class="ctto-avatar lg" style="--av-cor:${avatarCor(c.nome)}">${(c.nome||'?')[0].toUpperCase()}</div>
          <div class="ctto-detail-nome">${esc(c.nome)}</div>
          ${c.cargo   ? `<div class="ctto-detail-cargo">${esc(c.cargo)}</div>` : ''}
          ${c.empresa ? `<div class="ctto-detail-empresa">${Icons.html('building', 12)} ${esc(c.empresa)}</div>` : ''}
        </div>

        <div class="ctto-detail-ctxs">
          ${(c.contextos || []).map(id => ctxBadge(id, 'md')).join('')}
          ${!(c.contextos||[]).length ? `<span class="muted" style="font-size:var(--t-xs)">Sem contexto</span>` : ''}
        </div>

        <div class="ctto-detail-quick">
          ${c.telefone ? `
            <a href="tel:${esc(c.telefone)}" class="ctto-quick-btn" title="${esc(c.telefone)}">
              ${Icons.html('phone', 16)}
              <span>Ligar</span>
            </a>
            ${tel ? `
            <a href="https://wa.me/55${tel}" target="_blank" rel="noopener" class="ctto-quick-btn ctto-quick-wa">
              ${Icons.html('message-circle', 16)}
              <span>WhatsApp</span>
            </a>` : ''}` : ''}
          ${c.email ? `
            <a href="mailto:${esc(c.email)}" class="ctto-quick-btn">
              ${Icons.html('mail', 16)}
              <span>Email</span>
            </a>` : ''}
        </div>

        <div class="ctto-detail-fields">
          ${c.telefone ? detailField('phone', 'Telefone', c.telefone) : ''}
          ${c.email    ? detailField('mail', 'E-mail', c.email) : ''}
          ${c.empresa  ? detailField('building', 'Empresa', c.empresa) : ''}
          ${c.cargo    ? detailField('briefcase', 'Cargo', c.cargo) : ''}
          ${aniFull    ? detailField('cake', 'Aniversário', `${aniFull}${aniLabel ? ` · <strong>${aniLabel}</strong>` : ''}`) : ''}
          ${c.notas    ? detailField('file-text', 'Notas', c.notas) : ''}
        </div>

        ${(c.tags||[]).length ? `
        <div class="ctto-detail-tags">
          ${(c.tags).map(t => `<span class="ctto-tag-pill">#${esc(t)}</span>`).join('')}
        </div>` : ''}

        ${(c.contextos||[]).includes('cliente') ? `
        <div class="ctto-detail-stage">
          <div class="ctto-detail-stage-label">Estágio no funil</div>
          <div class="ctto-kanban-stages-sel">
            ${STAGES.map(s => `
              <button class="ctto-stage-sel-btn ${(c.kanbanStage||'ativo') === s.id ? 'active badge-' + s.cor : ''}"
                      onclick="Contatos.moverStage('${esc(c.id)}','${s.id}')">
                ${s.label}
              </button>
            `).join('')}
          </div>
        </div>` : ''}

        <div class="ctto-detail-footer">
          <button class="btn btn-danger btn-sm" onclick="Contatos.confirmarDeletar('${esc(c.id)}')">
            ${Icons.html('trash-2', 12)} Excluir
          </button>
          <span class="ctto-detail-date">Criado em ${fmtDate(c.criadoEm)}</span>
        </div>
      </div>
    `;

    el.classList.add('open');
    if (backdrop) backdrop.classList.add('show');
    if (shell) shell.classList.add('detail-open');

    // Atualiza cards sem re-render completo
    document.querySelectorAll('[data-contact-id]').forEach(el2 => {
      el2.classList.toggle('active', el2.dataset.contactId === id);
    });

    Icons.render(el);
  }

  function fecharDetalhe() {
    st.ativoId = null;
    const el = document.getElementById('ctto-detail');
    const backdrop = document.getElementById('ctto-backdrop');
    const shell = document.getElementById('ctto-shell');
    if (el) el.classList.remove('open');
    if (backdrop) backdrop.classList.remove('show');
    if (shell) shell.classList.remove('detail-open');
    document.querySelectorAll('.ctto-card.active, .ctto-lista tbody tr.active').forEach(el2 => el2.classList.remove('active'));
  }

  function detailField(icon, label, value) {
    return `
      <div class="ctto-detail-field">
        <span class="ctto-detail-field-icon">${Icons.html(icon, 12)}</span>
        <div>
          <div class="ctto-detail-field-label">${label}</div>
          <div class="ctto-detail-field-value">${value}</div>
        </div>
      </div>
    `;
  }

  /* ════════════════════════════════════════════
     FORMULÁRIO (criar / editar)
  ════════════════════════════════════════════ */

  /* ── Drawer: abrir ── */
  function abrirForm(id) {
    const c = id ? DB.getContatos().find(x => x.id === id) : null;
    _formSt = {
      id: id || null,
      tags: [...(c?.tags || [])],
      phoneType: c?.phoneType || 'celular',
      country: COUNTRIES[0],
    };

    // Sempre recriar para evitar estado obsoleto
    document.getElementById('ctto-fd-backdrop')?.remove();
    document.getElementById('ctto-fd-drawer')?.remove();

    const backdrop = document.createElement('div');
    backdrop.id = 'ctto-fd-backdrop';
    backdrop.className = 'ctto-form-backdrop';
    backdrop.addEventListener('click', () => Contatos._fecharDrawer());
    document.body.appendChild(backdrop);

    const drawer = document.createElement('div');
    drawer.id = 'ctto-fd-drawer';
    drawer.className = 'ctto-form-drawer';
    document.body.appendChild(drawer);

    drawer.innerHTML = _renderFormHTML(c);
    Icons.render(drawer);

    requestAnimationFrame(() => {
      backdrop.classList.add('open');
      drawer.classList.add('open');
    });

    _renderFormTags();
    _bindFormTagInput();
    setTimeout(() => drawer.querySelector('#cf-nome')?.focus(), 320);
  }

  /* ── Drawer: renderizar HTML ── */
  function _renderFormHTML(c) {
    const nome  = c?.nome || '';
    const avCor = avatarCor(nome);
    const avIni = nome ? nome[0].toUpperCase() : '?';
    const sid   = esc(c?.id || '');
    const ph    = _formSt.phoneType === 'fixo' ? '(11) 9999-9999' : '(11) 9 9999-9999';

    return `
      <div class="ctto-fd-inner">
        <div class="ctto-fd-handle"></div>

        <div class="ctto-fd-header">
          <button class="btn btn-ghost btn-icon" onclick="Contatos._fecharDrawer()" title="Fechar">
            ${Icons.html('arrow-left', 16)}
          </button>
          <span class="ctto-fd-title">${c ? 'Editar contato' : 'Novo contato'}</span>
          <button class="btn btn-primary btn-sm" onclick="Contatos._salvarForm('${sid}')">
            ${Icons.html('check', 13)} Salvar
          </button>
        </div>

        <div class="ctto-fd-avatar-row">
          <div class="ctto-avatar lg ctto-fd-avatar-live" id="ctto-fd-avatar"
               style="--av-cor:${avCor}">${avIni}</div>
          <p class="ctto-fd-avatar-hint">Avatar gerado pelo nome</p>
        </div>

        <div class="ctto-fd-body">

          <!-- Identificação -->
          <div class="ctto-fd-section">
            <div class="ctto-fd-section-label">${Icons.html('user', 11)} Identificação</div>
            <div class="field">
              <label class="field-label">Nome <span class="ctto-req">*</span></label>
              <input id="cf-nome" type="text" class="ctto-fd-input"
                     placeholder="Nome completo" value="${esc(c?.nome || '')}"
                     oninput="Contatos._updateAvatar()">
            </div>
            <div class="ctto-fd-row2">
              <div class="field">
                <label class="field-label">Empresa</label>
                <input id="cf-empresa" type="text" class="ctto-fd-input"
                       placeholder="Organização" value="${esc(c?.empresa || '')}">
              </div>
              <div class="field">
                <label class="field-label">Cargo</label>
                <input id="cf-cargo" type="text" class="ctto-fd-input"
                       placeholder="Função" value="${esc(c?.cargo || '')}">
              </div>
            </div>
          </div>

          <!-- Telefone -->
          <div class="ctto-fd-section">
            <div class="ctto-fd-section-label">${Icons.html('phone', 11)} Telefone</div>
            <div class="ctto-ph-type-row" id="ctto-ph-types">
              ${[
                { id: 'celular',  icon: 'smartphone',     label: 'Celular'  },
                { id: 'fixo',     icon: 'phone',          label: 'Fixo'     },
                { id: 'whatsapp', icon: 'message-circle', label: 'WhatsApp' },
              ].map(t => `
                <button class="ctto-ph-type-btn ${_formSt.phoneType === t.id ? 'active' : ''}"
                        data-type="${t.id}"
                        onclick="Contatos._setPhoneType('${t.id}', this)">
                  ${Icons.html(t.icon, 11)} ${t.label}
                </button>
              `).join('')}
            </div>
            <div class="ctto-phone-field">
              <button class="ctto-country-btn" onclick="Contatos._toggleCountry(event)" title="Código do país">
                <span id="ctto-flag">${_formSt.country.flag}</span>
                <span id="ctto-code" class="ctto-country-code">${_formSt.country.code}</span>
                ${Icons.html('chevron-down', 9)}
              </button>
              <input id="cf-tel" type="tel" class="ctto-fd-input ctto-tel-input"
                     placeholder="${ph}" value="${esc(c?.telefone || '')}"
                     oninput="Contatos._maskTel(this)">
            </div>
          </div>

          <!-- Contato digital -->
          <div class="ctto-fd-section">
            <div class="ctto-fd-section-label">${Icons.html('at-sign', 11)} Contato digital</div>
            <div class="ctto-fd-row2">
              <div class="field">
                <label class="field-label">E-mail</label>
                <input id="cf-email" type="email" class="ctto-fd-input"
                       placeholder="email@exemplo.com" value="${esc(c?.email || '')}">
              </div>
              <div class="field">
                <label class="field-label">Aniversário</label>
                <input id="cf-ani" type="date" class="ctto-fd-input"
                       value="${esc(c?.aniversario || '')}">
              </div>
            </div>
          </div>

          <!-- Classificação -->
          <div class="ctto-fd-section">
            <div class="ctto-fd-section-label">${Icons.html('layers', 11)} Classificação</div>
            <label class="field-label" style="margin-bottom:var(--s-2)">Contexto</label>
            <div class="ctto-ctx-chips-row">
              ${CTXS.map(cx => `
                <button class="ctto-ctx-chip-btn ${(c?.contextos||[]).includes(cx.id) ? 'active' : ''}"
                        data-ctx="${cx.id}" style="--cx-cor:${cx.cor}"
                        onclick="this.classList.toggle('active')">
                  ${Icons.html(cx.icon, 12)} ${cx.label}
                </button>
              `).join('')}
            </div>
            <label class="field-label" style="margin:var(--s-4) 0 var(--s-2)">Tags</label>
            <div class="ctto-tags-field" id="ctto-tags-wrap"
                 onclick="document.getElementById('cf-tags-input')?.focus()">
              <div class="ctto-tags-chips" id="ctto-tag-chips"></div>
              <input id="cf-tags-input" class="ctto-tags-input"
                     type="text" placeholder="${_formSt.tags.length ? '' : 'Adicionar tag…'}"
                     autocomplete="off">
            </div>
            <p class="ctto-fd-hint">Enter ou vírgula para adicionar · clique no chip para remover</p>
          </div>

          <!-- Notas -->
          <div class="ctto-fd-section">
            <div class="ctto-fd-section-label">${Icons.html('file-text', 11)} Notas</div>
            <textarea id="cf-notas" class="ctto-fd-input ctto-fd-textarea"
                      rows="3" placeholder="Observações, histórico, informações importantes…">${esc(c?.notas || '')}</textarea>
          </div>

        </div>

        <div class="ctto-fd-footer">
          <button class="btn btn-ghost" onclick="Contatos._fecharDrawer()">Cancelar</button>
          <button class="btn btn-primary" onclick="Contatos._salvarForm('${sid}')">
            ${Icons.html('check', 13)} Salvar contato
          </button>
        </div>
      </div>
    `;
  }

  /* ── Drawer: fechar ── */
  function _fecharDrawer() {
    const backdrop = document.getElementById('ctto-fd-backdrop');
    const drawer   = document.getElementById('ctto-fd-drawer');
    if (backdrop) backdrop.classList.remove('open');
    if (drawer)   drawer.classList.remove('open');
    setTimeout(() => {
      backdrop?.remove();
      drawer?.remove();
    }, 400);
  }

  /* ── Avatar ao vivo ── */
  function _updateAvatar() {
    const nome = document.getElementById('cf-nome')?.value || '';
    const av   = document.getElementById('ctto-fd-avatar');
    if (!av) return;
    av.textContent = nome ? nome[0].toUpperCase() : '?';
    av.style.setProperty('--av-cor', avatarCor(nome));
  }

  /* ── Tipo de telefone ── */
  function _setPhoneType(type, btn) {
    _formSt.phoneType = type;
    document.querySelectorAll('.ctto-ph-type-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const input = document.getElementById('cf-tel');
    if (input) {
      input.placeholder = type === 'fixo' ? '(11) 9999-9999' : '(11) 9 9999-9999';
      input.value = '';
    }
  }

  /* ── País ── */
  function _toggleCountry(e) {
    e.stopPropagation();
    const existing = document.getElementById('ctto-country-dd');
    if (existing) { existing.remove(); return; }
    const btn  = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const dd   = document.createElement('div');
    dd.id = 'ctto-country-dd';
    dd.className = 'ctto-country-dropdown';
    dd.style.cssText = `top:${rect.bottom + 4}px;left:${rect.left}px`;
    dd.innerHTML = COUNTRIES.map(cn => `
      <button onclick="Contatos._selectCountry('${cn.code}','${cn.flag}')">
        <span class="ctto-dd-flag">${cn.flag}</span>
        <span class="ctto-dd-code">${cn.code}</span>
        <span class="ctto-dd-name">${cn.name}</span>
      </button>
    `).join('');
    document.body.appendChild(dd);
    setTimeout(() => document.addEventListener('click', () => dd.remove(), { once: true }), 0);
  }

  function _selectCountry(code, flag) {
    _formSt.country = COUNTRIES.find(c => c.code === code) || COUNTRIES[0];
    const f = document.getElementById('ctto-flag');
    const c = document.getElementById('ctto-code');
    if (f) f.textContent = flag;
    if (c) c.textContent = code;
    document.getElementById('ctto-country-dd')?.remove();
  }

  /* ── Máscara de telefone ── */
  function _maskTel(input) {
    const d = input.value.replace(/\D/g, '');
    if (_formSt.phoneType === 'fixo') {
      const s = d.slice(0, 10);
      let v = '';
      if (s.length > 0) v  = '(' + s.slice(0, 2);
      if (s.length > 2) v += ') ' + s.slice(2, 6);
      if (s.length > 6) v += '-' + s.slice(6, 10);
      input.value = v;
    } else {
      const s = d.slice(0, 11);
      let v = '';
      if (s.length > 0) v  = '(' + s.slice(0, 2);
      if (s.length > 2) v += ') ' + s.slice(2, 3);
      if (s.length > 3) v += ' ' + s.slice(3, 7);
      if (s.length > 7) v += '-' + s.slice(7, 11);
      input.value = v;
    }
  }

  /* ── Tags chip input ── */
  function _addFormTag(val) {
    const tag = val.trim().replace(/^#/, '').toLowerCase();
    if (!tag || _formSt.tags.includes(tag)) return;
    _formSt.tags.push(tag);
    _renderFormTags();
    const inp = document.getElementById('cf-tags-input');
    if (inp) { inp.value = ''; inp.placeholder = ''; }
  }

  function _removeFormTag(tag) {
    _formSt.tags = _formSt.tags.filter(t => t !== tag);
    _renderFormTags();
    if (!_formSt.tags.length) {
      const inp = document.getElementById('cf-tags-input');
      if (inp) inp.placeholder = 'Adicionar tag…';
    }
  }

  function _renderFormTags() {
    const el = document.getElementById('ctto-tag-chips');
    if (!el) return;
    el.innerHTML = _formSt.tags.map(t => `
      <span class="ctto-chip-tag">
        #${esc(t)}
        <button class="ctto-chip-remove" onclick="Contatos._removeFormTag('${esc(t)}')" title="Remover">×</button>
      </span>
    `).join('');
  }

  function _bindFormTagInput() {
    const inp = document.getElementById('cf-tags-input');
    if (!inp) return;
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        if (inp.value.trim()) _addFormTag(inp.value);
      } else if (e.key === 'Backspace' && !inp.value && _formSt.tags.length) {
        _removeFormTag(_formSt.tags[_formSt.tags.length - 1]);
      }
    });
    inp.addEventListener('blur', () => { if (inp.value.trim()) _addFormTag(inp.value); });
  }

  /* ── Salvar ── */
  function _salvarForm(id) {
    const nome = document.getElementById('cf-nome')?.value.trim();
    if (!nome) {
      Toast.warning('Campo obrigatório', 'Informe o nome do contato.');
      document.getElementById('cf-nome')?.focus();
      return;
    }

    const contextos = Array.from(
      document.querySelectorAll('.ctto-ctx-chip-btn.active[data-ctx]')
    ).map(b => b.dataset.ctx);

    const data = {
      nome,
      empresa:     document.getElementById('cf-empresa')?.value.trim()  || '',
      cargo:       document.getElementById('cf-cargo')?.value.trim()    || '',
      telefone:    document.getElementById('cf-tel')?.value.trim()      || '',
      phoneType:   _formSt.phoneType,
      email:       document.getElementById('cf-email')?.value.trim()    || '',
      aniversario: document.getElementById('cf-ani')?.value             || null,
      notas:       document.getElementById('cf-notas')?.value.trim()    || '',
      contextos,
      tags: [..._formSt.tags],
    };

    if (id) data.id = id;

    DB.saveContato(data);
    _fecharDrawer();
    Toast.success(id ? 'Contato atualizado' : 'Contato salvo', nome);
    render();
    if (id) setTimeout(() => abrirDetalhe(id), 50);
  }

  /* ════════════════════════════════════════════
     IMPORT
  ════════════════════════════════════════════ */

  function abrirImport() {
    Modal.open(`
      <div class="modal-header">
        <h3>${Icons.html('upload', 16)} Importar contatos</h3>
      </div>
      <div class="modal-body">
        <div class="ctto-import-tabs" id="ctto-imp-tabs">
          <button class="ctto-imp-tab active" onclick="Contatos._impTab(this,'vcf')">
            ${Icons.html('file-text', 13)} vCard (.vcf)
          </button>
          <button class="ctto-imp-tab" onclick="Contatos._impTab(this,'csv')">
            ${Icons.html('table', 13)} CSV
          </button>
          <button class="ctto-imp-tab" onclick="Contatos._impTab(this,'google')">
            ${Icons.html('globe', 13)} Google
          </button>
        </div>

        <!-- vCard -->
        <div id="ctto-imp-vcf" class="ctto-imp-panel">
          <div class="ctto-drop-zone" id="ctto-vcf-drop">
            ${Icons.html('file-text', 32)}
            <p>Arraste um arquivo <strong>.vcf</strong> aqui</p>
            <p class="muted">ou</p>
            <label class="btn btn-secondary btn-sm">
              Selecionar arquivo
              <input type="file" accept=".vcf,text/vcard" style="display:none" onchange="Contatos._onVcfFile(this)">
            </label>
            <p class="ctto-drop-hint">Compatível com Google Contacts, iPhone, Android e Outlook</p>
          </div>
          <div id="ctto-imp-preview" style="display:none"></div>
        </div>

        <!-- CSV -->
        <div id="ctto-imp-csv" class="ctto-imp-panel" style="display:none">
          <div class="ctto-drop-zone" id="ctto-csv-drop">
            ${Icons.html('table', 32)}
            <p>Arraste um arquivo <strong>.csv</strong> aqui</p>
            <p class="muted">Formato Google Contacts Export ou padrão Mentor24h</p>
            <label class="btn btn-secondary btn-sm">
              Selecionar arquivo
              <input type="file" accept=".csv,text/csv" style="display:none" onchange="Contatos._onCsvFile(this)">
            </label>
          </div>
          <div id="ctto-csv-preview" style="display:none"></div>
        </div>

        <!-- Google -->
        <div id="ctto-imp-google" class="ctto-imp-panel" style="display:none">
          <div class="ctto-google-info">
            ${Icons.html('info', 20)}
            <div>
              <h4>Sincronização com Google Contacts</h4>
              <p>Para sincronizar sua agenda do Google diretamente, é necessário configurar um <strong>Client ID</strong> do Google Cloud.</p>
              <ol class="ctto-google-steps">
                <li>Acesse <strong>console.cloud.google.com</strong></li>
                <li>Crie um projeto e ative a <strong>People API</strong></li>
                <li>Crie uma credencial OAuth 2.0 (Aplicativo Web)</li>
                <li>Adicione <strong>${location.origin}</strong> nas origens autorizadas</li>
                <li>Cole o Client ID abaixo e clique em Conectar</li>
              </ol>
              <div class="field" style="margin-top:var(--s-4)">
                <label class="field-label">Google Client ID</label>
                <input id="ctto-google-cid" type="text" placeholder="xxxxxxxx.apps.googleusercontent.com"
                       value="${esc(DB.getConfig().googleClientId || '')}">
              </div>
              <button class="btn btn-primary btn-sm" style="margin-top:var(--s-3)"
                      onclick="Contatos._conectarGoogle()">
                ${Icons.html('globe', 13)} Conectar Google Contacts
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="Modal.close()">Fechar</button>
      </div>
    `, 'modal-lg');
    Icons.render(document.querySelector('.modal-content'));
    _bindDropZones();
  }

  function _impTab(btn, tab) {
    document.querySelectorAll('.ctto-imp-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.ctto-imp-panel').forEach(p => p.style.display = 'none');
    document.getElementById(`ctto-imp-${tab}`).style.display = '';
  }

  function _bindDropZones() {
    ['ctto-vcf-drop', 'ctto-csv-drop'].forEach(id => {
      const zone = document.getElementById(id);
      if (!zone) return;
      zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
      zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
      zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (!file) return;
        if (id === 'ctto-vcf-drop') _processVcfFile(file);
        else _processCsvFile(file);
      });
    });
  }

  function _onVcfFile(input) {
    if (input.files[0]) _processVcfFile(input.files[0]);
  }

  function _onCsvFile(input) {
    if (input.files[0]) _processCsvFile(input.files[0]);
  }

  function _processVcfFile(file) {
    const reader = new FileReader();
    reader.onload = e => {
      const contatos = parseVCF(e.target.result);
      _mostrarPreviewImport(contatos, 'ctto-imp-preview', 'vcf');
    };
    reader.readAsText(file, 'UTF-8');
  }

  function _processCsvFile(file) {
    const reader = new FileReader();
    reader.onload = e => {
      const contatos = parseCSV(e.target.result);
      _mostrarPreviewImport(contatos, 'ctto-csv-preview', 'csv');
    };
    reader.readAsText(file, 'UTF-8');
  }

  function _mostrarPreviewImport(contatos, previewId, tipo) {
    const el = document.getElementById(previewId);
    if (!el) return;

    const existentes = DB.getContatos();
    const duplicatas = contatos.filter(c =>
      existentes.some(e =>
        (c.telefone && e.telefone === c.telefone) ||
        (c.email && e.email === c.email)
      )
    );

    el.style.display = '';
    el.innerHTML = `
      <div class="ctto-imp-result">
        <div class="ctto-imp-stats">
          ${Icons.html('users', 16)}
          <strong>${contatos.length}</strong> contato${contatos.length !== 1 ? 's' : ''} encontrado${contatos.length !== 1 ? 's' : ''}
          ${duplicatas.length ? `<span class="badge badge-amber">${duplicatas.length} possível duplicata${duplicatas.length !== 1 ? 's' : ''}</span>` : ''}
        </div>
        <div class="ctto-imp-list">
          ${contatos.slice(0, 8).map(c => `
            <div class="ctto-imp-item">
              <div class="ctto-avatar sm" style="--av-cor:${avatarCor(c.nome)}">${(c.nome||'?')[0].toUpperCase()}</div>
              <div>
                <div class="ctto-imp-nome">${esc(c.nome)}</div>
                <div class="ctto-imp-sub">${[c.empresa, c.telefone, c.email].filter(Boolean).join(' · ')}</div>
              </div>
            </div>
          `).join('')}
          ${contatos.length > 8 ? `<div class="ctto-imp-more">+ ${contatos.length - 8} contatos…</div>` : ''}
        </div>
        <div style="display:flex;gap:var(--s-3);margin-top:var(--s-4)">
          <button class="btn btn-primary" onclick="Contatos._confirmarImport(${JSON.stringify(contatos).replace(/"/g, '&quot;')})">
            ${Icons.html('check', 13)} Importar tudo
          </button>
          ${duplicatas.length ? `
          <button class="btn btn-secondary" onclick="Contatos._confirmarImport(${JSON.stringify(contatos.filter(c => !existentes.some(e => (c.telefone && e.telefone===c.telefone)||(c.email && e.email===c.email)))).replace(/"/g, '&quot;')})">
            Importar sem duplicatas
          </button>` : ''}
        </div>
      </div>
    `;
    Icons.render(el);
  }

  function _confirmarImport(contatos) {
    let importados = 0;
    contatos.forEach(c => {
      if (c.nome) { DB.saveContato(c); importados++; }
    });
    Modal.close();
    Toast.success(`${importados} contatos importados`);
    render();
  }

  function _conectarGoogle() {
    const cid = document.getElementById('ctto-google-cid')?.value.trim();
    if (!cid) { Toast.warning('Client ID obrigatório'); return; }
    DB.saveConfig({ googleClientId: cid });
    Toast.info('Client ID salvo. A sincronização com Google está em implementação.');
  }

  /* ════════════════════════════════════════════
     PARSERS
  ════════════════════════════════════════════ */

  function parseVCF(text) {
    text = text.replace(/\r?\n[\t ]/g, ''); // unfold
    const cards = [];
    const blocks = text.split(/BEGIN:VCARD/i).slice(1);
    for (const block of blocks) {
      const c = {};
      for (const line of block.split(/\r?\n/)) {
        if (!line || /^END:VCARD/i.test(line)) continue;
        const ci = line.indexOf(':');
        if (ci < 0) continue;
        const key = line.slice(0, ci).toUpperCase();
        const val = line.slice(ci + 1).trim();
        if (key === 'FN' || key.startsWith('FN;'))            c.nome      = val;
        else if (key.startsWith('TEL'))                       c.telefone  = val.replace(/[^\d+]/g, '').replace(/^55/, '').slice(-11);
        else if (key.startsWith('EMAIL'))                     c.email     = val;
        else if (key === 'ORG' || key.startsWith('ORG;'))     c.empresa   = val.replace(/;.*/, '').trim();
        else if (key === 'TITLE' || key.startsWith('TITLE;')) c.cargo     = val;
        else if (key === 'BDAY' || key.startsWith('BDAY;'))   c.aniversario = normalizeBday(val);
        else if (key === 'NOTE' || key.startsWith('NOTE;'))   c.notas     = val;
      }
      if (c.nome) cards.push({ tags: [], contextos: [], ...c });
    }
    return cards;
  }

  function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
    const contatos = [];

    for (let i = 1; i < lines.length; i++) {
      const vals = splitCSVLine(lines[i]);
      const row = Object.fromEntries(headers.map((h, j) => [h, vals[j] || '']));
      const nome = row['Name'] || row['nome'] || row['Given Name'] || '';
      if (!nome) continue;
      contatos.push({
        nome,
        empresa:    row['Organization 1 - Name'] || row['empresa'] || '',
        cargo:      row['Organization 1 - Title']  || row['cargo']   || '',
        telefone:   row['Phone 1 - Value']          || row['telefone']|| '',
        email:      row['E-mail 1 - Value']         || row['email']   || '',
        aniversario:normalizeBday(row['Birthday']   || row['aniversario'] || ''),
        notas:      row['Notes']                    || row['notas']   || '',
        tags: [], contextos: [],
      });
    }
    return contatos;
  }

  function splitCSVLine(line) {
    const vals = []; let cur = ''; let inQ = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') { inQ = !inQ; continue; }
      if (line[i] === ',' && !inQ) { vals.push(cur); cur = ''; continue; }
      cur += line[i];
    }
    vals.push(cur);
    return vals.map(v => v.trim());
  }

  /* ════════════════════════════════════════════
     EXPORT
  ════════════════════════════════════════════ */

  function toggleExportMenu(e) {
    e.stopPropagation();
    const existing = document.getElementById('ctto-export-menu');
    if (existing) { existing.remove(); return; }
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();

    const menu = document.createElement('div');
    menu.id = 'ctto-export-menu';
    menu.className = 'ctto-export-menu';
    menu.style.cssText = `top:${rect.bottom + 6}px;right:${window.innerWidth - rect.right}px`;
    menu.innerHTML = `
      <div class="ctto-exp-section">Todos os contatos</div>
      <button onclick="Contatos._exportVcf(null)">   ${Icons.html('file-text',12)} Exportar .vcf</button>
      <button onclick="Contatos._exportCsv(null)">   ${Icons.html('table',12)} Exportar .csv</button>
      <button onclick="Contatos._exportJson()">      ${Icons.html('download',12)} Backup JSON</button>
      <div class="ctto-exp-sep"></div>
      <div class="ctto-exp-section">Por contexto</div>
      ${CTXS.map(cx => `
        <button onclick="Contatos._exportVcf('${cx.id}')">
          <span style="color:${cx.cor}">${Icons.html(cx.icon,12)}</span> ${cx.label} (.vcf)
        </button>
      `).join('')}
    `;
    document.body.appendChild(menu);
    Icons.render(menu);
    setTimeout(() => document.addEventListener('click', () => menu.remove(), { once: true }), 0);
  }

  function _exportVcf(contexto) {
    let lista = DB.getContatos();
    if (contexto) lista = lista.filter(c => (c.contextos||[]).includes(contexto));
    if (!lista.length) { Toast.warning('Nenhum contato para exportar'); return; }
    const vcf = lista.map(c => toVCF(c)).join('\r\n\r\n');
    download(vcf, `contatos${contexto ? '-' + contexto : ''}.vcf`, 'text/vcard;charset=utf-8');
    Toast.success(`${lista.length} contatos exportados`);
  }

  function _exportCsv(contexto) {
    let lista = DB.getContatos();
    if (contexto) lista = lista.filter(c => (c.contextos||[]).includes(contexto));
    if (!lista.length) { Toast.warning('Nenhum contato para exportar'); return; }
    const headers = ['nome','empresa','cargo','telefone','email','aniversario','contextos','tags','notas'];
    const rows = lista.map(c => headers.map(h => {
      const v = Array.isArray(c[h]) ? c[h].join(';') : (c[h] || '');
      return `"${String(v).replace(/"/g, '""')}"`;
    }).join(','));
    download([headers.join(','), ...rows].join('\n'),
      `contatos${contexto ? '-' + contexto : ''}.csv`, 'text/csv;charset=utf-8');
    Toast.success(`${lista.length} contatos exportados`);
  }

  function _exportJson() {
    const lista = DB.getContatos();
    download(JSON.stringify(lista, null, 2), 'contatos-backup.json', 'application/json');
    Toast.success(`Backup de ${lista.length} contatos gerado`);
  }

  function toVCF(c) {
    const lines = ['BEGIN:VCARD', 'VERSION:3.0'];
    lines.push(`FN:${c.nome || ''}`);
    const parts = (c.nome || '').trim().split(' ');
    const last = parts.length > 1 ? parts.pop() : '';
    lines.push(`N:${last};${parts.join(' ')};;;`);
    if (c.telefone)    lines.push(`TEL;TYPE=CELL:${c.telefone}`);
    if (c.email)       lines.push(`EMAIL;TYPE=INTERNET:${c.email}`);
    if (c.empresa)     lines.push(`ORG:${c.empresa}`);
    if (c.cargo)       lines.push(`TITLE:${c.cargo}`);
    if (c.aniversario) lines.push(`BDAY:${c.aniversario.replace(/-/g, '')}`);
    if (c.notas)       lines.push(`NOTE:${c.notas}`);
    if ((c.contextos||[]).length) lines.push(`CATEGORIES:${c.contextos.join(',')}`);
    lines.push('END:VCARD');
    return lines.join('\r\n');
  }

  /* ════════════════════════════════════════════
     CRUD / AÇÕES
  ════════════════════════════════════════════ */

  function confirmarDeletar(id) {
    const c = DB.getContatos().find(x => x.id === id);
    if (!c) return;
    Modal.confirm(
      'Excluir contato?',
      `"${c.nome}" será removido permanentemente.`,
      () => { DB.deleteContato(id); Toast.success('Contato excluído'); fecharDetalhe(); render(); },
      'Excluir'
    );
  }

  function moverStage(id, stage) {
    DB.saveContato({ id, kanbanStage: stage });
    const c = DB.getContatos().find(x => x.id === id);
    Toast.success(`${c?.nome} → ${STAGES.find(s => s.id === stage)?.label}`);
    renderContent();
    if (st.ativoId === id) abrirDetalhe(id);
  }

  /* ════════════════════════════════════════════
     FILTROS
  ════════════════════════════════════════════ */

  function setView(v)     { st.view = v; renderContent(); _refreshSidebar(); _refreshToolbar(); }
  function setContexto(c) { st.contexto = c; st.tag = null; renderContent(); _refreshSidebar(); _closeSidebarMobile(); }
  function setTag(t)      { st.tag = t; renderContent(); _refreshSidebar(); _closeSidebarMobile(); }
  function setBusca(v)    { st.busca = v; const el = document.getElementById('ctto-busca'); if (el) el.value = v; renderContent(); _refreshToolbar(); }
  function limparFiltros(){ st.contexto = 'todos'; st.tag = null; st.busca = ''; render(); }

  function _toggleSidebar() {
    const sb = document.getElementById('ctto-sidebar');
    const bd = document.getElementById('ctto-sb-backdrop');
    if (!sb) return;
    const isOpen = sb.classList.toggle('mobile-open');
    if (bd) bd.classList.toggle('show', isOpen);
  }

  function _closeSidebarMobile() {
    const sb = document.getElementById('ctto-sidebar');
    const bd = document.getElementById('ctto-sb-backdrop');
    if (sb) sb.classList.remove('mobile-open');
    if (bd) bd.classList.remove('show');
  }

  function getFiltered() { return DB.getContatos({ contexto: st.contexto, tag: st.tag, busca: st.busca }); }

  function _refreshSidebar() {
    const el = document.getElementById('ctto-sidebar');
    if (el) { el.innerHTML = renderSidebarHTML(); Icons.render(el); }
  }

  function _refreshToolbar() {
    const old = document.querySelector('.ctto-toolbar');
    if (!old) return;
    const parent = old.parentElement;
    old.remove();
    parent.insertAdjacentHTML('afterbegin', renderToolbarHTML());
    const nw = parent.querySelector('.ctto-toolbar');
    bindToolbar(nw);
    Icons.render(nw);
  }

  /* ════════════════════════════════════════════
     BIND EVENTS
  ════════════════════════════════════════════ */

  function bindEvents(container) {
    bindToolbar(container.querySelector('.ctto-toolbar'));
  }

  function bindToolbar(toolbar) {
    if (!toolbar) return;
    toolbar.querySelector('#ctto-busca')?.addEventListener('input', e => {
      st.busca = e.target.value;
      renderContent();
      const clear = toolbar.querySelector('.ctto-search-clear');
      if (clear) clear.style.display = st.busca ? '' : 'none';
    });
  }

  /* ════════════════════════════════════════════
     HELPERS
  ════════════════════════════════════════════ */

  function ctxBadge(id, size = 'sm') {
    const cx = CTXS.find(c => c.id === id);
    if (!cx) return '';
    return `<span class="ctto-ctx-badge ctto-ctx-badge-${size}" style="--ctx-cor:${cx.cor}">
      ${Icons.html(cx.icon, size === 'md' ? 11 : 9)} ${cx.label}
    </span>`;
  }

  function avatarCor(str) {
    const p = ['#A78BFA','#F472B6','#FB923C','#5EE39A','#7BB6FF','#FBBF24','#22D3EE','#D4A574'];
    let h = 0;
    for (let i = 0; i < (str||'').length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xFFFF;
    return p[h % p.length];
  }

  function normalizeBday(val) {
    if (!val) return null;
    // YYYYMMDD → YYYY-MM-DD
    if (/^\d{8}$/.test(val)) return `${val.slice(0,4)}-${val.slice(4,6)}-${val.slice(6,8)}`;
    // MM/DD/YYYY
    const m = val.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (m) return `${m[3]}-${m[1].padStart(2,'0')}-${m[2].padStart(2,'0')}`;
    // already YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    return null;
  }

  function proximoAniversario(ani) {
    if (!ani) return null;
    const [, m, d] = (ani || '').split('-');
    if (!m || !d) return null;
    const hoje = new Date();
    const ano  = hoje.getFullYear();
    let prox   = new Date(ano, parseInt(m) - 1, parseInt(d));
    if (prox < hoje) prox = new Date(ano + 1, parseInt(m) - 1, parseInt(d));
    const diff = Math.round((prox - hoje) / 86400000);
    if (diff === 0) return '🎂 Hoje!';
    if (diff === 1) return '🎂 Amanhã';
    if (diff <= 7)  return `🎂 em ${diff} dias`;
    if (diff <= 30) return `🎂 em ${diff} dias`;
    return null; // não exibe se longe
  }

  function fmtAniversario(ani) {
    if (!ani) return null;
    const [, m, d] = ani.split('-');
    if (!m || !d) return null;
    const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    return `${parseInt(d)} de ${meses[parseInt(m) - 1]}`;
  }

  function fmtDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('pt-BR');
  }

  function download(content, filename, mime) {
    const blob = new Blob([content], { type: mime });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  /* ── Public API ── */
  return {
    render, setView, setContexto, setTag, setBusca, limparFiltros,
    abrirDetalhe, fecharDetalhe,
    abrirForm, _salvarForm, _fecharDrawer,
    _updateAvatar, _setPhoneType, _toggleCountry, _selectCountry, _maskTel,
    _addFormTag, _removeFormTag,
    confirmarDeletar, moverStage,
    abrirImport, _impTab, _onVcfFile, _onCsvFile, _confirmarImport,
    toggleExportMenu, _exportVcf, _exportCsv, _exportJson,
    _conectarGoogle, _toggleSidebar,
  };
})();
