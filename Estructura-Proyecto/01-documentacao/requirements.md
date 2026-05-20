# requirements.md — Mentor24h v5.2
**Forge v5.2** | Appetite: L (3 sprints) | Gerado por: skill-planner v5.1
**Data:** 2026-05-20 | **Supersede:** versão 2026-05-12 (appetite M, uso pessoal)
**Input:** STRATEGIC-BRIEF.md (skill-consultor · 2026-05-20 · idea-20260520-mentor24h-evolucao-6901)

> ⚠️ Esta versão reflete o pivô estratégico d013: Mentor24h é SaaS comercial com ICP = revendedora autônoma.
> O PRD.md original (appetite M, uso pessoal) está desatualizado — atualização via skill-consultor recomendada.

---

## Formato EARS
Sintaxe: "QUANDO [evento], O [ator] DEVE [requisito] PARA [sistema/objetivo]"

---

## REQ-001 — Camada de Dados Abstraída

**User Story:** Como desenvolvedor do Mentor24h, quero que todos os módulos acessem dados por um repositório centralizado para que a migração para Supabase não exija reescrita dos 34+ módulos.

**Requisitos EARS:**
- QUANDO qualquer módulo precisa ler ou gravar dados, O sistema DEVE rotear essa operação por `repository.js` sem chamar `localStorage` diretamente.
- QUANDO o repository grava um registro, O sistema DEVE incluir automaticamente `createdAt`, `updatedAt` e `user_id: 'local'` para compatibilidade futura com Auth.
- QUANDO ocorre falha na operação de leitura, O repository DEVE retornar array vazio (nunca `null` ou `undefined`).

**Critérios de Aceite:**
- [ ] Nenhum módulo novo chama `localStorage.getItem/setItem` diretamente — tudo via `Repository.*` ou `DB.*`
- [ ] Todos os novos registros possuem `createdAt`, `updatedAt`, `user_id: 'local'`
- [ ] Migração para Supabase = substituir implementação interna do repository sem tocar nos módulos
- [ ] Módulos existentes não são quebrados (db.js continua funcional)

**Fora do escopo (appetite L):**
- Auth/login real → entra após estes 3 sprints
- Sincronização com Supabase → Fase Escala

---

## REQ-002 — Dashboard Pessoal

**User Story:** Como revendedora autônoma, quero ver meu dia de forma inteligente ao abrir o app para saber o que importa agora sem precisar navegar por páginas.

**Requisitos EARS:**
- QUANDO o usuário abre o modo Pessoal, O `dashboard-pessoal.js` DEVE exibir cards dinâmicos com dados reais (tarefas do dia, medicamentos, saldo do mês, próximo evento, hábitos em destaque).
- QUANDO não há dados em uma seção (ex: nenhuma tarefa hoje), O dashboard DEVE omitir o card correspondente — sem card vazio.
- QUANDO o usuário clica em um card do dashboard, O sistema DEVE navegar para o módulo correspondente.

**Critérios de Aceite:**
- [ ] Saudação dinâmica (Bom dia/tarde/noite) funciona nos 3 períodos
- [ ] Cards aparecem apenas quando há conteúdo relevante
- [ ] Clique nos cards navega para o módulo correto
- [ ] Layout bento responsivo funciona em mobile (320px+)
- [ ] CSS usa classes `.dp-*` definidas em `css/dashboard-pessoal.css`

**Fora do escopo:**
- Sincronização com Google Calendar → Fase Escala

---

## REQ-003 — Painel de Negócio

**User Story:** Como revendedora autônoma, quero ver os KPIs do meu negócio (receitas, clientes, temperatura, atividade recente) no painel para tomar decisões rápidas sem abrir relatórios.

**Requisitos EARS:**
- QUANDO o usuário entra em modo Negócio, O `painel.js` DEVE exibir 4 KPI cards com dados reais do mês atual.
- QUANDO não há transações no mês, O KPI de receita DEVE exibir "R$ 0,00" com estado vazio descritivo.
- QUANDO há clientes com temperatura "VIP" ou "Quente", O painel DEVE destacar esse dado visualmente em relação aos demais.

**Critérios de Aceite:**
- [ ] 4 KPIs reais: Receita do mês, Clientes ativos, Temperatura dominante, Atividade recente
- [ ] Atividade recente exibe últimas 5 transações com valor formatado em R$
- [ ] CSS usa classes `.pn-*` definidas em `css/painel-negocio.css`
- [ ] Estado vazio elegante quando não há dados de negócio

---

## REQ-004 — Timeline do Dia

**User Story:** Como usuária do app, quero ver uma linha do tempo do meu dia no dashboard para saber o que acontece nas próximas horas sem precisar abrir a agenda.

**Requisitos EARS:**
- QUANDO o dashboard pessoal é renderizado, O `timeline.js` DEVE exibir somente os horários que têm eventos (agenda pessoal + serviços de negócio) das próximas 24h.
- QUANDO não há eventos nas próximas 24h, O widget DEVE exibir mensagem "Dia livre" com estado vazio elegante.
- QUANDO um evento é do tipo serviço, O timeline DEVE diferenciá-lo com cor safira (`#6D8EA8`); eventos pessoais usam ouro (`#D4A574`).

**Critérios de Aceite:**
- [ ] Widget aparece abaixo dos KPI cards no dashboard pessoal
- [ ] Exibe apenas horários com eventos (sem linhas vazias)
- [ ] Cor semântica: ouro pessoal, safira serviço
- [ ] Clique no evento navega para a agenda

---

## REQ-005 — PWA Instalável

**User Story:** Como revendedora que usa principalmente o celular, quero instalar o Mentor24h na tela inicial para acessar sem abrir o browser.

**Requisitos EARS:**
- QUANDO o usuário acessa o app por um browser compatível, O sistema DEVE apresentar o prompt de instalação do PWA após interação com o app.
- QUANDO o app está instalado como PWA, O sistema DEVE funcionar offline com o conteúdo cacheado da última sessão.
- QUANDO o Service Worker detecta uma nova versão implantada, O sistema DEVE notificar com toast "Nova versão disponível — recarregue".

**Critérios de Aceite:**
- [ ] `manifest.json` válido (ícones 192px + 512px, `theme_color`, `display: standalone`)
- [ ] Service Worker registrado com cache-first para assets estáticos (`.html`, `.css`, `.js`)
- [ ] App funciona offline após primeira carga conectada
- [ ] Lighthouse PWA score ≥ 80
- [ ] `apple-touch-icon` configurado para iOS

---

## REQ-006 — Agenda Híbrida

**User Story:** Como revendedora, quero ver meus compromissos pessoais e de serviço (com cliente e valor) numa agenda unificada para não perder nenhum encontro.

**Requisitos EARS:**
- QUANDO o usuário acessa a Agenda Híbrida, O sistema DEVE exibir eventos pessoais e de serviço com diferenciação visual por cor (ouro pessoal / safira serviço).
- QUANDO o usuário cria um evento de serviço, O sistema DEVE solicitar campos adicionais: cliente (select de contatos) e valor (R$).
- QUANDO o usuário aplica filtro por tipo, O sistema DEVE exibir apenas os eventos do tipo selecionado (Todos / Pessoal / Serviço).
- QUANDO um card de serviço é listado, O sistema DEVE exibir nome do cliente e valor na linha do card.

**Critérios de Aceite:**
- [ ] Dois tipos de evento: `pessoal` e `servico`
- [ ] Cards de serviço mostram cliente + valor formatado
- [ ] Filtro por tipo (Todos / Pessoal / Serviço) funcional
- [ ] Cor semântica: ouro `#D4A574` pessoal, safira `#6D8EA8` serviço
- [ ] Vista dia/semana/mês funciona com ambos os tipos

---

## REQ-007 — Hábitos + Streak + Push Notifications

**User Story:** Como usuária que quer criar rotinas, quero registrar hábitos diários e receber lembretes no horário certo para manter minha consistência.

**Requisitos EARS:**
- QUANDO o usuário cadastra um hábito com horário, O sistema DEVE solicitar permissão de notificação e agendar um push local via `Notification API`.
- QUANDO o usuário marca um hábito como feito no dia, O sistema DEVE incrementar o streak e exibir feedback visual de celebração.
- QUANDO o usuário perde um dia de streak, O streak DEVE ser zerado com mensagem motivacional (nunca punitiva).
- QUANDO a Notification API não está disponível no browser, O sistema DEVE funcionar sem notificações (degradação graciosa).

**Critérios de Aceite:**
- [ ] CRUD de hábitos: nome, horário, frequência (diário / semanal)
- [ ] Streak contador visível por hábito
- [ ] Push local funciona no Chrome desktop
- [ ] Widget de hábitos no dashboard pessoal (máx 3 hábitos em destaque)
- [ ] Degradação graciosa em browsers sem Notification API (sem erro, sem crash)

---

## REQ-008 — Tarefas Recorrentes + Notas Rápidas

**User Story:** Como revendedora, quero criar tarefas que se repetem automaticamente e anotar ideias rápidas sem sair da tela atual.

**Requisitos EARS:**
- QUANDO o usuário conclui uma tarefa com campo `recorrencia` preenchido, O sistema DEVE gerar automaticamente a próxima instância com status `pendente`.
- QUANDO a próxima instância é gerada, O sistema DEVE herdar todos os campos da tarefa original exceto `status` e `id`.
- QUANDO o usuário aciona o atalho de nota rápida, O sistema DEVE abrir um input flutuante sem navegar para outra página.

**Critérios de Aceite:**
- [ ] Campo `recorrencia: null | 'daily' | 'weekly' | 'monthly'` em `tarefas.js`
- [ ] Auto-geração da próxima instância ao concluir tarefa recorrente
- [ ] Notas rápidas: CRUD com pin, busca e máx 280 caracteres por nota
- [ ] Widget de notas no dashboard pessoal

---

## REQ-009 — Catálogo Digital + Precificação

**User Story:** Como revendedora da Avon/Natura, quero ter meu catálogo de produtos com preço de custo e margem calculada para precificar corretamente e apresentar para clientes.

**Requisitos EARS:**
- QUANDO o usuário define custo e margem percentual de um produto, O sistema DEVE calcular e exibir automaticamente o preço de venda sugerido.
- QUANDO o usuário acessa a view de catálogo, O sistema DEVE exibir os produtos com foto (URL), nome e preço de venda — sem botões de edição (modo leitura).

**Critérios de Aceite:**
- [ ] Produtos ganham campos `custo` e `margemPct` (migração não-destrutiva — existentes não afetados)
- [ ] Fórmula: `precoVenda = custo × (1 + margemPct / 100)`
- [ ] View de catálogo público ativável por botão "Ver catálogo"
- [ ] Foto via URL (sem upload de arquivo no MVP)

---

## REQ-010 — Nota de Venda + Orçamento PDF

**User Story:** Como revendedora, quero gerar um documento de venda ou orçamento para compartilhar pelo WhatsApp sem precisar de sistema externo.

**Requisitos EARS:**
- QUANDO o usuário solicita gerar PDF de uma venda, O sistema DEVE renderizar um template HTML com CSS `@media print` e acionar `window.print()`.
- QUANDO o PDF é gerado, O documento DEVE incluir: nome do cliente, itens (quantidade + preço), total, data e dados de contato do negócio.
- QUANDO a impressão é acionada, O sistema DEVE ocultar todos os elementos do app (sidebar, navbar, botões) e exibir apenas o documento formatado.

**Critérios de Aceite:**
- [ ] Template de nota de venda com `@media print` funcional
- [ ] Template de orçamento (com "válido por X dias", sem "nota fiscal")
- [ ] CSS print oculta sidebar, navbar e botões do app
- [ ] Totais calculados corretamente (subtotal + total)
- [ ] Zero dependências externas (sem jsPDF ou html2canvas)

---

## REQ-011 — Analytics e Relatórios

**User Story:** Como revendedora, quero ver relatórios de vendas, top clientes e gráfico de desempenho para entender meu negócio e tomar decisões.

**Requisitos EARS:**
- QUANDO o usuário acessa Relatórios, O sistema DEVE exibir resumo financeiro do mês: receita, despesa, lucro e comparação com mês anterior.
- QUANDO o sistema lista top clientes, O sistema DEVE ordenar por valor total comprado e exibir os 5 primeiros.
- QUANDO o gráfico de vendas é exibido, O sistema DEVE usar SVG gerado em JavaScript puro (sem bibliotecas externas) com barras mensais dos últimos 6 meses.

**Critérios de Aceite:**
- [ ] Relatório financeiro: receita / despesa / lucro do mês + delta vs. mês anterior (▲▼%)
- [ ] Top 5 clientes por valor total de vendas
- [ ] Top 5 produtos por quantidade vendida
- [ ] Gráfico de barras SVG gerado em JS puro (sem Chart.js ou similar)
- [ ] Filtro de período: mês atual, trimestre, ano

---

## REQ-012 — Assistente Proativo

**User Story:** Como usuária, quero que o app me mostre insights relevantes automaticamente para perceber padrões que eu não veria sozinha.

**Requisitos EARS:**
- QUANDO o app é carregado e há dados de uso (≥7 dias), O assistente DEVE exibir até 3 insights no dashboard como cards não-intrusivos.
- QUANDO o assistente detecta um padrão relevante, O sistema DEVE gerar um insight com ação sugerida clicável (ex: "conta vence amanhã → Ver contas").
- QUANDO o usuário dispensa um insight, O sistema DEVE não exibi-lo novamente por 7 dias.

**Critérios de Aceite:**
- [ ] Máx 3 insights simultâneos no dashboard
- [ ] Pelo menos 5 tipos implementados: conta vencendo, cliente inativo, meta no limite, streak quebrado, próximo serviço
- [ ] Botão "Dispensar" por insight (sumir por 7 dias via localStorage)
- [ ] Rebatizado de "IA" → "Assistente" em toda a UI (conforme d013)
- [ ] Funciona 100% offline (lógica local em `assistente.js`, sem chamada LLM)

---

## Requisitos Não-Funcionais

| Requisito | Meta | Critério de Aceite |
|---|---|---|
| Performance | Carregamento inicial < 1.5s | Lighthouse Performance ≥ 85 |
| PWA | Instalável + offline | Lighthouse PWA ≥ 80 |
| Acessibilidade | WCAG AA mínimo | Sem erros críticos no axe-core |
| Segurança | SEC-1 a SEC-5 (Constitution) | Sentinela aprova antes de marcar done |
| Offline-first | App funciona sem internet | Cache-first SW ativo |
| Responsividade | 320px a 1440px+ | Sem layout quebrado em nenhum breakpoint |
| Escalabilidade de dados | Supabase-ready | Todos os registros têm `user_id` + timestamps |
