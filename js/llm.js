/* ═══════════════════════════════════════════════════════════
   LLM — Multi-provider AI Chat (OpenRouter, OpenAI, Gemini, Claude, Groq)
═══════════════════════════════════════════════════════════ */

const LLM = (() => {

  const PROVIDERS = {
    openrouter: {
      name: 'OpenRouter',
      url: 'https://openrouter.ai/api/v1',
      models: [
        { id: 'anthropic/claude-3.5-sonnet',      label: 'Claude 3.5 Sonnet' },
        { id: 'anthropic/claude-3-haiku',          label: 'Claude 3 Haiku (rápido)' },
        { id: 'openai/gpt-4o',                     label: 'GPT-4o' },
        { id: 'openai/gpt-4o-mini',                label: 'GPT-4o Mini (barato)' },
        { id: 'google/gemini-2.0-flash-exp',       label: 'Gemini 2.0 Flash' },
        { id: 'meta-llama/llama-3.1-8b-instruct',  label: 'Llama 3.1 8B (grátis)' },
      ],
      hint: 'Recomendado — acessa Claude, GPT e Gemini com uma única chave.',
    },
    openai: {
      name: 'OpenAI',
      url: 'https://api.openai.com/v1',
      models: [
        { id: 'gpt-4o',       label: 'GPT-4o' },
        { id: 'gpt-4o-mini',  label: 'GPT-4o Mini' },
        { id: 'gpt-3.5-turbo',label: 'GPT-3.5 Turbo' },
      ],
      hint: 'Requer chave da OpenAI (platform.openai.com).',
    },
    gemini: {
      name: 'Google Gemini',
      url: 'https://generativelanguage.googleapis.com',
      models: [
        { id: 'gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash' },
        { id: 'gemini-1.5-pro',       label: 'Gemini 1.5 Pro' },
        { id: 'gemini-1.5-flash',     label: 'Gemini 1.5 Flash' },
      ],
      hint: 'Requer chave do Google AI Studio (aistudio.google.com).',
    },
    claude: {
      name: 'Claude (Anthropic)',
      url: 'https://api.anthropic.com/v1',
      models: [
        { id: 'claude-sonnet-4-6',           label: 'Claude Sonnet 4.6' },
        { id: 'claude-haiku-4-5-20251001',   label: 'Claude Haiku 4.5' },
        { id: 'claude-opus-4-7',             label: 'Claude Opus 4.7' },
      ],
      hint: '⚠️ A API da Anthropic bloqueia chamadas diretas do browser (CORS). Use o OpenRouter para acessar Claude sem esse problema.',
    },
    groq: {
      name: 'Groq',
      url: 'https://api.groq.com/openai/v1',
      models: [
        { id: 'llama-3.3-70b-versatile',    label: 'Llama 3.3 70B (rápido)' },
        { id: 'llama-3.1-70b-versatile',    label: 'Llama 3.1 70B' },
        { id: 'mixtral-8x7b-32768',         label: 'Mixtral 8x7B' },
        { id: 'gemma-2-9b-it',              label: 'Gemma 2 9B' },
      ],
      hint: 'Requer chave do Groq (console.groq.com). Rápido e tem tier gratuito.',
    },
  };

  let activeConversaId = null;
  let isLoading = false;

  /* ─── RENDER PRINCIPAL ─── */
  function render() {
    const container = document.getElementById('chat-ai-content');
    if (!container) return;

    const cfg = DB.getLlmConfig();
    const conversas = DB.getLlmConversas();

    container.innerHTML = `
      <div class="llm-shell">
        <aside class="llm-sidebar">
          <div class="llm-sidebar-head">
            <button class="btn btn-primary btn-sm llm-new-btn" id="llm-new-btn">
              <span data-icon="plus" data-size="14"></span>
              Nova conversa
            </button>
          </div>
          <div class="llm-conv-list" id="llm-conv-list">
            ${conversas.length
              ? conversas.map(c => convItem(c, activeConversaId)).join('')
              : '<div class="llm-empty-list">Sem conversas ainda</div>'
            }
          </div>
          <div class="llm-sidebar-foot">
            <button class="llm-cfg-btn" id="llm-cfg-btn">
              <span data-icon="settings-2" data-size="14"></span>
              <span>Configurar LLM</span>
            </button>
          </div>
        </aside>

        <div class="llm-main">
          ${!cfg.apiKey
            ? renderSetup()
            : activeConversaId
              ? renderConversa(activeConversaId)
              : renderWelcome()
          }
        </div>
      </div>
    `;

    Icons.render(container);
    bindLlmEvents(container);
  }

  function convItem(c, activeId) {
    const lastMsg = c.msgs && c.msgs.length ? c.msgs[c.msgs.length - 1] : null;
    const preview = lastMsg ? lastMsg.content.slice(0, 60) + (lastMsg.content.length > 60 ? '…' : '') : 'Sem mensagens';
    return `
      <div class="llm-conv-item${c.id === activeId ? ' active' : ''}" data-conv-id="${c.id}">
        <div class="llm-conv-title">${c.titulo}</div>
        <div class="llm-conv-preview">${preview}</div>
        <button class="llm-conv-del" data-del-conv="${c.id}" title="Excluir">
          <span data-icon="trash-2" data-size="12"></span>
        </button>
      </div>
    `;
  }

  function renderWelcome() {
    const cfg = DB.getLlmConfig();
    const provider = PROVIDERS[cfg.provider];
    const sugestoes = [
      'Quanto eu devo este mês?',
      'Quanto eu já paguei este mês?',
      'Quais tarefas tenho hoje?',
      'Resumo das minhas vendas do mês',
      'Quais clientes estão me devendo?',
      'Como está meu saldo?',
    ];
    return `
      <div class="llm-welcome">
        <div class="llm-welcome-icon"><span data-icon="bot" data-size="48"></span></div>
        <h2 class="llm-welcome-title">Mentor AI</h2>
        <p class="llm-welcome-sub">Seu assistente conhece seu app.<br>Conectado via <strong>${esc(provider ? provider.name : cfg.provider)}</strong> · ${esc(cfg.model)}</p>
        <div class="llm-suggestions">
          ${sugestoes.map(s => `<button class="llm-suggestion-chip" data-pergunta="${esc(s)}">${esc(s)}</button>`).join('')}
        </div>
        <button class="btn btn-primary" id="llm-start-btn">
          <span data-icon="message-square" data-size="14"></span>
          Ou iniciar conversa em branco
        </button>
      </div>
    `;
  }

  function renderSetup() {
    return `
      <div class="llm-setup">
        <div class="llm-setup-icon"><span data-icon="key" data-size="40"></span></div>
        <h2>Configure seu provedor de IA</h2>
        <p>Para usar o Chat AI, você precisa de uma chave de API. <strong>Recomendamos o OpenRouter</strong> — ele dá acesso a Claude, GPT-4 e Gemini com uma única chave.</p>
        <a href="https://openrouter.ai/keys" target="_blank" rel="noopener" class="btn btn-primary">
          <span data-icon="external-link" data-size="14"></span>
          Obter chave no OpenRouter (gratuito)
        </a>
        <button class="btn btn-secondary" id="llm-cfg-setup-btn" style="margin-top:var(--s-2)">
          <span data-icon="settings-2" data-size="14"></span>
          Já tenho chave — configurar
        </button>
      </div>
    `;
  }

  function renderConversa(convId) {
    const conversa = DB.getLlmConversas().find(c => c.id === convId);
    if (!conversa) return renderWelcome();
    const msgs = conversa.msgs || [];

    const bubblesHtml = msgs.map(m => `
      <div class="chat-bubble-wrap ${m.role === 'user' ? 'from-me' : 'from-ai'}">
        <div class="chat-bubble">${formatMsgContent(m.content)}</div>
        <div class="chat-meta">${m.role === 'user' ? 'Você' : 'AI'}</div>
      </div>
    `).join('');

    return `
      <div class="llm-chat-area" id="llm-chat-area">
        <div class="llm-chat-toolbar">
          <span class="llm-chat-toolbar-title">${esc(conversa.titulo)}</span>
          <button class="btn btn-ghost btn-sm" id="llm-clear-btn" title="Limpar mensagens da conversa">
            <span data-icon="eraser" data-size="13"></span>
            Limpar
          </button>
        </div>
        <div class="llm-chat-messages" id="llm-chat-messages">
          ${bubblesHtml || '<div class="llm-chat-empty">Comece digitando sua mensagem abaixo.</div>'}
        </div>
      </div>
      <div class="llm-input-area">
        <div class="llm-input-row">
          <textarea id="llm-input" class="llm-textarea" placeholder="Digite sua mensagem…" rows="1"></textarea>
          <button class="btn btn-primary llm-send-btn" id="llm-send-btn" ${isLoading ? 'disabled' : ''}>
            ${isLoading
              ? '<span data-icon="loader-2" data-size="16" class="spin"></span>'
              : '<span data-icon="send" data-size="16"></span>'
            }
          </button>
        </div>
      </div>
    `;
  }

  /* ─── HELPERS ─── */
  function friendlyApiError(err) {
    const msg = String(err.message || '');
    if (msg.includes('401') || /unauthorized|invalid.*(key|token)|api.?key/i.test(msg))
      return '🔑 API key inválida ou expirada. Acesse Configurações para atualizar sua chave.';
    if (msg.includes('429') || /rate.?limit|too many/i.test(msg))
      return '⏱️ Muitas requisições. Aguarde alguns segundos e tente novamente.';
    if (msg.includes('403') || /forbidden|access denied/i.test(msg))
      return '🚫 Acesso negado pelo provedor. Verifique se sua chave tem as permissões necessárias.';
    if (/50[023456789]|server error/i.test(msg))
      return '🔧 Erro no servidor do provedor. Tente novamente em breve.';
    if (/failed to fetch|network|offline|ERR_/i.test(msg))
      return '📡 Sem conexão com o provedor. Verifique sua internet e tente novamente.';
    return `Erro: ${msg || 'Verifique sua API key e conexão.'}`;
  }

  function smartTitle(text) {
    const clean = text.trim().replace(/[.!?,;:]+$/, '');
    const cap = clean.charAt(0).toUpperCase() + clean.slice(1);
    if (cap.length <= 40) return cap;
    const cut = cap.slice(0, 40);
    const lastSpace = cut.lastIndexOf(' ');
    return (lastSpace > 20 ? cut.slice(0, lastSpace) : cut) + '…';
  }

  function formatMsgContent(text) {
    return text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  }

  /* ─── BIND EVENTS ─── */
  function bindLlmEvents(container) {
    /* Nova conversa */
    container.querySelector('#llm-new-btn')?.addEventListener('click', novaConversa);

    /* Conversa start */
    container.querySelector('#llm-start-btn')?.addEventListener('click', novaConversa);

    /* Sugestões clicáveis — criam conversa e enviam pergunta direto */
    container.querySelectorAll('.llm-suggestion-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const pergunta = btn.dataset.pergunta;
        if (!pergunta) return;
        novaConversa();
        setTimeout(() => {
          const input = document.getElementById('llm-input');
          if (input) {
            input.value = pergunta;
            sendMessage();
          }
        }, 100);
      });
    });

    /* Config botões */
    container.querySelector('#llm-cfg-btn')?.addEventListener('click', () => Router.navigate('config'));
    container.querySelector('#llm-cfg-setup-btn')?.addEventListener('click', () => Router.navigate('config'));

    /* Clicar em conversa */
    container.querySelectorAll('.llm-conv-item').forEach(el => {
      el.addEventListener('click', e => {
        if (e.target.closest('[data-del-conv]')) return;
        activeConversaId = el.dataset.convId;
        render();
      });
    });

    /* Deletar conversa */
    container.querySelectorAll('[data-del-conv]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id = btn.dataset.delConv;
        DB.deleteLlmConversa(id);
        if (activeConversaId === id) activeConversaId = null;
        render();
      });
    });

    /* Send btn */
    const sendBtn = container.querySelector('#llm-send-btn');
    const textarea = container.querySelector('#llm-input');
    if (sendBtn && textarea) {
      sendBtn.addEventListener('click', () => sendMessage());
      textarea.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
      });
      autoResizeTextarea(textarea);
    }

    /* Limpar conversa */
    container.querySelector('#llm-clear-btn')?.addEventListener('click', () => {
      const conversa = DB.getLlmConversas().find(c => c.id === activeConversaId);
      if (!conversa) return;
      conversa.msgs = [];
      DB.saveLlmConversa(conversa);
      render();
    });

    scrollToBottom();
  }

  function autoResizeTextarea(ta) {
    ta.addEventListener('input', () => {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 140) + 'px';
    });
  }

  function scrollToBottom() {
    setTimeout(() => {
      const msgs = document.getElementById('llm-chat-messages');
      if (msgs) msgs.scrollTop = msgs.scrollHeight;
    }, 50);
  }

  /* ─── NOVA CONVERSA ─── */
  function novaConversa() {
    const c = DB.saveLlmConversa({ titulo: 'Nova conversa', msgs: [] });
    activeConversaId = c.id;
    render();
    document.getElementById('llm-input')?.focus();
  }

  /* ─── ENVIAR MENSAGEM ─── */
  async function sendMessage() {
    const textarea = document.getElementById('llm-input');
    if (!textarea || isLoading) return;
    const text = textarea.value.trim();
    if (!text || !activeConversaId) return;

    textarea.value = '';
    textarea.style.height = 'auto';

    /* Adiciona msg do usuário */
    const conversas = DB.getLlmConversas();
    const conversa = conversas.find(c => c.id === activeConversaId);
    if (!conversa) return;

    conversa.msgs.push({ role: 'user', content: text });
    if (conversa.titulo === 'Nova conversa') conversa.titulo = smartTitle(text);
    DB.saveLlmConversa(conversa);

    isLoading = true;
    render();

    /* Adiciona typing indicator */
    const messagesEl = document.getElementById('llm-chat-messages');
    if (messagesEl) {
      const typingEl = document.createElement('div');
      typingEl.className = 'chat-bubble-wrap from-ai';
      typingEl.id = 'llm-typing';
      typingEl.innerHTML = `<div class="chat-typing">
        <div class="chat-typing-dot"></div>
        <div class="chat-typing-dot"></div>
        <div class="chat-typing-dot"></div>
      </div>`;
      messagesEl.appendChild(typingEl);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    try {
      const cfg = DB.getLlmConfig();

      /* Enriquece systemPrompt com snapshot atual dos dados do usuário.
         A IA recebe contexto fresco a cada mensagem para responder perguntas
         sobre contas, vendas, tarefas, etc. com dados reais. */
      const cfgComContexto = Object.assign({}, cfg, {
        systemPrompt: (cfg.systemPrompt || '') + '\n\n' + buildUserContext(),
      });

      const response = await callProvider(conversa.msgs, cfgComContexto);

      conversa.msgs.push({ role: 'assistant', content: response });
      DB.saveLlmConversa(conversa);
    } catch (err) {
      conversa.msgs.push({ role: 'assistant', content: friendlyApiError(err) });
      DB.saveLlmConversa(conversa);
    }

    isLoading = false;
    render();
  }

  /* ═══════════════════════════════════════════════════════════
     CONTEXTO DO USUÁRIO — Snapshot dos dados do app
     A IA recebe este snapshot a cada mensagem para responder
     com base nos dados reais (contas, vendas, tarefas, etc).
  ═══════════════════════════════════════════════════════════ */
  function buildUserContext() {
    const cfg = DB.getConfig();
    const hoje = new Date();
    const hojeISO = hoje.toISOString().slice(0, 10);
    const mesAtual = hojeISO.slice(0, 7); // YYYY-MM
    const daquiSeteDias = new Date(hoje.getTime() + 7 * 86400000).toISOString().slice(0, 10);
    const inicioMes = mesAtual + '-01';

    const linhas = [];
    linhas.push('═══ DADOS ATUAIS DO USUÁRIO ═══');
    linhas.push(`Usuário: ${cfg.nomeUsuario || 'Você'}`);
    linhas.push(`Data: ${hojeISO} (${hoje.toLocaleDateString('pt-BR', { weekday: 'long' })})`);
    linhas.push(`Moeda: ${cfg.moeda || 'BRL'}`);
    linhas.push('');

    /* ─── FINANCEIRO ─── */
    try {
      const contas = (DB.getContas && DB.getContas()) || [];
      const txs = (DB.getTxs && DB.getTxs()) || [];

      /* Schema correto: c.dataVencimento, c.descricao, c.valor, c.status */
      const contasMes = contas.filter(c => (c.dataVencimento || '').startsWith(mesAtual));
      const pendentes = contas.filter(c => c.status === 'pendente' || c.status === 'atrasada');
      const pendentesMes = contasMes.filter(c => c.status === 'pendente' || c.status === 'atrasada');
      const pagasMes  = contasMes.filter(c => c.status === 'paga');
      const totalPendenteMes = pendentesMes.reduce((s, c) => s + (c.valor || 0), 0);
      const totalPagoMes     = pagasMes.reduce((s, c) => s + (c.valor || 0), 0);
      const totalPendenteGeral = pendentes.reduce((s, c) => s + (c.valor || 0), 0);
      const atrasadas = contas.filter(c => c.status === 'atrasada');
      const totalAtrasado = atrasadas.reduce((s, c) => s + (c.valor || 0), 0);

      const txMes = txs.filter(t => (t.data || '').startsWith(mesAtual));
      const receitas = txMes.filter(t => t.tipo === 'entrada' || t.tipo === 'receita').reduce((s, t) => s + (t.valor || 0), 0);
      const despesas = txMes.filter(t => t.tipo === 'saida' || t.tipo === 'despesa').reduce((s, t) => s + (t.valor || 0), 0);

      linhas.push('── FINANCEIRO ──');
      linhas.push(`Total de contas cadastradas: ${contas.length}`);
      if (contas.length === 0) {
        linhas.push('(Nenhuma conta cadastrada ainda. Para criar, acesse a página "Contas".)');
      } else {
        linhas.push(`Saldo inicial configurado: ${fmtBRL(cfg.saldoInicial || 0)}`);
        linhas.push(`Receitas registradas este mês: ${fmtBRL(receitas)} (${txMes.filter(t => t.tipo === 'entrada' || t.tipo === 'receita').length} lançamentos)`);
        linhas.push(`Despesas registradas este mês: ${fmtBRL(despesas)} (${txMes.filter(t => t.tipo === 'saida' || t.tipo === 'despesa').length} lançamentos)`);
        linhas.push(`Saldo estimado: ${fmtBRL((cfg.saldoInicial || 0) + receitas - despesas)}`);
        linhas.push('');
        linhas.push(`Contas a pagar este mês (${mesAtual}): ${pendentesMes.length} (total ${fmtBRL(totalPendenteMes)})`);
        linhas.push(`Contas já pagas este mês: ${pagasMes.length} (total ${fmtBRL(totalPagoMes)})`);
        linhas.push(`Total de contas pendentes (todas datas): ${pendentes.length} (${fmtBRL(totalPendenteGeral)})`);
        if (atrasadas.length) {
          linhas.push(`⚠ Contas atrasadas: ${atrasadas.length} (${fmtBRL(totalAtrasado)})`);
        }

        const proximas = pendentes
          .filter(c => c.dataVencimento)
          .sort((a, b) => a.dataVencimento.localeCompare(b.dataVencimento))
          .slice(0, 10);
        if (proximas.length) {
          linhas.push('');
          linhas.push('Próximas contas a vencer:');
          proximas.forEach(c => {
            linhas.push(`  • ${c.descricao || 'Conta'} — ${fmtBRL(c.valor)} (vence ${c.dataVencimento}) [${c.status}]`);
          });
        }
      }
      linhas.push('');
    } catch (e) { /* coleção pode não existir */ }

    /* ─── METAS / CAIXINHAS ─── */
    try {
      const metas = (DB.getMetas && DB.getMetas()) || [];
      if (metas.length) {
        linhas.push('── METAS / CAIXINHAS ──');
        metas.forEach(m => {
          /* Schema correto: m.valorAlvo + DB.getValorMeta(m.id) para valor atual */
          const valorAtual = (DB.getValorMeta && DB.getValorMeta(m.id)) || 0;
          const alvo = m.valorAlvo || 0;
          const pct = alvo ? Math.round(valorAtual / alvo * 100) : 0;
          linhas.push(`  • ${m.nome}: ${fmtBRL(valorAtual)} / ${fmtBRL(alvo)} (${pct}%)`);
        });
        linhas.push('');
      }
    } catch (e) {}

    /* ─── NEGÓCIO ─── */
    try {
      const produtos = (DB.getProdutos && DB.getProdutos()) || [];
      const vendas   = (DB.getVendas   && DB.getVendas())   || [];
      const clientes = (DB.getClientesNeg && DB.getClientesNeg()) || [];

      linhas.push('── NEGÓCIO ──');
      if (!produtos.length && !vendas.length && !clientes.length) {
        linhas.push('(Nenhum produto, venda ou cliente cadastrado ainda.)');
      } else {
        const ativos = produtos.filter(p => p.status === 'ativo' || !p.status);
        /* Schema correto: p.estoqueMinimo (não estoqueMin) */
        const baixoEstoque = produtos.filter(p => (p.estoque || 0) > 0 && (p.estoque || 0) <= (p.estoqueMinimo || 0));
        const semEstoque = produtos.filter(p => (p.estoque || 0) === 0);

        const vendasMes = vendas.filter(v => (v.data || '').startsWith(mesAtual));
        const totalVendasMes = vendasMes.reduce((s, v) => s + (v.total || 0), 0);
        const vendasPagas = vendasMes.filter(v => v.status === 'paga');
        const vendasPendentes = vendasMes.filter(v => v.status === 'pendente' || v.status === 'fiado');
        const totalPendenteVendas = vendasPendentes.reduce((s, v) => s + (v.total || 0), 0);

        linhas.push(`Produtos cadastrados: ${produtos.length} (${ativos.length} ativos)`);
        if (baixoEstoque.length) {
          linhas.push(`⚠ Produtos com estoque baixo: ${baixoEstoque.length}`);
          baixoEstoque.slice(0, 5).forEach(p => {
            linhas.push(`  • ${p.nome}: ${p.estoque} unidades (mín. ${p.estoqueMinimo})`);
          });
        }
        if (semEstoque.length) {
          linhas.push(`⚠ Produtos sem estoque: ${semEstoque.length}`);
          semEstoque.slice(0, 5).forEach(p => linhas.push(`  • ${p.nome}`));
        }
        linhas.push(`Vendas este mês: ${vendasMes.length} (total ${fmtBRL(totalVendasMes)})`);
        if (vendasMes.length) {
          linhas.push(`  → Pagas: ${vendasPagas.length}`);
          linhas.push(`  → Pendentes/fiado: ${vendasPendentes.length} (${fmtBRL(totalPendenteVendas)})`);

          /* Top 5 vendas mais recentes */
          const recentes = vendasMes.slice().sort((a, b) => (b.data || '').localeCompare(a.data || '')).slice(0, 5);
          linhas.push('Vendas recentes:');
          recentes.forEach(v => {
            linhas.push(`  • ${v.data} — ${v.clienteNome || 'Cliente'} — ${fmtBRL(v.total)} [${v.status}]`);
          });
        }
        linhas.push(`Clientes cadastrados: ${clientes.length}`);

        const clientesDevendo = clientes.filter(c => (c.saldoDevedor || 0) > 0);
        if (clientesDevendo.length) {
          linhas.push(`Clientes com saldo devedor: ${clientesDevendo.length}`);
          clientesDevendo.slice(0, 5).forEach(c => {
            linhas.push(`  • ${c.nome}: ${fmtBRL(c.saldoDevedor)}`);
          });
        }
      }
      linhas.push('');
    } catch (e) {}

    /* ─── PESSOAL ─── */
    try {
      const tarefas = (DB.getTarefas && DB.getTarefas()) || [];
      const agenda = (DB.getAgenda && DB.getAgenda()) || [];
      const meds = (DB.getMedicamentos && DB.getMedicamentos()) || [];

      /* Schema correto: t.data (não t.prazo!) */
      const tarefasPendentes = tarefas.filter(t => t.status !== 'concluida');
      const tarefasHoje = tarefasPendentes.filter(t => t.data === hojeISO);
      const tarefasAtrasadas = tarefasPendentes.filter(t => t.data && t.data < hojeISO);
      const tarefasSemPrazo = tarefasPendentes.filter(t => !t.data);

      const eventosSemana = agenda.filter(e => e.data >= hojeISO && e.data <= daquiSeteDias);
      const eventosHoje = agenda.filter(e => e.data === hojeISO);

      linhas.push('── PESSOAL ──');
      if (!tarefas.length && !agenda.length && !meds.length) {
        linhas.push('(Nenhuma tarefa, evento ou medicamento cadastrado ainda.)');
      } else {
        linhas.push(`Tarefas: ${tarefas.length} total, ${tarefasPendentes.length} pendentes`);
        linhas.push(`  → Para hoje (${hojeISO}): ${tarefasHoje.length}`);
        linhas.push(`  → Atrasadas: ${tarefasAtrasadas.length}`);
        linhas.push(`  → Sem prazo: ${tarefasSemPrazo.length}`);
        if (tarefasAtrasadas.length) {
          linhas.push('Tarefas atrasadas:');
          tarefasAtrasadas.slice(0, 5).forEach(t => {
            linhas.push(`  • ${t.titulo} (era ${t.data}) [${t.prioridade || 'normal'}]`);
          });
        }
        if (tarefasHoje.length) {
          linhas.push('Tarefas de hoje:');
          tarefasHoje.slice(0, 5).forEach(t => {
            linhas.push(`  • ${t.titulo}${t.hora ? ' às ' + t.hora : ''} [${t.prioridade || 'normal'}]`);
          });
        }
        if (eventosHoje.length) {
          linhas.push(`Eventos de hoje (${eventosHoje.length}):`);
          eventosHoje.forEach(e => linhas.push(`  • ${e.hora || ''} — ${e.titulo}`));
        }
        if (eventosSemana.length) {
          linhas.push(`Eventos nos próximos 7 dias: ${eventosSemana.length}`);
          eventosSemana.slice(0, 8).forEach(e => {
            linhas.push(`  • ${e.data} ${e.hora || ''} — ${e.titulo}`);
          });
        }
        if (meds.length) linhas.push(`Medicamentos cadastrados: ${meds.length}`);
      }
      linhas.push('');
    } catch (e) {}

    linhas.push('═══ FIM DOS DADOS ═══');
    linhas.push('Instruções: use estes dados para responder perguntas sobre o app. Valores são reais e atualizados em tempo real. Se não encontrar uma informação aqui, diga que ela ainda não foi cadastrada.');

    return linhas.join('\n');
  }

  function fmtBRL(v) {
    return (Utils && Utils.formatCurrency) ? Utils.formatCurrency(v || 0) : `R$ ${(v || 0).toFixed(2)}`;
  }

  /* ─── CALL PROVIDERS ─── */
  async function callProvider(msgs, cfg) {
    switch (cfg.provider) {
      case 'openrouter': return callOpenRouter(msgs, cfg);
      case 'openai':     return callOpenAI(msgs, cfg);
      case 'gemini':     return callGemini(msgs, cfg);
      case 'claude':     return callClaude(msgs, cfg);
      case 'groq':       return callGroq(msgs, cfg);
      default: throw new Error('Provedor desconhecido: ' + cfg.provider);
    }
  }

  async function callOpenRouter(msgs, cfg) {
    const systemPrompt = cfg.systemPrompt || '';
    const messages = systemPrompt
      ? [{ role: 'system', content: systemPrompt }, ...msgs]
      : msgs;

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cfg.apiKey}`,
        'HTTP-Referer': window.location.href,
        'X-Title': 'Mentor24h',
      },
      body: JSON.stringify({ model: cfg.model, messages }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '(sem resposta)';
  }

  async function callOpenAI(msgs, cfg) {
    const systemPrompt = cfg.systemPrompt || '';
    const messages = systemPrompt
      ? [{ role: 'system', content: systemPrompt }, ...msgs]
      : msgs;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cfg.apiKey}`,
      },
      body: JSON.stringify({ model: cfg.model, messages }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '(sem resposta)';
  }

  async function callGemini(msgs, cfg) {
    const systemPrompt = cfg.systemPrompt || '';
    const contents = msgs.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const body = {};
    if (systemPrompt) body.systemInstruction = { parts: [{ text: systemPrompt }] };
    body.contents = contents;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${cfg.model}:generateContent?key=${cfg.apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '(sem resposta)';
  }

  async function callClaude(msgs, cfg) {
    const systemPrompt = cfg.systemPrompt || '';
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': cfg.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: cfg.model,
        max_tokens: 2048,
        system: systemPrompt || undefined,
        messages: msgs,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.content?.[0]?.text || '(sem resposta)';
  }

  async function callGroq(msgs, cfg) {
    const systemPrompt = cfg.systemPrompt || '';
    const messages = systemPrompt
      ? [{ role: 'system', content: systemPrompt }, ...msgs]
      : msgs;

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cfg.apiKey}`,
      },
      body: JSON.stringify({ model: cfg.model, messages }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '(sem resposta)';
  }

  /* ─── CONFIG SECTION (renderizada em Config) ─── */
  function renderConfig() {
    const cfg = DB.getLlmConfig();
    const container = document.getElementById('config-llm-section');
    if (!container) return;

    const provider = PROVIDERS[cfg.provider] || PROVIDERS.openrouter;
    const modelsHtml = provider.models.map(m =>
      `<option value="${esc(m.id)}" ${cfg.model === m.id ? 'selected' : ''}>${esc(m.label)}</option>`
    ).join('');

    container.innerHTML = `
      <div class="config-section">
        <div class="config-section-head">
          <div class="card-pill violet"><span data-icon="bot" data-size="16"></span></div>
          <h3>Chat AI — Provedor de IA</h3>
        </div>

        <div class="field-row">
          <div class="field">
            <label class="field-label">Provedor</label>
            <select id="llm-cfg-provider">
              ${Object.entries(PROVIDERS).map(([k, v]) =>
                `<option value="${esc(k)}" ${cfg.provider === k ? 'selected' : ''}>${esc(v.name)}</option>`
              ).join('')}
            </select>
          </div>
          <div class="field">
            <label class="field-label">Modelo</label>
            <select id="llm-cfg-model">${modelsHtml}</select>
          </div>
        </div>

        <div id="llm-provider-hint" class="field-hint" style="margin-bottom:var(--s-3);color:var(--amber)">${esc(provider.hint)}</div>

        <div class="field">
          <label class="field-label">API Key
            <span id="llm-cfg-key-status" style="font-size:11px;color:var(--gold);margin-left:8px"></span>
          </label>
          <input type="password" id="llm-cfg-key" value="${esc(cfg.apiKey)}" placeholder="${esc(keyPlaceholder(cfg.provider))}" autocomplete="off" spellcheck="false">
          <div class="field-hint" style="color:var(--amber);margin-top:4px">
            <span data-icon="alert-triangle" data-size="11"></span>
            Cada provedor tem sua própria chave (salva no navegador). Não use em computadores compartilhados.
          </div>
        </div>

        <div class="field" style="margin-top:var(--s-3)">
          <label class="field-label">Prompt do sistema (opcional)</label>
          <textarea id="llm-cfg-system" rows="3" style="resize:vertical">${esc(cfg.systemPrompt || '')}</textarea>
          <div class="field-hint">Define a personalidade e instruções base do assistente.</div>
        </div>

        <button class="btn btn-primary" id="llm-cfg-save" style="margin-top:var(--s-3)">
          <span data-icon="save" data-size="14"></span>
          Salvar configuração de IA
        </button>
      </div>
    `;

    Icons.render(container);
    bindConfigEvents(container);
    updateKeyStatus(container);
  }

  /* Placeholder específico por provedor */
  function keyPlaceholder(provider) {
    return {
      openrouter: 'sk-or-v1-...',
      openai:     'sk-...',
      gemini:     'AIza...',
      claude:     'sk-ant-...',
      groq:       'gsk_...',
    }[provider] || 'chave do provedor';
  }

  /* Indicador "✓ chave salva" / "Sem chave" ao lado do label */
  function updateKeyStatus(container) {
    const provSelect = container.querySelector('#llm-cfg-provider');
    const keyInput   = container.querySelector('#llm-cfg-key');
    const status     = container.querySelector('#llm-cfg-key-status');
    if (!provSelect || !keyInput || !status) return;
    const has = (keyInput.value || '').trim().length > 0;
    status.textContent = has ? '✓ chave preenchida' : '⚠ sem chave';
    status.style.color = has ? 'var(--gold)' : 'var(--amber)';
  }

  function bindConfigEvents(container) {
    const provSelect  = container.querySelector('#llm-cfg-provider');
    const modelSelect = container.querySelector('#llm-cfg-model');
    const keyInput    = container.querySelector('#llm-cfg-key');
    const sysInput    = container.querySelector('#llm-cfg-system');
    const hint        = container.querySelector('#llm-provider-hint');

    /* Rastreia o provedor "anterior" para auto-salvar a chave digitada antes de trocar */
    let lastProvider = provSelect.value;

    provSelect?.addEventListener('change', () => {
      const newProvider = provSelect.value;
      const p = PROVIDERS[newProvider];
      if (!p) return;

      /* 1. Salva a chave do provider anterior (se preenchida) — não perde o que foi digitado */
      const typedKey = (keyInput.value || '').trim();
      if (typedKey) {
        DB.saveLlmConfig({ provider: lastProvider, apiKey: typedKey });
      }

      /* 2. Atualiza hint */
      hint.textContent = p.hint;

      /* 3. Recarrega config — pega a chave e o modelo salvos do novo provider */
      const cfg = DB.getLlmConfig();
      const savedKey   = (cfg.apiKeys && cfg.apiKeys[newProvider]) || '';
      const savedModel = (cfg.models  && cfg.models[newProvider])  || '';

      /* 4. Renderiza modelos com o salvo (ou primeiro) selecionado */
      modelSelect.innerHTML = p.models.map(m =>
        `<option value="${esc(m.id)}" ${savedModel === m.id ? 'selected' : ''}>${esc(m.label)}</option>`
      ).join('');

      /* 5. Atualiza input da chave e placeholder */
      keyInput.value = savedKey;
      keyInput.placeholder = keyPlaceholder(newProvider);

      lastProvider = newProvider;
      updateKeyStatus(container);
    });

    keyInput?.addEventListener('input', () => updateKeyStatus(container));

    container.querySelector('#llm-cfg-save')?.addEventListener('click', () => {
      const provider = provSelect?.value;
      DB.saveLlmConfig({
        provider,
        apiKey: (keyInput?.value || '').trim(),
        model: modelSelect?.value,
        systemPrompt: (sysInput?.value || '').trim(),
      });
      const providerName = PROVIDERS[provider]?.name || provider;
      Toast.success('Configuração salva!', `${providerName} pronto para uso.`);
      updateKeyStatus(container);
    });
  }

  return { render, renderConfig, novaConversa };
})();
