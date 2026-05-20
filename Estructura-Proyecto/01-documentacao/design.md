# design.md — Mentor24h v5.2
**Forge v5.2** | Appetite: L (3 sprints) | Gerado por: skill-planner v5.1
**Data:** 2026-05-20 | **Supersede:** versão 2026-05-12
**Input:** STRATEGIC-BRIEF.md + FORGE-CHECKLIST.md + AGENTS.md + CONSTITUTION.md

---

## Arquitetura de Alto Nível

```
┌──────────────────────────────────────────────────────────────┐
│  FRONTEND  HTML5 + CSS puro + JS ES6+ (padrão IIFE)          │
│                                                              │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐   │
│  │  js/modules/ │  │  js/utils/   │  │    js/core/       │   │
│  │  (features)  │  │  (helpers)   │  │  app · router     │   │
│  └──────┬──────┘  └──────────────┘  └──────────────────┘│   │
│         │                                    │            │   │
│         ▼              🆕 v5.2               ▼            │   │
│  ┌─────────────────────────────────────────────────────┐ │   │
│  │           js/core/repository.js  (NOVO)             │ │   │
│  │   Interface CRUD centralizada — adapter pattern      │ │   │
│  └──────────────────────┬──────────────────────────────┘ │   │
│                         │                                 │   │
│                         ▼                                 │   │
│  ┌─────────────────────────────────────────────────────┐ │   │
│  │           js/core/db.js  (existente)                │ │   │
│  │   16 collections, schemas, migrations               │ │   │
│  └──────────────────────┬──────────────────────────────┘ │   │
│                         │                                 │   │
│                         ▼                                 │   │
│              localStorage (mentor24h.*)                   │   │
└──────────────────────────────────────────────────────────────┘

Deploy: GitHub Pages (estático, automático via GitHub Actions)
PWA:    manifest.json + sw.js (cache-first) — 🆕 v5.2
```

**Stack não muda:** HTML+CSS+JS puro. Nenhuma dependência nova de framework.
**Novidade v5.2:** repository.js (adapter) + 7 novos módulos + PWA.

---

## Decisões Arquiteturais

### DEC-001 — Repository/Adapter Pattern sobre localStorage

**Decisão:** Criar `js/core/repository.js` como thin wrapper sobre `db.js`. Todos os módulos v5.2 usam `Repository.*`; módulos existentes continuam usando `DB.*` sem alteração.

**Motivo:** d014 — migração para Supabase no futuro requer que nenhum módulo dependa diretamente de localStorage. Com o adapter, substituir a implementação do repository = migração concluída, sem tocar nos 34+ módulos.

**Alternativas descartadas:**
- Refatorar `db.js` para interface Supabase-compatible (risco alto de regressão nos módulos existentes)
- Não abstrair (gera reescrita massiva na Fase Escala)

**Tradeoffs:** +1.5 dias no Sprint 1; protege todos os sprints futuros de reescrita. Custo-benefício positivo.

**Fit com appetite L:** A task mais pesada do Sprint 1, mas desbloqueadora de tudo. Sem ela, a dívida técnica custa 3× o tempo na migração Supabase.

---

### DEC-002 — PWA Cache-First Strategy

**Decisão:** Service Worker com cache-first para assets estáticos (`.html`, `.css`, `.js`, fontes, ícones). Dados em localStorage já são offline por natureza — não precisam de estratégia adicional.

**Motivo:** A maior parte do app são arquivos estáticos; localStorage é inerentemente offline. Cache-first é a estratégia mais simples e eficaz para o cenário.

**Alternativas descartadas:**
- Stale-while-revalidate (mais complexo para pouco benefício adicional)
- Network-first (cancela o offline-first se sem internet)

**Tradeoffs:** Primeira carga exige conexão; subsequentes são offline. Aceitável para o MVP.

---

### DEC-003 — Push Notifications via browser Notification API (sem serviço externo)

**Decisão:** Usar `Notification API` nativa do browser para lembretes locais. Zero backend, zero serviço externo, zero custo, funciona offline.

**Motivo:** LEI 1 da Constitution veda chamadas a backend externo no MVP. Notification API atende o caso de uso (lembrete de hábito no horário certo) sem nenhuma dependência.

**Alternativas descartadas:**
- OneSignal/Pusher: requer backend, viola LEI 1
- Push via Supabase: fora do escopo deste ciclo

**Tradeoffs:** iOS Safari tem suporte limitado à Notification API — degradação graciosa (funciona sem notificações, não quebra). Chrome desktop: suporte pleno.

---

### DEC-004 — PDF via @media print + window.print() (sem jsPDF)

**Decisão:** Templates HTML com CSS `@media print` dedicado. `window.print()` aciona o diálogo nativo do browser onde o usuário salva como PDF.

**Motivo:** Zero dependência externa; CSS controla layout com precisão; sem peso de bundle; sem custo. AGENTS.md §7 veda libs externas não previstas no PRD.

**Alternativas descartadas:**
- jsPDF: dependência externa, viola política de zero deps
- html2canvas: pesado, não garante fidelidade visual

**Tradeoffs:** Usuário precisa clicar "Salvar como PDF" manualmente no diálogo de impressão. Aceitável no MVP — a revendedora já está familiarizada com esse fluxo.

---

### DEC-005 — Agenda Híbrida como módulo novo (não reescrita de agenda.js)

**Decisão:** Criar `js/modules/agenda-hibrida.js` novo. Reutiliza `DB.getAgenda()` e extende o schema com `tipo`, `cliente`, `valor` via migração não-destrutiva.

**Motivo:** `agenda.js` existente funciona bem para uso pessoal. Reescrevê-lo geraria risco de regressão. O módulo híbrido é uma view unificada que agrega os mesmos dados com campos extras.

**Alternativas descartadas:**
- Reescrever `agenda.js` (risco de regressão em feature já validada)
- Criar schema separado (duplicidade de dados)

**Tradeoffs:** Dois módulos de agenda coexistem; `agenda-hibrida.js` é a view principal daqui em diante. Aceitável.

---

### DEC-006 — Charts via SVG gerado em JS puro (sem Chart.js)

**Decisão:** Gerar SVG de barras dinamicamente em `relatorios.js` com template literals JavaScript. Suficiente para barras mensais simples dos últimos 6 meses.

**Motivo:** AGENTS.md veda libs externas não previstas; Chart.js adicionaria ~60KB ao bundle. SVG puro é leve, acessível e controlável via CSS.

**Alternativas descartadas:**
- Chart.js: dependência externa não prevista
- Canvas API: menos acessível (sem suporte a screen readers)

**Tradeoffs:** Limitado a barras/linhas simples. Aceitável para o MVP do analytics de negócio.

---

## Componentes Principais

### COMP-001 — Repository (js/core/repository.js) 🆕
**Responsabilidade:** Interface CRUD centralizada; wrapper sobre `DB.*`; adiciona `user_id`, `createdAt`, `updatedAt` automaticamente.

```
Input:  Repository.get(collection, filters?)  → item[]
        Repository.getById(collection, id)    → item | null
        Repository.save(collection, item)     → item (com timestamps)
        Repository.remove(collection, id)     → void
Output: Dados com user_id: 'local' + timestamps ISO
```

**Dependências:** `db.js`
**Testabilidade:** Mock de `DB.*`; verificar que `user_id` e timestamps são injetados.

---

### COMP-002 — DashboardPessoal (js/modules/dashboard-pessoal.js) 🆕
**Responsabilidade:** Bento grid com cards dinâmicos do dia para modo Pessoal. CSS já pronto em `dashboard-pessoal.css`.

```
Input:  Repository.get de tarefas, agenda, medicamentos, contas, hábitos
Output: HTML .dp-* em <section data-page="dashboard-pessoal">
```

**Dependências:** `repository.js`, `timeline.js`, `habitos.js`
**Testabilidade:** Mock de dados → verificar cards aparecem/somem conforme conteúdo.

---

### COMP-003 — PainelNegocio (js/modules/painel.js — reescrita) ♻️
**Responsabilidade:** KPIs reais do negócio + atividade recente. CSS já pronto em `painel-negocio.css`.

```
Input:  Repository.get de transacoes, contatos, vendas
Output: HTML .pn-* em <section data-page="painel">
```

**Dependências:** `repository.js`
**Testabilidade:** Mock dados financeiros → verificar KPI valores e formatação R$.

---

### COMP-004 — Timeline (js/modules/timeline.js) 🆕
**Responsabilidade:** Widget linha do tempo das próximas 24h integrando agenda pessoal + serviços.

```
Input:  Eventos de agenda + agenda-hibrida das próximas 24h (via Repository)
Output: HTML .tl-* inserido em slot #dashboard-timeline no dashboard pessoal
```

**Dependências:** `repository.js`
**Testabilidade:** Mock eventos → verificar ordenação por horário, cor por tipo.

---

### COMP-005 — AgendaHibrida (js/modules/agenda-hibrida.js) 🆕
**Responsabilidade:** Agenda unificada pessoal + serviço com filtros e diferenciação visual.

```
Input:  evento { tipo: 'pessoal'|'servico', cliente?: id, valor?: number, ...campos agenda }
Output: HTML .ah-* em <section data-page="agenda-hibrida">
```

**Dependências:** `repository.js` (agenda + contatos)
**Testabilidade:** Mock eventos mistos → verificar cor semântica, filtros, campos de serviço.

---

### COMP-006 — Habitos (js/modules/habitos.js) 🆕
**Responsabilidade:** CRUD hábitos + streak counter + agendamento de push local.

```
Input:  habito { nome, horario, frequencia: 'daily'|'weekly' }
Output: HTML .hab-* em <section data-page="habitos">
        Notification API scheduling no horário do hábito
```

**Dependências:** `repository.js`, `Notification API` (browser native)
**Testabilidade:** Mock permissão notificação; verificar streak incrementa/zera corretamente.

---

### COMP-007 — Notas (js/modules/notas.js) 🆕
**Responsabilidade:** CRUD notas rápidas com pin, busca textual e widget no dashboard.

```
Input:  nota { texto: string (max 280), pin: boolean, categoria?: string }
Output: HTML .nota-* em <section data-page="notas">
        Widget .nota-widget em dashboard pessoal
```

**Dependências:** `repository.js`
**Testabilidade:** CRUD completo; busca textual filtra corretamente; pin sobe nota para o topo.

---

### COMP-008 — Relatorios (js/modules/relatorios.js) 🆕
**Responsabilidade:** Analytics de negócio — financeiro mensal, top clientes/produtos, gráfico SVG puro.

```
Input:  Repository.get de transacoes, vendas, clientes, produtos (com filtro de período)
Output: HTML .rel-* em <section data-page="relatorios">
        SVG de barras gerado inline via template literals
```

**Dependências:** `repository.js`
**Testabilidade:** Mock dados de 6 meses → verificar cálculos financeiros + SVG gerado com dimensões corretas.

---

### COMP-009 — Assistente (js/modules/assistente.js) 🆕
**Responsabilidade:** Análise local de dados e geração de até 3 insights proativos. Zero LLM — lógica local pura.

```
Input:  Dados de todas as collections via Repository (triggered em app.init)
Output: Array de insights { texto, tipo, acao, key }
        Renderizado em #dashboard-insights no dashboard
```

**Dependências:** `repository.js`
**Testabilidade:** Mock cenários (conta vencendo, cliente inativo) → verificar insight correto gerado; dismiss persiste 7 dias.

---

## Modelo de Dados — Extensões v5.2

### Novas collections (não-destrutivas — adicionar em db.js)

```javascript
// mentor24h.habitos
{
  id, nome, horario,           // "07:30"
  frequencia: 'daily'|'weekly',
  streak: 0,
  ultimoCheck: null,           // ISO date string
  notificacaoPermitida: false,
  createdAt, updatedAt, user_id: 'local'
}

// mentor24h.notas
{
  id, texto,                   // max 280 chars
  pin: false,
  categoria: null,
  createdAt, updatedAt, user_id: 'local'
}

// mentor24h.insights-dispensados
{
  insightKey,                  // string identificadora do insight
  dispensadoAte,               // ISO date (+7 dias)
  createdAt
}
```

### Extensões não-destrutivas (campos com default null)

```javascript
// agenda — adicionar:
{ tipo: 'pessoal',  cliente: null, valor: null }

// tarefas — adicionar:
{ recorrencia: null }          // null | 'daily' | 'weekly' | 'monthly'

// produtos — adicionar:
{ custo: null, margemPct: null }
```

> Todos os registros existentes continuam funcionando — campos novos têm default null
> e não afetam lógica anterior. Migração é aditiva.

---

## Fluxo de Dados Principal

```
Módulo UI (agenda-hibrida.js, habitos.js, etc.)
  ↓ chama
Repository.save('agenda', evento)
  ↓ injeta user_id, timestamps; delega para
DB.addAgenda(evento)
  ↓ grava em
localStorage['mentor24h.agenda'] = JSON.stringify([...])

// Para migração Supabase (fase futura):
// Módulo UI → Repository (inalterado)
// Repository → supabase.from('agenda').insert(evento) ← troca só aqui
```

---

## Estrutura de Arquivos — Novos em v5.2

```
js/
  core/
    repository.js          🆕 adapter CRUD centralizado
  modules/
    dashboard-pessoal.js   🆕 (CSS já existe em dashboard-pessoal.css)
    painel.js              ♻️ reescrita (CSS já existe em painel-negocio.css)
    timeline.js            🆕 widget do dia
    agenda-hibrida.js      🆕 agenda unificada pessoal+serviço
    habitos.js             🆕 hábitos + streak + push
    notas.js               🆕 notas rápidas
    relatorios.js          🆕 analytics + SVG charts
    assistente.js          🆕 insights proativos locais

css/  (todos existentes — sem novos arquivos CSS necessários)
  dashboard-pessoal.css    ✅ já existe (Sprint Beta CSS)
  painel-negocio.css       ✅ já existe (Sprint Beta CSS)
  negocio.css              ✅ já existe

manifest.json              🆕 PWA
sw.js                      🆕 Service Worker
```

---

## Leis Ativas neste Ciclo (Constitution)

| Lei | Impacto no v5.2 |
|-----|-----------------|
| LEI 1 — Local-First | localStorage permanece; Supabase fora deste ciclo |
| LEI 2 — Quiet Intelligence | Ouro/safira semânticos; animações suaves; sem cores saturadas |
| LEI 3 — Single Source of Truth | Todo CSS via `tokens.css`; zero valor hardcoded |
| LEI 4 — Reutilizar | CSS dos dashboards já existe; Repository delega para DB existente |
| LEI 5 — Dashboard é o centro | Timeline + hábitos + insights + notas integram no dashboard |
| SEC-2 — Escape HTML | Todo input passa por `escapeHtml()` antes do DOM |
| F-3 — Appetite é lei | 3 sprints, máx 76 tasks (planejado: 36 tasks) |
| F-5 — Sentinela tem veto | Code review obrigatório antes de marcar sprint como done |
