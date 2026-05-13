# ⚖️ DECISÕES — Contexto

**Responsabilidade:** Registrar decisões arquiteturais com rationale e impacto.

**O que mora aqui:**
- `ADR-001.md` até `ADR-008.md` — Architecture Decision Records
- Cada ADR registra uma decisão + **por quê** foi tomada + impacto

---

## 🎯 Propósito

Um **ADR (Architecture Decision Record)** é um documento que explica:
- **O quê** foi decidido
- **Por quê** (rationale)
- **Qual é o impacto**
- **Qual é o status** (implementada, confirmada, em progresso)

Isso permite que futuros devs entendam não só O QUÊ foi construído, mas **POR QUÊ**.

---

## 📋 ADRs Atuais

| # | Titulo | Status | Data |
|---|--------|--------|------|
| ADR-001 | Transformar FinFlow em Mentor24h | IMPLEMENTED | 2026-05-07 |
| ADR-002 | HTML + JS puro vs React | CONFIRMED | 2026-05-07 |
| ADR-003 | Chat AI multi-provider | IMPLEMENTED | 2026-05-07 |
| ADR-004 | localStorage como persistência (MVP) | CONFIRMED | 2026-05-07 |
| ADR-005 | Aurora Design System com glassmorphism | IMPLEMENTED | 2026-05-07 |
| ADR-006 | Sidebar accordion com 4 grupos temáticos | IMPLEMENTED | 2026-05-07 |
| ADR-007 | GitHub Pages como plataforma de deploy | IMPLEMENTED | 2026-05-07 |
| ADR-008 | Adotar metodologia FORGE | IN_PROGRESS | 2026-05-11 |

---

## 🔍 Exemplo de ADR

```markdown
# ADR-003: Chat AI Multi-Provider

## Status
IMPLEMENTED

## Context
LLM integration é crítico para Mentor24h. 
Precisa suportar múltiplos provedores para flexibilidade.

## Decision
Implementar suporte para 4 provedores:
- OpenRouter (default)
- OpenAI
- Google Gemini
- Anthropic Claude

## Rationale
1. Flexibilidade máxima para usuário
2. OpenRouter como default (melhor custo-benefício)
3. Sem lock-in em um provider
4. Fallback automático se um provider cai

## Consequences
✅ Positivas: máxima flexibilidade
⚠️ Negativas: lógica LLM mais complexa

## Migration Path
Se precisar mudar de stack no futuro:
→ Migração pra React/Next.js possível na Fase 3
```

---

## 🔄 Fluxo

```
Decisão é tomada (você + Claude)
  ↓
Registrada aqui em ADR-XXX.md
  ↓
skill-consultor lê (entende contexto)
  ↓
skill-planner lê (entende impacto na timeline)
  ↓
skill-construtor lê (segue a decisão)
  ↓
Futuro dev lê (entende POR QUÊ foi construído assim)
```

---

## 📝 Como Adicionar novo ADR

Se descobrir que precisa tomar uma nova decisão arquitetural:

1. **Crie ADR-009.md** (próximo número sequencial)
2. **Preencha:**
   - Status (IMPLEMENTED / IN_PROGRESS / PENDING)
   - Context (por quê precisa decidir)
   - Decision (o quê decidiu)
   - Rationale (por quê)
   - Consequences (impacto positivo/negativo)
3. **Adicione à tabela acima** (este arquivo)

---

**Próximo:** Leia os ADRs existentes para entender decisões tomadas
