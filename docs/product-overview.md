# Professional Management System

## 1. Visão geral

O **Professional Management System** é uma aplicação web full stack desenvolvida para centralizar e facilitar o gerenciamento de profissionais de uma organização.

O sistema permitirá administrar informações pessoais e profissionais, contatos, cargos, departamentos e status dos profissionais por meio de uma interface administrativa moderna e de uma API REST estruturada.

O projeto será desenvolvido como uma evolução da **Professional Management API**, transformando uma API inicialmente focada em operações CRUD em um sistema completo, com autenticação, dashboard, regras de negócio, testes, documentação, interface web e deploy em ambiente público.

---

## 2. Problema

Informações relacionadas aos profissionais de uma organização podem ficar distribuídas entre planilhas, documentos ou sistemas diferentes, dificultando consultas, atualizações e acompanhamento.

Além disso, soluções baseadas apenas em cadastros simples geralmente não oferecem recursos como:

- busca e filtros;
- organização por cargos e departamentos;
- gerenciamento de múltiplos contatos;
- controle de profissionais ativos e inativos;
- indicadores administrativos;
- autenticação e controle de acesso;
- histórico e rastreabilidade das informações.

O Professional Management System busca centralizar essas informações em uma única aplicação.

---

## 3. Objetivo

Criar uma aplicação web completa para gerenciamento de profissionais, permitindo que usuários autorizados consultem e administrem as informações da organização de maneira simples, segura e organizada.

Além do objetivo funcional, o sistema também tem como propósito demonstrar a construção de uma aplicação full stack seguindo boas práticas de desenvolvimento de software.

---

## 4. Público-alvo

O sistema é direcionado principalmente a organizações que precisam manter informações centralizadas sobre seus profissionais.

Exemplos de usuários:

- administradores;
- gestores;
- responsáveis por equipes;
- departamentos administrativos;
- recursos humanos.

Na primeira versão do projeto, o sistema será tratado como uma aplicação administrativa interna.

---

## 5. Principais funcionalidades

O sistema deverá oferecer:

### Autenticação

- login de usuário;
- logout;
- autenticação baseada em JWT;
- proteção de rotas e endpoints;
- controle de acesso aos recursos administrativos.

### Dashboard

- quantidade total de profissionais;
- quantidade de profissionais ativos;
- quantidade de profissionais inativos;
- distribuição de profissionais por departamento;
- distribuição de profissionais por cargo;
- visualização dos últimos profissionais cadastrados.

### Profissionais

- cadastrar profissional;
- listar profissionais;
- consultar detalhes de um profissional;
- editar informações;
- excluir profissional;
- ativar ou desativar profissional;
- pesquisar profissionais por nome;
- aplicar filtros;
- navegar utilizando paginação.

### Contatos

Um profissional poderá possuir múltiplos contatos.

O sistema deverá permitir:

- adicionar contato;
- editar contato;
- excluir contato;
- identificar o tipo de contato;
- visualizar os contatos associados ao profissional.

Exemplos:

- telefone;
- celular;
- e-mail;
- outros.

### Departamentos

- cadastrar departamentos;
- listar departamentos;
- editar departamentos;
- associar profissionais a departamentos;
- utilizar departamentos como filtro.

### Cargos

- cadastrar cargos;
- listar cargos;
- editar cargos;
- associar cargos aos profissionais;
- utilizar cargos como filtro.

---

## 6. MVP

A primeira versão utilizável do sistema deverá possuir:

1. autenticação de usuário;
2. dashboard administrativo;
3. CRUD de profissionais;
4. gerenciamento de contatos;
5. gerenciamento de cargos;
6. gerenciamento de departamentos;
7. status ativo/inativo;
8. pesquisa;
9. filtros;
10. paginação;
11. validação de dados;
12. tratamento padronizado de erros;
13. documentação da API;
14. testes das principais regras de negócio;
15. interface responsiva;
16. integração completa entre frontend e backend;
17. banco de dados PostgreSQL;
18. aplicação publicada em ambiente acessível pela internet.

---

## 7. Fora do escopo inicial

As funcionalidades abaixo não fazem parte do MVP e poderão ser avaliadas futuramente:

- múltiplas organizações;
- upload de documentos;
- upload de foto do profissional;
- exportação para PDF;
- exportação para Excel;
- notificações;
- recuperação de senha por e-mail;
- permissões extremamente granulares;
- histórico completo de alterações;
- integração com serviços externos;
- aplicativo mobile.

Essas funcionalidades poderão fazer parte de versões futuras caso agreguem valor ao projeto.

---

## 8. Stack tecnológica

### Backend

- Java 21;
- Spring Boot;
- Spring Web;
- Spring Data JPA;
- Hibernate;
- Spring Security;
- Bean Validation;
- JWT;
- Maven;
- JUnit;
- Mockito;
- OpenAPI / Swagger.

### Banco de dados

- PostgreSQL;
- Flyway para controle de migrations.

### Frontend

- Next.js;
- TypeScript;
- React;
- Tailwind CSS;
- Shadcn UI.

### Infraestrutura

- Docker;
- Docker Compose.

### Deploy

A estratégia definitiva será definida posteriormente durante a etapa de arquitetura e deploy.

A expectativa inicial é utilizar serviços adequados para hospedar separadamente:

- frontend;
- backend;
- banco PostgreSQL.

---

## 9. Princípios do projeto

O desenvolvimento deverá priorizar:

- separação de responsabilidades;
- código legível e organizado;
- baixo acoplamento;
- validação de dados;
- segurança;
- tratamento consistente de erros;
- testes automatizados;
- documentação;
- experiência do usuário;
- responsividade;
- facilidade de manutenção;
- configuração por ambiente;
- versionamento adequado do banco de dados.

---

## 10. Objetivo técnico

O projeto deverá demonstrar conhecimentos relacionados a:

- desenvolvimento de APIs REST;
- arquitetura de aplicações Spring Boot;
- persistência de dados;
- modelagem relacional;
- autenticação e autorização;
- segurança de aplicações;
- integração frontend/backend;
- desenvolvimento de interfaces modernas;
- gerenciamento de estado e requisições;
- testes automatizados;
- documentação de APIs;
- Docker;
- Git e GitHub;
- CI/CD;
- deploy de aplicações web.

---

## 11. Critérios de sucesso

O projeto será considerado completo quando:

- um usuário conseguir acessar o sistema por meio de autenticação;
- os principais recursos estiverem protegidos;
- profissionais puderem ser cadastrados e gerenciados;
- contatos puderem ser associados aos profissionais;
- cargos e departamentos puderem ser gerenciados;
- pesquisa, filtros e paginação estiverem funcionando;
- o dashboard apresentar informações reais do banco;
- frontend e backend estiverem completamente integrados;
- a API possuir documentação;
- regras importantes possuírem testes;
- o banco utilizar migrations;
- a aplicação possuir tratamento adequado de erros;
- frontend, backend e banco estiverem publicados;
- outra pessoa conseguir acessar e testar o sistema sem configurar o projeto localmente;
- o repositório possuir documentação suficiente para explicar arquitetura, instalação e funcionamento.

---

## 12. Evolução do projeto

O desenvolvimento seguirá as seguintes etapas:

1. Planejamento;
2. Documentação;
3. Arquitetura;
4. Implementação;
5. Revisão;
6. Deploy.

Cada etapa deverá ser concluída e revisada antes de avançar para mudanças estruturais significativas.