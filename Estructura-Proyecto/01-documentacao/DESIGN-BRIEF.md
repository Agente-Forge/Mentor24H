# 🎨 DESIGN-BRIEF — Mentor24h

**Versão:** 1.1  
**Data:** 2026-05-12  
**Status:** ✅ APROVADO POR LÉO (decisões abaixo)  
**Autor:** Claude (Opus) + briefing original do Léo  
**Fonte de verdade para:** skill-forge-visual + skill-construtor

---

## ✅ DECISÕES APROVADAS (12/05/2026)

| Decisão | Escolha de Léo |
|---------|----------------|
| **Paleta de Cores** | 🪨 **C — OBSIDIAN** (pedra vulcânica + ouro líquido) |
| **Tipografia** | ✒️ **Combo 1 — Editorial Premium** (Fraunces + Switzer + JetBrains Mono) |
| **Intensidade** | 🔥 **Total** — começar do zero, CSS completamente novo |

**Conceito final:** Mentor24h será um produto com personalidade **OBSIDIAN EDITORIAL** — alta tecnologia silenciosa com tipografia editorial premium.

---

## 📋 ÍNDICE

1. [Briefing Original do Léo](#briefing-original)
2. [Análise de Referências Premium](#análise-de-referências)
3. [Filosofia: "Quiet Intelligence"](#filosofia-quiet-intelligence)
4. [3 Paletas de Cores Propostas](#3-paletas-propostas)
5. [Tipografia: 3 Combinações Únicas](#tipografia-3-combinações)
6. [Princípios de Design](#princípios-de-design)
7. [Sistema de Tokens](#sistema-de-tokens)
8. [Conceito de Componentes](#conceito-de-componentes)
9. [Microinterações & Motion](#microinterações)
10. [Próximos Passos](#próximos-passos)

---

## 1. BRIEFING ORIGINAL

> *Resumido do prompt do Léo (12/05/2026):*

**Objetivo:** Redesign completo do Mentor24h para nível SaaS premium de classe mundial.

**Referências citadas:** Apple, Linear, Notion, Stripe, Arc Browser, Raycast, Superhuman.

**Eliminar:**
- Aparência genérica de templates AI
- Excesso de brilhos/neon/glow
- Gradientes previsíveis
- Aurora atual (considerado genérico pelo Léo)
- Glassmorphism padrão

**Diretrizes do Léo:**
- "Não quero nada genérico parecido ter sido feito por AI"
- "Quero algo inovador, bem pensado e totalmente funcional"
- "Não manter Aurora/glassmorphism — está parecendo genérico"
- "Pesquise os sites mais premiados, premium, únicos"

---

## 2. ANÁLISE DE REFERÊNCIAS

### 🔍 O que torna "premium" verdadeiramente premium?

Após pesquisa profunda em 2026:

| Marca | Personalidade Visual | Lição-chave |
|-------|---------------------|-------------|
| **Linear (2025+)** | Monochrome quase total, cor só por função | Restrição radical = sofisticação |
| **Stripe** | Roxo signature + Tiempos editorial | Brand hue em CADA superfície |
| **Vercel** | Black/white absoluto + Geist | Precisão como identidade |
| **Raycast** | Dark chrome + accent gradient único | Materialidade de "metal escovado" |
| **Apple 2025 (Liquid Glass)** | Translucência que reage à luz | Depth substituiu shadow |
| **Notion** | Cinzas quentes + ilustração custom | Calor humano em tech app |
| **Arc Browser** | Cores saturadas em superfícies escuras | Ousadia controlada |

### 🚨 O QUE FAZ DESIGN PARECER "FEITO POR AI"

Pesquisa 2025 identificou os sinais:

1. ❌ **Gradientes roxo-rosa-azul saturados** (cliché AI)
2. ❌ **Glassmorphism sem propósito** (efeito sem função)
3. ❌ **Inter + cinzas flat (#808080)** — neutros sem temperatura
4. ❌ **Cards "bento" simétricos previsíveis**
5. ❌ **Ícones Lucide/Heroicons sem customização**
6. ❌ **Cor #6366F1 (indigo padrão Tailwind)**
7. ❌ **Sombra `0 4px 6px rgba(0,0,0,0.1)`** padrão
8. ❌ **Bordas arredondadas de 12px em tudo**
9. ❌ **Animação `fade-in-up` em hero**
10. ❌ **Dark mode = inverter cores**

### ✅ O QUE FAZ DESIGN PARECER FEITO POR HUMANO PREMIUM

1. ✅ **Neutros com temperatura** (warm ou cool, nunca flat)
2. ✅ **UMA cor signature** (não 5 acentos)
3. ✅ **Tipografia com personalidade** (não Inter por padrão)
4. ✅ **Espaçamento assimétrico intencional**
5. ✅ **Densidade variável por contexto**
6. ✅ **Ícones com peso/estilo customizado**
7. ✅ **Sombras com cor** (não preto puro)
8. ✅ **Bordas variáveis** (cards = 6px, modais = 18px)
9. ✅ **Motion com easing único** (não cubic-bezier padrão)
10. ✅ **Dark mode com paleta independente**

---

## 3. FILOSOFIA: "QUIET INTELLIGENCE"

### O conceito

**"Inteligência Silenciosa"** — o Mentor24h não grita por atenção. Ele organiza, sussurra, mentora.

Como um **bom mentor humano**: presente, atento, mas nunca invasivo. Profundo, mas calmo. Profissional, mas caloroso.

### Inspirações filosóficas (não-óbvias)

| Referência | O que extrair |
|------------|---------------|
| **Cadernos Moleskine Pro** | Papel cremoso, tipografia editorial, encadernação calma |
| **Hotel Bulgari** | Luxo discreto, neutros quentes, materiais nobres |
| **Apollo Magazine** | Hierarquia editorial confiante, sem ruído |
| **Apartamentos Muji** | Vazio intencional, função é a beleza |
| **Relógios Patek Philippe** | Precisão silenciosa, complicação sob calma aparente |
| **Cafés Aesop** | Madeira, latão, tipografia serifada confiante |
| **Studio Ghibli** | Calor humano em tecnologia |

### O QUE Mentor24h NÃO É

- ❌ NÃO é "mais um SaaS de dashboard"
- ❌ NÃO é "Notion-clone"
- ❌ NÃO é "Linear-clone"  
- ❌ NÃO é "Apple-clone"
- ❌ NÃO é "AI tool com gradientes roxos"

### O QUE Mentor24h É

✅ É um **caderno digital de luxo** que escuta, organiza e mentora  
✅ É **um mordomo discreto** com inteligência artificial  
✅ É **um ateliê pessoal** onde vida e negócio coabitam com elegância  
✅ É **um produto que ENVELHECE BEM** — atemporal, não tendência

---

## 4. 3 PALETAS PROPOSTAS

> *Léo escolhe UMA. Todas são únicas, com temperatura, sem clichês AI.*

---

### 🎨 PALETA A — "ATELIER"

**Conceito:** Workshop francês/italiano. Latão envelhecido, papel kraft, couro vintage.

#### Dark Mode
```
─────────────────────────────────────
SUPERFÍCIES
  --bg-canvas:       #0C0C0D  (carvão profundo, NUNCA #000)
  --bg-surface:      #161618  (carvão suave)
  --bg-elevated:     #1F1F22  (elevação calma)
  --bg-sunken:       #08080A  (poço — modais por baixo)

TEXTO (creme quente, jamais branco gelado)
  --text-prime:      #F5F3EF  (creme premium)
  --text-secondary:  #B5B2AB  (creme empoeirado)
  --text-quiet:      #8B8A85  (sussurro)
  --text-mute:       #5C5B57  (quase invisível)

ACENTO SIGNATURE (latão, único)
  --signature:       #C8A876  (latão envelhecido)
  --signature-soft:  #8B6F3F  (latão escuro)
  --signature-glow:  #E8C896  (latão brilhante)

ESTADOS
  --critical:        #B85A3C  (terracota italiana)
  --success:         #6A8E5C  (verde sálvia)
  --warning:         #C18845  (âmbar terroso)
  --info:            #6B8EA8  (azul-pedra)

BORDAS
  --border-faint:    rgba(245,243,239,0.06)
  --border-soft:     rgba(245,243,239,0.10)
  --border-strong:   rgba(245,243,239,0.16)
─────────────────────────────────────
```

#### Light Mode
```
SUPERFÍCIES (papel premium)
  --bg-canvas:       #F7F5F0  (papel kraft cremoso)
  --bg-surface:      #FFFFFF  (papel limpo)
  --bg-elevated:     #FCFAF5  (papel destacado)
  --bg-sunken:       #EFEDE6  (papel rebaixado)

TEXTO
  --text-prime:      #1A1A1D  (tinta nanquim)
  --text-secondary:  #4A4A4D
  --text-quiet:      #6E6D68
  --text-mute:       #9A9892

ACENTO
  --signature:       #8B6F3F  (latão escuro para contraste)
  --signature-soft:  #C8A876
  --signature-glow:  #6B5028
```

**Quando funciona:** Editorial premium, sensação de revista, atemporal.  
**Personalidade:** Calmo, confiante, atemporal.  
**Risco:** Pode parecer "vintage" se mal executado.

---

### 🎨 PALETA B — "TOKYO AFTER HOURS"

**Conceito:** Tóquio noturno. Madeira tokoname, laca vermelha, washi paper, neon discreto.

#### Dark Mode
```
SUPERFÍCIES (azul-noite profundo, não preto)
  --bg-canvas:       #0A0B0E  (céu noturno Tokyo)
  --bg-surface:      #131418  (madeira escura)
  --bg-elevated:     #1B1D22  (mesa de bar)
  --bg-sunken:       #060709  (sombra de viela)

TEXTO (washi paper)
  --text-prime:      #ECEAE4  (papel japonês)
  --text-secondary:  #B0AEA8
  --text-quiet:      #7E7F87  (cinza azulado quente)
  --text-mute:       #4F505A

ACENTO SIGNATURE (madeira tokoname)
  --signature:       #B89F7E  (madeira cerâmica)
  --signature-soft:  #6F5E40  (madeira escura)
  --signature-glow:  #D4BC98  (madeira clarinha)

HIGHLIGHT (azul-aço japonês)
  --highlight:       #7896A8  (azul-aço)
  --highlight-soft:  #4E6675

ESTADOS
  --critical:        #9F4A48  (laca vermelha)
  --success:         #5C8362  (chá-verde escuro)
  --warning:         #B8853F  (akabeko amarelo)
  --info:            #6B8FA8  (azul-aço)
```

#### Light Mode
```
SUPERFÍCIES
  --bg-canvas:       #F4F2EC  (washi paper)
  --bg-surface:      #FFFFFF
  --bg-elevated:     #FAF8F2
  --bg-sunken:       #EBE9E2

TEXTO
  --text-prime:      #15161A  (tinta sumi)
  --text-secondary:  #4F505A
  --text-quiet:      #7E7F87
  --text-mute:       #B0AEA8

ACENTO
  --signature:       #6F5E40  (madeira escura)
  --signature-glow:  #B89F7E
```

**Quando funciona:** Sofisticação asiática, calma editorial, originalidade.  
**Personalidade:** Reflexivo, profundo, único.  
**Risco:** Precisa execução cuidadosa.

---

### 🎨 PALETA C — "OBSIDIAN"

**Conceito:** Alta tecnologia silenciosa. Pedra vulcânica polida, grafite, ouro líquido raro.

#### Dark Mode
```
SUPERFÍCIES (pedra vulcânica)
  --bg-canvas:       #0B0D0F  (obsidiana)
  --bg-surface:      #14171A  (grafite)
  --bg-elevated:     #1D2125  (grafite polido)
  --bg-sunken:       #07090B  (cavidade)

TEXTO
  --text-prime:      #EAECF0  (gelo polido)
  --text-secondary:  #ABB0B8
  --text-quiet:      #7B8088  (cinza-azulado quente)
  --text-mute:       #4D5258

ACENTO SIGNATURE (ouro líquido — único, raro)
  --signature:       #D4A574  (ouro envelhecido)
  --signature-soft:  #8B6F4A
  --signature-glow:  #E8C898

ESTADOS (saturação controlada)
  --critical:        #C0524D  (rubi profundo)
  --success:         #5C8E6E  (jade)
  --warning:         #C49454  (âmbar fumê)
  --info:            #6D8EA8  (safira opaca)

EFEITO ESPECIAL
  --depth-glow:      rgba(212,165,116,0.08)  (aura sutil)
  --depth-shadow:    rgba(7,9,11,0.6)
```

#### Light Mode
```
SUPERFÍCIES (pedra polida clara)
  --bg-canvas:       #F8F7F4  (pedra calcária)
  --bg-surface:      #FFFFFF
  --bg-elevated:     #FBFAF6
  --bg-sunken:       #EDECE7

TEXTO
  --text-prime:      #1A1C20  (grafite escuro)
  --text-secondary:  #4D5258
  --text-quiet:      #7B8088
  --text-mute:       #ABB0B8

ACENTO
  --signature:       #8B6F4A  (ouro fosco)
  --signature-glow:  #6B5028
```

**Quando funciona:** Tecnologia premium, sensação de "produto raro".  
**Personalidade:** Técnico, denso, silenciosamente luxuoso.  
**Risco:** Mais técnico, menos editorial.

---

## 5. TIPOGRAFIA: 3 COMBINAÇÕES ÚNICAS

> *Léo escolhe UMA. Todas são open-source ou tem alternativa gratuita.*

---

### ✒️ COMBO 1 — "EDITORIAL PREMIUM" (Recomendado)

**Personalidade:** Revista premium, ateliê, confiança editorial.

```
DISPLAY (títulos, hero, números grandes)
  Font: Fraunces (variável, open-source)
  Source: Google Fonts
  Weight axis: 100-900
  Slant: -10 a 0
  Optical Size: 9-144
  
  Por quê?
  ✅ TEM personalidade (NÃO é Inter)
  ✅ Variável = controle absoluto
  ✅ Itálico expressivo (perfeito para hero)
  ✅ Inspirada em tipografia editorial dos anos 70

UI / BODY (interface, parágrafos)
  Font: Switzer (open-source, Fontshare)
  Source: https://www.fontshare.com/fonts/switzer
  Weight: 300, 400, 500, 600, 700
  
  Por quê?
  ✅ Swiss precision sem ser Inter (overused)
  ✅ Alternativa free ao Söhne ($$$)
  ✅ Funciona em 10px-72px sem ajustes

NUMÉRICO / TÉCNICO (valores, código, IDs)
  Font: JetBrains Mono (open-source)
  Source: https://www.jetbrains.com/lp/mono/
  Weight: 400, 500, 700
  
  Por quê?
  ✅ Ligaduras para código (=>, ===, !=)
  ✅ Tabular numbers para valores financeiros
  ✅ Open-source profissional
```

**Visual de exemplo:**
```
┌────────────────────────────────────┐
│ Boa noite, Léo.            [Fraunces Italic 32px]
│ Você tem 3 compromissos.   [Switzer 14px]
│                                    │
│ R$ 12.847,50              [JetBrains Mono 28px]
│ saldo atual               [Switzer 12px]
└────────────────────────────────────┘
```

---

### ✒️ COMBO 2 — "TECH MINIMALISTA"

**Personalidade:** Vercel-like, precisão, tecnologia silenciosa.

```
DISPLAY + UI
  Font: Geist (variável, open-source)
  Source: https://vercel.com/font
  Weight: 100-900
  
NUMÉRICO
  Font: Geist Mono
  Source: mesmo pacote
  
DISPLAY EDITORIAL (opcional, para hero)
  Font: Geist Display (subset)
```

**Risco:** Pode parecer "Vercel demais" — depende da execução.

---

### ✒️ COMBO 3 — "EDITORIAL CONTEMPORÂNEO"

**Personalidade:** Ousada, moderna, agressivamente editorial.

```
DISPLAY (hero, headlines)
  Font: Instrument Serif (open-source, Google Fonts)
  Inspirada em: Editorial New (premium)
  Weight: 400 + Italic
  
UI / BODY
  Font: Inter Display (versão display do Inter, mais polida)
  Weight: 400, 500, 600
  
NUMÉRICO
  Font: Geist Mono
```

**Risco:** Instrument Serif é tendência — pode envelhecer.

---

## 6. PRINCÍPIOS DE DESIGN

### Os 6 Pilares "Quiet Intelligence"

#### 1. **SILÊNCIO VISUAL**
> "Nada compete por atenção. Tudo respira."

- Máximo de 3 elementos em destaque por tela
- Hierarquia clara: 1 primário, 1 secundário, demais terciários
- Espaço em branco = luxo, não desperdício

#### 2. **HIERARQUIA EDITORIAL**
> "Como uma revista premium, não como um app SaaS."

- Tipografia faz hierarquia (não cor)
- Tamanhos com proporção dourada (1.414, 1.618)
- Headlines podem ser GRANDES (60-120px) em hero

#### 3. **CALOR DISCRETO**
> "Neutros NUNCA são flat grey. Sempre warm ou cool."

- Todo cinza tem temperatura (#7E7F87 vs #808080)
- Sombras têm cor (não preto puro)
- Brand hue toca CADA superfície (1-3% opacidade)

#### 4. **DENSIDADE CONSIDERADA**
> "Espaço por contexto. Dashboard ≠ Lista ≠ Modal."

- Dashboard: respirável (24-32px padding)
- Lista: denso mas legível (12-16px)
- Modal: focado, generoso (40px+)

#### 5. **TEMPO COMO MATERIAL**
> "Animações respiram. Nunca decoração."

- Easing único: `cubic-bezier(0.32, 0.72, 0, 1)` (snappy mas calmo)
- Duração: 180-240ms (não 500ms padrão)
- Cada animação tem PROPÓSITO (não fade-in random)

#### 6. **PROFUNDIDADE INTENCIONAL**
> "Apple Liquid Glass principle: depth conveys hierarchy."

- 4 níveis de elevação: canvas → surface → elevated → floating
- Cada nível com sombra+luz dedicada
- Materialidade física (papel, vidro, metal, pedra)

---

## 7. SISTEMA DE TOKENS

### Arquitetura de 3 camadas

```
┌──────────────────────────────────┐
│ TOKENS PRIMITIVOS                │  ← cores brutas, escalas
│ --color-stone-900: #14171A      │
│ --space-base: 4px                │
└──────────────────────────────────┘
                ↓
┌──────────────────────────────────┐
│ TOKENS SEMÂNTICOS                │  ← propósito
│ --bg-surface: var(--color-stone-900)│
│ --space-card: calc(var(--space-base) * 6)│
└──────────────────────────────────┘
                ↓
┌──────────────────────────────────┐
│ TOKENS DE COMPONENTE             │  ← contexto específico
│ --card-bg: var(--bg-surface)     │
│ --card-padding: var(--space-card) │
└──────────────────────────────────┘
```

### Escalas Base

```css
/* SPACING — múltiplos de 4 com pulos editoriais */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;

/* RADIUS — variável por contexto */
--radius-sharp: 2px;      /* badges, chips */
--radius-soft: 6px;       /* botões, inputs */
--radius-card: 10px;      /* cards padrão */
--radius-feature: 16px;   /* destaques */
--radius-modal: 20px;     /* modais grandes */
--radius-pill: 999px;     /* tags, avatars */

/* TYPE SCALE — proporção 1.250 (musical fourth) */
--type-xs: 11px;     /* labels, captions */
--type-sm: 13px;     /* meta info */
--type-base: 15px;   /* body */
--type-lg: 18px;     /* destaque */
--type-xl: 24px;     /* h3 */
--type-2xl: 32px;    /* h2 */
--type-3xl: 44px;    /* h1 */
--type-4xl: 60px;    /* display */
--type-5xl: 84px;    /* hero */
--type-6xl: 120px;   /* statement */

/* LINE HEIGHT */
--lh-tight: 1.05;     /* display */
--lh-snug: 1.2;       /* headings */
--lh-normal: 1.5;     /* body */
--lh-relaxed: 1.7;    /* prose */

/* MOTION */
--ease-out: cubic-bezier(0.32, 0.72, 0, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

--duration-instant: 80ms;
--duration-fast: 160ms;
--duration-base: 240ms;
--duration-slow: 360ms;
--duration-deliberate: 520ms;

/* SHADOW (com COR, não preto puro) */
--shadow-quiet: 0 1px 2px rgba(11,13,15,0.04), 0 0 0 1px rgba(11,13,15,0.04);
--shadow-soft: 0 2px 8px rgba(11,13,15,0.08), 0 0 0 1px rgba(11,13,15,0.06);
--shadow-elevated: 0 8px 24px rgba(11,13,15,0.12), 0 2px 4px rgba(11,13,15,0.08);
--shadow-floating: 0 20px 50px rgba(11,13,15,0.20), 0 8px 16px rgba(11,13,15,0.12);
```

---

## 8. CONCEITO DE COMPONENTES

### Nomenclatura própria (anti-genérico)

Em vez de `btn-primary`, `card-elevated`, `text-muted` (todo SaaS faz):

```
BOTÕES → CONTROLS
  .control-prime      (ação principal)
  .control-quiet      (ação secundária)  
  .control-ghost      (ação terciária)
  .control-critical   (ação destrutiva)

CARDS → SURFACES
  .surface-canvas     (background)
  .surface-flat       (card padrão)
  .surface-lifted     (card destacado)
  .surface-floating   (modal/overlay)

TEXTO → VOICE
  .voice-statement    (display)
  .voice-prime        (heading)
  .voice-body         (parágrafo)
  .voice-quiet        (secundário)
  .voice-whisper      (terciário)

ESPAÇOS → BREATH
  .breath-tight       (compacto)
  .breath-normal      (padrão)
  .breath-generous    (respirável)
  .breath-vast        (hero)
```

### Componentes Signature (únicos do Mentor24h)

1. **The Plinth** — card com base sutil + elevação variável
2. **The Whisper Bar** — search/command com tipografia editorial
3. **The Ledger** — lista financeira com tabular nums + linhas finas
4. **The Conversation Bubble** — chat AI com tipografia editorial
5. **The Almanac** — agenda com proporção de cartão postal
6. **The Compass** — sidebar com indicador de profundidade

---

## 9. MICROINTERAÇÕES

### Filosofia: "Animações respiram, não decoram"

#### Hover (interação)
```
ANTES (genérico AI):
  transform: scale(1.05);
  transition: 300ms;

DEPOIS (Mentor24h):
  transform: translateY(-1px);
  box-shadow: var(--shadow-lifted);
  transition: 
    transform 180ms var(--ease-out),
    box-shadow 180ms var(--ease-out);
```

#### Press feedback
```
DEPOIS:
  transform: translateY(0) scale(0.98);
  transition: 80ms var(--ease-out);
```

#### Focus ring (editorial, não box-shadow)
```
DEPOIS:
  outline: 1.5px solid var(--signature);
  outline-offset: 3px;
  /* sem box-shadow azul padrão */
```

#### State transitions
```
DEPOIS:
  /* Tab switch — desliza horizontalmente */
  transition: opacity 240ms var(--ease-out),
              transform 360ms var(--ease-spring);
```

#### Loading (não spinners genéricos)
```
DEPOIS:
  /* Texto editorial pulsando */
  "Pensando…" com fade in/out a 1.2s
  + linha fina horizontal que pulsa
```

---

## 10. PRÓXIMOS PASSOS

### Roadmap de Implementação (5 Fases)

```
✅ FASE 0 — BRIEFING (você está aqui)
   └─ DESIGN-BRIEF.md criado
   └─ Léo aprova: paleta + tipografia + filosofia

⏳ FASE 1 — DESIGN SYSTEM FOUNDATION (1 sessão, 2-3h)
   └─ tokens.css completo (primitivos + semânticos)
   └─ typography.css com 3 fontes integradas
   └─ theme.css com dark/light toggle
   └─ motion.css com easings + durations

⏳ FASE 2 — COMPONENTES CORE (1 sessão, 2-3h)
   └─ Controls (buttons em 4 variantes)
   └─ Surfaces (cards em 4 níveis)
   └─ Voice (sistema tipográfico aplicado)
   └─ Form elements (inputs, selects, toggles)

⏳ FASE 3 — NAVEGAÇÃO + DASHBOARD (1-2 sessões)
   └─ Sidebar premium (Compass component)
   └─ Top bar contextual
   └─ Dashboard refeito (Plinth cards)
   └─ Mobile bottom nav redesigned

⏳ FASE 4 — PÁGINAS ESPECÍFICAS (2-3 sessões)
   └─ Chat AI (Conversation Bubble)
   └─ WhatsApp CRM (refinado)
   └─ Agenda (Almanac)
   └─ Finanças (Ledger)

⏳ FASE 5 — POLISH + MICROINTERAÇÕES (1 sessão)
   └─ Hover/focus/press states finais
   └─ Loading states
   └─ Empty states
   └─ Light mode toggle funcional
```

---

## ✅ DECISÕES QUE LÉO PRECISA TOMAR

Antes de seguir para FASE 1, preciso de 3 decisões:

### 1. PALETA DE CORES
- [ ] **A — ATELIER** (latão envelhecido, papel kraft, editorial francês)
- [ ] **B — TOKYO AFTER HOURS** (madeira tokoname, laca vermelha, washi)
- [ ] **C — OBSIDIAN** (pedra vulcânica, ouro líquido, alta tecnologia)
- [ ] Outro (descrever)

### 2. TIPOGRAFIA
- [ ] **Combo 1 — EDITORIAL PREMIUM** (Fraunces + Switzer + JetBrains Mono) ⭐
- [ ] **Combo 2 — TECH MINIMALISTA** (Geist + Geist Mono)
- [ ] **Combo 3 — EDITORIAL CONTEMPORÂNEO** (Instrument Serif + Inter Display + Geist Mono)
- [ ] Outro (descrever)

### 3. INTENSIDADE DA TRANSFORMAÇÃO
- [ ] **Total** — começar do zero, novo CSS, novo HTML estrutural
- [ ] **Faseada** — manter HTML, refazer CSS gradualmente
- [ ] **Híbrida** — refazer componentes-chave (Dashboard, Sidebar) primeiro

---

## 📝 NOTAS FINAIS

### Por quê este brief é diferente

1. **Pesquisa real:** 6 pesquisas em fontes reais (Awwwards, Linear, Apple HIG 2025, Stripe, Vercel)
2. **Anti-AI conscious:** Identificou 10 sinais de "feito por AI" para EVITAR
3. **Filosofia própria:** "Quiet Intelligence" — não copia ninguém
4. **3 paletas autorais:** Nenhuma é Tailwind padrão ou indigo genérico
5. **Tipografia justificada:** Cada fonte tem razão técnica + cultural
6. **Sistema de tokens 3 camadas:** Arquitetura escalável
7. **Nomenclatura própria:** Controls/Surfaces/Voice/Breath (não btn/card/text)

### Riscos identificados

⚠️ **Risco 1:** Sem fontes corretas instaladas → fallback ruim  
**Mitigação:** Carregar via @import de Fontshare/Google Fonts

⚠️ **Risco 2:** Light mode mal executado → parecer "dark invertido"  
**Mitigação:** Light mode é PALETA INDEPENDENTE, não inversão

⚠️ **Risco 3:** Microinterações excessivas → app lento  
**Mitigação:** Animações apenas em interação direta (hover, click, focus)

⚠️ **Risco 4:** Demanda além do escopo de uma sessão  
**Mitigação:** Plano em 5 fases, cada uma autônoma

---

## 📚 FONTES DE PESQUISA

- [Linear Brand Guidelines](https://linear.app/brand)
- [Awwwards Annual Awards 2025](https://www.awwwards.com/annual-awards-2025/)
- [Apple HIG 2025 — Liquid Glass](https://developer.apple.com/design/human-interface-guidelines/)
- [Best Fonts for Web 2025 — Shakuro](https://shakuro.com/blog/best-fonts-for-web-design)
- [Fontshare — Switzer](https://www.fontshare.com/fonts/switzer)
- [Premium Color Decisions — Stackademic](https://blog.stackademic.com/color-decision-premium-ui-design-d6890efe11ba)
- [How to Use AI Without Losing Brand Distinctiveness — Bolder](https://www.bolderagency.com/journal/how-design-teams-can-use-ai-without-losing-brand-distinctiveness)
- [Vercel Geist Font](https://vercel.com/font)
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/)
- [Google Fonts — Fraunces](https://fonts.google.com/specimen/Fraunces)

---

**Status:** ⏳ AGUARDANDO DECISÕES DO LÉO (paleta + tipografia + intensidade)  
**Próxima skill:** skill-forge-visual (após aprovação)  
**Próxima ação:** Léo escolhe + Claude implementa FASE 1
