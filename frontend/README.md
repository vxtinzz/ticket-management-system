# Codificar — Frontend do sistema de chamados

Implementação em React + TypeScript + Tailwind CSS, baseada nas telas fornecidas no Figma e nos contratos de `returnsAPI.txt`.

## Executar

Requer Node.js compatível com o Vite 8 (por exemplo, Node 22.12+ ou 24) e npm.

1. Extraia a pasta `frontend`.
2. Abra o terminal nessa pasta e execute `npm ci`.
3. Copie `.env.example` para `.env`. No PowerShell: `Copy-Item .env.example .env`.
4. Ajuste `VITE_API_URL` para a URL da sua API. Exemplo: `http://localhost:3000`. Inclua um prefixo, como `/api`, somente se suas rotas o utilizarem.
5. Inicie o backend e execute `npm run dev` no frontend.
6. Abra o endereço exibido pelo Vite.

O backend deve permitir a origem do frontend no CORS, incluindo os métodos GET, POST, PATCH, DELETE e o cabeçalho Content-Type. Reinicie o Vite ao alterar `.env`. Variáveis VITE são públicas: não coloque segredos nelas.

`npm run build` verifica TypeScript e gera `dist`. `npm run lint` executa ESLint. `npm run preview` serve o build localmente.

## Implementado

- Dashboard com indicadores, últimos chamados e gráfico por status.
- Chamados com busca por título, filtros combinados, ordenação e paginação de 10 itens.
- Criação, edição, detalhes atualizados por ID, fechamento e exclusão com confirmação.
- Responsáveis com o nome completo recebido da API, busca e filtro de disponibilidade. Não há coluna, filtro ou extração de setor.
- Notificações de sucesso e erro; estados de carregamento, erro e lista vazia.
- Modais com foco contido pelo elemento nativo dialog, fechamento por Escape e restauração de foco.
- Layout adaptável para desktop e celular, tabelas com rolagem horizontal.
- Ícones exportados do Figma e fonte Inter local, sem dependência de URLs temporárias.

## Integração e regras

Rotas utilizadas:

| Método | Rota | Uso |
|---|---|---|
| GET | `/tickets?page=1&limit=100` | Carregar chamados paginados |
| GET | `/tickets/:id` | Atualizar os detalhes de um chamado |
| POST | `/tickets` | Criar chamado |
| PATCH | `/tickets/:id` | Editar ou alterar status para CLOSED |
| DELETE | `/tickets/:id` | Excluir chamado |
| GET | `/responsibles?page=1&limit=100` | Carregar responsáveis paginados |

A criação automática **omite responsibleId**. A escolha do responsável com menor carga pertence ao backend. A criação manual envia responsibleId. Após uma alteração, as listas são recarregadas; o frontend não espera um objeto de chamado no retorno da mutação. Respostas DELETE 204 sem conteúdo também são aceitas.

Os campos obrigatórios de título e descrição são verificados no formulário. A API continua responsável por validar limites, regras de negócio e valores permitidos. Erros preservam os dados digitados.

Status: OPEN, IN_PROGRESS, RESOLVED e CLOSED. Prioridade: LOW, MEDIUM e HIGH.

Os indicadores são calculados a partir de **todas as páginas** da API, não apenas dos dez itens exibidos. Este método atende a uma base pequena do desafio; para bases maiores, implemente agregações, filtros e paginação no backend.

- Urgentes: prioridade HIGH com status OPEN ou IN_PROGRESS.
- Resolvidos: status RESOLVED. Fechados aparecem separadamente no gráfico.
- Em atendimento: responsável com pelo menos um chamado OPEN ou IN_PROGRESS.
- Disponível: responsável sem chamados nesses dois status. É uma inferência de carga, não presença online.
- Nomes: exibidos integralmente, incluindo qualquer texto entre colchetes recebido da API.

As rotas seguem os contratos fornecidos. Se o router de responsáveis estiver montado em outro prefixo, ajuste `src/services/responsibles.service.ts`.

## Organização

- `src/components/layout`: estrutura, cabeçalho e navegação.
- `src/components/ui`: botões, campos, modais, notificações, indicadores e paginação.
- `src/components/tickets`: formulários, detalhes e badges específicos.
- `src/pages`: Dashboard, Chamados e Responsáveis.
- `src/hooks/useHelpdesk.ts`: carregamento e atualização das coleções.
- `src/services`: comunicação HTTP.
- `src/types`: contratos TypeScript.
- `src/utils`: rótulos, datas e filtros.
- `src/index.css`: cores no @theme, estilos e pontos de adaptação.

A navegação usa fragmentos de URL (`#/home`, `#/tickets`, `#/responsibles`), com suporte a voltar/avançar e sem recarregar a página. Não requer configuração de fallback no servidor para cada rota.

## Decisões em relação ao protótipo

O botão sem funcionalidade de cadastro de colaborador foi omitido, pois o desafio e a API fornecida não exigem esse cadastro. O cabeçalho mantém Administrador/Codificar como identificação visual, sem criar um sistema de login. Na visualização de detalhes, o rodapé tem Voltar e Fechar chamado; alterações acontecem no modal Editar. Confirmações distinguem fechamento (PATCH) de exclusão definitiva (DELETE).

Não há dados fictícios na aplicação nem armazenamento local como substituto do banco. Também não foi criado histórico persistente, pois não existe contrato de histórico fornecido. A API real precisa estar disponível para uso.

## Roteiro manual com sua API

1. Abra Chamados e confira os nomes dos responsáveis e as datas.
2. Crie um chamado com atribuição automática; confirme no banco a escolha feita pelo backend.
3. Crie outro chamado selecionando um responsável.
4. Busque por título, combine filtros e teste as páginas.
5. Clique no título para abrir detalhes; edite descrição, prioridade, responsável e status.
6. Confira Dashboard e Responsáveis após cada mudança.
7. Feche um chamado nos detalhes e confirme o status CLOSED.
8. Cancele uma exclusão; depois confirme e verifique a remoção.
9. Interrompa o backend e confira o tratamento de erro. Restaure-o e use Tentar novamente.
10. Teste os formulários com teclado e em uma janela de celular.

## Créditos

Design e ícones: arquivo Figma fornecido pelo usuário. Inter: The Inter Project Authors, licença SIL Open Font License 1.1 (arquivo em `public/assets/Inter-LICENSE.txt`).

## Verificação desta entrega

- `npm run lint`: aprovado.
- `npm run build`: aprovado, incluindo checagem TypeScript.
- Arquivos dos ícones conferidos como PNG/SVG válidos.
- Inspeção visual automatizada e testes de interação em navegador: não concluídos; o Chromium falhou ao iniciar no ambiente de execução.
- Integração com backend real: pendente de execução local. O backend não foi enviado.

O arquivo contém apenas fontes, configuração e assets. Não inclui node_modules, dist nem seu arquivo .env original.
