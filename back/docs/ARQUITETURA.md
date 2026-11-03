# Arquitetura e funcionamento da API

Este documento apresenta o caminho de uma requisição, a organização do código,
as regras de autenticação e a forma como a API conversa com o MySQL.

Para instalar e executar o projeto, consulte o
[`README.md`](../README.md). Para localizar endpoints, consulte
[`rotas.md`](./rotas.md).

## 1. Panorama

O backend é uma API REST em Node.js, Express 5 e TypeScript. O Prisma organiza
o acesso ao MySQL por meio do adapter MariaDB. O acesso é protegido por JWT e
por autorização baseada em papéis e permissões (RBAC).

```text
Cliente
  │ HTTP
  ▼
Express / app.ts
  │ CORS → JSON → logger
  ▼
Routes
  │ auth → papel/permissão → Zod → upload
  ▼
Controller
  ▼
Service
  ▼
Prisma adapter MariaDB
  ▼
MySQL
```

## 2. Organização do código

```text
src/
├── server.ts
├── app.ts
├── lib/
│   └── prisma.ts
├── middlewares/
│   ├── auth.middleware.ts
│   ├── authorization.middleware.ts
│   ├── validateZod.middleware.ts
│   ├── cors.middleware.ts
│   ├── logger.middleware.ts
│   ├── error.middleware.ts
│   └── upload*.middleware.ts
├── modules/
│   └── <domínio>/
│       ├── <domínio>.routes.ts
│       ├── <domínio>.controller.ts
│       ├── <domínio>.service.ts
│       └── <domínio>.schema.ts
├── types/
└── utils/

prisma/
├── schema/
├── migrations/
├── generated/
└── seed.ts
```

Os módulos atuais cobrem autenticação, perfis, cursos, professor, inscrições,
DEPPI, relatórios, instituições, usuários, permissões e departamentos.

### Responsabilidade de cada camada

- **Routes:** declara método, URL e sequência de middlewares.
- **Controller:** extrai dados da requisição e monta a resposta.
- **Service:** concentra regra de negócio e operações do Prisma.
- **Schema:** valida body, parâmetros e query strings com Zod.
- **Middleware:** aplica preocupações transversais sem duplicar lógica.

## 3. Ciclo de uma requisição

O [`app.ts`](../src/app.ts) registra as etapas nesta ordem:

1. CORS decide se a origem pode acessar a API.
2. `express.json()` interpreta corpos JSON.
3. O logger registra método, caminho, status e duração.
4. A rota executa autenticação, autorização, validação e upload quando necessário.
5. O controller chama o service.
6. O `notFoundHandler` responde `404` se nenhuma rota atender ao caminho.
7. O `errorHandler` transforma exceções em respostas padronizadas.

`GET /health` é um endpoint simples de disponibilidade e retorna
`{ "status": "ok" }`.

## 4. Autenticação e sessão

### Login

`POST /autenticacao/login`:

1. localiza o usuário e seus papéis;
2. compara a senha com o hash usando bcrypt;
3. cria um access token com id, nome, e-mail, papéis e permissões;
4. cria um refresh token aleatório;
5. grava somente o hash do refresh token, com validade padrão de sete dias;
6. devolve os tokens ao cliente.

O access token é usado no header `Authorization: Bearer <token>` e expira,
por padrão, em 15 minutos.

### Renovação e logout

- `POST /autenticacao/refresh` valida o refresh token não expirado e não revogado
  e emite outro access token.
- `POST /autenticacao/logout` marca o refresh token como revogado.
- O access token já emitido continua válido até seu vencimento natural.

### Recuperação e cadastro

- `POST /autenticacao/esqueci-senha` cria um token de recuperação com validade
  de uma hora; em desenvolvimento, o token pode ser exibido para facilitar testes.
- `POST /autenticacao/redefinir-senha` valida e consome o token.
- `POST /autenticacao/registro` cria um usuário com papel ALUNO e senha protegida
  por bcrypt.

## 5. Autorização RBAC

O token carrega dois conjuntos de dados:

```text
roles:       ["PROFESSOR"]
permissions:  ["curso:create", "curso:read"]
```

- `checkRole(...)` exige pelo menos um papel informado.
- `checkPermission(recurso, acao)` exige a permissão
  `recurso:acao`.

O relacionamento persistido é:

```text
User ──< UserPapel >── Papel ──< PapelPermissao >── Permissao
```

Os papéis principais são `ADMIN`, `DEPPI`, `PROFESSOR` e `ALUNO`. O módulo
`permissoes` permite ao ADMIN administrar esses vínculos.

## 6. Validação e erros

`validateZod` valida `body`, `params` ou `query` antes do controller. Falhas
geram status `400` com os detalhes do Zod. O `req.query` é somente leitura no
Express 5; por isso, o middleware valida a query e o controller lê o valor
original.

As regras de negócio usam `AppError(mensagem, statusCode)`. O handler global:

- preserva a mensagem e o status de um `AppError`;
- transforma erros inesperados em `500`;
- não expõe detalhes internos;
- responde `404` com `{"error":"Rota nao encontrada."}` para caminhos inexistentes.

O formato geral de falha é:

```json
{ "error": "mensagem ou detalhe" }
```

## 7. Arquivos e CORS

Há três tipos de upload:

| Campo | Finalidade |
|---|---|
| `imagem` | capa de curso |
| `foto` | foto de perfil |
| `files` | até dez documentos de inscrição |

Os arquivos ficam em `uploads/` e são servidos pelo caminho `/uploads`. O disco
gratuito do Render é efêmero; portanto, uploads de produção devem migrar para
um storage persistente.

`CORS_ORIGINS` recebe origens separadas por vírgula. Em desenvolvimento, vazio
libera todas as origens; requisições sem `Origin`, como as do Postman, são aceitas.

## 8. Persistência

[`src/lib/prisma.ts`](../src/lib/prisma.ts) cria o client com o adapter MariaDB
e pool de cinco conexões. `DATABASE_SSL=true` habilita SSL para bancos em nuvem.

O schema foi dividido em arquivos dentro de `prisma/schema/`, e
[`prisma.config.ts`](../prisma.config.ts) informa ao Prisma onde encontrá-los.
As migrations ficam em `prisma/migrations/`; o client em `prisma/generated/`
é recriado por `npx prisma generate` e não deve ser editado manualmente.

Entidades centrais:

- usuários, perfis e RBAC;
- cursos e tabelas de apoio;
- inscrições, histórico e documentos;
- refresh tokens e tokens de recuperação;
- instituições, departamentos e relatórios.

Uma mudança de status de inscrição ocorre em transação e registra
`InscricaoHistorico`. Ao liberar uma vaga, a próxima inscrição da lista de
espera pode ser promovida automaticamente.

## 9. Variáveis de ambiente

| Variável | Uso |
|---|---|
| `DATABASE_URL` | migrations do Prisma |
| `DATABASE_HOST` | host MySQL em runtime |
| `DATABASE_PORT` | porta MySQL; local padrão `3306` |
| `DATABASE_USER` / `DATABASE_PASSWORD` | credenciais MySQL |
| `DATABASE_NAME` | banco utilizado |
| `DATABASE_SSL` | SSL do MySQL, normalmente `false` local |
| `PORT` | porta HTTP, `3000` local |
| `NODE_ENV` | ambiente de execução |
| `JWT_SECRET` | assinatura dos tokens |
| `JWT_EXPIRES_IN` | validade do access token |
| `REFRESH_TOKEN_EXPIRES_DAYS` | validade do refresh token |
| `CORS_ORIGINS` | origens permitidas |

`getEnv` interrompe a inicialização quando uma variável obrigatória não existe.

## 10. Execução e deploy

Localmente, o MySQL é iniciado por `docker compose`, seguido de:

```powershell
npx prisma generate
npx prisma migrate deploy
npx tsx prisma/seed.ts
npm run dev
```

No Render, o build executa `prisma generate` e `prisma migrate deploy`; a API
usa a porta fornecida pelo ambiente. O procedimento completo está em
[`DEPLOY.md`](../DEPLOY.md).
