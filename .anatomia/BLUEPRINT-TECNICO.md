# 🔧 BLUEPRINT TÉCNICO — Mentor24h v5.2

> Diagrama de arquitetura, fluxos de dados, referência de módulos e decisões técnicas

---

## 📐 DIAGRAMA DE ARQUITETURA

```
┌─────────────────────────────────────────────────────────────┐
│                      MENTOR24H SPA                          │
│              (Single Page Application - ES6)               │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴──────────┐
                    │                    │
              ┌────────────┐        ┌──────────┐
              │ index.html │        │ CSS (6)  │
              └────────────┘        └──────────┘
                    │
        ┌───────────┴────────────┐
        │   app.js (init)        │
        │   ↓                    │
        │   Router.navigate()    │
        └───────────┬────────────┘
                    │
        ┌───────────┴───────────────────────────────┐
        │          Módulos Funcionais               │
        │  (JS IIFE Pattern)                        │
        │                                           │
        │  💰 Finanças:                            │
        │  ├─ Contas   ┐                          │
        │  ├─ Transações├─ render/salvar/editar  │
        │  ├─ Metas    ┘                          │
        │  ├─ Categorias                          │
        │  └─ Charts                              │
        │                                           │
        │  💼 Negócio:                             │
        │  ├─ Produtos    ┐                       │
        │  ├─ Vendas      ├─ CRUD completo       │
        │  ├─ Estoque     ┤                       │
        │  └─ Clientes    ┘                       │
        │                                           │
        │  👤 Pessoal:                             │
        │  ├─ Agenda        ┐                     │
        │  ├─ Medicamentos  ├─ Forms + UI        │
        │  ├─ Tarefas       ┤                     │
        │  ├─ Kanban        ┤                     │
        │  └─ Contatos v2   ┘  (Contexto duplo)  │
        │                                           │
        │  🤖 IA:                                  │
        │  ├─ llm.js        (Chat)                │
        │  └─ llm-tools.js  (11 ferramentas)     │
        │                                           │
        │  💬 Chat:                               │
        │  └─ chat-wa.js    (WhatsApp CRM)       │
        │                                           │
        │  ⚙️  Outras:                             │
        │  ├─ config.js     (Preferências)        │
        │  ├─ utils.js      (Helpers)             │
        │  ├─ modal.js      (Formulários)         │
        │  ├─ toast.js      (Notificações)        │
        │  └─ icons.js      (SVG)                 │
        └──────────────────────────────────────────┘
                         │
                    ┌────▼─────┐
                    │  DB.js   │
                    │ LocalStor.│
                    └────┬─────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    ┌──────────┐    ┌─────────┐    ┌──────────┐
    │ 16 Keys  │    │ Read()  │    │ Write()  │
    │          │    │ Migrate │    │ Return   │
    │ finflow. │    │ v1→v4   │    │ boolean  │
    │ mentor   │    │ Auto    │    │          │
    │ 24h.     │    └─────────┘    └──────────┘
    └──────────┘
```

---

## 🔌 PADRÃO MODULAR (IIFE + Public API)

### Template Padrão

Cada módulo segue este padrão:

```javascript
const ModuleNome = (() => {
  
  // ═══ PRIVATE STATE ═══
  let state = {
    items: [],
    filters: { status: 'todas' },
    selected: null
  };
  
  let elements = {
    container: null,
    form: null,
    list: null
  };
  
  // ═══ HELPER FUNCTIONS (private) ═══
  function _init() {
    // Inicialização única
    elements.container = document.getElementById('module-container');
    if (elements.container) {
      elements.container.addEventListener('click', _handleClick);
    }
    state.items = DB.getModuleItems();
    render();
  }
  
  function _handleClick(e) {
    if (e.target.dataset.action === 'new') abrir();
    if (e.target.dataset.action === 'editar') editar(e.target.dataset.id);
    if (e.target.dataset.action === 'deletar') deletar(e.target.dataset.id);
  }
  
  function _renderItem(item) {
    return `
      <div class="item" data-id="${item.id}">
        <span>${item.nome}</span>
        <button data-action="editar" data-id="${item.id}">✎</button>
        <button data-action="deletar" data-id="${item.id}">🗑</button>
      </div>
    `;
  }
  
  // ═══ PUBLIC METHODS ═══
  function render() {
    if (!elements.container) return;
    elements.container.innerHTML = state.items.map(_renderItem).join('');
  }
  
  function salvar(data) {
    if (!data.id) data.id = Utils.uid();
    DB.saveModuleItem(data);
    state.items = DB.getModuleItems(); // Refresh
    render();
    Toast.success('Salvo com sucesso');
  }
  
  function abrir() {
    Modal.open('Novo Item', [
      { label: 'Nome', type: 'text', name: 'nome', required: true },
      { label: 'Descrição', type: 'textarea', name: 'descricao' }
    ], (data) => {
      salvar(data);
      Modal.close();
    });
  }
  
  function editar(id) {
    const item = state.items.find(i => i.id === id);
    if (!item) return;
    Modal.open(`Editar: ${item.nome}`, [
      { label: 'Nome', type: 'text', name: 'nome', value: item.nome }
    ], (data) => {
      salvar(Object.assign(item, data));
      Modal.close();
    });
  }
  
  function deletar(id) {
    Modal.confirm(
      'Deletar?',
      'Esta ação não pode ser desfeita.',
      () => {
        DB.deleteModuleItem(id);
        state.items = state.items.filter(i => i.id !== id);
        render();
        Toast.success('Deletado');
      }
    );
  }
  
  function filtrar(newFilters) {
    state.filters = Object.assign(state.filters, newFilters);
    state.items = DB.getModuleItems(state.filters);
    render();
  }
  
  // ═══ INIT & RETURN ═══
  _init();
  
  return {
    render,      // renderização
    salvar,      // persistência
    abrir,       // novo form
    editar,      // editar form
    deletar,     // deletar com confirmação
    filtrar      // aplicar filtros
  };
})();
```

### Inicialização em app.js

```javascript
// Quando módulo é ativado:
app.js → Router.navigate('modulo-nome')
       → ModuleNome.render()
```

---

## 🔄 FLUXOS DE DADOS PRINCIPAIS

### Fluxo 1: Criar um Item (C do CRUD)

```
┌─ User UI
│  └─ Clica "Novo" (data-action="new")
│
├─ Module.js
│  └─ abrir() → Modal.open(fields, callback)
│
├─ Modal.js
│  └─ form.addEventListener('submit', () => callback(formData))
│
├─ Module.js (callback)
│  └─ salvar(data)
│     └─ data.id = Utils.uid()
│
├─ DB.js
│  └─ saveModuleItem(data)
│     └─ localStorage.setItem(KEY, JSON.stringify(array))
│
├─ Module.js
│  └─ state.items = DB.getModuleItems() [refresh]
│
├─ Module.js
│  └─ render() [reDraw]
│
└─ User UI
   └─ "Item criado com sucesso" (Toast)
```

### Fluxo 2: Editar um Item (U do CRUD)

```
┌─ User UI
│  └─ Clica botão "✎" (data-action="editar" data-id="X")
│
├─ Module.js
│  └─ editar(id)
│     └─ item = state.items.find(i => i.id === id)
│
├─ Modal.js
│  └─ Modal.open(fields_preenchidos, callback)
│     └─ inputs têm .value = item.valor
│
├─ User (edita campos)
│  └─ Clica "Salvar"
│
├─ Modal.js
│  └─ callback(newData)
│
├─ Module.js
│  └─ salvar(Object.assign(item, newData))
│
├─ DB.js
│  └─ saveModuleItem(data)
│     └─ arr[idx] = Object.assign({}, arr[idx], data, {atualizadoEm})
│
├─ localStorage
│  └─ setItem(KEY, JSON.stringify(arr))
│
└─ Module.js
   └─ render() [reDraw]
      └─ Toast.success("Atualizado")
```

### Fluxo 3: Deletar um Item (D do CRUD)

```
┌─ User UI
│  └─ Clica "🗑" (data-action="deletar" data-id="X")
│
├─ Module.js
│  └─ deletar(id)
│
├─ Modal.confirm()
│  └─ User confirma = true
│
├─ Module.js
│  └─ DB.deleteModuleItem(id)
│
├─ DB.js
│  └─ arr.filter(i => i.id !== id)
│     └─ localStorage.setItem(KEY, filtered)
│
├─ Module.js
│  └─ state.items = state.items.filter(i => i.id !== id)
│
├─ Module.js
│  └─ render() [reDraw]
│
└─ User UI
   └─ Toast.success("Deletado")
```

### Fluxo 4: Chat com IA (Function Calling)

```
┌─ User UI (Chat)
│  └─ Digita: "Quanto devo este mês?"
│     Clica "Enviar"
│
├─ llm.js
│  └─ buildSystemPrompt()
│     └─ injeta: "USE FUNCTION CALLING para respostas dinâmicas"
│
├─ llm.js
│  └─ callProvider(provider, message, systemPrompt)
│     └─ POST https://api.openai.com/v1/chat/completions
│        ├─ model: "gpt-4"
│        ├─ messages: [{role: 'system', content: '...'}, {role: 'user', content: 'Quanto devo?'}]
│        └─ tools: [{type: 'function', function: {name: 'getResumoFinanceiroMes', ...}}]
│
├─ OpenAI (server)
│  └─ Processa → responde com tool_calls
│     └─ [{type: 'tool_call', function: {name: 'getResumoFinanceiroMes'}}]
│
├─ llm.js (loop 1-6 iterações)
│  └─ response.tool_calls.forEach(tc => {
│       const tool = llm-tools[tc.function.name];
│       const result = tool();  // Execute
│       messages.push({role: 'assistant', content: response.content});
│       messages.push({role: 'tool', content: JSON.stringify(result)});
│     })
│
├─ llm.js
│  └─ callProvider(provider, messages, systemPrompt) [2ª chamada]
│     └─ POST com histórico + resultados da ferramenta
│
├─ OpenAI (server)
│  └─ Processa context + tool results
│     └─ Responde em português naturalmente
│
├─ llm.js
│  └─ buildUserContext().RESPOSTAS_DIRETAS
│     └─ Texto formatado com valores pré-calculados
│
├─ llm.js
│  └─ renderMessage(role='assistant', content='...', type='text|tool_result')
│
└─ User UI (Chat)
   └─ "Você deve R$ 6.817 este mês. Detalhes: ..."
      (bubble renderizada)
```

---

## 📱 NAVEGAÇÃO & ROTEAMENTO

### Router.js (SPA)

```javascript
const Router = (() => {
  const routes = {
    'dashboard': { module: null, title: 'Dashboard' },
    'contas': { module: 'Contas', title: 'Contas' },
    'transacoes': { module: 'Transacoes', title: 'Transações' },
    'metas': { module: 'Metas', title: 'Metas' },
    'categorias': { module: 'Categorias', title: 'Categorias' },
    
    'produtos': { module: 'Produtos', title: 'Produtos' },
    'vendas': { module: 'Vendas', title: 'Vendas' },
    'estoque': { module: 'Estoque', title: 'Estoque' },
    'clientes': { module: 'Clientes', title: 'Clientes' },
    
    'agenda': { module: 'Agenda', title: 'Agenda' },
    'medicamentos': { module: 'Medicamentos', title: 'Medicamentos' },
    'tarefas': { module: 'Tarefas', title: 'Tarefas' },
    'contatos': { module: 'Contatos', title: 'Contatos' },
    
    'chat-ai': { module: 'ChatAI', title: 'Chat IA' },
    'chat-wa': { module: 'ChatWA', title: 'WhatsApp' },
    
    'config': { module: 'Config', title: 'Configurações' }
  };
  
  function navigate(routeName) {
    const route = routes[routeName];
    if (!route) return;
    
    // 1. Hide all sections
    document.querySelectorAll('#main > section').forEach(s => s.hidden = true);
    
    // 2. Show target section
    const section = document.getElementById(`section-${routeName}`);
    if (section) section.hidden = false;
    
    // 3. Update topbar
    document.getElementById('topbar-crumb').textContent = routeName;
    document.getElementById('topbar-title-text').textContent = route.title;
    
    // 4. Call module.render()
    if (route.module && window[route.module]) {
      window[route.module].render();
    }
    
    // 5. Update active nav item
    document.querySelectorAll('[data-nav]').forEach(item => {
      item.classList.toggle('active', item.dataset.nav === routeName);
    });
  }
  
  return { navigate };
})();
```

### Navegação no UI

```
Sidebar (Desktop)
  nav-item[data-nav="dashboard"]
    → addEventListener('click', () => Router.navigate('dashboard'))
  
  nav-item[data-nav="contas"]
    → addEventListener('click', () => Router.navigate('contas'))
    → Contas.render()

Bottom Nav (Mobile)
  5 ícones principais
  → Mesmo Router.navigate()
```

---

## 💾 PERSISTÊNCIA & MIGRATIONS

### DB.js (LocalStorage Abstraction)

```javascript
const DB = (() => {
  const KEY = {
    config: 'finflow.config',
    contas: 'finflow.contas',
    // ... 16 total
  };
  
  function read(k, def = []) {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : def;
    } catch (e) {
      console.error('Parse error:', e);
      return def;
    }
  }
  
  function write(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
      return true;
    } catch (e) {
      console.error('Storage quota exceeded:', e);
      return false;
    }
  }
  
  // ═══ AUTO-MIGRATIONS ═══
  function getConfig() {
    let cfg = read(KEY.config, null) || {};
    
    // v1 → v2: Merge default fields
    if (!cfg.tema) cfg.tema = 'dark';
    if (!cfg.moeda) cfg.moeda = 'BRL';
    
    return cfg;
  }
  
  function getLlmConfig() {
    let cfg = read(KEY.llmConfig, {});
    
    // v1 → v2: Refactor single apiKey → apiKeys{}
    if (cfg.apiKey) {
      cfg.apiKeys = cfg.apiKeys || {};
      cfg.apiKeys[cfg.provider || 'openai'] = cfg.apiKey;
      delete cfg.apiKey;
    }
    
    // v2 → v3: Add systemPrompt
    if (!cfg.systemPrompt) {
      cfg.systemPrompt = DEFAULT_SYSTEMPROMPT_V3;
    }
    
    // v3 → v4: Function Calling upgrade
    if (!cfg.systemPrompt.includes('RESPOSTAS DIRETAS')) {
      cfg.systemPrompt = DEFAULT_SYSTEMPROMPT_V4;
    }
    
    write(KEY.llmConfig, cfg);
    return cfg;
  }
  
  return { read, write, getConfig, getLlmConfig, /* ... */ };
})();
```

### Versioning Strategy

```
Versions são detectadas por conteúdo (não por campo metadata explícito)

v1 → v2:
  apiKey: "sk-xxx"     OLD
  apiKeys: {...}       NEW

v2 → v3:
  systemPrompt: "Você é útil"     OLD (sem RESPOSTAS DIRETAS)
  systemPrompt: "... RESPOSTAS..." NEW

v3 → v4:
  RAG context: static snapshot     OLD
  Function Calling: dynamic tools  NEW

Migrations são automáticas ao carregar dados.
Nenhuma ação do user necessária.
```

---

## 🎨 DESIGN SYSTEM TOKENS

### css/tokens.css

```css
/* ═══ PALETA AURORA OBSIDIAN ═══ */
:root {
  /* Gold (Primary) */
  --color-gold:         #D4A574;
  --color-gold-light:   #E8BFA8;
  --color-gold-subtle:  rgba(212, 165, 116, 0.1);
  
  /* Semantic Colors */
  --color-success:      #5EE39A;  /* Verde */
  --color-error:        #FF6B7A;  /* Vermelho */
  --color-warning:      #FBBF24;  /* Âmbar */
  --color-info:         #7BB6FF;  /* Azul */
  --color-accent:       #F472B6;  /* Magenta */
  
  /* Backgrounds */
  --bg-primary:         #08080F;  /* Quase preto */
  --bg-secondary:       #0F0F1E;  /* Cinza muito escuro */
  --bg-tertiary:        #1A1A2E;  /* Cinza escuro */
  --bg-elevated:        rgba(255, 255, 255, 0.05);
  
  /* Glass Effect */
  --glass-1:            rgba(255, 255, 255, 0.03);
  --glass-2:            rgba(255, 255, 255, 0.08);
  --glass-3:            rgba(255, 255, 255, 0.12);
  
  /* Borders */
  --border-subtle:      rgba(212, 165, 116, 0.2);
  --border-accent:      rgba(212, 165, 116, 0.5);
  
  /* Text */
  --text-primary:       #FFFFFF;
  --text-secondary:     #C0C0C0;
  --text-tertiary:      #808080;
}

/* ═══ TIPOGRAFIA ═══ */
:root {
  /* Display (Fraunces) */
  --font-display:       'Fraunces', serif;
  
  /* UI Body (Switzer) */
  --font-body:          'Switzer', sans-serif;
  
  /* Monospace (JetBrains) */
  --font-mono:          'JetBrains Mono', monospace;
  
  /* Sizes */
  --fs-xs:              0.75rem;   /* 12px */
  --fs-sm:              0.875rem;  /* 14px */
  --fs-base:            1rem;      /* 16px */
  --fs-lg:              1.125rem;  /* 18px */
  --fs-xl:              1.5rem;    /* 24px */
  --fs-2xl:             2rem;      /* 32px */
}

/* ═══ SPACING ═══ */
:root {
  --space-xs:           0.25rem;   /* 4px */
  --space-sm:           0.5rem;    /* 8px */
  --space-md:           1rem;      /* 16px */
  --space-lg:           1.5rem;    /* 24px */
  --space-xl:           2rem;      /* 32px */
  --space-2xl:          3rem;      /* 48px */
}

/* ═══ RADIUS ═══ */
:root {
  --radius-sm:          4px;
  --radius-md:          8px;
  --radius-lg:          12px;
  --radius-xl:          16px;
  --radius-full:        9999px;
}

/* ═══ SHADOWS ═══ */
:root {
  --shadow-sm:          0 1px 3px rgba(0, 0, 0, 0.12);
  --shadow-md:          0 4px 12px rgba(0, 0, 0, 0.15);
  --shadow-lg:          0 8px 24px rgba(0, 0, 0, 0.2);
}

/* ═══ TRANSITIONS ═══ */
:root {
  --transition-fast:    150ms ease;
  --transition-base:    300ms ease;
  --transition-slow:    500ms ease;
}
```

---

## 🔐 SECURITY CHECKLIST

### CSP (Content Security Policy)

```html
<!-- Bloqueado → Bloqueado por CSP -->
<!-- Permitido ✅ -->

default-src 'self'
  ✅ Permite scripts/styles/fonts de ./
  ✅ Bloqueia CDNs não-whitelisted

script-src 'self' 'unsafe-inline'
  ✅ Permite scripts inline (needed para ES6 modules)
  ⚠️  'unsafe-inline' é necessário mas risco de XSS

style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
  ✅ Permite CSS inline + Google Fonts
  
font-src 'self' https://fonts.gstatic.com
  ✅ Apenas Gstatic para fontes

connect-src https://api.openai.com ... https://api.groq.com
  ✅ Whitelist de LLM providers
  ❌ Bloqueia requests para outros domínios

img-src 'self' data: blob:
  ✅ Permite imagens locais + data URIs + blobs

object-src 'none'
  ✅ Bloqueia <embed>, <object>, <applet>
```

### XSS Prevention

```javascript
// Sempre escapar renderizações:
function esc(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

// ❌ NUNCA:
element.innerHTML = userInput;

// ✅ SEMPRE:
element.innerHTML = `<span>${esc(userInput)}</span>`;
```

### API Key Storage

```javascript
// ⚠️ RISCO: Keys em localStorage (plaintext)
// Mitigação:
// 1. CSP bloqueia exfiltração cross-domain
// 2. Aviso visual: "⚠️ Armazenado em localStorage não encriptado"
// 3. friendlyApiError() tratamento robusto

// ❌ NUNCA:
localStorage.setItem('sk-xxx-api-key', apiKey);

// ✅ FAZER (mesmo que plaintext):
DB.saveConfig({ apiKeys: { openai: 'sk-xxx' } });
// + mostrar aviso
// + futuro: env vars / OAuth
```

---

## 📊 ESTRUTURA CSS

### Cascata de Estilos

```
index.html
  ↓
1. tokens.css        (Variáveis + design tokens)
2. base.css          (Reset + normalize + body)
3. layout.css        (Grid, sidebar, topbar, nav)
4. bento.css         (Dashboard grid assimétrico)
5. components.css    (Card, Button, Modal, Toast, Badge)
6. pages.css         (Específico de módulos)
7. motion.css        (Transições + animações)

Ordem importa! Especificidade baixa → alta.
```

### BEM Naming Convention (Flexível)

```css
/* Block */
.card { }

/* Block__Element */
.card__header { }
.card__body { }
.card__footer { }

/* Block--Modifier */
.card--selected { }
.card--loading { }

/* FLEXIBILIDADE */
.glass-effect { }  ← utilidade reutilizável
.is-active { }     ← estado
[data-state="pending"] { }  ← atributo
```

---

## 🧪 TESTING STRATEGY

### Manual QA Checklist

```
[ ] Finanças
    [ ] Contas: criar, editar, deletar, filtros smart
    [ ] Transações: agrupamento por data
    [ ] Metas: depositar, sacar, calcular ritmo
    
[ ] Negócio
    [ ] Produtos: CRUD + margem de lucro
    [ ] Vendas: carrinho + múltiplas formas pagamento
    [ ] Estoque: alertas de baixo
    [ ] Clientes: histórico + saldo devedor
    
[ ] Pessoal
    [ ] Agenda: criar evento + recorrência
    [ ] Medicamentos: dose tracking
    [ ] Tarefas: kanban drag&drop
    [ ] Contatos: contexto duplo + 3 views
    
[ ] IA
    [ ] Chat: Function calling dinâmico
    [ ] WhatsApp: bubbles + CRM
    
[ ] Segurança
    [ ] XSS: tente injetar <script>alert(1)</script>
    [ ] localStorage quota: fill até limite
    [ ] CSP violations: inspecione console
    
[ ] Performance
    [ ] Lighthouse audit ≥85
    [ ] First paint <1s
    [ ] Google Fonts carregam em paralelo
    
[ ] Acessibilidade
    [ ] Keyboard navigation (Tab)
    [ ] WCAG AA+ contrast
    [ ] Sem "anonymous" images
```

### Não há testes automatizados (frontend-only)

Justificativa:
- Aplicação is small (~8k LOC)
- Testes manuais + visual inspection suficiente
- Deploy automatizado (GitHub Pages)
- Health monitoring via Sentinela (Opus)

---

## 🚀 DEPLOYMENT

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

### GitHub Pages Config

```
Remote: Leozinhobh77/controle-financeiro-v2
Branch: gh-pages (auto-generated)
URL: https://leozinhobh77.github.io/controle-financeiro-v2

File Structure:
/ (root)
├── index.html
├── css/
├── js/
├── .nojekyll  (tells GitHub Pages não usar Jekyll)
└── .gitignore (exclui leo-data.js sensitive data)
```

---

## 🔍 DEBUGGING TIPS

### Console Helpers

```javascript
// Ver estado de um módulo
console.log(Contas);  // → {render, salvar, editar, ...}

// Limpar localStorage
localStorage.clear();  // ⚠️ Apaga TUDO
location.reload();

// Limpar uma collection
localStorage.removeItem('finflow.contas');

// Export dados
copy(JSON.stringify(DB.exportAll(), null, 2));

// Import dados
const data = prompt('Cola o JSON');
DB.importAll(JSON.parse(data));
location.reload();

// Ver API requests
Network tab → XHR/Fetch → inspect headers
```

### Common Issues

| Problema | Causa | Solução |
|----------|-------|---------|
| Module não renderiza | `section#section-X` não existe | Verificar index.html |
| localStorage não salva | Quota exceeded | Limpar com Clear All |
| Chat não responde | API key inválida | Ir em Config, salvar nova key |
| Filtros não funcionam | `data-` atributo errado | Verificar `data-action` |
| Styles não aplicam | CSS file não carregado | Check Network tab, cache |
| XSS warning | Renderização sem `esc()` | Usar `esc(userInput)` |

---

## 📚 REFERÊNCIAS

- **ANATOMIA-COMPLETA.html** — Relatório visual (abrir em navegador)
- **ANATOMIA-DETALHADA.md** — Documentação técnica completa
- **FORGE-CHECKLIST.md** — Histórico de decisões (Fases 0-7)
- **PLANO-MENTOR24H.md** — Visão de produto e roadmap
- **README.md** — Setup e como rodar

---

**Documento:** BLUEPRINT-TECNICO.md  
**Data:** 2026-05-14  
**Status:** Mentor24h v5.2 — Fase 7 (Deploy) Concluída  
**Próximo:** Fase 8 (Monitoramento)
