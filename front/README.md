# Frontend — DEPPI PWEB II

Interface web do sistema DEPPI PWEB II, construída com React, TypeScript e
Vite. O frontend consome a API disponível em `back/`.

## Tecnologias

- React;
- TypeScript;
- Vite;
- React Router;
- Tailwind CSS;
- ESLint.

## Pré-requisitos

- Node.js em versão LTS;
- backend executando, caso queira testar login e chamadas à API;
- Git, caso o projeto ainda não esteja clonado.

## Instalação

Na pasta do frontend:

```powershell
cd C:\Users\Think\Desktop\PWEBII\deppi_PWEBII\front
npm install
```

## Configuração da API

Crie `front\.env` copiando
[`.env.example`](./.env.example). O arquivo deve conter a URL base da API:

```env
# URL base da API usada pelo frontend durante o desenvolvimento.
VITE_API_URL=http://localhost:3000
```

O Vite carrega variáveis públicas com o prefixo `VITE_`. Depois de alterar o
`.env`, reinicie o servidor de desenvolvimento.

## Desenvolvimento

Inicie o frontend:

```powershell
npm run dev
```

Abra a URL exibida pelo Vite, normalmente:

<http://localhost:5173>

Para a autenticação funcionar, mantenha a API executando em
<http://localhost:3000>. O backend pode ser iniciado em outro terminal:

```powershell
cd C:\Users\Think\Desktop\PWEBII\deppi_PWEBII\back
npm run dev
```

## Testar o login

Com banco, seed, backend e frontend ativos, use uma conta criada pelo seed:

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | `admin@ifce.edu.br` | `admin123` |
| DEPPI | `deppi@ifce.edu.br` | `deppi123` |
| Professor | `professor@ifce.edu.br` | `professor123` |
| Aluno | `aluno@ifce.edu.br` | `aluno123` |

Essas credenciais são somente para desenvolvimento local.

## Comandos disponíveis

| Comando | Finalidade |
|---|---|
| `npm run dev` | inicia o servidor de desenvolvimento com HMR |
| `npm run check` | verifica tipos com TypeScript |
| `npm run lint` | executa o ESLint |
| `npm run build` | verifica tipos e gera `dist/` |
| `npm run preview` | serve o build localmente |

Antes de enviar alterações, execute:

```powershell
npm run check
npm run lint
npm run build
```

## Build e preview

Gere uma versão de produção:

```powershell
npm run build
```

O resultado fica em `dist/`. Para visualizar esse resultado localmente:

```powershell
npm run preview
```

O preview não substitui o backend; ele apenas serve os arquivos já compilados.

## Estrutura principal

```text
src/
├── App.tsx              # componente principal e rotas da interface
├── main.tsx             # ponto de entrada do React
├── components/          # componentes reutilizáveis
├── pages/               # páginas da aplicação
├── services/            # chamadas para a API
├── config/api.ts        # URL base da API
├── types/               # tipos compartilhados
├── App.css              # estilos do app
└── index.css            # estilos globais

public/                  # arquivos públicos estáticos
```

As chamadas de autenticação ficam em `src/services/`, e a URL é lida de
`import.meta.env.VITE_API_URL`.

## Problemas comuns

### A página abre, mas o login falha

Confirme:

1. o backend está ativo em `http://localhost:3000`;
2. o endpoint `http://localhost:3000/health` retorna status `ok`;
3. `front\.env` contém `VITE_API_URL=http://localhost:3000`;
4. o frontend foi reiniciado depois da alteração do `.env`.

### Erro de CORS

Verifique a configuração `CORS_ORIGINS` no backend. Em desenvolvimento local,
deixá-la vazia permite a origem do Vite.

### Porta 5173 ocupada

O Vite exibirá outra porta disponível no terminal. Use a URL informada pelo
comando `npm run dev`.

## Documentação relacionada

- [Guia principal](../README.md);
- [Documentação da API](../back/README.md);
- [Rotas da API](../back/docs/rotas.md);
- [Guia de contribuição](../CONTRIBUTING.md).
