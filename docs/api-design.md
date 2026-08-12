# API Design

## 1. Objetivo

Este documento define o design da API REST do **Professional Management System**.

A API será responsável por fornecer os recursos necessários para autenticação, gerenciamento de profissionais, contatos, departamentos, cargos e dashboard.

O objetivo deste documento é padronizar:

- endpoints;
- métodos HTTP;
- estruturas de request;
- estruturas de response;
- paginação;
- filtros;
- ordenação;
- códigos HTTP;
- autenticação;
- tratamento de erros.

A implementação deverá seguir os contratos definidos neste documento sempre que possível.

---

# 2. Convenções Gerais

## 2.1 Base URL

A API utilizará o prefixo:

```text
/api
```

Exemplo local:

```text
http://localhost:8080/api
```

Em produção, a URL definitiva será definida durante a etapa de deploy.

---

## 2.2 Formato

A comunicação principal será realizada utilizando:

```text
Content-Type: application/json
```

Requests e responses utilizarão JSON, exceto quando não houver corpo de resposta.

---

## 2.3 Versionamento

O MVP não utilizará versionamento explícito na URL.

Estrutura inicial:

```text
/api/professionals
```

Caso futuramente seja necessário manter múltiplas versões incompatíveis da API, poderá ser adotado:

```text
/api/v1/professionals
```

Não será adicionada essa complexidade antecipadamente.

---

# 3. Autenticação

Endpoints administrativos serão protegidos utilizando JWT.

O token deverá ser enviado conforme o mecanismo definido durante a implementação da segurança.

Conceitualmente:

```text
Authorization: Bearer <token>
```

Endpoints públicos inicialmente:

```text
POST /api/auth/login
```

Endpoints administrativos exigirão autenticação.

---

# 4. Auth API

Base:

```text
/api/auth
```

---

## 4.1 Login

```http
POST /api/auth/login
```

### Request

```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

### Validações

- email obrigatório;
- formato de email válido;
- senha obrigatória.

### Response — 200 OK

A estrutura definitiva do token será definida durante a implementação de segurança.

Exemplo conceitual:

```json
{
  "accessToken": "<token>",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": 1,
    "name": "Administrator",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

### Possíveis respostas

```text
200 OK
400 Bad Request
401 Unauthorized
```

---

## 4.2 Usuário autenticado

```http
GET /api/auth/me
```

### Response — 200 OK

```json
{
  "id": 1,
  "name": "Administrator",
  "email": "admin@example.com",
  "role": "ADMIN"
}
```

### Possíveis respostas

```text
200 OK
401 Unauthorized
```

---

## 4.3 Logout

```http
POST /api/auth/logout
```

A API utiliza JWT stateless sem refresh token persistido. Este endpoint retorna
`204 No Content`; o cliente realiza o logout descartando o access token de
forma segura. Não existe blacklist de tokens nesta etapa.

Essa decisão será detalhada durante a implementação da segurança.

---

# 5. Professionals API

Base:

```text
/api/professionals
```

---

## 5.1 Listar profissionais

```http
GET /api/professionals
```

### Query parameters

```text
page
size
search
status
departmentId
positionId
sort
```

### Exemplo

```http
GET /api/professionals?page=0&size=10&search=Brayan&status=ACTIVE&departmentId=1&sort=name,asc
```

### Regras

- `page` começa em 0;
- `size` deverá possuir limite máximo;
- filtros são opcionais;
- `search` realiza pesquisa parcial por nome;
- parâmetros de ordenação deverão ser validados.

### Response — 200 OK

```json
{
  "content": [
    {
      "id": 1,
      "name": "Brayan Favarin",
      "birthDate": "2004-11-17",
      "status": "ACTIVE",
      "department": {
        "id": 1,
        "name": "Technology"
      },
      "position": {
        "id": 1,
        "name": "Software Developer"
      },
      "createdAt": "2026-08-11T17:00:00Z",
      "updatedAt": "2026-08-11T17:00:00Z"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 1,
  "totalPages": 1,
  "first": true,
  "last": true
}
```

---

## 5.2 Buscar profissional por ID

```http
GET /api/professionals/{id}
```

### Response — 200 OK

```json
{
  "id": 1,
  "name": "Brayan Favarin",
  "birthDate": "2004-11-17",
  "status": "ACTIVE",
  "department": {
    "id": 1,
    "name": "Technology"
  },
  "position": {
    "id": 1,
    "name": "Software Developer"
  },
  "contacts": [
    {
      "id": 1,
      "type": "EMAIL",
      "value": "brayan@example.com",
      "label": "Professional"
    },
    {
      "id": 2,
      "type": "MOBILE",
      "value": "+55 48 99999-9999",
      "label": "Personal"
    }
  ],
  "createdAt": "2026-08-11T17:00:00Z",
  "updatedAt": "2026-08-11T17:00:00Z"
}
```

### Possíveis respostas

```text
200 OK
404 Not Found
```

---

## 5.3 Criar profissional

```http
POST /api/professionals
```

### Request

```json
{
  "name": "Brayan Favarin",
  "birthDate": "2004-11-17",
  "departmentId": 1,
  "positionId": 1
}
```

O status poderá ser definido automaticamente como:

```text
ACTIVE
```

### Response — 201 Created

```json
{
  "id": 1,
  "name": "Brayan Favarin",
  "birthDate": "2004-11-17",
  "status": "ACTIVE",
  "department": {
    "id": 1,
    "name": "Technology"
  },
  "position": {
    "id": 1,
    "name": "Software Developer"
  },
  "createdAt": "2026-08-11T17:00:00Z",
  "updatedAt": "2026-08-11T17:00:00Z"
}
```

### Possíveis respostas

```text
201 Created
400 Bad Request
404 Not Found
409 Conflict
```

---

## 5.4 Atualizar profissional

```http
PUT /api/professionals/{id}
```

### Request

```json
{
  "name": "Brayan Miguel Favarin",
  "birthDate": "2004-11-17",
  "departmentId": 1,
  "positionId": 2
}
```

### Response — 200 OK

Retorna o profissional atualizado.

### Possíveis respostas

```text
200 OK
400 Bad Request
404 Not Found
409 Conflict
```

---

## 5.5 Alterar status

```http
PATCH /api/professionals/{id}/status
```

### Request

```json
{
  "status": "INACTIVE"
}
```

### Response — 200 OK

```json
{
  "id": 1,
  "status": "INACTIVE"
}
```

### Possíveis respostas

```text
200 OK
400 Bad Request
404 Not Found
```

---

## 5.6 Excluir profissional

```http
DELETE /api/professionals/{id}
```

### Response

```text
204 No Content
```

Os contatos associados ao profissional poderão ser removidos conforme definido no `database.md`.

### Possíveis respostas

```text
204 No Content
404 Not Found
```

---

# 6. Contacts API

Contatos pertencem a profissionais.

A estrutura principal será:

```text
/api/professionals/{professionalId}/contacts
```

Isso deixa explícita a relação entre os recursos.

---

## 6.1 Listar contatos

```http
GET /api/professionals/{professionalId}/contacts
```

### Response — 200 OK

```json
[
  {
    "id": 1,
    "type": "EMAIL",
    "value": "brayan@example.com",
    "label": "Professional",
    "createdAt": "2026-08-11T17:00:00Z",
    "updatedAt": "2026-08-11T17:00:00Z"
  }
]
```

### Possíveis respostas

```text
200 OK
404 Not Found
```

---

## 6.2 Criar contato

```http
POST /api/professionals/{professionalId}/contacts
```

### Request

```json
{
  "type": "EMAIL",
  "value": "brayan@example.com",
  "label": "Professional"
}
```

### Response — 201 Created

```json
{
  "id": 1,
  "type": "EMAIL",
  "value": "brayan@example.com",
  "label": "Professional",
  "createdAt": "2026-08-11T17:00:00Z",
  "updatedAt": "2026-08-11T17:00:00Z"
}
```

---

## 6.3 Atualizar contato

```http
PUT /api/professionals/{professionalId}/contacts/{contactId}
```

### Request

```json
{
  "type": "MOBILE",
  "value": "+55 48 99999-9999",
  "label": "Personal"
}
```

### Response

```text
200 OK
```

Retorna o contato atualizado.

---

## 6.4 Excluir contato

```http
DELETE /api/professionals/{professionalId}/contacts/{contactId}
```

### Response

```text
204 No Content
```

### Possíveis respostas

```text
204 No Content
404 Not Found
```

---

# 7. Departments API

Base:

```text
/api/departments
```

---

## 7.1 Listar departamentos

```http
GET /api/departments
```

### Query parameters opcionais

```text
search
page
size
sort
```

### Response — 200 OK

```json
{
  "content": [
    {
      "id": 1,
      "name": "Technology",
      "description": "Technology department",
      "professionalCount": 15,
      "createdAt": "2026-08-11T17:00:00Z",
      "updatedAt": "2026-08-11T17:00:00Z"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 1,
  "totalPages": 1
}
```

---

## 7.2 Buscar departamento

```http
GET /api/departments/{id}
```

### Response

```text
200 OK
```

### Erro

```text
404 Not Found
```

---

## 7.3 Criar departamento

```http
POST /api/departments
```

### Request

```json
{
  "name": "Technology",
  "description": "Technology department"
}
```

### Response

```text
201 Created
```

### Possíveis respostas

```text
201 Created
400 Bad Request
409 Conflict
```

---

## 7.4 Atualizar departamento

```http
PUT /api/departments/{id}
```

### Request

```json
{
  "name": "Engineering",
  "description": "Software and infrastructure teams"
}
```

### Response

```text
200 OK
```

---

## 7.5 Excluir departamento

```http
DELETE /api/departments/{id}
```

### Response quando não utilizado

```text
204 No Content
```

### Quando houver profissionais associados

```text
409 Conflict
```

A aplicação não deverá excluir implicitamente profissionais relacionados.

---

# 8. Positions API

Base:

```text
/api/positions
```

---

## 8.1 Listar cargos

```http
GET /api/positions
```

### Query parameters

```text
search
page
size
sort
```

### Response

Estrutura paginada semelhante à utilizada em departamentos.

---

## 8.2 Buscar cargo

```http
GET /api/positions/{id}
```

### Responses

```text
200 OK
404 Not Found
```

---

## 8.3 Criar cargo

```http
POST /api/positions
```

### Request

```json
{
  "name": "Software Developer",
  "description": "Responsible for software development"
}
```

### Responses

```text
201 Created
400 Bad Request
409 Conflict
```

---

## 8.4 Atualizar cargo

```http
PUT /api/positions/{id}
```

### Response

```text
200 OK
```

---

## 8.5 Excluir cargo

```http
DELETE /api/positions/{id}
```

### Quando não houver profissionais associados

```text
204 No Content
```

### Quando estiver sendo utilizado

```text
409 Conflict
```

---

# 9. Dashboard API

Base:

```text
/api/dashboard
```

---

## 9.1 Resumo

```http
GET /api/dashboard/summary
```

### Response

```json
{
  "totalProfessionals": 120,
  "activeProfessionals": 103,
  "inactiveProfessionals": 17,
  "totalDepartments": 8,
  "totalPositions": 14
}
```

---

## 9.2 Profissionais por departamento

```http
GET /api/dashboard/professionals-by-department
```

### Response

```json
[
  {
    "departmentId": 1,
    "departmentName": "Technology",
    "count": 32
  },
  {
    "departmentId": 2,
    "departmentName": "Finance",
    "count": 18
  }
]
```

---

## 9.3 Profissionais por cargo

```http
GET /api/dashboard/professionals-by-position
```

### Response

```json
[
  {
    "positionId": 1,
    "positionName": "Software Developer",
    "count": 20
  }
]
```

---

## 9.4 Profissionais recentes

```http
GET /api/dashboard/recent-professionals
```

### Query parameter opcional

```text
limit
```

O valor padrão é `5`; são aceitos valores de `1` a `20`.

Exemplo:

```http
GET /api/dashboard/recent-professionals?limit=5
```

Profissionais sem departamento ou cargo não aparecem nas agregações por
departamento/cargo. Eles continuam incluídos no resumo e podem aparecer em
`recent-professionals`, com o campo de associação correspondente como `null`.

### Response

```json
[
  {
    "id": 10,
    "name": "Example Professional",
    "status": "ACTIVE",
    "department": {
      "id": 1,
      "name": "Technology"
    },
    "position": {
      "id": 1,
      "name": "Software Developer"
    },
    "createdAt": "2026-08-11T17:00:00Z"
  }
]
```

---

# 10. Paginação

Endpoints com listas potencialmente grandes deverão utilizar paginação.

Formato:

```text
?page=0&size=10
```

Valores iniciais sugeridos:

```text
page = 0
size = 10
```

Um limite máximo deverá impedir tamanhos excessivos de página.

Exemplo:

```text
maximum size = 100
```

---

## Response padrão

```json
{
  "content": [],
  "page": 0,
  "size": 10,
  "totalElements": 0,
  "totalPages": 0,
  "first": true,
  "last": true
}
```

O formato deverá ser consistente entre os endpoints paginados.

---

# 11. Ordenação

Formato:

```text
sort=campo,direcao
```

Exemplo:

```text
sort=name,asc
sort=createdAt,desc
```

Somente campos explicitamente permitidos deverão ser aceitos.

Parâmetros inválidos deverão resultar em erro adequado.

---

# 12. Pesquisa

Parâmetro padrão:

```text
search
```

Exemplo:

```http
GET /api/professionals?search=Brayan
```

Inicialmente a pesquisa será utilizada principalmente para nomes.

A pesquisa deverá ser case-insensitive quando apropriado.

---

# 13. Filtros de Professional

Filtros suportados inicialmente:

```text
search
status
departmentId
positionId
```

Exemplo:

```http
GET /api/professionals?status=ACTIVE&departmentId=1&positionId=2
```

Os filtros deverão poder ser combinados.

---

# 14. Status HTTP

A API deverá utilizar códigos HTTP semanticamente adequados.

| Código | Utilização |
|---|---|
| 200 | Requisição executada com sucesso |
| 201 | Recurso criado |
| 204 | Operação concluída sem corpo |
| 400 | Request inválido |
| 401 | Usuário não autenticado |
| 403 | Usuário autenticado sem permissão |
| 404 | Recurso não encontrado |
| 409 | Conflito com estado atual dos dados |
| 500 | Erro inesperado |

---

# 15. Estrutura de Erros

Erros deverão possuir formato consistente.

Exemplo:

```json
{
  "timestamp": "2026-08-11T17:00:00Z",
  "status": 404,
  "error": "Not Found",
  "code": "PROFESSIONAL_NOT_FOUND",
  "message": "Professional not found",
  "path": "/api/professionals/10"
}
```

---

## 15.1 Erro de validação

Exemplo:

```json
{
  "timestamp": "2026-08-11T17:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "path": "/api/professionals",
  "fields": {
    "name": "Name is required",
    "birthDate": "Birth date must be in the past"
  }
}
```

---

# 16. Códigos de Erro

A API poderá fornecer códigos internos estáveis para facilitar o tratamento pelo frontend.

Exemplos:

```text
VALIDATION_ERROR

PROFESSIONAL_NOT_FOUND
CONTACT_NOT_FOUND
DEPARTMENT_NOT_FOUND
POSITION_NOT_FOUND

DEPARTMENT_IN_USE
POSITION_IN_USE

DUPLICATE_DEPARTMENT
DUPLICATE_POSITION

INVALID_CREDENTIALS
UNAUTHORIZED
FORBIDDEN
```

Esses códigos poderão ser refinados durante a implementação.

---

# 17. Validações

## Professional

```text
name
- obrigatório
- limite de caracteres

birthDate
- opcional
- deve estar no passado quando preenchido

departmentId
- deve referenciar departamento existente quando preenchido

positionId
- deve referenciar cargo existente quando preenchido
```

---

## Contact

```text
type
- obrigatório
- deve pertencer aos tipos suportados

value
- obrigatório

EMAIL
- deve possuir formato válido quando type = EMAIL

label
- opcional
```

---

## Department

```text
name
- obrigatório
- único
- limite de caracteres

description
- opcional
```

---

## Position

```text
name
- obrigatório
- único
- limite de caracteres

description
- opcional
```

---

## Login

```text
email
- obrigatório
- formato válido

password
- obrigatória
```

---

# 18. DTOs

A API deverá utilizar contratos específicos de entrada e saída.

Estrutura sugerida:

```text
dto/

auth/
├── LoginRequest
├── LoginResponse
└── AuthenticatedUserResponse

professional/
├── CreateProfessionalRequest
├── UpdateProfessionalRequest
├── UpdateProfessionalStatusRequest
├── ProfessionalResponse
├── ProfessionalDetailsResponse
└── ProfessionalSummaryResponse

contact/
├── CreateContactRequest
├── UpdateContactRequest
└── ContactResponse

department/
├── DepartmentRequest
└── DepartmentResponse

position/
├── PositionRequest
└── PositionResponse

dashboard/
├── DashboardSummaryResponse
├── DepartmentProfessionalCountResponse
├── PositionProfessionalCountResponse
└── RecentProfessionalResponse

common/
├── PageResponse
└── ApiErrorResponse
```

Os nomes poderão ser adaptados se o código existente possuir uma convenção melhor e compatível com a arquitetura.

---

# 19. Segurança dos Responses

A API nunca deverá retornar:

```text
password
passwordHash
JWT secret
credenciais
configurações internas
stack traces
```

Informações técnicas sensíveis não deverão ser expostas em erros de produção.

---

# 20. Idempotência

Operações `GET`, `PUT` e `DELETE` deverão respeitar a semântica HTTP sempre que possível.

`PUT` representará atualização do recurso conforme o contrato estabelecido.

Alterações específicas, como mudança de status, poderão utilizar `PATCH`.

---

# 21. Swagger / OpenAPI

Os endpoints implementados são documentados por Springdoc OpenAPI.

A documentação deverá informar:

- objetivo;
- parâmetros;
- request body;
- response body;
- autenticação;
- possíveis status;
- schemas;
- exemplos quando úteis.

Swagger UI está disponível em desenvolvimento e teste em:

```text
http://localhost:8080/swagger-ui/index.html
```

A especificação JSON está disponível em:

```text
http://localhost:8080/v3/api-docs
```

Em produção, Swagger UI e OpenAPI JSON ficam desabilitados por padrão.

---

# 22. CORS

O backend deverá aceitar apenas origens configuradas.

Desenvolvimento:

```text
http://localhost:3000
```

Produção:

```text
domínio real do frontend
```

Nenhuma origem de produção deverá ser fixada diretamente no código.

---

# 23. Contratos entre Frontend e Backend

O frontend deverá depender dos contratos documentados neste arquivo e da especificação OpenAPI.

Mudanças incompatíveis deverão ser tratadas como mudanças de contrato.

Exemplo:

Alterar:

```text
positionId
```

para:

```text
jobId
```

não deverá ocorrer arbitrariamente depois que frontend e backend estiverem integrados.

---

# 24. Regras para Controllers

Controllers deverão:

- receber requests;
- validar DTOs;
- delegar processamento para services;
- retornar status HTTP;
- retornar DTOs.

Controllers não deverão:

- acessar repositories diretamente;
- implementar regras de negócio complexas;
- retornar entidades JPA diretamente;
- executar consultas manualmente.

---

# 25. Regras para Services

Services deverão:

- executar casos de uso;
- aplicar regras de negócio;
- validar existência de recursos;
- coordenar repositories;
- controlar transações quando necessário;
- lançar exceções apropriadas.

---

# 26. Regras para Repositories

Repositories deverão ser responsáveis exclusivamente pela persistência e consulta de dados.

Queries específicas deverão possuir nomes claros e evitar lógica de negócio dentro da camada de persistência.

---

# 27. Compatibilidade com o código atual

O projeto já possui uma API existente.

Durante a refatoração, os contratos atuais deverão ser analisados antes de qualquer remoção.

A estratégia será:

```text
1. identificar endpoints existentes;
2. comparar com este documento;
3. reaproveitar implementações compatíveis;
4. refatorar implementações parcialmente compatíveis;
5. remover somente código comprovadamente obsoleto;
6. criar recursos ausentes.
```

Não será realizada reescrita completa sem necessidade técnica.

---

# 28. Endpoints do MVP

Resumo dos principais endpoints:

```text
AUTH

POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/logout


PROFESSIONALS

GET    /api/professionals
GET    /api/professionals/{id}
POST   /api/professionals
PUT    /api/professionals/{id}
PATCH  /api/professionals/{id}/status
DELETE /api/professionals/{id}


CONTACTS

GET    /api/professionals/{professionalId}/contacts
POST   /api/professionals/{professionalId}/contacts
PUT    /api/professionals/{professionalId}/contacts/{contactId}
DELETE /api/professionals/{professionalId}/contacts/{contactId}


DEPARTMENTS

GET    /api/departments
GET    /api/departments/{id}
POST   /api/departments
PUT    /api/departments/{id}
DELETE /api/departments/{id}


POSITIONS

GET    /api/positions
GET    /api/positions/{id}
POST   /api/positions
PUT    /api/positions/{id}
DELETE /api/positions/{id}


DASHBOARD

GET    /api/dashboard/summary
GET    /api/dashboard/professionals-by-department
GET    /api/dashboard/professionals-by-position
GET    /api/dashboard/recent-professionals
```

---

# 29. Melhorias Futuras

Após o MVP poderão ser avaliados:

- refresh tokens;
- administração de usuários;
- roles adicionais;
- auditoria;
- soft delete;
- exportações;
- endpoints para relatórios;
- busca avançada;
- filtros por datas;
- bulk operations;
- upload de arquivos;
- API versionada;
- rate limiting.

Esses recursos não fazem parte do contrato inicial.

---

# 30. Resultado Esperado

O design definido neste documento deverá fornecer contratos previsíveis entre frontend e backend, reduzir ambiguidades durante a implementação e facilitar testes, documentação e manutenção.

Mudanças significativas nos contratos deverão ser refletidas neste documento e na documentação OpenAPI.
