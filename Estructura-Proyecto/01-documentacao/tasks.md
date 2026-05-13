# tasks.md — Mentor24h
**Forge v5.2** | Appetite: M (4-6 semanas) | 5 Sprints | 40 Tasks  
Gerado por: skill-planner v5.1 | **Data:** 2026-05-12

---

## 🎲 BETTING TABLE GERAL

```
Estamos apostando 5 semanas de trabalho no MVP do Mentor24h.
Appetite: M — 4-6 semanas
Sprints: 5 × ~1 semana
Tasks: 40 tasks atômicas (máx. 2h cada)

Escopo apostado:
✅ Sprint 1 — Fundação (DB + Router + App)
✅ Sprint 2 — Design System + Navegação
✅ Sprint 3 — Dashboard + Chat AI
✅ Sprint 4 — Módulos Pessoal
✅ Sprint 5 — Finanças + WhatsApp + Polish

Fora da aposta (Fase 2+):
❌ Auth/Login
❌ Supabase/banco remoto
❌ WhatsApp Business API real
❌ Módulos de Negócio (Produtos, Vendas, Estoque, Clientes)
```

---

## SPRINT 1 — Fundação

### 🎲 BETTING TABLE — Sprint 1

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎲 Sprint 1 — Apostamos ~1 semana em:
   Estrutura de pastas + DB + Router + App.js
Risco: DB precisa estar 100% antes das outras sprints
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Objetivo:** Infraestrutura base funcionando. Navegar entre páginas, dados persistindo.  
**Dependências:** nenhuma — é o ponto de partida  
**Critério de done da sprint:** `Router.navigate('dashboard')` funciona + DB salva e lê dados

---

### Tasks

- [ ] **T1.1** — Criar estrutura de pastas `js/core/`, `js/modules/`, `js/utils/`, `css/` — [XS]
  - Arquivos alvo: estrutura de diretórios no projeto
  - Critério de done: pastas existem, `index.html` referencia os arquivos novos
  - Ref: design.md (Estrutura de Arquivos Final)

- [ ] **T1.2** — Criar `js/core/db.js` com CRUD base e 13 collections — [M]
  - Arquivos alvo: `js/core/db.js`
  - Critério de done: `DB.add()`, `DB.get()`, `DB.update()`, `DB.remove()` funcionam + dados persistem no F5
  - Ref: design.md COMP-001, requirements.md REQ-001 ao REQ-010

- [ ] **T1.3** — Criar `js/core/router.js` com 17 páginas registradas — [S]
  - Arquivos alvo: `js/core/router.js`
  - Critério de done: `Router.navigate('agenda')` troca a página ativa corretamente
  - Ref: design.md COMP-002

- [ ] **T1.4** — Criar `js/utils/utils.js` com helpers base (`escapeHtml`, `formatCurrency`, `formatDate`, `generateId`) — [S]
  - Arquivos alvo: `js/utils/utils.js`
  - Critério de done: `escapeHtml('<script>')` retorna `&lt;script&gt;`
  - Ref: AGENTS.md §5.2, CONSTITUTION.md SEC-2

- [ ] **T1.5** — Criar `js/utils/icons.js` com helpers Lucide — [S]
  - Arquivos alvo: `js/utils/icons.js`
  - Critério de done: `Icons.render()` substitui `data-lucide` por SVGs na página

- [ ] **T1.6** — Criar `js/core/app.js` com init e registro de todos os módulos — [S]
  - Arquivos alvo: `js/core/app.js`
  - Critério de done: app inicializa sem erros no console, todas as páginas placeholder registradas
  - Ref: design.md DEC-001

- [ ] **T1.7** — Criar `index.html` reestruturado com sidebar groups e todas as seções de página — [M]
  - Arquivos alvo: `index.html`
  - Critério de done: HTML válido, sidebar com 4 grupos (Chat, Negócio, Finanças, Pessoal), 17 seções `.page`
  - Ref: design.md (arquitetura)

- [ ] **T1.8** — Criar `css/reset.css` e vincular no index.html com Lucide + Google Fonts — [XS]
  - Arquivos alvo: `css/reset.css`, `index.html` (head)
  - Critério de done: browser carrega Fraunces + Switzer + JetBrains Mono + Lucide sem erros

---

## SPRINT 2 — Design System + Navegação

### 🎲 BETTING TABLE — Sprint 2

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎲 Sprint 2 — Apostamos ~1 semana em:
   Design System OBSIDIAN + Sidebar + Componentes + Command Palette
Risco: CSS é iterativo — ajustes visuais podem estourar o tempo
Mitigação: tokens.css como base rígida; ajustes finos ficam para Sprint 5
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Objetivo:** App visualmente OBSIDIAN, sidebar accordion funcional, componentes reutilizáveis.  
**Dependências:** Sprint 1 concluída (index.html + estrutura de pastas)  
**Critério de done da sprint:** Sidebar abre/fecha, paleta OBSIDIAN aplicada, Ctrl+K abre Command Palette

---

### Tasks

- [ ] **T2.1** — Criar `css/tokens.css` com paleta OBSIDIAN completa, espaçamento e variáveis de raio — [S]
  - Arquivos alvo: `css/tokens.css`
  - Critério de done: todas as variáveis do AGENTS.md §2.1 definidas; mudar `--color-gold` reflete no app inteiro
  - Ref: AGENTS.md §2.1, DESIGN-BRIEF.md

- [ ] **T2.2** — Criar `css/typography.css` com escala tipográfica Fraunces + Switzer + JetBrains Mono — [S]
  - Arquivos alvo: `css/typography.css`
  - Critério de done: `font-family: var(--font-display)` renderiza Fraunces; `--font-mono` renderiza JetBrains Mono

- [ ] **T2.3** — Criar `css/layout.css` com sidebar accordion CSS puro + bottom nav mobile — [M]
  - Arquivos alvo: `css/layout.css`
  - Critério de done: grupos da sidebar abrem/fecham com animação suave; bottom nav aparece em < 768px
  - Ref: design.md DEC-003

- [ ] **T2.4** — Criar `css/components.css` com `.btn`, `.card`, `.badge`, `.input`, `.modal`, `.toast` — [M]
  - Arquivos alvo: `css/components.css`
  - Critério de done: componentes renderizam corretamente; `.btn-primary` usa `--color-gold`

- [ ] **T2.5** — Criar `css/themes.css` com variáveis do tema claro e toggle funcional — [S]
  - Arquivos alvo: `css/themes.css`
  - Critério de done: `document.body.classList.toggle('light')` alterna tema; contraste WCAG AA no tema claro

- [ ] **T2.6** — Criar `js/utils/command-palette.js` com Ctrl+K, navegação por teclado e filtro — [M]
  - Arquivos alvo: `js/utils/command-palette.js`
  - Critério de done: Ctrl+K abre; ESC fecha; ↑↓ navegam; Enter executa ação; busca filtra em tempo real
  - Ref: requirements.md REQ-009, design.md COMP-005

- [ ] **T2.7** — Adicionar Modal e Toast como utils globais — [S]
  - Arquivos alvo: `js/utils/utils.js` (adicionar Modal e Toast)
  - Critério de done: `Toast.success('ok')` exibe notificação que some em 3s; `Modal.open(id)` abre modal

- [ ] **T2.8** — Vincular theme toggle ao botão na sidebar/header + salvar preferência — [XS]
  - Arquivos alvo: `index.html`, `js/core/app.js`
  - Critério de done: botão alterna tema; preferência persiste no F5 (via `mentor24h.config`)
  - Ref: requirements.md REQ-010

---

## SPRINT 3 — Dashboard + Chat AI

### 🎲 BETTING TABLE — Sprint 3

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎲 Sprint 3 — Apostamos ~1 semana em:
   Dashboard inteligente + Chat AI multi-provider
Risco: LLM.js é a task mais complexa — APIs externas variáveis
Mitigação: OpenRouter é o provider default; outros são fallback
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Objetivo:** Dashboard com cards dinâmicos. Chat AI funcional com OpenRouter.  
**Dependências:** Sprint 1 (DB + Router) + Sprint 2 (componentes para Modal/Toast)  
**Critério de done da sprint:** Dashboard exibe cards reais + Chat AI responde com OpenRouter configurado

---

### Tasks

- [ ] **T3.1** — Criar `js/modules/dashboard.js` com saudação contextual — [S]
  - Arquivos alvo: `js/modules/dashboard.js`
  - Critério de done: "Bom dia/tarde/noite, Léo." aparece com horário correto
  - Ref: requirements.md REQ-001

- [ ] **T3.2** — Implementar `buildCards()` no dashboard — cards dinâmicos de medicamentos e agenda — [M]
  - Arquivos alvo: `js/modules/dashboard.js`
  - Critério de done: card de medicamentos aparece se há medicamentos hoje; desaparece se não há dados
  - Ref: requirements.md REQ-001, design.md COMP-004

- [ ] **T3.3** — Implementar cards de tarefas e finanças no Dashboard — [S]
  - Arquivos alvo: `js/modules/dashboard.js`
  - Critério de done: card de tarefas mostra as de alta prioridade; card de finanças mostra saldo total

- [ ] **T3.4** — Criar `js/modules/llm.js` com estrutura base e UI de chat — [M]
  - Arquivos alvo: `js/modules/llm.js`
  - Critério de done: página Chat AI renderiza: sidebar de conversas + área de mensagens + input
  - Ref: requirements.md REQ-002, design.md COMP-003

- [ ] **T3.5** — Implementar `callOpenRouter()` em llm.js — [M]
  - Arquivos alvo: `js/modules/llm.js`
  - Critério de done: com API key válida do OpenRouter, mensagem enviada retorna resposta da AI
  - Ref: requirements.md REQ-002

- [ ] **T3.6** — Implementar `callOpenAI()`, `callGemini()`, `callClaude()` em llm.js — [S]
  - Arquivos alvo: `js/modules/llm.js`
  - Critério de done: trocar provider na config e enviar mensagem usa o provider correto

- [ ] **T3.7** — Histórico de conversas no Chat AI (criar, listar, persistir) — [S]
  - Arquivos alvo: `js/modules/llm.js`
  - Critério de done: nova conversa cria entrada em `mentor24h.llm-conversas`; histórico carrega no F5

- [ ] **T3.8** — Criar `js/modules/config.js` com seção de configuração de LLM — [S]
  - Arquivos alvo: `js/modules/config.js`
  - Critério de done: usuário salva API key + provider + modelo em `mentor24h.llm-config`; sem revelar key em texto visível

---

## SPRINT 4 — Módulos Pessoal

### 🎲 BETTING TABLE — Sprint 4

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎲 Sprint 4 — Apostamos ~1 semana em:
   4 módulos pessoais: Agenda, Medicamentos, Tarefas, Contatos
Risco: 4 módulos em 1 sprint — ritmo alto
Mitigação: todos seguem o mesmo padrão CRUD; templates reutilizáveis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Objetivo:** Todos os 4 módulos pessoais com CRUD completo.  
**Dependências:** Sprint 1 (DB + Router) + Sprint 2 (Modal, Toast, componentes)  
**Critério de done da sprint:** Criar, editar e deletar funciona nos 4 módulos; dados aparecem no Dashboard

---

### Tasks

- [ ] **T4.1** — Criar `js/modules/agenda.js` com CRUD de eventos — [S]
  - Arquivos alvo: `js/modules/agenda.js`
  - Critério de done: criar evento → aparece na lista; editar → atualiza; deletar → some com confirmação
  - Ref: requirements.md REQ-004

- [ ] **T4.2** — Integrar Agenda ao Dashboard (card de próximo evento hoje) — [XS]
  - Arquivos alvo: `js/modules/dashboard.js`
  - Critério de done: evento de hoje aparece no card do Dashboard

- [ ] **T4.3** — Criar `js/modules/medicamentos.js` com CRUD e marcar como tomado — [S]
  - Arquivos alvo: `js/modules/medicamentos.js`
  - Critério de done: medicamento cadastrado → botão "Tomei" → registra dose com timestamp
  - Ref: requirements.md REQ-005

- [ ] **T4.4** — Integrar Medicamentos ao Dashboard (card com pendentes do dia) — [XS]
  - Arquivos alvo: `js/modules/dashboard.js`
  - Critério de done: medicamentos não tomados hoje aparecem no card; "Tudo em dia" quando todos tomados

- [ ] **T4.5** — Criar `js/modules/tarefas.js` com CRUD, prioridade e status — [S]
  - Arquivos alvo: `js/modules/tarefas.js`
  - Critério de done: filtro por status funciona; ordenação por prioridade (alta primeiro)
  - Ref: requirements.md REQ-006

- [ ] **T4.6** — Criar `js/modules/contatos.js` com CRUD e busca por nome — [S]
  - Arquivos alvo: `js/modules/contatos.js`
  - Critério de done: busca filtra em tempo real conforme usuário digita
  - Ref: requirements.md REQ-007

- [ ] **T4.7** — Criar `css/pages.css` com estilos dos 4 módulos pessoais — [S]
  - Arquivos alvo: `css/pages.css`
  - Critério de done: listas, formulários e detalhes dos 4 módulos com visual OBSIDIAN consistente

- [ ] **T4.8** — Registrar actions dos 4 módulos no Command Palette — [XS]
  - Arquivos alvo: `js/utils/command-palette.js`, `js/core/app.js`
  - Critério de done: Ctrl+K → "nova tarefa" → abre modal de nova tarefa

---

## SPRINT 5 — Finanças + WhatsApp + Polish

### 🎲 BETTING TABLE — Sprint 5

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎲 Sprint 5 — Apostamos ~1 semana em:
   Módulos de Finanças + WhatsApp CRM + Polish final
Risco: WhatsApp tem layout mais complexo (3 colunas)
Mitigação: Finanças primeiro (padrão CRUD já dominado); WhatsApp ao final
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Objetivo:** Finanças funcionais + WhatsApp CRM completo + polish visual.  
**Dependências:** Sprint 1 (DB) + Sprint 2 (componentes) + Sprint 4 (padrão CRUD consolidado)  
**Critério de done da sprint:** MVP completo — todas as features do PRD funcionando

---

### Tasks

- [ ] **T5.1** — Criar `js/modules/contas.js` com CRUD de contas bancárias — [S]
  - Arquivos alvo: `js/modules/contas.js`
  - Critério de done: criar conta → saldo exibido; saldo negativo destacado em `--color-error`
  - Ref: requirements.md REQ-008

- [ ] **T5.2** — Criar `js/modules/transacoes.js` com CRUD e atualização de saldo — [M]
  - Arquivos alvo: `js/modules/transacoes.js`
  - Critério de done: nova transação (receita/despesa) → saldo da conta atualiza automaticamente
  - Ref: requirements.md REQ-008

- [ ] **T5.3** — Criar `js/modules/metas.js` com CRUD e barra de progresso — [S]
  - Arquivos alvo: `js/modules/metas.js`
  - Critério de done: meta com valor-alvo e valor atual exibe % de progresso; 80%+ usa `--color-warning`
  - Ref: requirements.md REQ-008

- [ ] **T5.4** — Criar `js/modules/kanban.js` com colunas de planejamento financeiro — [S]
  - Arquivos alvo: `js/modules/kanban.js`
  - Critério de done: cards movem entre colunas (A fazer / Em andamento / Concluído)

- [ ] **T5.5** — Criar `js/modules/chat-wa.js` com lista de contatos e conversa simulada — [M]
  - Arquivos alvo: `js/modules/chat-wa.js`
  - Critério de done: lista de contatos CRM + clicar abre conversa + balões estilo WhatsApp
  - Ref: requirements.md REQ-003

- [ ] **T5.6** — Implementar CRM lateral e busca de contatos no chat-wa.js — [S]
  - Arquivos alvo: `js/modules/chat-wa.js`
  - Critério de done: painel CRM aparece ao lado da conversa (desktop); busca filtra contatos em tempo real
  - Ref: requirements.md REQ-003

- [ ] **T5.7** — Adicionar Export JSON em Config + aviso de uso do localStorage — [S]
  - Arquivos alvo: `js/modules/config.js`
  - Critério de done: botão "Exportar dados" faz download de `mentor24h-backup.json`; barra de uso exibe % usado
  - Ref: CONSTITUTION.md SEC-5, requirements.md (Req. Não-Funcionais)

- [ ] **T5.8** — Polish: microinterações, motion.css, revisão de contraste e responsividade mobile — [M]
  - Arquivos alvo: `css/tokens.css` (motion vars), todos os `.css`
  - Critério de done: Lighthouse ≥ 90 em Performance + Accessibility; app funcional em 375px
  - Ref: DESIGN-BRIEF.md (microinterações), PRD.md §5 (critérios de sucesso)

---

## Caminho Crítico (CPM)

```
🔗 [DEPENDÊNCIAS — MENTOR24H]

BLOQUEADORES (task B não inicia sem task A):
  T1.2 (DB) ──────────────────────────────→ todas as sprints 3, 4, 5
  T1.3 (Router) ───────────────────────────→ T2.3, T2.6 (navegação)
  T1.7 (index.html) ───────────────────────→ T2.1 (tokens.css precisa do HTML)
  T2.1 (tokens.css) ───────────────────────→ T2.4 (components precisam dos tokens)
  T2.4 (components) ───────────────────────→ T3.4 (LLM UI usa Modal/Toast)
  T3.4 (LLM UI) ───────────────────────────→ T3.5 (call API depende da UI existir)

PARALELIZÁVEIS (podem rodar ao mesmo tempo):
  T2.1 ‖ T2.2  (tokens + typography — independentes entre si)
  T4.1 ‖ T4.3 ‖ T4.5 ‖ T4.6  (4 módulos pessoais — mesmo padrão CRUD)
  T5.1 ‖ T5.3 ‖ T5.4  (contas, metas, kanban — independentes)

SPRINT CRÍTICA: Sprint 1
  → Maior densidade de bloqueadores
  → DB e Router devem estar perfeitos antes de qualquer outra sprint

CAMINHO CRÍTICO PRINCIPAL:
T1.2 → T3.4 → T3.5 → T3.6 → T3.7
(fundação → LLM UI → OpenRouter → outros providers → histórico)
```

---

## Checklist de Done por Sprint

| Sprint | Critério de Aceite Global |
|--------|--------------------------|
| Sprint 1 | `Router.navigate()` funciona + DB persiste dados no F5 |
| Sprint 2 | Paleta OBSIDIAN aplicada + Ctrl+K funcional |
| Sprint 3 | Dashboard com cards reais + AI responde com OpenRouter |
| Sprint 4 | 4 módulos pessoais com CRUD completo |
| Sprint 5 | MVP completo + Lighthouse ≥ 90 + Export JSON funcional |
