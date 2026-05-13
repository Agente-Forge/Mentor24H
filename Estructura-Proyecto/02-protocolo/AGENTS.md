# 🤖 AGENTS.md — Padrões de Código Mentor24h

**Versão:** 1.1  
**Preenchido:** 2026-05-12  
**Proprietário:** Léo  
**Status:** ✅ ATIVO

---

## SEÇÃO 1 — ESTRUTURA & ORGANIZAÇÃO

### 1.1 Organização de Pastas

Princípio: **Single Source of Truth** — cada coisa existe em um único lugar. Nada duplicado.

```
js/
  core/        → db.js, router.js, app.js (infraestrutura base, raramente muda)
  modules/     → llm.js, chat-wa.js, dashboard.js, agenda.js, medicamentos.js...
  utils/       → icons.js, utils.js, command-palette.js

css/
  tokens.css       → ÚNICA fonte de verdade: cores, espaçamento, fontes, sombras
  typography.css   → escala tipográfica, pesos, line-heights
  reset.css        → zeragem de estilos do browser
  layout.css       → sidebar, grid principal, estrutura da página
  components.css   → componentes reutilizáveis (btn, card, modal, toast, badge)
  pages.css        → estilos específicos de cada página

data/
  default-config.json   → configuração padrão da aplicação
  seed.json             → dados de demonstração
```

| Aspecto | Padrão | Exemplo |
|---------|--------|---------|
| Pasta | kebab-case | `js/core/`, `js/modules/` |
| Arquivo JS | kebab-case | `llm.js`, `chat-wa.js`, `command-palette.js` |
| Arquivo CSS | kebab-case | `tokens.css`, `pages.css` |
| Constante global | PascalCase | `const Dashboard`, `const LLM` |

### 1.2 Módulos JavaScript — Padrão IIFE

Todos os módulos seguem o padrão **IIFE** (Immediately Invoked Function Expression):

```javascript
const NomeModulo = (() => {
  // variáveis privadas ficam aqui — não vazam para fora
  
  function render() { ... }
  function init() { ... }
  function bindEvents() { ... }
  
  // só expõe o que outros módulos precisam chamar
  return { render, init };
})();
```

**Regras de estilo JS:**
- `const` por padrão. `let` só quando a variável precisa ser reatribuída. Nunca `var`.
- Arrow functions `() =>` para callbacks e funções curtas. `function nome()` para funções nomeadas principais.
- Destructuring quando torna o código mais claro: `const { id, nome } = contato`
- Sem TypeScript na Fase 1. Migração considerada quando projeto ultrapassar 1000 linhas.
- Nomes em inglês para variáveis/funções. Labels e textos de UI em português.

---

## SEÇÃO 2 — DESIGN & ESTILOS

### 2.1 Design Tokens (tokens.css — fonte única de verdade)

**Paleta OBSIDIAN — Quiet Intelligence:**

```css
/* Fundos */
--color-bg-base:     #0B0D0F;   /* fundo principal */
--color-bg-surface:  #14171A;   /* cards, painéis */
--color-bg-elevated: #1D2125;   /* modais, dropdowns */

/* Signature */
--color-gold:        #D4A574;   /* dourado — elemento principal de destaque */
--color-gold-muted:  #B8935F;   /* dourado escurecido para hover */

/* Texto */
--color-text-primary:   #F0EDE8;  /* texto principal */
--color-text-secondary: #8B8680;  /* texto secundário */
--color-text-muted:     #4A4640;  /* placeholders, desabilitados */

/* Status */
--color-success:  #4ADE80;   /* verde — recebido, sucesso */
--color-error:    #F87171;   /* vermelho — despesa, erro */
--color-warning:  #FBBF24;   /* amarelo — alerta, meta próxima do limite */
--color-info:     #60A5FA;   /* azul — informação, link */

/* Bordas */
--color-border:       rgba(212, 165, 116, 0.12);  /* borda sutil dourada */
--color-border-hover: rgba(212, 165, 116, 0.25);
```

**Espaçamento:**
```css
--space-xs:  0.25rem;   /*  4px */
--space-sm:  0.5rem;    /*  8px */
--space-md:  1rem;      /* 16px */
--space-lg:  1.5rem;    /* 24px */
--space-xl:  2rem;      /* 32px */
--space-2xl: 3rem;      /* 48px */
```

**Raio de borda:**
```css
--radius-sm:   6px;
--radius-md:   12px;
--radius-lg:   16px;
--radius-full: 9999px;
```

**Tipografia — Editorial Premium:**
```css
--font-display: 'Fraunces', Georgia, serif;      /* títulos, números grandes */
--font-ui:      'Switzer', system-ui, sans-serif; /* interface, labels, corpo */
--font-mono:    'JetBrains Mono', monospace;      /* valores, códigos, datas */
```

### 2.2 Componentes Reutilizáveis (components.css)

Antes de criar um estilo novo, verificar se já existe em `components.css`.

| Componente | Classes CSS | Variações |
|------------|-------------|-----------|
| Botão | `.btn` | `.btn-primary`, `.btn-ghost`, `.btn-sm`, `.btn-danger` |
| Card | `.card` | `.card-elevated`, `.card-interactive` |
| Modal | `Modal.open(id)` | via JS: `Modal.novaConta()`, `Modal.novaTransacao()` |
| Toast | `Toast.success()` | `Toast.success()`, `Toast.error()`, `Toast.warning()` |
| Badge | `.badge` | `.badge-success`, `.badge-error`, `.badge-warning` |
| Input | `.input` | `.input-sm`, `.input-error` |

---

## SEÇÃO 3 — PERSISTÊNCIA DE DADOS

### 3.1 localStorage (Fase 1)

Namespace: `mentor24h.`

```javascript
// Estrutura padrão de cada registro
{
  "id":        "txn-abc123",      // gerado com crypto.randomUUID()
  "createdAt": "2026-05-12T...",  // data de criação
  "updatedAt": "2026-05-12T..."   // data da última modificação
  // + campos específicos da collection
}
```

**Collections:**
```
mentor24h.config          mentor24h.contas
mentor24h.transacoes      mentor24h.metas
mentor24h.agenda          mentor24h.medicamentos
mentor24h.med-doses       mentor24h.tarefas
mentor24h.contatos        mentor24h.produtos
mentor24h.vendas          mentor24h.clientes-neg
mentor24h.chat-contatos   mentor24h.chat-msgs
mentor24h.llm-config      mentor24h.llm-conversas
```

### 3.2 Migração futura — Supabase

`createdAt` e `updatedAt` existem nativamente em tabelas Supabase. A migração de localStorage → Supabase será um `INSERT` direto de cada collection, sem transformação de estrutura.

---

## SEÇÃO 4 — TESTES

**Estratégia Fase 1:** Testes manuais no browser.

Checklist manual antes de marcar uma feature como concluída:
- [ ] Fluxo principal funciona sem erros no console
- [ ] Dados persistem após recarregar a página (F5)
- [ ] Funciona em mobile (responsive)
- [ ] Sem texto cortado ou layout quebrado
- [ ] Estados de erro exibem mensagem clara para o usuário

Testes automatizados (Vitest) entram na Fase 2 quando o projeto ultrapassar 1000 linhas.

---

## SEÇÃO 5 — SEGURANÇA

### 5.1 API Keys
- Usuário digita a API key na tela de Configurações → salva em `mentor24h.llm-config` no localStorage
- **Nunca** commitar API keys em arquivos do projeto
- Migração para `.env` + backend proxy quando integrar Supabase

### 5.2 XSS Prevention
Todo texto de origem externa (input do usuário, resposta de API) deve passar por `escapeHtml()` antes de ser inserido no DOM via `innerHTML`:

```javascript
function escapeHtml(s) {
  return (s || '').replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;')
                  .replace(/'/g, '&#39;');
}
```

Preferir `textContent` a `innerHTML` sempre que possível.

---

## SEÇÃO 6 — COMMITS

Padrão: **Conventional Commits**

```
feat:     nova funcionalidade
fix:      correção de bug
docs:     documentação
style:    formatação, espaçamento (sem lógica)
refactor: reorganização sem mudar comportamento
perf:     melhoria de performance
chore:    tarefas de manutenção (deps, config)
```

**Exemplos:**
```
feat: adiciona chat AI com suporte a OpenRouter
fix: corrige cálculo de saldo quando há transações negativas
docs: preenche AGENTS.md com padrões do projeto
refactor: reorganiza js/ em subpastas core/modules/utils
```

---

## SEÇÃO 7 — PARA SKILLS E AGENTES

Ao trabalhar neste projeto, toda skill/agente deve:

1. Ler este arquivo (AGENTS.md) antes de escrever qualquer código
2. Ler `DESIGN-BRIEF.md` antes de criar qualquer CSS
3. Consultar `working-memory.json` para contexto do projeto
4. Reutilizar componentes existentes antes de criar novos
5. Seguir a estrutura de pastas definida na Seção 1.1
6. Usar tokens de `tokens.css` — nunca valores hardcoded de cor ou espaçamento

**Stack:**
- HTML5 semântico
- CSS puro (sem frameworks)
- JavaScript ES6+ puro (sem frameworks, sem TypeScript por enquanto)
- localStorage para persistência
- Google Fonts: Fraunces + Switzer + JetBrains Mono
- Lucide Icons (via CDN)
