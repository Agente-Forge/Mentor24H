/* ═══════════════════════════════════════════════════════════
   MODAL — Dialog system
═══════════════════════════════════════════════════════════ */

const Modal = (() => {
  const ICONS_META  = ['piggy-bank','plane','car','home','heart','star','zap','gift','trophy','camera','music','book','coffee','pizza','shirt','watch','laptop','phone','target','shield','flag','compass','gem','sparkles','globe','leaf','flame','sun'];
  const COLORS      = ['#A78BFA','#F472B6','#FBBF24','#5EE39A','#FF6B7A','#7BB6FF','#FB923C','#22D3EE','#D4A843','#A8C5DA'];
  const ICONS_CAT   = ['home','utensils','car','heart-pulse','graduation-cap','gamepad-2','wifi','trending-up','shopping-cart','zap','droplets','phone','tv','music','coffee','plane','briefcase','baby','dumbbell','shirt','scissors','wrench','globe','book','circle-dot','credit-card','banknote','flame'];

  let _icone = 'piggy-bank';
  let _cor   = '#A78BFA';

  function root() { return document.getElementById('modal-root'); }
  function body() { return document.getElementById('modal-body-wrap'); }

  function open(html, klass = '') {
    const r = root();
    const b = body();
    if (!r || !b) return;
    b.className = `modal ${klass}`;
    b.innerHTML = html;
    r.classList.add('open');
    Icons.render(b);
    requestAnimationFrame(() => {
      const f = b.querySelector('[data-autofocus]');
      if (f) f.focus();
    });
  }

  function close() {
    const r = root();
    if (!r) return;
    r.classList.remove('open');
    setTimeout(() => { const b = body(); if (b) b.innerHTML = ''; }, 250);
  }

  function head(title, em = '', sub = '') {
    return `
      <div class="modal-head">
        <div class="flex-1">
          <h2>${esc(title)}${em ? ` <em>${esc(em)}</em>` : ''}</h2>
          ${sub ? `<div class="sub">${esc(sub)}</div>` : ''}
        </div>
        <button class="modal-close" onclick="Modal.close()" aria-label="Fechar">${Icons.html('x', 14)}</button>
      </div>
    `;
  }

  /* ═══ PAGAR CONTA ═══ */
  function pagarConta(id) {
    const c = DB.getConta(id);
    if (!c) return;
    open(`
      ${head('Registrar', 'pagamento', c.descricao)}
      <div class="modal-body">
        <div style="background:linear-gradient(135deg,var(--violet-glow),var(--amber-glow));border:1px solid var(--line-2);border-radius:var(--r-md);padding:var(--s-5);text-align:center;margin-bottom:var(--s-5)">
          <div style="font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--text-3);margin-bottom:6px">Valor a pagar</div>
          <div class="display" style="font-size:var(--t-3xl);font-style:italic;background:linear-gradient(135deg,var(--violet),var(--magenta),var(--amber));-webkit-background-clip:text;background-clip:text;color:transparent;font-variant-numeric:tabular-nums">${fmt(c.valor)}</div>
        </div>
        <div class="field">
          <label class="field-label">Data do Pagamento</label>
          <input type="date" id="pag-data" value="${todayISO()}" data-autofocus>
        </div>
        <div class="field">
          <label class="field-label">Método</label>
          <select id="pag-metodo">
            <option value="pix">Pix</option>
            <option value="dinheiro">Dinheiro</option>
            <option value="cartao_debito">Cartão de Débito</option>
            <option value="cartao_credito">Cartão de Crédito</option>
            <option value="ted">TED / DOC</option>
            <option value="outros">Outros</option>
          </select>
        </div>
        <div class="field">
          <label class="field-label">Observação <span class="field-hint">(opcional)</span></label>
          <input type="text" id="pag-obs" placeholder="Ex: pago via app banco">
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" onclick="Modal.close()">Cancelar</button>
        <button class="btn btn-primary" onclick="Modal._confirmPagar('${esc(id)}')">${Icons.html('check', 15)} Confirmar</button>
      </div>
    `);
  }

  function _confirmPagar(id) {
    const data   = document.getElementById('pag-data').value;
    const metodo = document.getElementById('pag-metodo').value;
    const obs    = document.getElementById('pag-obs').value;
    DB.pagarConta(id, data, metodo, obs);
    close();
    Toast.success('Pagamento registrado', '✓ Conta marcada como paga');
    if (Router.getCurrent() === 'contas') Contas.render();
    else Dashboard.render();
  }

  /* ═══ NOVA / EDITAR CONTA ═══ */
  function novaConta() { editarConta(null); }

  function editarConta(id) {
    const c = id ? DB.getConta(id) : null;
    const cats = DB.getCategorias();
    const v = c || {
      descricao: '', valor: '', dataVencimento: '', categoria: 'outros',
      observacoes: '', status: 'pendente',
      recorrente: false, intervaloRecorrencia: 'mensal',
      parcelado: false, totalParcelas: 12, parcelaAtual: 1,
    };

    open(`
      ${head(id ? 'Editar' : 'Nova', id ? 'conta' : 'conta', id ? '' : 'Adicione um novo pagamento')}
      <div class="modal-body">
        <div class="field">
          <label class="field-label">Descrição *</label>
          <input type="text" id="c-desc" value="${esc(v.descricao)}" placeholder="Ex: Aluguel, Conta de luz..." data-autofocus>
        </div>
        <div class="field-row">
          <div class="field">
            <label class="field-label">Valor (R$) *</label>
            <input type="number" id="c-valor" value="${v.valor}" min="0" step="0.01" placeholder="0,00">
          </div>
          <div class="field">
            <label class="field-label">Vencimento</label>
            <input type="date" id="c-venc" value="${esc(v.dataVencimento || '')}">
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label class="field-label">Categoria</label>
            <select id="c-cat">
              ${cats.map(ct => `<option value="${ct.id}" ${v.categoria === ct.id ? 'selected' : ''}>${esc(ct.nome)}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label class="field-label">Status</label>
            <select id="c-status">
              <option value="pendente" ${v.status === 'pendente' ? 'selected' : ''}>Pendente</option>
              <option value="paga" ${v.status === 'paga' ? 'selected' : ''}>Paga</option>
              <option value="atrasada" ${v.status === 'atrasada' ? 'selected' : ''}>Atrasada</option>
            </select>
          </div>
        </div>
        <div class="field">
          <label class="field-label">Observações <span class="field-hint">(opcional)</span></label>
          <input type="text" id="c-obs" value="${esc(v.observacoes || '')}" placeholder="Notas extras...">
        </div>
        ${!id ? `
          <label class="toggle-card" style="margin-bottom:var(--s-3)">
            <div class="flex-1">
              <div class="label">Conta recorrente</div>
              <div class="desc">Repete periodicamente</div>
            </div>
            <label class="toggle-sw">
              <input type="checkbox" id="c-rec" onchange="Modal._toggleRec()">
              <span class="track"></span>
            </label>
          </label>
          <div id="rec-opts" style="display:none;margin-bottom:var(--s-4)">
            <div class="field">
              <label class="field-label">Intervalo</label>
              <select id="c-int">
                <option value="diario">Diário</option>
                <option value="semanal">Semanal</option>
                <option value="quinzenal">Quinzenal</option>
                <option value="mensal" selected>Mensal</option>
                <option value="anual">Anual</option>
              </select>
            </div>
          </div>
          <label class="toggle-card">
            <div class="flex-1">
              <div class="label">Parcelado</div>
              <div class="desc">Dividir em várias parcelas</div>
            </div>
            <label class="toggle-sw">
              <input type="checkbox" id="c-parc" onchange="Modal._togglePar()">
              <span class="track"></span>
            </label>
          </label>
          <div id="par-opts" style="display:none;margin-top:var(--s-3)">
            <div class="field-row">
              <div class="field">
                <label class="field-label">Nº de parcelas</label>
                <input type="number" id="c-nparc" value="12" min="2" max="360">
              </div>
              <div class="field">
                <label class="field-label">Valor total</label>
                <input type="number" id="c-vtotal" placeholder="Auto = valor × nº" min="0" step="0.01">
                <div class="field-hint">Deixe vazio para usar campo "Valor"</div>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" onclick="Modal.close()">Cancelar</button>
        <button class="btn btn-primary" onclick="Modal._saveConta('${esc(id || '')}')">${Icons.html(id ? 'save' : 'plus', 15)} ${id ? 'Salvar' : 'Adicionar'}</button>
      </div>
    `);
  }

  function _toggleRec() {
    const cb = document.getElementById('c-rec');
    document.getElementById('rec-opts').style.display = cb.checked ? 'block' : 'none';
    document.querySelector('label.toggle-card:has(#c-rec)')?.classList.toggle('active', cb.checked);
  }

  function _togglePar() {
    const cb = document.getElementById('c-parc');
    document.getElementById('par-opts').style.display = cb.checked ? 'block' : 'none';
    document.querySelector('label.toggle-card:has(#c-parc)')?.classList.toggle('active', cb.checked);
  }

  function _saveConta(id) {
    const desc  = document.getElementById('c-desc').value.trim();
    const valor = parseFloat(document.getElementById('c-valor').value);
    if (!desc) { Toast.error('Descrição obrigatória'); return; }
    if (!valor || valor <= 0) { Toast.error('Valor inválido'); return; }

    const data = {
      id: id || undefined,
      descricao: desc,
      valor,
      dataVencimento: document.getElementById('c-venc').value || null,
      categoria: document.getElementById('c-cat').value,
      status:    document.getElementById('c-status').value,
      observacoes: document.getElementById('c-obs').value || '',
    };

    const recCb = document.getElementById('c-rec');
    const parCb = document.getElementById('c-parc');

    if (recCb && recCb.checked) {
      data.recorrente = true;
      data.intervaloRecorrencia = document.getElementById('c-int').value;
      data.recorrenciaAtiva = true;
    }

    if (parCb && parCb.checked) {
      const n = parseInt(document.getElementById('c-nparc').value, 10) || 2;
      const vtotal = parseFloat(document.getElementById('c-vtotal').value);
      const valorBase = vtotal && vtotal > 0 ? vtotal / n : valor;
      DB.gerarParcelas({ ...data, valor: valorBase * n }, n);
      close();
      Toast.success('Parcelamento criado', `${n} parcelas geradas`);
      if (Router.getCurrent() === 'contas') Contas.render();
      else Dashboard.render();
      return;
    }

    DB.saveConta(data);
    close();
    Toast.success(id ? 'Conta atualizada' : 'Conta adicionada');
    if (Router.getCurrent() === 'contas') Contas.render();
    else Dashboard.render();
  }

  /* ═══ NOVA TRANSAÇÃO ═══ */
  function novaTransacao() {
    const cats = DB.getCategorias();
    open(`
      ${head('Registrar', 'transação', 'Entrada ou saída de dinheiro')}
      <div class="modal-body">
        <div class="field">
          <label class="field-label">Tipo *</label>
          <div class="type-radio">
            <input type="radio" name="ttipo" id="t-entrada" value="entrada" checked>
            <label for="t-entrada">${Icons.html('arrow-down-left', 16)} Entrada</label>
            <input type="radio" name="ttipo" id="t-saida" value="saida">
            <label for="t-saida">${Icons.html('arrow-up-right', 16)} Saída</label>
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label class="field-label">Valor (R$) *</label>
            <input type="number" id="t-valor" min="0.01" step="0.01" placeholder="0,00" data-autofocus>
          </div>
          <div class="field">
            <label class="field-label">Data</label>
            <input type="date" id="t-data" value="${todayISO()}">
          </div>
        </div>
        <div class="field">
          <label class="field-label">Descrição *</label>
          <input type="text" id="t-desc" placeholder="Ex: Salário, Mercado, Restaurante...">
        </div>
        <div class="field-row">
          <div class="field">
            <label class="field-label">Categoria</label>
            <select id="t-cat">
              <option value="">Sem categoria</option>
              ${cats.map(c => `<option value="${c.id}">${esc(c.nome)}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label class="field-label">Método</label>
            <select id="t-met">
              <option value="pix">Pix</option>
              <option value="dinheiro">Dinheiro</option>
              <option value="cartao_debito">Cartão Débito</option>
              <option value="cartao_credito">Cartão Crédito</option>
              <option value="ted">TED/DOC</option>
              <option value="outros">Outros</option>
            </select>
          </div>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" onclick="Modal.close()">Cancelar</button>
        <button class="btn btn-primary" onclick="Modal._saveTx()">${Icons.html('plus', 15)} Registrar</button>
      </div>
    `);
  }

  function _saveTx() {
    const tipo  = document.querySelector('input[name="ttipo"]:checked').value;
    const valor = parseFloat(document.getElementById('t-valor').value);
    const desc  = document.getElementById('t-desc').value.trim();
    if (!valor || valor <= 0) { Toast.error('Valor inválido'); return; }
    if (!desc) { Toast.error('Descrição obrigatória'); return; }
    DB.saveTransacao({
      tipo, valor, descricao: desc,
      data: document.getElementById('t-data').value,
      categoria: document.getElementById('t-cat').value || null,
      metodo: document.getElementById('t-met').value,
    });
    close();
    Toast.success('Transação registrada');
    if (Router.getCurrent() === 'transacoes') Transacoes.render();
    else Dashboard.render();
  }

  /* ═══ META ═══ */
  function novaMeta() { editarMeta(null); }

  function editarMeta(id) {
    const m = id ? DB.getMeta(id) : null;
    _icone = m?.icone || 'piggy-bank';
    _cor   = m?.cor || '#A78BFA';

    open(`
      ${head(id ? 'Editar' : 'Nova', id ? 'meta' : 'caixinha', 'Defina seu objetivo de poupança')}
      <div class="modal-body">
        <div style="display:flex;align-items:flex-start;gap:var(--s-4);margin-bottom:var(--s-5)">
          <div id="meta-prev-icon" style="width:64px;height:64px;border-radius:var(--r-md);background:${_cor}22;color:${_cor};display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1.5px solid ${_cor}55">
            ${Icons.html(_icone, 28)}
          </div>
          <div class="flex-1">
            <div class="field">
              <label class="field-label">Nome *</label>
              <input type="text" id="m-nome" value="${esc(m?.nome || '')}" placeholder="Viagem Europa, Carro Novo..." data-autofocus>
            </div>
          </div>
        </div>
        <div class="field">
          <label class="field-label">Cor</label>
          <div class="color-grid">
            ${COLORS.map(c => `<div class="color-swatch ${c === _cor ? 'selected' : ''}" style="background:${c}" data-cor="${c}" onclick="Modal._setMetaCor('${c}')"></div>`).join('')}
          </div>
        </div>
        <div class="field">
          <label class="field-label">Ícone</label>
          <div class="icon-grid">
            ${ICONS_META.map(ic => `
              <div class="icon-cell ${ic === _icone ? 'selected' : ''}" onclick="Modal._setMetaIcone('${ic}', this)">
                ${Icons.html(ic, 16)}
              </div>
            `).join('')}
          </div>
        </div>
        <div class="field">
          <label class="field-label">Descrição <span class="field-hint">(opcional)</span></label>
          <input type="text" id="m-desc" value="${esc(m?.descricao || '')}" placeholder="Para que é essa caixinha?">
        </div>
        <div class="field-row">
          <div class="field">
            <label class="field-label">Meta (R$) *</label>
            <input type="number" id="m-alvo" value="${m?.valorAlvo || ''}" min="0" step="0.01" placeholder="0,00">
          </div>
          <div class="field">
            <label class="field-label">Prazo <span class="field-hint">(opcional)</span></label>
            <input type="date" id="m-prazo" value="${m?.prazo || ''}">
          </div>
        </div>
        ${id ? `
          <div class="field">
            <label class="field-label">Status</label>
            <select id="m-status">
              <option value="ativa" ${m.status === 'ativa' ? 'selected' : ''}>Ativa</option>
              <option value="pausada" ${m.status === 'pausada' ? 'selected' : ''}>Pausada</option>
              <option value="concluida" ${m.status === 'concluida' ? 'selected' : ''}>Concluída</option>
              <option value="cancelada" ${m.status === 'cancelada' ? 'selected' : ''}>Cancelada</option>
            </select>
          </div>
        ` : ''}
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" onclick="Modal.close()">Cancelar</button>
        <button class="btn btn-primary" onclick="Modal._saveMeta('${esc(id || '')}')">${Icons.html(id ? 'save' : 'target', 15)} ${id ? 'Salvar' : 'Criar'}</button>
      </div>
    `, 'modal-lg');
  }

  function _setMetaCor(c) {
    _cor = c;
    document.querySelectorAll('.modal .color-swatch').forEach(s => {
      s.classList.toggle('selected', s.dataset.cor === c);
    });
    const prev = document.getElementById('meta-prev-icon');
    if (prev) {
      prev.style.background = _cor + '22';
      prev.style.color = _cor;
      prev.style.borderColor = _cor + '55';
    }
  }

  function _setMetaIcone(ic, el) {
    _icone = ic;
    document.querySelectorAll('.modal .icon-cell').forEach(c => c.classList.remove('selected'));
    if (el) el.classList.add('selected');
    const prev = document.getElementById('meta-prev-icon');
    if (prev) prev.innerHTML = Icons.html(ic, 28);
  }

  function _saveMeta(id) {
    const nome = document.getElementById('m-nome').value.trim();
    const alvo = parseFloat(document.getElementById('m-alvo').value);
    if (!nome) { Toast.error('Nome obrigatório'); return; }
    if (!alvo || alvo <= 0) { Toast.error('Valor alvo inválido'); return; }

    DB.saveMeta({
      id: id || undefined,
      nome,
      descricao: document.getElementById('m-desc').value || '',
      icone: _icone, cor: _cor,
      valorAlvo: alvo,
      prazo: document.getElementById('m-prazo').value || null,
      status: document.getElementById('m-status')?.value || 'ativa',
    });
    close();
    Toast.success(id ? 'Meta atualizada' : 'Caixinha criada');
    Metas.render();
  }

  function depositar(metaId) {
    const m = DB.getMeta(metaId);
    if (!m) return;
    open(`
      ${head('Guardar', 'dinheiro', m.nome)}
      <div class="modal-body">
        <div style="background:${m.cor}15;border:1px solid ${m.cor}33;border-radius:var(--r-md);padding:var(--s-4);text-align:center;margin-bottom:var(--s-4)">
          <div style="font-size:11px;color:var(--text-3);margin-bottom:4px">Guardado até agora</div>
          <div class="display" style="font-size:var(--t-2xl);font-style:italic;color:${m.cor}">${fmt(DB.getValorMeta(metaId))}</div>
        </div>
        <div class="field">
          <label class="field-label">Valor *</label>
          <input type="number" id="mov-v" min="0.01" step="0.01" placeholder="0,00" data-autofocus>
        </div>
        <div class="field">
          <label class="field-label">Descrição</label>
          <input type="text" id="mov-d" placeholder="Ex: Bônus, economia do mês...">
        </div>
        <div class="field">
          <label class="field-label">Data</label>
          <input type="date" id="mov-data" value="${todayISO()}">
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" onclick="Modal.close()">Cancelar</button>
        <button class="btn btn-primary" onclick="Modal._dep('${esc(metaId)}')">${Icons.html('piggy-bank', 15)} Guardar</button>
      </div>
    `);
  }

  function _dep(metaId) {
    const v = parseFloat(document.getElementById('mov-v').value);
    if (!v || v <= 0) { Toast.error('Valor inválido'); return; }
    DB.saveMovimento({
      metaId, tipo: 'deposito',
      valor: v,
      descricao: document.getElementById('mov-d').value,
      data: document.getElementById('mov-data').value,
    });
    const m = DB.getMeta(metaId);
    const total = DB.getValorMeta(metaId);
    close();
    if (total >= m.valorAlvo) {
      Toast.success('🎉 Meta atingida!', `Você completou "${m.nome}"`);
      Toast.confetti();
    } else {
      Toast.success('Depósito registrado', `+${fmt(v)} guardados`);
    }
    Metas.render();
  }

  function sacar(metaId) {
    const m = DB.getMeta(metaId);
    const atual = DB.getValorMeta(metaId);
    if (!m) return;
    open(`
      ${head('Retirar', 'dinheiro', m.nome)}
      <div class="modal-body">
        <div style="background:var(--red-bg);border:1px solid rgba(255,107,122,0.25);border-radius:var(--r-md);padding:var(--s-4);text-align:center;margin-bottom:var(--s-4)">
          <div style="font-size:11px;color:var(--text-3);margin-bottom:4px">Disponível</div>
          <div class="display" style="font-size:var(--t-2xl);font-style:italic;color:var(--red)">${fmt(atual)}</div>
        </div>
        <div class="field">
          <label class="field-label">Valor *</label>
          <input type="number" id="mov-v" min="0.01" max="${atual}" step="0.01" placeholder="0,00" data-autofocus>
        </div>
        <div class="field">
          <label class="field-label">Motivo *</label>
          <input type="text" id="mov-d" placeholder="Ex: Emergência, antecipação...">
        </div>
        <div class="field">
          <label class="field-label">Data</label>
          <input type="date" id="mov-data" value="${todayISO()}">
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" onclick="Modal.close()">Cancelar</button>
        <button class="btn btn-danger" onclick="Modal._saq('${esc(metaId)}')">${Icons.html('minus-circle', 15)} Retirar</button>
      </div>
    `);
  }

  function _saq(metaId) {
    const v = parseFloat(document.getElementById('mov-v').value);
    const atual = DB.getValorMeta(metaId);
    if (!v || v <= 0) { Toast.error('Valor inválido'); return; }
    if (v > atual) { Toast.error('Saldo insuficiente'); return; }
    DB.saveMovimento({
      metaId, tipo: 'saque', valor: v,
      descricao: document.getElementById('mov-d').value,
      data: document.getElementById('mov-data').value,
    });
    close();
    Toast.warning('Retirada registrada', `-${fmt(v)} retirados`);
    Metas.render();
  }

  function historicoMeta(metaId) {
    const m = DB.getMeta(metaId);
    const movs = DB.getMovimentos(metaId);
    if (!m) return;
    open(`
      ${head('Histórico', '', m.nome)}
      <div class="modal-body">
        <div style="height:180px;margin-bottom:var(--s-5)" id="meta-hist-chart"></div>
        ${movs.length ? `
          <div style="display:flex;flex-direction:column;gap:6px">
            ${movs.map(mov => `
              <div class="mov-item">
                <div class="mov-icon ${mov.tipo}">${Icons.html(mov.tipo === 'deposito' ? 'plus' : 'minus', 13)}</div>
                <div class="mov-info">
                  <div class="desc">${esc(mov.descricao || (mov.tipo === 'deposito' ? 'Depósito' : 'Saque'))}</div>
                  <div class="date">${Utils.formatDate(mov.data)}</div>
                </div>
                <div class="mov-amount ${mov.tipo}">${mov.tipo === 'deposito' ? '+' : '-'}${fmt(mov.valor)}</div>
              </div>
            `).join('')}
          </div>
        ` : `<div class="empty"><h4>Sem movimentações</h4></div>`}
      </div>
      <div class="modal-foot">
        <button class="btn btn-secondary" onclick="Modal.close()">Fechar</button>
      </div>
    `, 'modal-lg');

    const movsAsc = [...movs].reverse();
    let acc = 0;
    const data = movsAsc.map(mv => {
      acc += mv.tipo === 'deposito' ? mv.valor : -mv.valor;
      return { label: Utils.formatDateShort(mv.data), value: acc };
    });
    if (data.length) {
      setTimeout(() => Charts.line('meta-hist-chart', data, { color: m.cor }), 50);
    }
  }

  /* ═══ KANBAN CARD ═══ */
  function novoKanban(coluna = 'todo') { editarKanban(null, coluna); }

  function editarKanban(id, defaultCol = 'todo') {
    const c = id ? DB.getKanbanCard(id) : null;
    open(`
      ${head(id ? 'Editar' : 'Novo', id ? 'card' : 'card')}
      <div class="modal-body">
        <div class="field">
          <label class="field-label">Título *</label>
          <input type="text" id="k-tit" value="${esc(c?.titulo || '')}" placeholder="O que precisa ser feito?" data-autofocus>
        </div>
        <div class="field">
          <label class="field-label">Descrição <span class="field-hint">(opcional)</span></label>
          <textarea id="k-des" rows="3" placeholder="Detalhes...">${esc(c?.descricao || '')}</textarea>
        </div>
        <div class="field-row">
          <div class="field">
            <label class="field-label">Prioridade</label>
            <select id="k-prio">
              <option value="">Sem prioridade</option>
              <option value="baixa" ${c?.prioridade === 'baixa' ? 'selected' : ''}>Baixa</option>
              <option value="media" ${c?.prioridade === 'media' ? 'selected' : ''}>Média</option>
              <option value="alta"  ${c?.prioridade === 'alta'  ? 'selected' : ''}>Alta</option>
            </select>
          </div>
          <div class="field">
            <label class="field-label">Coluna</label>
            <select id="k-col">
              <option value="todo"  ${(c?.coluna || defaultCol) === 'todo'  ? 'selected' : ''}>A Fazer</option>
              <option value="doing" ${(c?.coluna || defaultCol) === 'doing' ? 'selected' : ''}>Em Andamento</option>
              <option value="done"  ${(c?.coluna || defaultCol) === 'done'  ? 'selected' : ''}>Concluído</option>
            </select>
          </div>
        </div>
        <div class="field tag-input-wrap">
          <label class="field-label">Etiquetas <span class="field-hint">(Enter para adicionar)</span></label>
          <input type="text" id="k-tag" placeholder="+ Adicionar etiqueta" onkeydown="Modal._tagAdd(event)">
          <div class="tag-list" id="k-tags">
            ${(c?.etiquetas || []).map(t => `<span class="tag-pill" onclick="this.remove()">${esc(t)}<span class="x">×</span></span>`).join('')}
          </div>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" onclick="Modal.close()">Cancelar</button>
        <button class="btn btn-primary" onclick="Modal._saveKb('${esc(id || '')}')">${Icons.html(id ? 'save' : 'plus', 15)} ${id ? 'Salvar' : 'Adicionar'}</button>
      </div>
    `);
  }

  function _tagAdd(e) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const inp = document.getElementById('k-tag');
    const v = inp.value.trim();
    if (!v) return;
    const list = document.getElementById('k-tags');
    const span = document.createElement('span');
    span.className = 'tag-pill';
    span.innerHTML = `${esc(v)}<span class="x">×</span>`;
    span.onclick = () => span.remove();
    list.appendChild(span);
    inp.value = '';
  }

  function _saveKb(id) {
    const tit = document.getElementById('k-tit').value.trim();
    if (!tit) { Toast.error('Título obrigatório'); return; }
    const tags = [...document.querySelectorAll('#k-tags .tag-pill')].map(el => el.textContent.replace(/×$/, '').trim());
    DB.saveKanbanCard({
      id: id || undefined,
      titulo: tit,
      descricao: document.getElementById('k-des').value || null,
      prioridade: document.getElementById('k-prio').value || null,
      coluna: document.getElementById('k-col').value,
      etiquetas: tags,
    });
    close();
    Toast.success(id ? 'Card atualizado' : 'Card adicionado');
    Kanban.render();
  }

  /* ═══ CATEGORIA ═══ */
  function novaCategoria() { editarCategoria(null); }

  function editarCategoria(id) {
    const c = id ? DB.getCategoria(id) : null;
    _icone = c?.icone || 'circle-dot';
    _cor   = c?.cor   || '#8085A8';

    open(`
      ${head(id ? 'Editar' : 'Nova', 'categoria')}
      <div class="modal-body">
        <div style="display:flex;align-items:flex-start;gap:var(--s-4);margin-bottom:var(--s-5)">
          <div id="cat-prev" style="width:56px;height:56px;border-radius:var(--r-md);background:${_cor}22;color:${_cor};display:flex;align-items:center;justify-content:center;flex-shrink:0">
            ${Icons.html(_icone, 24)}
          </div>
          <div class="flex-1">
            <div class="field">
              <label class="field-label">Nome *</label>
              <input type="text" id="cat-nome" value="${esc(c?.nome || '')}" placeholder="Nome da categoria" data-autofocus>
            </div>
          </div>
        </div>
        <div class="field">
          <label class="field-label">Cor</label>
          <div class="color-grid">
            ${COLORS.map(col => `<div class="color-swatch ${col === _cor ? 'selected' : ''}" style="background:${col}" data-cor="${col}" onclick="Modal._setCatCor('${col}')"></div>`).join('')}
          </div>
        </div>
        <div class="field">
          <label class="field-label">Ícone</label>
          <div class="icon-grid">
            ${ICONS_CAT.map(ic => `
              <div class="icon-cell ${ic === _icone ? 'selected' : ''}" onclick="Modal._setCatIc('${ic}', this)">
                ${Icons.html(ic, 16)}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" onclick="Modal.close()">Cancelar</button>
        <button class="btn btn-primary" onclick="Modal._saveCat('${esc(id || '')}')">${Icons.html('save', 15)} Salvar</button>
      </div>
    `);
  }

  function _setCatCor(c) {
    _cor = c;
    document.querySelectorAll('.modal .color-swatch').forEach(s => {
      s.classList.toggle('selected', s.dataset.cor === c);
    });
    const prev = document.getElementById('cat-prev');
    if (prev) { prev.style.background = c + '22'; prev.style.color = c; }
  }

  function _setCatIc(ic, el) {
    _icone = ic;
    document.querySelectorAll('.modal .icon-cell').forEach(s => s.classList.remove('selected'));
    if (el) el.classList.add('selected');
    const prev = document.getElementById('cat-prev');
    if (prev) prev.innerHTML = Icons.html(ic, 24);
  }

  function _saveCat(id) {
    const nome = document.getElementById('cat-nome').value.trim();
    if (!nome) { Toast.error('Nome obrigatório'); return; }
    DB.saveCategoria({
      id: id || undefined,
      nome, cor: _cor, icone: _icone,
    });
    close();
    Toast.success(id ? 'Categoria atualizada' : 'Categoria criada');
    Categorias.render();
  }

  /* ═══ CONFIRM ═══ */
  let confirmCb = null;

  function confirm(title, msg, onConfirm, btnLabel = 'Confirmar', btnClass = 'btn-danger') {
    confirmCb = onConfirm;
    open(`
      <div class="confirm">
        <div class="confirm-icon-wrap">${Icons.html('alert-triangle', 28)}</div>
        <h3>${esc(title)}</h3>
        <p>${esc(msg)}</p>
        <div class="confirm-actions">
          <button class="btn btn-ghost" onclick="Modal.close()">Cancelar</button>
          <button class="btn ${btnClass}" onclick="Modal._confirm()">${esc(btnLabel)}</button>
        </div>
      </div>
    `, 'modal-sm');
  }

  function _confirm() {
    const cb = confirmCb;
    confirmCb = null;
    close();
    if (cb) cb();
  }

  /* ═══ EXIT/ESC handlers ═══ */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });

  document.addEventListener('click', e => {
    if (e.target.id === 'modal-root') close();
  });

  return {
    open, close,
    pagarConta, _confirmPagar,
    novaConta, editarConta, _toggleRec, _togglePar, _saveConta,
    novaTransacao, _saveTx,
    novaMeta, editarMeta, _setMetaCor, _setMetaIcone, _saveMeta,
    depositar, _dep, sacar, _saq, historicoMeta,
    novoKanban, editarKanban, _tagAdd, _saveKb,
    novaCategoria, editarCategoria, _setCatCor, _setCatIc, _saveCat,
    confirm, _confirm,
  };
})();
