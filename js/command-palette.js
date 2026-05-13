/* ═══════════════════════════════════════════════════════════
   COMMAND PALETTE — Ctrl+K / ⌘K global
═══════════════════════════════════════════════════════════ */

const CommandPalette = (() => {
  const COMMANDS = [
    /* Navegação */
    { id: 'nav-dash',    label: 'Dashboard',         group: 'Navegar', icon: 'layout-dashboard', action: () => Router.navigate('dashboard') },
    { id: 'nav-chat-ai', label: 'Chat AI',            group: 'Navegar', icon: 'bot',             action: () => Router.navigate('chat-ai') },
    { id: 'nav-chat-wa', label: 'Chat WhatsApp',      group: 'Navegar', icon: 'message-circle',  action: () => Router.navigate('chat-wa') },
    { id: 'nav-prod',    label: 'Produtos',           group: 'Navegar', icon: 'package',         action: () => Router.navigate('produtos') },
    { id: 'nav-vend',    label: 'Vendas',             group: 'Navegar', icon: 'shopping-cart',   action: () => Router.navigate('vendas') },
    { id: 'nav-estq',    label: 'Estoque',            group: 'Navegar', icon: 'archive',         action: () => Router.navigate('estoque') },
    { id: 'nav-cli',     label: 'Clientes',           group: 'Navegar', icon: 'users',           action: () => Router.navigate('clientes') },
    { id: 'nav-cont',    label: 'Contas a Pagar',     group: 'Navegar', icon: 'receipt',         action: () => Router.navigate('contas') },
    { id: 'nav-tx',      label: 'Transações',         group: 'Navegar', icon: 'arrow-left-right',action: () => Router.navigate('transacoes') },
    { id: 'nav-meta',    label: 'Metas de Poupança',  group: 'Navegar', icon: 'target',          action: () => Router.navigate('metas') },
    { id: 'nav-agd',     label: 'Agenda',             group: 'Navegar', icon: 'calendar',        action: () => Router.navigate('agenda') },
    { id: 'nav-med',     label: 'Medicamentos',       group: 'Navegar', icon: 'pill',            action: () => Router.navigate('medicamentos') },
    { id: 'nav-trf',     label: 'Tarefas',            group: 'Navegar', icon: 'check-square',    action: () => Router.navigate('tarefas') },
    { id: 'nav-ctto',    label: 'Contatos',           group: 'Navegar', icon: 'users',           action: () => Router.navigate('contatos') },
    { id: 'nav-cfg',     label: 'Configurações',      group: 'Navegar', icon: 'settings-2',      action: () => Router.navigate('config') },
    /* Ações rápidas */
    { id: 'add-conta',   label: 'Nova conta a pagar', group: 'Criar', icon: 'plus-circle', action: () => { Router.navigate('contas'); setTimeout(() => Modal.novaConta(), 100); } },
    { id: 'add-tx',      label: 'Nova transação',     group: 'Criar', icon: 'plus-circle', action: () => { Router.navigate('transacoes'); setTimeout(() => Modal.novaTransacao(), 100); } },
    { id: 'add-meta',    label: 'Nova meta',          group: 'Criar', icon: 'plus-circle', action: () => { Router.navigate('metas'); setTimeout(() => Modal.novaMeta(), 100); } },
    { id: 'add-chat',    label: 'Nova conversa AI',   group: 'Criar', icon: 'bot',         action: () => { Router.navigate('chat-ai'); setTimeout(() => LLM && LLM.novaConversa && LLM.novaConversa(), 150); } },
    /* Negócio */
    { id: 'add-prod',    label: 'Novo produto',        group: 'Criar', icon: 'package',       action: () => { Router.navigate('produtos');    setTimeout(() => document.getElementById('prod-novo-btn')?.click(), 100); } },
    { id: 'add-venda',   label: 'Nova venda',           group: 'Criar', icon: 'shopping-cart', action: () => { Router.navigate('vendas');       setTimeout(() => document.getElementById('venda-nova-btn')?.click(), 100); } },
    { id: 'add-cliente', label: 'Novo cliente',         group: 'Criar', icon: 'user-plus',     action: () => { Router.navigate('clientes');     setTimeout(() => document.getElementById('cli-novo-btn')?.click(), 100); } },
    /* Pessoal */
    { id: 'add-evento',  label: 'Novo evento na agenda', group: 'Criar', icon: 'calendar-plus', action: () => { Router.navigate('agenda');       setTimeout(() => document.getElementById('agenda-novo-btn')?.click(), 150); } },
    { id: 'add-tarefa',  label: 'Nova tarefa',           group: 'Criar', icon: 'check-square',  action: () => { Router.navigate('tarefas');      setTimeout(() => document.getElementById('trf-nova-btn')?.click(), 150); } },
    { id: 'add-med',     label: 'Novo medicamento',      group: 'Criar', icon: 'pill',          action: () => { Router.navigate('medicamentos'); setTimeout(() => document.getElementById('med-novo-btn')?.click(), 150); } },
    { id: 'add-contato', label: 'Novo contato',          group: 'Criar', icon: 'user-plus',     action: () => { Router.navigate('contatos');     setTimeout(() => document.getElementById('ctto-novo-btn')?.click(), 150); } },
  ];

  let selectedIdx = 0;
  let filtered = [];

  function open() {
    const el = document.getElementById('cmd-palette');
    if (!el) return;
    el.classList.add('open');
    const input = document.getElementById('cmd-input');
    if (input) { input.value = ''; input.focus(); }
    render('');
  }

  function close() {
    const el = document.getElementById('cmd-palette');
    if (el) el.classList.remove('open');
  }

  function isOpen() {
    return document.getElementById('cmd-palette')?.classList.contains('open');
  }

  function render(q) {
    const query = (q || '').toLowerCase().trim();
    filtered = query
      ? COMMANDS.filter(c => c.label.toLowerCase().includes(query) || c.group.toLowerCase().includes(query))
      : COMMANDS;
    selectedIdx = 0;

    const container = document.getElementById('cmd-results');
    if (!container) return;

    if (!filtered.length) {
      container.innerHTML = `<div class="cmd-empty">Nenhum resultado para "<strong>${q}</strong>"</div>`;
      return;
    }

    const groups = {};
    filtered.forEach(c => { if (!groups[c.group]) groups[c.group] = []; groups[c.group].push(c); });

    let html = '';
    let globalIdx = 0;
    Object.entries(groups).forEach(([group, items]) => {
      html += `<div class="cmd-group-label">${group}</div>`;
      items.forEach(item => {
        const idx = globalIdx++;
        html += `<div class="cmd-item${idx === 0 ? ' selected' : ''}" data-idx="${idx}">
          <span data-icon="${item.icon}" data-size="16"></span>
          <span class="cmd-item-label">${highlight(item.label, q)}</span>
        </div>`;
      });
    });
    container.innerHTML = html;
    Icons.render(container);
    bindClicks();
  }

  function highlight(text, q) {
    if (!q) return text;
    const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(re, '<mark style="background:var(--violet);color:#fff;border-radius:2px;padding:0 2px">$1</mark>');
  }

  function bindClicks() {
    document.querySelectorAll('.cmd-item').forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.querySelectorAll('.cmd-item').forEach(i => i.classList.remove('selected'));
        el.classList.add('selected');
        selectedIdx = parseInt(el.dataset.idx);
      });
      el.addEventListener('click', () => {
        execute(parseInt(el.dataset.idx));
      });
    });
  }

  function execute(idx) {
    const cmd = filtered[idx];
    if (cmd) { close(); cmd.action(); }
  }

  function setSelected(idx) {
    if (idx < 0) idx = filtered.length - 1;
    if (idx >= filtered.length) idx = 0;
    selectedIdx = idx;
    document.querySelectorAll('.cmd-item').forEach((el, i) => {
      el.classList.toggle('selected', i === idx);
    });
    const sel = document.querySelector('.cmd-item.selected');
    if (sel) sel.scrollIntoView({ block: 'nearest' });
  }

  function init() {
    /* Teclas globais */
    document.addEventListener('keydown', e => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key === 'k') { e.preventDefault(); isOpen() ? close() : open(); return; }
      if (!isOpen()) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(selectedIdx + 1); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(selectedIdx - 1); return; }
      if (e.key === 'Enter') { e.preventDefault(); execute(selectedIdx); return; }
    });

    /* Input de busca */
    const input = document.getElementById('cmd-input');
    if (input) input.addEventListener('input', e => render(e.target.value));

    /* Backdrop click fecha */
    const backdrop = document.querySelector('.cmd-backdrop');
    if (backdrop) backdrop.addEventListener('click', close);

    /* Botão na topbar */
    const trigger = document.getElementById('cmd-trigger');
    if (trigger) trigger.addEventListener('click', open);
  }

  return { init, open, close };
})();
