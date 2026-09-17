# Sistema de Controle de Chamados — Frontend

Interface web para cadastrar, consultar e acompanhar chamados internos, desenvolvida para o desafio técnico da Codificar.

> Local deste documento no repositório: `frontend/README.md`. A configuração da API e do banco está documentada no README da pasta `api/`.

## Sobre o projeto

O sistema centraliza solicitações internas que precisam de atendimento. Cada chamado possui título, descrição, prioridade, status, responsável e datas de abertura e atualização.

O frontend permite acompanhar os chamados, escolher um responsável manualmente ou solicitar a atribuição automática ao backend. A interface foi construída a partir do protótipo do projeto no Figma.

## Funcionalidades

- Dashboard com indicadores, os cinco chamados mais recentes e gráfico por status.
- Listagem de chamados com busca por título, filtros combinados, ordenação e paginação de dez itens.
- Modais para criar, visualizar, editar, fechar e excluir chamados.
- Seleção manual de responsável e opção de atribuição automática na criação.
- Consulta de responsáveis, com busca por nome e filtro de disponibilidade.
- Mensagens de sucesso e erro, confirmação de ações e estados de carregamento e lista vazia.
- Navegação entre telas sem recarregar a página.
- Layout adaptável e tabelas com rolagem horizontal em telas menores.

## Tecnologias utilizadas

| Tecnologia | Utilização |
| --- | --- |
| React 19 e React DOM | Componentes, estado da interface e renderização no navegador. |
| TypeScript 6 | Tipagem de componentes, chamados, responsáveis e contratos da API. |
| Vite 8 e `@vitejs/plugin-react` | Ambiente de desenvolvimento e geração do build. |
| Tailwind CSS 4 e `@tailwindcss/vite` | Estilização com utilitários e cores personalizadas. |
| CSS | Estilos de layout, componentes e adaptação de telas. |
| Fetch API | Requisições HTTP ao backend. |
| ESLint 10 e plugins de TypeScript/React | Análise estática do código. |
| Inter | Fonte servida pelos arquivos locais do projeto. |

As faixas de versões estão no `package.json`; o `package-lock.json` registra as versões resolvidas para instalação com `npm ci`.

## Arquitetura

A aplicação é uma SPA, organizada por responsabilidades. As páginas compõem a interface, os componentes encapsulam partes reutilizáveis e os serviços concentram a comunicação HTTP.

| Local | Responsabilidade |
| --- | --- |
| `src/main.tsx` | Inicializar o React e carregar os estilos. |
| `src/App.tsx` | Coordenar navegação, modais e operações de alteração. |
| `src/pages/` | Telas de Dashboard, Chamados e Responsáveis. |
| `src/components/layout/` | Estrutura da aplicação, cabeçalho e navegação. |
| `src/components/ui/` | Botões, campos, modais, notificações, indicadores e paginação. |
| `src/components/tickets/` | Formulário, detalhes e indicadores visuais específicos de chamados. |
| `src/hooks/useHelpdesk.ts` | Carregar chamados e responsáveis e atualizar as coleções. |
| `src/services/` | Cliente HTTP e operações da API. |
| `src/types/` | Tipos dos dados e das respostas. |
| `src/utils/tickets.ts` | Rótulos, formatação de datas, normalização de busca e identificação de chamados ativos. |
| `src/index.css` | Tema, fonte, estilos e regras de adaptação da interface. |
| `public/assets/` | Ícones, fonte e licença da fonte. |

O hook `useHelpdesk` percorre todas as páginas das duas coleções e remove duplicidades por ID. Assim, filtros e indicadores utilizam o conjunto carregado completo. Após uma criação, edição, fechamento ou exclusão, os dados são consultados novamente na API.

A navegação utiliza fragmentos de URL: `#/home`, `#/tickets` e `#/responsibles`, com suporte aos botões voltar e avançar do navegador.

## Pré-requisitos

- Node.js 24 LTS como ambiente recomendado. Consulte as [versões do Node.js](https://nodejs.org/en/about/previous-releases).
- npm, incluído na instalação do Node.js.
- Git, caso a obtenção do projeto seja feita por clonagem.
- Navegador atualizado.
- Backend configurado e em execução, com o banco populado com pelo menos três responsáveis.

Confira a instalação:

```bash
node --version
npm --version
```

## Instalação

Obtenha o repositório pela opção **Code** do GitHub, clonando a URL apresentada ou baixando o ZIP. Extraia o ZIP, se necessário, e abra um terminal na raiz do projeto.

```bash
cd frontend
npm ci
```

O comando `npm ci` utiliza o arquivo de lock existente. Todos os comandos das próximas seções devem ser executados dentro de `frontend/`.

## Configuração do .env

Copie o arquivo `.env.example` para `.env` dentro da pasta `frontend/`.

No PowerShell:

```powershell
Copy-Item .env.example .env
```

No Linux, macOS ou Git Bash:

```bash
cp .env.example .env
```

Conteúdo para execução local:

```dotenv
VITE_API_URL=http://localhost:3000
```

| Variável | Descrição |
| --- | --- |
| `VITE_API_URL` | URL base da API. As rotas, como `/tickets`, são acrescentadas pelos serviços. |

O cliente em `src/services/api.ts` utiliza `http://localhost:3000` como alternativa quando a variável não é informada. Se a API usar um prefixo global, inclua-o na URL base, por exemplo `http://localhost:3000/api`.

Reinicie o Vite após alterar o `.env`. As variáveis com prefixo `VITE_` ficam disponíveis no código enviado ao navegador; use-as para configurações públicas, como a URL da API. Consulte a [documentação de variáveis do Vite](https://vite.dev/guide/env-and-mode).

## Configuração do banco de dados

O banco é configurado exclusivamente no backend, na pasta `api/`. O frontend acessa os dados por HTTP e não abre o arquivo SQLite diretamente.

Antes de utilizar a interface, siga no README do backend os passos para configurar o `.env`, criar a estrutura do banco e executar o seed de responsáveis.

## Executando o projeto

1. Em um terminal, inicie a API seguindo as instruções da pasta `api/`.
2. Em outro terminal, dentro de `frontend/`, execute:

```bash
npm run dev
```

3. Abra o endereço apresentado pelo Vite, normalmente [http://localhost:5173](http://localhost:5173). Se a porta estiver ocupada, utilize a URL efetivamente exibida no terminal. Veja o [guia do Vite](https://vite.dev/guide/).

A API precisa permitir a origem da interface no CORS. Considere a porta efetivamente utilizada pelo navegador, os métodos `GET`, `POST`, `PATCH` e `DELETE` e o cabeçalho `Content-Type`.

### Gerando e visualizando o build

```bash
npm run build
npm run preview OU npm run preview -- --port 5173 --strictPort
```

O build verifica o TypeScript e gera os arquivos em `dist/`. O preview permite conferir esse resultado localmente; abra a URL informada pelo comando. A API deve continuar em execução.

### Scripts disponíveis

| Comando | Função |
| --- | --- |
| `npm run dev` | Iniciar o servidor de desenvolvimento do Vite. |
| `npm run build` | Executar `tsc -b` e gerar o build com Vite. |
| `npm run lint` | Executar o ESLint. |
| `npm run preview` | Servir o build para conferência local. |

## Como utilizar

| Ação | Passos |
| --- | --- |
| Abrir um chamado | Acesse **Chamados**, clique em **Novo chamado**, preencha título, descrição e prioridade e escolha a atribuição. Confirme em **Criar chamado**. |
| Atribuir automaticamente | Na criação, mantenha **Automático (menos chamados)** no campo de responsável. O backend decide quem receberá o chamado. |
| Atribuir manualmente | Selecione um dos responsáveis existentes no formulário. |
| Consultar detalhes | Clique no título do chamado. O modal consulta novamente os dados pelo ID. |
| Editar | Use a ação de edição na lista ou o botão **Editar** nos detalhes. Altere os campos desejados e salve. |
| Fechar | Nos detalhes, clique em **Fechar chamado** e confirme. O status passa para `CLOSED`. |
| Excluir | Use a ação de exclusão na lista e confirme. Para apenas encerrar o atendimento e manter o registro, utilize o fechamento. |
| Localizar chamados | Combine busca por título e filtros de responsável, status e prioridade. Ordene por data ou título. |
| Acompanhar a equipe | Acesse **Responsáveis** e utilize a busca por nome e o filtro de disponibilidade. |

Na edição, é possível alterar o responsável manualmente. A opção de atribuição automática está disponível no formulário de criação.

## Integração com a API

| Método | Rota | Finalidade |
| --- | --- | --- |
| `GET` | `/tickets?page=1&limit=100` | Carregar uma página de chamados. |
| `GET` | `/tickets/:id` | Consultar os detalhes de um chamado. |
| `POST` | `/tickets` | Criar um chamado. |
| `PATCH` | `/tickets/:id` | Editar campos ou alterar o status. |
| `DELETE` | `/tickets/:id` | Solicitar a exclusão de um chamado. |
| `GET` | `/responsibles?page=1&limit=100` | Carregar uma página de responsáveis. |

O serviço também disponibiliza `GET /responsible/:id`, embora as telas atuais resolvam os nomes a partir da coleção de responsáveis já carregada.

As listagens utilizam os campos `response.tickets`, `response.responsibles` e `response.pagination`. O campo `state` aparece como `"sucess"` no contrato fornecido; essa grafia foi preservada na documentação da API.

As operações de escrita não precisam retornar o objeto atualizado: após sucesso, o frontend recarrega as listas. O cliente HTTP também aceita uma resposta sem corpo, como `204`.

## Executando os testes

### Verificações disponíveis

```bash
npm run lint
npm run build
```

Esses comandos verificam regras estáticas e compilação. O `package.json` consultado não possui script `test` nem uma suíte de testes automatizados de comportamento configurada.

### Roteiro de teste manual

Execute com a API ativa e dados de demonstração. Os resultados abaixo são critérios para conferência, não um registro de testes já executados.

| Cenário | Resultado esperado |
| --- | --- |
| Criar um chamado com responsável selecionado | O chamado aparece na lista vinculado ao responsável escolhido. |
| Criar com atribuição automática | A requisição não envia `responsibleId`; a API atribui um responsável segundo sua regra de distribuição. |
| Enviar título ou descrição vazios | O formulário impede o envio e solicita o preenchimento. |
| Editar descrição, prioridade, responsável e status | Os dados atualizados aparecem após a gravação e o recarregamento. |
| Combinar filtros e busca | A lista apresenta apenas os chamados que atendem a todos os critérios. |
| Utilizar mais de dez registros | A paginação funciona e os indicadores continuam considerando o conjunto completo carregado. |
| Alterar para `RESOLVED` ou `CLOSED` | O chamado deixa de contar como carga ativa do responsável. |
| Fechar um chamado | O registro permanece consultável com status `CLOSED`. |
| Cancelar e confirmar uma exclusão | Cancelar mantém o registro; confirmar solicita sua remoção e atualiza a lista. |
| Interromper a API | A interface apresenta erro. Após restabelecer a API, **Tentar novamente** recarrega os dados. |
| Recarregar o navegador após salvar | Os dados continuam disponíveis por terem sido persistidos no backend. |
| Usar teclado, voltar/avançar e uma tela pequena | Navegação, formulários, modais e acesso às tabelas permanecem utilizáveis. |

## Regras de negócio

### Status considerados "em aberto"

Para a carga de trabalho e a disponibilidade dos responsáveis, chamados ativos são os que ainda precisam de atendimento:

| Valor na API | Rótulo na interface | Conta como carga ativa? |
| --- | --- | --- |
| `OPEN` | Aberto | Sim. |
| `IN_PROGRESS` | Em andamento | Sim. |
| `RESOLVED` | Resolvido | Não. |
| `CLOSED` | Fechado | Não. |

Essa definição está em `src/utils/tickets.ts`. O backend deve utilizar a mesma definição no cálculo da distribuição automática.

### Distribuição automática

Na criação automática, o frontend omite `responsibleId` do JSON. Na criação manual, envia o ID selecionado. A consulta da carga e a escolha do responsável pertencem ao backend.

### Critério de desempate

O frontend não decide empates nem escolhe previamente um responsável. O critério efetivamente utilizado deve estar descrito na seção correspondente do README do backend.

### Prioridades e indicadores

As prioridades são `LOW` (baixa), `MEDIUM` (média) e `HIGH` (alta).

| Indicador | Cálculo |
| --- | --- |
| Em aberto | Apenas chamados com status `OPEN`. |
| Em andamento | Apenas chamados com status `IN_PROGRESS`. |
| Resolvidos | Apenas chamados com status `RESOLVED`. |
| Urgentes | Prioridade `HIGH` e status `OPEN` ou `IN_PROGRESS`. |
| Responsável em atendimento | Possui pelo menos um chamado ativo. |
| Responsável disponível | Não possui chamados ativos. Não indica presença online. |

Portanto, o card **Em aberto** e o conjunto de chamados **ativos para distribuição** possuem contagens diferentes. O primeiro conta apenas `OPEN`; o segundo soma `OPEN` e `IN_PROGRESS`.

Os nomes dos responsáveis são exibidos integralmente a partir de `name`. Não há campo separado de setor na interface. As datas são apresentadas em formato brasileiro, utilizando o fuso horário do navegador.

## Decisões técnicas

### Por que React e TypeScript

React facilita a composição de telas e a atualização da interface conforme o estado muda. TypeScript ajuda a detectar inconsistências nos contratos e nas propriedades dos componentes durante o desenvolvimento.

O uso de TypeScript no frontend e no backend mantém uma linguagem comum entre as duas partes. Os tipos estão definidos separadamente; a tipagem do frontend não substitui a validação dos dados na API.

### Por que essa arquitetura

A separação entre páginas, componentes, hook de dados, serviços e tipos mantém cada parte com uma responsabilidade identificável. Componentes como campos, modais e notificações podem ser reutilizados, e alterações na comunicação HTTP ficam concentradas em `src/services/`.

### Por que Tailwind e cores personalizadas

O Tailwind oferece utilitários para construir a interface, enquanto o tema em `src/index.css` registra as cores do projeto com `@theme`. O CSS complementar atende aos detalhes do layout. Veja a [documentação de variáveis de tema](https://tailwindcss.com/docs/theme).

### Trade-offs realizados

| Escolha | Benefício | Limitação |
| --- | --- | --- |
| Carregar todas as páginas da API | Permite filtros e indicadores globais com os endpoints disponíveis. | O custo de rede e memória cresce com a base; uma evolução deve levar filtros e agregações ao backend. |
| Paginar a exibição no navegador | Simplifica a navegação das listas do desafio. | Exibir dez itens por página não reduz o volume total carregado da API. |
| Navegar pelo fragmento da URL | Atende às três telas com uma implementação pequena. | Rotas mais complexas podem justificar uma biblioteca dedicada. |
| Atualizar as coleções após cada alteração | Mantém a interface alinhada ao estado retornado pela API. | Gera novas requisições; não há sincronização em tempo real entre usuários. |
| Usar estado e hooks do React | Mantém o gerenciamento de dados próximo do escopo atual. | Uma aplicação maior pode exigir uma solução de cache mais especializada. |

## Limitações e escopo

- A interface não possui fluxo de autenticação. A identificação visual do cabeçalho não representa uma sessão autenticada.
- Os responsáveis são previamente cadastrados no backend; a interface oferece consulta e seleção.
- Não há histórico persistente de alterações. `updatedAt` informa a última atualização, sem registrar todas as mudanças anteriores.
- O funcionamento completo depende da API real. Não há banco local no navegador substituindo o backend.
- A integração completa deve ser verificada com o roteiro manual e a versão final da API.

## Solução de problemas

| Problema | O que verificar |
| --- | --- |
| Não foi possível carregar os dados | Se a API está ativa e `VITE_API_URL` aponta para o endereço correto. |
| Erro de CORS no navegador | Se o backend permite a origem e a porta utilizadas pelo frontend. |
| Resposta inválida da API | Se a URL retorna JSON da API, e não uma página HTML ou uma rota do frontend. |
| A alteração do `.env` não foi aplicada | Reinicie o servidor do Vite; para um build, gere os arquivos novamente. |
| Não é possível criar chamado por falta de responsáveis | Execute o seed no backend e recarregue a interface. |
| `npm ci` informa divergência de lock | Confira se `package.json` e `package-lock.json` pertencem à mesma revisão do projeto. |

## Referências e bibliotecas utilizadas

- [React](https://react.dev/learn) — componentes e gerenciamento de estado.
- [TypeScript](https://www.typescriptlang.org/docs/) — tipos e configuração do compilador.
- [Vite](https://vite.dev/guide/) — execução local e build.
- [Tailwind CSS](https://tailwindcss.com/docs/theme) — utilitários e personalização do tema.
- [ESLint](https://eslint.org/docs/latest/) — análise estática.
- [Fetch API — MDN](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API) — comunicação HTTP.
- [Inter](https://rsms.me/inter/) — fonte sob SIL Open Font License 1.1; licença incluída em `public/assets/Inter-LICENSE.txt`.
- Protótipo e ícones do projeto no Figma — referência visual da interface.

As dependências e os plugins efetivamente instalados estão relacionados no `package.json`.
