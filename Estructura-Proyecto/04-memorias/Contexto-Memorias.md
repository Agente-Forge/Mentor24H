# 📖 MEMÓRIAS — Contexto

**Responsabilidade:** Registrar jornada, aprendizados e histórico do projeto.

**O que mora aqui:**
- `AUDIT-TRAIL.md` — Histórico de decisões e mudanças
- `LESSONS-LEARNED.md` — O que aprendemos durante construção
- `PROJECT-JOURNAL.md` — Diário do projeto (notas diárias/semanais)

---

## 🎯 Propósito

Documentar **não só o código**, mas a **jornada** de construir Mentor24h.

Isso permite:
- ✅ Entender decisões tomadas
- ✅ Reutilizar learnings em futuros projetos
- ✅ Evitar repetir erros
- ✅ Celebrar wins e milestones

---

## 📋 Arquivos

### AUDIT-TRAIL.md

Histórico cronológico de decisões, mudanças, e marcos.

**Formato:**
```
[2026-05-11] Adotada metodologia FORGE
  → Criada estrutura Estructura-Proyecto (12 pastas)
  → Movido AGENTS.md para 02-protocolo/
  
[2026-05-10] Completado chat-wa.js
  → Interface WhatsApp simulada 100% funcional
  → 3 contatos de demo inclusos
  
[2026-05-07] Decisão: HTML + JS puro vs React
  → Mantém HTML + JS puro (sem frameworks)
  → Razão: MVP rápido, zero dependências, fácil deploy
```

---

### LESSONS-LEARNED.md

Lições tiradas durante construção.

**Formato:**
```
## O que deu certo:
✅ Design system Aurora — muito coeso visualmente
✅ localStorage com namespace — fácil debug
✅ Sidebar accordion CSS puro — sem JavaScript extra

## O que foi difícil:
⚠️ Multi-provider LLM — lógica complexa, mas isolada bem
⚠️ CORS issues com fetch em file:// — resolvido com <script> tags

## Próximas vezes:
💡 Usar localStorage com versionamento de schema desde o início
💡 Planejar persistência remota (Phase 2) desde o começo
```

---

### PROJECT-JOURNAL.md

Diário do projeto — notas semanais/diárias.

**Formato:**
```
## Semana 1 (2026-05-07 a 2026-05-11)

**Segunda:** Transformado FinFlow em Mentor24h (5 horas)
  - Sidebar expandida com 4 grupos
  - 18 páginas estruturadas
  - Chat AI multi-provider protótipo

**Terça:** Chat WhatsApp simulado (4 horas)
  - 3 colunas: contatos, conversa, CRM
  - Balões estilo WhatsApp
  - Demo data com 3 contatos

**Quarta-Sexta:** Design system + organização FORGE (6 horas)
  - Aurora design tokens finalizados
  - Estructura-Proyecto criada (12 pastas)
  - Documentação estruturada
```

---

## 🔄 Como Usar

### Para Auditoria:
```
"Por quê a decision ADR-003 foi tomada?"
→ Leia AUDIT-TRAIL.md
```

### Para Reutilizar Learnings:
```
"Como evitamos CORS issues em HTML + JS puro?"
→ Leia LESSONS-LEARNED.md
```

### Para Entender Timeline:
```
"Como foi a jornada de construir Mentor24h?"
→ Leia PROJECT-JOURNAL.md
```

---

## 📝 Como Atualizar

Toda semana (você ou Claude):

1. **Abra PROJECT-JOURNAL.md**
2. **Adicione seção:** Semana [X] (YYYY-MM-DD a YYYY-MM-DD)
3. **Registre:**
   - O que foi feito
   - Problemas encontrados
   - Soluções aplicadas
   - Próximos passos

---

**Próximo:** Atualizar PROJECT-JOURNAL.md semanalmente com progresso
