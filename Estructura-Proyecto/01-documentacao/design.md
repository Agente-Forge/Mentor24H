# design.md — Mentor24h
**Forge v5.2** | Appetite: M (4-6 semanas) | Gerado por: skill-planner v5.1  
**Data:** 2026-05-12 | **Status:** ✅ APROVADO

---

## Arquitetura de Alto Nível

```
┌─────────────────────────────────────────────────────────────┐
│                        index.html                           │
│  ┌──────────┐  ┌───────────────────────────────────────┐   │
│  │ Sidebar  │  │           Main Content                 │   │
│  │ (nav)    │  │  ┌─────────────────────────────────┐  │   │
│  │          │  │  │        Page (active)             │  │   │
│  │ nav-item │  │  │   render() do módulo ativo       │  │   │
│  │ nav-group│  │  └─────────────────────────────────┘  │   │
│  └──────────┘  └───────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           Bottom Nav (mobile)                        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                    js/core/                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────────┐  │
│  │  app.js  │  │router.js │  │        db.js             │  │
│  │  (init)  │  │ (pages)  │  │  (localStorage CRUD)     │  │
│  └──────────┘  └──────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                   js/modules/                               │
│  dashboard.js  llm.js  chat-wa.js  agenda.js               │
│  medicamentos.js  tarefas.js  contatos.js                   │
│  contas.js  transacoes.js  metas.js  kanban.js             │
│  config.js                                                  │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                   js/utils/                                 │
│  icons.js  utils.js  command-palette.js                    │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│              localStorage (mentor24h.*)                     │
│  config  contas  transacoes  metas  agenda                  │
│  medicamentos  med-doses  tarefas  contatos                 │
│  chat-contatos  chat-msgs  llm-config  llm-conversas        │
└─────────────────────────────────────────────────────────────┘
         │
         ▼ (APIs externas — opcional, configurado pelo usuário)
┌─────────────────────────────────────────────────────────────┐
│  OpenRouter API  │  OpenAI API  │  Gemini API  │  Claude API │
└─────────────────────────────────────────────────────────────┘
```

**Deploy:** GitHub Pages (estático, zero servidor)

---

## Decisões Arquiteturais

### DEC-001 — IIFE como padrão de módulo JS
**Decisão:** Todos os módulos usam IIFE retornando `{ render, init }`.  
**Motivo:** Encapsulamento sem TypeScript nem bundler. Evita poluição do escopo global.  
**Alternativas descartadas:** ES6 modules (requer servidor ou bundler), Classes (overhead para MVP)  
**Tradeoffs:** ✅ Simples, zero config | ❌ Não tem tree-shaking  
**Fit com appetite M:** Total — zero tempo de setup, funciona direto no browser

### DEC-002 — localStorage com namespace `mentor24h.`
**Decisão:** Persistência 100% local, com prefixo namespace para evitar colisão.  
**Motivo:** 1 usuário, zero custo, funciona offline. Supabase só faz sentido na Fase 2 (multi-user).  
**Alternativas descartadas:** IndexedDB (complexidade extra sem benefício no MVP), Firebase (custo + lock-in)  
**Tradeoffs:** ✅ Offline, zero custo, simples | ❌ Limite 5MB, preso no browser  
**Fit com appetite M:** Total — sem setup de backend, sem auth

### DEC-003 — CSS puro com tokens (sem framework)
**Decisão:** CSS puro em arquivos separados por responsabilidade. Zero Tailwind, zero Bootstrap.  
**Motivo:** Controle total sobre design system OBSIDIAN. Frameworks genéricos criam visual genérico.  
**Alternativas descartadas:** Tailwind (classes no HTML = mistura de concerns), Bootstrap (design genérico)  
**Tradeoffs:** ✅ Design único e controlado | ❌ Mais CSS manual  
**Fit com appetite M:** Total — DESIGN-BRIEF aprovado, tokens já definidos no AGENTS.md

### DEC-004 — Router SPA custom (sem library)
**Decisão:** Router próprio que alterna `.active` em páginas e chama `render()` do módulo.  
**Motivo:** O roteamento do Mentor24h é simples (17 páginas, sem parâmetros de URL complexos).  
**Alternativas descartadas:** React Router (exige React), page.js (dependência desnecessária)  
**Tradeoffs:** ✅ Zero dependência | ❌ Sem deep linking nem browser history  
**Fit com appetite M:** Total — implementado em ~50 linhas

### DEC-005 — Multi-provider LLM com fallback
**Decisão:** LLM.js suporta OpenRouter, OpenAI, Gemini e Claude com fallback automático.  
**Motivo:** Sem lock-in. OpenRouter permite acessar Claude sem CORS restrito.  
**Alternativas descartadas:** Só OpenAI (lock-in), só Claude direct (CORS problemas em browser)  
**Tradeoffs:** ✅ Flexibilidade máxima | ❌ Lógica de provider mais complexa  
**Fit com appetite M:** LLM.js isolado — outros módulos não sofrem a complexidade

---

## Componentes Principais

### COMP-001 — DB (js/core/db.js)
**Responsabilidade:** CRUD de todas as collections em localStorage.

```
Input:  dados do módulo (objeto JS)
Output: dados lidos do localStorage (array/objeto)
```

**Collections (16):**
```javascript
const KEYS = {
  config:         'mentor24h.config',
  contas:         'mentor24h.contas',
  transacoes:     'mentor24h.transacoes',
  metas:          'mentor24h.metas',
  agenda:         'mentor24h.agenda',
  medicamentos:   'mentor24h.medicamentos',
  medDoses:       'mentor24h.med-doses',
  tarefas:        'mentor24h.tarefas',
  contatos:       'mentor24h.contatos',
  chatContatos:   'mentor24h.chat-contatos',
  chatMsgs:       'mentor24h.chat-msgs',
  llmConfig:      'mentor24h.llm-config',
  llmConversas:   'mentor24h.llm-conversas',
  produtos:       'mentor24h.produtos',       // Fase 2
  vendas:         'mentor24h.vendas',         // Fase 2
  clientes:       'mentor24h.clientes-neg',   // Fase 2
};
```

**Interface padrão:**
```javascript
DB.get(key)           // → array
DB.save(key, array)   // → void
DB.add(key, item)     // → item com id gerado
DB.update(key, item)  // → item atualizado
DB.remove(key, id)    // → void
DB.getConfig()        // → objeto config
DB.saveConfig(config) // → void
```

**Dependências:** nenhuma  
**Testabilidade:** Testar manualmente — salvar item, recarregar página, verificar persistência

---

### COMP-002 — Router (js/core/router.js)
**Responsabilidade:** Navegação SPA entre as 17 páginas.

```
Input:  nome da página (string, ex: 'dashboard')
Output: renderiza página ativa, atualiza nav, chama render() do módulo
```

**Interface:**
```javascript
Router.PAGES = { dashboard, 'chat-ai', 'chat-wa', agenda, ... } // 17 páginas
Router.register(page, renderFn)   // registra renderer
Router.navigate(page)             // navega para página
Router.getCurrentPage()           // → string
```

**Dependências:** Icons (para re-render após navegação)  
**Testabilidade:** Clicar em cada item da sidebar e verificar se página correta aparece

---

### COMP-003 — LLM (js/modules/llm.js)
**Responsabilidade:** Chat AI com multi-provider e histórico de conversas.

```
Input:  mensagem do usuário (string) + conversaId + config do provider
Output: resposta da AI (string) + atualização do histórico
```

**Interface:**
```javascript
LLM.render()                              // renderiza UI do chat
LLM.sendMessage(conversaId, content)     // → Promise<string>
LLM.createConversa()                      // → conversaId
LLM.callProvider(messages, config)       // → Promise<string>
```

**Providers:**
```javascript
PROVIDERS = {
  openrouter: { url: 'https://openrouter.ai/api/v1', cors: true },
  openai:     { url: 'https://api.openai.com/v1',    cors: true },
  gemini:     { url: 'https://generativelanguage.googleapis.com', cors: true },
  claude:     { url: 'https://api.anthropic.com/v1', cors: 'limitado' },
}
```

**Dependências:** DB (para config e conversas), Toast (para erros)  
**Testabilidade:** Configurar OpenRouter key → enviar mensagem → verificar resposta

---

### COMP-004 — Dashboard (js/modules/dashboard.js)
**Responsabilidade:** Cards dinâmicos com resumo inteligente do dia.

```
Input:  dados de todas as collections (via DB)
Output: HTML dos cards ativos (só os que têm conteúdo)
```

**Interface:**
```javascript
Dashboard.render()        // renderiza dashboard completo
Dashboard.buildCards()    // → array de cards HTML
Dashboard.getGreeting()   // → string saudação contextual
```

**Dependências:** DB (todas as collections), Icons  
**Testabilidade:** Adicionar evento para hoje → verificar card aparece no Dashboard

---

### COMP-005 — CommandPalette (js/utils/command-palette.js)
**Responsabilidade:** Busca global e navegação por teclado.

```
Input:  tecla Ctrl+K (evento de teclado)
Output: palette aberta com ações filtradas
```

**Interface:**
```javascript
CommandPalette.init()         // registra listener Ctrl+K / ⌘K
CommandPalette.open()         // abre palette
CommandPalette.close()        // fecha palette
CommandPalette.register(actions) // registra lista de ações
```

**Ações registradas:** Navegar para qualquer página + criar novo (evento, medicamento, tarefa, etc.)  
**Dependências:** Router  
**Testabilidade:** Ctrl+K → digitar "agenda" → Enter → verificar navegação

---

## Modelo de Dados

```javascript
// Estrutura padrão de todo registro
{
  id:        crypto.randomUUID(),   // string única
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  // + campos específicos
}

// Conta bancária
{ id, nome, banco, saldo, tipo: 'corrente'|'poupança'|'investimento', createdAt, updatedAt }

// Transação
{ id, contaId, descricao, valor, categoria, tipo: 'receita'|'despesa', data, createdAt, updatedAt }

// Evento de agenda
{ id, titulo, data, hora, descricao, createdAt, updatedAt }

// Medicamento
{ id, nome, horario, frequencia: 'diária'|'semanal'|'mensal', createdAt, updatedAt }

// Dose tomada
{ id, medicamentoId, tomadaEm: ISO_string, createdAt }

// Tarefa
{ id, titulo, descricao, prioridade: 'alta'|'media'|'baixa', status: 'pendente'|'em_andamento'|'concluido', createdAt, updatedAt }

// Contato
{ id, nome, telefone, email, tags: [], notas, createdAt, updatedAt }

// Contato WhatsApp CRM
{ id, nome, telefone, tags: [], ultimaMensagem, naoLidas: 0, notas, createdAt, updatedAt }

// Mensagem WhatsApp CRM
{ id, contatoId, texto, de: 'eu'|'contato', hora, status: 'enviado'|'recebido', createdAt }

// Config LLM
{ provider: 'openrouter', apiKey: '...', model: '...', systemPrompt: '...', temperature: 0.7 }

// Conversa LLM
{ id, titulo, msgs: [{role: 'user'|'assistant', content: '...'}], criadoEm, updatedAt }
```

---

## Fluxo de Dados Principal

```
[Léo clica "Nova Tarefa"]
        │
        ▼
[CommandPalette ou botão na página Tarefas]
        │
        ▼
[Modal.novaTarefa() → coleta dados do formulário]
        │
        ▼
[DB.add('mentor24h.tarefas', { ...dados, id: uuid, createdAt, updatedAt })]
        │
        ▼
[localStorage.setItem('mentor24h.tarefas', JSON.stringify(array))]
        │
        ▼
[Tarefas.render() → lista atualizada na tela]
        │
        ▼
[Dashboard.render() → card de tarefas atualizado se alta prioridade]
```

---

## Estrutura de Arquivos Final

```
controle-financeiro v2/
├── index.html                    ← único HTML, SPA
├── css/
│   ├── tokens.css                ← design tokens OBSIDIAN (cores, fontes, espaçamento)
│   ├── typography.css            ← Fraunces + Switzer + JetBrains Mono
│   ├── reset.css                 ← zeragem de estilos do browser
│   ├── layout.css                ← sidebar accordion, bottom nav, grid
│   ├── components.css            ← btn, card, modal, toast, badge, input
│   ├── pages.css                 ← estilos específicos por página
│   └── themes.css                ← variáveis do tema claro
├── js/
│   ├── core/
│   │   ├── db.js                 ← CRUD localStorage (16 collections)
│   │   ├── router.js             ← SPA router (17 páginas)
│   │   └── app.js                ← init, registra módulos e routes
│   ├── modules/
│   │   ├── dashboard.js          ← cards dinâmicos
│   │   ├── llm.js                ← chat AI multi-provider
│   │   ├── chat-wa.js            ← WhatsApp CRM simulado
│   │   ├── agenda.js
│   │   ├── medicamentos.js
│   │   ├── tarefas.js
│   │   ├── contatos.js
│   │   ├── contas.js
│   │   ├── transacoes.js
│   │   ├── metas.js
│   │   ├── kanban.js
│   │   └── config.js
│   └── utils/
│       ├── icons.js              ← Lucide SVG helpers
│       ├── utils.js              ← escapeHtml, formatters, helpers
│       └── command-palette.js    ← Ctrl+K global
├── data/
│   ├── default-config.json
│   └── seed.json
├── Estructura-Proyecto/          ← documentação FORGE
└── .memoria/                     ← memória do projeto
```
