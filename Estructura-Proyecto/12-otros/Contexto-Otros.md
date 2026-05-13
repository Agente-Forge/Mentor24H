# 🔗 OTROS — Contexto

**Responsabilidade:** Manter referências, links e configurações externas.

**O que mora aqui:**
- `REFERENCES.md` — Links úteis para o projeto
- `EXTERNAL-LINKS.md` — Integrações e APIs
- `TOOLS-CONFIG.md` — Configuração de ferramentas

---

## 🎯 Propósito

Centralizar **informações externas** ao projeto que são referências constantes.

Permite:
- ✅ Acesso rápido a documentações
- ✅ Configurações de ferramentas
- ✅ Links de integrações
- ✅ Padrões de referencias

---

## 📋 Arquivos

### REFERENCES.md

Links úteis e referências para desenvolvimento.

```markdown
# REFERENCES — Mentor24h

## Documentação Oficial

- [MDN Web Docs](https://developer.mozilla.org/) — Reference de HTML/CSS/JS
- [ECMAScript Standard](https://tc39.es/ecma262/) — Especificação JS

## Design System

- [Aurora Design System](./Estructura-Proyecto/01-documentacao/CONSTITUTION.md)
- [Design Tokens](./Estructura-Proyecto/02-protocolo/AGENTS.md#design-tokens)

## Stack

- HTML5: [HTML Living Standard](https://html.spec.whatwg.org/)
- CSS3: [CSS Specifications](https://www.w3.org/Style/CSS/Overview.en.html)
- JavaScript: [JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)
- localStorage API: [Web Storage](https://html.spec.whatwg.org/multipage/webstorage.html)

## Deploy

- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [GitHub Actions](https://docs.github.com/en/actions)

## FORGE System

- [FORGE Digital Production House](../../Skills%20Agente%20Forge%202.0/Plano%20das%20Skills/FLUXO-DIGITAL-PRODUCTION-HOUSE.md)
- [INDEX-SKILLS](../../Skills%20Agente%20Forge%202.0/INDEX-SKILLS.md)
```

---

### EXTERNAL-LINKS.md

Integrações e APIs externas.

```markdown
# EXTERNAL-LINKS — Mentor24h

## LLM Providers

### OpenRouter (Default)
- **URL:** https://openrouter.ai/
- **Docs:** https://openrouter.ai/docs
- **Models:** Claude, GPT-4, Gemini
- **Config:** Salva em localStorage como `mentor24h.llm-config`

### OpenAI
- **URL:** https://platform.openai.com/
- **Docs:** https://platform.openai.com/docs/
- **Models:** GPT-4, GPT-3.5-turbo
- **API Endpoint:** https://api.openai.com/v1/chat/completions

### Google Gemini
- **URL:** https://ai.google.dev/
- **Docs:** https://ai.google.dev/docs
- **Models:** Gemini Pro, Gemini Pro Vision
- **API Endpoint:** https://generativelanguage.googleapis.com/

### Anthropic Claude
- **URL:** https://www.anthropic.com/
- **Docs:** https://docs.anthropic.com/
- **Models:** Claude 3.5 Sonnet, Claude 3 Opus
- **API Endpoint:** https://api.anthropic.com/v1/messages

---

## WhatsApp Integration (Fase 2)

### WhatsApp Business API
- **URL:** https://developers.facebook.com/docs/whatsapp/cloud-api/
- **Status:** ⏳ MVP usa simulado, Fase 2 → Real
- **Setup:** Requer conta Meta Business

---

## Design Resources

### Google Fonts
- **URL:** https://fonts.google.com/
- **Fonts usados:** Instrument Serif, Geist, Geist Mono
- **CDN:** https://fonts.googleapis.com

### Icons
- Custom SVG inline (50+ ícones em js/icons.js)
```

---

### TOOLS-CONFIG.md

Configuração de ferramentas.

```markdown
# TOOLS-CONFIG — Setup de Ferramentas

## Local Development

### Live Server (VSCode Extension)
```
Instalar: Live Server extension
Rodar: Open with Live Server
Acessa: http://localhost:5500
```

### Browser DevTools
```
Chrome DevTools (F12)
  - Elements: Inspeccionar HTML/CSS
  - Console: Debug JS
  - Network: Auditar requisições
  - Performance: Profile performance
  - Application: localStorage inspector
```

---

## GitHub Setup

### Repo Config
```
Repository: mentor24h
Visibility: Public (para GitHub Pages)
Pages: main branch → GitHub Pages
```

### Branches
```
main     → Production
develop  → Staging
feature/* → Features (ephemeral)
```

---

## Environment Variables (Fase 2)

```
.env.local (local, nunca commit)
  VITE_OPENROUTER_KEY=sk-xxx
  VITE_OPENAI_KEY=sk-xxx
  
.env.example (template, SIM commit)
  VITE_OPENROUTER_KEY=your-key-here
  VITE_OPENAI_KEY=your-key-here
```

---

## CI/CD Pipeline (Futuro)

```yaml
# .github/workflows/deploy.yml (Fase 2)
name: Deploy
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Test
        run: npm test
      - name: Deploy
        run: npm run deploy
```
```

---

**Próximo:** Adicionar referências conforme necessário
