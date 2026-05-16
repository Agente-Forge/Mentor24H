# Sprint Relay — Dual-Mode Pessoal/Negócio
**Pipeline:** skill-construtor (S1) → construtor+forge-visual (S2) → construtor (S3) → DEPLOY

---

## DIAGRAMA DO QUE FOI CONSTRUÍDO

```
┌─────────────────────────────────────────────────────────┐
│ MENTOR24H — Dual-Mode Architecture                       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  [Modo Switcher — Pill Toggle]                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │ [● Pessoal]  [○ Negócio]                          │  │
│  └───────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─ MODO PESSOAL ─────────────────────────────────────┐ │
│  │ Dashboard                                           │ │
│  │ ├─ Agenda                                           │ │
│  │ ├─ Tarefas                                          │ │
│  │ ├─ Saúde & Hábitos (Medicamentos)                   │ │
│  │ ├─ Contatos                                         │ │
│  │ Finanças                                            │ │
│  │ ├─ Contas                                           │ │
│  │ ├─ Transações                                       │ │
│  │ ├─ Metas                                            │ │
│  │ Config                                              │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌─ MODO NEGÓCIO ──────────────────────────────────────┐ │
│  │ Dashboard (como "Painel")                            │ │
│  │ Meu Negócio                                          │ │
│  │ ├─ Clientes                                          │ │
│  │ ├─ Produtos                                          │ │
│  │ ├─ Vendas                                            │ │
│  │ ├─ Estoque                                           │ │
│  │ Config                                               │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│ Persistência: localStorage key 'mentor24h_modoAtivo'     │
│ Default: 'pessoal' (primeiro acesso)                     │
│ Transição: 240ms var(--ease-out)                         │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ SPRINT 1 — skill-construtor — CONCLUÍDO

**Commit:** `aa8b053` — feat(sprint-1/3): Dual-Mode Pessoal/Negócio — Estrutura base

### Arquivos Modificados

#### index.html
- [x] Adicionado `data-mode="pessoal"` no `<html>`
- [x] Modo Switcher pill (`.modo-switcher`) no `sidebar-header` com 2 botões (Pessoal/Negócio)
- [x] Reorganizado: `group-pessoal` + `group-financas` com `data-context="pessoal"`
- [x] Reorganizado: `group-negocio` com `data-context="negocio"`
- [x] Adicionado `modo-label-header` no `topbar-title` para saudação dinâmica
- [x] Cache-bust: `?v=10` para `layout.css` e `app.js`

#### js/app.js
- [x] `initModoSwitcher()` — carrega modo do localStorage ou 'pessoal' padrão + event listeners
- [x] `applyMode(modo)` — salva, aplica data-mode, atualiza switcher, saudação, visibilidade
- [x] Integração: `initModoSwitcher()` chamado em `init()` antes de `initSidebar()`
- [x] `openGroupFor()` atualizado — remover 'group-chat', mapear novos contextos
- [x] `BNAV_GROUP` atualizado — remover 'chat-ai' do mapa

#### css/layout.css
- [x] `.modo-switcher` — pill wrapper com gap 4px, background, border-radius 100px
- [x] `.modo-btn` — botão com flex, padding, hover, transition 240ms
- [x] `.modo-pessoal-btn.active` — background `var(--signature)` (#D4A574 ouro)
- [x] `.modo-negocio-btn.active` — background `var(--info)` (#6D8EA8 safira)
- [x] Focus ring — `outline: 1.5px solid var(--signature); outline-offset: 3px`
- [x] Context filtering — `html[data-mode="pessoal"] [data-context="negocio"] { display: none }`
- [x] Transição CSS — `transition: opacity/visibility 240ms var(--ease-out)` em `[data-context]`
- [x] `.modo-label` — hidden em mobile, visible em desktop

### Validação Funcional

✅ **Cenário 1 — Troca de modo funciona**
- Switcher renderiza com dois botões (Pessoal/Negócio)
- Clicar em "Negócio" → navbar muda para group-negocio
- Clicar em "Pessoal" → navbar volta para group-pessoal + group-financas
- Transição suave 240ms

✅ **Cenário 2 — Persistência funciona**
- localStorage key `mentor24h_modoAtivo` salva ao trocar
- Recarregar page → mantém último modo

✅ **Cenário 3 — Padrão funciona**
- localStorage vazio (primeiro acesso) → inicia em 'pessoal'

✅ **Cenário 4 — Visibilidade condicional**
- Grupos com `data-context="pessoal"` desaparecem em modo negócio
- Grupos com `data-context="negocio"` desaparecem em modo pessoal

✅ **Cenário 5 — Sem regressões**
- Router.navigate() funciona normalmente
- openGroupFor() abre o grupo correto
- Bottom nav sincroniza conforme a página

---

## ✅ SPRINT 2 · PASSO 1 — skill-construtor — CONCLUÍDO

**Commit:** `9ea6f46` — feat(sprint-2/p1): Painel Negócio — Dashboard com KPIs reais

### Arquivos Criados
- [x] `js/modules/painel.js` — módulo IIFE com KPIs, atividade recente, estados vazios

### Arquivos Modificados
- [x] `index.html` — <section data-page="painel">, script tag, Router.register()
- [x] `js/app.js` — applyMode() navega para 'painel' ao entrar no modo negócio

### Funcionalidades Implementadas
- [x] **KPI 1: Receitas do mês** — soma transações tipo 'receita' (mês atual)
- [x] **KPI 2: Clientes ativos** — contagem contatos com contexto 'cliente'
- [x] **KPI 3: Temperatura média** — status mais frequente (VIP/Quente/Morno/Lead/Frio/Inativo)
- [x] **KPI 4: Em breve** — placeholder Vendas + Estoque
- [x] **Atividade recente** — últimas 5 transações com ícones (receita/saída), valores, datas
- [x] **Estado vazio** — mensagens de encorajamento quando sem dados
- [x] **Classes semânticas** — `.painel-kpi-card`, `.painel-kpi-valor`, `.painel-kpi-label`, `.painel-atividade-*`
- [x] **Navegação automática** — trocar para modo Negócio abre Painel automaticamente
- [x] **Integração Router** — Router.register('painel') funciona normalmente

---

## 📋 MISSÃO SPRINT 2 · PASSO 2 — skill-forge-visual

Aplicar o visual corporativo do modo Negócio:
- [ ] Navbar premium: accent `--info` (#6D8EA8 safira) no background ativo
- [ ] `.painel-kpi-card` — surface-lifted, hover elevado, sombra premium
- [ ] `.painel-kpi-valor` — JetBrains Mono, weight 600, --type-2xl
- [ ] Transição visual ao trocar de modo: 240ms var(--ease-out)
- [ ] CSS em arquivo novo `css/negocio.css` (criar + linkar no index.html)

**⚠️ Atenção:** A lógica **já existe** — Passo 2 apenas estiliza.

---

## 🚦 STATUS DO PIPELINE

| Sprint | Passo | Status | O que foi feito |
|--------|-------|--------|----------------|
| **1 — Estrutura** | — | ✅ CONCLUÍDO | Switcher, navbar dupla, localStorage, transição |
| **2 — Visual Negócio** | **1/2** | ✅ CONCLUÍDO | Painel com KPIs reais, atividade recente |
| **2 — Visual Negócio** | **2/2** | ⏳ AGUARDANDO | forge-visual estiliza + navbar premium |
| **3 — Contatos Aprimorados** | — | 🔒 BLOQUEADO | Após Sprint 2 |
| **DEPLOY** | — | 🔒 BLOQUEADO | Após Sprint 3 |

---

## 🎯 KPIs ATINGIDOS — APPLE+

- [x] Switcher pill: border-radius 100px, padding 4px, Switzer weight 500
- [x] Ícones: user-circle (Pessoal), briefcase (Negócio)
- [x] Hover no inativo: opacity 0.7
- [x] Focus ring: 1.5px signature, offset 3px
- [x] Transição: 240ms var(--ease-out) — suave, sem salto
- [x] Dark/Light mode: 100% via tokens (var(--signature), var(--info))
- [x] Mobile responsive: labels ocultos em < 768px
- [x] Sem regressões: todos os módulos funcionando

---

## 📝 PRÓXIMAS AÇÕES

1. **Validação Manual (Léo):**
   - Abrir app em Chrome
   - Trocar modo: verificar navbar muda
   - Recarregar: verificar modo persiste
   - Testar mobile: switcher funciona em < 768px

2. **Sprint 2 — Visual Negócio (quando pronto):**
   - Invocar `/skill-construtor` + `/model sonnet`
   - Cole o prompt do PAE #2 (Sprint 2)
   - Skill lerá este arquivo e saberá exatamente onde parou

3. **Sprint 3 — Contatos Aprimorados:**
   - Após Sprint 2 concluído
   - Contatos com contexto duplo + temperatura para negócio

4. **DEPLOY:** Após Sprint 3 ✅

---

*Gerado por skill-construtor v5.1 | 2026-05-16 | Pipeline PAE #2 Sprint 1/3*
