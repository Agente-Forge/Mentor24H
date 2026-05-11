# PLANO DE TRANSFORMAÇÃO — Mentor24h Pessoal & Empreendedor
**Projeto base:** controle-financeiro v2 (Aurora Design System)
**Data:** 2026-05-11
**Status:** Planejamento

---

## VISÃO DO PRODUTO

Um aplicativo **tudo-em-um** para organizar a **vida pessoal** e o **negócio** de microempreendedores.
Funciona como um mentor digital que centraliza: saúde, finanças, agenda, tarefas, vendas e estoque — tudo num só lugar, com design premium Aurora.

**Público-alvo:**
- Pessoa comum que precisa organizar rotina, saúde e finanças
- Microempreendedor autônomo (vendedor, prestador de serviço, dono de cardápio)

---

## O QUE JÁ TEMOS (Manter e Expandir)

| Módulo | Status | O que fazer |
|--------|--------|-------------|
| Contas a pagar | ✅ Pronto | Manter, adicionar submenus |
| Transações | ✅ Pronto | Manter |
| Metas financeiras | ✅ Pronto | Manter |
| Kanban | ✅ Pronto | Integrar ao módulo Tarefas |
| Categorias | ✅ Pronto | Expandir para todos os módulos |
| Dashboard Aurora | ✅ Pronto | Redesenhar para nova visão |
| Sidebar + Bottom Nav | ✅ Pronto | Reorganizar com submenus |
| Design System | ✅ Pronto | Manter 100% (não mexer) |
| Dark/Light theme | ✅ Pronto | Manter |
| Alarme/timer | ✅ Pronto | Manter |

---

## MÓDULOS DO NOVO APP

---

### MÓDULO 1 — FINANÇAS PESSOAIS (já temos)
**Submenus:**
- Contas a pagar
- Transações
- Metas de poupança
- Relatórios

**O que adicionar futuramente:**
- Orçamento por categoria (limite de gastos)
- Alertas de gastos excessivos

---

### MÓDULO 2 — VIDA PESSOAL

#### 2A. Agenda
- Eventos com data, hora, tipo (pessoal, trabalho, saúde)
- Cores por tipo
- Visualização: dia / semana / mês
- Lembretes (1h antes, 1 dia antes)
- Eventos recorrentes (toda segunda, todo dia 5)
- Datas importantes: aniversários, comemorações

#### 2B. Medicamentos
- Cadastro: nome do remédio, dosagem, horário(s), frequência
- Marcar como "tomado hoje"
- Histórico de adesão
- Controle de estoque do remédio (avisar quando acabar)
- Lista de médicos e receitas

#### 2C. Tarefas & Lembretes
- Lista de tarefas com prioridade (baixa / média / alta)
- Subtarefas (checklist)
- Lembretes com data e hora
- Tarefas recorrentes ("toda segunda comprar pão")
- Projetos: agrupar tarefas por contexto
- Kanban (já temos) — integrar aqui

#### 2D. Contatos
- Nome, telefone, email, endereço
- Tags (família, trabalho, cliente, fornecedor)
- Data de aniversário (alerta automático)
- Link direto para WhatsApp
- Histórico de interações / anotações
- "Última vez que falou com X: 30 dias atrás"

#### 2E. Saúde & Hábitos
- Registrar hábitos diários: exercício, água, sono, alimentação
- Sequência de dias (streak)
- Métricas pessoais: peso, pressão, glicose
- Gráfico de evolução
- Metas de hábitos (exercitar 3x/semana)

---

### MÓDULO 3 — MEU NEGÓCIO (Microempreendedor)

#### 3A. Produtos / Cardápio
- Cadastro: nome, descrição, preço venda, custo unitário
- Foto do produto
- Categoria (ex: salgados, doces, bebidas, serviços)
- Variações (tamanho P/M/G, sabores, etc.)
- Status: disponível / indisponível / saiu de linha
- Margem de lucro calculada automaticamente

#### 3B. Vendas
- Carrinho de venda: selecionar produtos + quantidade
- Registrar venda: data, cliente, produtos, valor total, forma de pagamento (PIX, dinheiro, cartão, crédito)
- Nota de venda simples (para o cliente)
- Histórico de vendas com filtros
- Vendas a prazo (cliente paga depois)
- Comissão / lucro por venda

#### 3C. Estoque
- Quantidade disponível por produto
- Alerta de estoque baixo (definir mínimo)
- Entradas: registrar compra de fornecedor
- Saídas: automáticas nas vendas, ou manual (perda, uso)
- Relatório: o que tem, o que falta

#### 3D. Clientes (CRM simples)
- Nome, telefone, email
- Histórico de compras
- Saldo devedor (se comprou a prazo)
- Anotações e preferências
- Aniversário
- Link WhatsApp direto

#### 3E. Fornecedores
- Nome, produto que fornece, contato
- Histórico de compras
- Preço por unidade (para cálculo de custo)

#### 3F. Precificação
- Calculadora: custo + margem = preço sugerido
- Comparação de preços (histórico de mudanças)
- Tabela à vista vs a prazo

#### 3G. Relatórios do Negócio
- Vendas por período (dia, semana, mês)
- Produto mais vendido
- Cliente que mais comprou
- Receita vs Lucro vs Custo
- Crescimento mês a mês
- Alertas de estoque crítico

---

### MÓDULO 4 — MENTOR AI *(etapa futura)*
- Chat com IA para dúvidas pessoais e de negócio
- Sugestões automáticas baseadas nos dados ("seu lucro caiu")
- Análise de padrões
- Geração de descrições de produtos
- Dicas de precificação e marketing

---

## ESTRUTURA DE NAVEGAÇÃO

### Sidebar Desktop (reorganizada)
```
├── 🏠  Dashboard          ← Nova tela inicial unificada
│
├── 👤  Vida Pessoal
│   ├── 📅 Agenda
│   ├── 💊 Medicamentos
│   ├── ✅ Tarefas
│   ├── 👥 Contatos
│   └── 💪 Saúde & Hábitos
│
├── 💼  Meu Negócio
│   ├── 📦 Produtos
│   ├── 🛒 Vendas
│   ├── 📋 Estoque
│   ├── 👤 Clientes
│   ├── 🏭 Fornecedores
│   └── 📊 Relatórios
│
├── 💰  Finanças
│   ├── 💳 Contas
│   ├── 📊 Transações
│   ├── 🎯 Metas
│   └── 📈 Relatórios
│
├── 🤖  Mentor AI           ← Etapa futura
│
└── ⚙️  Configurações
```

### Bottom Nav Mobile (5 ícones)
```
🏠 Dashboard | 👤 Pessoal | 💼 Negócio | 💰 Finanças | ⚙️ Config
```

---

## NOVO DASHBOARD PRINCIPAL

**Visão:** Cards rápidos com o que importa agora.

**Blocos sugeridos:**
1. **Saudação** — "Bom dia, Léo. Você tem 3 tarefas hoje."
2. **Alerta de Medicamentos** — "Tomar Dipirona às 14h"
3. **Próximo Evento** — "Consulta Dr. João — amanhã 10h"
4. **Financeiro rápido** — Saldo do mês, conta mais urgente
5. **Vendas de hoje** — Total vendido, última venda
6. **Estoque crítico** — Produtos acabando
7. **Tarefas pendentes** — Top 3 mais urgentes
8. **Hábitos do dia** — Checklist rápido

---

## ORDEM DE IMPLEMENTAÇÃO SUGERIDA

| Fase | O que fazer | Estimativa |
|------|-------------|-----------|
| **Fase 1** | Redesenhar sidebar + estrutura de menus + Dashboard novo | Sprint 1 |
| **Fase 2** | Módulo Tarefas & Lembretes (tem base no Kanban) | Sprint 2 |
| **Fase 3** | Módulo Medicamentos | Sprint 2 |
| **Fase 4** | Módulo Agenda | Sprint 3 |
| **Fase 5** | Módulo Contatos | Sprint 3 |
| **Fase 6** | Módulo Produtos + Estoque (Negócio) | Sprint 4 |
| **Fase 7** | Módulo Vendas + Clientes | Sprint 5 |
| **Fase 8** | Módulo Relatórios (Negócio) | Sprint 5 |
| **Fase 9** | Saúde & Hábitos | Sprint 6 |
| **Fase 10** | Mentor AI (Claude API) | Sprint 7 |

---

## DECISÕES TÉCNICAS

| Decisão | Escolha |
|---------|---------|
| Stack | HTML + CSS + JS puro (manter — sem framework) |
| Dados | localStorage (manter — Supabase na etapa futura) |
| Design | Aurora Design System (manter 100%) |
| Deploy | GitHub Pages (já configurado) |
| IA | Claude API (etapa futura) |
| WhatsApp | Twilio (etapa futura, se quiser) |

---

## RENOMEAR O APP

| Opção | Nome sugerido |
|-------|---------------|
| A | **Mentor24h** (mesmo nome do projeto maior) |
| B | **OrganizaAí** (simples, direto) |
| C | **Vida+** (vida pessoal + negócio) |
| D | **Central Pessoal** |
| E | **Nexus** (hub de tudo) |
| F | **Definir com o usuário** |

---

## PRÓXIMOS PASSOS IMEDIATOS

1. ✅ Documento de plano criado (este arquivo)
2. ⏳ Usuário confirma módulos e prioridades
3. ⏳ Definir nome do app
4. ⏳ Redesenhar a tela do Dashboard principal (wireframe)
5. ⏳ Reorganizar sidebar com submenus expandíveis
6. ⏳ Iniciar Fase 1

---

*Documento gerado em 2026-05-11 — sujeito a alterações conforme decisões do usuário.*
