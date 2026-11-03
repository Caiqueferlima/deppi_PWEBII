# Dados de demonstração do seed

O seed prepara uma base completa para testar login, perfis, cursos, inscrições,
relatórios e permissões.

## Como executar

Na pasta `back`, com o banco configurado:

```powershell
npx prisma generate
npx tsx prisma/seed.ts
```

Também é possível usar `npx prisma db seed` quando o Prisma estiver configurado
para chamar o seed. A execução deve ocorrer somente no banco de desenvolvimento
ou em um banco de teste.

## Conta e instituição

### Instituição

| Nome | Sigla | Endereço |
|---|---|---|
| IFCE Campus Cedro | `IFCE-CED` | Alameda José Quintino, s/n - Prado |

### Usuários

| Nome | E-mail | Senha | Papel |
|---|---|---|---|
| Administrador | `admin@ifce.edu.br` | `admin123` | ADMIN |
| Membro DEPPI | `deppi@ifce.edu.br` | `deppi123` | DEPPI |
| Professor Teste | `professor@ifce.edu.br` | `professor123` | PROFESSOR |
| Aluno Teste | `aluno@ifce.edu.br` | `aluno123` | ALUNO |

## RBAC inicial

O seed cadastra 22 permissões:

| Recurso | Ações |
|---|---|
| `aluno` | create, read, update, delete |
| `professor` | create, read, update, delete |
| `deppi` | create, read, update, delete |
| `curso` | create, read, update, delete |
| `inscricao` | create, read, update, delete |
| `relatorio` | create, read |

### Permissões por perfil

- **ALUNO:** lê cursos, cria inscrição e consulta suas inscrições.
- **PROFESSOR:** cria e lê cursos, edita o próprio curso e consulta suas inscrições.
- **DEPPI:** administra professores, consulta e altera cursos, acompanha inscrições,
  lista alunos e gera/consulta relatórios.
- **ADMIN:** recebe todas as 22 permissões.

## Perfis criados

### Aluno

| Campo | Valor |
|---|---|
| Matrícula | `20241001` |
| Graduação | Análise e Desenvolvimento de Sistemas |
| Semestre | 3 |
| Escolaridade | Ensino Médio Completo |
| Profissão | Estudante |
| Renda per capita | `ATE_MEIO_SM` |
| Pessoas na família | 4 |
| Telefone | (88) 99999-0001 |

### Servidor DEPPI

| Campo | Valor |
|---|---|
| SIAPE | `1234567` |
| Matrícula | `SRV-001` |
| Setor | DEPPI |
| Lotação | IFCE-CED |
| Situação | ATIVO |
| Regime | DEDICACAO_EXCLUSIVA |
| Jornada | INTEGRAL |
| Cargo | Técnico Administrativo em Educação |
| Início no serviço público | 01/03/2015 |
| Posse na instituição | 10/01/2016 |

### Servidor professor

| Campo | Valor |
|---|---|
| SIAPE | `7654321` |
| Matrícula | `SRV-002` |
| Setor | Coord. de Informática |
| Lotação | IFCE-CED |
| Situação | ATIVO |
| Regime | DEDICACAO_EXCLUSIVA |
| Jornada | INTEGRAL |
| Cargo | Professor do Ensino Básico, Técnico e Tecnológico |
| Início no serviço público | 01/08/2012 |
| Posse na instituição | 05/02/2013 |

### Perfil acadêmico do professor

| Campo | Valor |
|---|---|
| Titulação | Mestre |
| Departamento | Tecnologia da Informação |
| NCE | `NCE-TI-001` |
| Disciplina de ingresso | Estruturas de Dados |

## Curso e dados relacionados

O curso demonstrativo é:

| Campo | Valor |
|---|---|
| ID | `80770483-11e7-4145-ba20-f8b94139c294` |
| Título | Introdução à Programação com Python |
| Tipo de ação | CURSO |
| Tipo | FORMACAO_CONTINUADA |
| Área | Tecnologia e Produção |
| Linha | Desenvolvimento Tecnológico |
| Local | URBANO |
| Oferta | PRESENCIAL |
| Status | PUBLICADO |
| Carga horária | 40h |
| Período | 05/08/2024 a 30/09/2024 |
| Vagas | mínimo 10, máximo 30 |
| Fomento | Recursos próprios IFCE |
| Programa | Programa de Extensão Tecnológica |
| Município | Cedro |
| Avaliação | PARTICIPACAO |
| Divulgação | REDES_SOCIAIS |
| Atividade | MINICURSO |

Também são criados:

- membro da equipe: `professor@ifce.edu.br`, coordenador, docente IFCE, oito
  horas semanais, de 05/08/2024 a 30/09/2024, sem bolsa;
- item de orçamento `MATERIAL_CONSUMO` no valor de R$ 500,00;
- parceria com a Prefeitura Municipal de Cedro, formalizada por Termo de
  Cooperação `TC-2024-001`.

## Inscrição e relatório

O aluno `aluno@ifce.edu.br` é inscrito no curso e sua inscrição fica
`APROVADA`. O histórico registra a transição de `PENDENTE` para `APROVADA`,
com aprovação manual realizada por `deppi@ifce.edu.br`.

O seed ainda cria um relatório:

| Campo | Valor |
|---|---|
| ID | `2c6dd88e-ff9e-484a-820c-840d97d44d3a` |
| Tipo | `inscricoes_por_curso` |
| Parâmetros | `{ cursoId, periodo: "2024-S2" }` |
| Gerado por | `deppi@ifce.edu.br` |

Esses registros permitem testar rapidamente os endpoints de login, perfil,
curso, inscrição e relatórios descritos em [`rotas.md`](./rotas.md).
