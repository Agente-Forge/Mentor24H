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
