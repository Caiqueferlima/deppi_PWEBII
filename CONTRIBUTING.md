# Guia de contribuição

Obrigado por contribuir com o DEPPI PWEB II. Este documento descreve o fluxo
recomendado para preparar o ambiente, validar alterações e organizar commits.

## Preparar o ambiente

### Requisitos

- Node.js em versão LTS;
- Docker Desktop;
- Git;
- acesso ao repositório.

### Instalação

Na raiz do projeto:

```powershell
cd C:\Users\Think\Desktop\PWEBII\deppi_PWEBII
```

Inicie o MySQL:

```powershell
cd back
docker compose up -d
```

Configure `back\.env` com base em
[`back/.env.example`](./back/.env.example) e `front\.env` com base em
[`front/.env.example`](./front/.env.example).

Instale as dependências de cada parte:

```powershell
cd C:\Users\Think\Desktop\PWEBII\deppi_PWEBII\back
npm install
npx prisma generate
npx prisma migrate deploy

cd C:\Users\Think\Desktop\PWEBII\deppi_PWEBII\front
npm install
```

Para criar dados locais de demonstração, execute o seed dentro de `back`:

```powershell
npx tsx prisma/seed.ts
```

## Fluxo de trabalho

1. Atualize sua branch com a versão mais recente da `main`.
2. Crie uma branch específica para a alteração.
3. Faça uma mudança pequena e focada.
4. Execute os testes e as validações.
5. Revise o diff antes de registrar o commit.
6. Abra um pull request descrevendo o problema, a solução e os testes.

Evite misturar correções não relacionadas no mesmo commit.

## Comandos de validação

### Backend

```powershell
cd C:\Users\Think\Desktop\PWEBII\deppi_PWEBII\back
npm run check
npm test
```

### Frontend

```powershell
cd C:\Users\Think\Desktop\PWEBII\deppi_PWEBII\front
npm run check
npm run lint
npm run build
```

Antes de abrir o pull request, confirme também:

```powershell
git diff --check
git status
```

O GitHub também executa essas verificações pelo workflow de integração
contínua em [`.github/workflows/ci.yml`](./.github/workflows/ci.yml).

## Convenção de commits

Use mensagens curtas no formato:

```text
<emoji> <tipo>: <descrição>
```

Tipos recomendados:

| Tipo | Uso |
|---|---|
| `feat` | nova funcionalidade |
| `fix` | correção de comportamento |
| `test` | inclusão ou alteração de testes |
| `docs` | documentação |
| `chore` | manutenção e configuração |
| `refactor` | reorganização sem mudança de comportamento |
| `ci` | automação de integração contínua |

Exemplos:

```text
:sparkles: feat: adicionar filtro de cursos
:bug: fix: corrigir validação de inscrição
:memo: docs: atualizar instruções de instalação
:white_check_mark: test: cobrir login da API
```

Escreva a descrição no infinitivo ou de forma objetiva e evite commits que
misturem código, documentação e configurações sem relação.

## Pull requests

Inclua no pull request:

- resumo do problema;
- descrição da solução;
- arquivos ou módulos afetados;
- comandos de validação executados;
- limitações ou pontos que ainda precisam de atenção.

Não inclua:

- arquivos `.env`;
- senhas, tokens ou chaves;
- `node_modules`;
- arquivos gerados em `dist`;
- uploads locais ou dumps do banco.

## Regras para alterações

- Preserve as rotas e contratos existentes, salvo quando a alteração exigir
  explicitamente uma mudança de API.
- Reutilize os middlewares e helpers já existentes.
- Valide entradas novas com Zod.
- Mantenha regras de negócio nos services e controllers enxutos.
- Atualize a documentação diretamente relacionada à mudança.
- Adicione ou ajuste testes para comportamentos alterados.
- Não edite manualmente arquivos dentro de `prisma/generated`.
- Não use credenciais de teste em produção.

## Banco de dados

Alterações no modelo devem ser acompanhadas de uma migration Prisma. Em
desenvolvimento, revise a migration antes de compartilhá-la e confirme que o
seed continua funcionando.

Nunca execute `docker compose down -v` ou `prisma migrate reset` em um banco
que contenha dados importantes.

## Estrutura da documentação

- [README principal](./README.md): instalação e execução do projeto;
- [README do backend](./back/README.md): API e comandos do servidor;
- [Arquitetura](./back/docs/ARQUITETURA.md): organização interna;
- [Rotas](./back/docs/rotas.md): catálogo de endpoints;
- [Seed](./back/docs/SEED.md): dados de demonstração;
- [Deploy](./back/DEPLOY.md): publicação da API.
