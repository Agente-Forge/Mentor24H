# tasks.md — Mentor24h v5.2
**Forge v5.2** | Appetite: L (3 sprints) | 3 Sprints | 36 Tasks
Gerado por: skill-planner v5.1 | **Data:** 2026-05-20
**Supersede:** versão 2026-05-12 (5 sprints, 40 tasks, appetite M)

---

## 🎲 BETTING TABLE GERAL

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎲 APOSTA GERAL — Mentor24h v5.2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Apostamos: 3 sprints (appetite L)
Em:        Evolução do Mentor24h para produto SaaS
           pronto para revendedoras autônomas
Entrega:   36 tasks atômicas (≤2h cada)
           Sprint crítica: Sprint 1 (fundação)

Risco principal: camada de dados (Task 1.1) bloqueia
                 tudo — deve ser a primeira a iniciar.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Sprint 1 — Fundação + Núcleo Dual

### 🎲 BETTING TABLE — Sprint 1

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎲 [BETTING TABLE — Sprint 1]
Apostamos: ~12h de trabalho
Em:        Repository layer + Dashboards completos + PWA
Risco:     Task 1.1 bloqueia 1.3 e 1.5 — iniciar aqui.
           Tasks 1.2 e 1.10 tocam em arquivos core
           (requerem aprovação per CONSTITUTION ⚠️Ask).
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Objetivo:** Ter a fundação técnica (repository.js), os dois dashboards funcionais com dados reais, timeline do dia e PWA instalável.
**Estimativa:** ~12h
**Sensores:** Testes manuais no browser (AGENTS.md §4)
**Dependências:** Nenhuma (sprint inaugural do ciclo v5.2)
**CSS disponível:** `dashboard-pessoal.css` + `painel-negocio.css` já prontos

---

### Tasks Sprint 1

- [ ] **Task 1.1** — Criar `js/core/repository.js` (adapter CRUD) — **M** (2h)
  - Arquivos: `js/core/repository.js` (novo)
  - Critério de done: `Repository.get()`, `.getById()`, `.save()`, `.remove()` funcionam internamente via `DB.*`; injeta `user_id: 'local'`, `createdAt`, `updatedAt` automaticamente
  - Referência: REQ-001, DEC-001
  - ⚡ **Sprint crítica: iniciar aqui** — bloqueia Tasks 1.3 e 1.5

- [ ] **Task 1.2** — Expor métodos faltantes em `db.js` para suporte ao repository — **S** (1h) ⚠️ Ask
  - Arquivos: `js/core/db.js` (arquivo core — requer aprovação)
  - Critério de done: `DB.getAll(collection)`, `DB.getById(collection, id)`, `DB.remove(collection, id)` disponíveis (se não existirem); zero regressão nos módulos existentes
  - Referência: REQ-001, DEC-001
  - Depende de: Task 1.1 (para saber quais métodos são necessários)

- [ ] **Task 1.3** — Criar `js/modules/dashboard-pessoal.js` com HTML `.dp-*` — **M** (2h)
  - Arquivos: `js/modules/dashboard-pessoal.js` (novo)
  - Critério de done: cards dinâmicos renderizam com dados reais (tarefas, medicamentos, saldo, próximo evento); card ausente quando sem dados; saudação dinâmica (bom dia/tarde/noite) funcional
  - Referência: REQ-002
  - Depende de: Task 1.1

- [ ] **Task 1.4** — Registrar dashboard-pessoal.js no Router e `index.html` — **XS** (30min) ⚠️ Ask (app.js)
  - Arquivos: `index.html`, `js/core/app.js`
  - Critério de done: `Router.navigate('dashboard-pessoal')` funciona; `<script>` registrado; modo Pessoal navega para o novo dashboard
  - Depende de: Task 1.3

- [ ] **Task 1.5** — Reescrever `js/modules/painel.js` com HTML `.pn-*` — **M** (2h)
  - Arquivos: `js/modules/painel.js` (substitui placeholder existente)
  - Critério de done: 4 KPIs reais (receita mês, clientes ativos, temperatura dominante, atividade recente); últimas 5 transações listadas; estado vazio elegante
  - Referência: REQ-003
  - Depende de: Task 1.1
  - ‖ Paralelizável com Task 1.3 (após Task 1.1)

- [ ] **Task 1.6** — Criar `js/modules/timeline.js` (widget linha do tempo do dia) — **M** (2h)
  - Arquivos: `js/modules/timeline.js` (novo)
  - Critério de done: lista eventos das próximas 24h ordenados por horário; ouro para pessoal, safira para serviço; estado "Dia livre" quando vazio
  - Referência: REQ-004, DEC-005
  - Depende de: Task 1.1
  - ‖ Paralelizável com Task 1.5

- [ ] **Task 1.7** — Integrar `timeline.js` no dashboard pessoal — **XS** (30min)
  - Arquivos: `js/modules/dashboard-pessoal.js`
  - Critério de done: widget `.tl-*` aparece abaixo dos cards de KPI no dashboard pessoal; clique navega para agenda
  - Depende de: Tasks 1.3 + 1.6

- [ ] **Task 1.8** — Criar `manifest.json` (PWA) — **S** (1h)
  - Arquivos: `manifest.json` (novo), `index.html` (adicionar `<link rel="manifest">`)
  - Critério de done: manifest válido (Lighthouse); ícones 192px + 512px referenciados; `display: standalone`; `apple-touch-icon` para iOS
  - Referência: REQ-005, DEC-002
  - ‖ Paralelizável com Task 1.9

- [ ] **Task 1.9** — Criar `sw.js` (Service Worker cache-first) — **M** (2h)
  - Arquivos: `sw.js` (novo)
  - Critério de done: lista de assets pré-cacheados no install; cache-first no fetch; versão detecta update e exibe toast "Nova versão disponível"; app abre offline após 1ª carga conectada
  - Referência: REQ-005, DEC-002
  - ‖ Paralelizável com Task 1.8

- [ ] **Task 1.10** — Registrar Service Worker em `app.js` — **XS** (30min) ⚠️ Ask (app.js)
  - Arquivos: `js/core/app.js`
  - Critério de done: `navigator.serviceWorker.register('/sw.js')` chamado em `init()`; sem erros no console
  - Referência: REQ-005
  - Depende de: Task 1.9

- [ ] **Task 1.11** — Extensão de schema: `agenda` (tipo+cliente+valor) + `tarefas` (recorrencia) + `produtos` (custo+margemPct) — **S** (1h) ⚠️ Ask (db.js)
  - Arquivos: `js/core/db.js` (schema + migration não-destrutiva)
  - Critério de done: registros existentes intocados; novos campos com default `null`; versão de schema incrementada com migração automática
  - Referência: REQ-006, REQ-008, REQ-009
  - Depende de: Task 1.2

- [ ] **Task 1.12** — Teste manual Sprint 1 — **XS** (30min)
  - Critério de done: Lighthouse PWA ≥ 80; dashboards pessoal e negócio renderizam em mobile + desktop; offline funciona após 1ª carga; zero erros no console
  - Referência: REQ-002, REQ-003, REQ-005
  - Depende de: Tasks 1.3–1.10

---

## Sprint 2 — Engajamento + Agenda Híbrida

### 🎲 BETTING TABLE — Sprint 2

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎲 [BETTING TABLE — Sprint 2]
Apostamos: ~12h de trabalho
Em:        Agenda Híbrida + Hábitos/Streak/Push
           + Tarefas Recorrentes + Notas Rápidas
Risco:     Push Notifications (Task 2.6) tem suporte
           limitado em iOS — degradação graciosa prevista.
           Tasks 2.8 e 2.9 tocam em tarefas.js existente.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Objetivo:** Diferenciais de engajamento: agenda unificada ouro/safira, hábitos com streak e push local, tarefas recorrentes e notas rápidas.
**Estimativa:** ~12h
**Dependências:** Sprint 1 concluída (Task 1.11 schema migration desbloqueada)

---

### Tasks Sprint 2

- [ ] **Task 2.1** — Criar `js/modules/agenda-hibrida.js` (base + filtros) — **M** (2h)
  - Arquivos: `js/modules/agenda-hibrida.js` (novo)
  - Critério de done: CRUD de eventos com campo `tipo`; filtro Todos/Pessoal/Serviço funcional; reutiliza `DB.getAgenda()` + `Repository.save('agenda', ...)`
  - Referência: REQ-006, DEC-005
  - Depende de: Task 1.11 (schema migration)

- [ ] **Task 2.2** — Agenda Híbrida — diferenciação visual ouro/safira — **S** (1h)
  - Arquivos: `js/modules/agenda-hibrida.js`, `css/pages.css` (ou `negocio.css` para tokens safira)
  - Critério de done: eventos pessoais com borda/badge ouro `#D4A574`; serviços com borda/badge safira `#6D8EA8`; usa tokens de `tokens.css` (sem hardcode)
  - Referência: REQ-006
  - Depende de: Task 2.1

- [ ] **Task 2.3** — Agenda de Serviços — cards com cliente + valor — **S** (1h)
  - Arquivos: `js/modules/agenda-hibrida.js`
  - Critério de done: form de evento do tipo "serviço" mostra select de contatos + campo valor (R$); card listado exibe nome do cliente + valor formatado na linha
  - Referência: REQ-006
  - Depende de: Task 2.1

- [ ] **Task 2.4** — Criar `js/modules/habitos.js` (CRUD + streak counter) — **M** (2h)
  - Arquivos: `js/modules/habitos.js` (novo)
  - Critério de done: CRUD de hábitos (nome, horário, frequência); marcar como feito incrementa streak; perder um dia zera streak com mensagem motivacional; persiste em `Repository.save('habitos', ...)`
  - Referência: REQ-007
  - ‖ Paralelizável com Task 2.10

- [ ] **Task 2.5** — Hábitos — UI streak visual + calendário de presença — **S** (1h)
  - Arquivos: `js/modules/habitos.js`, `css/pages.css`
  - Critério de done: streak exibido com contador numérico e animação CSS leve ao incrementar; calendário semanal de check-ins visível por hábito
  - Referência: REQ-007
  - Depende de: Task 2.4

- [ ] **Task 2.6** — Push Notifications — Notification API + fluxo de permissão — **M** (2h)
  - Arquivos: `js/modules/habitos.js` (ou `js/utils/notifications.js`)
  - Critério de done: solicita permissão de notificação ao criar hábito com horário; agenda push local no horário; degradação graciosa se permissão negada ou API indisponível (sem erro, sem crash)
  - Referência: REQ-007, DEC-003
  - Depende de: Task 2.4

- [ ] **Task 2.7** — Integrar push com hábitos (agendar por hábito) — **S** (1h)
  - Arquivos: `js/modules/habitos.js`
  - Critério de done: cada hábito com horário cadastrado dispara notificação no horário usando `setTimeout` calculado até próximo horário do dia; re-agenda após fechar e reabrir o app
  - Referência: REQ-007
  - Depende de: Tasks 2.4 + 2.6

- [ ] **Task 2.8** — Campo `recorrencia` em `tarefas.js` + form — **S** (1h)
  - Arquivos: `js/modules/tarefas.js` (existente)
  - Critério de done: form de criação de tarefa inclui select de recorrência (Sem recorrência / Diário / Semanal / Mensal); campo salvo no registro
  - Referência: REQ-008
  - ‖ Paralelizável com Task 2.1 (schema já migrado em 1.11)

- [ ] **Task 2.9** — Auto-geração de instância recorrente ao concluir tarefa — **S** (1h)
  - Arquivos: `js/modules/tarefas.js`
  - Critério de done: ao marcar tarefa com `recorrencia != null` como concluída, o sistema cria nova instância com status `pendente`, herdando todos os campos exceto `id` e `status`; data calculada conforme frequência
  - Referência: REQ-008
  - Depende de: Task 2.8

- [ ] **Task 2.10** — Criar `js/modules/notas.js` (CRUD + pin + busca) — **M** (2h)
  - Arquivos: `js/modules/notas.js` (novo)
  - Critério de done: CRUD de notas (máx 280 chars); pin sobe nota para o topo; busca textual filtra em tempo real; persiste em `Repository.save('notas', ...)`
  - Referência: REQ-008
  - ‖ Paralelizável com Task 2.4

- [ ] **Task 2.11** — Widget de notas no dashboard pessoal — **XS** (30min)
  - Arquivos: `js/modules/dashboard-pessoal.js`
  - Critério de done: widget `.nota-widget` exibe até 3 notas pinadas no dashboard pessoal; clique navega para notas
  - Referência: REQ-008
  - Depende de: Tasks 1.3 + 2.10

- [ ] **Task 2.12** — Teste manual Sprint 2 — **XS** (30min)
  - Critério de done: agenda híbrida cria eventos pessoal/serviço com diferenciação visual correta; streak incrementa e zera; push funciona no Chrome desktop; tarefas recorrentes geram próxima instância; notas CRUD completo; widget no dashboard exibe notas pinadas

---

## Sprint 3 — Profundidade de Negócio + Inteligência

### 🎲 BETTING TABLE — Sprint 3

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎲 [BETTING TABLE — Sprint 3]
Apostamos: ~12h de trabalho
Em:        Catálogo+Precificação + PDF + Analytics +
           Assistente Proativo
Risco:     Task 3.1 (auditoria) pode revelar que módulos
           de negócio estão mais completos do que
           esperado — reavaliar escopo das tasks 3.2–3.3.
           SVG puro (Task 3.8) é estimativa conservadora
           — pode ser feito em 1h se estrutura de dados
           estiver bem definida.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Objetivo:** Profundidade de negócio para a revendedora: catálogo com precificação, PDF de nota/orçamento, analytics com gráfico SVG, e assistente proativo com insights locais.
**Estimativa:** ~12h
**Dependências:** Sprint 1 concluída; Sprint 2 parcialmente (Repository layer ativo)

---

### Tasks Sprint 3

- [ ] **Task 3.1** — Auditar `produtos.js`, `vendas.js`, `clientes.js` (o que existe vs. placeholder) — **XS** (30min)
  - Arquivos: leitura de `js/modules/produtos.js`, `vendas.js`, `clientes.js`
  - Critério de done: lista documentada do que já está implementado (CRUD, campos, eventos); confirmar quais campos do schema existem antes de estimar as tasks seguintes
  - ⚡ Bloqueia Tasks 3.2 e 3.3 — não pular esta etapa

- [ ] **Task 3.2** — Campos `custo` e `margemPct` em `produtos.js` + calculadora — **S** (1h)
  - Arquivos: `js/modules/produtos.js` (existente)
  - Critério de done: form de produto inclui campos "Preço de custo" e "Margem %"; campo read-only "Preço de venda" calculado em tempo real: `custo × (1 + margemPct/100)`; persiste no registro
  - Referência: REQ-009
  - Depende de: Tasks 1.11 + 3.1

- [ ] **Task 3.3** — View de catálogo público (modo leitura) — **M** (2h)
  - Arquivos: `js/modules/produtos.js` (nova view interna)
  - Critério de done: botão "Ver catálogo" ativa modo leitura (sem botões de edição/exclusão); exibe foto (via URL), nome, preço de venda; apta para screenshot e compartilhamento
  - Referência: REQ-009
  - Depende de: Task 3.2

- [ ] **Task 3.4** — Template `@media print` nota de venda — **M** (2h)
  - Arquivos: `css/pages.css` (seção print) ou `css/print.css` (novo)
  - Critério de done: template HTML de nota de venda com cliente, itens (qtd + preço unitário + subtotal), total, data, dados de contato; CSS `@media print` oculta sidebar/navbar/botões; `window.print()` acionado por botão
  - Referência: REQ-010, DEC-004

- [ ] **Task 3.5** — Template `@media print` orçamento — **S** (1h)
  - Arquivos: `css/pages.css` (ou `print.css`)
  - Critério de done: variante de orçamento com "válido por X dias"; sem "nota fiscal"; mesmo fluxo de `window.print()`; zero dependências externas
  - Referência: REQ-010
  - Depende de: Task 3.4 (reutiliza estrutura base)

- [ ] **Task 3.6** — Criar `js/modules/relatorios.js` (base + relatório financeiro mensal) — **M** (2h)
  - Arquivos: `js/modules/relatorios.js` (novo)
  - Critério de done: receita, despesa, lucro do mês atual; delta vs. mês anterior (▲▼%); filtro de período (mês / trimestre / ano); persiste via `Repository.get('transacoes', ...)`
  - Referência: REQ-011
  - ‖ Paralelizável com Task 3.9

- [ ] **Task 3.7** — Top 5 clientes e top 5 produtos — **S** (1h)
  - Arquivos: `js/modules/relatorios.js`
  - Critério de done: top 5 clientes ordenados por valor total de vendas; top 5 produtos por quantidade vendida; ambos com barra de progresso proporcional
  - Referência: REQ-011
  - Depende de: Task 3.6

- [ ] **Task 3.8** — Gráfico de barras SVG (últimos 6 meses) — **M** (2h)
  - Arquivos: `js/modules/relatorios.js`
  - Critério de done: SVG gerado via template literals JS (sem Chart.js); barras mensais com receita dos últimos 6 meses; altura proporcional ao maior valor; rótulo de mês e valor no hover
  - Referência: REQ-011, DEC-006
  - Depende de: Task 3.6

- [ ] **Task 3.9** — Criar `js/modules/assistente.js` (lógica de insights locais) — **M** (2h)
  - Arquivos: `js/modules/assistente.js` (novo)
  - Critério de done: pelo menos 5 tipos de insight implementados (conta vencendo, cliente inativo há 30 dias, meta ≥80% do limite, streak quebrado, próximo serviço em 24h); retorna array de insights; dismiss persiste 7 dias em `insights-dispensados`
  - Referência: REQ-012
  - ‖ Paralelizável com Task 3.6

- [ ] **Task 3.10** — UI insights no dashboard (máx 3 cards + botão Dispensar) — **S** (1h)
  - Arquivos: `js/modules/dashboard-pessoal.js`, `js/modules/painel.js`
  - Critério de done: até 3 cards de insight no dashboard; cada card tem texto, ação clicável e botão "Dispensar"; dismiss remove por 7 dias sem recarregar a página
  - Referência: REQ-012
  - Depende de: Tasks 1.3 + 3.9

- [ ] **Task 3.11** — Renomear "IA" → "Assistente" em toda a UI — **XS** (30min)
  - Arquivos: `index.html`, `js/modules/*.js`, `css/pages.css` (busca por "IA", "AI" em labels/títulos)
  - Critério de done: zero ocorrência de "IA" ou "AI" em textos de interface visíveis ao usuário; Chat AI pode manter o nome técnico internamente; conforme d013
  - Referência: REQ-012

- [ ] **Task 3.12** — Teste manual Sprint 3 + checklist sentinela — **S** (1h)
  - Critério de done: catálogo público sem botões de edição; PDF gera corretamente (sem sidebar visível); relatório financeiro com delta correto; top clientes e gráfico SVG visíveis; assistente exibe insights corretos; dismiss funciona e persiste; zero "IA" na UI; Sentinela autoriza encerramento do ciclo

---

## 🔗 Caminho Crítico (CPM)

```
🔗 [CPM — DEPENDÊNCIAS]

BLOQUEADORES:
• Task 1.1 "repository.js"      → bloqueia → Tasks 1.3, 1.5 (dashboards)
• Task 1.3 "dashboard-pessoal"  → bloqueia → Task 1.7 (integrar timeline)
• Task 1.9 "sw.js"              → bloqueia → Task 1.10 (registrar SW)
• Task 1.11 "schema migration"  → bloqueia → Tasks 2.1, 2.8 (agenda-hibrida, recorrência)
• Task 2.1 "agenda-hibrida"     → bloqueia → Tasks 2.2, 2.3 (cores, campos serviço)
• Task 2.4 "habitos base"       → bloqueia → Tasks 2.5, 2.6, 2.7 (streak, push, integração)
• Task 3.1 "auditoria módulos"  → bloqueia → Tasks 3.2, 3.3 (catálogo, precificação)
• Task 3.6 "relatorios base"    → bloqueia → Tasks 3.7, 3.8 (top + SVG)
• Task 3.9 "assistente"         → bloqueia → Task 3.10 (UI insights)

PARALELIZÁVEIS:
• Task 1.3 (dashboard-pessoal) ‖ Task 1.5 (painel-negocio)   — após Task 1.1
• Task 1.8 (manifest.json)     ‖ Task 1.9 (sw.js)
• Task 1.5 (painel)            ‖ Task 1.6 (timeline)
• Task 2.4 (habitos)           ‖ Task 2.10 (notas)
• Task 2.8 (recorrência)       ‖ Task 2.1 (agenda-hibrida)
• Task 3.6 (relatorios)        ‖ Task 3.9 (assistente)
• Task 3.4 (nota PDF)          ‖ Task 3.6 (relatorios)

SPRINT CRÍTICA: Sprint 1
  — maior densidade de bloqueadores
  — Tasks 1.1 e 1.11 bloqueiam ambas as sprints seguintes
  — Tasks 1.2 e 1.10 requerem ⚠️ Ask (arquivos core)
```

---

## Resumo de Estimativas

| Sprint | Tasks | Estimativa | Entrega |
|--------|-------|-----------|---------|
| Sprint 1 — Fundação + Núcleo Dual | 12 | ~12h | Repository + Dashboards + PWA |
| Sprint 2 — Engajamento | 12 | ~12h | Agenda Híbrida + Hábitos + Notas |
| Sprint 3 — Negócio + Inteligência | 12 | ~12h | Catálogo + PDF + Analytics + Assistente |
| **Total** | **36** | **~36h** | |

> 36 tasks de 36h = dentro do appetite L (máx 76 tasks).
> Todas as tasks ≤ 2h (atômicas).
> 3 tasks requerem ⚠️ Ask: 1.2 (db.js), 1.10 (app.js), 1.11 (db.js).
