# 📍 ÍNDICE — 12 Skills FORGE Mentor24h

**Última atualização:** 2026-05-12  
**Total de skills:** 12 (10 principais + 2 bônus)  
**Status:** 🟢 Orquestração completa

---

## 🎯 VISÃO RÁPIDA (Ordem de Execução)

```
[1] skill-orquestrador v5.2     → Maestrina (coordena tudo)
[2] skill-consultor v5.2        → PRD + CONSTITUTION
[3] skill-planner v5.1          → Sprints + Tasks + Betting
[4] skill-scaffolder v5.1       → Estrutura + .memoria/ ✅ (você está aqui)
[5a] skill-documentador v5.0    → SPEC + exemplos + glossário (PARALELO)
[5b] skill-forge-visual v5.0    → Design tokens + Figma (PARALELO)
[5c] skill-seguranca v1.0       → SBOM + CVE + security baseline (PARALELO)
[6] skill-construtor v5.1       → Desenvolvimento TDD
[6s] skill-sentinela v5.1       → Code review real-time (PARALELO COM 6)
[7] skill-performance v1.1      → Auditoria performance
[8] skill-devops v1.0 ⭐        → Deploy + CI/CD [NOVO]
[9] skill-health-monitor v1.0 ⭐ → Health checks semanais [NOVO]
```

---

## 📋 DETALHES DE CADA SKILL

### [1] skill-orquestrador v5.2 — MAESTRINA

**Função:** Coordena todo fluxo FORGE

**O que faz:**
- Entrevista 6 dimensões (descoberta)
- Gera diagnóstico executivo
- Comanda transições entre skills
- Monitora desvios de plano
- Aprova merges e deploys

**Input:** Cliente + ideia vaga  
**Output:** Diagnóstico Executivo  
**Tempo:** 15-30 min + contínuo  
**Status:** ✅ Já executada (descoberta feita)

---

### [2] skill-consultor v5.2 — DETALHA SPEC

**Função:** Define requisitos e regras do projeto

**O que faz:**
- Detalha PRD (Product Requirements Document)
- Cria CONSTITUTION (22 leis invioláveis)
- Prioriza features por fase
- Valida arquitetura geral

**Input:** Diagnóstico Executivo  
**Output:** PRD.md + CONSTITUTION.md  
**Tempo:** 30-60 min  
**Status:** ⏳ Próxima

---

### [3] skill-planner v5.1 — ROADMAP

**Função:** Quebra projeto em sprints e tasks

**O que faz:**
- Organiza features em sprints
- Cria task list (concretas e mensuráveis)
- Gera Betting Table (risco vs. reward)
- Define timeline realista

**Input:** Feature List priorizada  
**Output:** Sprint Journal + Tasks + Betting Table  
**Tempo:** 20-40 min  
**Status:** ⏳ Próxima

---

### [4] skill-scaffolder v5.1 — ESTRUTURA + MEMÓRIA

**Função:** Cria scaffolding do projeto

**O que faz:**
- Cria pasta `projeto/` com estrutura temática (12 pastas)
- Inicializa `.memoria/` (working-memory.json, decision-log.json)
- Gera AGENTS.md (padrões — você preenche)
- Gera DECISIONS.md (log de decisões)
- Cria AI_CONTEXT.md (contexto para próximas skills)

**Input:** Appetite + Nível  
**Output:** Pasta projeto/ completa  
**Tempo:** 5-10 min  
**Status:** ✅ EXECUTADA (você está aqui)

---

### [5a] skill-documentador v5.0 — DOCUMENTAÇÃO

**Função:** Cria documentação técnica executável

**O que faz:**
- Valida PRD e CONSTITUTION
- Gera SPEC.md completo (fonte de verdade técnica)
- Cria QUICK-START-EXEMPLOS.md (7 exemplos rodáveis)
- Gera GLOSSARIO.md (18 termos explicados)
- Cria ARQUITETURA-VISUAL.md (diagrama Mermaid)
- Gera MANUTENCAO-DOCS.md (checklist mensal/trimestral)

**Input:** PRD + CONSTITUTION  
**Output:** SPEC.md + exemplos + glossário + arquitetura  
**Tempo:** 30-45 min  
**Status:** ⏳ Próxima (após planner)

---

### [5b] skill-forge-visual v5.0 — DESIGN SYSTEM

**Função:** Define identidade visual do projeto

**O que faz:**
- Cria design tokens (colors, spacing, typography)
- Gera Figma file com componentes
- Produz CSS variables prontos para uso
- Estabelece design system coerente

**Input:** CONSTITUTION + Feature List  
**Output:** Design tokens + Figma + CSS variables  
**Tempo:** 30-60 min  
**Status:** ⏳ Próxima (após planner)

---

### [5c] skill-seguranca v1.0 — SECURITY BASELINE

**Função:** Estabelece baseline de segurança

**O que faz:**
- Gera SBOM (Software Bill of Materials)
- Lista CVEs da stack
- Define secret patterns (o que não commitar)
- Cria compliance checklist
- Estabelece security policies

**Input:** Stack + Appetite + Nível segurança  
**Output:** SBOM + CVE list + policies  
**Tempo:** 20-30 min  
**Status:** ⏳ Próxima (após planner)

---

### [6] skill-construtor v5.1 — DESENVOLVIMENTO

**Função:** Escreve código

**O que faz:**
- Desenvolve usando TDD (testes PRIMEIRO)
- Segue design tokens sem exceção
- Implementa security baseline
- Cria PRs prontos para review
- Roda em sprints (2-8h por sprint)

**Input:** SPEC.md + Design tokens + Security baseline + Sprint tasks  
**Output:** Código + testes + PR  
**Tempo:** 2-8h por sprint (LOOP até completion)  
**Status:** ⏳ Próxima (após [5a,5b,5c])

---

### [6s] skill-sentinela v5.1 — CODE REVIEW

**Função:** Valida código em tempo real

**O que faz:**
- Code review automático (cada commit)
- Valida padrões do projeto (AGENTS.md)
- Checa se segue CONSTITUTION
- Alerta se violações encontradas
- Bloqueia merge se necessário

**Input:** Commits de skill-construtor  
**Output:** Alerta ou aprovação  
**Tempo:** Real-time (paralelo com construtor)  
**Status:** ⏳ Próxima (paralelo com construtor)

---

### [7] skill-performance v1.1 — AUDITORIA

**Função:** Valida performance como requirement

**O que faz:**
- Auditoria de performance
- Mede Core Web Vitals
- Identifica bottlenecks específicos
- Sugere otimizações concretas
- Libera ou bloqueia merge

**Input:** Código de skill-construtor  
**Output:** Performance report + recomendações  
**Tempo:** 20-40 min  
**Status:** ⏳ Próxima (após construtor)

---

### [8] skill-devops v1.0 ⭐ — DEPLOY + CI/CD

**Função:** Leva código para produção

**O que faz:**
- Pré-deploy checks (segurança, testes)
- Deploy ao vivo (GitHub Pages / Vercel / outro)
- Pós-deploy verification (health checks)
- Gerencia CI/CD pipeline
- Rollback automático se erro

**Input:** Código completo e aprovado  
**Output:** Projeto ao vivo  
**Tempo:** 30-60 min  
**Status:** ⏳ Próxima (após performance ✅)

---

### [9] skill-health-monitor v1.0 ⭐ — MANUTENÇÃO

**Função:** Monitora saúde do projeto

**O que faz:**
- Health checks 1x/semana (automático)
- Valida: Performance, Segurança, Docs, Cobertura, Uptime
- Alerta se degradação encontrada
- Recomenda ações corretivas
- Roda indefinidamente após deploy

**Input:** Projeto ao vivo  
**Output:** Health report semanal  
**Tempo:** 10-15 min (1x/semana)  
**Status:** ⏳ Próxima (após deploy)

---

## 🔄 FLUXO ORQUESTRADO

```
START
  ↓
[1] skill-orquestrador
  ├─ Entrevista
  └─ Diagnóstico ✅
       ↓
[2] skill-consultor
  ├─ PRD.md
  └─ CONSTITUTION.md
       ↓
[3] skill-planner
  ├─ Sprint Journal
  └─ Tasks + Betting
       ↓
[4] skill-scaffolder ✅ (VOCÊ ESTÁ AQUI)
  ├─ Estrutura criada
  └─ .memoria/ inicializado
       ↓
╔═════════════════════════════════════╗
║  [5a,5b,5c] PARALELO (3 skills)    ║
║  → documentador + forge-visual +    ║
║    seguranca                        ║
║  (rodam sem bloquear uma a outra)   ║
╚═════════════════════════════════════╝
       ↓
╔═════════════════════════════════════╗
║  [6,6s] PARALELO                   ║
║  → construtor + sentinela           ║
║  (desenvolvimento + code review)    ║
║  (LOOP: sprints 1, 2, 3, ... N)     ║
╚═════════════════════════════════════╝
       ↓
[7] skill-performance
  ├─ Auditoria
  └─ Libera merge ✅
       ↓
SE há mais sprints:
  └─ LOOP volta pra [6]
  
SE projeto completo:
  ↓
[8] skill-devops
  ├─ Deploy
  └─ Ao vivo ✅
       ↓
[9] skill-health-monitor
  ├─ 1x/semana
  └─ Manutenção indefinida
       ↓
END (Projeto saudável)
```

---

## ⏭️ Próxima Skill a Invocar

```
Você: Preenche Estructura-Proyecto/02-protocolo/AGENTS.md (8 seções)
      ↓
Claude: Invoca skill-consultor
        (vai detalhar PRD + CONSTITUTION)
```

---

## 📚 Documentação de Cada Skill

| Skill | Arquivo | Local |
|-------|---------|-------|
| orquestrador | skill-orquestrador.md | Skills Agente Forge 2.0 |
| consultor | skill-consultor.md | Skills Agente Forge 2.0 |
| planner | skill-planner.md | Skills Agente Forge 2.0 |
| scaffolder | skill-scaffolder.md | Skills Agente Forge 2.0 |
| documentador | skill-documentador.md | Skills Agente Forge 2.0 |
| forge-visual | skill-forge-visual.md | Skills Agente Forge 2.0 |
| seguranca | skill-seguranca.md | Skills Agente Forge 2.0 |
| construtor | skill-construtor.md | Skills Agente Forge 2.0 |
| sentinela | skill-sentinela.md | Skills Agente Forge 2.0 |
| performance | skill-performance.md | Skills Agente Forge 2.0 |
| devops | skill-devops.md | Skills Agente Forge 2.0 |
| health-monitor | skill-health-monitor.md | Skills Agente Forge 2.0 |

---

**Última atualização:** 2026-05-12  
**Próxima revisão:** 2026-11-12  
**Mantido por:** skill-orquestrador + skill-health-monitor
