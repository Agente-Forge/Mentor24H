# 🔒 SEGURANÇA — Contexto

**Responsabilidade:** Garantir que Mentor24h é seguro contra ataques.

**O que mora aqui:**
- `SECURITY-AUDIT.md` — Auditoria completa de segurança
- `SBOM.md` — Software Bill of Materials (dependências)
- `security-checklist.json` — Checklist estruturado

---

## 🎯 Propósito

Garantir que Mentor24h **protege dados do usuário** contra ameaças comuns.

**OWASP Top 10:**
- ✅ Injection (SQL, Command)
- ✅ Broken Authentication
- ✅ XSS (Cross-Site Scripting)
- ✅ CSRF (Cross-Site Request Forgery)
- ✅ Broken Access Control
- ✅ Sensitive Data Exposure
- ✅ etc...

---

## 📋 Arquivos

### SECURITY-AUDIT.md

Auditoria de segurança completa.

```markdown
# SECURITY-AUDIT — Mentor24h

**Executada em:** 2026-05-12  
**Por:** skill-seguranca v1.0  
**Nível:** MVP

## 1. XSS Prevention

**Status:** ✅ MITIGATED

**Medidas:**
- ✅ escapeHtml() em todos os inputs de usuário
- ✅ Sem innerHTML perigoso
- ✅ Content Security Policy (CSP) headers

---

## 2. CSRF Protection

**Status:** ⚠️ NOT NEEDED (estaticamente não-autenticado)

**Nota:** CSRF requer estado persistente (cookies). 
localStorage é seguro contra CSRF.

---

## 3. Secrets Management

**Status:** ✅ COMPLIANT

**Regras:**
- ❌ NUNCA commitar API keys
- ✅ Usar .env ou .env.local (em .gitignore)
- ✅ Usuário coloca API key na UI (salva em localStorage)

---

## 4. Data Validation

**Status:** ⚠️ PARTIAL

**O que tem:**
- ✅ Validação básica em formulários
- ✅ Tipos esperados checados

**O que falta (Fase 2):**
- ⏳ Validação com Zod ou Yup
- ⏳ Sanitização mais robusta
```

---

### SBOM.md

Software Bill of Materials — lista de dependências.

```markdown
# SBOM — Mentor24h

**Data:** 2026-05-12

## Dependencies

### Direct Dependencies
None — HTML + CSS + JavaScript puro

### External Resources
- Google Fonts (Instrument Serif, Geist, Geist Mono)
  - URL: https://fonts.googleapis.com
  - License: Open Source

### Dev Dependencies
(se houver no futuro)
- Jest (testes)
- Webpack (bundling)

## CVE Check

Rodado com: `npm audit` ou similar

**Result:** ✅ No vulnerabilities found
```

---

### security-checklist.json

Checklist estruturado para pré-deploy.

```json
{
  "checklist": [
    {
      "id": "SEC-001",
      "category": "XSS Prevention",
      "check": "Todos inputs escapados com escapeHtml()",
      "status": "PASS"
    },
    {
      "id": "SEC-002",
      "category": "Secrets",
      "check": "API keys nunca commitadas",
      "status": "PASS"
    }
  ]
}
```

---

## 🔐 Secret Patterns

O que **NUNCA** commitar:

```
❌ API keys (OpenAI, OpenRouter, Gemini, Claude)
❌ Database credentials
❌ Access tokens
❌ Private keys (.pem, .key)
❌ .env (local config)

✅ .env.example (template vazio)
✅ Public keys
✅ Configurações públicas
```

---

## 🔄 Fluxo

```
skill-seguranca executa (Fase [5c])
  ├─ Gera SECURITY-AUDIT.md
  ├─ Lista SBOM.md
  └─ Cria checklist
       ↓
skill-construtor segue baseline
  ├─ Escreve código seguro
  └─ Segue regras de secrets
       ↓
Antes de deploy (skill-devops)
  ├─ Roda SECURITY-AUDIT.md again
  └─ Verifica checklist
```

---

**Próximo:** skill-seguranca preenche SECURITY-AUDIT.md
