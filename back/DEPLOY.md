# Publicação da API

Este roteiro publica a API no Render e conecta o serviço a um MySQL externo.
O Render não oferece MySQL gerenciado; por isso, o banco de produção deve
ficar em um provedor como Aiven, Clever Cloud ou Railway.

## 1. Criar o banco em nuvem

No Aiven:

1. crie uma conta;
2. selecione **Create service → MySQL**;
3. escolha o plano disponível e uma região;
4. aguarde o serviço ficar `Running`;
5. copie host, porta, usuário, senha e nome do banco em **Connection information**.

Monte a URL usada pelo Prisma:

```text
******HOST:PORT/DATABASE?sslaccept=accept_invalid_certs
```

Exemplo:

```text
******mysql-exemplo.aivencloud.com:12345/defaultdb?sslaccept=accept_invalid_certs
```

Use `sslaccept=accept_invalid_certs` na URL do Prisma. A opção
`ssl-mode=REQUIRED`, exibida por alguns clientes MySQL, não é o parâmetro
esperado pelo Prisma Migrate. Faça URL-encode de caracteres especiais da senha.

## 2. Preparar o repositório

Antes do deploy, confirme que o código está no GitHub e que o
[`render.yaml`](./render.yaml) está na raiz do backend. A branch conectada ao
Blueprint deve conter as migrations e o `package.json`.

## 3. Criar o serviço no Render

No painel do Render:

1. escolha **New → Blueprint**;
2. conecte o repositório;
3. selecione a branch desejada;
4. revise o serviço criado a partir do `render.yaml`;
5. preencha as variáveis marcadas como `sync: false`;
6. clique em **Apply** ou **Create**.

Configure:

| Variável | Conteúdo |
|---|---|
| `DATABASE_URL` | URL completa do banco Aiven |
| `DATABASE_HOST` | host informado pelo Aiven |
| `DATABASE_PORT` | porta informada pelo Aiven |
| `DATABASE_USER` | usuário do Aiven |
| `DATABASE_PASSWORD` | senha do Aiven |
| `DATABASE_NAME` | nome do banco |
| `DATABASE_SSL` | `true` |
| `CORS_ORIGINS` | origem do frontend, separada por vírgula |

O Render injeta `PORT`. O `JWT_SECRET` deve ser gerado pelo próprio ambiente ou
definido como um segredo forte; nunca reutilize a chave local.

## 4. Build e verificação

O deploy deve executar:

```text
prisma generate
prisma migrate deploy
```

Depois que o serviço iniciar, use a URL exibida pelo Render, por exemplo:

```text
https://api-ger-extensao-zcrp.onrender.com/health
```

A resposta esperada é:

```json
{ "status": "ok" }
```

A rota `/` não é uma página inicial. Um JSON `404` nela significa apenas que
não existe uma rota raiz.

## 5. Popular o banco remoto (opcional)

O deploy cria tabelas, mas não necessariamente registros de demonstração. Para
executar o seed sem atingir o MySQL local, abra uma nova janela PowerShell e
defina todas as variáveis antes do comando:

```powershell
cd C:\caminho\para\deppi_PWEBII\back
$env:DATABASE_HOST="mysql-exemplo.aivencloud.com"
$env:DATABASE_PORT="12345"
$env:DATABASE_USER="avnadmin"
$env:DATABASE_PASSWORD="sua-senha"
$env:DATABASE_NAME="defaultdb"
$env:DATABASE_SSL="true"
$env:DATABASE_URL="******mysql-exemplo.aivencloud.com:12345/defaultdb?sslaccept=accept_invalid_certs"
npx tsx prisma/seed.ts
```

Essas variáveis valem apenas para a janela atual. Antes de rodar migrations,
seed ou reset, confira no output do Prisma o host e banco exibidos. Eles devem
ser os do Aiven, nunca `localhost`.

## 6. Corrigir problemas comuns

### DNS não resolve o host

Teste outro resolvedor:

```powershell
nslookup mysql-exemplo.aivencloud.com 8.8.8.8
```

Se necessário, em PowerShell como Administrador, adicione temporariamente o IP
ao arquivo `hosts`:

```powershell
Add-Content -Path "$env:windir\System32\drivers\etc\hosts" -Value "IP_DO_AIVEN mysql-exemplo.aivencloud.com"
ipconfig /flushdns
```

O IP pode mudar; refaça a consulta quando o erro `ENOTFOUND` voltar.

### Coluna ou migration ausente

Somente se o banco remoto puder ser apagado e recriado, confira primeiro o
`Datasource` e então execute:

```powershell
npx prisma migrate reset --force
npx tsx prisma/seed.ts
```

Esse procedimento apaga todos os dados do banco apontado pelas variáveis atuais.

## 7. Frontend em produção

No frontend, configure `VITE_API_URL` com a URL real da API:

```env
VITE_API_URL=https://api-ger-extensao-zcrp.onrender.com
```

Inclua essa origem em `CORS_ORIGINS` no Render e faça um novo deploy do backend
se a origem mudar.

## 8. Limitações do plano gratuito

- o Render pode hibernar o serviço após um período sem tráfego;
- a primeira requisição depois da hibernação pode demorar;
- arquivos em `uploads/` não são persistentes em disco efêmero;
- use storage externo ou disco persistente para arquivos importantes.
