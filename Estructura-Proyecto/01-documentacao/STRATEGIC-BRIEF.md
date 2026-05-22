# 🎯 STRATEGIC BRIEF — Mentor24h v5.2

> **Autor:** skill-consultor (Chief Strategy Officer) · **Data:** 2026-05-20
> **idea-ID:** idea-20260520-mentor24h-evolucao-6901 · **Appetite:** L (3 sprints)
> **Próxima skill:** skill-planner — este brief é o input direto do `SPRINT-PLAN.md`

---

## 0. Contexto real (validado nesta sessão)

- **Estágio:** desenvolvimento em localhost (2 usuários: Léo + esposa). Sem usuários externos ainda.
- **Persistência:** localStorage AGORA; **Supabase + Auth entram DEPOIS destes 3 sprints**.
- **Modelo de negócio:** SaaS com mensalidade acessível (freemium) — **não é 100% grátis**.
- **"IA":** experimental em dev; rebatizar para "assistente" antes do lançamento pago.
- **Pivô registrado:** este ciclo marca a virada de *uso pessoal* → *SaaS comercial* (ver `.memoria/decision-log.json` d013–d015; supersede d010, revisa d012).

---

## 1. Posicionamento (1 frase)

> *"Para o autônomo brasileiro: vida pessoal + pequeno negócio num app só, bonito e acessível — o meio-termo entre a planilha bagunçada e o sistema caro e complicado (Conta Azul/Bling). Funciona offline."*

Offline-first é **feature de robustez** (sincroniza quando conecta), não mais o pilar central. O wedge é o **contraste de categoria**: simples demais para quem usa planilha, completo demais para quem acha o Conta Azul exagero.

**Concorrentes e gap:** Conta Azul/Bling (complexo, caro, sem lado pessoal) · Organizze/Mobills (sem negócio) · planilha + WhatsApp + caderno (o concorrente *real* — fragmentado, sem integração).

---

## 2. ICP (Ideal Customer Profile)

- **Sprint 1 (primário):** Revendedora autônoma (Avon/Natura). Onboarding, defaults e copy desenhados para ela.
- **Secundário (Sprint 2):** autônomo de serviço (a Agenda de Serviços o atende direto).
- **"Também serve":** pequeno lojista, organizador pessoal. **Adiado:** cuidador/paciente crônico (quase outro produto).

---

## 3. Decisão estruturante (inegociável)

**Supabase entra depois deste ciclo → CAMADA DE DADOS ABSTRAÍDA no Sprint 1.**
Nenhum módulo de UI fala com localStorage direto; tudo passa por um repository/adapter. A modelagem já prevê `user_id` (dono) para o Auth futuro. Sem isso, os 3 sprints viram reescrita quando o Supabase chegar. *(ver d014)*

---

## 4. Ordem dos sprints + Top 3 obrigatórias

### Sprint 1 — Fundação + núcleo dual
1. **Camada de dados abstraída** (adapter localStorage→Supabase-ready) — *task #1, bloqueia as demais*
2. `dashboard-pessoal.js` + `painel-negocio.js` completos
3. Timeline do Dia (acoplada ao dashboard) + PWA básico (manifest + SW)

### Sprint 2 — Engajamento + agenda híbrida *(enxugado de 8 → 6)*
1. Agenda Híbrida (flagship — ouro pessoal / safira serviço) + Agenda de Serviços (cliente + valor)
2. Loop Hábitos + streak + Push notifications
3. Tarefas recorrentes + Notas rápidas

### Sprint 3 — Profundidade de negócio + inteligência
1. Catálogo digital + Nota de venda
2. Analytics: Relatórios financeiros + Top clientes/produtos + Gráfico de vendas
3. Assistente proativo (ex-"IA") + Orçamento PDF + Precificação

> ⚠️ **Para o planner auditar antes de estimar:** o FORGE-CHECKLIST registra módulos de negócio já implementados (produtos/vendas/estoque/clientes — sprint 5.5). Confirmar o que já existe vs. placeholder antes de estimar o Sprint 3, para não re-implementar o que está pronto.

---

## 5. Top 3 riscos de produto + mitigação

| # | Risco (estratégico/adoção) | Mitigação |
|---|---|---|
| **R1** | Foco difuso (5 públicos → ninguém se apaixona) | 1 ICP: revendedora. Onboarding desenhado para ela. |
| **R2** | Retrabalho na migração para Supabase | Camada abstraída no S1 + modelagem com `user_id` desde já. |
| **R3** | Retenção baixa (justifica a futura mensalidade) | Loop timeline + hábitos + push (S2) como motor de hábito diário. |

*Secundário a vigiar:* **viés de dogfooding** — validar com 3-5 revendedoras reais antes de cobrar (hoje só Léo + esposa testam).

---

## 6. Critérios de sucesso (Given / When / Then)

**Sprint 1** — DADO dashboard, painel e timeline completos, QUANDO inspeciono o acesso a dados, ENTÃO todos os módulos leem/gravam por uma única camada de repositório (zero chamadas diretas a `localStorage`) e a Timeline mostra eventos pessoais + negócio do dia.

**Sprint 2** — DADO compromissos pessoais e de serviço, QUANDO abro a Agenda Híbrida, ENTÃO vejo tudo com cor semântica, filtro por tipo, os cards de serviço mostram cliente + valor, e recebo um push local de hábito.

**Sprint 3** — DADO um mês de vendas fechado, QUANDO abro relatórios, ENTÃO vejo top clientes/produtos + gráfico, gero PDF de orçamento/nota, e o assistente mostra 1 insight relevante.

---

## 7. Visão de monetização e escala (pós-ciclo — NÃO entra nos 3 sprints)

- **Freemium:** propaganda só no tier grátis; tier pago (mensalidade acessível) sem propaganda + recursos premium. O anúncio vira *incentivo* para assinar.
- **Vitrine da Comunidade (Fase Escala):** os próprios usuários divulgam produtos/serviços para a rede; receita por destaque/boost. Conecta com o Catálogo (S3) + geolocalização ("vitrine perto de você").
- **Geolocalização (Fase Escala):** opt-in com troca de valor clara; consentimento granular; LGPD desde o design (localização = dado pessoal).
- **Pré-requisitos da Fase Escala:** Supabase + Auth + base real de usuários. *(ver d015)*

---

## 8. Handoff para skill-planner

Use este brief para gerar o `SPRINT-PLAN.md`:
- Quebrar cada sprint em tasks com dependências — a **camada de dados abstraída é a dependência-raiz** do Sprint 1.
- Estimar respeitando o **appetite L** (3 sprints).
- **Auditar módulos de negócio já existentes** antes de estimar o Sprint 3.
- Manter **Auth/Supabase fora do escopo** destes 3 sprints, mas garantir que a modelagem não os impeça.

*Decisões relacionadas em `.memoria/decision-log.json`: d013 (pivô SaaS), d014 (camada de dados), d015 (monetização).*
