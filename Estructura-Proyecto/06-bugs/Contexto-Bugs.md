# 🐛 BUGS — Contexto

**Responsabilidade:** Registrar, rastrear e resolver bugs encontrados.

**O que mora aqui:**
- `BUG-LOG.md` — Log de bugs encontrados, status, e resoluções
- `bug-register.json` — Estrutura JSON com bugs

---

## 🎯 Propósito

Manter registro estruturado de **problemas encontrados** durante desenvolvimento.

Permite:
- ✅ Não esquecer bugs (mesmo que low-priority)
- ✅ Rastrear status (open, in-progress, resolved, closed)
- ✅ Histórico completo (por quê ocorreu, como foi resolvido)
- ✅ Reutilizar fixes em futuros projetos

---

## 📋 Arquivos

### BUG-LOG.md

Log legível de bugs encontrados.

**Formato:**
```markdown
## BUG-001: Chat AI não retorna resposta se API key inválida

**Status:** RESOLVED  
**Severity:** HIGH  
**Found:** 2026-05-10 (durante skill-construtor Sprint 1)  
**Resolved:** 2026-05-11

**Description:**
Ao configurar OpenRouter com API key inválida, a requisição falha silenciosamente.
Usuário fica esperando resposta que nunca chega.

**Root Cause:**
Erro na `llm.js` — falta catch/error handling para response.ok === false

**Resolution:**
```javascript
if (!response.ok) {
  throw new Error(`LLM API error: ${response.statusText}`);
}
```

**Tests Added:**
- ✅ Unit test: invalid API key
- ✅ E2E test: error message appears

---

## BUG-002: localStorage limit atingido com 1000+ mensagens

**Status:** OPEN  
**Severity:** MEDIUM  
**Found:** 2026-05-11

**Description:**
Chat WA com muitas mensagens (1000+) causa erro de localStorage full.

**Root Cause:**
localStorage tem limite 5-10MB.

**Proposed Fix:**
Migrar para IndexedDB na Fase 2. Entretanto, para MVP basta limpar mensagens antigas.

**Next Step:**
Implementar "archive messages" na Fase 2 com skill-construtor.
```

---

### bug-register.json

Estrutura JSON para rastreamento programático.

```json
{
  "bugs": [
    {
      "id": "BUG-001",
      "title": "Chat AI não retorna resposta",
      "severity": "HIGH",
      "status": "RESOLVED",
      "module": "llm.js",
      "found_date": "2026-05-10",
      "resolved_date": "2026-05-11",
      "root_cause": "Falta error handling em response.ok",
      "fix_applied": "Adicionado throw new Error()",
      "tests_added": ["test-llm-invalid-key.js"]
    }
  ]
}
```

---

## 🔍 Status Codes

- **OPEN** — Bug confirmado, não resolvido
- **IN_PROGRESS** — Sendo corrigido (alguém está trabalhando)
- **RESOLVED** — Corrigido e testado
- **CLOSED** — Resolvido + merged para main

---

## 📊 Severity Levels

- **CRITICAL** — App quebrado, usuário afetado agora
- **HIGH** — Funcionalidade não funciona, mas workaround existe
- **MEDIUM** — Feature degrada mas não quebra
- **LOW** — Cosmético, não afeta usuário
- **TRIVIAL** — Documentação, typo, etc

---

## 🔄 Fluxo

```
skill-sentinela encontra bug (ou usuário relata)
  ↓
Registra em BUG-LOG.md + bug-register.json
  ↓
skill-orquestrador prioriza (severity + impact)
  ↓
skill-construtor corrige (próxima sprint)
  ↓
Testa + Merge
  ↓
Mark as RESOLVED
```

---

## 📝 Como Reportar Bug

1. **Abra BUG-LOG.md**
2. **Adicione seção:**
   ```markdown
   ## BUG-NNN: [Título curto]
   
   **Status:** OPEN
   **Severity:** [CRITICAL/HIGH/MEDIUM/LOW]
   **Found:** [data]
   **Module:** [arquivo.js]
   
   **Description:** [o que está quebrado]
   **Steps to Reproduce:** [como reproduzir]
   **Root Cause:** [por quê ocorre — se conhecido]
   **Proposed Fix:** [como consertar — se conhecido]
   ```
3. **Adicione a bug-register.json**

---

**Próximo:** Conforme bugs forem encontrados, registrar aqui
