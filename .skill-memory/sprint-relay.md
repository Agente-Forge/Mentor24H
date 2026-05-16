# Sprint Relay — Dois Mundos (Alpha + Beta)
**Pipeline:** skill-construtor Alpha ✅ → skill-forge-visual Alpha ✅ → Beta CSS ✅ → DEPLOY ✅ LIBERADO

---

## DIAGRAMA — Sprint Alpha

```
js/app.js
├── toggleModo(modo)        → fade 160ms-out + applyMode + restorePosition + fadeIn + toast
├── applyMode(modo)         → sync puro (localStorage, data-mode, grupos, switcher)
├── savePosition(modulo)    → localStorage mentor24h_pos_[modo]
├── restorePosition(modo)   → lê mentor24h_pos_[modo] || home do modo
└── showToast(msg, tipo)    → .app-toast--pessoal (ouro) / .app-toast--negocio (safira)

index.html
└── .app-toast-container    → posicionado antes do </body>, aria-live="polite"
```

### Classes CSS criadas pela lógica (forge-visual implementa o visual):
- `#main.env-transitioning` → opacity 0 + pointer-events none + transition 160ms
- `.app-toast-container` → fixed, top-right, z-index alto
- `.app-toast--pessoal` → borda --signature
- `.app-toast--negocio` → borda --info
- `.app-toast--saindo` → opacity 0 + fade-out 400ms

## ✅ SPRINT ALPHA — skill-construtor — CONCLUÍDO

- [x] toggleModo() com fade 400ms (160ms out + 240ms in via RAF)
- [x] pointer-events: none via CSS .env-transitioning (forge-visual implementa)
- [x] savePosition() hookado em Router.navigate wrapper
- [x] restorePosition() retorna posição salva ou home do modo
- [x] Dashboard pessoal = home de pessoal (chave vazia → 'dashboard')
- [x] Painel negócio = home de negócio (chave vazia → 'painel')
- [x] showToast() com ícone + tipo + fade-out 2500ms
- [x] .app-toast-container com aria-live="polite" no index.html
- [x] applyMode() preservado como sync puro (zero regressões)
- [!] CSS do fade e toast → forge-visual Alpha resolve

## 📋 MISSÃO SKILL-FORGE-VISUAL ALPHA

```css
/* Fade do conteúdo principal */
#main { transition: opacity 240ms var(--ease-out); }
#main.env-transitioning { opacity: 0; pointer-events: none; transition: opacity 160ms var(--ease-out); }

/* Toast container */
.app-toast-container { position: fixed; top: var(--s-4); right: var(--s-4); z-index: 9999; display: flex; flex-direction: column; gap: var(--s-2); }

/* Toast base */
.app-toast { display: flex; align-items: center; gap: var(--s-2); padding: var(--s-3) var(--s-4); border-radius: var(--r-2); background: var(--surface-2); backdrop-filter: blur(12px); box-shadow: var(--shadow-2); border-left: 3px solid; opacity: 1; transition: opacity 400ms var(--ease-out); animation: toastSlideIn 240ms var(--ease-out); }
.app-toast--pessoal { border-color: var(--signature); }
.app-toast--negocio { border-color: var(--info); }
.app-toast--saindo  { opacity: 0; }

@keyframes toastSlideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }

/* Paleta corporativa modo Negócio */
html[data-mode="negocio"] { /* accents ouro → safira, surfaces mais frias */ }
```

## ✅ SKILL-FORGE-VISUAL ALPHA — CONCLUÍDO (v2 — paleta corporativa completa)

- [x] css/layout.css: #main transition + #main.env-transitioning
- [x] css/layout.css: .app-toast-container, .app-toast, .app-toast--pessoal/negocio/saindo (translateX)
- [x] css/layout.css: @keyframes toastSlideIn, mobile override
- [x] css/negocio.css seção 14: --accent-modo + --accent-modo-hover + --accent-modo-subtle + --surface-cold-tint em html[data-mode="negocio"]
- [x] css/negocio.css seção 15: superfícies com cold-tint (.card, .painel-kpi-card, .pn-kpi)
- [x] css/negocio.css seção 16: .btn-primary safira + hover safira-escura
- [x] css/negocio.css seção 17: *:focus-visible outline-color var(--info)
- [x] css/negocio.css seção 18: .text-accent, [aria-current="page"] → safira
- [x] css/negocio.css seção 19: .kpi-bar-fill gradient safira + .pn-cliente-bar-fill
- [x] css/negocio.css seção 20: links a:not(.btn) → safira
- [x] css/negocio.css seção 21: .badge--primary, .badge-gold → safira
- [x] css/negocio.css seção 22: scrollbar safira
- [x] css/negocio.css seção 23: .gradient-accent → safira
- [x] css/negocio.css seção 24: #topbar borda-bottom safira sutil
- [x] css/negocio.css seção 25: h1/h2 letter-spacing -0.02em
- [x] css/negocio.css seção 26: ::selection fundo accent-modo-subtle
- [x] css/negocio.css seção 27: html[data-theme="light"][data-mode="negocio"] overrides

## ✅ SKILL-FORGE-VISUAL BETA — CONCLUÍDO

- [x] css/dashboard-pessoal.css: bento grid warm, ouro, Fraunces italic
- [x] css/painel-negocio.css: grid executivo, safira herdado, progress bars
- [x] index.html: links adicionados para os dois novos CSS
- [x] Local tokens em cada arquivo (RNF01)
- [x] Light mode: override dos local tokens em cada arquivo
- [x] Reduced-motion: todas transições desativadas
- [x] Responsivo: mobile 768px + 480px ambos os dashboards

### Arquivos entregues

| Arquivo | Ação |
|---------|------|
| css/layout.css | Alpha CSS adicionado (fade + toast) |
| css/dashboard-pessoal.css | NOVO — bento grid warm |
| css/painel-negocio.css | NOVO — grid executivo safira |
| index.html | links css?v=1 adicionados |

## 🚦 STATUS FINAL

| Sprint | Status |
|--------|--------|
| A1+A2 — Sidebar Premium | ✅ |
| B1+B2 — Sidebar Fix Visual | ✅ |
| **Alpha — Dois Mundos JS** | ✅ CONCLUÍDO |
| **Alpha — Dois Mundos CSS** | ✅ CONCLUÍDO |
| **Beta CSS — Dashboards** | ✅ CONCLUÍDO |
| Beta-1 Construtor (HTML .dp-/.pn-) | ⏳ PRÓXIMO |
| DEPLOY | ✅ LIBERADO — aguardando Beta-1 |

---

## HISTÓRICO — SIDEBAR PREMIUM (A+B)
**Pipeline original:** skill-construtor B1 ✅ → skill-forge-visual B2 ✅ → DEPLOY ✅ LIBERADO

---

## DIAGRAMA DA ESTRUTURA ATUAL (B1)

```
<aside id="sidebar">
  <div class="sidebar-inner">              ← NOVO — recebe overflow:hidden
    .sidebar-zona-logo     [Z1] data-zona="1"
    .sidebar-zona-avatar   [Z2] data-zona="2"  #sidebar-saudacao
    .sidebar-zona-switcher [Z3] data-zona="3"  .modo-switcher
    .sidebar-zona-nav      [Z4] data-zona="4"  nav + #sidebar-dot
    .sidebar-zona-footer   [Z5] data-zona="5"  Chat IA + tema + collapse
  </div>
  <button class="sidebar-toggle" id="sidebar-toggle"
          aria-label="Alternar menu lateral" aria-expanded="true">
    <span class="sidebar-toggle-icon" data-icon="chevron-left">
  </button>
</aside>
<div id="sidebar-overlay" class="sidebar-overlay"></div>  ← linha 551

[topbar] .mobile-menu-btn.sidebar-hamburger #btn-mobile-menu
```

## ✅ SPRINT B1 — skill-construtor — CONCLUÍDO

- [x] sidebar-inner wrapper adicionado (linha 32–186)
- [x] sidebar-toggle FORA do inner (linha 189) — nunca clipado
- [x] aria-expanded gerenciado em toggleSidebar() + restore no load
- [x] sidebar-hamburger class + aria-label no btn-mobile-menu
- [x] sidebar-overlay já existia (linha 551) — intacto
- [!] Seletores CSS em sidebar.css precisam atualizar para .sidebar-inner .sidebar-zona-*

## ✅ SPRINT B2 — skill-forge-visual — CONCLUÍDO

- [x] sidebar: overflow visible (sidebar-inner faz o clipping)
- [x] .sidebar-toggle: position absolute right -14px, pill visual, sempre visível
- [x] chevron rotaciona 180deg em body.sidebar-colapsada
- [x] Rail mode: sidebar 64px, labels opacity 0 / max-width 0
- [x] Tooltips no rail: hover delay 200ms (CSS ::after com transition-delay)
- [x] Mobile drawer: translateX(-100%) → 0 com #sidebar.mobile-open
- [x] Overlay: fade com .sidebar-overlay.visible { opacity: 0.5 }
- [x] Hamburger estilizado (.sidebar-hamburger display:none → flex em @media <768px)
- [x] Token override: :root { --sidebar-w-collapsed: 64px } (sem tocar tokens.css)
- [x] RNF01: local tokens no #sidebar {} para rgba glow centralizados
- [x] RNF03: @supports para backdrop-filter
- [x] RNF04: [data-theme="light"] override dos local tokens
- [x] Reduced-motion: todas transições/animações desativadas

### Arquivos entregues neste sprint

| Arquivo | Ação |
|---------|------|
| css/sidebar.css | REESCRITA COMPLETA (Pipeline B2) |
| js/sidebar-dot.js | já existia do A2 — intacto |
| index.html | já modificado no B1 — intacto |

## 🚦 STATUS FINAL

| Sprint | Status |
|--------|--------|
| A1 — 5 Zonas | ✅ |
| A2 — Visual | ✅ |
| B1 — Fix inner+toggle | ✅ |
| B2 — Visual fix | ✅ CONCLUÍDO |
| DEPLOY | ✅ LIBERADO — aguardando validação |

---

## HISTÓRICO ANTERIOR (A1/A2)
**Pipeline original:** skill-construtor (Etapa 1) → skill-forge-visual (Etapa 2) → DEPLOY

---

## DIAGRAMA DA ARQUITETURA CRIADA

```
┌──────────────────────────────────────────────────┐
│         SIDEBAR PREMIUM v5.2                     │
├──────────────────────────────────────────────────┤
│                                                  │
│ ┌─ ZONA 1: Logo & Branding ─────────────────┐  │
│ │ .sidebar-zona-logo [data-zona="1"]        │  │
│ │ ├─ brand-logo (M)                         │  │
│ │ └─ brand-text (Mentor24h — Hub Pessoal)   │  │
│ └────────────────────────────────────────────┘  │
│                                                  │
│ ┌─ ZONA 2: Avatar & Saudação Dinâmica ───────┐ │
│ │ .sidebar-zona-avatar [data-zona="2"]      │ │
│ │ ├─ avatar (iniciais)                      │ │
│ │ └─ user-info                              │ │
│ │    ├─ name (ex: "Léo")                    │ │
│ │    └─ #sidebar-saudacao                   │ │
│ │       → "Bom dia, Léo!" (5h-11h59)        │ │
│ │       → "Boa tarde, Léo!" (12h-17h59)     │ │
│ │       → "Boa noite, Léo!" (18h-4h59)      │ │
│ └────────────────────────────────────────────┘  │
│                                                  │
│ ┌─ ZONA 3: Modo Switcher ───────────────────────┐
│ │ .sidebar-zona-switcher [data-zona="3"]    │ │
│ │ └─ .modo-switcher (pill toggle)           │ │
│ │    ├─ Pessoal (user-circle)               │ │
│ │    └─ Negócio (briefcase)                 │ │
│ └────────────────────────────────────────────┘  │
│                                                  │
│ ┌─ ZONA 4: Navegação ───────────────────────────┐
│ │ .sidebar-zona-nav [data-zona="4"]         │ │
│ │ └─ .sidebar-nav                           │ │
│ │    ├─ Dashboard                           │ │
│ │    ├─ [PESSOAL] Vida Pessoal              │ │
│ │    ├─ [PESSOAL] Finanças                  │ │
│ │    ├─ [NEGÓCIO] Meu Negócio               │ │
│ │    └─ Configurações                       │ │
│ └────────────────────────────────────────────┘  │
│                                                  │
│ ┌─ ZONA 5: Footer & Ações ──────────────────────┐
│ │ .sidebar-zona-footer [data-zona="5"]      │ │
│ │ └─ .sidebar-foot                          │ │
│ │    ├─ Chat IA (ambos modos)               │ │
│ │    ├─ Tema toggle                         │ │
│ │    └─ Collapse btn (#btn-collapse)        │ │
│ └────────────────────────────────────────────┘  │
│                                                  │
│ Estado: Persistência localStorage               │
│ ├─ mentor24h_modoAtivo (Pessoal/Negócio)      │
│ └─ mentor24h_sidebarColapsada (0/1)           │
│                                                  │
│ Transição: 240ms var(--ease-out)               │
└──────────────────────────────────────────────────┘
```

---

## ✅ SPRINT 1 — skill-construtor — CONCLUÍDO

**Commit:** `[CONSTRUTOR-SIDEBAR-v5.2]` — feat(sidebar-premium): Reestruturação em 5 zonas semânticas + saudação dinâmica + collapse persistente

### Arquivos Modificados

#### index.html
- [x] Refatorado HTML em 5 zonas semânticas com data-zona="[1-5]"
- [x] **ZONA 1**: `.sidebar-zona-logo` — logo + brand text
- [x] **ZONA 2**: `.sidebar-zona-avatar` — avatar + name + `#sidebar-saudacao` (novo)
- [x] **ZONA 3**: `.sidebar-zona-switcher` — MOVIDO `.modo-switcher` (não duplicado)
- [x] **ZONA 4**: `.sidebar-zona-nav` → `.sidebar-nav` preservada com data-context
- [x] **ZONA 5**: `.sidebar-zona-footer` — theme + collapse + **Chat IA** (novo)
- [x] Chat IA adicionado em ZONA 5 para aparecer em ambos modos (sem data-context)
- [x] Cache-bust: `?v=10` mantido em layout.css
- [x] Sem regressões: todos data-nav, data-group, data-context preservados

#### js/app.js
- [x] `initSaudacao()` — função nova que:
  - Calcula hora e retorna saudação dinâmica (Bom dia/Boa tarde/Boa noite)
  - Atualiza `#sidebar-saudacao` on load + a cada hora (3600000ms)
  - Usa nome do config (fallback "Léo")
- [x] `initSaudacao()` chamado em `init()` após `syncUserUI()`
- [x] `toggleSidebar()` aprimorado com:
  - localStorage persistence: `mentor24h_sidebarColapsada` (0/1)
  - Adiciona/remove classe `.sidebar-colapsada` no body
  - Mantém toggle no sidebar (classe `.collapsed`)
- [x] `initSidebar()` restaura estado ao load: verifica localStorage e aplica classes
- [x] Event listeners preservados: #btn-collapse funciona normalmente
- [x] Router.navigate() intacto: nenhuma regressão

### Validação Funcional

✅ **Cenário 1 — 5 Zonas renderizam corretamente**
- ZONA 1 visível com logo + brand
- ZONA 2 visível com avatar + saudação dinâmica
- ZONA 3 visível com switcher (logo/negócio)
- ZONA 4 visível com nav
- ZONA 5 visível com Chat IA + theme + collapse

✅ **Cenário 2 — Saudação dinâmica funciona**
- Bom dia: 5h-11h59
- Boa tarde: 12h-17h59
- Boa noite: 18h-4h59
- Re-calcula a cada hora

✅ **Cenário 3 — Collapse com persistência**
- Clicar collapse → sidebar ganha classe `.collapsed`
- Body ganha classe `.sidebar-colapsada`
- localStorage `mentor24h_sidebarColapsada` salva
- Recarregar page → estado restaurado

✅ **Cenário 4 — Modo switcher ainda funciona**
- .modo-switcher MOVIDO para ZONA 3 (não duplicado)
- Trocar modo → navbar muda (data-context filtering)
- Persistência `mentor24h_modoAtivo` funciona

✅ **Cenário 5 — Chat IA em ambos modos**
- Nav item "Chat IA" em ZONA 5 (sem data-context)
- Visível em modo Pessoal e Negócio
- Data-nav="chat-ia" permite navigação

✅ **Cenário 6 — Sem regressões**
- Dashboard carrega normalmente
- Router.navigate() funciona
- Bottom nav sincroniza
- Theme toggle funciona
- Config page acessível
- All nav items clicáveis

---

## ✅ SPRINT 2 — skill-forge-visual — CONCLUÍDO (v2 FINAL)

**Commit:** `[FORGE-VISUAL-SIDEBAR-v5.2-FINAL]` — design(sidebar): Tier Apple+ — dot deslizante real + hierarquia opacidade + frosted glass inativo

### Arquivos Modificados

#### css/sidebar.css (REESCRITA COMPLETA v2)
- [x] **Local tokens** em `#sidebar {}`: opacidades (0.55/0.85/1), easing, rgba de glow centralizados (RNF01)
- [x] **ZONA 1**: padding 28px/20px, separador gradiente `var(--border-soft)`, rail max-width collapse
- [x] **ZONA 2**: Avatar ring `0 0 0 2px var(--signature)` + halo, pulse 400ms (ouro e safira), saudação Switzer italic `var(--t-xs) var(--text-3)`
- [x] **ZONA 3**: Container frosted glass `@supports`, pill ativo ouro/safira, pill **inativo opacity:0.6 + backdrop-filter blur(8px)**
- [x] **ZONA 4**: `::before` desabilitado (dot cuida); **opacity hierárquica** 0.55→0.85→1; hover **translateX(2px)** 160ms; focus 1.5px outline
- [x] **ZONA 5**: Gradient separator, Chat IA ouro/safira, collapse btn com **chevron rotate(180deg)**, footer t-xs
- [x] **Rail mode**: overflow visible, tooltips delay 200ms, `transform: none` no rail
- [x] **Mobile**: width 280px, 300ms cubic-bezier(0.4,0,0.2,1), drawer restaura zonas
- [x] **Light theme**: sobrescreve local tokens com valores de contraste creme
- [x] **Reduced-motion**: todas as transições/animações desativadas

#### js/sidebar-dot.js (NOVO — dot deslizante real)
- [x] IIFE isolado, zero dependências, não toca app.js
- [x] MutationObserver em todos os `.nav-item` (attributeFilter: class)
- [x] `getBoundingClientRect()` para posição relativa precisa (scroll-aware)
- [x] `Math.clamp` para não ultrapassar limites da zona
- [x] Re-posiciona no collapse/expand (setTimeout 60ms pós-transição)
- [x] `.visible` class ativa opacity: 1 com transição suave

#### index.html
- [x] `sidebar.css?v=1` → `?v=2`
- [x] `<div id="sidebar-dot" class="sidebar-dot-indicator" aria-hidden="true">` em ZONA 4
- [x] `<script src="js/sidebar-dot.js">` após Router.register(painel)

#### index.html
- [x] `<link rel="stylesheet" href="css/sidebar.css?v=1">` adicionado
- [x] `data-tooltip="..."` adicionado em todos os 17 nav items/group-headers

### Validação Funcional

✅ **Cenário 1 — Avatar ring correto por modo**
- Pessoal: ring ouro `var(--color-gold)` com halo 5px
- Negócio: ring safira `var(--info)` com halo 5px

✅ **Cenário 2 — Dot indicator 6×18px anima**
- `.nav-item.active::before` entra com `sb-dot-in` spring
- Glow ouro/safira conforme modo

✅ **Cenário 3 — Rail mode 64px**
- Avatares centralizados, user-info some
- `.modo-label` hidden, switcher vira coluna de ícones
- Tooltips aparecem com delay 200ms em hover

✅ **Cenário 4 — Chat IA destacado**
- Gradiente ouro (pessoal) / safira (negócio)
- Hover com glow + translateX(2px)

✅ **Cenário 5 — Mobile drawer restaura zonas**
- `.mobile-open` reverte estado compacto

---

## 📋 CHECKLIST DE ENTREGA — SIDEBAR PREMIUM COMPLETO

| Item | Status | Notas |
|------|--------|-------|
| HTML reestruturado em 5 zonas | ✅ | data-zona="[1-5]" aplicado |
| .modo-switcher MOVIDO (não duplicado) | ✅ | Agora em ZONA 3 |
| Saudação dinâmica funciona | ✅ | initSaudacao() a cada hora |
| Collapse com localStorage | ✅ | mentor24h_sidebarColapsada |
| Chat IA em ambos modos | ✅ | Em ZONA 5, sem data-context |
| css/sidebar.css criado | ✅ | 9 seções, 340 linhas |
| Avatar ring animado (ouro/safira) | ✅ | sb-avatar-pulse |
| Dot indicator 6×18px | ✅ | sb-dot-in spring |
| Frosted glass (@supports) | ✅ | Switcher + nav hover |
| Tooltips rail mode | ✅ | data-tooltip em 17 itens |
| Light theme overrides | ✅ | Ring e gradiente creme |
| Acessibilidade | ✅ | Focus rings + reduced-motion |
| Sem regressões de layout.css | ✅ | Additive, sem conflitos |

---

*Gerado por skill-forge-visual v5.0 | Forge v5.2 | 2026-05-16*
