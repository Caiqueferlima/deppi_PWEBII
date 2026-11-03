# Backend — DEPPI PWEB II

API REST responsável pelo gerenciamento de cursos de extensão, inscrições,
perfis, usuários, permissões e relatórios do projeto DEPPI PWEB II.

## Visão rápida

| Item | Tecnologia |
|---|---|
| Servidor HTTP | Node.js + Express 5 |
| Linguagem | TypeScript |
| Banco de dados | MySQL |
| Persistência | Prisma com adapter MariaDB |
| Autenticação | JWT e refresh token |
| Validação | Zod |
| Uploads | Multer |
| Relatórios | ExcelJS e PDFKit |

## Executar localmente

### O que é necessário

- Node.js LTS;
- Docker Desktop aberto;
- este repositório;
- PowerShell ou outro terminal.

### Banco MySQL

O banco local é definido em [`docker-compose.yml`](./docker-compose.yml).
Na configuração padrão, ele usa:

```text
host: localhost
porta: 3306
banco: api-ger-extensao
usuário: pweb
senha: pweb1-projeto-ifce
```

Inicie-o na pasta `back`:

```powershell
docker compose up -d
docker compose ps
```

### Variáveis de ambiente

Crie `back\.env` a partir de [`.env.example`](./.env.example). Para o banco do
Docker, confira principalmente:

```env
DATABASE_URL="******localhost:3306/api-ger-extensao"
DATABASE_HOST="localhost"
DATABASE_PORT=3306
DATABASE_USER="pweb"
DATABASE_PASSWORD="pweb1-projeto-ifce"
DATABASE_NAME="api-ger-extensao"
DATABASE_SSL=false
PORT=3000
NODE_ENV=development
JWT_SECRET="uma-chave-secreta-local"
```

`DATABASE_URL` é usada pelo Prisma nas migrations. As variáveis
`DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD` e
`DATABASE_NAME` são usadas pelo adapter na execução da API.

### Instalação, banco e seed

```powershell
npm install
npx prisma generate
npx prisma migrate deploy
npx tsx prisma/seed.ts
```

O seed cria os papéis, permissões, usuários e dados de demonstração descritos em
[`docs/SEED.md`](./docs/SEED.md).

### Iniciar a API

```powershell
npm run dev
```

O servidor fica em <http://localhost:3000>. O endpoint
<http://localhost:3000/health> deve retornar:

```json
{ "status": "ok" }
```

Para executar uma versão compilada:

```powershell
npm start
```

## Usuários criados para teste

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | `admin@ifce.edu.br` | `admin123` |
| DEPPI | `deppi@ifce.edu.br` | `deppi123` |
| Professor | `professor@ifce.edu.br` | `professor123` |
| Aluno | `aluno@ifce.edu.br` | `aluno123` |

Essas credenciais são somente para desenvolvimento. Altere as senhas em
qualquer ambiente compartilhado ou de produção.

## Como autenticar

1. Envie `POST /autenticacao/login` com:

   ```json
   {
     "email": "admin@ifce.edu.br",
     "senha": "admin123"
   }
   ```

2. Guarde o `accessToken` retornado.
3. Use-o nas rotas protegidas:

   ```text
   Authorization: Bearer <accessToken>
   ```

O access token dura, por padrão, 15 minutos. Use
`POST /autenticacao/refresh` para obter outro token. O refresh token permanece
armazenado apenas em formato de hash no banco e pode ser invalidado por
`POST /autenticacao/logout`.

## Produção

A configuração publicada usa API no Render e MySQL no Aiven:

- API: <https://api-ger-extensao-zcrp.onrender.com>
- Sinal de saúde: <https://api-ger-extensao-zcrp.onrender.com/health>

O endereço `/` não é uma página web; uma resposta `404` nessa rota é esperada.
Consulte [`DEPLOY.md`](./DEPLOY.md) para configurar o banco, as variáveis,
migrations, seed e o Blueprint do Render.

## Referência de rotas

A lista organizada por módulo está em [`docs/rotas.md`](./docs/rotas.md).
Ela inclui autenticação, perfis, cursos, inscrições, documentos, usuários,
permissões, departamentos, instituições e relatórios.

## Estrutura principal

```text
src/
├── app.ts                 # configuração do Express e rotas
├── server.ts              # inicialização do servidor HTTP
├── middlewares/           # autenticação, RBAC, validação, CORS e uploads
├── modules/               # regras separadas por domínio
├── lib/prisma.ts          # conexão com MySQL
├── types/                 # extensões de tipos do Express
└── utils/                 # erros, ambiente e funções auxiliares

prisma/
├── schema/                # modelos Prisma divididos por arquivo
├── migrations/            # histórico do banco
├── generated/             # client gerado; não editar
└── seed.ts                # dados iniciais
```

Para entender o fluxo interno, leia [`docs/ARQUITETURA.md`](./docs/ARQUITETURA.md).

## Testes básicos

Execute:

```powershell
npm test
```

Os testes usam o runner nativo do Node.js e cobrem o healthcheck, respostas
`404`, proteção de rota autenticada e validação do login. Eles usam uma porta
temporária e não executam operações no banco.

## Verificação de tipos

Para verificar o TypeScript sem iniciar a API:

```powershell
npm run check
```

## Comandos de manutenção

```powershell
# Ver logs do banco
docker compose logs -f mysql

# Parar o banco sem apagar os dados
docker compose stop

# Remover o container mantendo o volume
docker compose down

# Remover o container e apagar o banco local
docker compose down -v
```

Depois de `down -v`, execute novamente `npx prisma migrate deploy` e o seed.

## Equipe

Este projeto foi desenvolvido por:

- Caíque Fernandes;
- Gabrielle Gomes.
