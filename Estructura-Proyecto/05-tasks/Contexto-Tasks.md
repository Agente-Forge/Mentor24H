# ✅ TASKS — Contexto

**Responsabilidade:** Registrar roadmap, sprints e tarefas concretas.

**O que mora aqui:**
- `ROADMAP.md` — Visão de 3 fases (Fase 1, 2, 3)
- `SPRINT-PLAN.md` — Sprints detalhadas (skill-planner preenche)
- `task-register.json` — JSON com tasks estruturadas

---

## 🎯 Propósito

Quebrar projeto grande (Mentor24h) em **partes menores e alcançáveis** (sprints e tasks).

Permite:
- ✅ Estimar tempo realista
- ✅ Priorizar o mais importante
- ✅ Acompanhar progresso
- ✅ Não perder nada no caminho

---

## 📋 Estrutura

### ROADMAP.md

Visão de alto nível em 3 fases:

```markdown
# ROADMAP — Mentor24h em 3 Fases

## Fase 1: MVP CONSOLIDADO (1-2 semanas)
Objetivo: Produto básico funcional

[ ] Completar páginas vazias (Produtos, Vendas, Estoque, Clientes)
[ ] Testes automatizados (unit + e2e)
[ ] Documentação FORGE completa
[ ] Security audit (SBOM, CVE)
[ ] Deploy estável em GitHub Pages

## Fase 2: PRODUTO ROBUSTO (1-2 meses)
Objetivo: Pronto para uso real

[ ] Integração WhatsApp Business API (real, não simulado)
[ ] LLM real (OpenRouter/OpenAI com API key)
[ ] Banco de dados remoto (Firebase/Supabase)
[ ] Autenticação + 2FA
[ ] Mobile otimizado

## Fase 3: ESCALA (3+ meses)
Objetivo: Pronto para crescimento

[ ] React/Next.js migration (opcional)
[ ] Admin dashboard
[ ] Marketplace
[ ] Integrações (Stripe, Shopify)
```

---

### SPRINT-PLAN.md

Sprints detalhadas com tasks concretas.

**Formato:**
```markdown
# SPRINT-PLAN — Sprints Detalhadas

## Sprint 1: Consolidação MVP (Semana 1)
**Goal:** Completar Fase 1

**Tasks:**
1. [ ] Completar página Produtos (2h)
   - Componentes CRUD
   - Validação de campos
   - Integração com DB
   
2. [ ] Testes para Produtos (1h)
   - Unit tests: CRUD operations
   - E2E: fluxo completo
   
3. [ ] Security audit (1h)
   - SBOM gerado
   - CVEs listadas
   - Policies documentadas

**Time estimate:** 4-6 horas
**Dependencies:** Nenhuma
**Risk:** Pode estender se encontrar bugs
```

---

### task-register.json

Estrutura JSON com todas as tasks.

**Formato:**
```json
{
  "sprint_1": {
    "name": "Consolidação MVP",
    "duration_days": 7,
    "tasks": [
      {
        "id": "T-001",
        "title": "Completar página Produtos",
        "description": "CRUD para produtos do negócio",
        "assigned_to": "skill-construtor",
        "estimate_hours": 2,
        "status": "pending",
        "dependencies": [],
        "risk": "low"
      }
    ]
  }
}
```

---

## 🔄 Fluxo

```
skill-planner (Fase [3])
  ├─ Lê PRD.md (skill-consultor preencheu)
  ├─ Gera ROADMAP.md (visão 3 fases)
  ├─ Gera SPRINT-PLAN.md (sprints detalhadas)
  └─ Gera task-register.json (estrutura)
         ↓
skill-construtor (Fase [6])
  ├─ Lê SPRINT-PLAN.md
  ├─ Pega Sprint 1 tasks
  ├─ Desenvolve conforme tasks
  └─ Marca como done quando termina
         ↓
skill-orquestrador (coordenação)
  ├─ Monitora progresso de tasks
  ├─ Verifica desvios
  └─ Aprova ou envia pra retrabalho
```

---

## 📝 Betting Table (Risk vs. Reward)

Durante planning, skill-planner cria uma "Betting Table" para cada sprint:

```
Task              | Complexidade | Risco | Reward | Prioridade
────────────────────────────────────────────────────────────────
Chat AI (LLM)     | ALTA         | ALTA  | ALTA   | P0 (crítica)
WhatsApp CRM      | ALTA         | MÉDIA | ALTA   | P0 (crítica)
Testes            | MÉDIA        | BAIXA | MÉDIA  | P1
Security audit    | BAIXA        | BAIXA | MÉDIA  | P1
```

---

**Próximo:** skill-planner preenche SPRINT-PLAN.md
