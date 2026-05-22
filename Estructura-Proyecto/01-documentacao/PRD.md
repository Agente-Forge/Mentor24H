# 📄 PRD — Mentor24h

**Versão:** 1.1  
**Data:** 2026-05-12 | **Atualizado:** 2026-05-21  
**Autor:** Board Executivo (skill-consultor v5.2)  
**Aprovado por:** Léo  
**Status:** ✅ ATIVO

> **v1.1 — Mudanças:** Adicionados itens 11, 12 e 13 (Rotinas, Estudos, Datas Importantes) aprovados por Léo em 2026-05-21. Planejados para Sprint 4+.

---

## 1. BUSINESS SUMMARY

### Problema
Léo gerencia múltiplas dimensões da vida (finanças pessoais, agenda, medicamentos, tarefas, contatos, chat AI) em ferramentas separadas, perdendo tempo alternando entre apps e sem visão unificada do dia.

### Solução
**Mentor24h** — Hub pessoal único que centraliza produtividade pessoal + assistente AI conversacional em uma interface premium estilo *Quiet Intelligence*, com dashboard inteligente que mostra o que importa no momento.

### Diferencial
- **Pessoal, não corporativo:** feito para 1 usuário consciente, não para "empresas"
- **Quiet Intelligence:** interface editorial sem ruído visual (paleta OBSIDIAN + Fraunces/Switzer)
- **AI nativa:** Chat AI multi-provider (OpenRouter, OpenAI, Gemini, Claude) integrado
- **Local-first:** funciona offline, dados no localStorage do navegador
- **Zero custo:** GitHub Pages + localStorage + APIs LLM pay-as-you-go

### Mercado alvo
1 usuário inicial (Léo). Potencial futuro: outros profissionais autônomos buscando hub pessoal premium.

---

## 2. PÚBLICO-ALVO E DORES

### Persona Primária — Léo
- **Idade:** 30s
- **Perfil:** Empreendedor solo, dev em aprendizado, organizado, exigente com design
- **Contexto:** Trabalha de casa, múltiplos projetos paralelos
- **Stack mental:** Usa Obsidian, gosta de ferramentas locais-first
- **Dores atuais:**
  - Esquece medicamentos
  - Perde compromissos da agenda
  - Não tem visão clara de saldo/gastos do mês
  - Conversa com AI em apps separados (ChatGPT, Claude)
  - Quer um lugar único para o dia

### Jornada do usuário atual (sem Mentor24h)
```
8h    Acorda → checa WhatsApp (perde 15min em conversas)
9h    Tenta lembrar dos medicamentos (às vezes esquece)
10h   Abre planilha de gastos (atualiza atrasado)
11h   Vai pro ChatGPT pra tirar dúvida (perde contexto)
14h   Confere agenda no Google Calendar
17h   Esquece da tarefa que tinha que fazer
```

### Jornada desejada (com Mentor24h)
```
8h    Abre Mentor24h → Dashboard mostra: 2 medicamentos hoje, 
      1 evento às 14h, 3 tarefas pendentes, saldo do mês
9h    Toma medicamento → marca no app
11h   Ctrl+K → "pergunta para AI" → resposta sem trocar de app
17h   Recebe lembrete da tarefa
```

---

## 3. CORE FEATURES MVP (Appetite M — 4-6 semanas)

### ✅ INCLUÍDAS

1. **Dashboard Inteligente**
   - Saudação contextual ("Bom dia, Léo. Você tem 2 medicamentos e 3 tarefas hoje.")
   - Cards dinâmicos: só aparece o que tem dado relevante
   - Layout bento adaptativo

2. **Chat AI Multi-Provider**
   - Suporte: OpenRouter, OpenAI, Google Gemini, Anthropic Claude
   - Configuração da API key na tela de Settings
   - Histórico de conversas
   - Fallback automático em caso de erro

3. **WhatsApp CRM (simulado)**
   - Lista de contatos + última mensagem
   - Conversa estilo WhatsApp (balões)
   - CRM lateral (notas, tags)
   - Badge de não lidas

4. **Agenda Pessoal**
   - Eventos com data, hora, descrição
   - Visualização mensal/semanal/dia
   - Lembretes no Dashboard

5. **Medicamentos**
   - Cadastro de medicamentos com horários
   - Marcar como tomado
   - Histórico de doses

6. **Tarefas**
   - CRUD básico com prioridade e status
   - Filtro por status (pendente/em andamento/concluído)

7. **Contatos**
   - Agenda de contatos com nome, telefone, email, tags

8. **Finanças**
   - Contas bancárias (saldo, banco)
   - Transações (receita/despesa, categoria)
   - Metas financeiras
   - Kanban de planejamento

9. **Command Palette (Ctrl+K)**
   - Busca global de ações e navegação
   - Atalhos para criação rápida

10. **Theme Toggle (dark/light)**
    - Tema escuro OBSIDIAN (default)
    - Tema claro alternativo

11. **Rotinas** *(Sprint 4+ — aprovado v1.1)*
    - Sequência de atividades com horário fixo (ex: rotina manhã, rotina noite)
    - Diferente de Hábitos: é uma sequência ordenada, não rastreamento individual
    - Marcação rápida de etapas concluídas

12. **Estudos** *(Sprint 4+ — aprovado v1.1)*
    - Plano de estudos com metas de aprendizagem
    - Agendamento de revisões e provas
    - Acompanhamento de progresso por matéria/tema

13. **Datas Importantes** *(Sprint 4+ — aprovado v1.1)*
    - Aniversários, casamentos, festas e datas comemorativas pessoais
    - Lembrete automático X dias antes
    - Integração futura com módulo de Contatos

---

## 4. O QUE NÃO É (Filtro Negativo)

### ❌ Fora do MVP — adiado para Fase 2+

- **Módulos de Negócio:** Produtos, Vendas, Estoque, Clientes (Léo não vende ativamente)
- **Autenticação/Login:** uso pessoal, 1 usuário, dispensável
- **Multi-tenant / SaaS:** sem usuários externos no MVP
- **WhatsApp Business API real:** simulado entrega valor; real adiciona complexidade + custo
- **Banco de dados remoto (Supabase/Firebase):** localStorage atende perfeitamente 1 usuário
- **Testes automatizados:** aprovado teste manual na Fase 1 (AGENTS.md §4)
- **Mobile app nativo:** PWA responsivo já cobre uso mobile
- **Notificações push:** não cabe no appetite M
- **Sincronização entre dispositivos:** desktop-first; mobile via responsive

---

## 5. CRITÉRIOS DE SUCESSO

### Métrica Principal (North Star)
**Léo abre o Mentor24h ≥ 5x por semana** durante 4 semanas consecutivas após o lançamento da Fase 1.

### Métricas Secundárias
- Dashboard exibe pelo menos 1 card útil em 80% das visitas
- Chat AI usado ≥ 3x por semana
- Zero perda de dados em 90 dias de uso
- Tempo de carregamento inicial < 1.5s
- Lighthouse score ≥ 90 (Performance, Accessibility, Best Practices)

### Definição de "pronto" para o MVP
> *"Léo usa o Mentor24h como hub principal do dia, sem voltar para Google Calendar, Notion ou ChatGPT separadamente, por 2 semanas seguidas."*

---

## 6. APPETITE E ESCOPO

**Appetite declarado:** M — 4 a 6 semanas de trabalho  
**Sprints planejadas:** 5 (1 semana cada)  
**Tasks planejadas:** ~40 (8 por sprint)

**Regra de ouro:**
> Nenhuma feature entra no MVP se não couber no appetite M.

**Se o escopo crescer:**
- Cortar outra feature equivalente, OU
- Empurrar para Fase 2, OU
- Requer nova sessão de calibração com skill-consultor

---

## 7. ROADMAP FUTURO

### FASE 1 — MVP PESSOAL (atual | 4-6 semanas)
Definido nas Seções 3-5 acima.

### FASE 2 — PRODUTO COM USUÁRIOS
**Ativar quando:** Léo decidir compartilhar com outros + MVP validado por 4+ semanas

- Migração `localStorage` → **Supabase** (PostgreSQL + Auth)
- Login + autenticação multi-tenant
- WhatsApp Business API (via Meta ou Twilio)
- Módulos de Negócio (Produtos, Vendas, Estoque, Clientes) — se Léo começar a vender
- Notificações (browser/email)
- Sincronização entre dispositivos
- Mobile PWA otimizado

### FASE 3 — SaaS COMERCIAL (opcional)
**Ativar quando:** Tração orgânica + decisão estratégica de monetizar

- Billing (Stripe)
- Landing page + marketing site
- Admin dashboard
- Multi-language (PT/EN/ES)
- Possível migração para **React + Next.js** (se >1000 linhas de lógica)
- Marketplace de templates / integrações

---

## 8. UX PRINCIPLES — Quiet Intelligence

1. **Calma sobre estímulo:** nenhuma cor saturada ou animação ansiosa. Movimentos suaves (300-400ms ease-out).
2. **Editorial sobre genérico:** Fraunces + Switzer + JetBrains Mono. Nada de "Inter padrão da Vercel".
3. **Dourado é parcimônia:** `#D4A574` só em elementos verdadeiramente importantes (CTA principal, número-chave). Excesso de dourado mata o impacto.
4. **Mostrar só o que importa:** Dashboard com cards dinâmicos. Sem card vazio "você não tem nada hoje".
5. **Atalho > clique:** Command Palette (Ctrl+K) prioritário. Quem usa Mentor24h prefere teclado.

---

## 9. STACK E INFRAESTRUTURA

### Stack aprovada (já implementada — D002, D004, D007)

| Camada | Tecnologia | Motivo |
|--------|-----------|--------|
| Frontend | HTML5 + CSS3 + JS puro (ES6+) | Zero deps, simples, perfeito para 1 usuário |
| Persistência | localStorage (namespace `mentor24h.`) | Atende uso pessoal, zero custo |
| LLM | OpenRouter (default) + OpenAI + Gemini + Claude | Flexibilidade, sem lock-in |
| Ícones | Lucide via CDN | 1000+ ícones, leve |
| Fontes | Google Fonts (Fraunces, Switzer, JetBrains Mono) | Editorial Premium |
| Deploy | GitHub Pages | Gratuito, deploy automático em push |

### Custo Mensal Estimado

| Cenário | Custo |
|---------|-------|
| MVP Fase 1 (uso pessoal Léo) | **R$ 0** + ~$1-3 em APIs LLM (opcional) |
| Fase 2 (Supabase) | ~R$ 0 (free tier até 500MB / 50k requests) |
| Fase 3 (SaaS comercial) | R$ 100-500/mês (Supabase Pro + domínio + Stripe) |

---

## 10. RISCOS BUG-DNA E PREVENÇÕES

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| **localStorage cheio (>5MB)** | Média (2+ anos) | Alto (perda de dados) | Monitor de uso na tela de Config + warning quando atingir 80% |
| **API LLM falha/instável** | Alta | Médio (Chat AI inutilizável) | Fallback entre providers + mensagem de erro clara |
| **XSS via input do usuário** | Baixa | Alto | `escapeHtml()` em todo conteúdo dinâmico (AGENTS.md §5.2) |
| **CORS bloqueando API Claude** | Alta | Médio | Documentar uso preferencial via OpenRouter |
| **Perda de dados ao limpar browser** | Média | Alto | Export/Import JSON manual + alerta ao usuário |
| **Scope creep voltando módulos de Negócio** | Alta | Alto | Auditor anti-scope vigilante + esse PRD como contrato |

---

## ✅ APROVAÇÃO

- [x] Board Executivo aprovou (CEO + CTO + CPO + CFO + Auditor)
- [x] Léo aprovou perguntas-chave (público-alvo, WhatsApp, appetite)
- [x] AGENTS.md preenchido como contrato técnico
- [x] DESIGN-BRIEF.md aprovado como contrato visual

**Próximo documento:** `CONSTITUTION.md` — leis invioláveis do projeto.
