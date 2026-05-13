# 🚀 DEPLOY — Contexto

**Responsabilidade:** Preparar, executar e validar deployments.

**O que mora aqui:**
- `DEPLOYMENT-GUIDE.md` — Guia completo de deploy
- `RELEASE-CHECKLIST.md` — Checklist pré-deploy
- `deployment-log.json` — Log de deployments

---

## 🎯 Propósito

Garantir que Mentor24h **vai pra produção de forma segura e previsível**.

Deploy seguro significa:
- ✅ Testes passando
- ✅ Performance OK
- ✅ Segurança auditada
- ✅ Documentação atualizada
- ✅ Rollback prepared (se necessário)

---

## 📋 Arquivos

### DEPLOYMENT-GUIDE.md

Guia passo-a-passo de deploy.

```markdown
# DEPLOYMENT-GUIDE — Mentor24h

## Plataforma: GitHub Pages

### Pré-requisitos
- ✅ Repositório público em GitHub
- ✅ Branch `main` é production
- ✅ Testes passando

### Processo

1. **Validação pré-deploy**
   ```bash
   npm run test        # Rodar testes
   npm run build       # Build final
   npm run lighthouse  # Auditoria performance
   ```

2. **Commit e Push**
   ```bash
   git add .
   git commit -m "feat: prepare release v1.0.0"
   git push origin main
   ```

3. **GitHub Pages Deployment**
   - Automático após push para main
   - Aguarda ~2 minutos
   - Acessa em: https://[username].github.io/mentor24h

4. **Pós-deploy Verification**
   - ✅ Site está online
   - ✅ Dashboard carrega
   - ✅ Chat AI funciona
   - ✅ localStorage syncs

### Rollback (se necessário)
```bash
git revert [commit-sha]
git push origin main
# Site automaticamente reverte
```
```

---

### RELEASE-CHECKLIST.md

Checklist antes de deploy.

```markdown
# RELEASE-CHECKLIST — Mentor24h v1.0.0

Antes de fazer deploy, verificar:

## Code Quality
- [ ] Testes passando 100%
- [ ] Cobertura > 70%
- [ ] Sem console.errors/warnings
- [ ] Lint 0 errors

## Performance
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] Bundle size < 300KB gzipped
- [ ] Lighthouse score > 90

## Security
- [ ] SECURITY-AUDIT.md passando
- [ ] Sem API keys commitadas
- [ ] SBOM.md atualizado
- [ ] CVE check OK

## Documentação
- [ ] README.md atualizado
- [ ] SPEC.md completo
- [ ] AGENTS.md preenchido
- [ ] ADRs documentadas

## Funcionalidade
- [ ] Dashboard renderiza
- [ ] Chat AI responde
- [ ] Chat WA lista contatos
- [ ] Agenda mostra eventos
- [ ] Transações salvam

## Post-Deploy
- [ ] Site online
- [ ] Mobile responsivo
- [ ] localStorage funciona
- [ ] Sem 404s
```

---

### deployment-log.json

Log de todos os deployments.

```json
{
  "deployments": [
    {
      "id": "DEPLOY-001",
      "version": "1.0.0",
      "date": "2026-05-15T10:30:00Z",
      "deployed_by": "Claude",
      "platform": "GitHub Pages",
      "status": "SUCCESS",
      "url": "https://[user].github.io/mentor24h",
      "tests_passed": 47,
      "performance_score": 92,
      "notes": "Initial MVP launch"
    }
  ]
}
```

---

## 📊 Versioning

Seguir **Semantic Versioning (SEMVER)**:

```
MAJOR.MINOR.PATCH

- MAJOR (1.0.0): Breaking changes
- MINOR (0.1.0): New features
- PATCH (0.0.1): Bug fixes

Exemplos:
  1.0.0 → First release
  1.1.0 → Added Chat WA
  1.1.1 → Fixed localStorage bug
  2.0.0 → Migrated to React (breaking)
```

---

## 🔄 Fluxo

```
skill-construtor finaliza Sprint N
  ↓
skill-performance audita
  ↓
skill-orquestrador aprova
  ↓
skill-devops executa deploy:
  ├─ Validações
  ├─ Build
  ├─ Deploy para GitHub Pages
  └─ Pós-deploy checks
       ↓
Registra em deployment-log.json
```

---

**Próximo:** skill-devops executa deploy após Fase 1 completa
