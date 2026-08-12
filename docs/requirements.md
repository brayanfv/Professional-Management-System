# Requirements

## 1. Objetivo

Este documento define os requisitos funcionais, regras de negócio e requisitos não funcionais do **Professional Management System**.

Os requisitos descritos aqui serão utilizados como referência para a arquitetura, implementação, testes e revisão do sistema.

---

# 2. Requisitos Funcionais

## 2.1 Autenticação

### RF001 — Login

O sistema deve permitir que um usuário autenticável realize login utilizando suas credenciais.

### RF002 — Logout

O sistema deve permitir que o usuário encerre sua sessão.

### RF003 — Proteção de recursos

O sistema deve impedir o acesso a recursos administrativos por usuários não autenticados.

### RF004 — Identificação do usuário autenticado

O sistema deve permitir identificar o usuário atualmente autenticado.

---

## 2.2 Dashboard

### RF005 — Exibir total de profissionais

O sistema deve apresentar no dashboard a quantidade total de profissionais cadastrados.

### RF006 — Exibir profissionais ativos

O sistema deve apresentar a quantidade de profissionais com status ativo.

### RF007 — Exibir profissionais inativos

O sistema deve apresentar a quantidade de profissionais com status inativo.

### RF008 — Exibir distribuição por departamento

O sistema deve apresentar a quantidade de profissionais agrupados por departamento.

### RF009 — Exibir distribuição por cargo

O sistema deve apresentar a quantidade de profissionais agrupados por cargo.

### RF010 — Exibir cadastros recentes

O sistema deve apresentar os profissionais cadastrados mais recentemente.

---

## 2.3 Profissionais

### RF011 — Cadastrar profissional

O sistema deve permitir cadastrar um novo profissional.

### RF012 — Listar profissionais

O sistema deve permitir listar os profissionais cadastrados.

### RF013 — Consultar profissional

O sistema deve permitir consultar os detalhes de um profissional específico.

### RF014 — Editar profissional

O sistema deve permitir editar os dados de um profissional existente.

### RF015 — Excluir profissional

O sistema deve permitir excluir um profissional.

### RF016 — Alterar status do profissional

O sistema deve permitir alterar o status de um profissional entre ativo e inativo.

### RF017 — Pesquisar profissionais

O sistema deve permitir pesquisar profissionais pelo nome.

### RF018 — Filtrar profissionais por status

O sistema deve permitir filtrar profissionais por status ativo ou inativo.

### RF019 — Filtrar profissionais por cargo

O sistema deve permitir filtrar profissionais por cargo.

### RF020 — Filtrar profissionais por departamento

O sistema deve permitir filtrar profissionais por departamento.

### RF021 — Paginar profissionais

O sistema deve apresentar a listagem de profissionais utilizando paginação.

### RF022 — Ordenar profissionais

O sistema deve permitir ordenar a listagem de profissionais por critérios suportados pela aplicação.

---

## 2.4 Contatos

### RF023 — Cadastrar contato

O sistema deve permitir adicionar um contato a um profissional.

### RF024 — Listar contatos

O sistema deve permitir visualizar os contatos associados a um profissional.

### RF025 — Editar contato

O sistema deve permitir editar um contato existente.

### RF026 — Excluir contato

O sistema deve permitir excluir um contato.

### RF027 — Definir tipo de contato

O sistema deve permitir definir o tipo de um contato.

Os tipos inicialmente suportados poderão incluir:

- telefone;
- celular;
- e-mail;
- outro.

---

## 2.5 Departamentos

### RF028 — Cadastrar departamento

O sistema deve permitir cadastrar um departamento.

### RF029 — Listar departamentos

O sistema deve permitir listar os departamentos cadastrados.

### RF030 — Consultar departamento

O sistema deve permitir consultar os dados de um departamento específico.

### RF031 — Editar departamento

O sistema deve permitir editar um departamento existente.

### RF032 — Excluir departamento

O sistema deve permitir excluir um departamento quando permitido pelas regras de negócio.

### RF033 — Associar profissional a departamento

O sistema deve permitir associar um profissional a um departamento.

---

## 2.6 Cargos

### RF034 — Cadastrar cargo

O sistema deve permitir cadastrar um cargo.

### RF035 — Listar cargos

O sistema deve permitir listar os cargos cadastrados.

### RF036 — Consultar cargo

O sistema deve permitir consultar os dados de um cargo específico.

### RF037 — Editar cargo

O sistema deve permitir editar um cargo existente.

### RF038 — Excluir cargo

O sistema deve permitir excluir um cargo quando permitido pelas regras de negócio.

### RF039 — Associar profissional a cargo

O sistema deve permitir associar um profissional a um cargo.

---

## 2.7 Interface

### RF040 — Exibir mensagens de feedback

O sistema deve apresentar mensagens de sucesso ou erro após operações relevantes.

### RF041 — Exibir estados de carregamento

A interface deve apresentar feedback visual enquanto dados estiverem sendo carregados.

### RF042 — Exibir estado vazio

A interface deve apresentar uma mensagem apropriada quando uma listagem não possuir registros.

### RF043 — Confirmação de exclusão

O sistema deve solicitar confirmação antes da exclusão de registros relevantes.

---

# 3. Regras de Negócio

## RN001 — Nome obrigatório

Todo profissional deve possuir um nome válido.

## RN002 — Cargo do profissional

Um profissional deverá possuir um cargo válido conforme as regras definidas para o sistema.

## RN003 — Departamento do profissional

Um profissional deverá possuir um departamento válido conforme as regras definidas para o sistema.

## RN004 — Status do profissional

Todo profissional deve possuir um status.

Os estados inicialmente suportados são:

- ACTIVE;
- INACTIVE.

## RN005 — Status inicial

Um novo profissional deverá ser criado com status ativo por padrão, salvo decisão contrária durante a implementação.

## RN006 — Contato pertence a um profissional

Todo contato cadastrado deve estar associado a um profissional existente.

## RN007 — Tipo de contato obrigatório

Todo contato deve possuir um tipo válido.

## RN008 — Conteúdo do contato obrigatório

Todo contato deve possuir um valor preenchido.

## RN009 — Validação de e-mail

Quando o tipo do contato for e-mail, o valor informado deverá possuir um formato de e-mail válido.

## RN010 — Nome de departamento

O nome de um departamento não poderá estar vazio.

## RN011 — Nome de cargo

O nome de um cargo não poderá estar vazio.

## RN012 — Departamento utilizado

Um departamento associado a profissionais não deverá ser excluído diretamente caso a exclusão gere inconsistência de dados.

## RN013 — Cargo utilizado

Um cargo associado a profissionais não deverá ser excluído diretamente caso a exclusão gere inconsistência de dados.

## RN014 — Credenciais inválidas

O sistema não deverá autenticar usuários com credenciais inválidas.

## RN015 — Senha protegida

Senhas nunca deverão ser armazenadas em texto puro.

## RN016 — Recursos protegidos

Somente usuários autenticados deverão acessar os recursos administrativos protegidos da aplicação.

## RN017 — Datas de criação

O sistema deverá registrar automaticamente a data de criação dos principais registros.

## RN018 — Datas de atualização

O sistema deverá registrar automaticamente a data da última atualização quando aplicável.

---

# 4. Requisitos Não Funcionais

## 4.1 Segurança

### RNF001 — Hash de senha

Senhas devem ser armazenadas utilizando algoritmo de hash adequado para senhas.

### RNF002 — Autenticação

A API deve utilizar mecanismo seguro de autenticação baseada em token.

### RNF003 — Autorização

Endpoints protegidos devem validar a autenticação antes de permitir acesso ao recurso.

### RNF004 — Dados sensíveis

Informações sensíveis não devem ser retornadas desnecessariamente pelas respostas da API.

---

## 4.2 API

### RNF005 — REST

O backend deve disponibilizar seus recursos por meio de uma API REST.

### RNF006 — JSON

A comunicação principal entre frontend e backend deve utilizar JSON.

### RNF007 — Status HTTP

A API deve utilizar códigos HTTP compatíveis com o resultado das operações.

Exemplos:

- 200 — OK;
- 201 — Created;
- 204 — No Content;
- 400 — Bad Request;
- 401 — Unauthorized;
- 403 — Forbidden;
- 404 — Not Found;
- 409 — Conflict;
- 500 — Internal Server Error.

### RNF008 — Tratamento padronizado de erros

Erros da aplicação devem utilizar uma estrutura de resposta consistente.

### RNF009 — Documentação

Os principais endpoints devem possuir documentação utilizando OpenAPI/Swagger.

---

## 4.3 Banco de dados

### RNF010 — PostgreSQL

O banco de dados relacional principal do sistema deve utilizar PostgreSQL.

### RNF011 — Integridade referencial

Relacionamentos entre entidades devem preservar a integridade dos dados.

### RNF012 — Migrations

Mudanças estruturais do banco de dados devem ser versionadas utilizando migrations.

### RNF013 — Configuração por ambiente

Credenciais e configurações do banco não devem estar fixas no código-fonte.

---

## 4.4 Backend

### RNF014 — Separação de responsabilidades

O backend deve utilizar uma estrutura que separe responsabilidades entre camadas.

### RNF015 — DTOs

As entradas e saídas da API devem utilizar DTOs quando apropriado, evitando exposição desnecessária das entidades de persistência.

### RNF016 — Validação

Dados recebidos pela API devem ser validados antes da execução das regras de negócio.

### RNF017 — Testes

As principais regras de negócio devem possuir testes automatizados.

### RNF018 — Legibilidade

O código deve utilizar nomes claros e manter organização consistente.

---

## 4.5 Frontend

### RNF019 — Responsividade

A interface deve ser utilizável em diferentes tamanhos de tela.

### RNF020 — Experiência do usuário

A aplicação deve fornecer feedback visual para operações assíncronas, erros e ações concluídas.

### RNF021 — Consistência visual

A interface deve manter padrões consistentes de componentes, espaçamento e navegação.

### RNF022 — Rotas protegidas

Páginas administrativas protegidas não devem ser acessíveis por usuários não autenticados.

---

## 4.6 Infraestrutura

### RNF023 — Docker

O projeto deve fornecer configuração Docker adequada para execução dos componentes definidos pela arquitetura.

### RNF024 — Variáveis de ambiente

Configurações específicas de ambiente devem ser definidas utilizando variáveis de ambiente.

### RNF025 — Deploy público

A versão final deve possuir frontend e backend publicados em ambiente acessível pela internet.

### RNF026 — Banco remoto

A aplicação publicada deve utilizar uma instância PostgreSQL adequada ao ambiente de produção.

---

## 4.7 Documentação e manutenção

### RNF027 — README

O repositório deve possuir README contendo:

- apresentação do projeto;
- funcionalidades;
- stack;
- instruções de execução;
- configuração;
- arquitetura resumida;
- links da aplicação;
- documentação da API.

### RNF028 — Documentação arquitetural

As principais decisões arquiteturais devem ser registradas no diretório `docs`.

### RNF029 — Versionamento

O projeto deve utilizar Git para controle de versão.

### RNF030 — Repositório reproduzível

Um desenvolvedor deverá conseguir executar o projeto localmente seguindo a documentação disponibilizada.

---

# 5. Critérios gerais de aceite

Um requisito funcional será considerado atendido quando:

1. a funcionalidade estiver implementada;
2. as regras de negócio relacionadas forem respeitadas;
3. erros esperados forem tratados;
4. a interface apresentar comportamento apropriado, quando aplicável;
5. a API retornar respostas adequadas;
6. os principais cenários puderem ser testados;
7. a implementação estiver de acordo com a arquitetura definida para o projeto.

---

# 6. Priorização

Os requisitos serão classificados durante a criação do roadmap utilizando as seguintes prioridades:

- **P0 — Essencial para o MVP**
- **P1 — Importante para o MVP**
- **P2 — Melhoria posterior**

A priorização definitiva será documentada no `roadmap.md`.