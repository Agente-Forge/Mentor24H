# 💚 HEALTH — Contexto

**Responsabilidade:** Monitorar saúde do projeto em produção.

**O que mora aqui:**
- `PROJECT-HEALTH.md` — Relatório de saúde geral
- `DEPENDENCY-REPORT.md` — Status de dependências
- `health-metrics.json` — Métricas em JSON

---

## 🎯 Propósito

Após deploy, garantir que Mentor24h **continua saudável** ao longo do tempo.

**Health checks semanais validam:**
- ✅ Performance (Core Web Vitals)
- ✅ Segurança (CVE updates)
- ✅ Documentação (atualizada?)
- ✅ Cobertura de testes (não degradou?)
- ✅ Uptime (site está online?)

---

## 📋 Arquivos

### PROJECT-HEALTH.md

Relatório de saúde geral.

```markdown
# PROJECT-HEALTH — Mentor24h

**Semana de:** 2026-05-19  
**Score:** 85/100 🟡

## Resumo

Projeto está SAUDÁVEL com alguns avisos.

---

## 1. Performance

**Status:** 🟢 OK

- LCP: 1.8s (target 2.5s) ✅
- FID: 75ms (target 100ms) ✅
- CLS: 0.05 (target 0.1) ✅
- Lighthouse: 92/100 ✅

---

## 2. Segurança

**Status:** 🟢 OK

- CVE vulnerabilities: 0 ✅
- API keys exposed: 0 ✅
- XSS issues: 0 ✅
- SBOM updated: 2026-05-15 ✅

---

## 3. Documentação

**Status:** 🟡 PARTIAL

- README.md: ✅ atualizado
- SPEC.md: ✅ completo
- CONSTITUTION.md: ✅ completo
- CHANGELOG.md: ⚠️ desatualizado (2 sprints)

**Action:** Atualizar CHANGELOG.md próxima semana

---

## 4. Testes

**Status:** 🟢 OK

- Tests passing: 47/47 ✅
- Coverage: 72% (target 70%) ✅
- E2E passing: 12/12 ✅

---

## 5. Uptime

**Status:** 🟢 OK

- Site online: ✅ 99.9%
- Database responsive: ✅ OK
- Errors in console: 0 ✅

---

## Overall Score

| Category | Score | Trend |
|----------|-------|-------|
| Performance | 95/100 | ↗️ +2 |
| Security | 90/100 | → |
| Docs | 75/100 | ↘️ -5 |
| Tests | 90/100 | → |
| Uptime | 99/100 | → |
| **TOTAL** | **85/100** | ↗️ +1 |

---

## Próximas Ações

1. ⏳ Atualizar CHANGELOG.md (docs)
2. 📈 Adicionar mais E2E tests (coverage)
3. 🔍 Revisar dependency updates
```

---

### DEPENDENCY-REPORT.md

Status de dependências externas.

```markdown
# DEPENDENCY-REPORT — Mentor24h

**Verificado em:** 2026-05-19

## External Resources

| Resource | Current | Latest | Status | Action |
|----------|---------|--------|--------|--------|
| Google Fonts | — | — | ✅ OK | None |
| GitHub Pages | — | — | ✅ OK | None |

## Dev Dependencies (para futuro)

| Package | Current | Latest | Status |
|---------|---------|--------|--------|
| Jest | — | — | TBD |
| Webpack | — | — | TBD |

## CVE Status

```bash
npm audit
# 0 vulnerabilities found
```
```

---

### health-metrics.json

Métricas em JSON para tracking programático.

```json
{
  "week": "2026-05-19",
  "overall_score": 85,
  "metrics": {
    "performance": 95,
    "security": 90,
    "documentation": 75,
    "tests": 90,
    "uptime": 99
  },
  "trend": "+1 week"
}
```

---

## 🔄 Fluxo

```
skill-health-monitor (1x/semana, automático)
  ├─ Roda testes
  ├─ Mede performance
  ├─ Checa CVEs
  ├─ Valida docs
  └─ Gera PROJECT-HEALTH.md
       ↓
SE tudo OK:
  └─ Relatório: "Projeto saudável ✅"
  
SE problema encontrado:
  ├─ Alerta skill-orquestrador
  └─ skill-orquestrador: "Preciso consertar [X]?"
     └─ Se sim: skill-construtor (sprint de correção)
```

---

## 📊 Score Interpretation

- **90-100:** Excelente — nenhuma ação necessária
- **80-89:** Bom — alguns avisos (docs, tests)
- **70-79:** Aceitável — ação recomendada
- **< 70:** Crítico — ação necessária agora

---

**Próximo:** skill-health-monitor roda 1x/semana após deploy
