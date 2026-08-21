# Architecture

## 1. Objetivo

Este documento define a arquitetura técnica do **Professional Management System**.

A arquitetura foi planejada para manter o sistema organizado, testável, escalável e fácil de manter, sem adicionar complexidade desnecessária para o escopo atual do projeto.

O sistema será dividido em três componentes principais:

- Frontend;
- Backend;
- Banco de dados.

A comunicação entre frontend e backend ocorrerá por meio de uma API REST.

---

# 2. Visão Geral

A arquitetura geral seguirá o seguinte fluxo:

```text
┌──────────────────────────────┐
│           Usuário            │
└──────────────┬───────────────┘
               │
               │ HTTPS
               ▼
┌──────────────────────────────┐
│          Frontend            │
│                              │
│ Next.js + TypeScript         │
│ Tailwind CSS + Shadcn UI     │
└──────────────┬───────────────┘
               │
               │ REST / JSON
               ▼
┌──────────────────────────────┐
│           Backend            │
│                              │
│ Java 21 + Spring Boot        │
│ Spring Security             │
│ Spring Data JPA             │
└──────────────┬───────────────┘
               │
               │ JPA / Hibernate
               ▼
┌──────────────────────────────┐
│         PostgreSQL           │
└──────────────────────────────┘
```

O frontend será responsável pela interface e experiência do usuário.

O backend será responsável pelas regras de negócio, autenticação, autorização, validação e persistência.

O PostgreSQL será responsável pelo armazenamento permanente dos dados.

---

# 3. Arquitetura do Backend

O backend utilizará uma arquitetura em camadas.

O fluxo principal será:

```text
HTTP Request
     │
     ▼
Controller
     │
     ▼
Service
     │
     ▼
Repository
     │
     ▼
PostgreSQL
```

Cada camada possuirá uma responsabilidade específica.

---

## 3.1 Controller

Responsável pela interface HTTP da aplicação.

Principais responsabilidades:

- receber requisições;
- validar parâmetros de entrada;
- receber DTOs;
- chamar a camada de serviço;
- definir códigos HTTP;
- retornar respostas da API.

Controllers não deverão conter regras de negócio complexas.

Exemplo:

```text
ProfessionalController
DepartmentController
PositionController
ContactController
AuthController
DashboardController
```

---

## 3.2 Service

Responsável pelas regras de negócio da aplicação.

Principais responsabilidades:

- executar casos de uso;
- validar regras de negócio;
- coordenar repositories;
- lançar exceções de domínio;
- controlar operações transacionais quando necessário.

Exemplo:

```text
ProfessionalService
DepartmentService
PositionService
ContactService
AuthService
DashboardService
```

A maior parte da lógica da aplicação deverá permanecer nesta camada.

---

## 3.3 Repository

Responsável pela comunicação com o banco de dados.

Será utilizado Spring Data JPA.

Responsabilidades:

- persistência;
- consultas;
- filtros;
- paginação;
- ordenação;
- operações específicas de banco.

Exemplo:

```text
ProfessionalRepository
DepartmentRepository
PositionRepository
ContactRepository
UserRepository
```

---

## 3.4 Entity

Representa o modelo persistido no banco de dados.

As entidades principais serão:

```text
User
Professional
Contact
Department
Position
```

As entidades não deverão ser utilizadas diretamente como contratos públicos da API.

DTOs serão responsáveis pela comunicação externa.

---

# 4. Organização de Pacotes do Backend

A aplicação poderá utilizar inicialmente uma organização por camada, mantendo uma estrutura simples e previsível.

Estrutura proposta:

```text
src/main/java/.../

├── config/
│
├── controller/
│   ├── AuthController
│   ├── ProfessionalController
│   ├── ContactController
│   ├── DepartmentController
│   ├── PositionController
│   └── DashboardController
│
├── dto/
│   ├── auth/
│   ├── professional/
│   ├── contact/
│   ├── department/
│   ├── position/
│   └── dashboard/
│
├── entity/
│   ├── User
│   ├── Professional
│   ├── Contact
│   ├── Department
│   └── Position
│
├── enums/
│
├── exception/
│   ├── GlobalExceptionHandler
│   ├── ResourceNotFoundException
│   ├── BusinessException
│   └── ...
│
├── mapper/
│
├── repository/
│
├── security/
│
├── service/
│
└── ProfessionalManagementApplication
```

Essa organização poderá ser revisada futuramente caso o crescimento do sistema justifique uma estrutura por feature.

Para o escopo atual, será priorizada simplicidade arquitetural.

---

# 5. Modelo de Domínio

O domínio principal será composto pelas seguintes entidades.

---

## 5.1 User

Representa um usuário autorizado a acessar o sistema administrativo.

Principais atributos:

```text
id
name
email
password
role
createdAt
updatedAt
```

Relacionamentos adicionais poderão ser adicionados futuramente caso seja implementada auditoria.

---

## 5.2 Professional

Representa um profissional cadastrado na organização.

Principais atributos:

```text
id
name
birthDate
status
createdAt
updatedAt
```

Relacionamentos:

```text
Professional
    │
    ├── Department
    │
    ├── Position
    │
    └── Contacts
```

---

## 5.3 Contact

Representa uma forma de contato associada a um profissional.

Principais atributos:

```text
id
type
value
createdAt
updatedAt
```

Relacionamento:

```text
Professional 1 ─────── N Contact
```

Um profissional poderá possuir múltiplos contatos.

Cada contato pertencerá a apenas um profissional.

---

## 5.4 Department

Representa um departamento da organização.

Exemplos:

```text
Technology
Finance
Human Resources
Marketing
```

Principais atributos:

```text
id
name
description
createdAt
updatedAt
```

Relacionamento:

```text
Department 1 ─────── N Professional
```

Um departamento poderá possuir vários profissionais.

Um profissional deverá estar associado a no máximo um departamento na primeira versão.

---

## 5.5 Position

Representa o cargo ocupado por um profissional.

Exemplos:

```text
Software Developer
Project Manager
Financial Analyst
Designer
```

Principais atributos:

```text
id
name
description
createdAt
updatedAt
```

Relacionamento:

```text
Position 1 ─────── N Professional
```

Um cargo poderá estar associado a vários profissionais.

Um profissional deverá possuir no máximo um cargo na primeira versão.

---

# 6. Relacionamentos

Modelo conceitual inicial:

```text
                 ┌────────────────┐
                 │   Department   │
                 └───────┬────────┘
                         │
                         │ 1:N
                         ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Position   │──▶│ Professional │──▶│   Contact    │
└──────────────┘   └──────────────┘   └──────────────┘
       1:N                                1:N


┌──────────────┐
│     User     │
└──────────────┘

User será utilizado inicialmente para autenticação
e administração do sistema.
```

O modelo definitivo de tabelas, constraints, índices e chaves estrangeiras será definido no documento `database.md`.

---

# 7. DTOs

A API não deverá utilizar entidades diretamente como entrada ou resposta das requisições.

Serão utilizados DTOs específicos.

Exemplo:

```text
ProfessionalRequestDTO
ProfessionalResponseDTO

ContactRequestDTO
ContactResponseDTO

DepartmentRequestDTO
DepartmentResponseDTO

PositionRequestDTO
PositionResponseDTO
```

Quando necessário, poderão existir DTOs específicos para operações distintas.

Exemplo:

```text
CreateProfessionalRequest
UpdateProfessionalRequest
ProfessionalResponse
ProfessionalSummaryResponse
```

Essa abordagem será preferida quando reduzir ambiguidade e melhorar os contratos da API.

---

# 8. Mapeamento

A conversão entre Entities e DTOs deverá ser realizada fora dos Controllers.

Fluxo:

```text
Request DTO
    │
    ▼
Service
    │
    ▼
Mapper
    │
    ▼
Entity
```

Na resposta:

```text
Entity
    │
    ▼
Mapper
    │
    ▼
Response DTO
```

Inicialmente, os mappers poderão ser implementados manualmente.

O uso de bibliotecas como MapStruct poderá ser avaliado posteriormente caso agregue valor suficiente ao projeto.

---

# 9. Validação

A aplicação utilizará Bean Validation para validações estruturais.

Exemplos:

```text
@NotBlank
@NotNull
@Size
@Email
@Past
```

Existirão dois níveis de validação.

## Validação estrutural

Realizada principalmente nos DTOs.

Exemplo:

```text
nome obrigatório
e-mail válido
data válida
```

## Validação de negócio

Realizada na camada Service.

Exemplo:

```text
departamento precisa existir
cargo precisa existir
profissional precisa existir
departamento não pode ser removido quando houver restrições
```

---

# 10. Tratamento de Exceções

Será utilizado um tratamento global de exceções.

Componente principal:

```text
GlobalExceptionHandler
```

A aplicação deverá produzir respostas de erro padronizadas.

Formato conceitual:

```json
{
  "timestamp": "2026-08-11T14:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Professional not found",
  "path": "/api/professionals/10"
}
```

Erros de validação poderão incluir detalhes dos campos.

Exemplo:

```json
{
  "status": 400,
  "message": "Validation failed",
  "fields": {
    "name": "Name is required",
    "birthDate": "Birth date must be in the past"
  }
}
```

---

# 11. Autenticação

O sistema utilizará Spring Security.

O fluxo inicial será baseado em autenticação com JWT.

```text
Usuário
   │
   │ email + senha
   ▼
POST /api/auth/login
   │
   ▼
AuthController
   │
   ▼
AuthenticationManager
   │
   ▼
UserDetailsService
   │
   ▼
UserRepository
```

Caso as credenciais estejam corretas:

```text
JWT
 │
 ▼
Frontend
```

Nas próximas requisições:

```text
JWT stored in HttpOnly pm_session cookie; state-changing requests also send X-XSRF-TOKEN
```

O backend deverá validar o token antes de permitir acesso aos endpoints protegidos.

---

# 12. Autorização

Na primeira versão, o sistema poderá utilizar uma estrutura simples de roles.

Exemplo:

```text
ADMIN
```

A arquitetura deverá permitir a evolução futura para:

```text
ADMIN
MANAGER
VIEWER
```

Não será adicionada complexidade de permissões granulares no MVP sem necessidade funcional.

---

# 13. Password Security

Senhas nunca serão armazenadas em texto puro.

Será utilizado um algoritmo adequado para armazenamento de senhas, como BCrypt.

Fluxo:

```text
senha
 │
 ▼
PasswordEncoder
 │
 ▼
hash
 │
 ▼
database
```

A senha original nunca deverá ser recuperável a partir do banco.

---

# 14. Paginação, Filtros e Ordenação

Listagens que possam crescer deverão utilizar paginação no backend.

Exemplo conceitual:

```text
GET /api/professionals?page=0&size=10
```

Filtros poderão ser combinados.

Exemplo:

```text
GET /api/professionals?name=Brayan&status=ACTIVE&departmentId=1
```

Ordenação deverá utilizar campos permitidos pela aplicação.

Exemplo:

```text
sort=name,asc
```

A implementação deverá impedir que parâmetros externos sejam utilizados de forma insegura em consultas.

---

# 15. Dashboard

O backend utiliza endpoints próprios para agregações do dashboard. Eles são
protegidos pela mesma segurança administrativa da API.

Exemplo conceitual:

```text
/api/dashboard/summary
```

Possível resposta:

```json
{
  "totalProfessionals": 120,
  "activeProfessionals": 103,
  "inactiveProfessionals": 17
}
```

Outros endpoints poderão fornecer:

```text
professionalsByDepartment
professionalsByPosition
recentProfessionals
```

A estrutura definitiva será definida no `api-design.md`.

---

# 16. Banco de Dados

O banco principal será PostgreSQL.

O acesso ocorrerá utilizando:

```text
Spring Data JPA
+
Hibernate
```

As alterações estruturais do banco serão versionadas utilizando Flyway.

Exemplo:

```text
db/migration/

V1__create_departments_table.sql
V2__create_positions_table.sql
V3__create_professionals_table.sql
V4__create_contacts_table.sql
V5__create_domain_indexes.sql
V6__create_users_table.sql
V7__add_professionals_created_at_index.sql
```

O Hibernate não deverá ser utilizado como mecanismo principal de criação automática da estrutura do banco em produção.

---

# 17. Configuração por Ambiente

Configurações sensíveis não poderão ficar diretamente no repositório.

Exemplos:

```text
DATABASE_URL
DATABASE_USERNAME
DATABASE_PASSWORD
JWT_SECRET
JWT_EXPIRATION
CORS_ALLOWED_ORIGINS
```

Poderão existir perfis:

```text
development
test
production
```

Cada ambiente terá configurações adequadas às suas necessidades.

---

# 18. Arquitetura do Frontend

O frontend será desenvolvido utilizando:

```text
Next.js
TypeScript
React
Tailwind CSS
Shadcn UI
```

Será utilizado o App Router do Next.js.

Estrutura inicial proposta:

```text
src/

├── app/
│   ├── login/
│   ├── dashboard/
│   ├── professionals/
│   ├── departments/
│   ├── positions/
│   └── layout.tsx
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── forms/
│   ├── tables/
│   └── feedback/
│
├── features/
│   ├── auth/
│   ├── professionals/
│   ├── contacts/
│   ├── departments/
│   ├── positions/
│   └── dashboard/
│
├── lib/
│
├── services/
│
├── types/
│
└── hooks/
```

Essa estrutura poderá ser adaptada conforme a aplicação evoluir.

---

# 19. Camada de Comunicação do Frontend

Chamadas à API não deverão ficar espalhadas diretamente pelos componentes.

Será criada uma camada específica.

Exemplo:

```text
services/

api.ts
auth-service.ts
professional-service.ts
department-service.ts
position-service.ts
dashboard-service.ts
```

Fluxo:

```text
Component
    │
    ▼
Service
    │
    ▼
HTTP Client
    │
    ▼
Spring Boot API
```

Isso reduz acoplamento entre interface e API.

---

# 20. Estado da Interface

Estados assíncronos deverão possuir tratamento explícito.

Exemplos:

```text
loading
success
error
empty
```

O usuário deverá receber feedback adequado durante operações como:

- carregamento de dados;
- cadastro;
- edição;
- exclusão;
- autenticação.

---

# 21. Rotas

Rotas administrativas deverão exigir autenticação.

Estrutura conceitual:

```text
/login

/dashboard

/professionals
/professionals/new
/professionals/[id]
/professionals/[id]/edit

/departments

/positions
```

Usuários não autenticados que tentarem acessar recursos protegidos deverão ser redirecionados para a página de login.

---

# 22. Integração Frontend e Backend

Fluxo geral:

```text
Browser
   │
   ▼
Next.js
   │
   │ HTTPS / JSON
   ▼
Spring Boot
   │
   ▼
Service
   │
   ▼
Repository
   │
   ▼
PostgreSQL
```

O frontend não deverá acessar diretamente o banco de dados.

Toda regra de negócio relevante deverá permanecer no backend.

---

# 23. CORS

O backend deverá permitir requisições apenas de origens configuradas.

Em desenvolvimento, poderá ser permitida a origem local do frontend.

Exemplo:

```text
http://localhost:3000
```

Em produção, somente os domínios necessários deverão ser autorizados.

As origens permitidas deverão ser configuráveis por ambiente.

---

# 24. Docker

Docker é utilizado para padronizar o ambiente de execução local.

Durante o desenvolvimento, Docker Compose fornece PostgreSQL e pode executar
todo o backend. O Compose utiliza PostgreSQL 16 com volume persistente e
healthcheck; o backend aguarda esse healthcheck e acessa o banco por `db:5432`.

Fluxo local:

```text
Next.js
   │
Spring Boot
   │
PostgreSQL (Docker)
```

O backend é construído por Dockerfile multi-stage com Java 21 e executado como
usuário não-root. Flyway aplica migrations e Hibernate valida o schema no
profile `dev`; não há criação automática de schema pelo Hibernate.

Exemplo:

```text
docker compose up --build
```

---

# 25. Estratégia de Testes

A aplicação utilizará diferentes níveis de testes.

## Unitários

Principalmente para:

```text
Services
Regras de negócio
Validações específicas
```

Ferramentas:

```text
JUnit
Mockito
```

## Integração

Utilizados para verificar:

```text
Controllers
Repositories
Banco
Segurança
Fluxos importantes
```

Testcontainers poderá ser avaliado para testes de integração com PostgreSQL real.

## Frontend

Inicialmente serão priorizados testes dos componentes e fluxos mais importantes.

A estratégia definitiva será definida durante a fase de qualidade.

---

# 26. Documentação da API

A API deverá utilizar OpenAPI.

Swagger UI permitirá visualizar e testar os endpoints durante o desenvolvimento.

A documentação deverá incluir:

- endpoints;
- parâmetros;
- schemas;
- respostas;
- status HTTP;
- autenticação.

---

# 27. Observabilidade

O MVP não necessita de uma plataforma avançada de observabilidade.

Entretanto, deverão existir logs adequados para eventos importantes e erros.

Informações sensíveis nunca deverão aparecer nos logs.

No futuro poderão ser avaliados:

```text
Spring Boot Actuator
health checks
monitoramento
error tracking
```

---

# 28. Estratégia de Deploy

O sistema terá três componentes implantáveis.

```text
Frontend
Backend
Database
```

Arquitetura conceitual de produção:

```text
                    Internet
                       │
                       ▼
              ┌────────────────┐
              │    Frontend    │
              │    Next.js     │
              └───────┬────────┘
                      │ HTTPS
                      ▼
              ┌────────────────┐
              │     Backend    │
              │  Spring Boot   │
              └───────┬────────┘
                      │
                      ▼
              ┌────────────────┐
              │   PostgreSQL   │
              └────────────────┘
```

A escolha definitiva dos provedores será realizada durante a fase de deploy, considerando:

- custo;
- confiabilidade;
- facilidade de configuração;
- HTTPS;
- suporte a PostgreSQL;
- variáveis de ambiente;
- integração com GitHub.

---

# 29. CI/CD

O projeto deverá ser preparado para integração contínua.

Uma pipeline poderá executar:

```text
Backend
├── build
├── tests
└── validation

Frontend
├── install
├── lint
├── type-check
└── build
```

Deploy automático poderá ser configurado posteriormente a partir da branch principal.

---

# 30. Estratégia de Git

O desenvolvimento deverá utilizar commits pequenos e descritivos.

Exemplos:

```text
feat: add department entity
feat: implement professional pagination
fix: handle duplicate department name
test: add professional service tests
docs: update architecture documentation
```

Mudanças maiores deverão ser divididas em etapas para facilitar revisão e manutenção.

---

# 31. Princípios Arquiteturais

As seguintes regras deverão orientar o projeto.

## Simplicidade

Não utilizar padrões complexos sem necessidade real.

## Separação de responsabilidades

Cada camada deverá possuir funções claramente definidas.

## Backend como fonte das regras de negócio

O frontend não deverá ser responsável por regras críticas da aplicação.

## Contratos explícitos

DTOs deverão representar claramente os contratos da API.

## Segurança por padrão

Recursos administrativos deverão ser protegidos.

## Configuração externa

Credenciais e configurações específicas de ambiente deverão permanecer fora do código.

## Evolução incremental

A arquitetura deverá permitir evolução sem exigir uma complexidade antecipada.

---

# 32. Decisões Arquiteturais Iniciais

As seguintes decisões ficam estabelecidas para o MVP:

| Decisão | Escolha |
|---|---|
| Backend | Java 21 + Spring Boot |
| Frontend | Next.js + TypeScript |
| Banco | PostgreSQL |
| Persistência | Spring Data JPA / Hibernate |
| API | REST + JSON |
| Autenticação | Spring Security + JWT |
| Migrações | Flyway |
| Documentação API | OpenAPI / Swagger |
| UI | Tailwind CSS + Shadcn UI |
| Containerização | Docker |
| Arquitetura backend | Arquitetura em camadas |
| Contratos API | DTOs |
| Gerenciamento de dependências backend | Maven |

---

# 33. Decisões Pendentes

Algumas decisões serão detalhadas nos próximos documentos.

## Database

O `database.md` deverá definir:

- tabelas;
- colunas;
- tipos;
- chaves;
- constraints;
- índices;
- relacionamentos;
- regras de exclusão.

## API Design

O `api-design.md` deverá definir:

- endpoints;
- métodos HTTP;
- request bodies;
- response bodies;
- paginação;
- filtros;
- status HTTP.

## Segurança

Durante a implementação serão detalhados:

- duração do token;
- estratégia de armazenamento no frontend;
- refresh token, caso necessário;
- políticas de CORS;
- criação do usuário administrador inicial.

## Deploy

Os provedores serão escolhidos somente após a aplicação estar suficientemente estável para publicação.

---

# 34. Resultado Esperado

Esta arquitetura deverá permitir que o Professional Management System evolua da API atual para uma aplicação full stack completa sem perder simplicidade, organização e facilidade de manutenção.

A arquitetura deverá servir como referência durante toda a implementação e ser atualizada sempre que uma decisão estrutural importante for alterada.
