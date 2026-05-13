# 🧪 TESTES — Contexto

**Responsabilidade:** Definir estratégia de testes e manter cobertura.

**O que mora aqui:**
- `TEST-STRATEGY.md` — Estratégia completa (unit, integration, e2e)
- `test-cases.json` — Casos de teste estruturados
- `coverage-report.md` — Relatório de cobertura

---

## 🎯 Propósito

Garantir que Mentor24h **funciona conforme esperado** através de testes automatizados.

Permite:
- ✅ Detectar bugs antes de produção
- ✅ Refatorar com confiança
- ✅ Validar padrões (CONSTITUTION)
- ✅ Manter qualidade ao longo do tempo

---

## 📋 Arquivos

### TEST-STRATEGY.md

Estratégia completa de testes.

**Formato:**
```markdown
# TEST-STRATEGY — Mentor24h

## Nível 1: Unit Tests (Testes Unitários)

**Cobertura:** Funções/métodos individuais  
**Framework:** Jest ou Vitest  
**Alvo:** 70%+ cobertura

**O que testar (CRÍTICO):**
- ✅ DB.js — CRUD operations, localStorage sync
- ✅ Router.js — Navigation, page rendering
- ✅ LLM.js — Provider fallback, error handling
- ✅ Utils.js — Formatadores, helpers

**Exemplo:**
```javascript
describe('DB.js', () => {
  test('saveEvento deve persistir em localStorage', () => {
    const evento = { id: '1', titulo: 'Test' };
    DB.saveEvento(evento);
    expect(DB.getEvento('1')).toEqual(evento);
  });
});
```

---

## Nível 2: Integration Tests

**Cobertura:** Fluxos entre módulos  
**Framework:** Jest  
**Alvo:** 40%+ cobertura

**O que testar:**
- Router.navigate → chama renderer correto
- LLM.sendMessage → salva em DB + atualiza UI
- ChatWA.enviarMsg → valida + persiste + atualiza lista

---

## Nível 3: E2E Tests

**Cobertura:** Fluxos completos do usuário  
**Framework:** Cypress ou Playwright  
**Alvo:** 10+ casos críticos

**O que testar:**
1. Login → Dashboard é mostrado
2. Chat AI → mensagem envia → resposta recebida
3. Chat WA → novo contato → mensagem → CRM atualizado
4. Agenda → novo evento → appears no dashboard
5. Transação → novo gasto → summary atualizado
```

---

### test-cases.json

Casos de teste estruturados.

```json
{
  "test_suite": "Mentor24h",
  "test_cases": [
    {
      "id": "TC-001",
      "name": "DB.getEvento retorna evento correto",
      "type": "UNIT",
      "module": "DB.js",
      "steps": [
        "Criar evento com DB.saveEvento",
        "Chamar DB.getEvento",
        "Comparar resultado"
      ],
      "expected": "Evento retornado com dados corretos",
      "status": "PENDING"
    }
  ]
}
```

---

### coverage-report.md

Relatório de cobertura de testes.

```markdown
# Coverage Report — Mentor24h

**Data:** 2026-05-12  
**Target:** 70%  
**Current:** 0%

| Module | Lines | Functions | Branches | Status |
|--------|-------|-----------|----------|--------|
| DB.js | — | — | — | 🔴 PENDING |
| Router.js | — | — | — | 🔴 PENDING |
| LLM.js | — | — | — | 🔴 PENDING |
```

---

## 📝 Quando Testar

| Momento | O Quê | Quem |
|---------|-------|------|
| **Antes de escrever código** | Test cases | skill-construtor (TDD) |
| **Durante desenvolvimento** | Unit tests | skill-construtor |
| **Após implementação** | E2E tests | skill-construtor |
| **Após cada sprint** | Coverage report | skill-performance |

---

**Próximo:** skill-documentador detalha TEST-STRATEGY.md
