# 🤖 AGENTS.md — Padrões de Código Mentor24h

**Versão:** 1.1  
**Criado:** 2026-05-11 (skill-scaffolder)  
**Atualizado:** 2026-05-20 (skill-pae — preenchido com padrões reais)  
**Proprietário:** Léo  
**Status:** ✅ PREENCHIDO

---

## 📋 INTRODUÇÃO

Este documento define os **padrões, convenções e decisões arquiteturais** do Mentor24h.

Cada skill que trabalha neste projeto consulta este documento para:
- ✅ Saber como escrever código que cabe no projeto
- ✅ Entender a filosofia de design
- ✅ Saber quais convenções seguir
- ✅ Não reinventar roda (reuso de padrões)

---

## 🏗️ SEÇÃO 1: ESTRUTURA & ORGANIZAÇÃO

### 1.1 Organização de Pastas

```
controle-financeiro v2/
├── index.html          ← único ponto de entrada
├── css/                ← todos os estilos
│   ├── tokens.css      ← design tokens (fonte da verdade)
│   ├── reset.css
│   ├── layout.css
│   ├── bento.css
│   ├── components.css
│   ├── pages.css
│   └── motion.css
├── js/                 ← módulos de funcionalidade
│   ├── app.js          ← bootstrap e init global
│   ├── db.js           ← camada de dados (localStorage)
│   ├── router.js       ← navegação SPA
│   ├── utils.js        ← helpers e formatadores
│   ├── modal.js        ← sistema de modais
│   ├── toast.js        ← notificações
│   ├── icons.js        ← ícones SVG
│   ├── theme.js        ← troca de tema
│   └── [módulo].js     ← um arquivo por domínio
├── js/modules/         ← módulos complexos multi-arquivo
│   ├── dashboard-pessoal.js
│   └── painel.js
└── Estructura-Proyecto/ ← documentação do projeto
    ├── 01-documentacao/
    └── 02-protocolo/
```

| Aspecto | Padrão | Exemplo |
|---------|--------|---------|
| Arquivo JS | camelCase | `llm.js`, `chatWa.js` |
| Arquivo CSS | kebab-case | `tokens.css`, `chat-styles.css` |
| Classe CSS | kebab-case | `.nav-item`, `.btn-primary` |
| Variável JS | camelCase | `const userConfig`, `let currentPage` |
| Constante | UPPER_SNAKE | `const DB_KEY = 'mentor24h.'` |
| Profundidade máxima | 2 níveis | `js/modules/` é o máximo |

### 1.2 Namespacing & Módulos

Todos os módulos usam **padrão IIFE** que expõe um objeto global:

```javascript
const ModuleName = (() => {
  // estado privado
  let _privateVar = null;

  function render() { ... }
  function init() { ... }
  function bindEvents() { ... }

  return { render, init };
})();
```

**Módulos globais existentes:**
- `DB` — camada de dados (localStorage)
- `Router` — navegação SPA
- `LLM` — chat AI multi-provider
- `ChatWA` — WhatsApp simulado
- `Modal` — sistema de modais
- `Toast` — notificações
- `Icons` — ícones SVG
- `Theme` — troca de tema claro/escuro
- `Agenda` — módulo de agenda
- `Medicamentos` — módulo de saúde

**Regra:** Manter IIFE. Não migrar para ES6 modules nem classes. Sem TypeScript.

---

## 🎨 SEÇÃO 2: DESIGN & ESTILOS

### 2.1 Design Tokens (fonte da verdade: `css/tokens.css`)

**CORES — Modo Pessoal (Obsidian/Ouro):**
```css
--color-gold:        #D4A574  /* accent pessoal — ouro líquido */
--color-gold-muted:  #B8933F
--bg-primary:        #0B0D0F  /* fundo dark */
--bg-secondary:      #111318
--text-primary:      #F0EDE8
```

**CORES — Modo Negócio (Safira Corporativa):**
```css
--info:              #6D8EA8  /* accent negócio — safira */
--info-dark:         #3D6480  /* safira para tema light */
```

**CORES — Semântica de Agenda (GI-001):**
```css
/* Evento pessoal → ouro do modo pessoal */
--agenda-pessoal:    #D4A574

/* Evento de serviço → safira do modo negócio */
--agenda-servico:    #6D8EA8
```

**STATUS:**
```css
--success:  #4ADE80
--error:    #F87171
--warning:  #FBBF24
--info:     #60A5FA
```

**TEMA LIGHT (Cream Linen):**
```css
--bg-primary:        #F5F0E8
--color-gold:        #9B6E3A  /* ouro escuro para contraste */
--info:              #3D6480  /* safira escura para contraste */
```

**SPACING:**
```css
--space-xs:  0.25rem   /* 4px  */
--space-sm:  0.5rem    /* 8px  */
--space-md:  1rem      /* 16px */
--space-lg:  1.5rem    /* 24px */
--space-xl:  2rem      /* 32px */
```

**TIPOGRAFIA:**
```css
--font-display: 'Instrument Serif', serif   /* títulos, italic */
--font-body:    'Geist', sans-serif         /* corpo, 400 */
--font-mono:    'Geist Mono', monospace     /* código, 500 */
```

**EFEITOS:**
```css
--glass:    backdrop-filter: blur(10px); background: rgba(255,255,255,0.05);
--shadow:   0 8px 32px rgba(0,0,0,0.1)
--radius:   12px   /* padrão para cards e modais */
--radius-sm: 8px   /* botões e badges */
```

### 2.2 Componentes Reutilizáveis

| Componente | Como usar | Arquivo |
|------------|-----------|---------|
| Card bento | `<div class="bento-card">` | `bento.css` |
| Botão primário | `<button class="btn btn-primary">` | `components.css` |
| Botão ghost | `<button class="btn btn-ghost">` | `components.css` |
| Botão pequeno | `<button class="btn btn-sm">` | `components.css` |
| Modal | `Modal.open({ title, content, actions })` | `modal.js` |
| Toast sucesso | `Toast.success('mensagem')` | `toast.js` |
| Toast erro | `Toast.error('mensagem')` | `toast.js` |
| Ícone | `Icons.html('nome-do-icone')` | `icons.js` |
| Badge | `<span class="badge">` | `components.css` |

**Regra:** Sempre reutilizar esses componentes. Nunca criar CSS inline para coisas que já existem.

---

## 💻 SEÇÃO 3: JAVASCRIPT

### 3.1 Estilo de Código

```javascript
// ✅ CORRETO — padrão do projeto
const MinhaFeature = (() => {
  const KEY = 'mentor24h.minha-feature';
  let _estado = [];

  function render() {
    const container = document.getElementById('minha-feature');
    if (!container) return;
    container.innerHTML = _buildHTML();
    _bindEvents();
  }

  function _buildHTML() {
    return _estado.map(item => `
      <div class="bento-card">
        <h3>${escapeHtml(item.nome)}</h3>
      </div>
    `).join('');
  }

  function _bindEvents() {
    document.querySelectorAll('[data-action]').forEach(el => {
      el.addEventListener('click', _handleAction);
    });
  }

  return { render, init: render };
})();
```

**Regras:**
- `const` por padrão, `let` só quando reassignment necessário, nunca `var`
- Arrow functions para callbacks curtos, `function` para funções nomeadas
- Prefixo `_` para funções privadas dentro do IIFE
- Destructuring quando simplifica (não forçar)
- Template literals para HTML, nunca concatenação com `+`
- `escapeHtml()` sempre antes de inserir dados do usuário em innerHTML

### 3.2 DB & Persistência

```javascript
// Namespace global
const DB_PREFIX = 'mentor24h.';

// Padrão de cada collection:
// { id: uuid(), campo1, campo2, createdAt, updatedAt }

// Uso via DB global:
DB.getAgenda()           // retorna array
DB.saveEvento(evento)    // salva/atualiza por id
DB.deleteEvento(id)      // remove por id
DB.getConfig()           // config geral do app
DB.saveConfig(config)    // salva config
```

**Decisão:** Manter **localStorage** permanentemente como cache offline.  
Quando Supabase entrar: `localStorage = buffer offline`, `Supabase = fonte de verdade`.  
Não migrar para IndexedDB — volume de dados não justifica a complexidade.

**Schema de cada item:**
```javascript
{
  id: crypto.randomUUID(),   // sempre UUID
  // campos do domínio...
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}
```

### 3.3 Async & API Calls

```javascript
// Padrão para chamadas externas (LLM, futuro Supabase):
async function chamarAPI(dados) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify(dados)
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();

  } catch (erro) {
    Toast.error('Erro ao conectar', erro.message);
    console.error('[ModuleName]', erro);
    return null;   // caller verifica null antes de usar
  }
}
```

**Regras:**
- Sempre try/catch em fetch
- Toast.error() para erros visíveis ao usuário
- console.error() com prefixo `[ModuleName]` para debug
- Retornar `null` em erro (não lançar exceção para cima)
- Sem retry automático por enquanto

### 3.4 Router & Navigation

```javascript
// Navegação:
Router.navigate('dashboard')   // vai para a página
Router.navigate('chat-ai')     // kebab-case para páginas multi-palavra

// Registro de página (em cada módulo):
Router.register('minha-pagina', MinhaFeature.render);

// Páginas disponíveis (Router.PAGES):
// dashboard, chat-ai, agenda, medicamentos, tarefas,
// contatos, financas, metas, kanban, negocio, config
```

**O que Router faz ao navegar:**
1. Remove `.active` de todas as páginas
2. Adiciona `.active` à página nova
3. Chama o renderer registrado (`renderers[page]()`)
4. Chama `Icons.render()` para reprocessar ícones
5. Sincroniza bottom nav mobile

**Regra:** Não manipular `.active` manualmente. Sempre usar `Router.navigate()`.

---

## 🧪 SEÇÃO 4: TESTES

### 4.1 Estratégia de Teste

**Escolha: B — Unit tests básicos nos módulos críticos.**

Frameworks: **Vitest** (zero config, roda no browser, ideal para JS puro sem build)

**O que testar:**
```
✅ CRÍTICO (deve ter testes):
   db.js       — CRUD, localStorage sync, schema validation
   router.js   — navegação, registro de páginas, .active state

○ NICE-TO-HAVE (próximas sprints):
   utils.js    — formatadores, helpers
   llm.js      — fallback de provider, parse de resposta
```

**Quando adicionar:** antes de skill-construtor rodar no Sprint 1.

### 4.2 Cobertura Mínima

| Módulo | Cobertura mínima | Prioridade |
|--------|-----------------|------------|
| db.js | 80% | 🔴 Crítico |
| router.js | 80% | 🔴 Crítico |
| utils.js | 60% | 🟡 Importante |
| Demais | Sem obrigação | 🟢 Opcional |

---

## 🔒 SEÇÃO 5: SEGURANÇA & COMPLIANCE

### 5.1 Senhas & Secrets

```
❌ NUNCA commitar:
  - API keys (OpenAI, Anthropic, OpenRouter, Gemini)
  - Tokens de acesso
  - Credenciais de Supabase (quando entrar)

✅ Fluxo atual (MVP):
  Usuário digita API key na tela de configurações
  → salva em localStorage (criptografado base64 no mínimo)
  → nunca vai para git

✅ Fluxo futuro (Supabase):
  .env para development, variáveis de ambiente no deploy
  Backend proxy para não expor keys no frontend
```

### 5.2 Validação & Sanitização

```javascript
// Sempre antes de inserir dados do usuário em innerHTML:
function escapeHtml(str) {
  return (str || '').toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Validação de entrada antes de salvar:
function validarEvento(evento) {
  if (!evento.titulo?.trim()) throw new Error('Título obrigatório');
  if (!evento.data) throw new Error('Data obrigatória');
  return true;
}
```

**Regras:**
- `escapeHtml()` em todo dado de usuário antes de ir para o DOM
- Validar no ponto de entrada (submit do form), não no DB
- XSS prevention via escapeHtml — não confiar em innerHTML sem sanitizar

---

## 📚 SEÇÃO 6: DOCUMENTAÇÃO

### 6.1 Comentários no Código

**Filosofia: mínimos comentários — código bem-nomeado é auto-explicativo.**

```javascript
// ✅ Comentar quando o WHY não é óbvio:
// iOS Safari não suporta push notifications sem add-to-homescreen
if (isIOS && !isPWAInstalled) return;

// ✅ Workaround com contexto:
// Delay necessário — Router.navigate() é assíncrono no Safari
setTimeout(() => Icons.render(), 50);

// ❌ Nunca comentar o óbvio:
// incrementa contador  ← desnecessário
count++;

// ❌ Nunca comentar O QUÊ (o nome já diz):
// retorna lista de eventos da agenda  ← desnecessário
function getAgenda() { ... }
```

### 6.2 Commit Messages

```
Padrão: <tipo>: <descrição curta em PT-BR>

feat: adiciona agenda híbrida com filtros por tipo
fix: corrige overflow no card do dashboard mobile
docs: atualiza AGENTS.md com padrões de testes
refactor: extrai lógica de notificação para utils.js
style: ajusta espaçamento do bento grid em mobile
chore: adiciona manifest.json para PWA

Corpo (quando necessário — o POR QUÊ, não o O QUÊ):
feat: adiciona service worker básico

Necessário para PWA offline-first. Arquitetura
agnóstica pronta para Supabase futuro — trigger
de push troca de timer local para Edge Function
sem reescrever o SW.
```

---

## 🚀 SEÇÃO 7: DEPLOYMENTS & RELEASE

### 7.1 Versionamento

**Usar SEMVER (Semantic Versioning):**

```
MAJOR.MINOR.PATCH

MAJOR (v2.0.0): mudança de arquitetura (ex: entrada do Supabase)
MINOR (v1.1.0): nova feature ou sprint concluído
PATCH (v1.0.1): bug fix

Estado atual: v1.0.0 (MVP base)
Pós-Sprint 1: v1.1.0
Pós-Sprint 2: v1.2.0
Pós-Sprint 3: v1.3.0
Com Supabase: v2.0.0
```

```bash
# Como criar uma release:
git tag v1.1.0
git push origin v1.1.0
# Criar Release no GitHub com 1-2 linhas descrevendo o que entrou
```

### 7.2 Release Checklist

Antes de fazer tag e push para main:

```
☐ Funcionalidades do sprint testadas manualmente (golden path)
☐ Mobile testado (Chrome DevTools + dispositivo real se possível)
☐ Tema claro e escuro funcionando
☐ Modo pessoal e negócio funcionando
☐ localStorage não corrompido (abrir DevTools → Application → Storage)
☐ Console sem erros críticos
☐ PLANO-MENTOR24H.md atualizado com o que foi feito
☐ git tag com versão SEMVER
```

---

## 📝 SEÇÃO 8: COMUNICAÇÃO & HANDOFF

### 8.1 Para Outras Skills/Devs

**Leitura obrigatória antes de qualquer trabalho no projeto:**

1. `AGENTS.md` ← este arquivo (padrões de código)
2. `SPEC.md` ← arquitetura completa, 24 módulos, design system
3. `CONSTITUTION.md` ← 22 leis invioláveis do projeto
4. `PLANO-MENTOR24H.md` ← roadmap e histórico de decisões

**Como rodar localmente:**
```
1. Abrir pasta no VS Code
2. Instalar extensão "Live Server"
3. Clicar em "Go Live" (canto inferior direito)
4. Acessar http://127.0.0.1:5500
   (NÃO abrir index.html direto — file:// bloqueia fetch)
```

**Stack:** Zero dependências. Sem npm install. Sem build step.  
Abriu o Live Server → funciona.

### 8.2 Convenções de Comunicação entre Skills

Quando uma skill terminar seu trabalho:
1. Registrar progresso: `Update-SkillProgress` (PAE-Functions.ps1)
2. Entregar relay claro para a próxima skill
3. Documentar decisões tomadas em `PLANO-MENTOR24H.md`
4. Atualizar este AGENTS.md se algum padrão mudou

---

## ✅ STATUS

- [x] Seção 1 — Estrutura & Organização
- [x] Seção 2 — Design & Estilos
- [x] Seção 3 — JavaScript
- [x] Seção 4 — Testes
- [x] Seção 5 — Segurança
- [x] Seção 6 — Documentação
- [x] Seção 7 — Deployments
- [x] Seção 8 — Handoff

**AGENTS.md completo. skill-construtor pode prosseguir.**
