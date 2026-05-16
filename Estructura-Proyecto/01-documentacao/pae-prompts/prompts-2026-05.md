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

---

## Entrada #6 — 2026-05-16

**Solicitação original do Léo:**
> "quando eu fecho o menu lateral no computador ele só fecha e eu não tenho a opção de
>  expandir ele novamente / quando ele fecha os ícones ficam tudo estranho e aparecendo /
>  falta algo para eu conseguir abrir o menu lateral no computador novamente /
>  no mobile está normal e só no modo desktop / se quiser revisar os dois modos e melhorar,
>  enriqueça essa ideia"

**Forma profissional:**
> "Bug fix: sidebar collapse desktop — 3 problemas: botão toggle some ao colapsar (dentro
>  do overflow:hidden), ícones quebrados no rail, sem forma de reabrir. Fix: adicionar
>  .sidebar-inner wrapper + mover toggle para fora. Enriquecimento: tooltips no rail,
>  chevron rotativo, hamburger mobile, overlay drawer."

**Causa raiz identificada pelo PAE:**
O .sidebar-toggle estava DENTRO do container com overflow:hidden. Ao colapsar para 64px,
o botão era clipado junto com o conteúdo — tornando impossível reabrir a sidebar.

**Decisão do Board PAE:**
- Fix cirúrgico: .sidebar-inner wrapper + toggle fora do wrapper
- Enriquecimento desktop: chevron sempre visível na borda, tooltips rail mode 200ms
- Enriquecimento mobile: hamburger fixo no header, overlay ao abrir drawer
- Pipeline: skill-construtor (HTML fix) → skill-forge-visual (CSS fix + enriquecimento)

---

```
🤖 SKILL:       skill-construtor → skill-forge-visual
🧠 LLM:         Sonnet 4.6 → use /model sonnet
⚙️ INTENSIDADE:  Low (construtor) + Medium (forge-visual)
🎨 TIER:        APPLE+

cd "c:\Users\Usuário\Desktop\Curso Claude Code-Jhonatan de Souza\controle-financeiro v2"
```

---

### PROMPT 1 de 2 — SKILL-CONSTRUTOR (fix HTML + JS)

Você é um Engenheiro de Software Principal no Forge v5.2.

**PROJETO:** Mentor24h
**STACK:** HTML + JS puro | localStorage | Design System OBSIDIAN EDITORIAL
**PROMPT COMPLETO EM:** `Estructura-Proyecto/01-documentacao/pae-prompts/prompts-2026-05.md` — entrada #6

**CAUSA RAIZ:**
O `.sidebar-toggle` está DENTRO de um container com `overflow:hidden`. Quando a sidebar
colapsa (width: 64px), o botão é clipado junto com o conteúdo — sem como reabrir.

**FIX ESTRUTURAL — mudança cirúrgica no HTML:**

ANTES (com problema):
```html
<aside class="sidebar">
  <!-- zonas 1-5 + botão DENTRO -->
  <button class="sidebar-toggle">◀</button>
</aside>
```

DEPOIS (correto):
```html
<aside class="sidebar">
  <div class="sidebar-inner">          <!-- novo wrapper (recebe overflow:hidden) -->
    <!-- .sidebar-zona-logo   -->
    <!-- .sidebar-zona-avatar -->
    <!-- .sidebar-zona-switcher -->
    <!-- .sidebar-zona-nav    -->
    <!-- .sidebar-zona-footer -->
  </div>
  <!-- Botão FORA do inner — nunca clipado -->
  <button class="sidebar-toggle" aria-label="Alternar menu lateral">
    <span class="sidebar-toggle-icon">◀</span>
  </button>
</aside>
<!-- Overlay mobile — fora da sidebar -->
<div class="sidebar-overlay" aria-hidden="true"></div>
```

**REQUISITOS FUNCIONAIS:**

- RF01: Adicionar `<div class="sidebar-inner">` envolvendo as 5 zonas
- RF02: Mover `.sidebar-toggle` para fora do `.sidebar-inner` (irmão, não filho)
- RF03: Adicionar `<div class="sidebar-overlay">` após a sidebar (para mobile)
- RF04: Adicionar botão hamburger no header mobile:
  - Localizar o header/topbar do app
  - Adicionar `<button class="sidebar-hamburger" aria-label="Abrir menu">` com ícone ≡
- RF05: JS — garantir que `.sidebar-toggle` ainda adiciona `.sidebar-colapsada` no body
- RF06: JS — adicionar lógica drawer mobile:
  - Hamburger click → toggle `.sidebar-aberta` na sidebar
  - `.sidebar-overlay` click → remove `.sidebar-aberta`
  - Swipe da borda esquerda (swipeX > 50px) → abre sidebar (bonus, opcional)
- RF07: Preservar TODA a lógica de routing, modo ativo e localStorage existentes

**ARQUIVOS A ALTERAR:**
- `index.html` → adicionar `.sidebar-inner` + mover toggle + hamburger + overlay
- `js/core/app.js` → atualizar toggle + drawer mobile

**NÃO ALTERAR:**
- `css/sidebar.css` | `css/tokens.css` | `js/modules/*`

**CHECKLIST FINAL:**
- [ ] `.sidebar-inner` adicionado envolvendo as 5 zonas
- [ ] `.sidebar-toggle` fora do `.sidebar-inner`
- [ ] `.sidebar-overlay` criado após a sidebar
- [ ] Hamburger no header mobile com aria-label
- [ ] JS do drawer mobile (open/close/overlay-click)
- [ ] `.sidebar-colapsada` ainda funciona — toggle preservado
- [ ] FORGE-CHECKLIST.md atualizado

**RELAY PROTOCOL — AO FINALIZAR:**
Criar `.skill-memory/sprint-relay.md`:
```
# Sprint Relay — Sidebar Fix + Enriquecimento
Atualizado por: skill-construtor em [data]

## DIAGRAMA
<aside class="sidebar">
  <div class="sidebar-inner">         ← NOVO wrapper (overflow:hidden aqui)
    .sidebar-zona-[logo|avatar|switcher|nav|footer]
  </div>
  <button class="sidebar-toggle">    ← FORA do inner, nunca clipado
</aside>
<div class="sidebar-overlay">        ← mobile overlay
[header] .sidebar-hamburger          ← botão mobile

## ✅ SKILL-CONSTRUTOR — CONCLUÍDO
- [x] .sidebar-inner wrapper adicionado
- [x] .sidebar-toggle movido para fora
- [x] .sidebar-overlay criado
- [x] Hamburger no header mobile
- [x] JS drawer mobile
- [!] Seletores CSS em sidebar.css precisam atualizar para
      .sidebar-inner .sidebar-zona-* (forge-visual resolve)

## 📋 MISSÃO SKILL-FORGE-VISUAL
- [ ] Atualizar seletores: .sidebar-zona-* → .sidebar-inner .sidebar-zona-*
- [ ] sidebar overflow: visible (inner faz o clipping)
- [ ] .sidebar-toggle: position absolute right: -14px — SEMPRE visível
- [ ] body.sidebar-colapsada .sidebar: width 64px
- [ ] Textos no rail: opacity 0, max-width 0
- [ ] Ícones no rail: centralizados
- [ ] Tooltips: aparecem à direita no hover (delay 200ms)
- [ ] Chevron: rotaciona 180° quando colapsado
- [ ] Mobile: hamburger estilizado + overlay + drawer
- [ ] Dot indicator no rail: linha fina 3px

## 🚦 STATUS
skill-construtor:   ✅ CONCLUÍDO
skill-forge-visual: ⏳ AGUARDANDO
DEPLOY:             🔒 BLOQUEADO
```

**HANDOFF:**
```
✅ [ETAPA 1/2 — O QUE FAZER AGORA]

Corrigido: estrutura HTML — botão toggle nunca mais some.
O visual do rail ainda está quebrado — próxima etapa corrige.

⛔ NÃO commite ainda.
→ Abra nova conversa → /skill-forge-visual → Cole PROMPT 2 de 2
```

---

### PROMPT 2 de 2 — SKILL-FORGE-VISUAL (fix CSS + enriquecimento)

Você é um Diretor de Design + Engenheiro Visual Principal no Forge v5.2.

**PROJETO:** Mentor24h
**DESIGN SYSTEM:** `--signature: #D4A574` (ouro), `--info: #6D8EA8` (safira), Fraunces + Switzer
**PROMPT COMPLETO EM:** `Estructura-Proyecto/01-documentacao/pae-prompts/prompts-2026-05.md` — entrada #6

**O QUE VOCÊ HERDA:**
Leia PRIMEIRO: `.skill-memory/sprint-relay.md`

Estrutura HTML nova:
```html
<aside class="sidebar">
  <div class="sidebar-inner">   <!-- overflow:hidden aqui -->
    .sidebar-zona-[logo|avatar|switcher|nav|footer]
  </div>
  <button class="sidebar-toggle">  <!-- FORA do inner -->
</aside>
<div class="sidebar-overlay">
[header] .sidebar-hamburger
```

Lógica JS:
- `body.sidebar-colapsada` → rail mode (desktop)
- `.sidebar.sidebar-aberta` → drawer aberto (mobile)

**PARTE 1 — ATUALIZAR SELETORES (urgente):**
Todos os seletores `.sidebar-zona-*` no CSS devem passar a ser `.sidebar-inner .sidebar-zona-*`

**PARTE 2 — FIX COLLAPSE DESKTOP:**
```css
.sidebar {
  overflow: visible;  /* sidebar NÃO clippa — só inner clippa */
}

.sidebar-inner {
  overflow: hidden;
  height: 100%;
  width: 100%;
}

body.sidebar-colapsada .sidebar { width: 64px; }

/* Textos que somem */
body.sidebar-colapsada .sidebar-inner [class*="nome"],
body.sidebar-colapsada .sidebar-inner [class*="saudacao"],
body.sidebar-colapsada .sidebar-inner .nav-label,
body.sidebar-colapsada .sidebar-inner .sidebar-zona-switcher {
  opacity: 0;
  max-width: 0;
  overflow: hidden;
  pointer-events: none;
  transition: opacity 180ms, max-width 240ms var(--ease-out);
}

/* Ícones centralizados no rail */
body.sidebar-colapsada .sidebar-inner .nav-item {
  justify-content: center;
  padding: 10px 0;
}
```

**PARTE 3 — BOTÃO TOGGLE (sempre visível):**
```css
.sidebar-toggle {
  position: absolute;
  right: -14px;       /* cola na borda direita */
  top: 50%;
  transform: translateY(-50%);
  width: 28px; height: 28px;
  border-radius: 50%;
  background: var(--surface-primary);
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-subtle);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; z-index: 10;
  transition: background 160ms, box-shadow 160ms;
}

.sidebar-toggle-icon {
  transition: transform 240ms var(--ease-out);
}

body.sidebar-colapsada .sidebar-toggle-icon {
  transform: rotate(180deg);   /* ◀ vira ▶ */
}
```

**PARTE 4 — TOOLTIPS NO RAIL:**
```css
body.sidebar-colapsada .sidebar-inner .nav-item {
  position: relative;
}

body.sidebar-colapsada .sidebar-inner .nav-item::after {
  content: attr(data-tooltip);
  position: absolute;
  left: calc(100% + 12px);
  top: 50%; transform: translateY(-50%);
  background: var(--surface-secondary);
  color: var(--text-primary);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: var(--type-xs);
  white-space: nowrap;
  opacity: 0; pointer-events: none;
  transition: opacity 160ms 200ms;   /* delay 200ms */
  box-shadow: var(--shadow-subtle);
  border: 1px solid var(--border-soft);
}

body.sidebar-colapsada .sidebar-inner .nav-item:hover::after {
  opacity: 1;
}
```
OBS: Garantir que cada `.nav-item` tenha `data-tooltip="[nome]"` no HTML.

**PARTE 5 — DOT INDICATOR NO RAIL:**
```css
body.sidebar-colapsada .sidebar-zona-nav .sidebar-dot {
  width: 3px; height: 20px;
  border-radius: 0 2px 2px 0;
  left: 0;
}
```

**PARTE 6 — MOBILE ENRIQUECIDO:**
```css
.sidebar-hamburger {
  display: none;
  width: 36px; height: 36px;
  flex-direction: column; justify-content: center; align-items: center; gap: 5px;
  background: none; border: none; cursor: pointer;
  padding: 6px; border-radius: 8px;
  transition: background 160ms;
}

.sidebar-hamburger span {
  display: block; width: 18px; height: 1.5px;
  background: var(--text-primary); border-radius: 2px;
}

@media (max-width: 768px) {
  .sidebar-hamburger { display: flex; }

  .sidebar {
    transform: translateX(-100%);
    width: 280px;
    transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .sidebar.sidebar-aberta { transform: translateX(0); }

  /* No mobile: sem rail — sidebar some completamente */
  body.sidebar-colapsada .sidebar { width: 280px; }
}

.sidebar-overlay {
  position: fixed; inset: 0;
  background: var(--bg); opacity: 0;
  pointer-events: none;
  transition: opacity 300ms;
  z-index: calc(var(--z-sidebar) - 1);
}

.sidebar.sidebar-aberta ~ .sidebar-overlay {
  opacity: 0.5;
  pointer-events: auto;
}
```

**ARQUIVOS A ALTERAR:**
- `css/sidebar.css` → todos os fixes e enriquecimentos
- `index.html` → apenas se precisar adicionar `data-tooltip` nos nav-items

**CHECKLIST FINAL:**
- [ ] Seletores atualizados para `.sidebar-inner .sidebar-zona-*`
- [ ] `body.sidebar-colapsada .sidebar`: width 64px correto
- [ ] Textos somem com opacity 0 + max-width 0
- [ ] Ícones centralizados no rail
- [ ] `.sidebar-toggle` sempre visível (`right: -14px`, overflow: visible)
- [ ] Chevron rotaciona 180° ao colapsar
- [ ] Tooltips com delay 200ms no hover
- [ ] Dot indicator: linha fina 3px no rail
- [ ] Hamburger visível só em mobile
- [ ] Drawer + overlay mobile funcionando
- [ ] Dark e light mode sem token quebrado
- [ ] FORGE-CHECKLIST.md atualizado

**HANDOFF:**
```
✅ [ETAPA 2/2 CONCLUÍDA — SIDEBAR FIX + ENRIQUECIMENTO COMPLETO]

Bugs corrigidos:
• Botão toggle sempre visível na borda — nunca some
• Ícones centralizados no rail, textos ocultos, sem quebra
• Chevron rotaciona ◀/▶ indicando estado

Enriquecimento entregue:
• Tooltips no rail com delay 200ms
• Mobile: hamburger + drawer + overlay

VALIDAÇÃO FINAL:
[ ] Desktop — colapsar/expandir 3x, chevron sempre visível
[ ] Rail — ícones centralizados, tooltips no hover
[ ] Mobile < 768px — hamburger, drawer, overlay
[ ] Dark e light mode sem token quebrado
[ ] Nenhuma feature regrediu

Validação ok? Confirme para commit:

  git add index.html css/sidebar.css js/core/app.js
  git commit -m "fix(sidebar): collapse desktop + rail mode + mobile drawer — Forge v5.2 APPLE+"
  git push origin main

⚠️ AGUARDAR CONFIRMAÇÃO DO USUÁRIO ANTES DE EXECUTAR GIT.
```

---

*Entrada #6 gerada por skill-pae v2.0 em 2026-05-16*

---

## Entrada #7 — 2026-05-16

**Solicitação original do Léo:**
> "01 dashboard dedicado ao pessoal e outro ao negócio / enriqueça /
>  02 quando clicar em pessoal → ir para dashboard pessoal e ambiente pessoal /
>     quando clicar em negócio → ir para dashboard negócio e ambiente corporativo /
>  03 dashboard do meu negócio se não tiver crie uma experiência incrível /
>  04 quando em Negócio, tom corporativo em TODO o ambiente — não só no menu lateral"

**Forma profissional:**
> "Implementar experiência dual-mode completa: (1) mode-aware routing com auto-redirect
>  para dashboard do modo ao trocar + fade transition 400ms + toast de confirmação +
>  position memory por modo; (2) paleta corporativa safira em TODO o ambiente Negócio
>  via .modo-negocio; (3) Dashboard Pessoal hub de vida (saudação + widgets + tarefas +
>  nota); (4) Dashboard Negócio painel executivo (KPIs reais + top clientes + vendas +
>  quick actions). Pipeline: 2 sprints, 4 skills."

**Decisão do Board PAE:**
- Sprint Alpha: fundação — routing + fade + toast + paleta corporativa completa
- Sprint Beta: conteúdo — dashboards Pessoal e Negócio com dados reais do localStorage
- Tier: APPLE+ para Pessoal | ENTERPRISE para Negócio (dados financeiros)
- Deploy: após Beta-2 concluir e usuário validar

---

```
🤖 SKILL:       construtor(α) → forge-visual(α) → construtor(β) → forge-visual(β)
🧠 LLM:         Sonnet 4.6 → use /model sonnet em todos
⚙️ INTENSIDADE:  Alpha: Medium/High | Beta: High
🎨 TIER:        APPLE+ (Pessoal) | ENTERPRISE (Negócio)

cd "c:\Users\Usuário\Desktop\Curso Claude Code-Jhonatan de Souza\controle-financeiro v2"
```

---

### SPRINT ALPHA — Fundação dos Dois Mundos

#### PROMPT Alpha-1 — SKILL-CONSTRUTOR (Routing + Fade + Toast + Position Memory)

Você é um Engenheiro de Software Principal no Forge v5.2.

**PROJETO:** Mentor24h | **STACK:** HTML + JS puro | localStorage | OBSIDIAN EDITORIAL
**PROMPT COMPLETO EM:** `Estructura-Proyecto/01-documentacao/pae-prompts/prompts-2026-05.md` — entrada #7

**CONTEXTO:** O Mentor24h tem dois modos. Ao trocar de modo, o usuário deve ser transportado para outro ambiente com fade suave e aterrissar no dashboard do modo.

**SUA MISSÃO:** Atualizar a lógica de troca de modo (app.js) para incluir:

**RF01 — FADE TRANSITION (400ms):**
Ao trocar modo:
① `.env-transitioning` no `#main-content` (opacity 0, 160ms)
② Após 160ms: troca o modo (class, localStorage, navbar)
③ Navega para módulo correto (dashboard ou posição salva)
④ Remove `.env-transitioning` (fade-in 240ms)
⑤ Mostra toast de confirmação
`pointer-events: none` durante toda a transição.

**RF02 — POSITION MEMORY:**
- Ao clicar em qualquer nav item: salvar `mentor24h_pos_pessoal` ou `mentor24h_pos_negocio` no localStorage
- Ao entrar em um modo: SE primeira vez → ir para dashboard/painel | SE retornando → restaurar posição salva

**RF03 — DASHBOARD É HOME:**
- Modo Pessoal → `#dashboard-pessoal`
- Modo Negócio → `#painel-negocio`

**RF04 — TOAST:**
Função `showToast(mensagem, tipo)`:
- `tipo: "pessoal"` → borda --signature | `tipo: "negocio"` → borda --info
- Some após 2500ms com fade-out
- HTML: `<div class="app-toast app-toast--[tipo]"><span class="app-toast-icon"></span><span class="app-toast-text"></span></div>`
- Container: `<div class="app-toast-container" aria-live="polite">` (fora da sidebar/main)

**RF05:** Verificar se função de troca já existe em app.js → SE sim: atualizar | SE não: criar (IIFE pattern)
**RF06:** Event listeners dos nav items devem chamar `savePosition(modulo)` antes de navegar
**RF07:** Preservar TUDO existente: `mentor24h_modoAtivo`, `.modo-negocio`, routing das duas navbars

**ARQUIVOS:** `js/core/app.js` + `index.html` (toast container)
**NÃO ALTERAR:** `css/*` | `js/modules/*`

**CHECKLIST:**
- [ ] Fade 400ms (160ms out + 240ms in) com pointer-events: none
- [ ] Position memory salva/restaura por modo
- [ ] Dashboard = home na primeira entrada em cada modo
- [ ] Toast aparece e some em 2500ms com tipo ouro/safira
- [ ] `.app-toast-container` no HTML com aria-live
- [ ] Toda lógica existente preservada

**RELAY:** Criar `.skill-memory/sprint-relay.md` documentando: fade transition implementado, classes CSS pendentes (.env-transitioning, .app-toast*), missão forge-visual Alpha (paleta corporativa completa).

**HANDOFF:**
```
✅ [Alpha-1/4 CONCLUÍDA]
Troca de modo com fade + position memory + toast funcionando.
CSS do fade e da paleta corporativa → próxima etapa.
⛔ NÃO commite → /skill-forge-visual → PROMPT Alpha-2
```

---

#### PROMPT Alpha-2 — SKILL-FORGE-VISUAL (Paleta Corporativa Completa + CSS Fade + Toast)

Você é um Diretor de Design + Engenheiro Visual Principal no Forge v5.2.

**PROJETO:** Mentor24h | **DESIGN SYSTEM:** --signature ouro, --info safira #6D8EA8, Fraunces + Switzer
**PROMPT COMPLETO EM:** `Estructura-Proyecto/01-documentacao/pae-prompts/prompts-2026-05.md` — entrada #7

**O QUE VOCÊ HERDA:** Leia `.skill-memory/sprint-relay.md`
- JS de fade + toast pronto, CSS pendente
- `.modo-negocio` no body quando em Negócio (já existia)
- `css/negocio.css` JÁ EXISTE (Sprint 2) — expandir, não recriar

**OBJETIVO A — CSS DO FADE E TOAST:**
```css
.env-transitioning { opacity: 0; pointer-events: none; transition: opacity 160ms var(--ease-out); }
#main-content { opacity: 1; transition: opacity 240ms var(--ease-out); }
.app-toast-container { position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 8px; pointer-events: none; }
.app-toast { display: flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: 10px; background: var(--surface-primary); border-left: 3px solid transparent; box-shadow: var(--shadow-elevated); font-family: Switzer, sans-serif; font-size: var(--type-sm); animation: toast-in 300ms var(--ease-out) forwards; }
.app-toast--pessoal { border-left-color: var(--signature); }
.app-toast--negocio { border-left-color: var(--info); }
.app-toast.removing { animation: toast-out 240ms var(--ease-out) forwards; }
@keyframes toast-in { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
@keyframes toast-out { from { opacity: 1; } to { opacity: 0; transform: translateX(20px); } }
```

**OBJETIVO B — PALETA CORPORATIVA COMPLETA (em css/negocio.css, dentro de `body.modo-negocio {}`):**

Referência central: `--accent-modo: var(--info)` | `--accent-modo-hover: #5A7A96` | `--accent-modo-subtle: rgba(109,142,168,0.15)`

Cobrir:
- Botões primários: background var(--info)
- Focus rings: outline-color var(--info)
- Estados ativos/selecionados: color var(--info)
- Nav items ativos (sidebar): cor safira
- Switcher tab ativa: background var(--info)
- Avatar ring: border-color var(--info)
- Progress bars / KPI bars: gradient safira
- Links e text-accent: color var(--info)
- Badges corporativos: background var(--accent-modo-subtle), border safira
- Scrollbar thumb: rgba(109,142,168,0.4) → var(--info) no hover
- Gradients: linear-gradient(135deg, var(--info), #3D6480)
- Surfaces cards: `background-image: linear-gradient(135deg, rgba(109,142,168,0.04), transparent 60%)`
- Seleção de texto: background var(--accent-modo-subtle)

**REGRAS CRÍTICAS:**
- NUNCA hardcoded fora dos overrides explícitos
- Todos os seletores DENTRO de `body.modo-negocio {}` — zero vazamento no Pessoal
- Dark + light mode preservados (tokens OBSIDIAN respondem automaticamente)
- Zero `filter: hue-rotate()` no body — apenas CSS custom properties

**ARQUIVOS:** `css/negocio.css` (expandir) | NÃO ALTERAR: `css/tokens.css`, qualquer JS

**CHECKLIST:**
- [ ] Fade 160ms/240ms funcionando visualmente
- [ ] Toast slide-in, some em 2500ms
- [ ] Todos os accents safira em .modo-negocio
- [ ] Focus rings safira | Progress bars safira | Scrollbar safira
- [ ] Nenhum ouro vazando para o modo Negócio
- [ ] Dark + light mode funcionando com paleta corporativa

**RELAY:** Atualizar sprint-relay.md: Alpha completo, missão Beta — dashboards precisam de classes `.dp-*` (Pessoal) e `.pn-*` (Negócio) estilizadas.

**HANDOFF:**
```
✅ [Alpha-2/4 CONCLUÍDA — SPRINT ALPHA COMPLETO]
Fade + toast + paleta corporativa safira em todo o ambiente Negócio.
⛔ NÃO commite → /skill-construtor → PROMPT Beta-1
```

---

### SPRINT BETA — Os Dois Dashboards

#### PROMPT Beta-1 — SKILL-CONSTRUTOR (Dashboards JS + HTML + dados localStorage)

Você é um Engenheiro de Software Principal + Lead Architect no Forge v5.2.

**PROJETO:** Mentor24h | **STACK:** HTML + JS puro | localStorage | OBSIDIAN EDITORIAL
**PROMPT COMPLETO EM:** `Estructura-Proyecto/01-documentacao/pae-prompts/prompts-2026-05.md` — entrada #7

**O QUE VOCÊ HERDA:** Leia `.skill-memory/sprint-relay.md`
- Alpha completo: routing → #dashboard-pessoal / #painel-negocio (IDs que você vai criar)
- Paleta corporativa aplicada — Negócio herdará safira automaticamente
- Verificar: `js/modules/painel.js` existe do Sprint 2? SE sim: expandir | SE não: criar

**[A] DASHBOARD PESSOAL** — `js/modules/dashboard-pessoal.js` (novo) + `<section id="dashboard-pessoal">`

- **RF-A01 Saudação dinâmica:** `.dp-greeting` com h1 Fraunces italic (Bom dia/tarde/noite, Léo!) + data completa (dia semana, dia, mês por extenso, ano)
- **RF-A02 4 Widgets** em `.dp-widgets-grid`:
  - `.dp-widget--agenda`: ler `mentor24h_tarefas` → "N compromissos hoje" ou fallback elegante
  - `.dp-widget--saude`: ler `mentor24h_saude` → último registro ou placeholder
  - `.dp-widget--financas`: ler `mentor24h_financas` → saldo atual + delta do dia
  - `.dp-widget--contatos`: ler contatos → aniversários da semana ou "N contatos"
- **RF-A03 Tarefas prioritárias** (`.dp-tarefas`): top 3 pendentes do localStorage, checkbox funcional que persiste ao clicar, fallback "Nenhuma tarefa pendente 🎉"
- **RF-A04 Nota rápida** (`.dp-nota`): textarea com auto-save no localStorage `mentor24h_nota_rapida`, debounce 800ms, restaura ao abrir

**[B] DASHBOARD NEGÓCIO** — `js/modules/painel.js` (criar/expandir) + `<section id="painel-negocio">`

- **RF-B01 Header** (`.pn-header`): "Painel Executivo" + mês/ano + delta vs mês anterior (calculado de finanças)
- **RF-B02 4 KPIs** em `.pn-kpis-grid`:
  - `.pn-kpi--receita`: soma entradas do mês de finanças | meta: R$ 20.000 | progress bar %
  - `.pn-kpi--clientes`: count contatos modo Negócio com temp != Inativo | meta: 30
  - `.pn-kpi--ticket`: receita / clientes (Intl.NumberFormat BRL) | delta ↑↓
  - `.pn-kpi--pendencias`: count tarefas urgentes/vencidas | `data-urgente="true"` se > 0
- **RF-B03 Top Clientes** (`.pn-top-clientes`): top 3 contatos ordenados por temperatura (VIP→Quente→Morno...), progress bar proporcional ao 1°
- **RF-B04 Últimas Vendas** (`.pn-vendas-recentes`): últimas 5 entradas de finanças, fallback elegante
- **RF-B05 Quick Actions** (`.pn-quick-actions`): [+ Registrar Venda] → finanças | [+ Novo Cliente] → contatos + modal | [📊 Relatório] → relatórios/placeholder

**REGRAS CRÍTICAS:**
- ZERO crash com localStorage vazio — fallback elegante em TODOS os campos
- Valores monetários: `Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'})`
- ZERO CSS de aparência — apenas estrutura e lógica

**ARQUIVOS:** `js/modules/dashboard-pessoal.js` (novo) | `js/modules/painel.js` (criar/expandir) | `index.html` (seções + links CSS/JS)

**CHECKLIST:**
- [ ] #dashboard-pessoal: saudação + 4 widgets + tarefas (checkbox funcional) + nota (auto-save)
- [ ] #painel-negocio: header + 4 KPIs calculados + top 3 clientes + vendas + quick actions
- [ ] Todos os dados vêm do localStorage com fallback seguro
- [ ] Nenhum crash com dados vazios

**RELAY:** Atualizar sprint-relay.md: listar todas as classes .dp-* e .pn-* criadas (forge-visual Beta precisa saber o que estilizar).

**HANDOFF:**
```
✅ [Beta-1/4 CONCLUÍDA]
Dashboards Pessoal e Negócio funcionando com dados reais.
Visual sem estilo → próxima etapa entrega o premium.
⛔ NÃO commite → /skill-forge-visual → PROMPT Beta-2
```

---

#### PROMPT Beta-2 — SKILL-FORGE-VISUAL (Visual Premium dos Dois Dashboards)

Você é um Diretor de Design + Engenheiro Visual Principal no Forge v5.2.

**PROJETO:** Mentor24h | **DESIGN SYSTEM:** --signature ouro, --info safira, Fraunces + Switzer
**PROMPT COMPLETO EM:** `Estructura-Proyecto/01-documentacao/pae-prompts/prompts-2026-05.md` — entrada #7

**O QUE VOCÊ HERDA:** Leia `.skill-memory/sprint-relay.md`
- Sprint Alpha: paleta corporativa safira em .modo-negocio (automática)
- Beta-1: classes .dp-* (Dashboard Pessoal) e .pn-* (Painel Negócio) sem estilo
- Negócio herda safira AUTOMATICAMENTE — apenas layout e componentes específicos

**ARQUIVO A: `css/dashboard-pessoal.css` (NOVO) — warm, humano, ouro:**
- `#dashboard-pessoal`: padding 28px, max-width 1100px, flex-column, gap 24px
- `.dp-greeting-texto`: Fraunces italic, var(--type-2xl), color text-primary
- `.dp-greeting-data`: Switzer 400, var(--type-sm), text-quiet
- `.dp-widgets-grid`: grid 2×2, gap 16px
- `.dp-widget`: surface-secondary, border-radius 14px, padding 18px, hover translateY(-2px) + shadow-elevated
- `.dp-widget-valor`: Switzer 600, var(--type-lg) | `.dp-widget-label`: xs, text-quiet
- `.dp-widget--financas .dp-widget-valor`: color var(--signature) — ouro no destaque
- `.dp-tarefas`: surface-secondary, border-radius 14px | `.dp-tarefas-titulo`: uppercase, letter-spacing 0.06em
- `.dp-tarefa-item`: flex, gap 10px, border-bottom border-soft
- `.dp-tarefa-check`: 18px circular, border 1.5px border-soft, checked → background+border-color var(--signature)
- `.dp-tarefa-check:checked + .dp-tarefa-texto`: text-decoration line-through, text-mute
- `.dp-nota-input`: background none, border none, Switzer, min-height 80px, resize none

**ARQUIVO B: `css/painel-negocio.css` (NOVO) — corporativo, preciso (safira via .modo-negocio):**
- `#painel-negocio`: padding 28px, max-width 1200px, flex-column, gap 24px
- `.pn-header`: flex space-between, border-bottom border-soft, padding-bottom 16px
- `.pn-header-titulo h1`: Fraunces, var(--type-2xl), letter-spacing -0.03em
- `.pn-delta-valor`: Switzer 700, var(--type-lg), color var(--info)
- `.pn-kpis-grid`: grid 4 colunas, gap 16px
- `.pn-kpi`: surface-secondary, border-radius 12px, padding 20px, hover translateY(-2px)
- `.pn-kpi-valor`: Switzer 700, var(--type-xl) | `.pn-kpi-label`: uppercase, letter-spacing 0.06em, xs
- `.pn-kpi-progress`: height 4px, background border-soft, border-radius 2px, overflow hidden
- `.kpi-bar-fill`: height 100%, background var(--info) → accent-modo-hover gradient, transition width 600ms
- `.pn-kpi--pendencias[data-urgente="true"] .pn-kpi-valor`: color var(--critical)
- `.pn-cliente-item`: flex, gap 12px, border-bottom | `.pn-cliente-bar div`: background var(--info)
- `.pn-venda-valor`: color var(--info), font-weight 600
- `.pn-action-btn`: padding 10px 16px, border border-soft, hover border-color var(--info) + accent-modo-subtle + translateX(2px)
- `.pn-action-btn--primary`: background var(--info), color #fff
- `.pn-bottom-grid`: grid 1fr auto, gap 16px
- `.pn-quick-actions`: flex-column, gap 10px, min-width 200px

**RESPONSIVO (ambos):**
- `< 1024px`: `.pn-kpis-grid` → 2 colunas
- `< 768px`: padding 16px, `.pn-bottom-grid` → 1 coluna, `.pn-quick-actions` → row wrap
- `< 480px`: `.dp-widgets-grid` e `.pn-kpis-grid` → 1×2

**ARQUIVOS:** `css/dashboard-pessoal.css` (novo) | `css/painel-negocio.css` (novo) | `index.html` (links)
**NÃO ALTERAR:** `css/negocio.css` (paleta do Alpha) | `css/tokens.css` | qualquer JS

**CHECKLIST:**
- [ ] dashboard-pessoal.css: bento grid warm, Fraunces italic, accent ouro
- [ ] painel-negocio.css: grid executivo, KPI bars, accent safira herdado
- [ ] Checkbox circular elegante com filled state ouro
- [ ] Progress bars KPI com animação 600ms
- [ ] Quick actions: primário safira, hover translateX(2px)
- [ ] Responsivo em ambos (< 768px e < 480px)
- [ ] Dark + light mode sem quebrar
- [ ] Nenhum ouro no ambiente Negócio

**HANDOFF — ÚLTIMA ETAPA:**
```
✅ [Beta-2/4 CONCLUÍDA — DOIS MUNDOS COMPLETOS]

Sprint Alpha: fade + toast + paleta safira completa
Sprint Beta: Dashboard Pessoal (hub de vida) + Painel Executivo (negócio)

VALIDAÇÃO FINAL:
[ ] Pessoal → fade → chega no Dashboard Pessoal (accent ouro)
[ ] Negócio → fade → chega no Painel Executivo (accent safira em TUDO)
[ ] Toast aparece/some com identidade correta por modo
[ ] Dashboards com dados reais, fallback elegante
[ ] Mobile < 768px: ambos responsivos
[ ] Dark e light mode funcionando
[ ] Nenhuma feature anterior regrediu

Validação ok? Confirme para commit:

  git add index.html js/modules/dashboard-pessoal.js js/modules/painel.js
          css/dashboard-pessoal.css css/painel-negocio.css css/negocio.css js/core/app.js
  git commit -m "feat(dual-mode): dois mundos completos — dashboards + paleta corporativa + routing — Forge v5.2 ENTERPRISE appetite-L"
  git push origin main

⚠️ AGUARDAR CONFIRMAÇÃO DO USUÁRIO ANTES DE EXECUTAR GIT.
```

---

*Entrada #7 gerada por skill-pae v2.0 em 2026-05-16*
