# ⚡ PERFORMANCE — Contexto

**Responsabilidade:** Medir, monitorar e otimizar performance.

**O que mora aqui:**
- `METRICS.md` — Métricas de baseline e targets
- `OPTIMIZATION-LOG.md` — Log de otimizações realizadas
- `perf-baselines.json` — Baselines em JSON

---

## 🎯 Propósito

Garantir que Mentor24h **executa rapidamente** para melhor experiência do usuário.

**Web Vitals Target:**
- ✅ LCP (Largest Contentful Paint): < 2.5s
- ✅ FID (First Input Delay): < 100ms
- ✅ CLS (Cumulative Layout Shift): < 0.1

---

## 📋 Arquivos

### METRICS.md

Métricas e baselines.

```markdown
# METRICS — Performance Baseline

**Medido em:** Desktop (Chrome) + Mobile (Chrome)

## Core Web Vitals

| Métrica | Desktop Target | Mobile Target | Current |
|---------|---|---|---|
| LCP | < 2.5s | < 4.0s | — |
| FID | < 100ms | < 100ms | — |
| CLS | < 0.1 | < 0.1 | — |

## Page Load Times

| Page | Desktop | Mobile | Status |
|------|---------|--------|--------|
| Dashboard | < 1.5s | < 2.5s | 🔴 PENDING |
| Chat AI | < 1.0s | < 2.0s | 🔴 PENDING |
| Chat WA | < 1.5s | < 2.5s | 🔴 PENDING |

## Bundle Size

- `index.html`: target < 50KB
- `js/`: target < 200KB total
- `css/`: target < 50KB total
- `Total`: target < 300KB (gzipped)
```

---

### OPTIMIZATION-LOG.md

Log de otimizações realizadas.

```markdown
## [2026-05-15] LCP Otimização — Critical Rendering Path

**Baseline:** 3.2s  
**Target:** 2.5s  
**Result:** ✅ 1.8s (28% improvement)

**Changes:**
- Reordenado CSS crítico inline
- Lazy-load de imagens nāo-críticas
- Removeudo animações desnecessárias em dashboard

---

## [2026-05-14] Mobile Performance — Bundle Size

**Baseline:** 350KB  
**Target:** 300KB  
**Result:** ✅ 280KB (20% reduction)

**Changes:**
- Minificado JS/CSS
- Removido código dead
- Compressão GZIP habilitada no servidor
```

---

### perf-baselines.json

Estrutura JSON para tracking programático.

```json
{
  "baseline_date": "2026-05-12",
  "metrics": {
    "lcp": {
      "desktop": 3500,
      "mobile": 4200,
      "target": 2500
    },
    "fid": {
      "desktop": 85,
      "mobile": 120,
      "target": 100
    }
  }
}
```

---

## 🔄 Fluxo

```
skill-construtor entrega código
  ↓
skill-performance audita:
  ├─ Mede Web Vitals
  ├─ Identifica bottlenecks
  └─ Gera relatório
       ↓
SE performance OK:
  └─ Aprova merge
  
SE performance ruim:
  └─ Envia de volta pra skill-construtor otimizar
```

---

**Próximo:** skill-performance preenche METRICS.md após cada sprint
