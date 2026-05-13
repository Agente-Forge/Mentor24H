# Políticas de Segurança — Mentor24h

> Documento gerado em 2026-05-13 como entregável da Etapa 4.1 da metodologia FORGE v5.2.
> Stack: HTML/CSS/JS vanilla, sem build, sem NPM, sem backend. Persistência 100% em `localStorage`.
> Companheiro técnico: [SBOM.json](SBOM.json)

---

## 1. Modelo de Ameaças (Threat Model)

O Mentor24h é um app **single-user, single-device** que roda no browser de Léo. Mesmo assim, vários atacantes plausíveis existem:

| Atacante | Capacidade | O que quer | Probabilidade |
|---|---|---|---|
| **Extensão maliciosa do Chrome** | Lê `localStorage` de qualquer origin | API keys de OpenRouter/OpenAI/Gemini (têm valor financeiro real) | 🟡 média |
| **Outro app rodando do mesmo `file://`** | Mesmo origin = mesmo `localStorage` | Idem acima | 🟢 baixa |
| **Provedor de CDN (Google Fonts)** | Recebe IP + User-Agent a cada visita | Telemetria, profiling | 🟡 média (passivo) |
| **Provedor de LLM (OpenAI/Anthropic/Google/OpenRouter)** | Recebe todo o conteúdo enviado ao chat | Dados pessoais de Léo (financeiros, contatos) | 🔴 ALTA — é o modelo de negócio deles |
| **Atacante remoto via XSS** | Se Léo abrir um JSON malicioso via "Importar backup" | Roubar API key, modificar transações | 🟡 média se houver bug em `innerHTML` |
| **Compartilhamento acidental** | Léo manda o `localStorage` exportado a outra pessoa | Vê dados financeiros, contatos, conversas com IA | 🟡 média |
| **Hospedagem futura (GitHub Pages)** | Tráfego em texto plano se HTTPS falhar | Sem HTTPS, MITM lê tudo | 🟢 baixa (GH Pages força HTTPS) |

**Princípio adotado**: zero-trust local — assumir que o `localStorage` PODE vazar e desenhar mitigações em torno disso.

---

## 2. Superfície de Ataque

### 2.1 Entradas (dados que entram no app)
- **Inputs de formulário** (todas as páginas): nome de conta, valor, descrição, observações, mensagens de chat, etc.
- **Importação de backup JSON** ([js/config.js](../../js/config.js) → `Config.importar`) — caminho de maior risco
- **Respostas das APIs LLM** — conteúdo HTML/Markdown vindo de fora
- **URL hash** ([js/router.js](../../js/router.js)) — rota a partir de `window.location.hash`

### 2.2 Saídas (dados que saem)
- **OpenRouter** — `https://openrouter.ai/api/v1/chat/completions` ([js/llm.js:328](../../js/llm.js))
- **OpenAI** — `https://api.openai.com/v1/chat/completions` ([js/llm.js:353](../../js/llm.js))
- **Gemini** — `https://generativelanguage.googleapis.com/...` ([js/llm.js:381](../../js/llm.js))
- **Anthropic** — `https://api.anthropic.com/v1/messages` ([js/llm.js:398](../../js/llm.js)) com flag CORS perigosa
- **Google Fonts** — `https://fonts.googleapis.com/css2?...` ([css/tokens.css:7](../../css/tokens.css))
- **Exportação JSON** (download local via `Config.exportar`)

### 2.3 Armazenamento
- 16 chaves em `localStorage` (namespaces `finflow.*` e `mentor24h.*`) — ver [js/db.js:6-27](../../js/db.js).
- Chave especialmente sensível: `mentor24h.llm-config` contém `apiKey` em texto plano.

---

## 3. Riscos Identificados (priorizados)

### 🔴 CRÍTICO

**R-01 — API keys em `localStorage` sem criptografia**
- **Onde**: `mentor24h.llm-config.apiKey` salvo em [js/db.js:703-706](../../js/db.js); UI em [js/llm.js:459](../../js/llm.js) usa `type="password"` (só esconde visualmente, NÃO criptografa).
- **Impacto**: chave OpenAI/OpenRouter vazada = atacante gasta crédito real do Léo.
- **Por que CRÍTICO**: chaves LLM têm valor monetário direto.

### 🟠 ALTO

**R-02 — 47 ocorrências de `innerHTML` em 18 arquivos sem auditoria sistemática**
- **Onde**: `js/dashboard.js` (9), `js/charts.js` (6), `js/modal.js` (5), `js/llm.js` (4), `js/transacoes.js` (4), `js/contas.js` (4), + 12 arquivos.
- **Mitigado parcialmente** por `Utils.escapeHtml` (alias `esc()` em [js/utils.js:225](../../js/utils.js)) — mas precisa estar APLICADO em todo conteúdo dinâmico.
- **Exemplo correto**: [js/llm.js:182-188](../../js/llm.js) `formatMsgContent` faz escape ANTES de adicionar `<br>`, `<code>`, `<strong>`.

**R-03 — Anthropic CORS bypass via `anthropic-dangerous-direct-browser-access: true`**
- **Onde**: [js/llm.js:404](../../js/llm.js).
- **Impacto**: o nome do header diz tudo — a própria Anthropic marca como inseguro.
- **Já mitigado parcialmente**: hint em [js/llm.js:49](../../js/llm.js) recomenda OpenRouter.

**R-04 — Ausência de Content Security Policy (CSP)**
- **Onde**: [index.html](../../index.html) não tem `<meta http-equiv="Content-Security-Policy">`.
- **Impacto**: qualquer XSS exfiltra `localStorage` para qualquer URL externa.

### 🟡 MÉDIO

**R-05 — Prompt injection via dados do usuário enviados ao LLM**
- **Onde**: [js/llm.js:299](../../js/llm.js) — `conversa.msgs` enviadas sem sanitização semântica.
- **Impacto baixo em single-user** (Léo é a única fonte), mas relevante se Léo colar dados de terceiros.

**R-06 — Google Fonts envia IP a cada visita**
- **Onde**: [css/tokens.css:7](../../css/tokens.css) com `@import` de Fraunces/Switzer/JetBrains Mono.
- **Impacto LGPD**: IP é dado pessoal. Relevante quando hospedar publicamente.

**R-07 — Gemini API key em query string**
- **Onde**: [js/llm.js:381](../../js/llm.js) — `?key=${cfg.apiKey}` na URL.
- **Impacto**: query strings ficam em logs e history do browser.

### 🟢 BAIXO

**R-08 — Dados pessoais em texto plano no `localStorage`** — aceito (single-user).
**R-09 — `formatMsgContent` quebra se alguém mudar a ordem do escape** — aceito (testar antes).
**R-10 — Limitações do `file://`** (sem Service Worker, sem alguns headers) — aceito (limitação stack).

---

## 4. Mitigações Recomendadas

### Para R-01 (API keys em texto plano)
1. **Aviso visual ao salvar chave**: ao clicar em "Salvar configuração de IA" ([js/llm.js:491](../../js/llm.js)), mostrar Toast: *"Sua chave fica salva apenas neste navegador, em texto plano. Não use este app em computadores compartilhados."*
2. **Botão dedicado "Limpar apenas API key"** na seção LLM em Configurações.
3. **Mascarar chave após salvar**: mostrar `sk-...XXXX` (últimos 4) ao invés do valor completo em [js/llm.js:459](../../js/llm.js).

### Para R-02 (`innerHTML` espalhado)
1. **Auditoria sistemática**: percorrer cada arquivo em ordem decrescente de ocorrências (dashboard → charts → modal → llm → transacoes → contas). Para cada `innerHTML` que injeta variável, garantir que TODA variável passou por `esc()`.
2. **Padrão obrigatório**: nunca interpolar `${x}` em HTML sem `esc(x)`, exceto se `x` for número/booleano garantido.
3. **Documentar exceções claramente** com comentário (ex.: SVGs do `Icons` são seguros porque vêm de constantes).

### Para R-03 (Anthropic direto)
- Mostrar **modal de aviso** ao selecionar provider "Claude (Anthropic)" no select de [js/llm.js:484](../../js/llm.js): *"A Anthropic não suporta uso direto do browser. Use OpenRouter para evitar problemas."*

### Para R-04 (CSP ausente)
Adicionar no `<head>` do [index.html](../../index.html), logo após `<meta name="theme-color">`:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  script-src 'self';
  connect-src 'self' https://openrouter.ai https://api.openai.com https://generativelanguage.googleapis.com https://api.anthropic.com;
  img-src 'self' data:;
  object-src 'none';
  base-uri 'self';
">
```
Funciona em `file://` (testar) e em GitHub Pages. Bloqueia exfil de `localStorage` para domínios desconhecidos mesmo se um XSS escapar.

### Para R-05 (Prompt injection)
- Aceitar para v1. Em release futuro com multi-user: prefixar mensagens com delimitador estável tipo `<user_message>...</user_message>` e instruir o `systemPrompt` a tratar o conteúdo entre tags como dados.

### Para R-06 (Google Fonts → IP)
- **Curto prazo**: aceitar (Léo é único usuário).
- **Antes de publicar em GitHub Pages**: baixar os `.woff2` localmente e trocar `@import` por `@font-face` apontando para `/fonts/`. Tem o bônus de funcionar offline.

### Para R-07 (Gemini key na URL)
- Mostrar aviso ao selecionar Gemini no provider select sugerindo OpenRouter.

### Para R-08/09/10
- **R-08**: o botão "Apagar todos os dados" já existe em [index.html:504](../../index.html) — manter visível.
- **R-09**: adicionar comentário `// SECURITY: escape MUST happen first` em [js/llm.js:184](../../js/llm.js).
- **R-10**: documentar em [README.md](../../README.md) que recursos avançados só ativam em hospedagem HTTPS.

---

## 5. Boas Práticas Obrigatórias para a Fase 5 (Desenvolvimento)

### 5.1 Toda nova chave de API
- Salva via `DB.saveLlmConfig`/análogo (NUNCA via `localStorage.setItem` direto).
- Input com `type="password"`.
- Toast de aviso ao salvar.
- Botão "Limpar" ao lado.

### 5.2 Todo input de usuário que vira HTML
```js
// ❌ ERRADO
container.innerHTML = `<div>${conta.descricao}</div>`;

// ✅ CERTO
container.innerHTML = `<div>${esc(conta.descricao)}</div>`;
```
Vale para: `descricao`, `nome`, `observacoes`, `notas`, `titulo`, `texto`, `email`, `telefone` — qualquer string que veio do usuário ou de outro sistema.

### 5.3 Toda resposta do LLM antes de exibir
- Passe pelo equivalente do `formatMsgContent` em [js/llm.js:182](../../js/llm.js): **escape primeiro, formatação depois**.
- Nunca use `insertAdjacentHTML('beforeend', resposta_crua)`.

### 5.4 Toda nova chamada `fetch`
- Adicione o endpoint à diretiva `connect-src` do CSP (quando ele existir).
- Documente em [SBOM.json](SBOM.json) na seção `services[]`.

### 5.5 Checklist de PR Review (foco segurança)
Antes de aceitar qualquer commit que mexe em HTML/JS:
- [ ] Toda interpolação `${x}` em template literal HTML usa `esc(x)` se `x` vier de DB/user/API?
- [ ] Nova `fetch` foi documentada no SBOM e adicionada ao CSP?
- [ ] Algum `localStorage.setItem` direto? (deve passar por `DB.write`)
- [ ] Algum `eval`, `new Function`, `setTimeout(string)`? (proibido)
- [ ] Algum `target="_blank"` sem `rel="noopener noreferrer"`?
- [ ] Algum `console.log` com API key, token, ou body completo de mensagem do LLM?

---

## 6. Checklist Pré-Deploy (Fase 7 — GitHub Pages)

Antes de `git push` para a branch que serve o site:

- [ ] CSP `<meta>` adicionada e testada localmente.
- [ ] Google Fonts self-hospedadas (`/fonts/*.woff2`) e `@import` trocado por `@font-face`.
- [ ] Todos os `innerHTML` auditados (rodar `grep -rn "innerHTML" js/` e revisar cada um).
- [ ] Nenhuma API key real commitada no repositório (procurar `sk-`, `AIza`, `claude-` em todos os arquivos).
- [ ] `.gitignore` ignora `data/*-personal.json` ou qualquer export local.
- [ ] [README.md](../../README.md) tem seção "Privacidade" explicando que: API keys ficam no browser do usuário, dados não saem para servidor próprio, conversas vão para o provedor LLM escolhido.
- [ ] Política de Privacidade visível em `/privacidade.html` ou em modal acessível por Configurações.
- [ ] Footer com link "Limpar todos os meus dados" sempre visível.
- [ ] Teste manual: abrir app no Chrome DevTools → Application → Local Storage → confirmar que nenhuma chave inesperada aparece.
- [ ] Teste manual: digitar `<script>alert(1)</script>` no campo "Descrição" de uma nova conta. NÃO deve executar.

---

## 7. Plano de Resposta a Incidentes

### Cenário A — API key vazou (ex.: Léo commitou por engano no GitHub)
1. **Imediato (< 5 min)**: ir ao painel do provedor (OpenRouter/OpenAI/Google/Anthropic) e revogar a chave.
2. Gerar nova chave.
3. Atualizar em Configurações → Chat AI → API Key.
4. Se chave foi commitada em repo público: `git filter-repo` para apagar do histórico e fazer force-push (avisar quem clonou).
5. Revisar fatura do provedor por uso anômalo nas últimas 24h.

### Cenário B — Suspeita de XSS / dados modificados sem ação
1. **Não usar o app** até diagnosticar.
2. Exportar backup atual via Configurações → "Exportar backup".
3. Abrir DevTools → Application → Local Storage → inspecionar valores suspeitos.
4. Limpar `localStorage` (ou usar "Apagar todos os dados") e reimportar backup limpo.
5. Identificar qual input/JSON importado causou; reportar como bug com severidade alta em [Estructura-Proyecto/06-bugs](../06-bugs).

### Cenário C — Backup JSON vazado
1. Avaliar o que estava no backup (use [js/db.js:429-453](../../js/db.js) `exportAll` para conferir o schema — não inclui `mentor24h.llm-config`, mas inclui contatos e transações).
2. Avisar pessoas listadas em "Contatos" se houver dados sensíveis delas.
3. Revisar mensagens de chat IA exportadas.

### Cenário D — Provedor LLM teve breach (notícia pública)
1. Considerar TODO histórico de conversa com aquele provedor como público.
2. Trocar provider em Configurações (se OpenRouter caiu, mover para OpenAI direto, e vice-versa).
3. Reavaliar quais dados financeiros/pessoais foram colados em conversas passadas.

---

## 8. Resumo Executivo

- **10 riscos** identificados (1 crítico, 3 altos, 3 médios, 3 baixos).
- **0 CVEs públicos** — stack vanilla sem dependências NPM elimina supply-chain.
- **Top 3 ações** antes da Fase 5:
  1. Adicionar CSP no `index.html` (resolve metade dos riscos altos de uma vez).
  2. Adicionar Toast de aviso ao salvar API key e botão "Limpar API key".
  3. Auditoria de `innerHTML` começando por `dashboard.js` (9 ocorrências).

Léo, este documento é vivo: atualize-o sempre que adicionar uma nova API externa, uma nova chave em `localStorage`, ou um novo módulo com renderização dinâmica.
