# 🗺️ FORGE CHECKLIST — Mentor24h

**Projeto:** Mentor24h — Hub Pessoal + Empreendedor  
**Iniciado:** 2026-05-12  
**Última atualização:** 2026-05-16 (sessão 4)  
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
| 2026-05-13 | Context-Engineering | IA somava errado ("quanto devo" = R$ 6.171 ao invés de R$ 6.817). Refatoração para Pre-computed Context + Direct Answers: (1) rótulos inequívocos (TOTAL ORIGINAL, JÁ PAGO, AINDA A PAGAR), (2) seção "RESPOSTAS DIRETAS" com Q&A pré-calculadas (16 perguntas comuns financeiro+negócio+pessoal+metas), (3) systemPrompt v3 reforça "NÃO faça aritmética, copie valores literais", (4) glossário de termos no header. Migração automática v1/v2→v3. |
| 2026-05-13 | RAG-Listas-Completas | IA sabia o número total de contas pendentes mas não conseguia listá-las ("quais contas falta pagar?" não funcionava). Expandidas listas no contexto: TODAS pendentes do mês (não só 15), TODAS atrasadas, TODAS pendentes futuras (até 30), TODOS clientes devendo, TODOS produtos com estoque baixo, TODAS tarefas pendentes/atrasadas/hoje/sem prazo, TODOS eventos da semana, TODOS medicamentos. Adicionadas 9 novas Respostas Diretas com listas explícitas ("Quais contas falta pagar?", "Liste fiados", "Liste tarefas pendentes", etc.). |
| 2026-05-13 | Function-Calling | Upgrade arquitetural: de RAG estático → Function Calling dinâmico. Novo arquivo `js/llm-tools.js` com 11 ferramentas (`getDataAtual`, `getContas`, `getResumoFinanceiroMes`, `getVendas`, `getClientes`, `getProdutos`, `getTarefas`, `getEventos`, `getMedicamentos`, `getMetas`, `getConfigUsuario`). Implementação para 5 providers (OpenAI/Groq/OpenRouter compartilham formato; Anthropic e Gemini têm formatos próprios). Loop de tool calling com até 6 iterações. `buildLightContext` substitui snapshot pesado — IA puxa dados sob demanda. systemPrompt v4 com migração automática v1/v2/v3→v4. Agora responde "mês passado", "dezembro", "essa semana", "contas para hoje" — qualquer query dinâmica. |
| 2026-05-14 | UI-Contas-Data-Pagamento | Enhancement em `js/contas.js`: cards de contas pagas exibem data de pagamento inteligente — "Pago hoje", "Pago ontem" ou "Pago em DD/MM/AAAA". Se pago após vencimento, badge exibe "· com atraso". Label de urgência suprimido para contas já pagas (sem conflito visual). Função `labelPagamento()` adicionada antes de `renderItem()`. |
| 2026-05-14 | UI-Contas-Filtros | Redesign completo dos filtros de Contas: (1) segmented control Dia/Semana/Mês/Intervalo, (2) navegador de período com ‹ › + label dinâmico ("Este mês", "Esta semana", "Hoje", "Ontem", etc.) + botão "Hoje" quando fora do período atual, (3) range personalizado com 4 presets (7 dias, 30 dias, mês atual, ano atual), (4) faixa de informações com contadores de pendentes/atrasadas/pagas, (5) filtros avançados (busca + status + tipo + categoria) com destaque visual quando ativos + botão "Limpar". Padrão de abertura: mês atual. Sem `.filter-bar` wrapper — `#contas-filtros` recebe `.contas-filtros-wrap` direto. |
| 2026-05-14 (s1) | Contatos-v2 | Módulo de Contatos completamente redesenhado — "Contexto Duplo". **db.js:** novo schema com `contextos[]`, `empresa`, `cargo`, `kanbanStage`, `googleResourceName`, `atualizadoEm`; `getContatos()` aceita filtros `{contexto, tag, busca}`. **contatos.js** (~540 linhas): 6 contextos (pessoal/trabalho/cliente/parceiro/fornecedor/família) com cores únicas, 3 views (Cards/Lista/Kanban), painel de detalhe slide-in, formulário com checkboxes de contexto, import vCard+CSV com drag-drop e detecção de duplicatas, export por contexto (.vcf/.csv/JSON), parser vCard 3.0 inline (suporta iPhone/Android/Google/Outlook), kanban de 4 estágios para clientes (prospect→ativo→inativo→arquivado), aniversários próximos (até 30 dias), integração Google Contacts OAuth (setup). **pages.css:** +500 linhas CSS enterprise — shell 3 colunas responsivo, detail panel slide-in, context badges com `color-mix()`, kanban cards, drop zones, export menu, import preview, form checkboxes estilizados. |

| 2026-05-14 (s2) | Contatos-UX-BugFix-18 | Auditoria de 18 problemas + correções completas em `contatos.js` + `pages.css`. **JS:** `data-contact-id` nos cards (detecção de ativo confiável), botão Fechar movido para direita com label "Fechar X", `abrirForm` sempre recria drawer (sem estado obsoleto), `_fecharDrawer` remove do DOM após animação, `_refreshToolbar` via DOM replacement (sem perda de event listeners), `_toggleSidebar` + backdrop mobile da sidebar, `_closeSidebarMobile` ao mudar filtro. **CSS:** bottom sheet detalhe com `translateY` (abre/fecha suave), handle visual no topo do sheet, backdrop usa `visibility` (transição fade correta), card actions visíveis em touch (`@media hover:none`), sidebar toggle + backdrop no mobile, `min-width:0` no content, kanban `minmax(160px,1fr)` sem min-width:720, `will-change:transform` no drawer, `safe-area-inset-bottom` no footer. |
| 2026-05-14 (s2) | Contatos-Toolbar-Premium | Redesign Premium da toolbar de Contatos. **Layout:** duas linhas no mobile (Row1: toggle+busca / Row2: views+ações) — uma linha no desktop. **Busca:** pill arredondado com ícone, foco glow violet, contagem de contatos quando vazia ("12 contatos" / "5 de 12" com filtro), botão limpar como X-circle. **View toggle:** substituído por segmented control (Cards/Lista/Kanban) com ícone + label — labels somem em ≤600px para economizar espaço. **Ações desktop:** Importar+Exportar com texto completo + "Novo contato" proeminente. **Ações mobile:** ícones compactos para import/export + botão "Novo" que não sai da tela. Sidebar toggle sempre visível no mobile. |
| 2026-05-15 | Temperatura-Contatos | **skill-construtor v5.1 (PAE #1):** Substituição completa do Kanban-Contatos pelo sistema Temperatura de Contatos. **contatos.js:** `STAGES` (4 estágios) → `TEMPS` (6 status: VIP/Quente/Morno/Lead/Frio/Inativo com hex OBSIDIAN + ícone); botão "Kanban" → "Temperatura" (icon: thermometer); `renderKanban()`+`kanbanCardHTML()` → `renderTemperatura()`+`tempCardHTML()`; `moverStage()` → `trocarTemperatura(id, temp)` com Toast + re-render; `_abrirTempMenu(e, id)` dropdown flutuante com overflow guard; painel de detalhe usa selector de temperatura para TODOS os contatos (removida restrição `contextos.includes('cliente')`); campo `temperatura` adicionado ao form state + `_salvarForm` (default: `'lead'`). **pages.css:** bloco `.ctto-kanban*`/`.ctto-kb-*` → `.ctto-temp*`: grid 6 colunas desktop, border-top 3px `var(--temp-cor)`, header Fraunces italic, `.ctto-temp-badge` com `color-mix()`, hover `translateY(-1px)` + `--shadow-elevated`, focus ring `var(--signature)`, `@keyframes fadeSlideIn` para dropdown; responsivo: 3 colunas em 768px, scroll-snap horizontal 6 colunas em ≤600px. **index.html:** cache-bust `?v=8` → `?v=9`. Kanban global (`js/kanban.js`) intocado. |
| 2026-05-16 | Sprint 1/3 — Dual-Mode | **skill-construtor v5.1 (PAE #2 entrada 1):** Implementação completa do sistema Dual-Mode Pessoal/Negócio. **index.html:** `data-mode="pessoal"` no `<html>`, modo switcher pill (`.modo-switcher`) no sidebar header com botões (user-circle/briefcase), `data-context="pessoal"` (Vida Pessoal + Finanças) e `data-context="negocio"` (Meu Negócio). **app.js:** `initModoSwitcher()` carrega localStorage mentor24h_modoAtivo (padrão 'pessoal') + event listeners nos botões; `applyMode(modo)` sincroniza data-mode, switcher visual, saudação header, visibilidade grupos via `display:none` condicional, navega para 'painel' em modo negócio. **layout.css:** `.modo-switcher` (flex gap 4px, bg var(--bg-surface), border-radius 100px), `.modo-btn` (padding 6px 12px, transition 240ms), `.modo-pessoal-btn.active` (bg `var(--signature)`), `.modo-negocio-btn.active` (bg `var(--info)`), focus ring 1.5px signature 3px offset, `html[data-mode="pessoal"] [data-context="negocio"] { display: none }`. Cache-bust `?v=8` → `?v=10`. |
| 2026-05-16 | Sprint 2/3 · P1 — Painel | **skill-construtor v5.1 (PAE #2 entrada 3):** Implementação do Painel Negócio com KPIs reais. **painel.js** (novo módulo IIFE): `calcularReceitaMes()` soma transações tipo 'receita' do mês atual; `calcularClientesAtivos()` conta contatos contexto 'cliente'; `calcularTemperaturaMedia()` retorna status mais frequente (VIP/Quente/Morno/Lead/Frio/Inativo); `getAtividadeRecente()` últimas 5 transações com valores + datas. `render()` exibe grid com 4 KPI cards (Receitas, Clientes, Temperatura, Em breve), seção atividade recente (transações com ícones receita/saída), estado vazio com mensagem "Nenhuma transação registrada". Classes semânticas: `.painel-negocio`, `.painel-kpi-grid`, `.painel-kpi-card`, `.painel-kpi-valor`, `.painel-kpi-label`, `.painel-atividade-item`. **index.html:** `<section data-page="painel">`, script `painel.js?v=10`, Router.register('painel'). **app.js:** applyMode('negocio') → `Router.navigate('painel')` auto-abre ao trocar modo; BNAV_GROUP['painel'] = 'vendas' para sincronização mobile. Cache-bust `?v=10`. |
| 2026-05-15 | Temperatura-Edge-Cases | **skill-construtor + skill-forge-visual (PAE #1 — fix):** 2 correções pós-auditoria. **(1) Cenário 4 — 6 colunas vazias:** `renderContent()` em `contatos.js` agora roteia `view === 'temperatura'` ANTES do guard `!lista.length` — view Temperatura sempre exibe 6 colunas mesmo sem contatos, com empty state elegante em cada coluna. **(2) Light mode focus ring:** `pages.css` `.ctto-tc-card:focus-visible` corrigido de `var(--signature, #D4A574)` → `var(--color-gold, #D4A574)` — usa o token correto que adapta automaticamente entre dark (#D4A574) e light (#9B6E3A), garantindo contraste WCAG em ambos os temas. |

| 2026-05-16 | Sprint2-P2-Visual-Negocio | **skill-forge-visual v5.0 (PAE #3 · Sprint 2 · Passo 2):** Identidade visual corporativa do modo Negócio. **css/negocio.css (novo):** Aliases semânticos globais (`--info: #6D8EA8` safira, `--signature`, `--border-soft`, `--shadow-elevated`, `--surface-lifted`, `--text-prime/secondary/quiet/mute`, `--bg-elevated/sunken`); accent safira scoped em `html[data-mode="negocio"]` (ícones ativos, `::before` bar, focus rings); navbar corporativa (Switzer 500, separador `line-2`, stroke SVG 1.5); KPI cards (`surface-3`, hover `translateY(-2px)` + `shadow-2`, reflexo no topo, ícone safira 20×20); `.painel-kpi-valor` (JetBrains Mono 600 `t-2xl`); `.painel-kpi-embreve` (base bg, opacity 0.4, cursor default, sem hover); atividade recente (receita verde/saída vermelho, font-mono); header (`<em>` Fraunces italic, border-bottom, Switzer 300 subtítulo); transições 240ms; light mode (`--info: #3D6480`). **index.html:** link `negocio.css?v=1` adicionado após `motion.css`. |

| 2026-05-16 | Sprint 3/3 — Contatos CRM | **skill-construtor v5.1 (PAE #2 entrada 4 — FINAL):** Extensão de Contatos com campos CRM visíveis apenas em modo Negócio. **contatos.js:** abrirForm() estende `_formSt.negocio` com `{ tipo[], etiquetas[], idNegocio, historicoInteracoes[] }`; abrirDetalhe() renderiza seção condicional `.ctto-negocio-section` (apenas quando `html[data-mode="negocio"]`) com ID, tipos, etiquetas, histórico de interações, botão "Registrar Interação"; `_abrirRegistrarInteracao(id)` abre modal com selector de tipo (call/email/meeting/message) + descrição; `_confirmarInteracao(id)` salva com timestamp automático; `_renderFormCrmTags()` + `_bindFormCrmTagInput()` para etiquetas no form; `_salvarForm()` coleta tipos (botões `.ctto-crm-type-btn.active`), etiquetas, idNegocio apenas em modo negócio (negocio=null em modo pessoal); migração segura: contatos existentes sem negocio = null (compatibilidade 100%, sem quebras). **css/negocio.css:** `.ctto-negocio-section` (border-top, Fraunces italic título), `.ctto-negocio-tipo-badge` (info bg pill), `.ctto-negocio-etiqueta-badge` (surface-3, border), `.ctto-negocio-historico` (surface-1, border-left info 2px), `.ctto-negocio-interacao-tipo/desc/data` (layout comprimido), `.ctto-crm-type-btn` (toggle, active bg info), `.ctto-crm-tags-*` (info tokens, chip remove), `.ctto-interacao-type-btn` (2 colunas modal, active info). **Public API:** `_abrirRegistrarInteracao`, `_confirmarInteracao`, `_addFormCrmTag`, `_removeFormCrmTag` adicionadas. **index.html:** cache-bust `contatos.js?v=9` → `?v=10`, `negocio.css?v=1` → `?v=2`. Zero regressões: modo pessoal idêntico, Temperatura intacto, import/export funcional. |

---

## PRÓXIMA AÇÃO

> **DEPLOY LIBERADO** — Pipeline PAE #2 (Sprints 1/3) completo ✅  
> **Testes manuais finais:** Desktop/Mobile, dark/light, Pessoal↔Negócio switch, Contatos CRM  
> **8.1** — skill-health-monitor → Relatório semanal (opcional, Haiku 4.5)  
> **Opcional:** skill-consultor para avaliar feedback Léo + próximas features backlog
