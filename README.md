# DEPPI PWEB II

Sistema para gerenciamento de cursos de extensão, inscrições e usuários.

O projeto é dividido em:

- `back/`: API REST em Node.js, Express, TypeScript e Prisma.
- `front/`: aplicação web em React, TypeScript e Vite.
- MySQL: banco de dados executado localmente com Docker.

## Pré-requisitos

Instale e deixe disponíveis:

- [Node.js](https://nodejs.org/) (versão LTS);
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) iniciado;
- Git, caso o projeto ainda não esteja clonado.

## Configuração inicial

Abra um PowerShell na pasta do projeto:

```powershell
cd C:\Users\Think\Desktop\PWEBII\deppi_PWEBII
```

### 1. Subir o banco de dados

O arquivo [`back/docker-compose.yml`](./back/docker-compose.yml) cria um MySQL
com estas credenciais locais:

| Configuração | Valor |
|---|---|
| Host | `localhost` |
| Porta | `3306` |
| Banco | `api-ger-extensao` |
| Usuário | `pweb` |
| Senha | `pweb1-projeto-ifce` |

Execute:

```powershell
cd back
docker compose up -d
```

Confirme que o container está ativo:

```powershell
docker compose ps
```

### 2. Configurar e preparar o backend

Crie o arquivo `back\.env` copiando [`back/.env.example`](./back/.env.example).
Para o banco criado pelo Docker, confira se as variáveis principais estão assim:

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
JWT_SECRET="chave-secreta-apenas-para-desenvolvimento"
```

Instale as dependências e prepare o banco:

```powershell
cd C:\Users\Think\Desktop\PWEBII\deppi_PWEBII\back
npm install
npx prisma generate
npx prisma migrate deploy
npx tsx prisma/seed.ts
```

O seed cria dados iniciais para teste, incluindo:

| E-mail | Senha | Papel |
|---|---|---|
| `admin@ifce.edu.br` | `admin123` | ADMIN |
| `deppi@ifce.edu.br` | `deppi123` | DEPPI |
| `professor@ifce.edu.br` | `professor123` | PROFESSOR |
| `aluno@ifce.edu.br` | `aluno123` | ALUNO |

> Esses dados são destinados apenas ao desenvolvimento local. Não use essas
> senhas em produção.

### 3. Configurar e preparar o frontend

Em outro PowerShell, crie `front\.env` copiando
[`front/.env.example`](./front/.env.example). O conteúdo deve ser:

```env
VITE_API_URL=http://localhost:3000
```

Instale as dependências:

```powershell
cd C:\Users\Think\Desktop\PWEBII\deppi_PWEBII\front
npm install
```

## Executar o projeto

É necessário manter dois terminais abertos.

### Terminal 1 — backend

```powershell
cd C:\Users\Think\Desktop\PWEBII\deppi_PWEBII\back
npm run dev
```

API: <http://localhost:3000>

Teste o healthcheck abrindo <http://localhost:3000/health>. A resposta esperada
é:

```json
{ "status": "ok" }
```

### Terminal 2 — frontend

```powershell
cd C:\Users\Think\Desktop\PWEBII\deppi_PWEBII\front
npm run dev
```

Abra no navegador a URL informada pelo Vite, normalmente
<http://localhost:5173>.

## Teste rápido

1. Verifique se o MySQL está ativo com `docker compose ps`.
2. Verifique se a API responde em `/health`.
3. Abra o frontend no navegador.
4. Entre com `admin@ifce.edu.br` e `admin123`.

Para testar as demais rotas da API, consulte as coleções do Postman em
[`back/docs/collections/`](./back/docs/collections/) ou a documentação do
backend em [`back/README.md`](./back/README.md).

## Comandos úteis

### Parar e iniciar o banco

```powershell
cd C:\Users\Think\Desktop\PWEBII\deppi_PWEBII\back
docker compose stop
docker compose start
```

### Parar o banco e remover os containers

```powershell
cd C:\Users\Think\Desktop\PWEBII\deppi_PWEBII\back
docker compose down
```

Os dados permanecem no volume do Docker. Para apagar também os dados locais:

```powershell
docker compose down -v
```

> O comando `down -v` apaga o banco local. Depois será necessário executar
> novamente as migrations e o seed.

### Ver logs do banco

```powershell
cd C:\Users\Think\Desktop\PWEBII\deppi_PWEBII\back
docker compose logs -f mysql
```

### Verificar o frontend antes de publicar

```powershell
cd C:\Users\Think\Desktop\PWEBII\deppi_PWEBII\front
npm run build
npm run lint
```

### Compilar o backend

```powershell
cd C:\Users\Think\Desktop\PWEBII\deppi_PWEBII\back
npm start
```

### Executar os testes básicos da API

```powershell
cd C:\Users\Think\Desktop\PWEBII\deppi_PWEBII\back
npm test
```

Os testes verificam o healthcheck, o retorno de rotas inexistentes, a proteção
de uma rota autenticada e a validação do corpo de login. Eles iniciam a API em
uma porta temporária e não alteram o banco de dados.

### Validar os projetos

Backend:

```powershell
cd C:\Users\Think\Desktop\PWEBII\deppi_PWEBII\back
npm run check
```

Frontend:

```powershell
cd C:\Users\Think\Desktop\PWEBII\deppi_PWEBII\front
npm run check
```

Esses comandos executam a verificação de tipos do TypeScript sem iniciar os
servidores e sem modificar o banco de dados.

### Integração contínua

O workflow [`ci.yml`](./.github/workflows/ci.yml) executa automaticamente no
GitHub, em pushes e pull requests para `main`. Ele instala as dependências,
verifica os tipos e executa os testes do backend; no frontend, também executa
lint e build.

## Solução de problemas

### Erro de conexão com MySQL

Confirme:

1. O Docker Desktop está aberto.
2. O container está ativo com `docker compose ps`.
3. O arquivo `back\.env` usa `DATABASE_PORT=3306`.
4. O banco, usuário e senha são os mesmos do
   [`back/docker-compose.yml`](./back/docker-compose.yml).

### A porta 3306 já está ocupada

Pare o serviço que está usando a porta ou altere o mapeamento em
[`back/docker-compose.yml`](./back/docker-compose.yml). Se alterar a porta
externa, atualize também `DATABASE_PORT` e `DATABASE_URL` no `back\.env`.

### O frontend não consegue acessar a API

Confirme que:

- o backend está rodando em `http://localhost:3000`;
- `front\.env` contém `VITE_API_URL=http://localhost:3000`;
- o frontend foi reiniciado depois de alterar o `.env`.

### O banco está sem dados de teste

Execute no diretório `back`:

```powershell
npx tsx prisma/seed.ts
```

## Documentação adicional

- [Guia de contribuição](./CONTRIBUTING.md)
- [Documentação da API](./back/README.md)
- [Arquitetura](./back/docs/ARQUITETURA.md)
- [Dados criados pelo seed](./back/docs/SEED.md)
- [Rotas da API](./back/docs/rotas.md)
- [Deploy](./back/DEPLOY.md)
