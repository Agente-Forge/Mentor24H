# 📜 CONSTITUTION — Mentor24h

**Versão:** 1.0  
**Data:** 2026-05-12  
**Status:** ✅ ATIVA  
**Forge:** v5.2

> Este documento define as **leis invioláveis** do projeto Mentor24h. Qualquer agente (skill, IA, dev) que trabalhe neste projeto **deve obedecer** estas leis sem exceção. Alterações requerem nova sessão de skill-consultor.

---

## 🏛️ LEIS DO APP

### LEI 1 — Local-First é inegociável (Fase 1)
Todo dado deve ser persistido em `localStorage` com namespace `mentor24h.`. Nada de chamadas a backend externo no MVP (exceto APIs LLM via configuração explícita do usuário).

### LEI 2 — Quiet Intelligence é o tom
Nenhuma cor saturada padrão. Nenhuma animação ansiosa. Nenhum elemento "AI generic" (gradientes pastel, ícones genéricos). Tudo segue o DESIGN-BRIEF.md aprovado.

### LEI 3 — Single Source of Truth para estilos
Toda cor, espaçamento, fonte e raio vem de `css/tokens.css`. Zero valor hardcoded em arquivos de componente. Mudar `tokens.css` muda o app inteiro.

### LEI 4 — Reutilizar antes de criar
Antes de criar qualquer botão, card, modal ou estilo, verificar em `css/components.css`. Reuso é regra; duplicação é exceção justificada.

### LEI 5 — Dashboard é o centro
Toda nova feature precisa decidir: ela aparece no Dashboard? Se sim, como? Cards do Dashboard só aparecem se tiverem conteúdo útil — nunca vazios.

### LEI 6 — Chat AI nunca é mandatório
O Mentor24h funciona sem API key configurada. Chat AI é feature opcional; sua ausência não quebra o app.

### LEI 7 — Sem feature que não está no PRD
Qualquer feature fora do MVP definido no PRD.md (Seção 3) requer atualização do PRD via skill-consultor. Sem atalhos.

---

## ⚖️ AS 5 LEIS FORGE v5.0 (invioláveis)

### F-1. Documentação antes de código
Nenhuma linha de código é escrita antes de PRD.md, CONSTITUTION.md, AGENTS.md e DESIGN-BRIEF.md estarem aprovados.

### F-2. Decision Log é obrigatório
Toda decisão arquitetural relevante vai em `.memoria/decision-log.json`. Sem exceção.

### F-3. Appetite é lei
Features só entram no MVP se couberem no appetite declarado (M — 4-6 semanas). Se crescer, corta outra ou empurra para Fase 2.

### F-4. Working Memory é a verdade
`.memoria/working-memory.json` reflete o estado real do projeto. Toda skill deve ler antes de agir, e atualizar após agir.

### F-5. Sentinela tem veto final
Code review da skill-sentinela é obrigatório antes de marcar uma feature como "pronta". Sentinela pode vetar qualquer entrega.

---

## 🛡️ LEIS DE SEGURANÇA — Nível AVANÇADO

### SEC-1. Zero API key em código
API keys (OpenRouter, OpenAI, etc.) **nunca** ficam em arquivos do projeto. Sempre em `localStorage` configurado pelo usuário OU `.env` (futuro).

### SEC-2. Escape HTML obrigatório
Todo texto de origem externa (input usuário, resposta LLM, dados localStorage) passa por `escapeHtml()` antes de ir ao DOM via `innerHTML`. Preferir `textContent` quando possível.

### SEC-3. Sanitizar antes de salvar
Validar formato e tamanho de dados antes de gravar em localStorage. Limite de 5MB monitorado.

### SEC-4. CSP recomendado
Adicionar Content-Security-Policy no `<head>` do `index.html` para mitigar XSS.

### SEC-5. localStorage tem export manual
Usuário deve poder exportar seus dados a qualquer momento (botão "Exportar JSON" em Config). Recovery em caso de limpeza acidental do browser.

---

## 📐 4 LEIS DE PRODUTO v5.1

### P-1. Não-feature é decisão
Toda feature que **não está** no PRD foi cortada por motivo. Cortar é ação, não omissão.

### P-2. Métricas mensuráveis
Toda feature tem critério de sucesso claro (ver PRD.md §5). Se não pode medir, não pode declarar pronto.

### P-3. Usuário primeiro, código depois
Decisões de UX > elegância arquitetural. Léo prefere clicar 1x menos a ter código "mais bonito".

### P-4. MVP é MVP
"Minimum Viable Product" significa: o mínimo que entrega valor real. Não é "tudo que dá pra fazer em X semanas".

---

## 🤖 PERMISSÕES DO AGENTE — Mentor24h

### ✅ SEMPRE PODE (sem pedir confirmação)

- Criar arquivos novos em `js/core/`, `js/modules/`, `js/utils/`, `css/`, `pages/`, `data/`
- Ler qualquer arquivo do projeto
- Atualizar `.memoria/working-memory.json` e `.memoria/decision-log.json`
- Adicionar tokens novos em `css/tokens.css` (sem remover existentes)
- Criar componentes reutilizáveis em `css/components.css` seguindo padrões existentes
- Rodar testes manuais no browser
- Sugerir refatorações (mas não aplicá-las sem confirmação — ver Ask)

### ⚠️ PERGUNTAR ANTES (requer aprovação explícita "sim" / "pode ir")

- Modificar arquivos core: `js/core/db.js`, `js/core/router.js`, `js/core/app.js`
- Alterar `css/tokens.css` (mudar valor existente — adicionar é Always)
- Deletar qualquer arquivo ou pasta existente
- Renomear funções, componentes ou módulos já existentes
- Refatorar código que já está funcionando
- Adicionar dependência externa (CDN, biblioteca) não prevista no PRD
- Mudar estrutura de dados em localStorage (schema migration)
- Modificar `DESIGN-BRIEF.md`, `PRD.md`, `CONSTITUTION.md`, `AGENTS.md`

### 🚫 NUNCA PODE (bloqueio absoluto — requer nova sessão skill-consultor)

- Trocar a stack principal (HTML+CSS+JS puro → React/Vue/etc) sem aprovação estratégica
- Deletar a pasta `js/`, `css/`, `Estructura-Proyecto/`, `.memoria/`
- Fazer `git push` sem aprovação explícita de Léo
- Remover ou modificar leis desta Constitution sem nova sessão skill-consultor
- Adicionar features fora do PRD.md (Seção 3)
- Substituir `localStorage` por backend remoto antes da Fase 2
- Implementar autenticação/multi-tenant antes da Fase 2
- Subir API keys, credenciais ou dados pessoais para o repositório

---

## 🔄 PROTOCOLO DE ALTERAÇÃO

Esta Constitution só pode ser alterada por:

1. Nova sessão de **skill-consultor**
2. Aprovação explícita de Léo
3. Atualização do `decision-log.json` justificando a mudança
4. Incremento da versão (1.0 → 1.1 → 2.0)

---

## ✅ ASSINATURAS

- [x] Board Executivo (CEO, CTO, CPO, CFO, Auditor) — 2026-05-12
- [x] Léo (proprietário) — 2026-05-12
- [x] PRD.md alinhado — 2026-05-12
- [x] AGENTS.md alinhado — 2026-05-12
- [x] DESIGN-BRIEF.md alinhado — 2026-05-12
