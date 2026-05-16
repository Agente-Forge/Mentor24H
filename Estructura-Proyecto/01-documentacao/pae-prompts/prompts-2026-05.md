# PAE Prompts — Maio 2026
**Projeto:** Mentor24h | **Gerado por:** skill-pae v1.0
**Caminho do projeto:** `c:\Users\Usuário\Desktop\Curso Claude Code-Jhonatan de Souza\controle-financeiro v2`

---

## Entrada #1 — 2026-05-15

**Solicitação original do Léo:**
> "Na página pessoal em Contatos temos 3 botões: card, lista e Kanban. Quero substituir o Kanban por um sistema de Temperatura de Contatos — classificar contatos como Quente/VIP/Morno/Lead/Frio/Inativo com cores, para saber quais clientes compram sempre, de vez em quando, ou ainda não fecharam negócio."

**Decisão do Board PAE:**
- Kanban substituído completamente pelo sistema Temperatura de Contatos
- 6 status com identidade visual por cor usando paleta OBSIDIAN
- Botão "Kanban" renomeado para "Temperatura"

---

```
🤖 SKILL:       skill-construtor + skill-forge-visual
🧠 LLM:         Sonnet 4.6 → use /model sonnet
⚙️ INTENSIDADE:  High
🎨 TIER:        APPLE+

cd "c:\Users\Usuário\Desktop\Curso Claude Code-Jhonatan de Souza\controle-financeiro v2"
```

---

### PROMPT TÉCNICO COMPLETO

Você é um Engenheiro de Software Principal + Diretor de Design no Forge v5.2.

**PROJETO:** Mentor24h  
**STACK:** HTML + CSS + JS puro | localStorage | Design System OBSIDIAN EDITORIAL  
**DESIGN SYSTEM:** Paleta OBSIDIAN (--signature: #D4A574 ouro líquido), Fraunces + Switzer + JetBrains Mono  
**CONTEXTO COMPLETO EM:** `Estructura-Proyecto/01-documentacao/pae-prompts/_CONTEXTO-IA.md`

**OBJETIVO:**  
Substituir completamente a view "Kanban" do módulo Contatos por um sistema de "Temperatura de Contatos" — uma classificação visual por nível de relacionamento/engajamento do contato. O botão "Kanban" na interface deve ser renomeado para "Temperatura". O Kanban atual deve ser removido. A nova view deve exibir os contatos organizados por temperatura com cores distintas da paleta OBSIDIAN.

**REQUISITOS FUNCIONAIS:**

- RF01: Renomear o botão "Kanban" para "Temperatura" na barra de visualização do módulo Contatos
- RF02: Criar 6 status de temperatura com cor e label em PT-BR:
  - 🔴 **VIP** — cor: `--signature` (#D4A574 ouro) — cliente premium, sempre presente
  - 🟠 **Quente** — cor: `--warning` (#C49454 âmbar) — compra frequente, ativo
  - 🟡 **Morno** — cor: `#8B9A6E` (verde-oliva suave) — compra ocasionalmente
  - 🔵 **Lead** — cor: `--info` (#6D8EA8 safira) — nunca comprou, prospect
  - 🟢 **Frio** — cor: `--text-quiet` (#7B8088 cinza) — inativo há muito tempo
  - ⚫ **Inativo** — cor: `--text-mute` (#4D5258 grafite) — sem engajamento
- RF03: View Temperatura exibe colunas verticais (ou horizontal scroll no mobile) — uma coluna por status
- RF04: Cada card de contato dentro da coluna mostra: nome, foto/avatar, tag de temperatura colorida, botão de ação rápida (WhatsApp/telefone)
- RF05: Ao clicar em um contato na view Temperatura, abrir o modal de detalhes do contato (comportamento igual às views Card e Lista)
- RF06: Poder alterar a temperatura de um contato diretamente na view — via dropdown ou clique no badge de temperatura
- RF07: Temperatura padrão para novos contatos: "Lead" (azul)
- RF08: Contatos sem temperatura definida aparecem como "Lead" automaticamente
- RF09: A temperatura deve ser persistida no localStorage junto com os dados do contato
- RF10: Remover completamente o código do Kanban do módulo Contatos (kanban-contatos) — o Kanban global (tasks.md / js/modules/kanban.js) NÃO deve ser tocado

**REQUISITOS NÃO-FUNCIONAIS:**

- RNF01: Layout responsivo — mobile: scroll horizontal por coluna | desktop: colunas lado a lado
- RNF02: Dark e Light mode compatível usando tokens OBSIDIAN
- RNF03: Animação de transição ao trocar temperatura: `transition: 240ms var(--ease-out)`
- RNF04: Sem regressões nas views "Card" e "Lista" do módulo Contatos
- RNF05: Performance — sem re-renders desnecessários do localStorage

**ARQUIVOS A ALTERAR:**

- `js/modules/contatos.js` → adicionar lógica da view Temperatura + remover lógica Kanban-contatos + adicionar campo `temperatura` ao schema do contato
- `css/contatos.css` (ou equivalente) → estilos da view Temperatura, colunas, badges de cor por status
- `index.html` → atualizar label do botão "Kanban" → "Temperatura" na seção de Contatos

**NÃO ALTERAR:**

- `js/modules/kanban.js` → Kanban GLOBAL (tarefas) não tem relação com este Kanban
- `css/tokens.css` → fonte de verdade do design system, não modificar
- `js/core/` → lógica central não deve ser tocada
- Qualquer módulo fora do escopo de Contatos

**PADRÃO DE QUALIDADE:**  
Tier APPLE+: feature visível ao usuário, hero da página de Contatos.  
- Badges de temperatura com tipografia Switzer, peso 500, tamanho --type-sm (13px)
- Colunas da view Temperatura com cabeçalho usando Fraunces italic para o nome do status
- Hover nos cards: `transform: translateY(-1px); box-shadow: var(--shadow-elevated);`
- Focus ring: `outline: 1.5px solid var(--signature); outline-offset: 3px;`
- Separador visual entre colunas: `border-right: 1px solid var(--border-soft)`
- Baseline: acabamento premium equivalente ou superior ao padrão Apple. Sem bordas genéricas, sem sombras `rgba(0,0,0,0.1)` padrão.

**CRITÉRIOS DE ACEITAÇÃO:**

```
Cenário 1 — View Temperatura carrega
GIVEN usuário está no módulo Contatos
WHEN clica no botão "Temperatura" (antigo Kanban)
THEN vê 6 colunas — VIP / Quente / Morno / Lead / Frio / Inativo
     com os contatos distribuídos conforme temperatura salva

Cenário 2 — Alterar temperatura de contato
GIVEN contato "João" está em "Morno"
WHEN usuário clica no badge de temperatura do João e seleciona "VIP"
THEN João move para coluna VIP, badge muda para cor ouro (--signature)
     E mudança é persistida no localStorage imediatamente

Cenário 3 — Novo contato criado
GIVEN usuário cria novo contato "Maria" sem definir temperatura
WHEN acessa view Temperatura
THEN Maria aparece na coluna "Lead" (azul) automaticamente

Cenário 4 — Edge case: todas as colunas vazias
GIVEN nenhum contato tem temperatura definida
WHEN acessa view Temperatura
THEN vê 6 colunas com estado vazio elegante
     "Nenhum contato aqui ainda" em --voice-whisper

Cenário 5 — Mobile
GIVEN usuário em tela < 768px
WHEN abre view Temperatura
THEN colunas com scroll horizontal, sem quebra de layout
```

**PLANO DE VALIDAÇÃO:**

1. Testar views Card, Lista e Temperatura em desktop (Chrome)
2. Testar mobile (< 768px) — scroll horizontal das colunas
3. Verificar dark e light mode (tokens OBSIDIAN aplicados)
4. Criar contato → verificar temperatura padrão "Lead"
5. Trocar temperatura → verificar localStorage atualizado
6. Confirmar que Kanban global (tarefas) não foi afetado
7. Atualizar FORGE-CHECKLIST.md ao finalizar

**CHECKLIST FINAL:**

- [ ] Botão "Kanban" renomeado para "Temperatura" na UI
- [ ] 6 colunas de temperatura com cores corretas da paleta OBSIDIAN
- [ ] Alterar temperatura funciona e persiste no localStorage
- [ ] Novos contatos começam como "Lead"
- [ ] View responsiva (mobile + desktop)
- [ ] Dark/Light mode compatível com tokens
- [ ] Kanban global (tarefas) não foi tocado
- [ ] Sem regressões nas views Card e Lista
- [ ] FORGE-CHECKLIST.md atualizado

---

*Entrada #1 gerada por skill-pae v1.0 em 2026-05-15*

---

## Entrada #2 — 2026-05-16

**Solicitação original do Léo:**
> "Quero dividir o Mentor24h em dois modos — Pessoal e Negócio — como o Nubank faz com conta pessoal e PJ. Cada modo com sua própria navbar e experiência. O modo ativo deve ser lembrado ao reabrir o app."

**Decisão do Board PAE:**
- Pipeline de 3 sprints aprovado: Estrutura → Experiência Negócio → Contatos Negócio
- Esta entrada cobre o Sprint 1: switcher + duas navbars + routing + persistência
- Sprints 2 e 3 serão entradas separadas quando solicitados

---

```
🤖 SKILL:       skill-construtor
🧠 LLM:         Sonnet 4.6
⚙️ INTENSIDADE:  High
🎨 TIER:        APPLE+
📍 ETAPA:       Sprint 1 de 3 — Estrutura Dual-Mode

cd "c:\Users\Usuário\Desktop\Curso Claude Code-Jhonatan de Souza\controle-financeiro v2"
```

**CONTEXTO DO PIPELINE**
O Mentor24h está sendo transformado em app dual-mode (Pessoal/Negócio).
Sprint 1 implementa a fundação: switcher, duas navbars, routing, persistência.

**REQUISITOS FUNCIONAIS:**
- RF01: Switcher pill toggle Pessoal/Negócio no topo da sidebar
- RF02: Navbar Pessoal: Dashboard · Agenda · Tarefas · Saúde · Contatos · Finanças
- RF03: Navbar Negócio: Painel · Clientes · Produtos · Vendas · Estoque · Relatórios
- RF04: Troca de modo sem reload, navbar atualiza imediatamente
- RF05: Persistência em localStorage — chave `mentor24h_modoAtivo`
- RF06: Inicia no último modo usado (padrão: Pessoal)
- RF07: Saudação no header adaptada por modo

**ARQUIVOS A ALTERAR:**
- `index.html` → switcher UI + data-mode no elemento raiz da nav
- `css/pages.css` → estilos pill switcher + visibilidade por modo
- `js/core/app.js` (ou equivalente) → lógica switcher + localStorage + saudação

**NÃO ALTERAR:** css/tokens.css | js/modules/kanban.js | js/modules/contatos.js

**PADRÃO:** Tier APPLE+ — pill toggle com border-radius 100px, tokens OBSIDIAN,
transição 240ms var(--ease-out), ícones SVG por modo.

**RELAY:** Criar .skill-memory/sprint-relay.md ao concluir com diagrama + missão Sprint 2.
**HANDOFF:** NÃO commitar — Sprint 2 e 3 ainda pendentes.

---

*Entrada #2 gerada por skill-pae v2.0 em 2026-05-16*

---

## Entrada #3 — 2026-05-16

**Solicitação original do Léo:**
> "gera o Sprint 2"

**Decisão do Board PAE:**
- Sprint 2 tem 2 skills: skill-construtor (Painel + KPIs) → skill-forge-visual (visual corporativo)
- KPIs usam dados reais de Finanças e Contatos; Vendas/Estoque com placeholder "Em breve"
- css/negocio.css criado scoped em .modo-negocio — zero impacto no modo Pessoal
- HANDOFF do forge-visual lembra: implementar Temperatura ANTES do Sprint 3

**Pipeline Sprint 2:**
- Passo 1: skill-construtor → cria painel.js + KPIs reais + classes semânticas
- Passo 2: skill-forge-visual → cria css/negocio.css + accent safira + visual premium

**Arquivos criados/alterados:**
- `js/modules/painel.js` (novo)
- `css/negocio.css` (novo)
- `index.html` (link do negocio.css + section painel)

**RELAY:** Atualizar sprint-relay.md em ambos os passos.
**HANDOFF:** NÃO commitar — Sprint 3 ainda pendente. Implementar Temperatura primeiro.

---

*Entrada #3 gerada por skill-pae v2.0 em 2026-05-16*

---

## Entrada #4 — 2026-05-16

**Solicitação original do Léo:**
> "fera Sprint 3" (typo para "gera o Sprint 3")

**Decisão do Board PAE:**
- Sprint 3 = último sprint do pipeline Dual-Mode
- 1 skill: skill-construtor → estende contatos.js com campos CRM no modo Negócio
- Campos aditivos: tipo (cliente/fornecedor/parceiro), etiquetas, ID, histórico de interações
- HANDOFF inclui commit + push + deploy — pipeline completo após este sprint
- Dependência: implementar Temperatura (Entrada #1) ANTES de executar

**Pipeline Sprint 3:**
- skill-construtor → estende schema + modal CRM + badges no modo Negócio

**Arquivos alterados:**
- `js/modules/contatos.js` (campo negocio{} + lógica condicional por modo)
- `css/negocio.css` (estilos .ctto-negocio-* para badges e seções)

**RELAY:** Selar sprint-relay.md como pipeline completo — DEPLOY liberado.
**HANDOFF:** Último sprint — commit + push + GitHub Pages deploy após validação.

---

*Entrada #4 gerada por skill-pae v2.0 em 2026-05-16*

---

## Entrada #5 — 2026-05-16

**Solicitação original do Léo:**
> "o menu lateral está feio mal desenhado... quero algo como ninguém nunca viu...
>  [logo + nome Mentor24H sozinhos no topo] [foto + Léo abaixo] [Pessoal/Negócio abaixo]
>  [nav items com bolinha acesa deslizante] [Chat AI + Config + Dark/Light no rodapé]
>  pode fechar para ganhar espaço, saudação dinâmica, nada junto ao logo, nunca"

**Forma profissional:**
> "Redesign completo da sidebar em layout 5 zonas — logo isolada, avatar com ring de modo,
>  switcher reposicionado, nav com dot indicator deslizante e frosted glass, footer global
>  com Chat AI em ambos os modos — collapse para rail mode no desktop, drawer no mobile.
>  Saudação dinâmica por horário. Tier APPLE+."

**Decisão do Board PAE:**
- Pipeline de 2 skills: skill-construtor (HTML 5 zonas + JS collapse + saudação) → skill-forge-visual (CSS premium total)
- Chat AI confirmado em AMBOS os modos (Pessoal e Negócio)
- Collapse habilitado no desktop; mobile usa drawer
- Saudação dinâmica: Bom dia / Boa tarde / Boa noite, Léo!
- COMMIT apenas após skill-forge-visual concluir

---

```
🤖 SKILL:       skill-construtor → skill-forge-visual
🧠 LLM:         Sonnet 4.6 → use /model sonnet
⚙️ INTENSIDADE:  High
🎨 TIER:        APPLE+

cd "c:\Users\Usuário\Desktop\Curso Claude Code-Jhonatan de Souza\controle-financeiro v2"
```

---

### PROMPT 1 de 2 — SKILL-CONSTRUTOR

Você é um Engenheiro de Software Principal + Lead Architect no Forge v5.2.

**PROJETO:** Mentor24h
**STACK:** HTML + CSS + JS puro | localStorage | Design System OBSIDIAN EDITORIAL
**PROMPT COMPLETO EM:** `Estructura-Proyecto/01-documentacao/pae-prompts/prompts-2026-05.md` — entrada #5

**CONTEXTO COMPARTILHADO DO PIPELINE:**
Redesign completo da sidebar do Mentor24h em layout 5 zonas premium. A sidebar atual
tem o switcher Pessoal/Negócio mal posicionado (junto ao logo no topo). O objetivo é
criar uma sidebar que ninguém nunca viu — 5 zonas com propósito, lógica de collapse
e saudação dinâmica por horário. Este pipeline tem 2 skills: você faz estrutura + JS;
a skill-forge-visual faz todo o CSS premium.

**SUA MISSÃO ESPECÍFICA — SKILL-CONSTRUTOR:**
Reestruturar o HTML da sidebar em 5 zonas semânticas + implementar lógica JS:
collapse/expand e saudação dinâmica por horário. Entregar classes CSS limpas
para a skill-forge-visual trabalhar. ZERO CSS de aparência nesta etapa.

**LAYOUT ALVO (5 zonas):**
```
┌──────────────────────────────┐
│ ZONA 1: logo + "Mentor24H"   │  ← fixo, NADA MAIS nessa linha
├──────────────────────────────┤
│ ZONA 2: [Foto] Léo           │  ← avatar + nome + saudação dinâmica
├──────────────────────────────┤
│ ZONA 3: [Pessoal] [Negócio]  │  ← pill switcher (MOVER do topo atual)
├──────────────────────────────┤
│ ZONA 4: nav items            │  ← muda por modo
├──────────────────────────────┤
│ ZONA 5: Chat AI              │  ← em AMBOS os modos
│         Configurações        │
│         Dark/Light toggle    │
└──────────────────────────────┘
```

**REQUISITOS FUNCIONAIS:**

- RF01: Reestruturar HTML da sidebar em 5 zonas com classes semânticas:
  - `.sidebar-zona-logo` → Zona 1: logo SVG + texto "Mentor24H"
  - `.sidebar-zona-avatar` → Zona 2: foto + nome + `span.sidebar-saudacao`
  - `.sidebar-zona-switcher` → Zona 3: pill toggle (MOVER do topo — não duplicar)
  - `.sidebar-zona-nav` → Zona 4: lista nav (reorganizar, manter data-mode)
  - `.sidebar-zona-footer` → Zona 5: Chat AI + Configurações + Dark/Light toggle
  - `data-zona="1"` a `data-zona="5"` em cada zona

- RF02: Saudação dinâmica (Zona 2) — atualizar no load e a cada hora:
  - 05h–11h59 → "Bom dia, Léo!"
  - 12h–17h59 → "Boa tarde, Léo!"
  - 18h–04h59 → "Boa noite, Léo!"

- RF03: Chat AI em AMBAS as navbars (Pessoal e Negócio) — Zona 5

- RF04: Collapse/expand da sidebar para desktop:
  - Ao colapsar: `body` recebe classe `.sidebar-colapsada`
  - Botão toggle na borda da sidebar: ícone chevron
  - Estado persistido: localStorage key `mentor24h_sidebarColapsada`
  - Mobile: collapse desabilitado (CSS trata com drawer)

- RF05: Mover switcher do topo para Zona 3 — remover da posição atual, NÃO duplicar

- RF06: Preservar TODOS os event listeners, data-mode e lógica de routing existentes

- RF07: Adicionar ao AGENTS.md o padrão de classes `.sidebar-*`

**REQUISITOS NÃO-FUNCIONAIS:**
- RNF01: Zero CSS de aparência — apenas classes estruturais
- RNF02: Padrão IIFE existente do projeto mantido no JS
- RNF03: Sem dependências novas — vanilla JS puro

**ARQUIVOS A ALTERAR:**
- `index.html` → reestruturar sidebar em 5 zonas (PRINCIPAL)
- `js/core/app.js` → lógica collapse + saudação dinâmica

**NÃO ALTERAR:**
- `css/tokens.css` | `css/*.css` (qualquer CSS de aparência)
- `js/modules/*` → nenhum módulo de feature

**PADRÃO DE QUALIDADE:**
Tier APPLE+: HTML semântico, classes descritivas, data-attributes em vez de IDs,
prefixo `.sidebar-*` para namespace limpo, JS modular sem inline handlers.

**CHECKLIST FINAL:**
- [ ] HTML 5 zonas com classes `.sidebar-zona-*` e `data-zona=[1-5]`
- [ ] Saudação dinâmica por horário funcionando
- [ ] Collapse/expand com `.sidebar-colapsada` + localStorage
- [ ] Chat AI em ambas as navbars (Zona 5)
- [ ] Switcher movido para Zona 3 — removido da posição antiga
- [ ] Routing e features existentes sem regressão
- [ ] FORGE-CHECKLIST.md atualizado

**RELAY PROTOCOL — AO FINALIZAR (OBRIGATÓRIO):**
Criar `.skill-memory/sprint-relay.md` com:
```
# Sprint Relay — Sidebar Premium
Atualizado por: skill-construtor em [data]

## DIAGRAMA DO QUE FOI CONSTRUÍDO
index.html
├── .sidebar-zona-logo     [Z1] → logo + "Mentor24H"
├── .sidebar-zona-avatar   [Z2] → foto + nome + .sidebar-saudacao
├── .sidebar-zona-switcher [Z3] → pill toggle (movido)
├── .sidebar-zona-nav      [Z4] → nav items por modo
└── .sidebar-zona-footer   [Z5] → Chat AI + Config + Toggle

js/core/app.js
├── initSaudacao()          → saudação por horário, atualiza a cada hora
└── toggleSidebarCollapse() → collapse + body.sidebar-colapsada + localStorage

## ✅ SKILL-CONSTRUTOR — CONCLUÍDO
- [x] HTML 5 zonas com data-zona=[1-5]
- [x] Saudação dinâmica por horário
- [x] Collapse/expand com .sidebar-colapsada + localStorage
- [x] Chat AI nas duas navbars
- [!] Classes CSS são APENAS estruturais — toda aparência aguarda forge-visual

## 📋 MISSÃO SKILL-FORGE-VISUAL
- [ ] Zona 1: logo minimal isolado, zero ornamento
- [ ] Zona 2: avatar ring colorido por modo (ouro=Pessoal, safira=Negócio)
- [ ] Zona 3: pill toggle premium — frosted glass inativo, 240ms sliding
- [ ] Zona 4: dot indicator deslizante, frosted glass inativos, filled/outline icons
- [ ] Zona 5: footer sutil, dark/light toggle elegante, Chat AI destacado
- [ ] Collapse: rail mode 64px com tooltip no hover, chevron rotaciona
- [ ] Mobile: drawer lateral com overlay
- [ ] Divisórias premium entre zonas com gradiente

## 🚦 STATUS DO PIPELINE
skill-construtor:   ✅ CONCLUÍDO
skill-forge-visual: ⏳ AGUARDANDO
DEPLOY:             🔒 BLOQUEADO até forge-visual concluir
```

**HANDOFF — O QUE FAZER AO TERMINAR:**
```
✅ [ETAPA 1/2 CONCLUÍDA — O QUE FAZER AGORA]

O que foi feito:
• HTML da sidebar reestruturado em 5 zonas semânticas
• Saudação dinâmica por horário (Bom dia/Boa tarde/Boa noite, Léo!)
• Collapse/expand com persistência em localStorage
• Chat AI em ambas as navbars
• Switcher movido para Zona 3

⛔ NÃO commite ainda — pipeline incompleto.

Próxima etapa:
→ Abra uma NOVA conversa no Claude Code
→ Invoque: /skill-forge-visual com /model sonnet
→ Cole o PROMPT [2 de 2] que o PAE gerou
→ A skill vai ler .skill-memory/sprint-relay.md e saberá exatamente o que fazer
→ Commit acontece somente após etapa 2
```

---

### PROMPT 2 de 2 — SKILL-FORGE-VISUAL

Você é um Diretor de Design + Engenheiro Visual Principal no Forge v5.2.

**PROJETO:** Mentor24h
**STACK:** HTML + CSS puro | Design System OBSIDIAN EDITORIAL
**DESIGN SYSTEM:** `--signature: #D4A574` (ouro), `--info: #6D8EA8` (safira), `--warning: #C49454`, Fraunces + Switzer + JetBrains Mono
**PROMPT COMPLETO EM:** `Estructura-Proyecto/01-documentacao/pae-prompts/prompts-2026-05.md` — entrada #5

**CONTEXTO COMPARTILHADO DO PIPELINE:**
Redesign completo da sidebar em 5 zonas premium. A skill-construtor já reestruturou o HTML.
Você herda uma sidebar com 5 zonas semânticas e classes limpas. Sua missão: criar o CSS
que transforma esta sidebar em uma experiência que ninguém nunca viu.

**SUA MISSÃO ESPECÍFICA — SKILL-FORGE-VISUAL:**
Criar `css/sidebar.css` (arquivo novo, dedicado) com todo o visual premium das 5 zonas.
Dot indicator deslizante, avatar ring animado, frosted glass, rail mode, drawer mobile.

**O QUE VOCÊ HERDA (já feito pela skill-construtor):**
Leia PRIMEIRO: `.skill-memory/sprint-relay.md`
- HTML com `.sidebar-zona-[logo|avatar|switcher|nav|footer]` e `data-zona=[1-5]`
- JS: body recebe `.sidebar-colapsada` ao colapsar; `.modo-negocio` para modo ativo
- Saudação dinâmica já no DOM (`.sidebar-saudacao`)
- Chat AI em ambas as navbars (Zona 5)

**ESPECIFICAÇÃO VISUAL DAS 5 ZONAS:**

**ZONA 1 — Logo:**
- Só logo SVG + "Mentor24H" em Fraunces italic, `var(--type-lg)`
- `padding-top: 28px`, `padding-bottom: 20px`
- Nada mais — zona isolada, intocável
- No rail mode: texto some com `opacity: 0; max-width: 0`

**ZONA 2 — Avatar:**
- Ring circular: `2px solid var(--signature)` no modo Pessoal
- Override em `.modo-negocio`: `2px solid var(--info)` (safira)
- Animação ao trocar modo: ring pulse 400ms
- Nome: Switzer 500, `var(--type-sm)`
- Saudação: Switzer 400 italic, `var(--text-quiet)`, `var(--type-xs)`
- Separador: `linear-gradient(90deg, transparent, var(--border-soft), transparent)`

**ZONA 3 — Switcher pill:**
- Container: `var(--surface-secondary)`, `border-radius: 100px`, `padding: 3px`
- Tab ativa: `background var(--signature)` ou `var(--info)`, cor `var(--bg)`
- Tab inativa: `backdrop-filter: blur(8px)`, `opacity: 0.6`
- Transição sliding pill: `240ms var(--ease-out)`

**ZONA 4 — Nav Items (HERO — máxima atenção):**
- Dot indicator à esquerda: `position: absolute`, bolinha `6px × 18px`, `border-radius: 3px`
  - Cor: `var(--signature)` Pessoal / `var(--info)` Negócio
  - Transição: `transform: translateY()` `300ms cubic-bezier(0.4, 0, 0.2, 1)`
- Item ativo: ícone filled, Switzer 600, `opacity: 1`
- Item inativo: ícone outline, `opacity: 0.55`
- Hover: `opacity: 0.85`, `translateX(2px)`, `160ms ease`
- Focus ring: `outline: 1.5px solid var(--signature); outline-offset: 3px`

**ZONA 5 — Footer:**
- Separador superior: gradient que some nas bordas
- Itens: `var(--type-xs)`, menos destaque que nav
- Chat AI: destaque sutil — sempre presente
- Dark/Light toggle: switch elegante (não botão genérico)

**COLLAPSE / RAIL MODE:**
- `240px` → `64px`: `transition: width 240ms var(--ease-out)`
- Textos: `opacity: 0; max-width: 0; overflow: hidden`
- Tooltip no hover: nome do item aparece à direita com `delay: 200ms`
- Chevron: `transform: rotate(180deg)` ao colapsar, `transition: 240ms`

**MOBILE DRAWER:**
- `position: fixed; transform: translateX(-100%); width: 280px`
- Quando `.sidebar-aberta`: `translateX(0)`
- Overlay: `.sidebar-overlay`, `opacity: 0.5`, `background: var(--bg)`
- Animação: `cubic-bezier(0.4, 0, 0.2, 1) 300ms`

**REQUISITOS NÃO-FUNCIONAIS:**
- RNF01: Zero cores hardcoded — apenas tokens `var(--*)`
- RNF02: Zero sombras `rgba(0,0,0,0.1)` genéricas — usar `var(--shadow-*)`
- RNF03: `backdrop-filter` com `@supports` fallback
- RNF04: Dark e Light mode automático via tokens OBSIDIAN
- RNF05: Divisórias sempre via gradient — nunca border sólida genérica

**ARQUIVOS A CRIAR/ALTERAR:**
- `css/sidebar.css` (NOVO) → todo o CSS premium
- `index.html` → apenas adicionar `<link>` do sidebar.css
- `css/negocio.css` → override do avatar ring (`.modo-negocio .sidebar-avatar-ring`)

**NÃO ALTERAR:**
- `css/tokens.css` | `js/core/app.js` | qualquer JS

**PADRÃO DE QUALIDADE:**
Tier APPLE+: dot indicator deslizante, frosted glass, ring animado, rail mode, drawer.
A sidebar deve provocar "UAU" em 3 segundos. Budget de inovação: total.
Baseline: acabamento premium equivalente ou superior ao padrão Apple.

**CRITÉRIOS DE ACEITAÇÃO:**
```
Cenário 1 — Dot indicator:
  GIVEN usuário está em "Dashboard"
  WHEN clica em "Contatos"
  THEN bolinha desliza de Dashboard para Contatos em 300ms

Cenário 2 — Avatar ring por modo:
  GIVEN modo Pessoal (ring ouro)
  WHEN troca para Negócio
  THEN ring muda para safira com pulse 400ms

Cenário 3 — Rail mode:
  GIVEN sidebar expandida (240px)
  WHEN clica no chevron
  THEN sidebar vai para 64px, textos somem, ícones com tooltip no hover

Cenário 4 — Mobile drawer:
  GIVEN tela < 768px
  WHEN abre app
  THEN sidebar oculta, hamburger visível, overlay ao abrir

Cenário 5 — Dark/Light mode:
  GIVEN qualquer modo
  WHEN troca tema
  THEN todos os tokens atualizam — zero cor quebrada
```

**CHECKLIST FINAL:**
- [ ] `css/sidebar.css` criado — 5 zonas com CSS premium
- [ ] Dot indicator deslizante na Zona 4
- [ ] Avatar ring por modo (ouro/safira) na Zona 2
- [ ] Frosted glass nos itens inativos
- [ ] Rail mode 64px com tooltips (desktop)
- [ ] Drawer mobile com overlay (< 768px)
- [ ] Dark e Light mode — todos os tokens corretos
- [ ] Zero hardcoded colors, zero sombras genéricas
- [ ] FORGE-CHECKLIST.md atualizado

**RELAY PROTOCOL — AO FINALIZAR (OBRIGATÓRIO):**
Atualizar `.skill-memory/sprint-relay.md`:
```
## ✅ SKILL-FORGE-VISUAL — CONCLUÍDO
- [x] css/sidebar.css criado — [X] linhas
- [x] 5 zonas com acabamento APPLE+

## 🚦 STATUS DO PIPELINE
skill-construtor:   ✅ CONCLUÍDO
skill-forge-visual: ✅ CONCLUÍDO
DEPLOY:             ✅ LIBERADO — aguardando validação do usuário
```

**HANDOFF — O QUE FAZER AO TERMINAR:**
```
✅ [ETAPA 2/2 CONCLUÍDA — PIPELINE SIDEBAR COMPLETO]

O que foi feito:
• css/sidebar.css criado com visual premium das 5 zonas
• Dot indicator deslizante, avatar ring, frosted glass
• Rail mode 64px com tooltips (desktop)
• Drawer mobile com overlay (< 768px)

VALIDAÇÃO FINAL:
[ ] Desktop — 5 zonas com acabamento premium
[ ] Collapse/expand — tooltips no rail mode
[ ] Troca de modo — ring do avatar atualiza com pulse
[ ] Dark e Light mode verificados
[ ] Mobile < 768px — drawer abre/fecha com overlay
[ ] Nenhuma feature existente regrediu

Validação ok? Confirme para commit e deploy:

  git add index.html css/sidebar.css css/negocio.css js/core/app.js
  git commit -m "feat(sidebar): redesign premium 5 zonas — Forge v5.2 APPLE+ appetite-M"
  git push origin main

  ⏳ GitHub Pages: deploy automático em ~60 segundos

⚠️ AGUARDAR CONFIRMAÇÃO DO USUÁRIO ANTES DE EXECUTAR GIT.
```

---

*Entrada #5 gerada por skill-pae v2.0 em 2026-05-16*
