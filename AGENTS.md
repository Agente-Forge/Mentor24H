# 🤖 AGENTS.md — Padrões de Código Mentor24h

**Versão:** 1.0  
**Criado:** 2026-05-11 (skill-scaffolder)  
**Proprietário:** Léo  
**Status:** ⏳ AGUARDANDO PREENCHIMENTO

---

## 📋 INTRODUÇÃO

Este documento define os **padrões, convenções e decisões arquiteturais** do Mentor24h.

Cada skill que trabalha neste projeto consultará este documento para:
- ✅ Saber como escrever código que cabe no projeto
- ✅ Entender a filosofia de design
- ✅ Saber quais convenções seguir
- ✅ Não reinventar roda (reuso de padrões)

**Você (Léo) preenche isso**, depois compartilha com Claude/skills.

---

## 🏗️ SEÇÃO 1: ESTRUTURA & ORGANIZAÇÃO

### 1.1 Organização de Pastas

```
Descreva como você organiza pasta src/, css/, js/, tests/:
- Qual é a convenção de naming (kebab-case, camelCase)?
- Qual é a profundidade máxima de pastas?
- Como você separa domínios (finance, chat, personal)?

EXEMPLO (preencha com seus padrões):
```

| Aspecto | Padrão | Exemplo |
|---------|--------|---------|
| Pasta de módulo | lowercase com hífen | `js/chat-wa/` |
| Arquivo JS | camelCase | `llm.js`, `chat-wa.js` |
| Arquivo CSS | kebab-case | `chat-styles.css` |
| Arquivo HTML | index em cada seção | `pages/agenda/index.html` |
| Testes | \*.test.js | `db.test.js` |

**Preencha você:**
```
Você segue essas convenções? Tem exceções?
Qual é a sua regra de organização?
```

### 1.2 Namespacing & Módulos

```
Como você nomeia módulos globais (IIFE, singleton)?

ATUAL (Mentor24h):
- DB (database global)
- Router (router global)
- LLM (chat AI)
- ChatWA (whatsapp)
- Agenda (agenda module)
etc.

PADRÃO:
Todos são IIFE que retornam { render, init, ... }
```

**Preencha você:**
```
Mantém esse padrão IIFE?
Quer mudar para algo else (classes, ES6 modules)?
```

---

## 🎨 SEÇÃO 2: DESIGN & ESTILOS

### 2.1 Design Tokens

```
Quais são seus design tokens CANÔNICOS?
(Léo, você já tem isso em css/tokens.css, mas detalhamos aqui)

COLORS:
- Primário: #A78BFA (violeta)
- Secundário: #F472B6 (magenta)
- Accent: #5EE39A (verde), #7BB6FF (azul)
- Neutro: #08080F (bg), #FFFFFF (text light)
- Status: #FF6B7A (red/error), #FBBF24 (amber/warning)

SPACING:
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)

TYPOGRAPHY:
- Display: Instrument Serif, italic
- Body: Geist, 400
- Mono: Geist Mono, 500

EFFECTS:
- Glassmorphism: backdrop-filter: blur(10px), opacity 0.8
- Shadow: 0 8px 32px rgba(0,0,0,0.1)
- Radius: 12px (default)
```

**Preencha você:**
```
Tem outros tokens? Cores adicionais? Mudanças?
```

### 2.2 Componentes Reutilizáveis

```
Liste os componentes que você SEMPRE reutiliza:

EXEMPLO (Mentor24h atual):
- Card (bento grid item)
- Button (btn, btn-primary, btn-ghost, btn-sm)
- Modal (Modal.novaConta(), Modal.novaTransacao())
- Toast (Toast.success(), Toast.error())
- Icon (Icons.html(), Icons.render())
- Badge (wa-badge para contatos não lidos)
```

**Preencha você:**
```
Quais são os componentes core que você reutiliza sempre?
Como você nomeia classes CSS desses componentes?
```

---

## 💻 SEÇÃO 3: JAVASCRIPT

### 3.1 Estilo de Código

```
Qual é seu estilo preferido?

ATUAL (Mentor24h):
- IIFE module pattern (closure)
- Funções em minúsculas (render(), bindEvents())
- Variáveis em camelCase
- Sem TypeScript (JavaScript puro)
- localStorage com namespace 'mentor24h.*'
```

**Preencha você:**
```
Segue esses padrões? Quer mudar algo?
Tem regras sobre: const vs let? arrow functions? destructuring?
```

### 3.2 DB & Persistência

```
Como você estrutura dados em localStorage?

ATUAL (Mentor24h):
const KEY = 'mentor24h.';

DB = {
  getConfig() { ... },
  saveConfig() { ... },
  getAgenda() { ... },
  saveEvento() { ... },
  // ... 14 collections
}

Cada collection é um JSON array com { id, ..., updatedAt }
```

**Preencha você:**
```
Quer manter localStorage ou migrar para IndexedDB?
Como você quer estruturar dados?
Qual é a estratégia de versionamento (schema migrations)?
```

### 3.3 Async & API Calls

```
Como você chamaria uma API real no futuro?

EXEMPLO (hipotético):
async function fetchLLMResponse(messages) {
  try {
    const response = await fetch(provider.url + '/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${config.apiKey}` },
      body: JSON.stringify({ messages, model, temperature: 0.7 })
    });
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
  } catch (e) {
    Toast.error('Erro ao chamar API', e.message);
    return null;
  }
}
```

**Preencha você:**
```
Esse padrão te agrada?
Como você prefere tratar erros?
Quer logging estruturado? Retry logic?
```

### 3.4 Router & Navigation

```
Como funciona sua navegação SPA?

ATUAL (Mentor24h):
Router.navigate('chat-ai') → 
  1. Remove .active de todas as páginas
  2. Adiciona .active à página nova
  3. Chama renderer function (renderers[page]())
  4. Icons.render()
  5. Sincroniza bottom nav mobile

PADRÃO: 
Router.PAGES = { dashboard, 'chat-ai', ... }
Router.register(page, rendererFn)
Router.navigate(page)
```

**Preencha você:**
```
Quer manter esse padrão?
Como você quer lidar com: URL state? Browser history? Deep linking?
```

---

## 🧪 SEÇÃO 4: TESTES

### 4.1 Estratégia de Teste

```
Qual é seu plano de teste?

OPÇÃO A (Recomendado para Fase 1):
- Unit tests: DB.js, router.js, utils.js (Jest/Vitest)
- E2E: Fluxos principais (Cypress/Playwright)
- Coverage: Mínimo 70%

OPÇÃO B (Rápido):
- Testes manuais + checklist
- Sem automação
- Documentar casos de teste

OPÇÃO C (Avançado):
- Unit + Integration + E2E
- Coverage 90%+
- CI/CD com GitHub Actions
```

**Preencha você:**
```
Qual estratégia você prefere?
Quer começar com tests na Fase 1?
Qual é o framework preferido (Jest, Vitest, etc)?
```

### 4.2 Cobertura Mínima

```
SUGESTÃO (Mentor24h):
Crítico (deve testar):
✅ DB.js — CRUD operations, localStorage sync
✅ Router.js — Navigation, page rendering
✅ LLM.js — Provider fallback, API calls
✅ ChatWA.js — Message flow, CRM updates
✅ Utils.js — Formatters, helpers

Nice-to-have:
○ Dashboard.js — Cards rendering
○ Modal.js — Open/close flow
○ Toast.js — Message display
```

**Preencha você:**
```
Concorda com essa priorização?
Qual é a cobertura mínima que você quer?
```

---

## 🔒 SEÇÃO 5: SEGURANÇA & COMPLIANCE

### 5.1 Senhas & Secrets

```
REGRA CANÔNICA:
❌ NUNCA commitar:
  - API keys
  - Database credentials
  - Access tokens
  - Private keys

✅ SIM commitar:
  - .env.example (template vazio)
  - Public keys
  - Configurações públicas

ATUAL (Mentor24h):
Usuário coloca API key na config UI → salva em localStorage
(Não é ideal, mas ok para MVP)

FASE 2:
Migrar para .env + backend proxy
```

**Preencha você:**
```
Como você quer manejar secrets?
Pode usar .env durante desenvolvimento?
```

### 5.2 Validação & Sanitização

```
PADRÃO ATUAL (Mentor24h):
function escapeHtml(s) {
  return (s || '').replace(/&/g,'&amp;')...
}

Usa isso antes de exibir dados em HTML
```

**Preencha você:**
```
Quer adicionar validação mais robusta?
Qual é a estratégia para XSS prevention?
CSRF protection necessária?
```

---

## 📚 SEÇÃO 6: DOCUMENTAÇÃO

### 6.1 Comentários no Código

```
FILOSOFIA ATUAL (Mentor24h):
Mínimos comentários — código bem-nomeado é auto-explicativo

QUANDO COMENTAR:
✅ Lógica não-óbvia
✅ Workarounds (com contexto)
✅ Aviso de breaking change
✅ Referência a issue/PR

❌ NUNCA:
- Comentar óbvio ("increment counter")
- Documentar O QUÊ (use nome claro)
- Comments antigos/desatualizado
```

**Preencha você:**
```
Segue essa filosofia?
Quer adicionar JSDoc?
```

### 6.2 Commit Messages

```
PADRÃO RECOMENDADO:
feat: adiciona chat AI multi-provider
fix: corrige altura dos shells de chat
docs: adiciona guia de setup
refactor: reorganiza estrutura DB

Com corpo descrevendo POR QUÊ
```

**Preencha você:**
```
Como você quer estruturar commits?
Precisa de conventional commits?
```

---

## 🚀 SEÇÃO 7: DEPLOYMENTS & RELEASE

### 7.1 Versionamento

```
SEMVER (Semantic Versioning):
- MAJOR (1.0.0): Breaking changes
- MINOR (0.1.0): New features
- PATCH (0.0.1): Bug fixes

MENTOR24H ATUAL:
v1.0.0 (lançamento)
```

**Preencha você:**
```
Quer usar SEMVER?
Qual é a estratégia de versioning?
```

### 7.2 Release Checklist

```
Antes de deploy para main:
☐ Testes passando
☐ Performance OK (Lighthouse >90)
☐ Security audit (SBOM atualizado)
☐ Docs atualizada
☐ CHANGELOG.md escrito
```

**Preencha você:**
```
Qual é seu checklist?
Quer automação (GitHub Actions)?
```

---

## 📝 SEÇÃO 8: COMUNICAÇÃO & HANDOFF

### 8.1 Para Outras Skills/Devs

```
Se alguém vai trabalhar em Mentor24h depois de você:

DEVE LER:
1. Este arquivo (AGENTS.md)
2. SPEC.md (o quê foi construído)
3. CONSTITUTION.md (regras invioláveis)
4. .memoria/decision-log.json (POR QUÊ foram feitas decisões)

DEVE EXECUTAR:
npm install (se houver)
npm test (verificar que tudo funciona)
Abrir http://localhost:5500 (Live Server)
```

**Preencha você:**
```
Que recursos novo dev deveria ler first?
Qual é o processo de onboarding?
```

---

## ✅ CHECKLIST: PRÓXIMAS AÇÕES

- [ ] Você preencheu seções 1-8 acima com seus padrões
- [ ] Revisou com Claude/skills para validação
- [ ] Commitou AGENTS.md em git
- [ ] Agora sim, skill-orquestrador pode fazer entrevista
- [ ] skill-consultor usa AGENTS.md para escrever PRD

---

## 📞 SUPORTE

Se uma skill tiver dúvida sobre padrão:
1. Consulta AGENTS.md (você preencheu aqui)
2. Se ambíguo, pergunta em .memoria/open_questions.json
3. Você responde e atualiza AGENTS.md

**Preencha todas as 8 seções acima e tenho certeza que o código fica coeso!** 🎯
