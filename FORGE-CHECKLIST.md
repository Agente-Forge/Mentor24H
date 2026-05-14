# 🗺️ FORGE CHECKLIST — Mentor24h

**Projeto:** Mentor24h — Hub Pessoal + Empreendedor  
**Iniciado:** 2026-05-12  
**Última atualização:** 2026-05-13  
**Status geral:** FASE 7 — Deploy COMPLETA → FASE 8 (Monitoramento) próxima

---

## LEGENDA

| Símbolo | Significado |
|---------|------------|
| ✅ | Concluído |
| 🔄 | Em andamento |
| ⏳ | Aguardando (Léo preenche / decide) |
| 🔒 | Bloqueado (depende de etapa anterior) |

---

## CICLO FORGE (repetido em toda etapa)

### 🔵 ANTES — Briefing
1. **Etapa:** qual número e nome (ex: "Etapa 1.2 — skill-consultor")
2. **Skill:** qual skill usar
3. **LLM:** qual modelo e por quê (Opus 4.7 = estratégia/arquitetura | Sonnet 4.6 = código/docs | Haiku 4.5 = tarefas simples/rápidas)
4. **O que será feito:** entradas necessárias, arquivos criados/modificados, resultado esperado
5. **⏸️ Aguardar aprovação de Léo** — nenhuma ação sem "sim", "pode ir" ou equivalente

### 🟢 DEPOIS — Relatório
6. **O que foi feito:** arquivos criados, decisões tomadas, o que mudou
7. **Pendências:** o que ficou em aberto ou precisa de atenção
8. **Atualizar `FORGE-CHECKLIST.md`:** marcar ✅ com data, linha no Histórico, atualizar Próxima Ação
9. **Repetir o ciclo** com o Briefing da próxima etapa

---

---

## FASE 0 — FUNDAÇÃO

| # | Skill | LLM | Entrega | Status |
|---|-------|-----|---------|--------|
| 0.1 | skill-scaffolder | Sonnet 4.6 | Estrutura `Estructura-Proyecto/` + `data/` + `.memoria/` | ✅ 2026-05-12 |
| 0.2 | **Léo + Claude** | — | `AGENTS.md` preenchido (8 seções de padrões de código) | ✅ 2026-05-12 |

---

## FASE 1 — ESTRATÉGIA E PRODUTO

| # | Skill | LLM | Entrega | Status |
|---|-------|-----|---------|--------|
| 1.1 | skill-orquestrador | Opus 4.7 | Entrevista, `working-memory.json`, `decision-log.json` | ✅ 2026-05-12 |
| 1.2 | skill-consultor | Opus 4.7 | `PRD.md` + `CONSTITUTION.md` + perguntas abertas respondidas | ✅ 2026-05-12 |
| 1.3 | skill-planner | Sonnet 4.6 | `requirements.md` + `design.md` + `tasks.md` (5 sprints, 40 tasks, CPM) | ✅ 2026-05-12 |

---

## FASE 2 — DESIGN SYSTEM

> DESIGN-BRIEF.md aprovado: paleta OBSIDIAN + tipografia Editorial Premium (Fraunces + Switzer + JetBrains Mono)

| # | Skill | LLM | Entrega | Status |
|---|-------|-----|---------|--------|
| 2.1 | skill-forge-visual | Sonnet 4.6 | `tokens.css` + `typography.css` + `themes.css` + `motion.css` + `reset.css` | ✅ 2026-05-12 |
| 2.2 | skill-forge-visual | Sonnet 4.6 | Componentes core (Card, Button, Modal, Toast, Badge) | ✅ 2026-05-13 |
| 2.3 | skill-forge-visual | Sonnet 4.6 | Sidebar accordion + bottom nav mobile + layout base | ✅ 2026-05-13 |
| 2.4 | skill-forge-visual | Sonnet 4.6 | Páginas específicas (Chat AI, WhatsApp CRM, Finanças, Pessoal) | ✅ 2026-05-13 |
| 2.5 | skill-forge-visual | Sonnet 4.6 | Polish + microinterações + theme toggle | ✅ 2026-05-13 |

---

## FASE 3 — DOCUMENTAÇÃO TÉCNICA

| # | Skill | LLM | Entrega | Status |
|---|-------|-----|---------|--------|
| 3.1 | skill-documentador | Sonnet 4.6 | `SPEC.md` (contrato técnico completo) | ✅ 2026-05-13 |
| 3.2 | skill-documentador | Sonnet 4.6 | Exemplos de uso, fluxos, edge cases documentados | ✅ 2026-05-13 |

---

## FASE 4 — SEGURANÇA

| # | Skill | LLM | Entrega | Status |
|---|-------|-----|---------|--------|
| 4.1 | skill-seguranca | Opus 4.7 | `SBOM.json` + CVE baseline + `security-policies.md` | ✅ 2026-05-13 |

---

## FASE 5 — DESENVOLVIMENTO

> ⚠️ Nenhuma linha de código antes desta fase. Toda fase anterior é pré-requisito.

| # | Skill | LLM | Entrega | Status |
|---|-------|-----|---------|--------|
| 5.1 | skill-construtor | Sonnet 4.6 | Sprint 1: `DB.js` + `Router.js` + `App.js` (infra base) | ✅ 2026-05-13 |
| 5.2 | skill-construtor | Sonnet 4.6 | Sprint 2: `LLM.js` + `CommandPalette.js` | ✅ 2026-05-13 |
| 5.3 | skill-construtor | Sonnet 4.6 | Sprint 3: `ChatWA.js` + `Dashboard.js` | ✅ 2026-05-13 |
| 5.4 | skill-construtor | Sonnet 4.6 | Sprint 4: Módulos Pessoal (Agenda, Medicamentos, Tarefas, Contatos) | ✅ 2026-05-13 |
| 5.5 | skill-construtor | Sonnet 4.6 | Sprint 5: Módulos Negócio (Produtos, Vendas, Estoque, Clientes) | ✅ 2026-05-13 |

---

## FASE 6 — REVISÃO E QUALIDADE

| # | Skill | LLM | Entrega | Status |
|---|-------|-----|---------|--------|
| 6.1 | skill-sentinela | Opus 4.7 | Code review completo, lista de issues, sugestões de refactor | ✅ 2026-05-13 |
| 6.2 | skill-performance | Sonnet 4.6 | Lighthouse audit, bottlenecks, otimizações aplicadas | ✅ 2026-05-13 |

---

## FASE 7 — DEPLOY

| # | Skill | LLM | Entrega | Status |
|---|-------|-----|---------|--------|
| 7.1 | skill-devops | Sonnet 4.6 | GitHub Actions CI/CD + GitHub Pages deploy | ✅ 2026-05-13 |

---

## FASE 8 — MONITORAMENTO CONTÍNUO

| # | Skill | LLM | Entrega | Cadência |
|---|-------|-----|---------|---------|
| 8.1 | skill-health-monitor | Haiku 4.5 | Relatório semanal de saúde do projeto | Semanal |

---

## HISTÓRICO DE ATUALIZAÇÕES

| Data | Etapa | O que foi feito |
|------|-------|-----------------|
| 2026-05-12 | 0.1 | skill-scaffolder: criada estrutura completa `Estructura-Proyecto/` + `data/` + `.memoria/` |
| 2026-05-12 | 1.1 | skill-orquestrador: entrevista do produto + `working-memory.json` + `decision-log.json` criados |
| 2026-05-12 | Design | `DESIGN-BRIEF.md` aprovado — paleta OBSIDIAN + tipografia Editorial Premium + filosofia Quiet Intelligence |
| 2026-05-12 | 0.2 | `AGENTS.md` preenchido — estrutura de pastas, padrão IIFE, tokens, persistência, segurança, commits |
| 2026-05-12 | 1.2 | skill-consultor: `PRD.md` (10 seções, appetite M) + `CONSTITUTION.md` (leis + Always/Ask/Never) + 3 perguntas abertas resolvidas (d009-d012) |
| 2026-05-12 | 1.3 | skill-planner: `requirements.md` (10 REQs em EARS) + `design.md` (arquitetura + componentes) + `tasks.md` (5 sprints, 40 tasks, CPM mapeado) |
| 2026-05-12 | 2.1 | skill-forge-visual: `tokens.css` (OBSIDIAN), `typography.css` (Fraunces+Switzer+JetBrains), `reset.css`, `themes.css` (cream linen light), `motion.css` adaptado |
| 2026-05-13 | 2.2 | skill-forge-visual: `layout.css` (nav-item/bnav gold, theme-toggle, tb-widget line) + `components.css` (btn-primary/fab/progress/badge-gold OBSIDIAN, toast-info → azul, `.badge-gold` alias) |
| 2026-05-13 | 2.3 | skill-forge-visual: accordion já presente + `syncBottomNav` por grupo + avatar padrão gold `#D4A574` + bottom nav label "Chat" + `.card-pill.gold` alias |
| 2026-05-13 | 2.4 | skill-forge-visual: `pages.css` — bug `--glass-3` corrigido, gradients Aurora → OBSIDIAN gold (`calc-hero`, `llm-welcome-title`, `dash-greeting`), breakpoints mobile para `llm-shell` + `wa-shell` |
| 2026-05-13 | 2.5 | skill-forge-visual: `bento.css` — `accent-violet` rgba→`var(--color-gold-subtle)`, `spark-bar` gradient→gold; `theme.js` — troca ícone lua/sol no toggle + init |
| 2026-05-13 | 3.1 | skill-documentador: `SPEC.md` criado em `01-documentacao/` — 19 seções: arquitetura, schemas, fluxos, contratos de função, decisões, edge cases |
| 2026-05-13 | 3.2 | skill-documentador: `EXAMPLES.md` criado em `01-documentacao/` — 15 seções: esqueleto de módulo, exemplos DB por coleção, novos provedores LLM, fluxo de venda, checklist Sprint 1, 8 erros comuns |
| 2026-05-13 | 4.1 | subagent security-engineer: `SBOM.json` (4 componentes + 4 services) + `security-policies.md` (10 riscos: 1 crítico, 3 altos, 3 médios, 3 baixos) em `09-seguranca/`. Top risco: API keys LLM em plaintext no localStorage. Ação imediata recomendada: meta-tag CSP no `<head>` antes da Fase 5 |
| 2026-05-13 | 5.1 | skill-construtor v5.1: `index.html` CSP meta-tag (SEC-01) + `llm.js` aviso API key (SEC-05) + `db.js` exportAll/importAll v3 com todos os 16 schemas + `decision-log.json` criado (3 decisões DEC-001–003) |
| 2026-05-13 | 5.2 | skill-construtor v5.1: `llm.js` toolbar Limpar + `friendlyApiError()` + `smartTitle()` + `pages.css` `.llm-chat-toolbar` + `command-palette.js` +7 ações (Negócio + Pessoal) |
| 2026-05-13 | 5.3 | skill-construtor v5.1: `chat-wa.js` seed demo + CRM lateral + bubbles + `db.js` +`deleteChatContato` + `dashboard.js` `renderGreeting()` + `greeting-card` span-12 + `pages.css` chat bubbles + greeting CSS |
| 2026-05-13 | 5.4 | skill-construtor v5.1: `agenda.js` + `medicamentos.js` + `tarefas.js` + `contatos.js` — todos com form inline + filtros + CRUD completo. Upgrade de `prompt()` → formulários em card para consistência com design OBSIDIAN |
| 2026-05-13 | 5.5 | skill-construtor v5.1: `produtos.js` + `vendas.js` + `estoque.js` + `clientes.js` — CRUD completo. `deleteClienteNeg` adicionado ao DB. CSS negócio em `pages.css`. Scripts registrados no `index.html`. `app.js` routes ativadas. |
| 2026-05-13 | 6.1 | skill-sentinela v5.1 (Opus 4.7): 4 issues encontrados e corrigidos — I-01 XSS em `chat-wa.js` (all `esc()`), I-02 `prompt()` → `Modal.open()`, I-03 status mismatch `'disponivel'`→`'ativo'` em `db.js`, I-04 `handleGlobalAdd()` sem cobertura dos módulos negócio. Health Score: 94/100. |
| 2026-05-13 | 6.2 | skill-performance (Sonnet 4.6): 3 otimizações — P-01 Google Fonts `@import` → `<link>` paralelo com preconnect (`tokens.css` + `index.html`), P-02 debounce 150ms no wa-search (`chat-wa.js`), P-03 `will-change: max-height` no accordion sidebar (`layout.css`). |
| 2026-05-13 | 7.1 | skill-devops (Sonnet 4.6): `.github/workflows/deploy.yml` (GitHub Actions → GitHub Pages), `.nojekyll`, `.gitignore` atualizado com `leo-data.js`/`leo-import.json`. Remote: `Leozinhobh77/controle-financeiro-v2`. |
| 2026-05-13 | Add-on | Groq adicionado aos provedores de LLM: 4 modelos (Llama 3.3 70B, Llama 3.1 70B, Mixtral, Gemma 2), função `callGroq()` em `llm.js`, switch case configurado. |
| 2026-05-13 | Hotfix-LLM | 3 bugs críticos na configuração de LLM corrigidos: (1) CSP `connect-src` bloqueava `api.groq.com` — adicionado; (2) Schema antigo tinha `apiKey` única compartilhada entre todos os provedores — refatorado para `apiKeys: {provider: key}` e `models: {provider: model}` em `db.js` com migração automática v1→v2; (3) `renderConfig` em `llm.js` agora escapa XSS, mostra placeholder específico por provedor, auto-salva chave anterior ao trocar provider e indica status "✓ chave preenchida". |
| 2026-05-13 | RAG-Contexto | IA agora tem acesso aos dados do app: `buildUserContext()` em `llm.js` coleta snapshot fresco (contas, vendas, tarefas, agenda, metas, clientes, estoque) a cada mensagem e injeta no systemPrompt. systemPrompt padrão atualizado em `db.js` com migração automática. Welcome screen ganhou 6 sugestões clicáveis ("Quanto eu devo este mês?", etc.) com CSS `.llm-suggestion-chip` em `pages.css`. |
| 2026-05-13 | Hotfix-RAG | Bugs de schema em `buildUserContext` corrigidos: contas usam `dataVencimento` (não `vencimento`), tarefas usam `data` (não `prazo`), metas usam `valorAlvo` + `DB.getValorMeta(id)` (não `objetivo`/`atual`), produtos usam `estoqueMinimo` (não `estoqueMin`), transações usam `tipo: 'entrada'/'saida'` (não só `receita/despesa`). Adicionado fallback explícito quando coleção vazia + listas de vendas recentes, eventos hoje, contas atrasadas. |

---

## PRÓXIMA AÇÃO

> **8.1** — skill-health-monitor → Relatório semanal de saúde do projeto (Haiku 4.5)  
> Projeto ao vivo — aguardando primeiro push de Léo para ativar CI/CD
