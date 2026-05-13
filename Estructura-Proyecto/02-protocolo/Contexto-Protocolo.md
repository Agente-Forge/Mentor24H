# 🛠️ PROTOCOLO — Contexto

**Responsabilidade:** Definir padrões, convenções e decisões arquiteturais do Mentor24h.

**O que mora aqui:**
- `AGENTS.md` — Padrões de código (você preenche com 8 seções)
- `CODE-STYLE.md` — Guia de estilo JavaScript específico
- `CONVENTIONS.md` — Naming conventions, organização de pastas

---

## 🎯 Propósito

Esta pasta define **como** o código deve ser escrito no Mentor24h. É um contrato entre você e as skills (Claude).

Cada skill que trabalha neste projeto lê AGENTS.md para:
- ✅ Saber padrões de naming (camelCase, kebab-case, etc)
- ✅ Entender estrutura de pastas
- ✅ Conhecer design tokens e componentes
- ✅ Seguir regras de segurança específicas
- ✅ Não reinventar a roda (reuso de padrões)

---

## 📋 Arquivos

### AGENTS.md (VOCÊ PREENCHE)

8 seções que você deve completar:

1. **Estrutura & Organização** — Pastas, naming conventions
2. **Design & Estilos** — Design tokens, componentes reutilizáveis
3. **JavaScript** — Estilo de código, DB, async, router
4. **Testes** — Estratégia de teste, cobertura mínima
5. **Segurança & Compliance** — Senhas, validação, sanitização
6. **Documentação** — Comentários, commit messages
7. **Deployments & Release** — Versionamento, checklist
8. **Comunicação & Handoff** — Onboarding, handover

**Status:** ⏳ Aguardando seu preenchimento

---

### CODE-STYLE.md (Template)

Complemento mais detalhado de AGENTS.md seção 3 (JavaScript).

**Exemplo:**
```
- const vs let vs var → REGRA
- Arrow functions → quando usar
- Destructuring → convenção
- Async/await vs promises → padrão
```

---

### CONVENTIONS.md (Template)

Naming conventions específicas do projeto.

**Exemplo:**
```
Variáveis:      camelCase (userAge, configData)
Constantes:     UPPER_SNAKE_CASE (API_KEY, MAX_RETRIES)
Classes:        PascalCase (UserManager, DatabaseService)
Funções:        camelCase (calculateTotal, fetchData)
Arquivos CSS:   kebab-case (user-profile.css)
Arquivos JS:    camelCase (userManager.js)
Pastas:         kebab-case (user-profile/, chat-ai/)
```

---

## 🔄 Fluxo

```
Você (agora)
  ├─ Lê AGENTS.md
  ├─ Preenche 8 seções
  └─ Salva
         ↓
Claude + Skills (depois)
  ├─ Lê AGENTS.md
  ├─ Segue padrões ao escrever código
  └─ Garante consistência
         ↓
skill-sentinela (em paralelo com construtor)
  ├─ Valida se código segue AGENTS.md
  ├─ Alerta se violações encontradas
  └─ Bloqueia merge se necessário
```

---

## ⚡ Quick Links

- **Preencher agora:** [AGENTS.md](AGENTS.md)
- **Vê exemplo completo:** Skills Agente Forge 2.0/AGENTS.md.template

---

**Próximo:** Você preenche AGENTS.md (8 seções) → depois chamamos skill-consultor
