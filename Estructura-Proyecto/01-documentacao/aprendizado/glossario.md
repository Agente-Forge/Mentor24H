# Glossário Dev — Mentor24h
**Projeto:** Mentor24h | **Modo Aprendiz:** PAE v2.0
*Ordem alfabética | Sem duplicatas | Atualizado automaticamente pelo PAE*

> Cada vez que você aprender um termo novo, ele aparece aqui.
> O PAE não vai repetir o que você já sabe.

---

## B

**badge**
→ Aquela etiquetinha colorida com um texto dentro (ex: "VIP", "Quente", "Lead").
→ Como reconhecer: é um elemento pequeno com cor de fundo e label.
*Apareceu em:* Lição #1 (2026-05-16)

---

## C

**coluna**
→ Uma divisão vertical numa tela. No sistema de Temperatura, cada status (VIP, Quente, etc.) é uma coluna.
*Apareceu em:* Lição #1 (2026-05-16)

---

## D

**design system**
→ O conjunto de regras visuais do projeto: quais cores usar, quais fontes, quais tamanhos. É como um "manual de identidade visual" do app.
→ No Mentor24h o design system se chama OBSIDIAN EDITORIAL.
*Apareceu em:* Lição #1 (2026-05-16)

---

## L

**localStorage**
→ O lugar onde o app salva seus dados no próprio navegador, sem precisar de internet ou servidor. É como um "arquivo local" do app.
→ No Mentor24h TODOS os dados ficam no localStorage.
*Apareceu em:* Lição #1 (2026-05-16)

---

## M

**módulo**
→ Uma seção/página independente do app. Cada módulo tem sua própria lógica e visual.
→ Exemplos: módulo Contatos, módulo Finanças, módulo Dashboard.
*Apareceu em:* Lição #1 (2026-05-16)

---

## T

**token**
→ Uma variável CSS que guarda um valor do design system. Em vez de escrever a cor `#D4A574` direto no código, usa-se o token `--signature`.
→ Isso garante que se a cor mudar um dia, muda em um lugar só.
→ Exemplos: `--signature` (ouro), `--warning` (âmbar), `--critical` (rubi).
*Apareceu em:* Lição #1 (2026-05-16)

---

## V

**view**
→ A forma como os dados são exibidos na tela. O mesmo dado pode ter várias views.
→ Exemplos: view Card (grade de cartões), view Lista (linhas), view Temperatura (colunas por status).
*Apareceu em:* Lição #1 (2026-05-16)

**view Kanban**
→ Uma view que organiza itens em colunas representando etapas/estágios. Usado para gerenciar fluxos de trabalho.
→ No módulo Contatos foi substituída pela view Temperatura.
*Apareceu em:* Lição #1 (2026-05-16)

---

## M (continuação)

**modo ativo**
→ O contexto atual em que o app está funcionando. No Mentor24h: "Pessoal" ou "Negócio". O app lembra qual modo estava ativo e volta para ele quando você reabre.
*Apareceu em:* Lição #2 (2026-05-16)

---

## P

**persistência**
→ Quando o app guarda uma informação para não esquecer depois de fechar. Exemplo: o modo ativo (Pessoal/Negócio) é persistido — ao reabrir o app, ele lembra onde você estava.
*Apareceu em:* Lição #2 (2026-05-16)

**pill toggle**
→ Aquele botão arredondado em formato de pílula com duas opções lado a lado. Você clica em uma e ela "acende". É o estilo de switcher que o Nubank usa para trocar de conta.
*Apareceu em:* Lição #2 (2026-05-16)

---

## R

**rail mode**
→ Modo colapsado da sidebar — mostra só ícones sem texto, largura reduzida (~64px). Parece um "trilho" compacto. Ao passar o mouse sobre um ícone, aparece um tooltip com o nome.
*Apareceu em:* Lição #5 (2026-05-16)

**routing**
→ O sistema que decide qual tela, navbar ou módulo mostrar dependendo de onde o usuário está ou qual modo está ativo. Como um "diretor de trânsito" do app.
*Apareceu em:* Lição #2 (2026-05-16)

---

## S

**switcher**
→ Elemento de interface que permite alternar entre dois modos ou contextos. No Mentor24h é o botão [Pessoal] [Negócio] no topo da sidebar.
*Apareceu em:* Lição #2 (2026-05-16)

---

## C

**commit**
→ Salvar permanentemente as mudanças no histórico do projeto usando git. É como tirar um "snapshot" do código naquele momento. Após o commit, você tem um registro de tudo que foi feito.
→ Comando: `git commit -m "descrição do que foi feito"`
*Apareceu em:* Lição #4 (2026-05-16)

---

## D

**deploy**
→ Publicar o app na internet para que funcione no link real. No Mentor24h, após `git push`, o GitHub Pages faz o deploy automaticamente em ~60 segundos.
*Apareceu em:* Lição #4 (2026-05-16)

**dot indicator**
→ Bolinha ou marcador que desliza suavemente para indicar qual item está ativo na navegação. No Mentor24h a bolinha fica à esquerda dos itens e se move com animação de 300ms.
*Apareceu em:* Lição #5 (2026-05-16)

**drawer**
→ Painel lateral que desliza da borda da tela — aparece quando o usuário precisa, some quando não precisa. No mobile, a sidebar do Mentor24h vira um drawer com overlay escuro atrás.
*Apareceu em:* Lição #5 (2026-05-16)

---

## E

**etiqueta (tag)**
→ Label personalizado que você adiciona a um item para categorizá-lo. No módulo Contatos do modo Negócio: "alto valor", "recorrente", "vip" são etiquetas. Aparecem como badges menores.
*Apareceu em:* Lição #4 (2026-05-16)

---

## F

**frosted glass**
→ Efeito visual translúcido com desfoque de fundo — como vidro fosco. Em CSS: `backdrop-filter: blur(8px)`. Usado nos itens inativos da sidebar para dar profundidade sem poluir.
*Apareceu em:* Lição #5 (2026-05-16)

---

## H

**histórico de interações**
→ Registro cronológico de tudo que aconteceu entre você e um contato: ligações, reuniões, vendas, outros. No CRM do modo Negócio, cada contato pode ter seu histórico registrado.
*Apareceu em:* Lição #4 (2026-05-16)

---

## K

**KPI** (Key Performance Indicator)
→ Indicador-chave de performance. São os números mais importantes do negócio exibidos numa tela só para decisão rápida. Exemplos: receita do mês, clientes ativos, ticket médio.
*Apareceu em:* Lição #3 (2026-05-16)

---

## O

**override (CSS)**
→ Quando um estilo "ganha" sobre outro por ser mais específico. Ex: `.modo-negocio .navbar` sobrescreve o estilo padrão `.navbar` apenas quando o modo Negócio está ativo.
*Apareceu em:* Lição #3 (2026-05-16)

---

## P (continuação)

**placeholder**
→ Conteúdo temporário que ocupa o lugar de algo ainda não pronto. No Mentor24h, os cards "Em breve" de Vendas e Estoque são placeholders — mostram que a feature vem, sem causar erro.
*Apareceu em:* Lição #3 (2026-05-16)

---

## S (continuação)

**scoped (CSS)**
→ Quando um estilo só afeta um contexto específico. No Mentor24h, o `css/negocio.css` usa `.modo-negocio` como âncora — tudo dentro dele só afeta o modo Negócio, zero impacto no modo Pessoal.
*Apareceu em:* Lição #3 (2026-05-16)

---

## S (continuação)

**schema**
→ A estrutura de dados de um objeto — quais campos ele tem e de que tipo são. O schema do contato define: nome (texto), telefone (texto), temperatura (string), negocio (objeto)... Estender o schema = adicionar novos campos.
*Apareceu em:* Lição #4 (2026-05-16)

---

*Total: 26 termos | Última adição: 2026-05-16 | PAE v2.0*
