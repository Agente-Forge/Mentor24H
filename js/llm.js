/* ═══════════════════════════════════════════════════════════
   LLM — Multi-provider AI Chat (OpenRouter, OpenAI, Gemini, Claude)
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
    return `
      <div class="llm-welcome">
        <div class="llm-welcome-icon"><span data-icon="bot" data-size="48"></span></div>
        <h2 class="llm-welcome-title">Mentor AI</h2>
        <p class="llm-welcome-sub">Seu assistente pessoal e empresarial.<br>Conectado via <strong>${provider ? provider.name : cfg.provider}</strong> · ${cfg.model}</p>
        <button class="btn btn-primary" id="llm-start-btn">
          <span data-icon="message-square" data-size="14"></span>
          Iniciar conversa
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
    if (conversa.titulo === 'Nova conversa') conversa.titulo = text.slice(0, 40);
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
      const response = await callProvider(conversa.msgs, cfg);

      conversa.msgs.push({ role: 'assistant', content: response });
      DB.saveLlmConversa(conversa);
    } catch (err) {
      const errMsg = `Erro ao conectar com a IA: ${err.message || 'Verifique sua API key e conexão.'}`;
      conversa.msgs.push({ role: 'assistant', content: errMsg });
      DB.saveLlmConversa(conversa);
    }

    isLoading = false;
    render();
  }

  /* ─── CALL PROVIDERS ─── */
  async function callProvider(msgs, cfg) {
    switch (cfg.provider) {
      case 'openrouter': return callOpenRouter(msgs, cfg);
      case 'openai':     return callOpenAI(msgs, cfg);
      case 'gemini':     return callGemini(msgs, cfg);
      case 'claude':     return callClaude(msgs, cfg);
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

  /* ─── CONFIG SECTION (renderizada em Config) ─── */
  function renderConfig() {
    const cfg = DB.getLlmConfig();
    const container = document.getElementById('config-llm-section');
    if (!container) return;

    const provider = PROVIDERS[cfg.provider] || PROVIDERS.openrouter;
    const modelsHtml = provider.models.map(m =>
      `<option value="${m.id}" ${cfg.model === m.id ? 'selected' : ''}>${m.label}</option>`
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
                `<option value="${k}" ${cfg.provider === k ? 'selected' : ''}>${v.name}</option>`
              ).join('')}
            </select>
          </div>
          <div class="field">
            <label class="field-label">Modelo</label>
            <select id="llm-cfg-model">${modelsHtml}</select>
          </div>
        </div>

        <div id="llm-provider-hint" class="field-hint" style="margin-bottom:var(--s-3);color:var(--amber)">${provider.hint}</div>

        <div class="field">
          <label class="field-label">API Key</label>
          <input type="password" id="llm-cfg-key" value="${cfg.apiKey}" placeholder="sk-... ou chave do provedor">
        </div>

        <div class="field" style="margin-top:var(--s-3)">
          <label class="field-label">Prompt do sistema (opcional)</label>
          <textarea id="llm-cfg-system" rows="3" style="resize:vertical">${cfg.systemPrompt || ''}</textarea>
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
  }

  function bindConfigEvents(container) {
    const provSelect = container.querySelector('#llm-cfg-provider');
    const modelSelect = container.querySelector('#llm-cfg-model');
    const hint = container.querySelector('#llm-provider-hint');

    provSelect?.addEventListener('change', () => {
      const p = PROVIDERS[provSelect.value];
      if (!p) return;
      hint.textContent = p.hint;
      modelSelect.innerHTML = p.models.map(m => `<option value="${m.id}">${m.label}</option>`).join('');
    });

    container.querySelector('#llm-cfg-save')?.addEventListener('click', () => {
      DB.saveLlmConfig({
        provider: provSelect?.value,
        apiKey: container.querySelector('#llm-cfg-key')?.value?.trim(),
        model: modelSelect?.value,
        systemPrompt: container.querySelector('#llm-cfg-system')?.value?.trim(),
      });
      Toast.success('Configuração salva!', 'Provedor de IA atualizado.');
    });
  }

  return { render, renderConfig, novaConversa };
})();
