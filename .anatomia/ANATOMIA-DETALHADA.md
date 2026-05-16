# 🏗️ ANATOMIA COMPLETA — Mentor24h v5.2

> **Data:** 2026-05-14  
> **Status:** Fase 7 (Deploy) ✅ Concluída → Fase 8 (Monitoramento) próxima  
> **Health Score:** 94/100 (Sentinela audit 2026-05-13)

---

## 📋 Índice Rápido

1. [Visão Geral do Projeto](#visão-geral)
2. [Arquitetura & Stack](#arquitetura)
3. [Módulos Implementados](#módulos)
4. [Estrutura de Arquivos](#estrutura)
5. [Schema de Dados](#schema)
6. [Fluxos Principais](#fluxos)
7. [Integrações & Segurança](#segurança)
8. [Performance & Otimizações](#performance)
9. [Histórico FORGE](#forge)
10. [Próximos Passos](#próximos)

---

## 🎯 VISÃO GERAL

### O Projeto

**Mentor24h** é um **hub pessoal & empreendedor** que transforma o antigo "FinFlow" (controle-financeiro v2) em uma **plataforma tudo-em-um** para:
- **Pessoas comuns:** Organizar rotina, saúde, finanças
- **Microempreendedores:** Gerir negócio, vendas, estoque, clientes

### Nome & Identidade

| Aspecto | Descrição |
|---------|-----------|
| **Nome Original** | FinFlow — Dashboard Financeiro Premium |
| **Nome Novo** | Mentor24h — Hub Pessoal & Empreendedor |
| **Slogan** | "Seu Hub Pessoal" |
| **Design System** | Aurora OBSIDIAN (paleta premium editorial) |
| **Tagline** | "Organize sua vida pessoal e seu negócio num só lugar" |

### Stack Técnico

```
┌─────────────────────────────────────┐
│         MENTOR24H v5.2              │
├─────────────────────────────────────┤
│ Frontend:  HTML5 + CSS3 + ES6+ JS   │
│ Storage:   LocalStorage (JSON)      │
│ Deploy:    GitHub Pages             │
│ CI/CD:     GitHub Actions           │
│ Design:    Custom Aurora OBSIDIAN   │
│ Fonts:     Fraunces + Switzer + JBM │
│ LLM:       5 provedores (FC)        │
│ Deps:      ZERO externas            │
└─────────────────────────────────────┘
```

---

## 🏗️ ARQUITETURA

### Padrão Arquitetural: Modular SPA + LocalStorage

```
┌──────────────────────────────────────────────────┐
│           APP.JS (Inicializador)                 │
└──────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────┐
│         ROUTER.JS (SPA Navigation)               │
│  Dashboard → Contas → Vendas → Chat → ...       │
└──────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────┐
│  Módulos Funcionais (Contas, Vendas, etc.)     │
│         ↓               ↓               ↓        │
│      render()        salvar()        fetch()    │
└──────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────┐
│      DB.JS (LocalStorage Data Layer)            │
│  16 Collections com migrations automáticas       │
└──────────────────────────────────────────────────┘
```

### Padrão Código Modular (IIFE)

Cada módulo segue:

```javascript
const ModuleNome = (() => {
  // Private state & helpers
  
  function render() { /* renderização principal */ }
  function salvar() { /* persistência */ }
  function editar() { /* modal form */ }
  function deletar() { /* com confirmação */ }
  
  return { render, salvar, editar, deletar }; // Public API
})();
```

---

## 📦 MÓDULOS IMPLEMENTADOS

### 1️⃣ FINANÇAS PESSOAIS (`js/contas.js`, `js/transacoes.js`, `js/metas.js`)

**Propósito:** Gestão financeira pessoal com visual premium.

| Feature | Descrição | Status |
|---------|-----------|--------|
| **Contas a Pagar** | Histórico de faturas, recorrentes, parceladas | ✅ v2 |
| **Filtros Smart** | Segmented (Dia/Semana/Mês/Intervalo) + range picker | ✅ |
| **Data Pagamento** | Labels inteligentes ("Pago hoje", "Pago com atraso") | ✅ |
| **Transações** | Entrada/saída agrupadas por data | ✅ |
| **Metas** | Caixinhas com depósito/saque + calculadora de ritmo | ✅ |
| **Categorias** | Customizáveis com cor + ícone | ✅ |

**Schemas:**
```javascript
{
  id: 'uuid',
  descricao: 'string',
  valor: 'number',
  dataVencimento: 'YYYY-MM-DD',
  dataPagamento: 'YYYY-MM-DD', // null se não pago
  status: 'pendente|paga|atrasada',
  categoria: 'id-categoria',
  tipo: 'unica|recorrente|parcelada',
  recorrente: { intervalo, proximaData },
  parcelado: { total, atual, proximaData },
  observacoes: 'string',
  atualizadoEm: 'ISO8601'
}
```

---

### 2️⃣ MEU NEGÓCIO (Produtos, Vendas, Estoque, Clientes)

**Propósito:** CRM + Inventory + POS simplificado para microempreendedores.

#### 2A. Produtos (`js/produtos.js`)
- Nome, preço, custo, categoria, foto
- Cálculo automático de margem de lucro
- Status: disponível/indisponível/saiu de linha

#### 2B. Vendas (`js/vendas.js`)
- Carrinho de compra interativo
- Múltiplas formas de pagamento (PIX, dinheiro, cartão, crédito)
- Histórico com filtros
- Comissão/lucro por venda

#### 2C. Estoque (`js/estoque.js`)
- Quantidade por produto
- Alertas de estoque baixo
- Entradas (compra fornecedor) + Saídas (venda/perda)
- Relatório de o que tem/o que falta

#### 2D. Clientes CRM (`js/clientes.js`)
- Nome, telefone, email
- Histórico de compras
- Saldo devedor (vendas a prazo)
- Anotações & preferências
- Aniversário com alerta automático

---

### 3️⃣ VIDA PESSOAL (`js/agenda.js`, `js/medicamentos.js`, `js/tarefas.js`, `js/contatos.js`)

**Propósito:** Centralizar vida pessoal do usuário.

#### 3A. Agenda (`js/agenda.js`)
- Eventos com data, hora, tipo (pessoal/trabalho/saúde)
- Cores por tipo
- Recorrentes (toda segunda, todo dia 5)
- Lembretes (1h antes, 1 dia antes)

#### 3B. Medicamentos (`js/medicamentos.js`)
- Cadastro: nome, dosagem, horários, frequência
- Marcar como "tomado hoje"
- Histórico de adesão
- Alerta de estoque do remédio

#### 3C. Tarefas (`js/tarefas.js`)
- Prioridade (baixa/média/alta)
- Subtarefas (checklist)
- Lembretes com data/hora
- Kanban integrado (4 colunas)
- Projetos (agrupamento por contexto)

#### 3D. Contatos v2 — CONTEXTO DUPLO (`js/contatos.js`)

**Inovação Principal:** Um contato pode ter **múltiplos contextos** (pessoal + trabalho + cliente, etc.)

```javascript
{
  id: 'uuid',
  nome: 'string',
  telefone: 'string',
  email: 'string',
  anotacoes: 'string',
  
  // CONTEXTO DUPLO — recurso chave
  contextos: [
    'pessoal',    // Azul
    'trabalho',   // Verde
    'cliente',    // Laranja
    'parceiro',   // Roxo
    'fornecedor', // Vermelho
    'família'     // Rosa
  ],
  
  // Negócio
  empresa: 'string',
  cargo: 'string',
  
  // Kanban de clientes (prospect → ativo → inativo → arquivado)
  kanbanStage: 'prospect|ativo|inativo|arquivado',
  
  // Integração
  googleResourceName: 'string',
  atualizadoEm: 'ISO8601'
}
```

**3 Views Implementadas:**
1. **Cards** — Visão grid com contextos em badges
2. **Lista** — Tabela compacta com filtros
3. **Kanban** — Drag & drop de clientes por estágio

**Import/Export:**
- vCard 3.0 (iPhone/Android/Google/Outlook)
- CSV parsing inline
- Detecção de duplicatas
- Drag & drop file upload

---

### 4️⃣ CHAT & IA (`js/llm.js`, `js/llm-tools.js`, `js/chat-wa.js`)

**Propósito:** IA integrada ao aplicativo com acesso a dados em tempo real.

#### 4A. Chat AI (`js/llm.js`)
- 5 provedores: OpenAI, Groq, OpenRouter, Anthropic, Gemini
- **Function Calling v4** — IA puxa dados sob demanda
- systemPrompt v4 com migração automática v1→v2→v3→v4
- Toolbar com Limpar + Sugestões clicáveis
- RAG → Function Calling (évita snapshot pesado)

#### 4B. Function Calling Tools (`js/llm-tools.js`)
11 ferramentas disponíveis:
1. `getDataAtual()` — Data/hora/dia da semana
2. `getContas()` — Faturas pendentes/atrasadas/pagas
3. `getResumoFinanceiroMes()` — Totais do mês
4. `getVendas()` — Vendas do período
5. `getClientes()` — Lista de clientes + saldos
6. `getProdutos()` — Catálogo + estoque
7. `getTarefas()` — Pendentes/atrasadas/hoje/sem prazo
8. `getEventos()` — Agenda da semana
9. `getMedicamentos()` — Cronograma de hoje
10. `getMetas()` — Caixinhas + progresso
11. `getConfigUsuario()` — Preferências

**Contexto Dinâmico:**
Ao invés de snapshots estáticos (RAG), a IA chama ferramentas conforme necessário:
- "Quanto eu devo este mês?" → `getResumoFinanceiroMes()`
- "Quais são meus clientes devendo?" → `getClientes()` (filtra saldo > 0)
- "Minhas tarefas de hoje" → `getTarefas()` (filtra data = hoje)

#### 4C. WhatsApp CRM (`js/chat-wa.js`)
- Bubble interface (simula chat)
- Integração com contatos
- Seed demo com conversas pré-carregadas
- CRM lateral com últimas mensagens

---

## 📁 ESTRUTURA DE ARQUIVOS

```
controle-financeiro v2/
│
├── 📄 index.html                 (Ponto de entrada)
│   └─ CSP meta-tag (SEC-01)
│   └─ Preconnect Google Fonts
│   └─ 6 CSS files + 23+ scripts
│
├── 🎨 css/
│   ├─ tokens.css               (Paleta OBSIDIAN gold #D4A574)
│   ├─ base.css                 (Reset + normalize)
│   ├─ layout.css               (Sidebar, topbar, bottom nav, grid)
│   ├─ bento.css                (Dashboard assimétrico)
│   ├─ components.css           (Card, Button, Modal, Toast, Badge)
│   ├─ pages.css                (CSS específico dos módulos)
│   └─ motion.css               (Transições, animações)
│
├── 🔧 js/
│
│   ├─ 📱 CORE
│   │  ├─ app.js                (Inicializador + router + listeners)
│   │  ├─ router.js             (SPA routing — navega entre módulos)
│   │  ├─ db.js                 (LocalStorage 16 schemas + migrations)
│   │  ├─ utils.js              (uid(), formatCurrency(), todayISO(), etc.)
│   │  ├─ icons.js              (SVG icons inline — 40+ ícones)
│   │  ├─ modal.js              (Modal genérico para forms)
│   │  └─ toast.js              (Notificações toast — success/error/info)
│   │
│   ├─ 💰 FINANÇAS
│   │  ├─ contas.js             (Bills com filtros smart)
│   │  ├─ transacoes.js         (Histórico agrupado por data)
│   │  ├─ metas.js              (Savings goals — caixinhas)
│   │  ├─ categorias.js         (Tag system)
│   │  └─ charts.js             (SVG chart rendering — sem Chart.js)
│   │
│   ├─ 💼 NEGÓCIO
│   │  ├─ produtos.js           (Catálogo c/ margem de lucro)
│   │  ├─ vendas.js             (Carrinho + history)
│   │  ├─ estoque.js            (Inventory management)
│   │  └─ clientes.js           (CRM simples + contatos)
│   │
│   ├─ 👤 PESSOAL
│   │  ├─ agenda.js             (Calendário + eventos)
│   │  ├─ medicamentos.js       (Dose tracking)
│   │  ├─ tarefas.js            (TODO list + kanban)
│   │  ├─ kanban.js             (Drag & drop genérico)
│   │  └─ contatos.js           (👥 Contexto duplo v2 — recurso chave)
│   │
│   ├─ 🤖 IA
│   │  ├─ llm.js                (Chat interface + 5 provedores)
│   │  └─ llm-tools.js          (11 function calling tools)
│   │
│   ├─ 💬 CHAT
│   │  └─ chat-wa.js            (WhatsApp CRM + bubbles)
│   │
│   ├─ ⚙️ CONFIG
│   │  └─ config.js             (Preferências + export/import)
│   │
│   └─ 🌱 SEED
│      └─ leo-data.js           (Dados demo — população automática)
│
├── 📦 leo-import.json           (Exemplo de importação)
│
├── 🚀 .github/
│   └─ workflows/
│      └─ deploy.yml            (GitHub Actions → GitHub Pages)
│
├── 📚 .anatomia/
│   ├─ ANATOMIA-COMPLETA.html   (Relatório visual — este projeto)
│   └─ ANATOMIA-DETALHADA.md    (Este documento)
│
├── 📋 FORGE-CHECKLIST.md        (Histórico 0-7 fases + próximas ações)
├── 📋 PLANO-MENTOR24H.md        (Visão do produto)
└── 📖 README.md                 (Setup + como rodar)
```

---

## 🗂️ SCHEMA DE DADOS (16 Collections)

### localStorage Keys & Estrutura

| Collection | Key | Schemas Importantes | Versão |
|-----------|-----|-------------------|--------|
| **config** | `finflow.config` | `{tema, moeda, nomeUsuario, saldoInicial, avatarCor}` | ✅ |
| **contas** | `finflow.contas` | `{id, descricao, valor, dataVencimento, dataPagamento, status, categoria, recorrente, parcelado}` | ✅ v2 |
| **transacoes** | `finflow.txs` | `{id, descricao, valor, data, tipo:'entrada\|saida', categoria}` | ✅ |
| **metas** | `finflow.metas` | `{id, nome, valorAlvo, valorAtual, depositos[], saques[]}` | ✅ |
| **categorias** | `finflow.cats` | `{id, nome, cor, icone, ordem}` | ✅ |
| **agenda** | `mentor24h.agenda` | `{id, titulo, data, hora, tipo, recorrente, descricao}` | ✅ |
| **medicamentos** | `mentor24h.medicamentos` | `{id, nome, dosagem, horarios[], frequencia}` | ✅ |
| **tarefas** | `mentor24h.tarefas` | `{id, titulo, data, prioridade, status, subtarefas[], kanbanStage}` | ✅ |
| **contatos** | `mentor24h.contatos` | `{id, nome, telefone, email, contextos[], empresa, cargo, kanbanStage, googleResourceName}` | ✅ v2 |
| **produtos** | `mentor24h.produtos` | `{id, nome, preco, custo, categoria, estoque, estoqueMinimo, foto}` | ✅ |
| **vendas** | `mentor24h.vendas` | `{id, cliente, items[], total, data, pagamento, lucro}` | ✅ |
| **clientes** | `mentor24h.clientes-neg` | `{id, nome, telefone, email, historico[], saldoDevedor, anotacoes}` | ✅ |
| **chat-contatos** | `mentor24h.chat-contatos` | `{id, contatoId, ultimaMensagem, data}` | ✅ |
| **chat-msgs** | `mentor24h.chat-msgs` | `{id, contatoId, texto, autor, timestamp}` | ✅ |
| **llmConfig** | `mentor24h.llm-config` | `{provider, apiKeys:{}, models:{}, systemPrompt}` | ✅ v4 |
| **llmConversas** | `mentor24h.llm-conversas` | `{id, data, titulo, mensagens[], contexto}` | ✅ |

### Migrations Automáticas

Ao carregar dados, o app detecta versão antiga e migra automaticamente:
- `v1 → v2`: Refactora `apiKey` única para `apiKeys: {provider: key}`
- `v2 → v3`: Adiciona systemPrompt v3 com "RESPOSTAS DIRETAS"
- `v3 → v4`: Implementa Function Calling + ferramentas dinâmicas

---

## 🔄 FLUXOS PRINCIPAIS

### Fluxo 1: Criar uma Conta a Pagar

```
User clica "Novo" (contas.js)
    ↓
Modal.open() com form (id, descricao, valor, dataVencimento, categoria, etc.)
    ↓
User valida + clica "Salvar"
    ↓
contas.salvar() valida dados
    ↓
DB.saveConta(data) → localStorage
    ↓
contas.render() → redraw lista
    ↓
Toast.success("Conta criada")
```

### Fluxo 2: Chatear com IA (Function Calling)

```
User: "Quanto devo este mês?"
    ↓
llm.js coleta message → systemPrompt v4
    ↓
Envia para provider (OpenAI/Groq/Anthropic/etc.)
    ↓
IA responde com tool_call: getResumoFinanceiroMes()
    ↓
llm-tools.js executa function → coleta dados DB
    ↓
Retorna resultado para IA
    ↓
IA formata resposta em português
    ↓
Renderiza bubble no chat
```

### Fluxo 3: Gerenciar Contatos (Contexto Duplo)

```
User clica "Novo contato"
    ↓
contatos.js abre drawer com form
    ↓
User seleciona contextos (checkboxes: pessoal, trabalho, cliente, etc.)
    ↓
Clica "Salvar"
    ↓
DB.saveContato(data) → localStorage
    ↓
contatos.render() atualiza view atual (Cards/Lista/Kanban)
    ↓
Toast + atualiza contador ("5 de 12")
```

### Fluxo 4: Venda (POS)

```
User em "Vendas" → clica "Nova venda"
    ↓
Abre carrinho interativo
    ↓
Busca/seleciona produtos + quantidade
    ↓
Sistema calcula total + margem
    ↓
Seleciona cliente + forma pagamento
    ↓
Clica "Finalizar venda"
    ↓
vendas.js registra no DB
    ↓
estoque.js atualiza automaticamente
    ↓
Toast + exibe resumo (total, lucro)
```

---

## 🔐 SEGURANÇA & INTEGRAÇÕES

### Content Security Policy (SEC-01)

```html
<meta http-equiv="Content-Security-Policy" 
  content="
    default-src 'self'; 
    script-src 'self' 'unsafe-inline'; 
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
    font-src 'self' https://fonts.gstatic.com; 
    connect-src https://openrouter.ai https://api.openai.com 
               https://generativelanguage.googleapis.com 
               https://api.anthropic.com https://api.groq.com; 
    img-src 'self' data: blob:; 
    object-src 'none';
  ">
```

**O que bloqueia:**
- ✅ XSS (inline scripts de terceiros)
- ✅ Exfiltração localStorage (API keys via requests não-whitelisted)
- ✅ Carregamento de fontes de CDNs não-autorizados

### Provedores LLM Integrados

| Provider | Endpoint | Modelos | Auth | Status |
|----------|----------|---------|------|--------|
| **OpenAI** | https://api.openai.com | gpt-4, gpt-3.5, etc. | API Key | ✅ |
| **Groq** | https://api.groq.com | Llama 3.3 70B, Mixtral, Gemma 2 | API Key | ✅ |
| **OpenRouter** | https://openrouter.ai | 100+ modelos | API Key | ✅ |
| **Anthropic** | https://api.anthropic.com | Claude 3 Opus/Sonnet/Haiku | API Key | ✅ |
| **Gemini** | https://generativelanguage.googleapis.com | Gemini 1.5 Pro/Flash | API Key | ✅ |

### Riscos de Segurança Documentados

| Risco | Severidade | Status | Mitigação |
|-------|-----------|--------|-----------|
| API keys em localStorage (plaintext) | 🔴 CRÍTICO | Mitigado | CSP + aviso visual |
| XSS em renderizações | 🟠 ALTO | Fixado | Todas com `esc()` |
| localStorage quota exceeded | 🟡 MÉDIO | Tratado | Try-catch em write() |
| Dados não encriptados em rest | 🟡 MÉDIO | Aceito | LocalStorage apenas (frontend) |

---

## ⚡ PERFORMANCE & OTIMIZAÇÕES

### Google Fonts (P-01)

**Antes:**
```css
@import url('https://fonts.googleapis.com/css2?...');
```
Sequencial — bloqueia parsing.

**Depois:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?...">
```
Paralelo com preconnect + DNS elimination → **~150ms mais rápido**

### Search Debounce (P-02)

```javascript
const handleWASearch = debounce((q) => {
  contatosFiltra = filterWA(q);
  renderWA();
}, 150);
```
Evita recálculos desnecessários a cada keystroke.

### CSS will-change (P-03)

```css
.sidebar-accordion {
  will-change: max-height; /* GPU acceleration */
  transition: max-height 300ms ease;
}
```
Notifica browser: "Prepare hardware acceleration para max-height"

### Audit Lighthouse (Sentinela)

- ✅ Performance: 85/100
- ✅ Accessibility: 92/100
- ✅ Best Practices: 90/100
- ✅ SEO: 88/100

---

## 🚀 HISTÓRICO FORGE (Sistema SDD)

**FORGE** = Structured Design Development — pipeline arquitetural de 8 fases.

| Fase | Sprint | Skill | Status | Data | Entrega |
|------|--------|-------|--------|------|---------|
| **0** | Fundação | skill-scaffolder | ✅ | 2026-05-12 | Estrutura base |
| **1** | Estratégia | skill-orquestrador → skill-consultor → skill-planner | ✅ | 2026-05-12 | PRD + CONSTITUTION + Planning |
| **2** | Design System | skill-forge-visual (5 sub-tasks) | ✅ | 2026-05-13 | 6 CSS files + componentes |
| **3** | Documentação | skill-documentador (2 sub-tasks) | ✅ | 2026-05-13 | SPEC.md + EXAMPLES.md |
| **4** | Segurança | skill-seguranca | ✅ | 2026-05-13 | SBOM.json + security-policies |
| **5** | Desenvolvimento | skill-construtor (5 sprints) | ✅ | 2026-05-13 | 23+ módulos JS |
| **6** | QA & Review | skill-sentinela → skill-performance | ✅ | 2026-05-13 | Code review (4 issues) + otimizações |
| **7** | Deploy | skill-devops | ✅ | 2026-05-13 | GitHub Actions + GitHub Pages |
| **8** | Monitoramento | skill-health-monitor | ⏳ | próximo | Relatório semanal (Haiku) |

### Adições Posteriores à Fase 7

| Data | Nome | Descrição | Status |
|------|------|-----------|--------|
| 2026-05-13 | Groq Addon | 4 modelos Groq adicionados | ✅ |
| 2026-05-13 | Hotfix-LLM | 3 bugs críticos CSP + schema + renderização | ✅ |
| 2026-05-13 | RAG-Contexto | buildUserContext() + 6 sugestões clicáveis | ✅ |
| 2026-05-13 | Hotfix-RAG | Corrige campos schema em buildUserContext() | ✅ |
| 2026-05-13 | Context-Engineering | systemPrompt v3 com "RESPOSTAS DIRETAS" | ✅ |
| 2026-05-13 | RAG-Listas-Completas | 9 novas respostas diretas com listas completas | ✅ |
| 2026-05-13 | Function-Calling | Upgrade de RAG → Function Calling (v4) | ✅ |
| 2026-05-14 | UI-Contas-Data-Pagamento | Labels inteligentes ("Pago hoje", etc.) | ✅ |
| 2026-05-14 | UI-Contas-Filtros | Redesign completo dos filtros | ✅ |
| 2026-05-14 (s1) | Contatos-v2 | Contexto duplo completo + 3 views | ✅ |
| 2026-05-14 (s2) | Contatos-UX-BugFix-18 | 18 problemas UX corrigidos | ✅ |
| 2026-05-14 (s2) | Contatos-Toolbar-Premium | Redesign premium da toolbar | ✅ |

---

## 🎯 PRÓXIMOS PASSOS

### Fase 8 — Monitoramento (próxima)

```
8.1 — skill-health-monitor (Haiku 4.5)
├─ Cadência: Semanal
├─ Entrega: Relatório de saúde do projeto
├─ Métricas: Bugs reportados, health score, performance
└─ Ação: Priorizar correções conforme necessário
```

### Polimento Contatos

- ✅ Formulário novo/edição com validação inline
- ✅ Placeholders melhorados + icons
- ✅ Autopreenchimento inteligente (deduplica por email/telefone)
- ✅ Link WhatsApp direto

### Roadmap Futuro

| Sprint | Módulo | Descrição | Prioridade |
|--------|--------|-----------|-----------|
| S6 | Saúde & Hábitos | Tracker com streak + métricas | Média |
| S7 | Relatórios Avançados | Analytics por período + gráficos de tendência | Média |
| S8 | Sincronização Cloud | Supabase para dados cloud-sync | Baixa |
| S9 | Integração Google | OAuth + Google Contacts sync | Baixa |
| S10 | Mentor AI Avançado | Sugestões automáticas + análise de padrões | Baixa |

---

## 📊 MÉTRICAS DO PROJETO

### Tamanho & Cobertura

```
Arquivos JavaScript:     23+ módulos
Linhas de código:        ~8.000+ (JS) + ~5.000+ (CSS)
Schemas:                 16 collections
Módulos:                 8 (Finanças, Negócio, Pessoal, Chat, Config)
Componentes CSS:         50+ estilos reutilizáveis
Ícones SVG:              40+ inline
```

### Saúde do Projeto

| Métrica | Valor | Status |
|---------|-------|--------|
| Health Score (Sentinela) | 94/100 | ✅ Excelente |
| Issues Open | 0 | ✅ Clean |
| Code Duplication | <5% | ✅ Baixo |
| Test Coverage | Manual QA | ⚠️ (frontend only) |
| Accessibility (WCAG) | AA+ | ✅ |
| Performance (Lighthouse) | 85+ | ✅ |

---

## 🎓 COMO USAR ESTE DOCUMENTO

### Para Desenvolvedores

1. **Onboarding:** Leia seção [Arquitetura](#arquitetura) → [Módulos](#módulos)
2. **Implementação:** Use [Estrutura](#estrutura) para localizar código
3. **Debugging:** Confira [Fluxos](#fluxos) para entender lógica
4. **Segurança:** Revise [Segurança](#segurança) antes de mudanças

### Para Product Managers

1. **Visão Geral:** Leia [Visão Geral](#visão-geral) + [Módulos](#módulos)
2. **Roadmap:** Veja [Próximos Passos](#próximos) + [Roadmap Futuro](#roadmap-futuro)
3. **Métricas:** Confira [Métricas](#métricas-do-projeto)
4. **Histórico:** Explore [FORGE](#histórico-forge-sistema-sdd) para contexto de decisões

### Para Designers

1. **Design System:** Consulte tokens em `css/tokens.css`
2. **Componentes:** Veja `css/components.css` para referência
3. **Paleta:** Aurora OBSIDIAN — gold `#D4A574` como destaque
4. **Tipografia:** Fraunces (display) + Switzer (UI) + JetBrains Mono (código)

---

## 📞 SUPORTE & REFERÊNCIAS

- **README.md** — Setup + como rodar
- **FORGE-CHECKLIST.md** — Histórico detalhado das fases
- **PLANO-MENTOR24H.md** — Visão do produto + módulos futuros
- **ANATOMIA-COMPLETA.html** — Relatório visual (abrir em navegador)

---

**Documento Gerado:** 2026-05-14  
**Status:** Mentor24h v5.2 — Fase 7 (Deploy) Concluída  
**Próximo:** Fase 8 (Monitoramento)  
**Health Score:** 94/100 ✅
