# Sistema de Controle de Chamados — Backend

API para cadastrar, consultar e acompanhar chamados internos, persistir os dados e distribuir atendimentos entre responsáveis.

> Local deste documento no repositório: `api/README_backend.md`. A instalação da interface está documentada no README da pasta `frontend/`.

## Sobre o projeto

O Sistema de Controle de Chamados centraliza solicitações internas e permite acompanhar seu atendimento. A API mantém os chamados e os responsáveis, recebe as operações do frontend e aplica as regras de negócio.

O objetivo da distribuição automática é atribuir um novo chamado ao responsável com a menor quantidade de atendimentos ainda não concluídos. O usuário também pode selecionar o responsável manualmente.

## Funcionalidades

- Cadastro, listagem, consulta por ID e nome, edição e exclusão de chamados.
- Alteração de prioridade, status e responsável.
- Listagem paginada de chamados e responsáveis.
- Consulta de um responsável por ID.
- Persistência em SQLite por meio do Prisma.
- População inicial de pelo menos três responsáveis via seed.
- Atribuição manual e opção de distribuição automática de chamados.

## Tecnologias utilizadas

| Tecnologia | Utilização |
| --- | --- |
| Node.js | Executar a aplicação no servidor. |
| TypeScript | Tipar os dados e organizar o desenvolvimento da API. |
| Express | Definir rotas HTTP, receber requisições e retornar respostas. |
| Prisma ORM e Prisma Client | Modelar os dados e executar operações no banco. |
| `@prisma/adapter-better-sqlite3` | Conectar o Prisma ao SQLite pela implementação `better-sqlite3`. |
| SQLite | Persistir os dados em um arquivo local. |
| Zod | Validar os dados recebidos pela API. |
| dotenv | Carregar variáveis de ambiente. |

As versões exatas e as ferramentas de execução do TypeScript devem ser consultadas no `api/package.json` e no arquivo de lock do projeto.

## Arquitetura

A API segue uma arquitetura em camadas, ou **Layered Architecture**, com separação entre transporte HTTP, regras de negócio e persistência.

| Parte | Responsabilidade |
| --- | --- |
| Rotas | Associar URL e método HTTP ao controller correspondente. |
| Controllers | Receber a requisição, encaminhar os dados e produzir a resposta HTTP. |
| Validadores | Conferir formato, campos obrigatórios e valores permitidos. |
| Services | Aplicar regras de negócio e coordenar as operações. |
| Repositories | Concentrar as consultas e alterações de persistência. |
| Configuração do Prisma | Criar e disponibilizar o cliente de acesso ao banco. |
| `app.ts` | Compor a aplicação Express, seus middlewares e suas rotas. |
| `server.ts` | Inicializar a aplicação e escutar a porta configurada. |

Uma operação de criação chega pela rota, é tratada pelo controller e passa pelo service. O service aplica a regra de atribuição e utiliza os repositories para consultar os responsáveis e salvar o chamado.

A distribuição automática pertence ao backend porque precisa utilizar os dados persistidos e funcionar também para requisições feitas diretamente à API.

O cliente Prisma informado no projeto está em `api/src/config/prisma.ts`, e o schema está em `api/prisma/schema.prisma`.

## Pré-requisitos

- Node.js e npm compatíveis com as dependências do backend. Node.js 24 LTS é a opção sugerida para padronizar o ambiente com o frontend; consulte as [versões do Node.js](https://nodejs.org/en/about/previous-releases).
- Git, caso o projeto seja obtido por clonagem.
- Permissão de leitura e escrita na pasta do banco SQLite.
- Opcionalmente, Postman ou Thunder Client para executar o roteiro manual da API.

```bash
node --version //v22.15.1
npm --version //10.9.2
```

O SQLite não exige a instalação de um servidor de banco separado para essa configuração.


## Instalação

Obtenha o repositório pela opção **Code** do GitHub, clonando a URL apresentada ou baixando e extraindo o ZIP. Abra um terminal na raiz do projeto e acesse a API:

```bash
cd api
```

Se o repositório contém `api/package-lock.json`, instale as dependências com:

```bash
npm ci
```

Se o projeto ainda não possui esse arquivo, use `npm install` e mantenha o lock gerado no repositório para tornar as próximas instalações reproduzíveis.

Todos os comandos seguintes devem ser executados dentro de `api/`, salvo indicação explícita.

## Configuração do .env

Crie o arquivo `api/.env`, ao lado do `package.json`. Utilize a configuração local informada para o projeto:

```dotenv
DATABASE_URL="file:./tickets.db"
PORT=3000
API_URL="http://localhost:3000"
```

| Variável | Finalidade |
| --- | --- |
| `DATABASE_URL` | Identificar o banco SQLite utilizado pela configuração do Prisma. |
| `PORT` | Definir a porta em que o servidor HTTP será iniciado. |
| `API_URL` | Endereço da API informado no ambiente do projeto. sua existência não configura o frontend nem o CORS automaticamente. |

O frontend possui seu próprio `.env`, com `VITE_API_URL`. Quando a porta da API mudar, atualize o endereço utilizado pelo frontend.

Para facilitar a instalação por outras pessoas, mantenha um `api/.env.example` com as variáveis necessárias e valores locais de exemplo, sem dados privados.

## Configuração do banco de dados

### Localização do arquivo

O banco informado para este projeto é `api/prisma/tickets.db`, ao lado de `schema.prisma`.

Na configuração compartilhada, o adapter em `src/config/prisma.ts` retira o prefixo `file:./` e resolve o nome do banco a partir de `process.cwd()` e da pasta `prisma`. Por isso, a API e os comandos devem ser executados a partir de `api/`.

A CLI do Prisma, o Prisma Studio, o seed e a aplicação precisam apontar para o mesmo arquivo físico. Um caminho relativo interpretado a partir de outra pasta pode abrir ou criar um banco diferente.

### Criando a estrutura e gerando o cliente

Para aplicar as migrations já existentes em um banco local novo:

```bash
npx prisma migrate deploy
```

Em seguida, gere o Prisma Client:

```bash
npx prisma generate
```

### Populando os responsáveis

O seed compartilhado cria os seguintes responsáveis:

| Nome |
| --- |
| Suporte - Victor[TI] |
| Suporte - Yhasmin[Compras] |
| Suporte - Rafael[Infraestrutura] |

Esses valores pertencem ao campo `name`; o frontend os exibe como nomes completos, sem criar um campo adicional de setor.

Para popular o banco com seed de `prisma/seed.ts`, execute:

```bash
npx prisma db seed
```

### Conferindo o banco

Com a configuração da CLI resolvida, abra o Prisma Studio:

```bash
npx prisma studio
```

Confirme que existem pelo menos três responsáveis. Os IDs dos exemplos de respostas não precisam coincidir com os IDs gerados em uma instalação nova.

## Executando o projeto

Após instalar as dependências, configurar o `.env`, preparar o banco e executar o seed, inicie o backend dentro de `api/`:

```bash
npm run dev
```

Com `PORT=3000`, consulte [http://localhost:3000/responsibles](http://localhost:3000/responsibles) para verificar se a API responde e os responsáveis foram carregados.

Em seguida, inicie o frontend em outro terminal seguindo as instruções da pasta `frontend/`.

### Comunicação com o frontend

A API deve aceitar requisições da origem utilizada pelo Vite, normalmente `http://localhost:5173`. Confira a configuração de CORS, os métodos `GET`, `POST`, `PATCH` e `DELETE`, o cabeçalho `Content-Type` e o tratamento das requisições de preflight.

## Endpoints

| Método | Rota | Finalidade |
| --- | --- | --- |
| `POST` | `/tickets` | Criar um chamado. |
| `GET` | `/tickets` | Listar chamados com paginação. |
| `GET` | `/tickets/:id` | Consultar um chamado por ID. |
| `PATCH` | `/tickets/:id` | Atualizar campos de um chamado. |
| `DELETE` | `/tickets/:id` | Excluir um chamado. |
| `GET` | `/responsibles` | Listar responsáveis com paginação. |
| `GET` | `/responsibles/:id` | Consultar um responsável por ID. |

### Paginação

Exemplo de consulta:

```http
GET /tickets?page=1&limit=10
```

| Parâmetro | Uso |
| --- | --- |
| `page` | Número da página solicitada, começando em 1. |
| `limit` | Quantidade de itens solicitada por página. |

Os exemplos fornecidos retornam páginas de dez itens. O frontend solicita `limit=100` e percorre as páginas indicadas pela resposta.

### Campos de um chamado

| Campo | Descrição |
| --- | --- |
| `id` | Identificador do chamado. |
| `title` | Resumo da solicitação. |
| `description` | Detalhamento da solicitação. |
| `priority` | `LOW`, `MEDIUM` ou `HIGH`. |
| `status` | `OPEN`, `IN_PROGRESS`, `RESOLVED` ou `CLOSED`, conforme o contrato usado pelo frontend. |
| `responsibleId` | Identificador do responsável atribuído. |
| `createdAt` | Data e hora de abertura. |
| `updatedAt` | Data e hora da última atualização. |

Os campos de identificação e datas são retornados pela API e não são preenchidos pelo formulário de criação.

### Criando com atribuição manual

Envie `POST /tickets` com `Content-Type: application/json`. Substitua o valor de `responsibleId` pelo ID de um registro retornado por `GET /responsibles`:

```json
{
  "title": "Impressora não imprime",
  "description": "A impressora não conclui os trabalhos enviados.",
  "priority": "LOW",
  "responsibleId": "SUBSTITUA_PELO_ID_DE_UM_RESPONSAVEL"
}
```

Resposta de sucesso documentada:

```json
{
  "state": "success",
  "message": "Ticket successfully created"
}
```

Essa resposta não contém o chamado criado. Consulte a listagem para localizar o registro e obter seu ID.

### Criando com atribuição automática

O frontend envia o mesmo cadastro sem `responsibleId`:

```json
{
  "title": "Computador travando",
  "description": "O computador trava ao abrir os programas de trabalho.",
  "priority": "HIGH"
}
```

A omissão de `responsibleId` é a convenção implementada no frontend. O validator e o service da API devem aceitar esse formato e realizar a atribuição automática.

### Atualizando e fechando

Exemplo utilizado pelo frontend para alterar o status, enviado para `PATCH /tickets/:id`:

```json
{
  "status": "IN_PROGRESS"
}
```

Para fechar, o frontend envia `{"status":"CLOSED"}` ao mesmo endpoint. O fechamento altera o status e mantém o chamado para consulta. A exclusão é solicitada separadamente por `DELETE /tickets/:id`.

### Formato das respostas

| Operação | Dados documentados |
| --- | --- |
| Listar chamados | `response.tickets` e `response.pagination`, com `page`, `limit`, `totalTickets` e `totalPages`. |
| Listar responsáveis | `response.responsibles` e `response.pagination`, com `page`, `limit`, `totalresponsibles` e `totalPages`. |
| Consultar por ID | O objeto consultado em `response`. |
| Criar, editar ou excluir | `state` e `message`, sem objeto de retorno nos exemplos fornecidos. |

O contrato utiliza `"success"` e `totalresponsibles` exatamente com essas grafias. Alterações nesses nomes devem ser coordenadas com os consumidores da API.

## Regras de negócio

### Status considerados "em aberto"

A definição usada pelo frontend para carga de trabalho é:

| Status | Significado | Conta para a distribuição? |
| --- | --- | --- |
| `OPEN` | Aguardando início do atendimento. | Sim. |
| `IN_PROGRESS` | Atendimento iniciado e ainda não concluído. | Sim. |
| `RESOLVED` | Solicitação resolvida. | Não. |
| `CLOSED` | Chamado encerrado. | Não. |

Justificativa: chamados em andamento ainda ocupam o responsável. Chamados resolvidos ou fechados permanecem como registros, mas não representam atendimento pendente.

### Roteiro de teste manual da API

Utilize Postman ou Thunder Client, com base em `http://localhost:3000`. Para `POST` e `PATCH`, selecione corpo JSON. Utilize IDs obtidos na sua instalação e dados criados para teste.

| Etapa | Ação | Resultado esperado |
| --- | --- | --- |
| 1 | Consultar `GET /responsibles`. | Retornar pelo menos três responsáveis. |
| 2 | Criar um chamado com um responsável existente. | Persistir o chamado vinculado ao ID escolhido. |
| 3 | Consultar a lista e depois `GET /tickets/:id`. | Localizar o chamado e conferir campos, responsável e datas. |
| 4 | Editar campos e status com `PATCH`. | Persistir as alterações e manter a data de abertura. |
| 5 | Criar um chamado sem `responsibleId`. | Atribuir ao responsável com menor carga ativa. |
| 6 | Criar uma situação de empate. | Aplicar o critério documentado, incluindo o caso de todos estarem sem chamados ativos. |
| 7 | Resolver ou fechar um chamado ativo. | Retirá-lo da contagem de carga, mantendo-o consultável. |
| 8 | Consultar páginas diferentes com `page` e `limit`. | Retornar as páginas e os metadados de paginação coerentes. |
| 9 | Enviar título vazio, prioridade inválida e responsável inexistente. | Rejeitar dados inválidos sem persistir um chamado inconsistente. |
| 10 | Consultar ou alterar um ID inexistente. | Retornar um erro tratado, conforme o contrato de erros da API. |
| 11 | Excluir um chamado criado para teste. | Remover o chamado das consultas normais e atualizar a carga se ele estava ativo. |
| 12 | Reiniciar a API e consultar os dados novamente. | Preservar os registros no mesmo banco. |


### Distribuição automática

O comportamento exigido pelo projeto é:

1. Receber uma criação com atribuição automática.
2. Consultar os responsáveis existentes, incluindo os que possuem zero chamados ativos.
3. Contar, para cada responsável, os chamados em `OPEN` ou `IN_PROGRESS`.
4. Selecionar quem possui a menor contagem e aplicar o critério de desempate, quando necessário.
5. Salvar o chamado vinculado ao responsável escolhido.

A prioridade do novo chamado não altera essa contagem. A regra do desafio utiliza quantidade de chamados pendentes, não uma estimativa de duração ou peso por prioridade.

Na atribuição manual, o ID informado pelo usuário determina o responsável. A API precisa validar se esse responsável existe.

### Responsáveis e persistência

- Devem existir pelo menos três responsáveis para a demonstração do sistema.
- O seed prepara esses registros; o desafio não exige uma tela completa de cadastro de responsáveis.
- Cada chamado salvo deve possuir um responsável definido, inclusive quando a atribuição é automática.
- `updatedAt` registra a última atualização; um histórico completo de alterações exige persistência adicional e não faz parte do contrato atual.

## Decisões técnicas

### Por que Node.js e TypeScript

A escolha prioriza a stack com a qual tenho maior familiaridade, permitindo concentrar o esforço nos requisitos, na organização e na qualidade da implementação. Node.js atende à construção da API HTTP e TypeScript permite utilizar uma linguagem comum com o frontend.

A tipagem ajuda a identificar inconsistências durante o desenvolvimento. Como os tipos não validam automaticamente requisições recebidas em tempo de execução, os dados de entrada são tratados pelos validadores da API.

### Por que arquitetura em camadas

A separação entre controllers, services e repositories distingue o transporte HTTP das regras e do acesso ao banco. Isso facilita localizar alterações, testar a distribuição sem depender da interface e evitar consultas espalhadas por diferentes controllers.

Para uma aplicação pequena, a divisão acrescenta arquivos e funções intermediárias. O benefício esperado é manter as responsabilidades claras sem introduzir uma estrutura mais extensa do que o desafio precisa.

### Por que Prisma e SQLite

O Prisma concentra a modelagem e o acesso tipado aos dados. O SQLite permite executar o desafio localmente com um arquivo de banco, simplificando a preparação do ambiente de avaliação.

### Trade-offs realizados

| Escolha | Benefício | Limitação ou consequência |
| --- | --- | --- |
| SQLite local | Simplifica instalação e demonstração. | Escritas concorrentes e operação em múltiplas instâncias exigem outra avaliação de persistência. |
| API separada do frontend | Explicita o contrato HTTP e permite testar os endpoints isoladamente. | Exige iniciar dois processos e manter URLs, contratos e CORS alinhados. |
| Responsáveis previamente cadastrados | Atende ao conjunto mínimo de pessoas selecionáveis. | A administração completa desses cadastros fica fora da interface atual. |
| Balanceamento por quantidade ativa | Oferece uma regra objetiva e fácil de demonstrar. | Não considera complexidade, duração estimada ou especialidade de cada atendimento. |
| Datas de criação e atualização | Registram abertura e última alteração. | Não substituem uma trilha completa de auditoria. |

## Solução de problemas

| Problema | O que verificar |
| --- | --- |
| Servidor mostra porta `undefined` | Se `api/.env` existe, contém `PORT` e é carregado antes da inicialização do servidor. |
| Prisma Studio mostra um banco diferente do utilizado pela API | A resolução de `DATABASE_URL` na CLI e no adapter, conferindo o arquivo físico `api/prisma/tickets.db`. |
| Tabelas inexistentes | Se as migrations foram aplicadas no mesmo banco acessado pela aplicação. |
| Prisma Client ausente ou desatualizado | Execute o comando de geração com a configuração correta do projeto. |
| Seed falha por valor único já existente | Verifique se os responsáveis já foram inseridos. Não apague dados apenas para repetir o seed. |
| `prisma db seed` informa que não há comando configurado | Confira o registro do seed na configuração do Prisma ou o script efetivamente utilizado pelo projeto. |
| API responde no Postman, mas o frontend falha | Confira a URL base e a configuração de CORS para a origem do navegador. |
| Chamados são atribuídos de forma inesperada | Confira os status contados, a participação de responsáveis com carga zero e a regra de desempate. |

## Referências e bibliotecas utilizadas

- [Node.js](https://nodejs.org/en/docs) — ambiente de execução.
- [TypeScript](https://www.typescriptlang.org/docs/) — tipagem e configuração.
- [Express](https://expressjs.com/) — rotas e aplicação HTTP.
- [Prisma](https://www.prisma.io/docs/) — ORM e cliente de acesso ao banco.
- [Prisma Migrate](https://www.prisma.io/docs/orm/prisma-migrate/workflows/development-and-production) — migrations.
- [Seed no Prisma](https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding) — população inicial.
- [SQLite](https://www.sqlite.org/docs.html) — persistência local.
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) — biblioteca utilizada pelo adapter SQLite.
- [Zod](https://zod.dev/) — validação dos dados de entrada.
- [dotenv](https://github.com/motdotla/dotenv) — configuração de ambiente.
