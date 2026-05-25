/* ═══════════════════════════════════════════════════════════
   CHAT-WA — Interface WhatsApp CRM simulada
═══════════════════════════════════════════════════════════ */

const ChatWA = (() => {

  let selectedContatoId = null;

  /* ─── RENDER PRINCIPAL ─── */
  function render() {
    const container = document.getElementById('chat-wa-content');
    if (!container) return;

    /* Sem auto-seed: chat vazio mostra estado vazio (não re-injeta dados demo) */
    const contatosAtualizados = DB.getChatContatos();

    container.innerHTML = `
      <div class="wa-shell">
        <!-- Lista de contatos -->
        <aside class="wa-list-panel">
          <div class="wa-list-head">
            <div class="wa-list-title">Mensagens</div>
            <button class="btn btn-ghost btn-sm" id="wa-new-contato" title="Novo contato">
              <span data-icon="user-plus" data-size="16"></span>
            </button>
          </div>
          <div class="wa-search-row">
            <span data-icon="search" data-size="14" class="wa-search-icon"></span>
            <input id="wa-search" type="text" placeholder="Buscar contato…" class="wa-search-input">
          </div>
          <div class="wa-contatos-list" id="wa-contatos-list">
            ${contatosAtualizados.length
              ? contatosAtualizados.map(c => contatoItem(c)).join('')
              : '<div class="wa-empty-list">Sem contatos ainda</div>'
            }
          </div>
        </aside>

        <!-- Área de conversa -->
        <div class="wa-chat-panel" id="wa-chat-panel">
          ${selectedContatoId
            ? renderConversa(selectedContatoId)
            : renderSelectPrompt()
          }
        </div>

        <!-- CRM lateral -->
        <aside class="wa-crm-panel" id="wa-crm-panel">
          ${selectedContatoId ? renderCrm(selectedContatoId) : ''}
        </aside>
      </div>
    `;

    Icons.render(container);
    bindWaEvents(container);
  }

  function contatoItem(c) {
    const msgs = DB.getChatMsgs(c.id);
    const ultima = msgs.length ? msgs[msgs.length - 1] : null;
    const preview = ultima ? ultima.texto.slice(0, 45) + (ultima.texto.length > 45 ? '…' : '') : 'Sem mensagens';
    const hora = ultima ? ultima.hora : '';
    const avatar = (c.avatar || (c.nome || '?').charAt(0)).toUpperCase();
    return `
      <div class="wa-contato-item${c.id === selectedContatoId ? ' active' : ''}" data-wa-contato="${esc(c.id)}">
        <div class="wa-contato-avatar" style="background:${stringToColor(c.nome || '')}">${esc(avatar)}</div>
        <div class="wa-contato-info">
          <div class="wa-contato-nome">${esc(c.nome)}</div>
          <div class="wa-contato-preview">${esc(preview)}</div>
        </div>
        <div class="wa-contato-meta">
          ${hora ? `<div class="wa-contato-hora">${esc(hora)}</div>` : ''}
          ${c.naoLidas ? `<div class="wa-badge">${Number(c.naoLidas) || 0}</div>` : ''}
        </div>
      </div>
    `;
  }

  function renderSelectPrompt() {
    return `
      <div class="wa-select-prompt">
        <span data-icon="message-circle" data-size="56"></span>
        <h3>Selecione um contato</h3>
        <p>Escolha um contato na lista para ver a conversa.</p>
        <div class="wa-api-notice">
          <span data-icon="info" data-size="14"></span>
          <span>Esta é uma interface simulada. Conecte sua API WhatsApp Business nas Configurações para sincronizar mensagens reais.</span>
        </div>
      </div>
    `;
  }

  function renderConversa(contatoId) {
    const contato = DB.getChatContatos().find(c => c.id === contatoId);
    if (!contato) return renderSelectPrompt();
    const msgs = DB.getChatMsgs(contatoId);

    const bubblesHtml = msgs.map(m => `
      <div class="chat-bubble-wrap ${m.de === 'eu' ? 'from-me' : 'from-other'}">
        <div class="chat-bubble">${esc(m.texto)}</div>
        <div class="chat-meta">${esc(m.hora || '')} ${m.de === 'eu' ? '✓✓' : ''}</div>
      </div>
    `).join('');

    const nomeFirstChar = (contato.nome || '?').charAt(0);
    return `
      <div class="wa-chat-head">
        <div class="wa-contato-avatar sm" style="background:${stringToColor(contato.nome || '')}">${esc(nomeFirstChar)}</div>
        <div>
          <div class="wa-chat-nome">${esc(contato.nome)}</div>
          <div class="wa-chat-sub">${esc(contato.tel || 'Sem telefone')}</div>
        </div>
        <div class="wa-chat-head-actions">
          <button class="btn btn-ghost btn-sm" title="Whatsapp direto" onclick="window.open('https://wa.me/${esc(cleanPhone(contato.tel))}','_blank')">
            <span data-icon="external-link" data-size="14"></span>
          </button>
        </div>
      </div>
      <div class="wa-messages" id="wa-messages">
        ${bubblesHtml || '<div class="wa-no-msgs">Sem mensagens ainda. Inicie a conversa!</div>'}
      </div>
      <div class="wa-input-area">
        <input id="wa-msg-input" type="text" class="wa-msg-input" placeholder="Escreva uma mensagem…">
        <button class="btn btn-primary wa-send-btn" id="wa-send-btn">
          <span data-icon="send" data-size="16"></span>
        </button>
      </div>
    `;
  }

  function renderCrm(contatoId) {
    const c = DB.getChatContatos().find(c => c.id === contatoId);
    if (!c) return '';
    const vendas = DB.getVendas({ clienteId: contatoId });
    const total = vendas.reduce((s, v) => s + (v.total || 0), 0);
    const tags = (c.tags || []).map(t => `<span class="crm-tag">${esc(t)}</span>`).join('');
    const nomeFirstChar = (c.nome || '?').charAt(0);

    return `
      <div class="wa-crm-inner">
        <div class="wa-crm-avatar" style="background:${stringToColor(c.nome || '')}">${esc(nomeFirstChar)}</div>
        <div class="wa-crm-nome">${esc(c.nome)}</div>
        ${c.tel ? `<a href="https://wa.me/${esc(cleanPhone(c.tel))}" target="_blank" rel="noopener" class="wa-crm-tel">
          <span data-icon="phone" data-size="13"></span> ${esc(c.tel)}
        </a>` : ''}
        ${c.email ? `<div class="wa-crm-email"><span data-icon="mail" data-size="13"></span> ${esc(c.email)}</div>` : ''}
        ${tags ? `<div class="wa-crm-tags">${tags}</div>` : ''}
        <div class="wa-crm-section">Histórico</div>
        <div class="wa-crm-stat"><span>Compras</span><strong>${vendas.length}</strong></div>
        <div class="wa-crm-stat"><span>Total gasto</span><strong>${esc(Utils.formatCurrency(total))}</strong></div>
        ${c.notas ? `<div class="wa-crm-notas">${esc(c.notas)}</div>` : ''}
      </div>
    `;
  }

  function bindWaEvents(container) {
    /* Clicar em contato */
    container.querySelectorAll('.wa-contato-item').forEach(el => {
      el.addEventListener('click', () => {
        selectedContatoId = el.dataset.waContato;
        /* Zerar naoLidas */
        const c = DB.getChatContatos().find(c => c.id === selectedContatoId);
        if (c && c.naoLidas) { DB.saveChatContato({ id: c.id, naoLidas: 0 }); }
        render();
        setTimeout(scrollWaMsgs, 80);
      });
    });

    /* Busca — debounce 150ms evita querySelectorAll em cada keystroke */
    let _searchTimer = null;
    container.querySelector('#wa-search')?.addEventListener('input', e => {
      clearTimeout(_searchTimer);
      _searchTimer = setTimeout(() => {
        const q = e.target.value.toLowerCase();
        container.querySelectorAll('.wa-contato-item').forEach(el => {
          const nome = el.querySelector('.wa-contato-nome')?.textContent.toLowerCase() || '';
          el.style.display = nome.includes(q) ? '' : 'none';
        });
      }, 150);
    });

    /* Enviar mensagem */
    const sendBtn = container.querySelector('#wa-send-btn');
    const msgInput = container.querySelector('#wa-msg-input');
    if (sendBtn && msgInput) {
      sendBtn.addEventListener('click', enviarMsg);
      msgInput.addEventListener('keydown', e => { if (e.key === 'Enter') enviarMsg(); });
    }

    /* Novo contato */
    container.querySelector('#wa-new-contato')?.addEventListener('click', novoContato);

    scrollWaMsgs();
  }

  function enviarMsg() {
    const input = document.getElementById('wa-msg-input');
    if (!input || !selectedContatoId) return;
    const texto = input.value.trim();
    if (!texto) return;

    DB.saveChatMsg({ contatoId: selectedContatoId, texto, de: 'eu' });
    input.value = '';
    render();
    setTimeout(scrollWaMsgs, 80);
  }

  function scrollWaMsgs() {
    const msgs = document.getElementById('wa-messages');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }

  function novoContato() {
    const headHtml = `
      <div class="modal-head">
        <div class="flex-1">
          <h2>Novo <em>contato</em></h2>
          <div class="sub">Adicione um contato para conversar</div>
        </div>
        <button class="modal-close" onclick="Modal.close()" aria-label="Fechar">${Icons.html('x', 14)}</button>
      </div>
    `;
    Modal.open(`
      ${headHtml}
      <div class="modal-body">
        <div class="field">
          <label class="field-label">Nome *</label>
          <input type="text" id="wa-new-nome" placeholder="Nome completo" data-autofocus>
        </div>
        <div class="field">
          <label class="field-label">Telefone (com DDD)</label>
          <input type="tel" id="wa-new-tel" placeholder="(11) 99999-9999">
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" onclick="Modal.close()">Cancelar</button>
        <button class="btn btn-primary" onclick="ChatWA._salvarNovoContato()">
          <span data-icon="check" data-size="14"></span> Salvar
        </button>
      </div>
    `, 'modal-sm');
    setTimeout(() => document.getElementById('wa-new-nome')?.focus(), 50);
  }

  function _salvarNovoContato() {
    const nome = document.getElementById('wa-new-nome')?.value.trim();
    if (!nome) { Toast.warning('Campo obrigatório', 'Informe o nome do contato.'); return; }
    const tel = document.getElementById('wa-new-tel')?.value.trim() || '';
    const c = DB.saveChatContato({ nome, tel, naoLidas: 0 });
    selectedContatoId = c.id;
    Modal.close();
    Toast.success('Contato salvo', nome);
    render();
  }

  /* ─── SEED DEMO ─── */
  function seedDemo() {
    const demos = [
      { nome: 'Maria Pereira', tel: '11987654321', tags: ['cliente'], naoLidas: 2 },
      { nome: 'João Silva', tel: '21912345678', tags: ['fornecedor'], naoLidas: 0 },
      { nome: 'Bia Costa', tel: '31998765432', tags: ['família'], naoLidas: 1 },
    ];
    demos.forEach(d => {
      const c = DB.saveChatContato(d);
      DB.saveChatMsg({ contatoId: c.id, texto: 'Olá! Tudo bem?', de: 'contato', hora: '09:30' });
      DB.saveChatMsg({ contatoId: c.id, texto: 'Oi! Tudo ótimo, obrigado!', de: 'eu', hora: '09:31' });
      if (d.naoLidas) {
        DB.saveChatMsg({ contatoId: c.id, texto: 'Quando posso passar aí?', de: 'contato', hora: '10:15' });
      }
    });
  }

  /* ─── HELPERS ─── */
  function cleanPhone(tel) {
    return (tel || '').replace(/\D/g, '');
  }

  function stringToColor(str) {
    const s = str || '';
    let hash = 0;
    for (let i = 0; i < s.length; i++) hash = s.charCodeAt(i) + ((hash << 5) - hash);
    const colors = ['#A78BFA','#F472B6','#FB923C','#5EE39A','#7BB6FF','#FBBF24','#22D3EE'];
    return colors[Math.abs(hash) % colors.length];
  }

  return { render, _salvarNovoContato };
})();
