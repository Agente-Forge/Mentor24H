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
      'E mês passado, quanto eu devia?',
      'Tenho alguma conta para hoje?',
      'Quais vendas fiz essa semana?',
      'Quais clientes estão me devendo?',
      'Quais tarefas tenho hoje?',
      'Como está meu saldo?',
      'Tenho produtos com estoque baixo?',
    ];
    return `
      <div class="llm-welcome">
        <div class="llm-welcome-icon"><span data-icon="bot" data-size="48"></span></div>
        <h2 class="llm-welcome-title">Chat Assistente</h2>
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
        <h2>Configure seu provedor</h2>
        <p>Para usar o Chat Assistente, você precisa de uma chave de API. <strong>Recomendamos o OpenRouter</strong> — ele dá acesso a Claude, GPT-4 e Gemini com uma única chave.</p>
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
        <div class="chat-meta">${m.role === 'user' ? 'Você' : 'Assistente'}</div>
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

      /* SystemPrompt enriquecido com contexto leve (identidade + datas) +
         instruções para usar Function Calling quando precisar de dados.
         A IA puxa os dados via tools dinamicamente — sem snapshot gigante. */
      const cfgComContexto = Object.assign({}, cfg, {
        systemPrompt: (cfg.systemPrompt || '') + '\n\n' + buildLightContext(),
      });

      const response = await callWithTools(conversa.msgs, cfgComContexto);

      conversa.msgs.push({ role: 'assistant', content: response });
      DB.saveLlmConversa(conversa);
    } catch (err) {
      conversa.msgs.push({ role: 'assistant', content: friendlyApiError(err) });
      DB.saveLlmConversa(conversa);
    }

    isLoading = false;
    render();
  }

  /* Modelos que sabidamente NÃO suportam Function Calling de forma confiável.
     Para esses, usamos o RAG estático (contexto pesado) como fallback.
     Match por substring para cobrir variações em diferentes providers. */
  const MODELOS_SEM_TOOLS_SUBSTRINGS = [
    'gemma',
    'mixtral',
    'gpt-3.5',
    'llama-3.1-8b',
    'claude-3-haiku',
    'gemini-1.5-flash',
  ];

  function modeloSuportaTools(cfg) {
    const model = (cfg.model || '').toLowerCase();
    if (MODELOS_SEM_TOOLS_SUBSTRINGS.some(s => model.includes(s))) return false;
    return ['openrouter', 'openai', 'groq', 'claude', 'gemini'].includes(cfg.provider);
  }

  /* ═══════════════════════════════════════════════════════════
     TOOL CALLING LOOP — Provedor-agnóstico
     A IA pode chamar tools várias vezes. Loop até gerar resposta final.
     Tem fallback automático para o RAG estático em caso de erro.
  ═══════════════════════════════════════════════════════════ */
  async function callWithTools(msgs, cfg) {
    /* Se modelo não suporta tools, vai direto pro RAG estático */
    if (!modeloSuportaTools(cfg)) {
      return callComContextoEstatico(msgs, cfg);
    }

    let currentMsgs = msgs.slice();
    const MAX_ITER = 6;

    try {
      for (let i = 0; i < MAX_ITER; i++) {
        const result = await callProviderWithTools(currentMsgs, cfg);

        /* Se não retornou tool_calls, é a resposta final */
        if (!result.tool_calls || !result.tool_calls.length) {
          return result.content || '(sem resposta)';
        }

        /* Executa cada tool e adiciona ao histórico */
        const toolResults = result.tool_calls.map(tc => {
          let args = {};
          try { args = typeof tc.arguments === 'string' ? JSON.parse(tc.arguments) : (tc.arguments || {}); }
          catch (e) { args = {}; }
          const out = LLMTools.execute(tc.name, args);
          console.log(`[LLM Tool] ${tc.name}(${JSON.stringify(args)})`, out);
          return { tool_call_id: tc.id, name: tc.name, result: out };
        });

        currentMsgs = currentMsgs.concat([
          { role: 'assistant', tool_calls: result.tool_calls, content: result.content || '' },
          ...toolResults.map(tr => ({
            role: 'tool',
            tool_call_id: tr.tool_call_id,
            name: tr.name,
            content: JSON.stringify(tr.result),
          })),
        ]);
      }

      return 'Desculpe, não consegui processar sua pergunta após várias tentativas. Pode reformular?';
    } catch (err) {
      /* Se falhou no tool calling, faz fallback para o RAG estático.
         Isso cobre erros como "Failed to call a function" do Groq/Gemma. */
      console.warn('[LLM] Function calling falhou, usando RAG estático como fallback:', err.message);
      return callComContextoEstatico(msgs, cfg);
    }
  }

  /* Fallback: chama o provider sem tools, com contexto pesado injetado */
  async function callComContextoEstatico(msgs, cfg) {
    const fallbackCfg = Object.assign({}, cfg, {
      systemPrompt: (cfg.systemPrompt || '') + '\n\n' + buildUserContext(),
    });
    return callProvider(msgs, fallbackCfg);
  }

  /* Dispatcher: chama o caller específico que suporta tools */
  async function callProviderWithTools(msgs, cfg) {
    switch (cfg.provider) {
      case 'openrouter': return callOpenAIStyleTools(msgs, cfg, 'https://openrouter.ai/api/v1/chat/completions', {
        'HTTP-Referer': window.location.href,
        'X-Title': 'Mentor24h',
      });
      case 'openai': return callOpenAIStyleTools(msgs, cfg, 'https://api.openai.com/v1/chat/completions', {});
      case 'groq':   return callOpenAIStyleTools(msgs, cfg, 'https://api.groq.com/openai/v1/chat/completions', {});
      case 'claude': return callClaudeTools(msgs, cfg);
      case 'gemini': return callGeminiTools(msgs, cfg);
      default: throw new Error('Provider sem suporte a tools: ' + cfg.provider);
    }
  }

  /* ─── OpenAI / Groq / OpenRouter — mesmo formato ─── */
  async function callOpenAIStyleTools(msgs, cfg, url, extraHeaders) {
    const systemPrompt = cfg.systemPrompt || '';
    /* Converte mensagens internas → formato OpenAI */
    const messages = [];
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
    msgs.forEach(m => {
      if (m.role === 'tool') {
        messages.push({ role: 'tool', tool_call_id: m.tool_call_id, content: m.content });
      } else if (m.tool_calls) {
        messages.push({
          role: 'assistant',
          content: m.content || null,
          tool_calls: m.tool_calls.map(tc => ({
            id: tc.id,
            type: 'function',
            function: { name: tc.name, arguments: typeof tc.arguments === 'string' ? tc.arguments : JSON.stringify(tc.arguments || {}) },
          })),
        });
      } else {
        messages.push({ role: m.role, content: m.content });
      }
    });

    const res = await fetch(url, {
      method: 'POST',
      headers: Object.assign({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cfg.apiKey}`,
      }, extraHeaders),
      body: JSON.stringify({
        model: cfg.model,
        messages,
        tools: LLMTools.TOOLS,
        tool_choice: 'auto',
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${res.status}`);
    }
    const data = await res.json();
    const msg = data.choices?.[0]?.message;
    if (!msg) return { content: '(sem resposta)', tool_calls: [] };

    return {
      content: msg.content || '',
      tool_calls: (msg.tool_calls || []).map(tc => ({
        id: tc.id,
        name: tc.function.name,
        arguments: tc.function.arguments,
      })),
    };
  }

  /* ─── Anthropic Claude — formato próprio ─── */
  async function callClaudeTools(msgs, cfg) {
    const systemPrompt = cfg.systemPrompt || '';
    /* Claude usa "tool_use" no role assistant e "tool_result" no role user */
    const messages = [];
    msgs.forEach(m => {
      if (m.role === 'tool') {
        /* Agrupa tool results em uma mensagem user com content array */
        const last = messages[messages.length - 1];
        if (last && last.role === 'user' && Array.isArray(last.content)) {
          last.content.push({ type: 'tool_result', tool_use_id: m.tool_call_id, content: m.content });
        } else {
          messages.push({ role: 'user', content: [{ type: 'tool_result', tool_use_id: m.tool_call_id, content: m.content }] });
        }
      } else if (m.tool_calls) {
        const content = [];
        if (m.content) content.push({ type: 'text', text: m.content });
        m.tool_calls.forEach(tc => {
          let input = {};
          try { input = typeof tc.arguments === 'string' ? JSON.parse(tc.arguments) : (tc.arguments || {}); } catch (e) {}
          content.push({ type: 'tool_use', id: tc.id, name: tc.name, input });
        });
        messages.push({ role: 'assistant', content });
      } else {
        messages.push({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content });
      }
    });

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
        messages,
        tools: LLMTools.forAnthropic(),
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${res.status}`);
    }
    const data = await res.json();
    const blocks = data.content || [];
    const textBlocks = blocks.filter(b => b.type === 'text').map(b => b.text).join('\n');
    const toolBlocks = blocks.filter(b => b.type === 'tool_use');

    return {
      content: textBlocks,
      tool_calls: toolBlocks.map(b => ({
        id: b.id,
        name: b.name,
        arguments: b.input || {},
      })),
    };
  }

  /* ─── Google Gemini — formato próprio ─── */
  async function callGeminiTools(msgs, cfg) {
    const systemPrompt = cfg.systemPrompt || '';
    /* Gemini usa parts com functionCall/functionResponse */
    const contents = [];
    msgs.forEach(m => {
      if (m.role === 'tool') {
        contents.push({
          role: 'user',
          parts: [{ functionResponse: { name: m.name, response: { result: JSON.parse(m.content) } } }],
        });
      } else if (m.tool_calls) {
        const parts = [];
        if (m.content) parts.push({ text: m.content });
        m.tool_calls.forEach(tc => {
          let args = {};
          try { args = typeof tc.arguments === 'string' ? JSON.parse(tc.arguments) : (tc.arguments || {}); } catch (e) {}
          parts.push({ functionCall: { name: tc.name, args } });
        });
        contents.push({ role: 'model', parts });
      } else {
        contents.push({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        });
      }
    });

    const body = {
      contents,
      tools: LLMTools.forGemini(),
    };
    if (systemPrompt) body.systemInstruction = { parts: [{ text: systemPrompt }] };

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
    const parts = data.candidates?.[0]?.content?.parts || [];
    const textParts = parts.filter(p => p.text).map(p => p.text).join('\n');
    const fnCalls = parts.filter(p => p.functionCall).map((p, i) => ({
      id: `gemini-${Date.now()}-${i}`,
      name: p.functionCall.name,
      arguments: p.functionCall.args || {},
    }));

    return {
      content: textParts,
      tool_calls: fnCalls,
    };
  }

  /* ═══════════════════════════════════════════════════════════
     CONTEXTO LEVE — só identidade + data + capacidades
     Os dados reais são puxados via Function Calling.
  ═══════════════════════════════════════════════════════════ */
  function buildLightContext() {
    const cfg = DB.getConfig();
    const hoje = new Date();
    const hojeISO = hoje.toISOString().slice(0, 10);
    const mesAtual = hojeISO.slice(0, 7);

    return [
      '═══ CONTEXTO DO USUÁRIO ═══',
      `Nome: ${cfg.nomeUsuario || 'Você'}`,
      `Data de hoje: ${hojeISO} (${hoje.toLocaleDateString('pt-BR', { weekday: 'long' })})`,
      `Mês atual: ${mesAtual}`,
      `Moeda do app: ${cfg.moeda || 'BRL'}`,
      '',
      '═══ FERRAMENTAS DISPONÍVEIS ═══',
      'Você TEM ACESSO aos dados do app via Function Calling. Use as ferramentas:',
      '• getDataAtual() — sempre que precisar entender termos relativos (hoje, ontem, mês passado, dezembro, etc.)',
      '• getContas(filtros) — listar contas/dívidas/boletos',
      '• getResumoFinanceiroMes({mes}) — resumo financeiro de um mês específico',
      '• getVendas(filtros) — listar vendas do negócio',
      '• getClientes(filtros) — listar clientes (com/sem débito)',
      '• getProdutos(filtros) — listar produtos do catálogo',
      '• getTarefas(filtros) — listar tarefas/lembretes',
      '• getEventos(filtros) — listar eventos da agenda',
      '• getMedicamentos() — listar medicamentos cadastrados',
      '• getMetas() — listar metas/caixinhas com progresso',
      '• getConfigUsuario() — dados básicos do usuário',
      '',
      '═══ COMO USAR ═══',
      '1. Quando o usuário pedir dados, CHAME a ferramenta apropriada. Não invente nada.',
      '2. Para datas relativas ("mês passado", "amanhã", "essa semana"), chame getDataAtual() PRIMEIRO para obter as datas exatas.',
      '3. Você pode chamar várias ferramentas em sequência se precisar.',
      '4. Os valores retornados JÁ ESTÃO CALCULADOS. NÃO faça aritmética — apenas apresente.',
      '5. Se não encontrar nada, diga "Essa informação não está cadastrada no app".',
      '6. Responda em português brasileiro, formato R$ X.XXX,XX para valores.',
    ].join('\n');
  }

  /* ═══════════════════════════════════════════════════════════
     CONTEXTO DO USUÁRIO — Snapshot pré-computado dos dados do app
     A IA recebe este snapshot a cada mensagem. Todos os valores
     numéricos JÁ ESTÃO CALCULADOS — a IA não deve fazer aritmética.
     Inclui "Respostas Diretas" para perguntas comuns.
  ═══════════════════════════════════════════════════════════ */
  function buildUserContext() {
    const cfg = DB.getConfig();
    const hoje = new Date();
    const hojeISO = hoje.toISOString().slice(0, 10);
    const mesAtual = hojeISO.slice(0, 7); // YYYY-MM
    const daquiSeteDias = new Date(hoje.getTime() + 7 * 86400000).toISOString().slice(0, 10);
    const inicioMes = mesAtual + '-01';

    /* Coletor de "Respostas Diretas" — dicionário de pergunta → resposta literal.
       A IA é instruída a usar essas respostas quando a pergunta corresponder. */
    const respostasDiretas = [];

    const linhas = [];
    linhas.push('═══════════════════════════════════════════════════════════');
    linhas.push('  CONTEXTO DO USUÁRIO — DADOS REAIS DO APP MENTOR24H');
    linhas.push('═══════════════════════════════════════════════════════════');
    linhas.push('');
    linhas.push('⚠️  INSTRUÇÕES OBRIGATÓRIAS PARA O ASSISTENTE:');
    linhas.push('1. Todos os valores numéricos abaixo JÁ ESTÃO CALCULADOS.');
    linhas.push('   NÃO some, subtraia, multiplique ou divida esses valores.');
    linhas.push('   Apenas COPIE os números exatos como apresentados.');
    linhas.push('2. Quando a pergunta do usuário corresponder a uma "RESPOSTA');
    linhas.push('   DIRETA" listada no final, USE exatamente essa resposta.');
    linhas.push('3. Termos importantes (use sempre estas definições):');
    linhas.push('   • "Total ORIGINAL do mês" = soma de TODAS as contas com');
    linhas.push('     vencimento no mês (pagas + pendentes + atrasadas).');
    linhas.push('   • "Já pago no mês" = soma APENAS das contas com status=paga.');
    linhas.push('   • "Ainda a pagar no mês" = soma das contas com status pendente');
    linhas.push('     ou atrasada que vencem no mês.');
    linhas.push('   • "Devo este mês" = mesmo que "Ainda a pagar no mês".');
    linhas.push('4. Se o dado não estiver no contexto, diga "não consta no app".');
    linhas.push('5. Datas no formato YYYY-MM-DD. Valores em R$ (Real brasileiro).');
    linhas.push('');
    linhas.push('── DADOS DO USUÁRIO ──');
    linhas.push(`Nome: ${cfg.nomeUsuario || 'Você'}`);
    linhas.push(`Data atual: ${hojeISO} (${hoje.toLocaleDateString('pt-BR', { weekday: 'long' })})`);
    linhas.push(`Mês de referência: ${mesAtual}`);
    linhas.push(`Moeda do app: ${cfg.moeda || 'BRL'}`);
    linhas.push('');

    /* ─── FINANCEIRO ─── */
    try {
      const contas = (DB.getContas && DB.getContas()) || [];
      const txs = (DB.getTxs && DB.getTxs()) || [];

      /* Schema: c.dataVencimento (YYYY-MM-DD), c.descricao, c.valor, c.status */
      const contasMes      = contas.filter(c => (c.dataVencimento || '').startsWith(mesAtual));
      const pendentesMes   = contasMes.filter(c => c.status === 'pendente' || c.status === 'atrasada');
      const pagasMes       = contasMes.filter(c => c.status === 'paga');
      const atrasadasMes   = contasMes.filter(c => c.status === 'atrasada');

      const totalOriginalMes = contasMes.reduce((s, c) => s + (c.valor || 0), 0);
      const totalPagoMes     = pagasMes.reduce((s, c) => s + (c.valor || 0), 0);
      const totalAindaPagar  = pendentesMes.reduce((s, c) => s + (c.valor || 0), 0);
      const totalAtrasadoMes = atrasadasMes.reduce((s, c) => s + (c.valor || 0), 0);

      const pendentesTodas    = contas.filter(c => c.status === 'pendente' || c.status === 'atrasada');
      const totalPendenteGeral = pendentesTodas.reduce((s, c) => s + (c.valor || 0), 0);

      const txMes = txs.filter(t => (t.data || '').startsWith(mesAtual));
      const receitas = txMes.filter(t => t.tipo === 'entrada' || t.tipo === 'receita').reduce((s, t) => s + (t.valor || 0), 0);
      const despesas = txMes.filter(t => t.tipo === 'saida'   || t.tipo === 'despesa').reduce((s, t) => s + (t.valor || 0), 0);
      const saldoEstimado = (cfg.saldoInicial || 0) + receitas - despesas;

      linhas.push('── FINANCEIRO (mês de referência: ' + mesAtual + ') ──');
      linhas.push(`Quantidade total de contas cadastradas no app: ${contas.length}`);

      if (contas.length === 0) {
        linhas.push('(Nenhuma conta cadastrada ainda. Para criar, acesse a página "Contas".)');
        respostasDiretas.push('P: Quanto eu devo este mês?');
        respostasDiretas.push('R: Nenhuma conta cadastrada ainda. Acesse "Contas" para criar.');
      } else {
        /* SUMÁRIO INEQUÍVOCO — cada métrica com rótulo único */
        linhas.push('');
        linhas.push(`Contas com vencimento no mês ${mesAtual}: ${contasMes.length}`);
        linhas.push(`  • TOTAL ORIGINAL do mês (pagas + pendentes): ${fmtBRL(totalOriginalMes)}`);
        linhas.push(`  • JÁ PAGAS no mês: ${pagasMes.length} contas, soma ${fmtBRL(totalPagoMes)}`);
        linhas.push(`  • AINDA A PAGAR no mês (pendentes+atrasadas): ${pendentesMes.length} contas, soma ${fmtBRL(totalAindaPagar)}`);
        if (atrasadasMes.length) {
          linhas.push(`  • DESTAS, atrasadas (venceram antes de hoje): ${atrasadasMes.length} contas, ${fmtBRL(totalAtrasadoMes)}`);
        }
        linhas.push('');
        linhas.push(`Saldo inicial configurado: ${fmtBRL(cfg.saldoInicial || 0)}`);
        linhas.push(`Receitas lançadas em ${mesAtual}: ${fmtBRL(receitas)} (${txMes.filter(t => t.tipo === 'entrada' || t.tipo === 'receita').length} lançamentos)`);
        linhas.push(`Despesas lançadas em ${mesAtual}: ${fmtBRL(despesas)} (${txMes.filter(t => t.tipo === 'saida' || t.tipo === 'despesa').length} lançamentos)`);
        linhas.push(`Saldo estimado (saldo inicial + receitas − despesas): ${fmtBRL(saldoEstimado)}`);
        linhas.push('');
        linhas.push(`Pendências em QUALQUER DATA (todas as contas não pagas): ${pendentesTodas.length} contas, soma ${fmtBRL(totalPendenteGeral)}`);

        /* LISTA COMPLETA: pendentes do mês atual */
        if (pendentesMes.length) {
          const ordenadas = pendentesMes.slice().sort((a, b) => (a.dataVencimento || '').localeCompare(b.dataVencimento || ''));
          linhas.push('');
          linhas.push(`■ LISTA COMPLETA DAS ${pendentesMes.length} CONTAS QUE FALTAM PAGAR EM ${mesAtual}:`);
          ordenadas.forEach(c => {
            linhas.push(`  • ${c.descricao || 'Conta'} — ${fmtBRL(c.valor)} — vence ${c.dataVencimento || 's/data'} — status: ${c.status}`);
          });
        }

        /* LISTA COMPLETA: contas atrasadas do mês */
        if (atrasadasMes.length) {
          linhas.push('');
          linhas.push(`■ LISTA COMPLETA DAS ${atrasadasMes.length} CONTAS ATRASADAS:`);
          atrasadasMes.slice().sort((a, b) => (a.dataVencimento || '').localeCompare(b.dataVencimento || '')).forEach(c => {
            linhas.push(`  • ${c.descricao || 'Conta'} — ${fmtBRL(c.valor)} — venceu em ${c.dataVencimento}`);
          });
        }

        /* LISTA COMPLETA: pendentes futuras (próximos meses, até 30 itens) */
        const futuras = pendentesTodas.filter(c => (c.dataVencimento || '') > hojeISO && !(c.dataVencimento || '').startsWith(mesAtual));
        if (futuras.length) {
          linhas.push('');
          linhas.push(`■ LISTA DE ${Math.min(futuras.length, 30)} CONTAS PENDENTES DE MESES FUTUROS:`);
          futuras.slice().sort((a, b) => a.dataVencimento.localeCompare(b.dataVencimento)).slice(0, 30).forEach(c => {
            linhas.push(`  • ${c.descricao || 'Conta'} — ${fmtBRL(c.valor)} — vence ${c.dataVencimento}`);
          });
        }

        /* LISTA COMPLETA: contas já pagas no mês */
        if (pagasMes.length) {
          linhas.push('');
          linhas.push(`■ LISTA COMPLETA DAS ${pagasMes.length} CONTAS JÁ PAGAS EM ${mesAtual}:`);
          pagasMes.slice().sort((a, b) => (a.dataPagamento || '').localeCompare(b.dataPagamento || '')).forEach(c => {
            linhas.push(`  • ${c.descricao || 'Conta'} — ${fmtBRL(c.valor)} — pago em ${c.dataPagamento || 's/data'}`);
          });
        }

        /* ─── RESPOSTAS DIRETAS — Financeiro ─── */
        respostasDiretas.push(`P: Quanto eu devo este mês? / Quanto falta pagar este mês? / Quanto ainda preciso pagar?`);
        respostasDiretas.push(`R: ${fmtBRL(totalAindaPagar)} (${pendentesMes.length} ${pendentesMes.length === 1 ? 'conta pendente' : 'contas pendentes'} em ${mesAtual}).`);
        respostasDiretas.push('');

        respostasDiretas.push(`P: Quais contas falta eu pagar? / Liste as contas pendentes deste mês / Quais ainda não paguei?`);
        if (pendentesMes.length) {
          respostasDiretas.push(`R: Você tem ${pendentesMes.length} ${pendentesMes.length === 1 ? 'conta' : 'contas'} para pagar em ${mesAtual} (total ${fmtBRL(totalAindaPagar)}):`);
          pendentesMes.slice().sort((a, b) => (a.dataVencimento || '').localeCompare(b.dataVencimento || '')).forEach(c => {
            const marcador = c.status === 'atrasada' ? '⚠ ATRASADA' : 'vence';
            respostasDiretas.push(`   • ${c.descricao || 'Conta'} — ${fmtBRL(c.valor)} — ${marcador} ${c.dataVencimento || 's/data'}`);
          });
        } else {
          respostasDiretas.push('R: Nenhuma conta pendente para este mês. Tudo em dia! ✓');
        }
        respostasDiretas.push('');

        respostasDiretas.push(`P: Quais contas já paguei este mês? / Liste as contas pagas`);
        if (pagasMes.length) {
          respostasDiretas.push(`R: Você pagou ${pagasMes.length} ${pagasMes.length === 1 ? 'conta' : 'contas'} em ${mesAtual} (total ${fmtBRL(totalPagoMes)}):`);
          pagasMes.slice().sort((a, b) => (a.dataPagamento || '').localeCompare(b.dataPagamento || '')).forEach(c => {
            respostasDiretas.push(`   • ${c.descricao || 'Conta'} — ${fmtBRL(c.valor)} — pago em ${c.dataPagamento || 's/data'}`);
          });
        } else {
          respostasDiretas.push('R: Você ainda não pagou nenhuma conta este mês.');
        }
        respostasDiretas.push('');

        respostasDiretas.push(`P: Quanto eu já paguei este mês?`);
        respostasDiretas.push(`R: ${fmtBRL(totalPagoMes)} (${pagasMes.length} ${pagasMes.length === 1 ? 'conta paga' : 'contas pagas'} em ${mesAtual}).`);
        respostasDiretas.push('');

        respostasDiretas.push(`P: Qual o total ORIGINAL de contas deste mês? / Quanto era o total a pagar?`);
        respostasDiretas.push(`R: ${fmtBRL(totalOriginalMes)} (${contasMes.length} ${contasMes.length === 1 ? 'conta' : 'contas'} com vencimento em ${mesAtual}, somando pagas e pendentes).`);
        respostasDiretas.push('');

        respostasDiretas.push(`P: Tenho contas atrasadas? / Quais estão atrasadas?`);
        if (atrasadasMes.length) {
          respostasDiretas.push(`R: Sim, ${atrasadasMes.length} ${atrasadasMes.length === 1 ? 'conta atrasada' : 'contas atrasadas'}, somando ${fmtBRL(totalAtrasadoMes)}:`);
          atrasadasMes.slice().sort((a, b) => (a.dataVencimento || '').localeCompare(b.dataVencimento || '')).forEach(c => {
            respostasDiretas.push(`   • ${c.descricao || 'Conta'} — ${fmtBRL(c.valor)} — venceu em ${c.dataVencimento}`);
          });
        } else {
          respostasDiretas.push('R: Não, nenhuma conta atrasada este mês.');
        }
        respostasDiretas.push('');

        respostasDiretas.push(`P: Quais contas tenho para o próximo mês? / Quais contas vencem depois?`);
        if (futuras.length) {
          respostasDiretas.push(`R: Você tem ${futuras.length} ${futuras.length === 1 ? 'conta' : 'contas'} pendentes em meses futuros (após ${mesAtual}):`);
          futuras.slice().sort((a, b) => a.dataVencimento.localeCompare(b.dataVencimento)).slice(0, 20).forEach(c => {
            respostasDiretas.push(`   • ${c.descricao || 'Conta'} — ${fmtBRL(c.valor)} — vence ${c.dataVencimento}`);
          });
        } else {
          respostasDiretas.push('R: Nenhuma conta cadastrada para meses futuros.');
        }
        respostasDiretas.push('');

        respostasDiretas.push(`P: Como está meu saldo? / Qual meu saldo atual?`);
        respostasDiretas.push(`R: Saldo estimado: ${fmtBRL(saldoEstimado)} (saldo inicial ${fmtBRL(cfg.saldoInicial || 0)} + receitas ${fmtBRL(receitas)} − despesas ${fmtBRL(despesas)}).`);
        respostasDiretas.push('');
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
        const baixoEstoque = produtos.filter(p => (p.estoque || 0) > 0 && (p.estoque || 0) <= (p.estoqueMinimo || 0));
        const semEstoque = produtos.filter(p => (p.estoque || 0) === 0);

        const vendasMes      = vendas.filter(v => (v.data || '').startsWith(mesAtual));
        const totalVendasMes = vendasMes.reduce((s, v) => s + (v.total || 0), 0);
        const vendasPagas    = vendasMes.filter(v => v.status === 'paga');
        const totalPagasMes  = vendasPagas.reduce((s, v) => s + (v.total || 0), 0);
        const vendasPendentes = vendasMes.filter(v => v.status === 'pendente' || v.status === 'fiado');
        const totalPendenteVendas = vendasPendentes.reduce((s, v) => s + (v.total || 0), 0);

        const vendasHoje = vendas.filter(v => v.data === hojeISO);
        const totalVendasHoje = vendasHoje.reduce((s, v) => s + (v.total || 0), 0);

        linhas.push(`Produtos: ${produtos.length} total (${ativos.length} ativos)`);
        if (baixoEstoque.length) {
          linhas.push(`■ LISTA COMPLETA DOS ${baixoEstoque.length} PRODUTOS COM ESTOQUE BAIXO:`);
          baixoEstoque.forEach(p => {
            linhas.push(`  • ${p.nome}: ${p.estoque} unidades (mínimo: ${p.estoqueMinimo})`);
          });
        }
        if (semEstoque.length) {
          linhas.push(`■ LISTA COMPLETA DOS ${semEstoque.length} PRODUTOS SEM ESTOQUE:`);
          semEstoque.forEach(p => linhas.push(`  • ${p.nome}`));
        }
        linhas.push('');
        linhas.push(`Vendas em ${mesAtual}: ${vendasMes.length} vendas, total ${fmtBRL(totalVendasMes)}`);
        linhas.push(`  • TOTAL JÁ RECEBIDO em vendas pagas: ${fmtBRL(totalPagasMes)} (${vendasPagas.length} vendas)`);
        linhas.push(`  • TOTAL A RECEBER em vendas pendentes/fiado: ${fmtBRL(totalPendenteVendas)} (${vendasPendentes.length} vendas)`);
        linhas.push(`Vendas de hoje (${hojeISO}): ${vendasHoje.length} vendas, total ${fmtBRL(totalVendasHoje)}`);

        /* LISTA COMPLETA de vendas pendentes */
        if (vendasPendentes.length) {
          linhas.push('');
          linhas.push(`■ LISTA COMPLETA DAS ${vendasPendentes.length} VENDAS PENDENTES/FIADO EM ${mesAtual}:`);
          vendasPendentes.slice().sort((a, b) => (b.data || '').localeCompare(a.data || '')).forEach(v => {
            linhas.push(`  • ${v.data} — ${v.clienteNome || 'Cliente'} — ${fmtBRL(v.total)} — status: ${v.status}`);
          });
        }

        /* LISTA das vendas recentes (todas do mês, até 20) */
        if (vendasMes.length) {
          const recentes = vendasMes.slice().sort((a, b) => (b.data || '').localeCompare(a.data || '')).slice(0, 20);
          linhas.push('');
          linhas.push(`Vendas mais recentes em ${mesAtual} (até 20):`);
          recentes.forEach(v => {
            linhas.push(`  • ${v.data} — ${v.clienteNome || 'Cliente'} — ${fmtBRL(v.total)} — status: ${v.status}`);
          });
        }

        linhas.push('');
        linhas.push(`Clientes cadastrados: ${clientes.length}`);
        const clientesDevendo = clientes.filter(c => (c.saldoDevedor || 0) > 0);
        const totalReceberClientes = clientesDevendo.reduce((s, c) => s + (c.saldoDevedor || 0), 0);
        if (clientesDevendo.length) {
          linhas.push(`■ LISTA COMPLETA DOS ${clientesDevendo.length} CLIENTES COM SALDO DEVEDOR (total a receber ${fmtBRL(totalReceberClientes)}):`);
          clientesDevendo.slice().sort((a, b) => (b.saldoDevedor || 0) - (a.saldoDevedor || 0)).forEach(c => {
            linhas.push(`  • ${c.nome}: ${fmtBRL(c.saldoDevedor)}`);
          });
        }

        /* ─── RESPOSTAS DIRETAS — Negócio ─── */
        respostasDiretas.push(`P: Qual o resumo das vendas deste mês? / Quanto vendi este mês?`);
        respostasDiretas.push(`R: ${vendasMes.length} ${vendasMes.length === 1 ? 'venda' : 'vendas'} em ${mesAtual}, total ${fmtBRL(totalVendasMes)} (${fmtBRL(totalPagasMes)} já recebido, ${fmtBRL(totalPendenteVendas)} a receber).`);
        respostasDiretas.push('');

        respostasDiretas.push(`P: Quanto vendi hoje? / Quais vendas fiz hoje?`);
        if (vendasHoje.length) {
          respostasDiretas.push(`R: ${vendasHoje.length} ${vendasHoje.length === 1 ? 'venda' : 'vendas'} hoje, total ${fmtBRL(totalVendasHoje)}:`);
          vendasHoje.forEach(v => respostasDiretas.push(`   • ${v.clienteNome || 'Cliente'} — ${fmtBRL(v.total)} — ${v.status}`));
        } else {
          respostasDiretas.push('R: Nenhuma venda registrada hoje.');
        }
        respostasDiretas.push('');

        respostasDiretas.push(`P: Quais clientes estão me devendo? / Quem está em débito? / Liste os fiados`);
        if (clientesDevendo.length) {
          respostasDiretas.push(`R: ${clientesDevendo.length} ${clientesDevendo.length === 1 ? 'cliente' : 'clientes'} com saldo devedor (total ${fmtBRL(totalReceberClientes)} a receber):`);
          clientesDevendo.slice().sort((a, b) => (b.saldoDevedor || 0) - (a.saldoDevedor || 0)).forEach(c => {
            respostasDiretas.push(`   • ${c.nome}: ${fmtBRL(c.saldoDevedor)}`);
          });
        } else {
          respostasDiretas.push('R: Nenhum cliente em débito no momento.');
        }
        respostasDiretas.push('');

        respostasDiretas.push(`P: Quais vendas pendentes/fiado tenho? / Quais vendas não foram pagas?`);
        if (vendasPendentes.length) {
          respostasDiretas.push(`R: ${vendasPendentes.length} ${vendasPendentes.length === 1 ? 'venda pendente' : 'vendas pendentes'} (total ${fmtBRL(totalPendenteVendas)}):`);
          vendasPendentes.slice().sort((a, b) => (a.data || '').localeCompare(b.data || '')).forEach(v => {
            respostasDiretas.push(`   • ${v.data} — ${v.clienteNome || 'Cliente'} — ${fmtBRL(v.total)} (${v.status})`);
          });
        } else {
          respostasDiretas.push('R: Nenhuma venda pendente — todas pagas! ✓');
        }
        respostasDiretas.push('');

        respostasDiretas.push(`P: Tenho produtos com estoque baixo? / Quais produtos estão acabando?`);
        if (baixoEstoque.length || semEstoque.length) {
          respostasDiretas.push(`R: Sim — ${baixoEstoque.length} ${baixoEstoque.length === 1 ? 'produto' : 'produtos'} com estoque baixo e ${semEstoque.length} sem estoque:`);
          baixoEstoque.forEach(p => respostasDiretas.push(`   • ${p.nome}: ${p.estoque} un. (mínimo ${p.estoqueMinimo})`));
          semEstoque.forEach(p => respostasDiretas.push(`   • ${p.nome}: ZERADO`));
        } else {
          respostasDiretas.push('R: Não, todos os produtos têm estoque acima do mínimo.');
        }
        respostasDiretas.push('');
      }
      linhas.push('');
    } catch (e) {}

    /* ─── PESSOAL ─── */
    try {
      const tarefas = (DB.getTarefas && DB.getTarefas()) || [];
      const agenda  = (DB.getAgenda   && DB.getAgenda())   || [];
      const meds    = (DB.getMedicamentos && DB.getMedicamentos()) || [];

      const tarefasPendentes = tarefas.filter(t => t.status !== 'concluida');
      const tarefasConcluidas = tarefas.filter(t => t.status === 'concluida');
      const tarefasHoje      = tarefasPendentes.filter(t => t.data === hojeISO);
      const tarefasAtrasadas = tarefasPendentes.filter(t => t.data && t.data < hojeISO);
      const tarefasSemPrazo  = tarefasPendentes.filter(t => !t.data);

      const eventosSemana = agenda.filter(e => e.data >= hojeISO && e.data <= daquiSeteDias);
      const eventosHoje   = agenda.filter(e => e.data === hojeISO);

      linhas.push('── PESSOAL ──');
      if (!tarefas.length && !agenda.length && !meds.length) {
        linhas.push('(Nenhuma tarefa, evento ou medicamento cadastrado ainda.)');
      } else {
        linhas.push(`Tarefas totais: ${tarefas.length} (${tarefasPendentes.length} pendentes + ${tarefasConcluidas.length} concluídas)`);
        linhas.push(`  • Tarefas para HOJE (${hojeISO}): ${tarefasHoje.length}`);
        linhas.push(`  • Tarefas ATRASADAS (vencidas antes de hoje): ${tarefasAtrasadas.length}`);
        linhas.push(`  • Tarefas SEM PRAZO definido: ${tarefasSemPrazo.length}`);

        if (tarefasAtrasadas.length) {
          linhas.push(`■ LISTA COMPLETA DAS ${tarefasAtrasadas.length} TAREFAS ATRASADAS:`);
          tarefasAtrasadas.slice().sort((a, b) => (a.data || '').localeCompare(b.data || '')).forEach(t => {
            linhas.push(`  • ${t.titulo} (era ${t.data}) [prioridade: ${t.prioridade || 'normal'}]`);
          });
        }
        if (tarefasHoje.length) {
          linhas.push(`■ LISTA COMPLETA DAS ${tarefasHoje.length} TAREFAS DE HOJE:`);
          tarefasHoje.forEach(t => {
            linhas.push(`  • ${t.titulo}${t.hora ? ' às ' + t.hora : ''} [prioridade: ${t.prioridade || 'normal'}]`);
          });
        }
        if (tarefasSemPrazo.length) {
          linhas.push(`■ LISTA DAS ${Math.min(tarefasSemPrazo.length, 20)} TAREFAS PENDENTES SEM PRAZO:`);
          tarefasSemPrazo.slice(0, 20).forEach(t => {
            linhas.push(`  • ${t.titulo} [prioridade: ${t.prioridade || 'normal'}]`);
          });
        }
        if (eventosHoje.length) {
          linhas.push(`■ LISTA COMPLETA DOS ${eventosHoje.length} EVENTOS DE HOJE:`);
          eventosHoje.forEach(e => linhas.push(`  • ${e.hora || ''} — ${e.titulo}${e.descricao ? ' (' + e.descricao + ')' : ''}`));
        }
        if (eventosSemana.length) {
          linhas.push(`■ LISTA DOS ${eventosSemana.length} EVENTOS DOS PRÓXIMOS 7 DIAS (até ${daquiSeteDias}):`);
          eventosSemana.forEach(e => {
            linhas.push(`  • ${e.data} ${e.hora || ''} — ${e.titulo}`);
          });
        }
        if (meds.length) {
          linhas.push(`■ LISTA DOS ${meds.length} MEDICAMENTOS CADASTRADOS:`);
          meds.forEach(m => {
            linhas.push(`  • ${m.nome || 'Medicamento'}${m.dosagem ? ' — ' + m.dosagem : ''}${m.frequencia ? ' — ' + m.frequencia : ''}`);
          });
        }

        /* ─── RESPOSTAS DIRETAS — Pessoal ─── */
        respostasDiretas.push(`P: Quais tarefas tenho hoje? / O que tenho que fazer hoje?`);
        if (tarefasHoje.length) {
          respostasDiretas.push(`R: ${tarefasHoje.length} ${tarefasHoje.length === 1 ? 'tarefa' : 'tarefas'} para hoje:`);
          tarefasHoje.forEach(t => {
            respostasDiretas.push(`   • ${t.titulo}${t.hora ? ' às ' + t.hora : ''} [${t.prioridade || 'normal'}]`);
          });
        } else {
          respostasDiretas.push('R: Nenhuma tarefa cadastrada para hoje.');
        }
        respostasDiretas.push('');

        respostasDiretas.push(`P: Tenho tarefas atrasadas? / Quais tarefas atrasadas?`);
        if (tarefasAtrasadas.length) {
          respostasDiretas.push(`R: Sim, ${tarefasAtrasadas.length} ${tarefasAtrasadas.length === 1 ? 'tarefa atrasada' : 'tarefas atrasadas'}:`);
          tarefasAtrasadas.forEach(t => respostasDiretas.push(`   • ${t.titulo} (era ${t.data}) [${t.prioridade || 'normal'}]`));
        } else {
          respostasDiretas.push('R: Não, nenhuma tarefa atrasada.');
        }
        respostasDiretas.push('');

        respostasDiretas.push(`P: Quais tarefas pendentes tenho? / Liste todas tarefas que faltam fazer`);
        if (tarefasPendentes.length) {
          respostasDiretas.push(`R: Você tem ${tarefasPendentes.length} ${tarefasPendentes.length === 1 ? 'tarefa pendente' : 'tarefas pendentes'}:`);
          tarefasPendentes.slice().sort((a, b) => (a.data || '9999').localeCompare(b.data || '9999')).forEach(t => {
            const quando = t.data ? `(${t.data}${t.hora ? ' ' + t.hora : ''})` : '(sem prazo)';
            respostasDiretas.push(`   • ${t.titulo} ${quando} [${t.prioridade || 'normal'}]`);
          });
        } else {
          respostasDiretas.push('R: Nenhuma tarefa pendente! ✓');
        }
        respostasDiretas.push('');

        respostasDiretas.push(`P: Quais eventos tenho hoje? / O que tenho na agenda hoje?`);
        if (eventosHoje.length) {
          respostasDiretas.push(`R: ${eventosHoje.length} ${eventosHoje.length === 1 ? 'evento' : 'eventos'} hoje:`);
          eventosHoje.forEach(e => respostasDiretas.push(`   • ${e.hora || ''} — ${e.titulo}`));
        } else {
          respostasDiretas.push('R: Nenhum evento cadastrado para hoje.');
        }
        respostasDiretas.push('');

        respostasDiretas.push(`P: O que tenho na agenda essa semana? / Eventos próximos`);
        if (eventosSemana.length) {
          respostasDiretas.push(`R: ${eventosSemana.length} ${eventosSemana.length === 1 ? 'evento' : 'eventos'} nos próximos 7 dias:`);
          eventosSemana.forEach(e => respostasDiretas.push(`   • ${e.data} ${e.hora || ''} — ${e.titulo}`));
        } else {
          respostasDiretas.push('R: Nenhum evento cadastrado para os próximos 7 dias.');
        }
        respostasDiretas.push('');
      }
      linhas.push('');
    } catch (e) {}

    /* ─── METAS / CAIXINHAS — Respostas Diretas ─── */
    try {
      const metas = (DB.getMetas && DB.getMetas()) || [];
      if (metas.length) {
        respostasDiretas.push(`P: Como estão minhas metas? / Resumo das caixinhas?`);
        respostasDiretas.push(`R: Você tem ${metas.length} ${metas.length === 1 ? 'meta' : 'metas'}:`);
        metas.forEach(m => {
          const valorAtual = (DB.getValorMeta && DB.getValorMeta(m.id)) || 0;
          const alvo = m.valorAlvo || 0;
          const pct = alvo ? Math.round(valorAtual / alvo * 100) : 0;
          respostasDiretas.push(`   • ${m.nome}: ${fmtBRL(valorAtual)} de ${fmtBRL(alvo)} (${pct}%)`);
        });
        respostasDiretas.push('');
      }
    } catch (e) {}

    /* ═══ RESPOSTAS DIRETAS A PERGUNTAS COMUNS ═══ */
    if (respostasDiretas.length) {
      linhas.push('═══════════════════════════════════════════════════════════');
      linhas.push('  RESPOSTAS DIRETAS — Use EXATAMENTE estas respostas');
      linhas.push('  quando a pergunta do usuário corresponder.');
      linhas.push('═══════════════════════════════════════════════════════════');
      respostasDiretas.forEach(l => linhas.push(l));
      linhas.push('');
    }

    linhas.push('═══ FIM DO CONTEXTO ═══');
    linhas.push('REGRA FINAL: Se a pergunta combinar com uma "RESPOSTA DIRETA" acima, copie a resposta literalmente. Se não combinar, use os dados desta seção sem fazer cálculos próprios. Se a informação não estiver aqui, responda "Essa informação ainda não está no app".');

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
          <h3>Chat Assistente — Provedor</h3>
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
