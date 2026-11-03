# Catálogo de rotas

Base local: `http://localhost:3000`.

Quando a coluna **Acesso** indicar JWT, envie:

```text
Authorization: Bearer <accessToken>
```

Papéis e permissões são verificados conforme o token do usuário.

## Saúde e arquivos

| Método | Caminho | Acesso | Finalidade |
|---|---|---|---|
| GET | `/health` | público | verifica se a API está disponível |
| GET | `/uploads/*` | público | entrega arquivo enviado |

## Autenticação

| Método | Caminho | Acesso | Finalidade |
|---|---|---|---|
| POST | `/autenticacao/registro` | público | cadastra aluno |
| POST | `/autenticacao/login` | público | retorna access e refresh token |
| POST | `/autenticacao/esqueci-senha` | público | inicia recuperação |
| POST | `/autenticacao/redefinir-senha` | público | redefine senha com token |
| POST | `/autenticacao/refresh` | público | renova access token |
| POST | `/autenticacao/logout` | público | revoga refresh token |
| GET | `/autenticacao/me` | JWT | retorna usuário autenticado |

## Perfil

| Método | Caminho | Acesso | Finalidade |
|---|---|---|---|
| GET | `/perfil` | JWT | consulta perfil do usuário |
| PATCH | `/perfil/aluno` | JWT | cria ou altera perfil de aluno |
| PATCH | `/perfil/foto` | JWT | recebe arquivo no campo `foto` |
| PATCH | `/perfil/telefone` | JWT | atualiza telefone |
| PATCH | `/perfil/endereco` | JWT | atualiza endereço |

## Cursos

`instituicaoId` é obtido a partir do usuário autenticado e não deve ser enviado
pelo cliente.

| Método | Caminho | Acesso | Finalidade |
|---|---|---|---|
| GET | `/cursos` | JWT | lista cursos; filtros: `status`, `tipo`, `tipoAcao` |
| GET | `/cursos/:id` | JWT | detalha um curso |
| POST | `/cursos` | JWT + DEPPI/PROFESSOR | cria curso |
| POST | `/cursos/:id/imagem` | JWT + DEPPI/PROFESSOR | upload no campo `imagem` |
| PATCH | `/cursos/:id` | JWT + DEPPI/PROFESSOR | altera curso; professor só altera o próprio |
| PATCH | `/cursos/:id/publicar` | JWT + DEPPI/PROFESSOR | muda de RASCUNHO para PUBLICADO |
| PATCH | `/cursos/:id/encerrar` | JWT + DEPPI/PROFESSOR | encerra curso publicado ou em andamento |
| PATCH | `/cursos/:id/close` | JWT + DEPPI/PROFESSOR | fecha inscrições |
| DELETE | `/cursos/:id` | JWT + DEPPI/PROFESSOR | cancela sem apagar o registro |

## Professor

| Método | Caminho | Acesso | Finalidade |
|---|---|---|---|
| GET | `/professor/perfil` | PROFESSOR | consulta perfil docente |
| PATCH | `/professor/perfil` | PROFESSOR | altera perfil docente |
| POST | `/professor/cursos` | PROFESSOR | cria curso |
| GET | `/professor/cursos` | PROFESSOR | lista cursos próprios |
| GET | `/professor/cursos/:id` | PROFESSOR | detalha curso próprio e inscrições |
| GET | `/professor/cursos/:id/inscricoes` | PROFESSOR | lista inscritos |

## Inscrições

| Método | Caminho | Permissão | Finalidade |
|---|---|---|---|
| POST | `/inscricao/registrar-inscricao` | `inscricao:create` | registra inscrição de aluno |
| GET | `/inscricao/minhas` | `inscricao:read` | lista inscrições do aluno |
| GET | `/inscricao/curso/:cursoId` | `inscricao:read` | lista inscrições do curso |
| PATCH | `/inscricao/:id/aprovar` | `inscricao:update` | aprova se houver vaga |
| PATCH | `/inscricao/:id/rejeitar` | `inscricao:update` | rejeita inscrição |
| PATCH | `/inscricao/:id/cancelar` | `inscricao:update` | cancela inscrição |

Alterações de status são transacionais e registradas em
`InscricaoHistorico`. Se uma inscrição aprovada for liberada, a próxima da
lista de espera pode ser promovida.

## Documentos

| Método | Caminho | Acesso | Finalidade |
|---|---|---|---|
| POST | `/inscricao-documentos/:id/documentos` | JWT com escopo | até 10 arquivos no campo `files` |
| GET | `/inscricao-documentos/:id/documentos` | JWT com escopo | lista documentos |
| GET | `/inscricao-documentos/:id/documentos/:documentoId/arquivo` | JWT com escopo | baixa documento |

O acesso é permitido a ADMIN/DEPPI, ao aluno dono da inscrição ou ao professor
dono do curso.

## DEPPI

| Método | Caminho | Permissão | Finalidade |
|---|---|---|---|
| GET | `/deppi` | `deppi:read` | lista usuários DEPPI |
| GET | `/deppi/:id` | `deppi:read` | consulta DEPPI |
| POST | `/deppi` | `deppi:create` | cadastra DEPPI e perfil servidor |
| PATCH | `/deppi/:id` | `deppi:update` | altera DEPPI |
| DELETE | `/deppi/:id` | `deppi:delete` | desativa DEPPI |

As operações são restritas ao ADMIN.

## Relatórios

Todas aceitam `?formato=json|xlsx|pdf`; o padrão é `json`.

| Método | Caminho | Permissão | Finalidade |
|---|---|---|---|
| GET | `/relatorios/courses` | `relatorio:read` | lista cursos |
| GET | `/relatorios/enrollments/:cursoId` | `relatorio:read` | lista inscritos |
| GET | `/relatorios/enrollments-by-status` | `relatorio:read` | agrupa inscrições por status |
| GET | `/relatorios/general` | `relatorio:read` | relatório consolidado |

## Instituições

| Método | Caminho | Permissão | Finalidade |
|---|---|---|---|
| GET | `/instituicoes` | `instituicao:read` | lista instituições |
| GET | `/instituicoes/:id` | `instituicao:read` | detalha instituição |
| POST | `/instituicoes` | `instituicao:create` | cria instituição |
| PATCH | `/instituicoes/:id` | `instituicao:update` | altera instituição |
| PATCH | `/instituicoes/:id/status` | `instituicao:update` | ativa ou desativa |
| DELETE | `/instituicoes/:id` | `instituicao:delete` | remove instituição |

## Usuários

| Método | Caminho | Permissão | Finalidade |
|---|---|---|---|
| GET | `/usuarios` | `usuario:read` | lista com filtros |
| GET | `/usuarios/:id` | `usuario:read` | detalha usuário |
| PATCH | `/usuarios/:id` | `usuario:update` | altera usuário |
| DELETE | `/usuarios/:id` | `usuario:delete` | remove usuário |

## Permissões

| Método | Caminho | Permissão | Finalidade |
|---|---|---|---|
| GET | `/permissoes/papeis` | `permissao:read` | lista papéis |
| GET | `/permissoes` | `permissao:read` | lista permissões |
| POST | `/permissoes` | `permissao:create` | cria permissão |
| POST | `/permissoes/usuarios/:userId/papeis` | `permissao:update` | vincula papel |
| DELETE | `/permissoes/usuarios/:userId/papeis/:papelId` | `permissao:update` | remove papel |
| POST | `/permissoes/papeis/:papelId/permissoes` | `permissao:update` | vincula permissão |
| DELETE | `/permissoes/papeis/:papelId/permissoes/:permissaoId` | `permissao:update` | remove permissão |

## Departamentos

| Método | Caminho | Permissão | Finalidade |
|---|---|---|---|
| GET | `/departamentos` | `departamento:read` | lista departamentos |
| GET | `/departamentos/:id` | `departamento:read` | detalha departamento |
| POST | `/departamentos` | `departamento:create` | cria departamento |
| PATCH | `/departamentos/:id` | `departamento:update` | altera departamento |
| DELETE | `/departamentos/:id` | `departamento:delete` | remove departamento |
