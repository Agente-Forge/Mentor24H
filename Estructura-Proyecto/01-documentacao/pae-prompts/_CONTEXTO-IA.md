# _CONTEXTO-IA — Mentor24h
**Versão:** 1.0 | **Gerado por:** skill-pae v1.0 | **Data:** 2026-05-15
**Propósito:** Contexto sintetizado para janela de execução (skill-construtor, skill-forge-visual, etc.)

> ⚠️ Este arquivo é lido automaticamente pela IA de execução antes de implementar qualquer feature.
> Fonte de verdade: PRD.md + SPEC.md + AGENTS.md + CONSTITUTION.md + DESIGN-BRIEF.md

---

## 1. IDENTIDADE DO PROJETO

**Nome:** Mentor24h  
**Conceito:** Hub pessoal único — vida pessoal + assistente AI  
**Filosofia:** "Quiet Intelligence" — interface editorial, sem ruído visual  
**Público:** 1 usuário (Léo) — empreendedor solo, dev em aprendizado, exigente com design  
**Status:** Em desenvolvimento ativo (FORGE v5.2)

---

## 2. STACK TÉCNICA (IMUTÁVEL)

```
Linguagens:  HTML + CSS + JS puro (vanilla)
Persistência: localStorage APENAS (sem backend, sem Supabase)
Deploy:      GitHub Pages
Fontes:      Fraunces + Switzer + JetBrains Mono (Google Fonts + Fontshare)
IA:          Claude API / OpenRouter (etapa futura — Function Calling)
```

**NUNCA adicionar:**
- Frameworks JS (React, Vue, Angular)
- Banco de dados externo
- Dependências NPM sem aprovação explícita de Léo
- CDNs de ícones ou libs que não estejam já no projeto

---

## 3. DESIGN SYSTEM — OBSIDIAN EDITORIAL

### Paleta Aprovada: OBSIDIAN (Paleta C)

```css
/* Dark Mode */
--bg-canvas:     #0B0D0F;   /* obsidiana */
--bg-surface:    #14171A;   /* grafite */
--bg-elevated:   #1D2125;   /* grafite polido */
--bg-sunken:     #07090B;   /* cavidade */

--text-prime:    #EAECF0;   /* gelo polido */
--text-secondary:#ABB0B8;
--text-quiet:    #7B8088;
--text-mute:     #4D5258;

--signature:     #D4A574;   /* ouro líquido — accent ÚNICO */
--signature-soft:#8B6F4A;
--signature-glow:#E8C898;

--critical:      #C0524D;   /* rubi */
--success:       #5C8E6E;   /* jade */
--warning:       #C49454;   /* âmbar fumê */
--info:          #6D8EA8;   /* safira opaca */

/* Light Mode */
--bg-canvas:     #F8F7F4;   /* pedra calcária */
--bg-surface:    #FFFFFF;
--signature:     #8B6F4A;   /* ouro fosco */
```

### Tipografia Aprovada: EDITORIAL PREMIUM (Combo 1)

```
Display/Hero:  Fraunces (variável, Google Fonts) — italic dramático
UI/Body:       Switzer (Fontshare) — weights 300/400/500/600/700
Numérico:      JetBrains Mono — valores financeiros, código
```

### Escala de Tipo
```
--type-xs: 11px | --type-sm: 13px | --type-base: 15px
--type-lg: 18px | --type-xl: 24px | --type-2xl: 32px
--type-3xl: 44px | --type-4xl: 60px
```

### Motion
```css
--ease-out:    cubic-bezier(0.32, 0.72, 0, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--duration-fast: 160ms;
--duration-base: 240ms;
```

### Nomenclatura de Componentes (OBRIGATÓRIA)
```
Botões:  .control-prime | .control-quiet | .control-ghost | .control-critical
Cards:   .surface-canvas | .surface-flat | .surface-lifted | .surface-floating
Texto:   .voice-statement | .voice-prime | .voice-body | .voice-quiet | .voice-whisper
Espaço:  .breath-tight | .breath-normal | .breath-generous | .breath-vast
```

---

## 4. ARQUITETURA JS

### Padrão IIFE (OBRIGATÓRIO em todos os módulos)
```javascript
const NomeModulo = (() => {
  // estado privado aqui
  
  function init() { /* inicialização */ }
  function render() { /* renderização */ }
  
  return { init, render }; // API pública mínima
})();
```

### Convenções
- `const` > `let` > `var` (evitar var absolutamente)
- Nomenclatura de arquivos: `kebab-case.js`
- Variáveis globais: `PascalCase`
- localStorage: sempre prefixar com `mentor24h_`
- Funções: camelCase

### Estrutura de Pastas
```
js/
  core/       ← lógica central, storage, events
  modules/    ← um arquivo por módulo/página
  utils/      ← helpers reutilizáveis
css/
  tokens.css  ← FONTE DE VERDADE (não hardcode nada aqui)
  [módulo].css
```

---

## 5. LEIS CONSTITUCIONAIS (INVIOLÁVEIS)

1. **LOCAL-FIRST:** Nenhum dado sai do navegador sem consentimento explícito
2. **QUIET INTELLIGENCE:** UI nunca grita, nunca bloqueia, nunca sobre-explica
3. **SINGLE SOURCE OF TRUTH:** `tokens.css` para CSS, `localStorage` para dados
4. **REUTILIZAR ANTES DE CRIAR:** Verificar módulos existentes antes de criar novo
5. **DOCUMENTAÇÃO ANTES DO CÓDIGO:** Toda feature começa no tasks.md
6. **SENTINELA VETO:** Se Sentinela emitir CRITICAL, parar tudo e corrigir
7. **ZERO API KEYS NO CÓDIGO:** Sempre em Settings (localStorage), nunca hardcoded

---

## 6. MÓDULOS EXISTENTES (não recriar)

| Módulo | Arquivo JS | Status |
|--------|-----------|--------|
| Finanças - Contas | js/modules/contas.js | ✅ Ativo |
| Finanças - Transações | js/modules/transacoes.js | ✅ Ativo |
| Finanças - Metas | js/modules/metas.js | ✅ Ativo |
| Kanban | js/modules/kanban.js | ✅ Ativo |
| Categorias | js/modules/categorias.js | ✅ Ativo |
| Dashboard | js/modules/dashboard.js | ✅ Ativo |
| Configurações | js/modules/settings.js | ✅ Ativo |
| Chat AI | js/modules/chat.js | 🔄 Em desenvolvimento |
| Contatos | js/modules/contatos.js | 🔄 Em desenvolvimento |
| Agenda | js/modules/agenda.js | ⏳ Planejado |
| Medicamentos | js/modules/medicamentos.js | ⏳ Planejado |
| Tarefas | js/modules/tarefas.js | ⏳ Planejado |
| Saúde & Hábitos | js/modules/saude.js | ⏳ Planejado |
| Produtos | js/modules/produtos.js | ⏳ Planejado |
| Vendas | js/modules/vendas.js | ⏳ Planejado |
| Estoque | js/modules/estoque.js | ⏳ Planejado |

---

## 7. ESTRUTURA DE NAVEGAÇÃO

### Sidebar Desktop
```
Dashboard → Vida Pessoal (Agenda, Medicamentos, Tarefas, Contatos, Saúde)
         → Meu Negócio (Produtos, Vendas, Estoque, Clientes, Fornecedores, Relatórios)
         → Finanças (Contas, Transações, Metas, Relatórios)
         → Chat AI → Configurações
```

### Bottom Nav Mobile (5 ícones)
```
Dashboard | Pessoal | Negócio | Finanças | Config
```

---

## 8. SEGURANÇA (CHECKLIST MÍNIMO)

- SEC-02: Sanitizar todo input do usuário (XSS prevention)
- SEC-05: Zero secrets hardcoded (API keys em localStorage via Settings)
- SEC-07: Mensagens de erro genéricas ao usuário (não expor stack traces)
- CSP: Content-Security-Policy configurado no index.html

---

## 9. COMO LER OS PROMPTS MENSAIS

Os prompts estão em `pae-prompts/prompts-YYYY-MM.md`.
Cada entrada tem:
- Número sequencial e data
- Skill recomendada + LLM + Intensidade + Tier
- Objetivo completo
- Requisitos funcionais e não-funcionais
- Arquivos a alterar e não alterar
- Critérios de aceitação (Given/When/Then)

Ao iniciar implementação: **ler a entrada do prompt mais recente** para contexto completo.

---

*Gerado automaticamente por skill-pae v1.0 | Atualizar sempre que PRD/SPEC/CONSTITUTION mudar*
