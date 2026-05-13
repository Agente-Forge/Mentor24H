# SPEC.md — Contrato Técnico do Mentor24h

**Versão:** 1.0  
**Data:** 2026-05-13  
**Gerado por:** skill-documentador (FORGE etapa 3.1)  
**Status:** Baseline pós-Fase 2 — Design System completo

---

## ÍNDICE

1. [Visão Geral da Arquitetura](#1-visão-geral-da-arquitetura)
2. [Carregamento e Bootstrap](#2-carregamento-e-bootstrap)
3. [Design System — Tokens e CSS](#3-design-system--tokens-e-css)
4. [Módulo DB — Camada de Dados](#4-módulo-db--camada-de-dados)
5. [Módulo Router — Navegação SPA](#5-módulo-router--navegação-spa)
6. [Módulo App — Bootstrap e Coordenação](#6-módulo-app--bootstrap-e-coordenação)
7. [Módulo LLM — Chat Multi-IA](#7-módulo-llm--chat-multi-ia)
8. [Módulo ChatWA — WhatsApp Simulado](#8-módulo-chatwa--whatsapp-simulado)
9. [Módulo Dashboard](#9-módulo-dashboard)
10. [Módulo CommandPalette](#10-módulo-commandpalette)
11. [Módulos Pessoais](#11-módulos-pessoais)
12. [Módulos Financeiros](#12-módulos-financeiros)
13. [Módulos de Negócio](#13-módulos-de-negócio)
14. [Módulos de Suporte](#14-módulos-de-suporte)
15. [Schemas localStorage](#15-schemas-localstorage)
16. [Fluxos de Dados](#16-fluxos-de-dados)
17. [Contratos de Função (API Pública)](#17-contratos-de-função-api-pública)
18. [Decisões Arquiteturais](#18-decisões-arquiteturais)
19. [Edge Cases e Invariantes](#19-edge-cases-e-invariantes)

---

## 1. Visão Geral da Arquitetura

Mentor24h é uma **SPA (Single Page Application) em HTML/CSS/JS puro** sem framework, sem build tool, sem dependências NPM. Tudo roda diretamente no browser via `file://` ou servidor estático.

```
index.html          — único ponto de entrada, toda a UI vive aqui
css/                — design system modular (7 arquivos)
js/                 — módulos IIFE (24 arquivos), cada um expõe objeto global
data/               — arquivos JSON de importação (leo-data.js + leo-import.json)
Estructura-Proyecto/— documentação, decisões, tasks, bugs
```

### Padrão de Módulo

Todo módulo JS segue o padrão **IIFE com retorno explícito**:

```javascript
const NomeModulo = (() => {
  // privado
  function metodoPrivado() { ... }

  // público
  function metodoPublico() { ... }

  return { metodoPublico };
})();
```

Isso garante encapsulamento sem bundler. Nenhum módulo usa `import`/`export`. A comunicação entre módulos é por referência direta ao objeto global (ex: `DB.getContas()`, `Router.navigate()`).

### Pilha Tecnológica

| Camada | Tecnologia | Notas |
|--------|-----------|-------|
| Markup | HTML5 semântico | Single file, ~800 linhas |
| Estilo | CSS puro + Custom Properties | 7 arquivos CSS, tokens-first |
| Lógica | JavaScript ES2020 vanilla | 24 módulos IIFE, ~5000 LOC |
| Persistência | localStorage | 16 coleções, 2 namespaces |
| Ícones | Lucide (via JS dinâmico) | `Icons.render()` após cada mutação de DOM |
| Fontes | Google Fonts CDN | Fraunces, Switzer, JetBrains Mono |
| Gráficos | Canvas 2D nativo | `charts.js`, sem biblioteca |

---

## 2. Carregamento e Bootstrap

### Ordem de Carregamento (index.html)

**CSS** (no `<head>`, em ordem obrigatória):
```
tokens.css → reset.css → layout.css → bento.css → components.css → pages.css → motion.css
```

**JS** (no final do `<body>`, em ordem obrigatória):
```
utils.js → db.js → router.js → icons.js → toast.js → modal.js
→ charts.js → theme.js → command-palette.js
→ dashboard.js → contas.js → transacoes.js → metas.js → kanban.js → categorias.js
→ config.js → llm.js → chat-wa.js
→ agenda.js → medicamentos.js → tarefas.js → contatos.js
→ leo-data.js → app.js
```

`app.js` é sempre o último — dispara `App.init()` no `DOMContentLoaded`.

### Sequência de `App.init()`

```
1. importarDadosLeo()       — importa dados iniciais (uma única vez via flag)
2. DB.updateStatusContas()  — atualiza status 'pendente' → 'atrasada'
3. Theme.init()             — aplica tema salvo + sincroniza ícone lua/sol
4. initSidebar()            — bind collapse, overlay, bottom nav
5. initNavGroups()          — accordion sidebar + override Router.navigate
6. initRouter()             — registra todos os renderers + navega para 'dashboard'
7. syncUserUI()             — atualiza avatar + nome na sidebar
8. startClock()             — relógio digital na topbar (tick 1s)
9. Alarm.init()             — inicializa widget de alarme/timer
10. CommandPalette.init()   — bind Ctrl+K + trigger na topbar
11. Icons.render()          — renderiza todos os ícones Lucide pendentes
```

### Importação de Dados Iniciais

`leo-data.js` expõe `LEO_IMPORT_DATA` como variável global. `App.importarDadosLeo()` verifica a flag `finflow.leo-v1` no localStorage. Se não existir, limpa tudo e importa os dados. Roda apenas uma vez por navegador.

---

## 3. Design System — Tokens e CSS

### Arquivos e Responsabilidades

| Arquivo | Conteúdo |
|---------|----------|
| `tokens.css` | Todas as CSS Custom Properties do tema dark (OBSIDIAN) |
| `reset.css` | Normalize + defaults globais (inputs, foco, seleção) |
| `layout.css` | Shell da app: sidebar, topbar, main-content, bottom nav |
| `bento.css` | Grid bento 12 colunas + primitiva `.bento-card` |
| `components.css` | Botões, badges, modais, toasts, progress, command palette |
| `pages.css` | Estilos específicos de cada página |
| `motion.css` | Keyframes e classes de animação |
| `themes.css` | Override das Custom Properties para tema light (cream linen) |

### Paleta OBSIDIAN

```
--base:           #0B0D0F   (fundo primário)
--surface-1:      #0F1113
--surface-2:      #141619
--surface-3:      #1A1D21
--color-gold:     #D4A574   (assinatura — CTA, active, links)
--color-gold-muted: #B8935F
--color-gold-subtle: rgba(212, 165, 116, 0.1)
--amber:          #E8B86D
--text-1:         #F8F6F2   (primário)
--text-4:         #4A4F58   (muted)
```

### Sistema de Alias

`--violet: var(--color-gold)` e `--magenta: var(--color-gold)` são definidos em `tokens.css`. Isso permite que referências a `var(--violet)` no CSS legado renderizem como gold sem alterar os arquivos. Apenas valores hardcoded como `rgba(167, 139, 250, ...)` precisam de substituição explícita.

### Tipografia

```
--font-sans:    'Switzer', system-ui        (corpo, UI)
--font-display: 'Fraunces', Georgia         (headings, KPIs)
--font-mono:    'JetBrains Mono', monospace (dados financeiros, clock)
```

---

## 4. Módulo DB — Camada de Dados

**Arquivo:** `js/db.js`  
**Escopo:** localStorage CRUD para todas as 16 coleções.

### Namespaces

```javascript
// Namespace legado (financeiro original)
'finflow.config'     // configuração do usuário
'finflow.contas'     // contas a pagar
'finflow.cats'       // categorias
'finflow.txs'        // transações
'finflow.metas'      // metas de poupança
'finflow.movs'       // movimentos de meta
'finflow.kanban'     // cards kanban
'finflow.seeded'     // flag de seed inicial

// Namespace Mentor24h
'mentor24h.agenda'         // eventos da agenda
'mentor24h.medicamentos'   // medicamentos cadastrados
'mentor24h.med-doses'      // histórico de doses tomadas
'mentor24h.tarefas'        // tarefas/lembretes
'mentor24h.contatos'       // agenda de contatos pessoais
'mentor24h.produtos'       // produtos/serviços do negócio
'mentor24h.vendas'         // vendas registradas
'mentor24h.clientes-neg'   // clientes do negócio
'mentor24h.chat-contatos'  // contatos do chat WhatsApp
'mentor24h.chat-msgs'      // mensagens do chat WhatsApp
'mentor24h.llm-config'     // configuração do provedor de IA
'mentor24h.llm-conversas'  // histórico de conversas com IA
```

### Primitivas Internas

```javascript
read(key, default)   // JSON.parse com try/catch; retorna default em erro
write(key, value)    // JSON.stringify + setItem; retorna bool
```

### Padrão CRUD

Todas as coleções seguem o mesmo padrão:

```javascript
// CREATE/UPDATE: se data.id existe → update; senão → insert com id gerado
saveX(data) → X       // retorna o objeto salvo

// READ com filtros opcionais
getX(filtros?) → X[]  // retorna array filtrado e ordenado

// DELETE por id
deleteX(id) → void
```

**Geração de ID:** `Utils.uid()` = `Date.now().toString(36) + Math.random().toString(36).slice(2, 9)` — colisão na prática impossível para uso em browser single-user.

---

## 5. Módulo Router — Navegação SPA

**Arquivo:** `js/router.js`

### Registro de Páginas

```javascript
const PAGES = {
  dashboard, 'chat-ai', 'chat-wa',
  produtos, vendas, estoque, clientes,
  contas, transacoes, metas,
  agenda, medicamentos, tarefas, contatos,
  kanban, categorias, config
}
// Cada entry: { title: string, em: string, icon: string }
```

### Contrato `navigate(page)`

1. Desativa todos os `.page` e `.nav-item` (remove `.active`)
2. Ativa `[data-page="${page}"]` e `[data-nav="${page}"]`
3. Atualiza `#topbar-title-text`, `#topbar-title-em`, `#topbar-crumb`
4. Atualiza `current`
5. Chama `App.syncBottomNav(page)`
6. Em `requestAnimationFrame`: executa `renderers[page]()` + `Icons.render(pageEl)`

**Fallback:** Página desconhecida → redireciona para `dashboard`.

### Override por `App.initNavGroups()`

`App.initNavGroups()` faz monkey-patch em `Router.navigate` para chamar `openGroupFor(page)` antes de navegar. Isso garante que o grupo da sidebar correspondente à página atual fique aberto.

---

## 6. Módulo App — Bootstrap e Coordenação

**Arquivo:** `js/app.js`  
**Expõe:** `{ init, toggleSidebar, syncUserUI, syncBottomNav, closeMobileSidebar }`

### Mapa de Grupos da Bottom Nav

```javascript
const BNAV_GROUP = {
  'chat-ai': 'chat-ai', 'chat-wa': 'chat-ai',
  'produtos': 'vendas', 'vendas': 'vendas', 'estoque': 'vendas', 'clientes': 'vendas',
  'contas': 'contas', 'transacoes': 'contas', 'metas': 'contas',
  'kanban': 'contas', 'categorias': 'contas',
  'agenda': 'tarefas', 'medicamentos': 'tarefas', 'tarefas': 'tarefas', 'contatos': 'tarefas',
};
```

`syncBottomNav(page)` resolve `page` para seu grupo pai e ativa o `.bnav-item` correspondente.

### Sidebar Mobile

| Estado | Classe no `#sidebar` | `#sidebar-overlay` |
|--------|---------------------|-------------------|
| Fechado | — | — |
| Aberto | `.mobile-open` | `.visible` |

`document.body.overflow = 'hidden'` enquanto aberto (impede scroll do fundo).

### Relógio (`startClock`)

Renderiza `#topbar-clock` e `#topbar-date` a cada 1000ms. Formato clock: `HH:MM:SS` com spans separados (`tc-h`, `tc-m`, `tc-s`, `tc-sep`). Formato date: `weekday long, DD MMM YYYY` em pt-BR.

### Alarme (`Alarm`)

Timer baseado em `Date.now()` com `setInterval(tick, 500)`. Som gerado via **Web Audio API** (4 osciladores — notas C5 E5 G5 C6 em sequência). Não usa arquivos de áudio externos.

---

## 7. Módulo LLM — Chat Multi-IA

**Arquivo:** `js/llm.js`  
**Expõe:** `{ render, renderConfig, novaConversa }`

### Provedores Suportados

| Provider | URL Base | Autenticação | CORS |
|----------|----------|--------------|------|
| `openrouter` | `https://openrouter.ai/api/v1` | `Bearer <key>` | ✅ Ok |
| `openai` | `https://api.openai.com/v1` | `Bearer <key>` | ✅ Ok |
| `gemini` | `https://generativelanguage.googleapis.com` | Query param `?key=` | ✅ Ok |
| `claude` | `https://api.anthropic.com/v1` | `x-api-key` header | ⚠️ CORS restrito |

**Recomendação:** Usar OpenRouter para acessar Claude, GPT e Gemini com uma única chave — sem problemas de CORS.

### Formato de Mensagem (storage)

```javascript
// em llm-conversas[].msgs[]
{ role: 'user' | 'assistant', content: string }
```

### Fluxo de `sendMessage()`

```
textarea.value → validar (não vazio, tem conversaId, não isLoading)
→ push { role: 'user', content } na conversa
→ auto-titular conversa (primeiros 40 chars se titulo === 'Nova conversa')
→ DB.saveLlmConversa() → render() → append typing indicator
→ callProvider(msgs, cfg)
→ push { role: 'assistant', content: response }
→ DB.saveLlmConversa() → render()
```

### Formato Gemini (diferente dos demais)

Gemini usa `role: 'model'` em vez de `'assistant'`. O módulo converte automaticamente ao montar o body.

### `formatMsgContent(text)`

Escapa HTML, converte `\n → <br>`, converte `` `code` `` → `<code>` e `**bold**` → `<strong>`. Markdown básico.

---

## 8. Módulo ChatWA — WhatsApp Simulado

**Arquivo:** `js/chat-wa.js`  
**Expõe:** `{ render }`

### Layout (3 colunas desktop, drawer mobile)

```
.wa-shell
  .wa-list-panel    (30%) — lista de contatos + busca
  .wa-chat-panel    (45%) — conversa ativa
  .wa-crm-panel     (25%) — painel CRM do contato selecionado
```

No mobile (`≤640px`): `wa-list-panel` e `wa-crm-panel` são `display:none` por default, aparecem como drawer com `.mobile-open`.

### Aviso de Simulação

Um banner fixo informa que é uma interface simulada e orienta a conectar uma API WhatsApp nas Configurações. Nenhuma mensagem real é enviada.

### CRM Lateral

Exibe nome, telefone, tags do contato. Se o contato for também um cliente de negócio (`clientesNeg`), mostra histórico de compras e saldo devedor. Botão "+ Venda" abre modal de nova venda vinculada ao cliente.

---

## 9. Módulo Dashboard

**Arquivo:** `js/dashboard.js`  
**Expõe:** `{ render, setChartPeriod, setCalcPeriod }`

### Estrutura Bento

```
hero-card   (span-5, row-2) — saudação + KPI saldo
kpi-1       (span-4)        — total de contas
kpi-2       (span-3)        — contas pagas
kpi-3       (span-3)        — contas atrasadas
calc-card   (span-4, accent-violet) — calculadora por período
chart-donut (span-5)        — pizza por categoria
chart-bars  (span-7)        — barras 6 meses entradas/saídas
proximas    (span-7)        — próximas contas 14 dias
atividade   (span-5)        — histórico de transações recentes
```

`ensureBentoStructure()` garante que o HTML do grid seja criado apenas uma vez. Chamadas subsequentes de `render()` apenas atualizam o conteúdo dos cards.

### Saudação Inteligente

Período do dia → prefixo ("Bom dia", "Boa tarde", "Boa noite") + nome do usuário de `DB.getConfig().nomeUsuario`.

### Gráficos

Implementados em `charts.js` com Canvas 2D puro. Funções:
- `Charts.donut(canvasEl, data, colors)` — pizza/donut
- `Charts.bars(canvasEl, data, colors)` — barras agrupadas

---

## 10. Módulo CommandPalette

**Arquivo:** `js/command-palette.js`  
**Expõe:** `{ init, open, close }`

### Ativação

- `Ctrl+K` (Windows/Linux) ou `⌘K` (Mac) — toggle
- Clique no botão `#cmd-trigger` na topbar
- Clique no backdrop — fecha

### Comandos Registrados

**Grupo Navegar:** 15 itens (uma entrada por página registrada no Router)  
**Grupo Criar:** 4 ações rápidas (nova conta, nova transação, nova meta, nova conversa AI)

### Navegação por Teclado

`↑↓` move seleção, `Enter` executa, `Esc` fecha. Hover do mouse também muda seleção.

### Highlight de Busca

Termo buscado é envolvido em `<mark style="background:var(--violet)...">` nos resultados.

---

## 11. Módulos Pessoais

### Agenda (`js/agenda.js`)

**Expõe:** `{ render }`  
**Storage:** `mentor24h.agenda`

Schema de evento:
```javascript
{
  id: string,           // uid
  titulo: string,
  data: string,         // YYYY-MM-DD
  hora: string,         // HH:MM
  tipo: 'pessoal' | 'trabalho' | 'saude' | 'outro',
  descricao: string,
  recorrente: boolean,
  criadoEm: ISO string
}
```

Filtros: `DB.getAgenda({ data })` retorna eventos de uma data específica, ordenados por `data + hora`.

### Medicamentos (`js/medicamentos.js`)

**Expõe:** `{ render }`  
**Storage:** `mentor24h.medicamentos` + `mentor24h.med-doses`

Schema de medicamento:
```javascript
{
  id: string,
  nome: string,
  dosagem: string,        // ex: "500mg"
  horarios: string[],     // ex: ["08:00", "20:00"]
  frequencia: 'diario' | 'semanal' | 'quando-necessario',
  estoque: number,        // unidades em estoque
  estoqueMinimo: number,  // alerta quando ≤ estoqueMinimo
  criadoEm: ISO string
}
```

`DB.registrarDose(medId, data?)` registra que uma dose foi tomada. `DB.getDoses(medId, data?)` consulta histórico.

### Tarefas (`js/tarefas.js`)

**Expõe:** `{ render }`  
**Storage:** `mentor24h.tarefas`

Schema de tarefa:
```javascript
{
  id: string,
  titulo: string,
  descricao: string,
  prioridade: 'alta' | 'media' | 'baixa',
  status: 'pendente' | 'concluida',
  data: string | null,    // data limite YYYY-MM-DD
  hora: string | null,
  recorrente: boolean,
  subtarefas: [],
  criadoEm: ISO string
}
```

Ordenação: `alta → media → baixa`.

### Contatos (`js/contatos.js`)

**Expõe:** `{ render }`  
**Storage:** `mentor24h.contatos`

Schema de contato:
```javascript
{
  id: string,
  nome: string,
  telefone: string,
  email: string,
  tags: string[],
  aniversario: string | null,  // YYYY-MM-DD
  notas: string,
  criadoEm: ISO string
}
```

`DB.getContatos(busca?)` filtra por busca em `nome + telefone + email`, retorna ordenado por `nome`.

---

## 12. Módulos Financeiros

### Contas (`js/contas.js`)

**Expõe:** `{ render }`  
**Storage:** `finflow.contas`

Schema de conta:
```javascript
{
  id: string,
  descricao: string,
  valor: number,
  dataVencimento: string | null,    // YYYY-MM-DD
  dataPagamento: string | null,
  categoria: string,                // id de categoria
  observacoes: string,
  status: 'pendente' | 'paga' | 'atrasada',
  recorrente: boolean,
  intervaloRecorrencia: 'diario' | 'semanal' | 'quinzenal' | 'mensal' | 'anual' | null,
  recorrenciaAtiva: boolean,
  parcelado: boolean,
  totalParcelas: number | null,
  parcelaAtual: number | null,
  grupoParcelamento: string | null, // uid do grupo
  criadoEm: ISO string,
  atualizadoEm: ISO string
}
```

**`pagarConta(id, data, metodo, obs)`** — fluxo crítico:
1. Atualiza status → `'paga'`, dataPagamento
2. Cria transação de saída correspondente
3. Se `recorrente && recorrenciaAtiva` → cria próxima ocorrência via `Utils.nextRecurrence()`

**`DB.updateStatusContas()`** — chamado no `App.init()`: varre todas as contas `pendente` com `dataVencimento < today` e as marca como `atrasada`.

### Transações (`js/transacoes.js`)

**Expõe:** `{ render }`  
**Storage:** `finflow.txs`

Schema:
```javascript
{
  id: string,
  contaId: string | null,   // se gerada via pagarConta()
  tipo: 'entrada' | 'saida',
  valor: number,
  data: string,             // YYYY-MM-DD
  descricao: string,
  categoria: string | null,
  metodo: 'pix' | 'ted' | 'cartao_debito' | 'cartao_credito' | 'dinheiro' | 'outros',
  criadoEm: ISO string
}
```

### Metas (`js/metas.js`)

**Expõe:** `{ render }`  
**Storage:** `finflow.metas` + `finflow.movs`

Schema de meta:
```javascript
{
  id: string,
  nome: string, descricao: string,
  icone: string,        // nome do ícone Lucide
  cor: string,          // hex
  valorAlvo: number,
  prazo: string | null, // YYYY-MM-DD
  status: 'ativa' | 'concluida' | 'pausada',
  criadoEm: ISO string, atualizadoEm: ISO string
}
```

`DB.getValorMeta(metaId)` = soma de todos os movimentos (depósitos − saques). `saveMovimento()` verifica automaticamente se a meta foi atingida e a marca como `concluida`.

### Kanban (`js/kanban.js`)

**Expõe:** `{ render }`  
**Storage:** `finflow.kanban`

Schema de card:
```javascript
{
  id: string,
  coluna: 'todo' | 'doing' | 'done',
  titulo: string,
  descricao: string | null,
  prioridade: 'alta' | 'media' | 'baixa' | null,
  etiquetas: string[],
  ordem: number,
  criadoEm: ISO string
}
```

`DB.moveKanbanCard(id, novaColuna)` — atualiza coluna e recalcula ordem (quantidade de cards na coluna destino).

---

## 13. Módulos de Negócio

Módulos `produtos`, `vendas`, `estoque`, `clientes` têm páginas registradas no Router mas renderers ainda vazios (`() => {}`). São **placeholders para Fase 5**.

### Schemas já definidos no DB

**Produto:**
```javascript
{ id, nome, descricao, preco, custo, categoria, estoque, estoqueMinimo, status: 'disponivel' | 'esgotado' | 'inativo', criadoEm }
```

**Venda:**
```javascript
{ id, data, clienteId, clienteNome, itens: [{produtoId, nome, qtd, preco}], total, formaPagamento, status: 'paga' | 'pendente', criadoEm }
```

**Cliente de Negócio:**
```javascript
{ id, nome, telefone, email, aniversario, notas, saldoDevedor, criadoEm }
```

---

## 14. Módulos de Suporte

### Utils (`js/utils.js`)

Expõe funções puras sem efeitos colaterais:

```javascript
// Formatação
formatCurrency(value, moeda?)  // Intl.NumberFormat pt-BR
formatNumber(value)
formatDate(dateStr)            // DD/MM/YYYY
formatDateShort(dateStr)       // DD MMM
formatDateLong(dateStr)        // weekday long, DD MMMM YYYY
formatRelative(dateStr)        // "Hoje", "Amanhã", "Em 3 dias", etc.

// Datas
parseISO(s)                    // string YYYY-MM-DD ou Date → Date (sem timezone bug)
todayISO()                     // YYYY-MM-DD de hoje
addDays(dateStr, n)            // YYYY-MM-DD
getMonthRange(offset?)         // { start, end, monthName, monthShort }
getWeekRange()                 // { start, end }
daysUntil(endStr)              // número de dias até a data
nextRecurrence(dateStr, intervalo)

// UI helpers
urgencyOf(dateStr, status)     // 'green' | 'amber' | 'red' | 'muted'
urgencyLabel(dateStr, status)  // string legível de urgência

// Utilitários
uid()                          // id único curto
escapeHtml(s)                  // escape XSS
debounce(fn, wait?)
animateCount(el, from, to, duration?, isCurrency?)
clamp(n, min, max)
pct(part, total)               // porcentagem com clamp 0-100
```

**Aliases globais:** `const fmt = Utils.formatCurrency`, `const todayISO = Utils.todayISO`, `const esc = Utils.escapeHtml`

### Icons (`js/icons.js`)

```javascript
Icons.render(containerEl?)   // substitui todos [data-icon] no container por SVG Lucide
Icons.html(name, size?)      // retorna string HTML do ícone (sem render)
```

**Invariante:** Chamar `Icons.render()` após qualquer mutação de DOM que insira `[data-icon]`.

### Toast (`js/toast.js`)

```javascript
Toast.success(title, message?)
Toast.error(title, message?)
Toast.warning(title, message?)
Toast.info(title, message?)
```

Toasts desaparecem automaticamente após 4s (padrão). Se a mesma mensagem for chamada enquanto há um toast ativo, um novo é empilhado.

### Modal (`js/modal.js`)

```javascript
Modal.novaConta(contaId?)        // cria ou edita conta
Modal.novaTransacao(txId?)       // cria transação manual
Modal.novaMeta(metaId?)          // cria ou edita meta
Modal.novoKanban(cardId?)        // cria ou edita card kanban
Modal.novaCategoria(catId?)      // cria ou edita categoria
Modal.pagarConta(contaId)        // modal de confirmação de pagamento
```

Modais são renderizados num `<div id="modal-overlay">` global. Apenas um modal por vez.

### Theme (`js/theme.js`)

```javascript
Theme.get()        // retorna 'dark' | 'light'
Theme.set(t)       // aplica tema, salva no DB, troca ícone lua/sol, re-renderiza dashboard
Theme.toggle()     // alterna entre dark e light
Theme.init()       // carrega tema salvo, sincroniza checkbox + ícone inicial
```

Troca de ícone: `document.querySelector('.theme-toggle-row [data-icon]')` → `data-icon = t === 'light' ? 'sun' : 'moon'` + `Icons.render(...)`.

### Config (`js/config.js`)

**Expõe:** `{ render, syncSidebarAvatar }`

`syncSidebarAvatar(iniciais, cor, nome)` — atualiza `#side-avatar` (texto + background-color) e `#side-user-name`. Chamado por `App.syncUserUI()` no init e após salvar config.

---

## 15. Schemas localStorage

Resumo de todos os schemas por coleção:

| Chave | Tipo | Campos obrigatórios |
|-------|------|---------------------|
| `finflow.config` | object | `tema, moeda, nomeUsuario, saldoInicial, avatarCor` |
| `finflow.contas` | array | `id, descricao, valor, status, categoria, criadoEm` |
| `finflow.cats` | array | `id, nome, cor, icone, ordem` |
| `finflow.txs` | array | `id, tipo, valor, data, descricao, criadoEm` |
| `finflow.metas` | array | `id, nome, valorAlvo, status, criadoEm` |
| `finflow.movs` | array | `id, metaId, tipo, valor, data, criadoEm` |
| `finflow.kanban` | array | `id, coluna, titulo, ordem, criadoEm` |
| `mentor24h.agenda` | array | `id, titulo, data, hora, tipo, criadoEm` |
| `mentor24h.medicamentos` | array | `id, nome, dosagem, horarios, frequencia, estoque, estoqueMinimo` |
| `mentor24h.med-doses` | array | `id, medId, data, hora` |
| `mentor24h.tarefas` | array | `id, titulo, prioridade, status, criadoEm` |
| `mentor24h.contatos` | array | `id, nome, criadoEm` |
| `mentor24h.produtos` | array | `id, nome, preco, status, criadoEm` |
| `mentor24h.vendas` | array | `id, data, itens, total, status, criadoEm` |
| `mentor24h.clientes-neg` | array | `id, nome, criadoEm` |
| `mentor24h.chat-contatos` | array | `id, nome, tel` |
| `mentor24h.chat-msgs` | array | `id, contatoId, texto, de, hora, criadoEm` |
| `mentor24h.llm-config` | object | `provider, apiKey, model, systemPrompt` |
| `mentor24h.llm-conversas` | array | `id, titulo, msgs, criadoEm` |

**Defaults de `finflow.config`:**
```javascript
{ tema: 'dark', moeda: 'BRL', nomeUsuario: 'Você', saldoInicial: 0, avatarCor: '#D4A574' }
```

**Default de `mentor24h.llm-config`:**
```javascript
{
  provider: 'openrouter',
  apiKey: '',
  model: 'anthropic/claude-3.5-sonnet',
  systemPrompt: 'Você é o Mentor24h, um assistente pessoal e empresarial. Responda sempre em português brasileiro.'
}
```

---

## 16. Fluxos de Dados

### Fluxo: Pagar Conta

```
User clica "Pagar" na lista de contas
  → Modal.pagarConta(contaId)
  → User confirma (data, método)
  → DB.pagarConta(id, data, metodo, obs)
    → atualiza conta: status='paga', dataPagamento
    → DB.saveTransacao({ tipo:'saida', valor, ... })
    → se recorrente: DB.saveConta(próxima ocorrência)
  → Toast.success('Pago!')
  → Contas.render()
```

### Fluxo: Enviar Mensagem para IA

```
User digita + Enter (ou clica Enviar)
  → LLM.sendMessage()
  → valida: text, activeConversaId, !isLoading
  → push user msg → DB.saveLlmConversa()
  → isLoading = true → LLM.render() → append typing dots
  → LLM.callProvider(msgs, cfg)
    → switch provider: callOpenRouter | callOpenAI | callGemini | callClaude
    → fetch POST para URL do provedor
  → push assistant msg → DB.saveLlmConversa()
  → isLoading = false → LLM.render()
```

### Fluxo: Navegação com Sidebar Accordion

```
User clica nav-item
  → Router.navigate(page) [patched por App.initNavGroups]
    → App.openGroupFor(page)   // abre grupo sidebar correto
    → originalNavigate(page)   // fluxo normal do router
      → App.syncBottomNav(page) // sincroniza bottom nav mobile
      → renderers[page]()       // renderiza a página
      → Icons.render(pageEl)    // renderiza ícones na página
```

### Fluxo: Theme Toggle

```
User clica switch de tema
  → input[change] → Theme.toggle()
  → Theme.set(novoTema)
    → document.documentElement.setAttribute('data-theme', t)
    → DB.saveConfig({ tema: t })
    → sincroniza checkbox + ícone (lua/sol)
    → se página atual === 'dashboard': Dashboard.render() (após 50ms)
```

---

## 17. Contratos de Função (API Pública)

### DB (seleção dos mais críticos)

```javascript
DB.getConfig()                    → Config
DB.saveConfig(patch)              → Config
DB.getContas(filtros?)            → Conta[]    // filtros: {status, categoria, tipo, dataInicio, dataFim, busca}
DB.saveConta(data)                → Conta
DB.pagarConta(id, data, metodo, obs) → Conta | null
DB.gerarParcelas(base, n)         → Conta[]    // cria n contas parceladas em grupo
DB.getStats(start, end)           → Stats      // {total, totalPago, totalPendente, saldo, health, contas, txs...}
DB.getLlmConfig()                 → LlmConfig
DB.saveLlmConfig(patch)           → LlmConfig
DB.getLlmConversas()              → Conversa[]
DB.saveLlmConversa(data)          → Conversa  // cria ou atualiza se data.id
DB.exportAll()                    → ExportData // version:2
DB.importAll(data)                → boolean
DB.clearAll()                     → void
```

### Router

```javascript
Router.navigate(page)   → void   // navega, fallback 'dashboard' se inválido
Router.register(page, fn) → void // registra renderer para a página
Router.getCurrent()     → string // página ativa atual
Router.init()           → void   // bind clicks em [data-nav] + navega para 'dashboard'
```

### App

```javascript
App.syncBottomNav(page)   → void  // chamado pelo Router após navigate
App.syncUserUI()          → void  // re-sincroniza avatar + nome da sidebar
App.toggleSidebar()       → void  // colapsa/expande sidebar desktop
App.closeMobileSidebar()  → void  // fecha drawer mobile
```

### LLM

```javascript
LLM.render()          → void  // renderiza interface de chat
LLM.renderConfig()    → void  // renderiza seção de config em #config-llm-section
LLM.novaConversa()    → void  // cria nova conversa e foca input
```

### Utilitários

```javascript
Utils.uid()                          → string   // id único ~10 chars
Utils.formatCurrency(v, moeda?)      → string   // "R$ 1.234,56"
Utils.formatRelative(dateStr)        → string   // "Hoje", "Em 3 dias"
Utils.urgencyOf(dateStr, status)     → string   // cor CSS
Utils.nextRecurrence(dateStr, int)   → string   // próxima data YYYY-MM-DD
Icons.render(container?)             → void     // substitui [data-icon] por SVG
Toast.success|error|warning|info(t, m?) → void  // exibe toast
```

---

## 18. Decisões Arquiteturais

### D-001: Vanilla JS sem framework
**Decisão:** Não usar React/Vue/Angular.  
**Razão:** App roda via `file://`, sem servidor, sem build. Zero dependências = zero problemas de setup para o usuário final.  
**Trade-off:** Sem reatividade automática — todo `render()` é chamada explícita. Aceitável para escala atual.

### D-002: localStorage como banco de dados
**Decisão:** Toda persistência em localStorage, sem IndexedDB, sem servidor.  
**Razão:** Máxima simplicidade. Dados do usuário ficam no browser, sem privacidade comprometida.  
**Limite:** ~5MB por domínio. Para dados do Mentor24h (textos, sem imagens), limite não é problema.

### D-003: CSS Custom Properties como sistema de design
**Decisão:** Tokens em CSS vars, sem CSS-in-JS, sem Tailwind.  
**Razão:** Compatível com `file://`, sem build, theme toggle nativo via `[data-theme]`.

### D-004: Alias `--violet: var(--color-gold)`
**Decisão:** Em vez de substituir todas as ocorrências de `--violet`, criar alias no tokens.css.  
**Razão:** Menos risco de regressão. Permite migração gradual do design system Aurora → OBSIDIAN.

### D-005: `Icons.render()` pós-mutação manual
**Decisão:** Ícones Lucide são inseridos como `[data-icon]` e renderizados via `Icons.render()`.  
**Razão:** Sem bundler para importar SVGs. O módulo Icons faz lookup em tabela e substitui.  
**Invariante:** Todo código que insere HTML com `[data-icon]` deve chamar `Icons.render()` após.

### D-006: Monkey-patch em `Router.navigate`
**Decisão:** `App.initNavGroups()` sobrescreve `Router.navigate` para adicionar lógica de accordion.  
**Razão:** Separação de responsabilidades: Router não sabe sobre sidebar, App coordena.  
**Risco:** Se Router for reinicializado, o patch se perde. Mitigado por `initNavGroups()` rodar antes de `initRouter()`.

### D-007: OpenRouter como provedor padrão de LLM
**Decisão:** Default é OpenRouter, não Anthropic diretamente.  
**Razão:** API Anthropic tem CORS restrito em browser. OpenRouter funciona 100% de browsers, com uma chave acessa Claude, GPT e Gemini.

---

## 19. Edge Cases e Invariantes

### localStorage cheio
`DB.write()` retorna `false` em `QuotaExceededError`. Nenhum módulo atual trata esse retorno. **Futuro:** Tratar com Toast.error.

### `parseISO` vs `new Date(dateStr)`
`new Date('2026-05-13')` em alguns browsers interpreta como UTC, gerando erro de dia. `Utils.parseISO` force-adiciona `T00:00:00` para strings YYYY-MM-DD, garantindo hora local.

### IDs duplicados no `saveConta`
`saveConta` chama `Utils.uid()` duas vezes para o id (uma no merge, uma no Object.assign final). O segundo sobrescreve o primeiro, garantindo unicidade. **Atenção:** não passar `data.id` ao criar — só ao editar.

### `pagarConta` com conta já paga
Não há guard. Pagar a mesma conta duas vezes cria duas transações. **Futuro:** Validar `status !== 'paga'` antes de executar.

### LLM: Conversa sem `msgs`
`conversa.msgs` pode ser undefined se um objeto corrompido estiver no storage. `renderConversa` faz `const msgs = conversa.msgs || []` como proteção.

### Tema na inicialização
Se `DB.getConfig().tema` for undefined (storage virgem), `Theme.get()` retorna `'dark'`. Nunca há flash de tema claro.

### `Router.navigate` com página inválida
Fallback para `'dashboard'`. Não há erro visível ao usuário.

### `Icons.render()` em container null
`Icons.render(null)` não quebra — usa `document` como fallback.

### Bottom nav mobile em páginas sem grupo mapeado
`BNAV_GROUP[page] || page` — se a página não tiver mapeamento, usa o próprio nome. Para `dashboard` e `config`, nenhum `.bnav-item` terá `data-nav="dashboard"`, logo nenhuma tab fica ativa. Comportamento esperado.
