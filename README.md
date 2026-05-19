# E-Commerce Frontend

Interface web do sistema de pedidos online, construída com React + TypeScript + Vite. Permite que clientes naveguem pelo cardápio, adicionem produtos ao carrinho e finalizem pedidos, enquanto administradores gerenciam produtos, categorias e acompanham pedidos em tempo real via WebSocket.

---

## Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 19.2 | UI |
| TypeScript | 5.9 | Tipagem estática |
| Vite | 7.3 | Build tool e dev server |
| React Router DOM | 7.13 | Roteamento SPA |
| TanStack React Query | 5.90 | Cache e gerenciamento de estado do servidor |
| Axios | 1.13 | Requisições HTTP |
| STOMP.js / SockJS | 7.3 / 2.3 | WebSocket para pedidos em tempo real |

---

## Estrutura do Projeto

```
src/
├── components/
│   ├── features/
│   │   ├── category/       # Filtro de categorias
│   │   └── product/        # Card de produto
│   └── ui/
│       ├── button/
│       └── skeleton/       # Loading skeleton
├── context/
│   └── CartContext.tsx     # Estado global do carrinho
├── pages/
│   ├── admin/              # Dashboard, produtos e pedidos
│   └── store/              # Home, carrinho e checkout
├── services/               # Camada de integração com a API
└── types/                  # Tipagens globais
```

---

## Pré-requisitos

- Node.js 20+
- npm ou yarn
- Backend rodando (Spring Boot)

---

## Configuração

Clone o repositório e instale as dependências:

```bash
git clone <url-do-repositorio>
cd <pasta-do-projeto>
npm install
```

Crie o arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:8080
```

> **Atenção:** Nunca commite o arquivo `.env`. Ele já está no `.gitignore` por padrão.

---

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Compila TypeScript e gera build de produção |
| `npm run preview` | Pré-visualiza o build de produção localmente |
| `npm run lint` | Executa o ESLint no projeto |

---

## Docker

### Dockerfile (multi-stage build)

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Build e execução

```bash
# Build
docker build --build-arg VITE_API_URL=http://localhost:8080 -t ecommerce-frontend .

# Rodar
docker run -p 3000:80 ecommerce-frontend
```

---

## Páginas

### Loja
- `/` — Home com listagem e filtro de produtos por categoria
- `/cart` — Carrinho de compras
- `/checkout` — Finalização de pedido

### Admin
- `/admin/dashboard` — Visão geral
- `/admin/products` — Listagem e gerenciamento de produtos
- `/admin/products/create` — Criação de produto
- `/admin/orders` — Pedidos em tempo real via WebSocket

---

## Integração com a API

Todas as chamadas HTTP são feitas via Axios, configurado em `src/services/api.ts` com a `VITE_API_URL` como base.

Os pedidos são atualizados em tempo real usando **STOMP sobre WebSocket**, permitindo que o painel admin receba notificações sem polling.

---