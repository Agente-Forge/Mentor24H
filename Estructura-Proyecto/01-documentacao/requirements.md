# requirements.md — Mentor24h
**Forge v5.2** | Appetite: M (4-6 semanas) | Gerado por: skill-planner v5.1  
**Data:** 2026-05-12 | **Status:** ✅ APROVADO

---

## Formato EARS
Sintaxe: "QUANDO [evento], O [ator] DEVE [requisito] PARA [sistema/objetivo]"

---

## REQ-001 — Dashboard Inteligente

**User Story:** Como Léo, quero ver um resumo inteligente do meu dia ao abrir o app para tomar decisões rápidas sem navegar por várias telas.

**Requisitos EARS:**
- QUANDO o usuário abre o app, O dashboard DEVE exibir uma saudação contextual com nome e horário ("Bom dia, Léo").
- QUANDO há medicamentos programados para hoje, O dashboard DEVE exibir card de medicamentos com horários pendentes.
- QUANDO há eventos na agenda hoje, O dashboard DEVE exibir card de agenda com o próximo evento.
- QUANDO há tarefas pendentes, O dashboard DEVE exibir card de tarefas com as de alta prioridade primeiro.
- QUANDO não há dados em uma categoria, O dashboard NÃO DEVE exibir o card daquela categoria (sem cards vazios).

**Critérios de Aceite:**
- [ ] Saudação muda conforme horário (manhã/tarde/noite)
- [ ] Cards aparecem somente quando têm conteúdo
- [ ] Layout bento se adapta ao número de cards ativos
- [ ] Carrega em menos de 500ms

**Fora do escopo (appetite M):**
- Widgets customizáveis pelo usuário → Fase 2
- Notificações push → Fase 2

---

## REQ-002 — Chat AI Multi-Provider

**User Story:** Como Léo, quero conversar com uma IA usando minha própria API key para ter acesso a modelos poderosos sem assinar mais um serviço.

**Requisitos EARS:**
- QUANDO o usuário abre Chat AI sem API key configurada, O sistema DEVE exibir tela de setup com instruções claras.
- QUANDO o usuário configura uma API key válida, O sistema DEVE salvar em localStorage (mentor24h.llm-config) e iniciar conversa.
- QUANDO o usuário envia uma mensagem, O sistema DEVE exibir indicador de loading e a resposta em bubbles estilo chat.
- QUANDO a API retorna erro, O sistema DEVE exibir mensagem de erro clara com opção de tentar novamente.
- QUANDO o usuário cria uma nova conversa, O sistema DEVE salvar o histórico da conversa anterior em mentor24h.llm-conversas.

**Critérios de Aceite:**
- [ ] Suporte a 4 providers: OpenRouter, OpenAI, Gemini, Claude
- [ ] Histórico de conversas persiste após recarregar página
- [ ] Loading state visível durante chamada à API
- [ ] Erro de CORS documentado e usuário orientado a usar OpenRouter
- [ ] API key nunca aparece em texto visível na UI

**Fora do escopo (appetite M):**
- Streaming de resposta (token a token) → Fase 2
- Upload de arquivos/imagens para AI → Fase 2

---

## REQ-003 — WhatsApp CRM Simulado

**User Story:** Como Léo, quero gerenciar contatos e conversas num CRM estilo WhatsApp para ter histórico e notas sobre cada pessoa.

**Requisitos EARS:**
- QUANDO o usuário abre WhatsApp CRM, O sistema DEVE exibir lista de contatos com última mensagem e badges de não lidas.
- QUANDO o usuário clica em um contato, O sistema DEVE exibir conversa com balões estilo WhatsApp (eu = direita, contato = esquerda).
- QUANDO o usuário clica em um contato (desktop), O sistema DEVE exibir painel CRM lateral com nome, telefone, tags e notas.
- QUANDO o usuário adiciona uma nota, O sistema DEVE salvar em mentor24h.chat-contatos.
- QUANDO há mensagens não lidas, O sistema DEVE exibir badge com contador na lista de contatos.

**Critérios de Aceite:**
- [ ] Layout 3 colunas (desktop) / lista→conversa (mobile)
- [ ] Busca de contatos por nome
- [ ] Tags editáveis por contato
- [ ] Aviso visível: "Interface simulada — conecte WhatsApp Business API nas Configurações"
- [ ] Dados persistem em localStorage

**Fora do escopo (appetite M):**
- WhatsApp Business API real → Fase 2
- Envio real de mensagens → Fase 2

---

## REQ-004 — Agenda Pessoal

**User Story:** Como Léo, quero registrar eventos com data, hora e descrição para não perder compromissos importantes.

**Requisitos EARS:**
- QUANDO o usuário cria um evento, O sistema DEVE salvar com id único, data, hora, título e descrição em mentor24h.agenda.
- QUANDO há eventos hoje, O dashboard DEVE exibir o próximo evento com horário.
- QUANDO o usuário edita um evento, O sistema DEVE atualizar updatedAt e refletir na lista imediatamente.
- QUANDO o usuário deleta um evento, O sistema DEVE pedir confirmação antes de remover.

**Critérios de Aceite:**
- [ ] CRUD completo (criar, ler, editar, deletar)
- [ ] Visualização de eventos por data
- [ ] Eventos do dia aparecem no Dashboard
- [ ] Confirmação antes de deletar

**Fora do escopo (appetite M):**
- Integração com Google Calendar → Fase 2
- Notificações de evento → Fase 2

---

## REQ-005 — Medicamentos

**User Story:** Como Léo, quero registrar medicamentos com horários para nunca esquecer de tomá-los.

**Requisitos EARS:**
- QUANDO o usuário cadastra um medicamento, O sistema DEVE salvar nome, horário e frequência em mentor24h.medicamentos.
- QUANDO há medicamentos programados para hoje, O dashboard DEVE exibir card com os pendentes.
- QUANDO o usuário marca um medicamento como tomado, O sistema DEVE registrar em mentor24h.med-doses com timestamp.
- QUANDO todos os medicamentos do dia estão marcados, O card do dashboard DEVE indicar "Tudo em dia".

**Critérios de Aceite:**
- [ ] CRUD de medicamentos
- [ ] Marcar como tomado com timestamp
- [ ] Histórico de doses por dia
- [ ] Card no Dashboard com status do dia

**Fora do escopo (appetite M):**
- Alarmes/notificações push → Fase 2
- Integração com farmácia → Fase 3

---

## REQ-006 — Tarefas

**User Story:** Como Léo, quero gerenciar tarefas com prioridade e status para saber o que fazer primeiro.

**Requisitos EARS:**
- QUANDO o usuário cria uma tarefa, O sistema DEVE salvar com título, descrição, prioridade (alta/média/baixa) e status (pendente) em mentor24h.tarefas.
- QUANDO o usuário muda o status de uma tarefa, O sistema DEVE refletir a mudança imediatamente na lista.
- QUANDO há tarefas de alta prioridade pendentes, O dashboard DEVE exibi-las no card de tarefas.
- QUANDO o usuário filtra por status, O sistema DEVE mostrar apenas as tarefas do status selecionado.

**Critérios de Aceite:**
- [ ] CRUD completo com prioridade e status
- [ ] Filtro por status (pendente / em andamento / concluído)
- [ ] Tarefas urgentes aparecem no Dashboard
- [ ] Ordenação por prioridade

**Fora do escopo (appetite M):**
- Subtarefas → Fase 2
- Compartilhamento de tarefas → Fase 2

---

## REQ-007 — Contatos

**User Story:** Como Léo, quero manter uma agenda de contatos com informações de contexto para não depender do celular para lembrar quem é quem.

**Requisitos EARS:**
- QUANDO o usuário adiciona um contato, O sistema DEVE salvar nome, telefone, email e tags em mentor24h.contatos.
- QUANDO o usuário busca um contato, O sistema DEVE filtrar por nome em tempo real.
- QUANDO o usuário edita um contato, O sistema DEVE atualizar updatedAt.

**Critérios de Aceite:**
- [ ] CRUD completo
- [ ] Busca por nome em tempo real
- [ ] Tags customizáveis por contato
- [ ] Exibição em lista com iniciais como avatar

**Fora do escopo (appetite M):**
- Sync com contatos do celular → Fase 2
- Foto de perfil → Fase 2

---

## REQ-008 — Finanças (Contas, Transações, Metas, Kanban)

**User Story:** Como Léo, quero registrar minhas finanças pessoais para ter visão clara do saldo e gastos.

**Requisitos EARS:**
- QUANDO o usuário cria uma conta, O sistema DEVE salvar nome, banco, saldo inicial e tipo em mentor24h.contas.
- QUANDO o usuário registra uma transação, O sistema DEVE atualizar o saldo da conta e salvar em mentor24h.transacoes.
- QUANDO o saldo de uma conta fica negativo, O sistema DEVE destacar visualmente o valor em vermelho (--color-error).
- QUANDO o usuário cria uma meta, O sistema DEVE salvar valor-alvo, valor atual e data-limite em mentor24h.metas.
- QUANDO uma meta atinge 80% ou mais, O sistema DEVE destacar com cor de alerta (--color-warning).

**Critérios de Aceite:**
- [ ] CRUD de contas com saldo atualizado a cada transação
- [ ] Transações categorizada (alimentação, transporte, saúde, etc.)
- [ ] Metas com barra de progresso
- [ ] Kanban de planejamento financeiro
- [ ] Saldo negativo destacado em vermelho

**Fora do escopo (appetite M):**
- Importação de extrato bancário (OFX/CSV) → Fase 2
- Relatórios gráficos → Fase 2

---

## REQ-009 — Command Palette (Ctrl+K)

**User Story:** Como Léo, quero acessar qualquer ação do app via teclado para ser mais produtivo sem usar o mouse.

**Requisitos EARS:**
- QUANDO o usuário pressiona Ctrl+K (ou ⌘K no Mac), O sistema DEVE abrir o Command Palette imediatamente.
- QUANDO o usuário digita no campo de busca, O sistema DEVE filtrar ações em tempo real (debounce 150ms).
- QUANDO o usuário pressiona Enter em uma ação, O sistema DEVE executar a ação e fechar o palette.
- QUANDO o usuário pressiona ESC, O sistema DEVE fechar o Command Palette.
- QUANDO o Command Palette está aberto, O sistema DEVE interceptar navegação por teclado (↑↓ para navegar entre opções).

**Critérios de Aceite:**
- [ ] Abre com Ctrl+K / ⌘K
- [ ] Fecha com ESC e clique fora
- [ ] Navegação por teclado (↑↓ + Enter)
- [ ] Filtro em tempo real nas ações
- [ ] Ações: navegar para qualquer página + criar novo (evento, medicamento, tarefa, contato, transação)

**Fora do escopo (appetite M):**
- Comandos customizáveis pelo usuário → Fase 2
- Busca em conteúdo (pesquisa em todas as tarefas) → Fase 2

---

## REQ-010 — Theme Toggle (dark/light)

**User Story:** Como Léo, quero alternar entre tema escuro e claro para usar o app em qualquer ambiente de iluminação.

**Requisitos EARS:**
- QUANDO o usuário clica no botão de tema, O sistema DEVE alternar entre dark (OBSIDIAN) e light imediatamente.
- QUANDO o tema é alterado, O sistema DEVE salvar a preferência em localStorage (mentor24h.config).
- QUANDO o usuário abre o app novamente, O sistema DEVE restaurar o tema salvo anteriormente.

**Critérios de Aceite:**
- [ ] Alternância instantânea sem reload
- [ ] Preferência persiste entre sessões
- [ ] Tema claro legível com contraste mínimo WCAG AA

**Fora do escopo (appetite M):**
- Temas customizados → Fase 3
- Sync com preferência do sistema operacional → Fase 2

---

## Requisitos Não-Funcionais

| Requisito | Meta | Critério de Aceite |
|-----------|------|--------------------|
| Performance | Carregamento inicial < 1.5s | Lighthouse Performance > 90 |
| Acessibilidade | WCAG AA mínimo | Contraste mínimo 4.5:1 em todos os textos |
| Segurança | XSS prevenido | escapeHtml() em todo conteúdo dinâmico |
| Disponibilidade | Funciona offline | App carrega sem internet (assets locais) |
| Compatibilidade | Browsers modernos | Chrome 90+, Firefox 90+, Safari 14+ |
| Responsividade | Mobile-first | Layout funcional em 375px+ |
| Dados | Export manual | Botão "Exportar JSON" em Configurações |
