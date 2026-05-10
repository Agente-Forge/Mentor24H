# FinFlow — Editorial Finance

Dashboard financeiro pessoal premium com estética **editorial** — bento grid asymmetric, glassmorphism evoluído e tipografia magazine-style.

## Como rodar

Como o projeto usa arquivos JS separados, **precisa de servidor local** (não abre direto no Chrome via `file://`).

### Opção 1 — VS Code Live Server (mais fácil)

1. Instale a extensão **Live Server** no VS Code
2. Botão direito em `index.html` → **Open with Live Server**
3. Abre automaticamente em `http://127.0.0.1:5500`

### Opção 2 — Python

```bash
cd "controle-financeiro v2"
python -m http.server 8000
# abra: http://localhost:8000
```

### Opção 3 — Node.js

```bash
npx serve .
# abre em http://localhost:3000
```

## Stack

- **Zero dependências externas** (exceto Google Fonts)
- HTML + CSS + JavaScript puro
- LocalStorage para persistência
- SVG charts customizados (sem Chart.js)
- Sistema próprio de ícones SVG inline (sem Lucide CDN)

## Tipografia

- **Instrument Serif** — Display editorial (italic dramático)
- **Geist** — UI body (Vercel-grade)
- **Geist Mono** — Números tabulares

## Paleta Aurora

- Violeta `#A78BFA` · Magenta `#F472B6` · Âmbar `#FBBF24` (gradient hero)
- Verde `#5EE39A` · Vermelho `#FF6B7A` · Azul `#7BB6FF` (semantic)

## Funcionalidades

- **Dashboard** — Bento grid com saúde financeira, KPIs, calculadora diária, gráficos
- **Contas** — Normal, recorrente, parcelada (com geração automática)
- **Transações** — Histórico agrupado por data
- **Metas** — Caixinhas com depósito/saque, calculadora de ritmo, alertas de atraso
- **Kanban** — Drag & drop de cards entre colunas
- **Categorias** — Customização com cor + ícone
- **Configurações** — Backup JSON, reset, perfil

Dados de demonstração são populados automaticamente no primeiro acesso.
