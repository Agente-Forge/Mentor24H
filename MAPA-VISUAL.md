# 📍 MAPA VISUAL — Estructura Mentor24h

**Versão:** 1.0 | **Data:** 2026-05-12 | **Status:** ✅ Pronto

---

## 🗺️ Visão Geral

```
controle-financeiro v2/
├── INICIO.md ..................... Entry point (comece aqui)
├── MAPA-VISUAL.md ................ Você está aqui 👈
├── INDEX-SKILLS.md ............... 12 skills do FORGE
├── README.md ..................... Overview do projeto
│
├── .memoria/ ..................... Contexto persistente
│   ├── working-memory.json ....... Estado do projeto (18 módulos, 3500 linhas)
│   ├── decision-log.json ......... 8 decisões arquiteturais + 3 perguntas abertas
│   ├── sprint-journal.json ....... (novo) Histórico de sprints
│   └── skill-context.json ........ (novo) Contexto para próximas skills
│
├── Estructura-Proyecto/ .......... 12 pastas temáticas
│   ├── 01-documentacao/ .......... PRD, SPEC, CONSTITUTION
│   ├── 02-protocolo/ ............ AGENTS.md (padrões)
│   ├── 03-decisoes/ ............. ADR (Architecture Decision Records)
│   ├── 04-memorias/ ............. Audit trail, lições aprendidas
│   ├── 05-tasks/ ................ ROADMAP, SPRINT-PLAN
│   ├── 06-bugs/ ................. Log de bugs
│   ├── 07-testes/ ............... Estratégia de testes
│   ├── 08-performance/ .......... Métricas e otimizações
│   ├── 09-seguranca/ ............ SBOM, CVE, policies
│   ├── 10-deploy/ ............... Deployment guide, release checklist
│   ├── 11-health/ ............... Health checks, alertas
│   └── 12-otros/ ................ Referências e links externos
│
├── data/ ......................... Dados de seed/demo
│   ├── seed.json ................. (ex: leo-import.json)
│   ├── default-config.json ....... Template de config
│   └── demo-data.json ............ Dados de demonstração
│
├── src/ (ou raiz) ................ Código-fonte
│   ├── index.html ................ UI
│   ├── js/ ....................... JavaScript módulos
│   ├── css/ ....................... Estilos
│   └── [resto intacto]
│
└── [.gitignore, package.json, etc.]
```

---

## 🎯 Tabela Rápida: Qual Pasta Para Quê?

| Pasta | Propósito | Quem Preenche | Status |
|-------|-----------|--------------|--------|
| **01-documentacao/** | PRD, SPEC, CONSTITUTION | skill-consultor | ⏳ Pendente |
| **02-protocolo/** | AGENTS.md (padrões) | **Você** | ⏳ Pendente |
| **03-decisoes/** | Decisões arquiteturais (ADR) | skill-scaffolder | ✅ Criada |
| **04-memorias/** | Audit trail, lições | Você + skills | ✅ Template |
| **05-tasks/** | ROADMAP, sprints, tasks | skill-planner | ⏳ Pendente |
| **06-bugs/** | Log e rastreamento de bugs | skill-sentinela | ⏳ Pendente |
| **07-testes/** | Estratégia e casos de teste | skill-documentador | ⏳ Pendente |
| **08-performance/** | Métricas e otimizações | skill-performance | ⏳ Pendente |
| **09-seguranca/** | SBOM, CVE, policies | skill-seguranca | ⏳ Pendente |
| **10-deploy/** | Deployment guide, CI/CD | skill-devops | ⏳ Pendente |
| **11-health/** | Health checks, observability | skill-health-monitor | ⏳ Pendente |
| **12-otros/** | Links externos, ferramentas | Você | ✅ Template |

---

## 📖 Fluxo de Leitura Recomendado

### Para Novo Dev (ou você revisitando):

```
1. INICIO.md (você está aqui)
   ↓
2. MAPA-VISUAL.md (este arquivo)
   ↓
3. .memoria/working-memory.json (contexto do projeto)
   ↓
4. Estructura-Proyecto/02-protocolo/AGENTS.md (padrões de código)
   ↓
5. Estructura-Proyecto/01-documentacao/PRD.md (quando ready)
   ↓
6. src/index.html (comece a explorar código)
```

### Para Entender Decisões Arquiteturais:

```
Estructura-Proyecto/03-decisoes/
├── ADR-001.md ← Transformar FinFlow em Mentor24h
├── ADR-002.md ← HTML + JS puro vs React
├── ADR-003.md ← Multi-provider LLM
├── ADR-004.md ← localStorage MVP
├── ADR-005.md ← Aurora Design System
├── ADR-006.md ← Sidebar accordion
├── ADR-007.md ← GitHub Pages deploy
└── ADR-008.md ← Adotar FORGE
```

### Para Entender Roadmap:

```
Estructura-Proyecto/05-tasks/
├── ROADMAP.md (3 fases: MVP Consolidado, Produto Robusto, Escala)
└── SPRINT-PLAN.md (quando skill-planner preencher)
```

---

## ⚙️ Estrutura de Pastas: Detalhes

### Estructura-Proyecto/01-documentacao/

```
├── Contexto-Documentacao.md .... Explica propósito da pasta
├── PRD.md ....................... Product Requirements Document (skill-consultor)
├── SPEC.md ....................... Specification técnica (skill-documentador)
└── CONSTITUTION.md .............. 22 leis invioláveis (skill-consultor)
```

**Quando preencher:** Após skill-consultor

---

### Estructura-Proyecto/02-protocolo/

```
├── Contexto-Protocolo.md ........ Explica propósito da pasta
├── AGENTS.md ..................... Padrões de código (VOCÊ PREENCHE)
├── CODE-STYLE.md ................ Guia de estilo JS
└── CONVENTIONS.md ............... Naming conventions
```

**Seu trabalho:** Preencher AGENTS.md (8 seções)

---

### Estructura-Proyecto/03-decisoes/

```
├── Contexto-Decisoes.md ......... Explica propósito da pasta
├── ADR-001.md ... Transformar FinFlow em Mentor24h
├── ADR-002.md ... HTML + JS puro vs React
├── ADR-003.md ... Multi-provider LLM
├── ADR-004.md ... localStorage MVP
├── ADR-005.md ... Aurora Design System
├── ADR-006.md ... Sidebar accordion
├── ADR-007.md ... GitHub Pages deploy
└── ADR-008.md ... Adotar FORGE
```

**Status:** ✅ Já criadas (ADRs expandidas de decision-log.json)

---

### Estructura-Proyecto/05-tasks/

```
├── Contexto-Tasks.md ............ Explica propósito da pasta
├── ROADMAP.md ................... Roadmap 3 fases (já em working-memory.json)
├── SPRINT-PLAN.md ............... Sprints detalhados (skill-planner preenche)
└── task-register.json ........... JSON com tasks (skill-planner gera)
```

**Quando preencher:** skill-planner (próxima skill)

---

### data/

```
├── seed.json ..................... Dados de demo/seed (ex: leo-import.json)
├── default-config.json ........... Template de configuração padrão
└── demo-data.json ............... Dados para demonstração
```

**Status:** ✅ seed.json = MOVE leo-import.json aqui

---

## 🔄 Fluxo de Skills (Como Tudo Se Conecta)

```
skill-orquestrador v5.2
    ├─ Entrevista 6 dimensões
    └─ Diagnóstico Executivo ✅ (já feito)
          ↓
skill-consultor v5.2
    ├─ Detalhes PRD.md
    ├─ Cria CONSTITUTION.md
    └─ Prioriza features
          ↓
skill-planner v5.1
    ├─ ROADMAP.md
    ├─ SPRINT-PLAN.md
    └─ Betting Table (risco vs. reward)
          ↓
skill-scaffolder v5.1
    ├─ Cria esta estrutura ✅ (você está aqui)
    ├─ Inicializa .memoria/
    └─ Gera AGENTS.md
          ↓
[5a] skill-documentador + [5b] skill-forge-visual + [5c] skill-seguranca (PARALELO)
    ├─ SPEC.md (documentador)
    ├─ Design tokens (forge-visual)
    └─ SBOM + policies (seguranca)
          ↓
[6] skill-construtor + [6s] skill-sentinela (PARALELO)
    ├─ Desenvolvimento TDD
    └─ Code review real-time
          ↓
[7] skill-performance
    └─ Auditoria performance
          ↓
skill-devops
    └─ Deploy ao vivo
          ↓
skill-health-monitor
    └─ Manutenção semanal (pós-deploy)
```

---

## ✅ Status Atual

| Item | Status | Quem Fez |
|------|--------|---------|
| working-memory.json | ✅ Criado | skill-scaffolder v5.1 |
| decision-log.json | ✅ Criado | skill-scaffolder v5.1 |
| AGENTS.md | ✅ Template | skill-scaffolder v5.1 |
| Estructura-Proyecto/ | ✅ 12 pastas | skill-scaffolder v5.1 |
| INICIO.md | ✅ Criado | skill-scaffolder v5.1 |
| MAPA-VISUAL.md | ✅ Criado | skill-scaffolder v5.1 |
| ADR-001 a 008 | ✅ Criados | skill-scaffolder v5.1 |
| Contexto-*.md | ✅ 12 arquivos | skill-scaffolder v5.1 |

---

## 🎯 Seu Próximo Passo

**AGORA:**
```
Você → Preencher Estructura-Proyecto/02-protocolo/AGENTS.md
       (8 seções de padrões de código)
```

**DEPOIS:**
```
Claude → Chamar skill-consultor
         (vai detalhar PRD + CONSTITUTION)
```

---

## 💡 Quick Links

- **Contexto do projeto?** → [.memoria/working-memory.json](.memoria/working-memory.json)
- **Decisões tomadas?** → [Estructura-Proyecto/03-decisoes/](Estructura-Proyecto/03-decisoes/)
- **Padrões de código?** → [Estructura-Proyecto/02-protocolo/AGENTS.md](Estructura-Proyecto/02-protocolo/AGENTS.md)
- **Timeline?** → [.memoria/working-memory.json](.memoria/working-memory.json) (seção roadmap)
- **Precisa de ajuda?** → Leia [INICIO.md](INICIO.md)

---

**Status:** ✅ Estrutura completa e pronta. Próximo: preencher AGENTS.md 🎯
