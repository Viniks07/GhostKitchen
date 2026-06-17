# GhostKitchen

GhostKitchen é um projeto fullstack de delivery desenvolvido para aprendizado e portfólio, com foco em arquitetura, boas práticas de backend, regras de negócio reais e evolução progressiva para frontend web e mobile.

O objetivo do projeto não é apenas criar uma API que funcione, mas construir uma aplicação organizada, com separação clara de responsabilidades e decisões técnicas próximas de um cenário real de mercado.

---

## Objetivo do projeto

O GhostKitchen simula uma plataforma de delivery onde:

* clientes podem visualizar restaurantes e produtos;
* clientes podem criar pedidos;
* restaurantes podem gerenciar seus produtos;
* restaurantes podem visualizar pedidos recebidos;
* restaurantes podem atualizar o status dos pedidos;
* a API aplica regras de autenticação, autorização e ownership.

O projeto também serve como base para evolução em versões futuras, incluindo frontend em React, mobile, pagamentos, notificações e recursos mais avançados.

---

## Stack atual

### Backend

* Node.js
* Express
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT
* Cookies HTTP-only
* bcrypt
* ESLint
* Prettier

### Banco de dados

* PostgreSQL
* Prisma Migrations
* Campos monetários salvos em centavos com `Int`

Exemplo:

```json
{
  "priceInCents": 2590
}
```

Representa:

```txt
R$ 25,90
```

---

## Arquitetura

O backend segue uma arquitetura em camadas:

```txt
Controller → Service → Repository → Prisma
```

### Controller

Responsável por:

* receber `req` e `res`;
* validar dados simples de rota, como `params.id`;
* verificar autenticação quando necessário;
* chamar o service;
* retornar a resposta HTTP.

### Service

Responsável por:

* regras de negócio;
* validações;
* normalização de dados;
* ownership;
* cálculo de valores;
* controle de fluxo de status;
* erros de negócio.

### Repository

Responsável por:

* acesso ao banco de dados;
* queries Prisma;
* persistência;
* `select`, `include`, `create`, `update`, `findMany`, etc.

O repository não contém regra de negócio.

---

## Estrutura principal

```txt
GhostKitchen/
  backend/
    prisma/
    src/
      modules/
        auth/
        addresses/
        restaurants/
        products/
        orders/
        users/
      routes/
      shared/
        config/
        constants/
        database/
        errors/
        middlewares/
```

---

## Funcionalidades do backend MVP

### Auth

* Registro de usuário
* Login
* Logout
* Sessão com JWT
* Token em cookie HTTP-only
* Senha com hash usando bcrypt
* Roles:

  * `CLIENT`
  * `RESTAURANT`

---

### Restaurants

* Criar restaurante
* Buscar meu restaurante
* Atualizar meu restaurante
* Abrir/fechar restaurante
* Regra de um restaurante por usuário

---

### Products

* Criar produto
* Listar produtos do restaurante logado
* Atualizar produto
* Validar ownership
* Validar `priceInCents`
* Bloquear alteração de produto de outro restaurante

---

### Public Catalog

Rotas públicas para o frontend consumir:

```txt
GET /restaurants
GET /restaurants/:id
GET /restaurants/:id/products
```

Regras:

* restaurantes abertos aparecem primeiro;
* restaurantes fechados aparecem depois;
* produtos disponíveis aparecem primeiro;
* produtos indisponíveis aparecem depois.

Restaurantes fechados e produtos indisponíveis podem aparecer no catálogo, mas não podem ser usados para criar pedidos.

---

### Orders

Cliente:

```txt
POST /orders
GET /orders/me
GET /orders/:id
```

Restaurante:

```txt
GET /restaurants/orders
GET /restaurants/orders/:id
PATCH /restaurants/orders/:id/status
```

Regras principais:

* cliente só vê os próprios pedidos;
* restaurante só vê pedidos recebidos pelo próprio restaurante;
* cliente não envia total do pedido;
* total é calculado no backend;
* preço do item é salvo no momento da compra;
* produto duplicado no mesmo pedido é bloqueado;
* produto indisponível não pode ser comprado;
* restaurante fechado não pode receber pedido.

---

## Fluxo de status do pedido

Status disponíveis:

```txt
CREATED
ACCEPTED
PREPARING
ON_THE_WAY
DELIVERED
CANCELED
```

Transições permitidas:

```txt
CREATED    → ACCEPTED ou CANCELED
ACCEPTED   → PREPARING ou CANCELED
PREPARING  → ON_THE_WAY ou CANCELED
ON_THE_WAY → DELIVERED
DELIVERED  → estado final
CANCELED   → estado final
```

Transições inválidas são bloqueadas pelo service.

---

## Regras de negócio importantes

* Dinheiro é salvo em centavos usando `Int`.
* O cliente nunca envia o valor total do pedido.
* O backend calcula o total com base nos produtos salvos no banco.
* `OrderItem.priceInCents` salva o preço histórico do produto.
* Restaurantes fechados aparecem no catálogo, mas não aceitam pedidos.
* Produtos indisponíveis aparecem no catálogo, mas não podem ser comprados.
* Listagens vazias retornam array vazio, não erro.
* Recursos de outro usuário/restaurante retornam erro adequado.
* Produto de outro restaurante retorna `404`, evitando vazamento de existência do recurso.

---

## Variáveis de ambiente

Crie um arquivo `.env` dentro da pasta `backend` com base em `.env.example`.

Exemplo:

```env
PORT=3000
DATABASE_URL=
FRONTEND_URL=http://localhost:5173
JWT_SECRET=
SESSION_EXPIRES_IN=604800000
NODE_ENV=development
```

> O arquivo `.env` real não deve ser versionado.

---

## Como rodar o backend

Entre na pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Rode as migrations:

```bash
npx prisma migrate dev
```

Rode o projeto em desenvolvimento:

```bash
npm run dev
```

A API ficará disponível em:

```txt
http://localhost:3000
```

---

## Seed de desenvolvimento

O projeto possui uma seed para popular o banco com dados iniciais.

Rodar:

```bash
npm run seed
```

A seed cria:

* clientes;
* usuários restaurante;
* restaurantes abertos e fechados;
* produtos disponíveis e indisponíveis;
* pedidos iniciais.

> A seed é destrutiva em ambiente de desenvolvimento: ela limpa dados existentes antes de recriar os dados de teste.

---

## Scripts disponíveis

Dentro de `backend`:

```bash
npm run dev
```

Roda o servidor em desenvolvimento.

```bash
npm run build
```

Compila o TypeScript.

```bash
npm run start
```

Roda a versão compilada.

```bash
npm run lint
```

Executa o ESLint.

```bash
npm run format
```

Formata o código com Prettier e Prisma Format.

```bash
npm run seed
```

Popula o banco com dados de desenvolvimento.

---

## Testes

Até o momento, o backend foi validado com testes manuais nos principais fluxos do MVP:

* autenticação;
* catálogo público;
* gerenciamento de restaurante;
* gerenciamento de produtos;
* criação de pedidos;
* listagem de pedidos;
* atualização de status;
* regras de ownership;
* bloqueio de transições inválidas.

Testes automatizados ainda não foram implementados.

Essa decisão foi tomada conscientemente para manter o escopo do MVP controlado. Os testes automatizados serão adicionados após a V1 frontend em React, quando o projeto retornar para uma etapa de fortalecimento técnico.

Prioridade futura de testes:

1. `OrdersService`
2. `ProductsService`
3. `AuthService`
4. `RestaurantsService`

---

## Status do projeto

Backend MVP funcional:

```txt
Auth                  ✅
Restaurants           ✅
Products              ✅
Orders                ✅
Public Catalog        ✅
Seed                  ✅
Manual Tests          ✅
Automated Tests       ⏳ pós-V1
README                ✅
Deploy                ⏳ pendente
```

---

## Roadmap

### V0 — Backend MVP

API principal do projeto.

Inclui:

* autenticação;
* restaurantes;
* produtos;
* pedidos;
* catálogo público;
* seed;
* validações;
* ownership;
* status workflow;
* documentação inicial.

Status: em fase final.

---

### V1 — Frontend MVP em React puro

Frontend web usando React puro, sem Next.js, sem Tailwind e sem bibliotecas avançadas.

Foco:

* JSX;
* componentes;
* props;
* `useState`;
* `useEffect`;
* `useContext`;
* formulários;
* consumo da API com `fetch`;
* autenticação com cookie HTTP-only;
* organização simples e escalável.

---

### V2 — Evolução com React avançado / Next.js

Após dominar React base, o projeto poderá evoluir para uma versão com Next.js e ferramentas mais modernas do ecossistema.

Possíveis melhorias:

* rotas modernas;
* melhor UX;
* filtros;
* busca;
* paginação;
* loading states;
* componentes mais reutilizáveis;
* integração mais robusta com autenticação.

---

### V3 — Mobile

Versão mobile do app, possivelmente usando React Native ou Expo.

---

### V4 — Features avançadas

Possíveis evoluções futuras:

* pagamentos;
* notificações em tempo real;
* SSE ou WebSocket;
* imagens de produtos/restaurantes;
* avaliações;
* cupons;
* favoritos;
* categorias;
* taxa de entrega;
* dashboard administrativo;
* observabilidade;
* CI/CD;
* testes automatizados completos.

---

## Decisões técnicas relevantes

### Por que usar `priceInCents`?

Para evitar problemas de precisão com valores monetários.

Não usar:

```txt
Float
Decimal no service
BigInt no MVP
```

Usar:

```txt
Int em centavos
```

---

### Por que JWT em cookie HTTP-only?

Para reduzir exposição do token no JavaScript do frontend.

O frontend deve enviar requisições autenticadas usando:

```ts
fetch("http://localhost:3000/auth/me", {
  credentials: "include",
});
```

---

### Por que mostrar restaurantes fechados e produtos indisponíveis?

Para permitir que o frontend exiba estados reais da aplicação.

Exemplo:

* restaurante fechado aparece, mas não permite pedido;
* produto indisponível aparece, mas botão de compra fica desabilitado.

A regra de compra continua protegida no backend.

---

## Autor

Projeto desenvolvido por Vinicius S. Fonseca como parte de um processo de aprendizado e construção de portfólio fullstack.

[LinkedIn](https://www.linkedin.com/in/vinicius-silva-fonseca/)

[Github](https://github.com/Viniks07)