# EXAMPLES.md — Guia Prático do Mentor24h

**Versão:** 1.0  
**Data:** 2026-05-13  
**Gerado por:** skill-documentador (FORGE etapa 3.2)  
**Público-alvo:** Desenvolvedor que vai implementar as Fases 5–7

---

## ÍNDICE

1. [Como criar um novo módulo de página](#1-como-criar-um-novo-módulo-de-página)
2. [Como usar o DB — exemplos por coleção](#2-como-usar-o-db--exemplos-por-coleção)
3. [Como renderizar ícones corretamente](#3-como-renderizar-ícones-corretamente)
4. [Como adicionar comandos ao CommandPalette](#4-como-adicionar-comandos-ao-commandpalette)
5. [Como adicionar um novo provedor LLM](#5-como-adicionar-um-novo-provedor-llm)
6. [Como criar um Modal](#6-como-criar-um-modal)
7. [Como disparar Toasts](#7-como-disparar-toasts)
8. [Fluxo completo: Nova Venda](#8-fluxo-completo-nova-venda)
9. [Fluxo completo: Novo Produto](#9-fluxo-completo-novo-produto)
10. [Fluxo completo: Nova Venda via Chat WhatsApp](#10-fluxo-completo-nova-venda-via-chat-whatsapp)
11. [Como registrar uma nova página no Router](#11-como-registrar-uma-nova-página-no-router)
12. [Padrões de HTML para páginas](#12-padrões-de-html-para-páginas)
13. [Padrões de CSS para páginas novas](#13-padrões-de-css-para-páginas-novas)
14. [Checklist Sprint 1 (Fase 5)](#14-checklist-sprint-1-fase-5)
15. [Erros comuns e como evitá-los](#15-erros-comuns-e-como-evitá-los)

---

## 1. Como criar um novo módulo de página

Todo módulo segue exatamente este esqueleto. Copie, renomeie, implemente.

```javascript
/* ═══════════════════════════════════════════════════════════
   PRODUTOS — Catálogo de produtos/serviços
═══════════════════════════════════════════════════════════ */

const Produtos = (() => {

  /* ─── Estado local do módulo ─── */
  let filtroStatus = 'todos';

  /* ─── Ponto de entrada — chamado pelo Router ─── */
  function render() {
    const container = document.getElementById('produtos-content');
    if (!container) return;

    const lista = DB.getProdutos({ status: filtroStatus === 'todos' ? undefined : filtroStatus });

    container.innerHTML = `
      <div class="page-head">
        <div class="page-head-info">
          <span class="card-eyebrow">Catálogo</span>
          <h2 class="page-title">Produtos</h2>
        </div>
        <button class="btn btn-primary" id="prod-novo-btn">
          <span data-icon="plus" data-size="14"></span>
          Novo produto
        </button>
      </div>

      <div class="bento">
        ${lista.length
          ? lista.map(p => renderCard(p)).join('')
          : '<div class="empty-state">Nenhum produto cadastrado.</div>'
        }
      </div>
    `;

    Icons.render(container);  /* SEMPRE após inserir HTML com data-icon */
    bindEvents(container);
  }

  function renderCard(p) {
    return `
      <div class="bento-card span-4">
        <div class="card-head">
          <div>
            <span class="card-eyebrow">${esc(p.categoria || 'Sem categoria')}</span>
            <div class="card-title">${esc(p.nome)}</div>
          </div>
          <div class="card-pill ${p.status === 'disponivel' ? 'green' : 'red'}">
            <span data-icon="${p.status === 'disponivel' ? 'check' : 'x'}" data-size="16"></span>
          </div>
        </div>
        <div class="kpi">
          <span class="kpi-number mono">${fmt(p.preco)}</span>
          <div class="kpi-meta">
            <span>Custo: ${fmt(p.custo)}</span>
            <span class="delta ${p.preco > p.custo ? 'up' : 'down'}">
              Margem: ${Utils.pct(p.preco - p.custo, p.preco).toFixed(0)}%
            </span>
          </div>
        </div>
        <div style="margin-top:auto;display:flex;gap:var(--s-2);padding-top:var(--s-3)">
          <button class="btn btn-ghost btn-sm" data-edit-prod="${p.id}">
            <span data-icon="pencil" data-size="13"></span> Editar
          </button>
          <button class="btn btn-ghost btn-sm" data-del-prod="${p.id}">
            <span data-icon="trash-2" data-size="13"></span>
          </button>
        </div>
      </div>
    `;
  }

  function bindEvents(container) {
    container.querySelector('#prod-novo-btn')?.addEventListener('click', () => Modal.novoProduto());

    container.querySelectorAll('[data-edit-prod]').forEach(btn => {
      btn.addEventListener('click', () => Modal.novoProduto(btn.dataset.editProd));
    });

    container.querySelectorAll('[data-del-prod]').forEach(btn => {
      btn.addEventListener('click', () => {
        DB.deleteProduto(btn.dataset.delProd);
        Toast.success('Produto removido.');
        render();
      });
    });
  }

  return { render };
})();
```

**O que não esquecer:**
- `Icons.render(container)` depois de todo `innerHTML =`
- `return { render }` no final — o Router chama `Produtos.render()`
- Registrar no `App.initRouter()`: `Router.register('produtos', () => Produtos.render())`
- Criar a `<div class="page" data-page="produtos">` no `index.html`

---

## 2. Como usar o DB — exemplos por coleção

### Config

```javascript
// Ler
const cfg = DB.getConfig();
console.log(cfg.nomeUsuario); // "Léo"
console.log(cfg.moeda);       // "BRL"

// Atualizar (patch — só os campos passados mudam)
DB.saveConfig({ nomeUsuario: 'Leonardo' });
DB.saveConfig({ tema: 'light', moeda: 'USD' });
```

### Produtos

```javascript
// Criar produto
const prod = DB.saveProduto({
  nome: 'Consultoria 1h',
  preco: 250,
  custo: 0,
  categoria: 'servico',
  estoque: 99,
  status: 'disponivel',
});

// Listar disponíveis
const disponiveis = DB.getProdutos({ status: 'disponivel' });

// Buscar por nome
const filtrados = DB.getProdutos({ busca: 'consul' });

// Editar (passar o id já existente)
DB.saveProduto({ id: prod.id, preco: 300 });

// Deletar
DB.deleteProduto(prod.id);
```

### Vendas

```javascript
// Registrar venda
const venda = DB.saveVenda({
  clienteId: 'abc123',
  clienteNome: 'Maria Silva',
  itens: [
    { produtoId: prod.id, nome: 'Consultoria 1h', qtd: 2, preco: 300 },
  ],
  total: 600,
  formaPagamento: 'pix',
  status: 'paga',
});

// Listar vendas do mês
const { start, end } = Utils.getMonthRange();
const vendasMes = DB.getVendas({ dataInicio: start, dataFim: end });

// Listar vendas de um cliente
const vendasCliente = DB.getVendas({ clienteId: 'abc123' });
```

### Clientes de Negócio

```javascript
// Criar cliente
const cliente = DB.saveClienteNeg({
  nome: 'Maria Silva',
  telefone: '11999998888',
  email: 'maria@email.com',
});

// Buscar
const clientes = DB.getClientesNeg('maria');

// Atualizar saldo devedor
DB.saveClienteNeg({ id: cliente.id, saldoDevedor: 150 });
```

### Agenda

```javascript
// Criar evento
DB.saveEvento({
  titulo: 'Reunião de planejamento',
  data: '2026-05-20',
  hora: '14:00',
  tipo: 'trabalho',
  descricao: 'Review do trimestre',
});

// Eventos de hoje
const hoje = Utils.todayISO();
const eventosHoje = DB.getAgenda({ data: hoje });

// Todos os eventos
const todos = DB.getAgenda();
```

### Medicamentos

```javascript
// Cadastrar medicamento
const med = DB.saveMedicamento({
  nome: 'Omeprazol',
  dosagem: '20mg',
  horarios: ['07:00', '22:00'],
  frequencia: 'diario',
  estoque: 30,
  estoqueMinimo: 7,
});

// Registrar dose tomada hoje
DB.registrarDose(med.id);

// Verificar se dose já foi tomada hoje
const doses = DB.getDoses(med.id, Utils.todayISO());
const jaTomou = doses.length > 0;
```

### Tarefas

```javascript
// Criar tarefa
const tarefa = DB.saveTarefa({
  titulo: 'Ligar para fornecedor',
  prioridade: 'alta',
  data: '2026-05-14',
  hora: '10:00',
});

// Concluir tarefa
DB.saveTarefa({ id: tarefa.id, status: 'concluida' });

// Listar pendentes
const pendentes = DB.getTarefas({ status: 'pendente' });
const urgentes  = DB.getTarefas({ prioridade: 'alta' });
```

### LLM Config

```javascript
// Ler configuração atual
const llmCfg = DB.getLlmConfig();
// { provider: 'openrouter', apiKey: 'sk-or-...', model: '...', systemPrompt: '...' }

// Salvar nova chave
DB.saveLlmConfig({ apiKey: 'sk-or-nova-chave', provider: 'openrouter' });

// Trocar para OpenAI
DB.saveLlmConfig({ provider: 'openai', model: 'gpt-4o', apiKey: 'sk-...' });
```

### Export/Import completo

```javascript
// Exportar tudo para JSON (backup manual)
const backup = DB.exportAll();
const json = JSON.stringify(backup, null, 2);
// Salvar json em arquivo pelo usuário

// Restaurar backup
const data = JSON.parse(jsonString);
DB.clearAll();
DB.importAll(data);
location.reload();
```

---

## 3. Como renderizar ícones corretamente

Ícones usam o sistema Lucide via `[data-icon]`. Regras:

```javascript
// ✅ Correto — chamar Icons.render após inserir HTML
container.innerHTML = `<span data-icon="trash-2" data-size="16"></span>`;
Icons.render(container);

// ✅ Correto — renderizar ícone isolado como string HTML
const iconHtml = Icons.html('plus', 16);
btn.innerHTML = iconHtml + ' Novo item';

// ❌ Errado — esquecer Icons.render() — ícone fica como texto [data-icon]
container.innerHTML = `<span data-icon="check"></span> Salvo`;
// sem Icons.render() → não aparece o SVG
```

**Nomes de ícones disponíveis** (principais usados no projeto):
`plus`, `trash-2`, `pencil`, `save`, `check`, `x`, `search`, `settings-2`, `bot`,
`message-circle`, `package`, `shopping-cart`, `archive`, `users`, `receipt`,
`target`, `calendar`, `pill`, `check-square`, `layout-dashboard`, `arrow-right`,
`loader-2`, `send`, `key`, `external-link`, `moon`, `sun`, `bell`, `panel-left-close`

---

## 4. Como adicionar comandos ao CommandPalette

No arquivo `js/command-palette.js`, adicionar na array `COMMANDS`:

```javascript
const COMMANDS = [
  // ... existentes ...

  /* Novo grupo para módulos de negócio */
  { id: 'add-prod',  label: 'Novo produto',    group: 'Criar', icon: 'package',
    action: () => { Router.navigate('produtos'); setTimeout(() => Modal.novoProduto(), 100); } },

  { id: 'add-venda', label: 'Nova venda',       group: 'Criar', icon: 'shopping-cart',
    action: () => { Router.navigate('vendas'); setTimeout(() => Modal.novaVenda(), 100); } },

  { id: 'add-cli',   label: 'Novo cliente',     group: 'Criar', icon: 'user-plus',
    action: () => { Router.navigate('clientes'); setTimeout(() => Modal.novoCliente(), 100); } },

  /* Atalhos contextuais */
  { id: 'stats-mes', label: 'Ver relatório mensal', group: 'Relatórios', icon: 'bar-chart-2',
    action: () => Router.navigate('transacoes') },
];
```

**Padrão para ações com modal:** `navigate` primeiro, depois `setTimeout` de 100ms para aguardar o render antes de abrir o modal.

---

## 5. Como adicionar um novo provedor LLM

No arquivo `js/llm.js`, adicionar na `const PROVIDERS`:

```javascript
const PROVIDERS = {
  // ... existentes ...

  mistral: {
    name: 'Mistral AI',
    url: 'https://api.mistral.ai/v1',
    models: [
      { id: 'mistral-large-latest', label: 'Mistral Large' },
      { id: 'mistral-medium-latest', label: 'Mistral Medium' },
      { id: 'open-mistral-7b',       label: 'Mistral 7B (barato)' },
    ],
    hint: 'Requer chave do Mistral (console.mistral.ai).',
  },
};
```

Depois adicionar a função de chamada:

```javascript
async function callMistral(msgs, cfg) {
  const systemPrompt = cfg.systemPrompt || '';
  const messages = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...msgs]
    : msgs;

  const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cfg.apiKey}`,
    },
    body: JSON.stringify({ model: cfg.model, messages }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '(sem resposta)';
}
```

E registrar no `callProvider`:

```javascript
async function callProvider(msgs, cfg) {
  switch (cfg.provider) {
    case 'openrouter': return callOpenRouter(msgs, cfg);
    case 'openai':     return callOpenAI(msgs, cfg);
    case 'gemini':     return callGemini(msgs, cfg);
    case 'claude':     return callClaude(msgs, cfg);
    case 'mistral':    return callMistral(msgs, cfg);  // ← novo
    default: throw new Error('Provedor desconhecido: ' + cfg.provider);
  }
}
```

---

## 6. Como criar um Modal

No arquivo `js/modal.js`, adicionar uma nova função pública:

```javascript
function novoProduto(id) {
  const prod = id ? DB.getProdutos().find(p => p.id === id) : null;
  const categorias = ['produto', 'servico', 'digital', 'assinatura'];

  show(`
    <div class="modal-head">
      <h3 class="modal-title">${prod ? 'Editar produto' : 'Novo produto'}</h3>
      <button class="modal-close" id="modal-close-btn">
        <span data-icon="x" data-size="16"></span>
      </button>
    </div>
    <div class="modal-body">
      <div class="field">
        <label class="field-label">Nome *</label>
        <input type="text" id="m-prod-nome" value="${esc(prod?.nome || '')}" placeholder="Nome do produto ou serviço">
      </div>
      <div class="field-row">
        <div class="field">
          <label class="field-label">Preço de venda (R$) *</label>
          <input type="number" id="m-prod-preco" value="${prod?.preco || ''}" min="0" step="0.01">
        </div>
        <div class="field">
          <label class="field-label">Custo (R$)</label>
          <input type="number" id="m-prod-custo" value="${prod?.custo || 0}" min="0" step="0.01">
        </div>
      </div>
      <div class="field">
        <label class="field-label">Categoria</label>
        <select id="m-prod-cat">
          ${categorias.map(c => `<option value="${c}" ${prod?.categoria === c ? 'selected' : ''}>${Utils.capitalize(c)}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="modal-foot">
      <button class="btn btn-ghost" id="modal-cancel-btn">Cancelar</button>
      <button class="btn btn-primary" id="modal-save-btn">
        <span data-icon="save" data-size="14"></span>
        ${prod ? 'Salvar' : 'Criar produto'}
      </button>
    </div>
  `);

  /* Bind dos eventos do modal */
  document.getElementById('modal-close-btn')?.addEventListener('click', hide);
  document.getElementById('modal-cancel-btn')?.addEventListener('click', hide);
  document.getElementById('modal-save-btn')?.addEventListener('click', () => {
    const nome = document.getElementById('m-prod-nome')?.value.trim();
    if (!nome) { Toast.error('Nome obrigatório'); return; }

    DB.saveProduto({
      id: prod?.id,
      nome,
      preco: parseFloat(document.getElementById('m-prod-preco')?.value) || 0,
      custo: parseFloat(document.getElementById('m-prod-custo')?.value) || 0,
      categoria: document.getElementById('m-prod-cat')?.value,
    });

    Toast.success(prod ? 'Produto atualizado!' : 'Produto criado!');
    hide();
    if (Router.getCurrent() === 'produtos') Produtos.render();
  });
}
```

E exportar no `return` do Modal:
```javascript
return {
  novaConta, novaTransacao, novaMeta, novoKanban, novaCategoria, pagarConta,
  novoProduto,  // ← novo
};
```

### Funções internas `show` e `hide`

```javascript
function show(html) {
  const overlay = document.getElementById('modal-overlay');
  if (!overlay) return;
  overlay.innerHTML = html;
  overlay.classList.add('open');
  Icons.render(overlay);  /* renderizar ícones no modal */
}

function hide() {
  document.getElementById('modal-overlay')?.classList.remove('open');
}
```

---

## 7. Como disparar Toasts

```javascript
// Sucesso (verde)
Toast.success('Venda registrada!', 'R$ 600,00 via PIX');

// Erro (vermelho)
Toast.error('Falha ao salvar', 'Verifique os campos obrigatórios');

// Aviso (âmbar)
Toast.warning('Estoque baixo', 'Produto com apenas 2 unidades');

// Info (azul)
Toast.info('Backup exportado', 'Arquivo salvo na pasta Downloads');

// Sem subtítulo — segundo parâmetro é opcional
Toast.success('Salvo!');
```

**Regra:** Toast de sucesso após toda ação de criar/editar/deletar. Toast de erro quando validação falha ou operação DB retorna null.

---

## 8. Fluxo completo: Nova Venda

Este é o fluxo que precisa ser implementado na Fase 5 para o módulo `vendas.js`.

```
[User está na página Vendas]
  ↓ clica "Nova venda"
  ↓ Modal.novaVenda() abre
    - Buscar cliente (autocomplete de DB.getClientesNeg)
    - Adicionar itens (busca de DB.getProdutos)
      - Por item: nome, qtd, preço (editável)
      - Total calculado ao vivo
    - Forma de pagamento
    - Status (paga / pendente)
  ↓ User clica "Registrar venda"
    - Validar: ao menos 1 item, total > 0
    - DB.saveVenda({ clienteId, clienteNome, itens, total, formaPagamento, status })
    - Se status === 'paga': atualizar estoque dos produtos
      itens.forEach(item => {
        const prod = DB.getProdutos().find(p => p.id === item.produtoId);
        if (prod) DB.saveProduto({ id: prod.id, estoque: prod.estoque - item.qtd });
      });
    - Se cliente existe em clientesNeg e status === 'pendente':
      DB.saveClienteNeg({ id: clienteId, saldoDevedor: saldoAtual + total })
    - Toast.success('Venda registrada!', fmt(total) + ' · ' + formaPagamento)
    - Modal.hide()
    - Vendas.render()
```

**Código simplificado da função de salvar venda:**

```javascript
function salvarVenda(form) {
  const { clienteId, clienteNome, itens, formaPagamento, status } = form;
  const total = itens.reduce((s, i) => s + i.preco * i.qtd, 0);

  if (!itens.length || total <= 0) {
    Toast.error('Adicione pelo menos um item');
    return;
  }

  const venda = DB.saveVenda({ clienteId, clienteNome, itens, total, formaPagamento, status });

  /* Baixar estoque */
  if (status === 'paga') {
    itens.forEach(item => {
      if (!item.produtoId) return;
      const prod = DB.getProdutos().find(p => p.id === item.produtoId);
      if (prod && prod.estoque > 0) {
        DB.saveProduto({ id: prod.id, estoque: Math.max(0, prod.estoque - item.qtd) });
      }
    });
  }

  /* Atualizar saldo devedor do cliente */
  if (clienteId && status === 'pendente') {
    const cli = DB.getClientesNeg().find(c => c.id === clienteId);
    if (cli) DB.saveClienteNeg({ id: clienteId, saldoDevedor: (cli.saldoDevedor || 0) + total });
  }

  Toast.success('Venda registrada!', `${fmt(total)} · ${formaPagamento}`);
  Modal.hide();
  Vendas.render();
}
```

---

## 9. Fluxo completo: Novo Produto

```
[Modal novoProduto()]
  ↓ User preenche nome, preço, custo, categoria, estoque
  ↓ Validação: nome obrigatório, preço ≥ 0
  ↓ DB.saveProduto(dados)
  ↓ Verificar estoque mínimo:
    if (dados.estoque <= dados.estoqueMinimo) {
      Toast.warning('Estoque baixo', `${dados.nome}: apenas ${dados.estoque} unidades`);
    } else {
      Toast.success('Produto criado!');
    }
  ↓ Modal.hide()
  ↓ Produtos.render()
```

---

## 10. Fluxo completo: Nova Venda via Chat WhatsApp

O módulo `chat-wa.js` tem o botão "+ Venda" no CRM lateral. Quando clicado com um contato selecionado:

```javascript
/* No CRM lateral do chat-wa.js */
container.querySelector('#wa-crm-nova-venda')?.addEventListener('click', () => {
  const contatoId = getContatoAtivo();
  const chatContato = DB.getChatContatos().find(c => c.id === contatoId);

  /* Tentar vincular ao cliente de negócio pelo nome ou telefone */
  const clienteNeg = DB.getClientesNeg().find(c =>
    c.nome === chatContato.nome || c.telefone === chatContato.tel
  );

  /* Abrir modal de nova venda já preenchendo o cliente */
  Modal.novaVenda({
    clienteId:   clienteNeg?.id || null,
    clienteNome: chatContato.nome,
  });
});
```

---

## 11. Como registrar uma nova página no Router

**Passo 1 — Adicionar na `const PAGES` do `router.js`:**

```javascript
const PAGES = {
  // ... existentes ...
  'relatorios': { title: 'Seus', em: 'relatórios', icon: 'bar-chart-2' },
};
```

**Passo 2 — Registrar o renderer em `App.initRouter()` no `app.js`:**

```javascript
function initRouter() {
  // ... existentes ...
  Router.register('relatorios', () => Relatorios.render());
  Router.init();
}
```

**Passo 3 — Adicionar `<div class="page">` no `index.html`:**

```html
<!-- dentro de <main id="main-content"> -->
<div class="page" data-page="relatorios">
  <div id="relatorios-content"></div>
</div>
```

**Passo 4 — Adicionar na sidebar do `index.html`:**

```html
<!-- dentro do nav-group adequado ou como item direto -->
<div class="nav-item nav-sub" data-nav="relatorios">
  <span data-icon="bar-chart-2" data-size="16"></span>
  <span class="nav-label">Relatórios</span>
</div>
```

**Passo 5 — Adicionar no mapa de grupos da sidebar se necessário:**

Em `app.js`, na função `initNavGroups()`:
```javascript
const groupMap = {
  // ... existentes ...
  'relatorios': 'group-financas',  // abre o grupo Finanças quando nessa página
};
```

E no `BNAV_GROUP`:
```javascript
const BNAV_GROUP = {
  // ... existentes ...
  'relatorios': 'contas',  // bottom nav tab "Finanças" fica ativa
};
```

**Passo 6 — Criar o arquivo `js/relatorios.js`** seguindo o esqueleto da seção 1.

**Passo 7 — Incluir o script no `index.html` na ordem correta** (antes de `app.js`).

---

## 12. Padrões de HTML para páginas

### Estrutura padrão de uma página com lista

```html
<div class="page" data-page="vendas">
  <div id="vendas-content">
    <!-- Preenchido via JS por Vendas.render() -->
  </div>
</div>
```

### Page head (título + botão de ação)

```html
<div class="page-head">
  <div class="page-head-info">
    <span class="card-eyebrow">Negócio</span>
    <h2 class="page-title">Minhas <em>vendas</em></h2>
  </div>
  <div class="page-actions">
    <button class="btn btn-primary" id="venda-nova-btn">
      <span data-icon="plus" data-size="14"></span>
      Nova venda
    </button>
  </div>
</div>
```

### Tabela de dados

```html
<div class="table-wrap">
  <table class="data-table">
    <thead>
      <tr>
        <th>Data</th>
        <th>Cliente</th>
        <th>Total</th>
        <th>Status</th>
        <th></th>
      </tr>
    </thead>
    <tbody id="vendas-tbody">
      <!-- linhas via JS -->
    </tbody>
  </table>
</div>
```

### Empty state

```html
<div class="empty-state">
  <span data-icon="shopping-cart" data-size="40"></span>
  <h3>Nenhuma venda ainda</h3>
  <p>Registre sua primeira venda para começar a acompanhar o seu negócio.</p>
  <button class="btn btn-primary" id="venda-nova-btn-empty">
    <span data-icon="plus" data-size="14"></span>
    Registrar venda
  </button>
</div>
```

---

## 13. Padrões de CSS para páginas novas

Adicionar no final de `css/pages.css`:

```css
/* ═══════════════════════════════════════════════════════════
   VENDAS
═══════════════════════════════════════════════════════════ */

.vendas-filters {
  display: flex;
  gap: var(--s-3);
  margin-bottom: var(--s-4);
  flex-wrap: wrap;
}

.vendas-kpi-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--s-4);
  margin-bottom: var(--s-4);
}

.venda-row-status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--t-xs);
  font-weight: 500;
  padding: 2px 8px;
  border-radius: var(--r-full);
}

.venda-row-status.paga    { background: var(--green-bg); color: var(--green); }
.venda-row-status.pendente { background: var(--amber-glow); color: var(--amber); }

@media (max-width: 640px) {
  .vendas-kpi-row { grid-template-columns: 1fr; }
}
```

**Variáveis disponíveis para status visual:**

| Cor | Background | Foreground |
|-----|-----------|-----------|
| Verde | `var(--green-bg)` | `var(--green)` |
| Vermelho | `var(--red-bg)` | `var(--red)` |
| Âmbar | `var(--amber-glow)` | `var(--amber)` |
| Azul | `var(--blue-bg)` | `var(--blue)` |
| Laranja | `var(--orange-bg)` | `var(--orange)` |
| Gold | `var(--color-gold-subtle)` | `var(--color-gold)` |
| Muted | `var(--surface-3)` | `var(--text-3)` |

---

## 14. Checklist Sprint 1 (Fase 5)

### Objetivo: Infra base — DB + Router completo + App funcionando

- [ ] `js/db.js` — verificar se há alguma função CRUD faltante para os módulos de negócio
- [ ] `js/router.js` — confirmar que todas as 17 páginas estão em `PAGES`
- [ ] `js/app.js` — confirmar que `initRouter()` registra todos os módulos (incluindo Produtos, Vendas, Estoque, Clientes que hoje têm `() => {}`)
- [ ] `index.html` — confirmar que há `<div class="page" data-page="X">` para todas as 17 páginas
- [ ] Testar navegação para todas as páginas sem erro no console
- [ ] Testar `DB.exportAll()` e `DB.importAll()` — verificar que novos schemas são incluídos
- [ ] Testar `DB.clearAll()` + reload — app deve inicializar sem erro
- [ ] Testar theme toggle dark ↔ light em todas as páginas

### Entregável Sprint 1: Esqueleto funcional

Cada página deve ter ao menos:
- `<div class="page-head">` com título e botão "+ Novo"
- Estado vazio renderizado (empty state)
- Modal de criação básica funcional
- Toast de sucesso/erro ao criar

---

## 15. Erros comuns e como evitá-los

### ❌ Esquecer `Icons.render()` após `innerHTML`

```javascript
// ❌ Errado
container.innerHTML = `<button><span data-icon="plus"></span> Novo</button>`;
// ícone não aparece

// ✅ Correto
container.innerHTML = `<button><span data-icon="plus"></span> Novo</button>`;
Icons.render(container);
```

### ❌ Criar ID no `saveProduto` e depois passar no patch

```javascript
// ❌ Errado — cria produto novo em vez de editar
const id = 'abc123';
DB.saveProduto({ nome: 'Novo nome' }); // sem id → INSERT

// ✅ Correto — para editar, sempre passar o id
DB.saveProduto({ id: 'abc123', nome: 'Novo nome' }); // com id → UPDATE
```

### ❌ Bind de eventos em elementos que não existem ainda

```javascript
// ❌ Errado — elemento ainda não está no DOM
document.getElementById('btn-salvar')?.addEventListener(...);
// se render() não foi chamado, btn-salvar não existe

// ✅ Correto — bind APÓS o innerHTML
container.innerHTML = `...<button id="btn-salvar">...</button>`;
Icons.render(container);
container.querySelector('#btn-salvar')?.addEventListener('click', salvar);
```

### ❌ Usar `fmt()` em string sem converter para número

```javascript
// ❌ Errado — pode passar string do input
const preco = form.value; // "250.00" — string
fmt(preco); // pode funcionar mas é frágil

// ✅ Correto
const preco = parseFloat(form.value) || 0;
fmt(preco);
```

### ❌ Comparar datas como Date objects

```javascript
// ❌ Errado — timezone bug
const hoje = new Date();
const venc = new Date(conta.dataVencimento);
if (venc < hoje) { ... } // pode dar 1 dia de diferença

// ✅ Correto — comparar strings ISO
if (conta.dataVencimento < Utils.todayISO()) { ... }
```

### ❌ Abrir modal sem aguardar render da página

```javascript
// ❌ Errado — modal tenta bind em elementos da página que não existiu ainda
Router.navigate('vendas');
Modal.novaVenda(); // DOM da página ainda não existe

// ✅ Correto — dar tempo ao render da página
Router.navigate('vendas');
setTimeout(() => Modal.novaVenda(), 100);
```

### ❌ Manipular DOM fora do container da página ativa

```javascript
// ❌ Errado — pode pegar elemento de outra página
document.querySelector('.btn-novo')?.click();

// ✅ Correto — sempre escopar ao container da página
const container = document.getElementById('vendas-content');
container.querySelector('.btn-novo')?.click();
```

### ❌ Usar `var(--glass-3)` ou outros tokens inexistentes

Tokens definidos: `--glass-1`, `--glass-2` (sem `--glass-3`). Antes de usar um token, verificar em `css/tokens.css` e `css/themes.css` que ele existe. Tokens inexistentes renderizam como `transparent` ou cor inicial sem aviso.

### ❌ Esquecer de atualizar `FORGE-CHECKLIST.md`

Após cada etapa entregue: marcar ✅ com data, adicionar linha no Histórico, atualizar Próxima Ação e Status geral.
