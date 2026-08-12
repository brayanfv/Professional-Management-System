# Roadmap

## 1. Objetivo

Este documento define o planejamento de desenvolvimento do **Professional Management System**.

O roadmap organiza o projeto em fases incrementais, permitindo que cada etapa seja implementada, revisada e validada antes do início da próxima.

Cada fase possui objetivos claros, funcionalidades previstas e prioridades, reduzindo riscos durante o desenvolvimento e facilitando a evolução do sistema.

---

# 2. Priorização

As tarefas serão classificadas utilizando três níveis de prioridade.

## P0 — Essencial

Funcionalidades obrigatórias para que o sistema seja considerado um MVP funcional.

## P1 — Importante

Funcionalidades que agregam valor ao MVP, mas podem ser implementadas após sua conclusão.

## P2 — Futuro

Melhorias e funcionalidades planejadas para versões posteriores do sistema.

---

# 3. Roadmap de Desenvolvimento

## Fase 0 — Foundation (P0)

### Objetivo

Preparar toda a estrutura do projeto para permitir um desenvolvimento organizado e escalável.

### Backend

- Revisar a estrutura atual do projeto.
- Atualizar dependências quando necessário.
- Padronizar a organização dos pacotes.
- Configurar perfis da aplicação (Development e Production).
- Configurar variáveis de ambiente.
- Docker + Docker Compose para desenvolvimento local — configurados; validação runtime depende de Docker Desktop.
- Configurar Flyway para migrations.
- Revisar configurações do PostgreSQL.

### Frontend

- Criar projeto Next.js.
- Configurar TypeScript.
- Configurar Tailwind CSS.
- Configurar Shadcn UI.
- Configurar ESLint.
- Configurar Prettier.
- Definir estrutura inicial de diretórios.

### Critérios de conclusão

- Backend inicial organizado.
- Frontend criado.
- Banco configurado.
- Projeto executando localmente.

---

## Fase 1 — Modelagem do Domínio (P0)

### Objetivo

Modelar todas as entidades principais do sistema.

### Entidades

- User
- Professional
- Contact
- Department
- Position

### Atividades

- Definir entidades.
- Definir atributos.
- Definir relacionamentos.
- Criar migrations.
- Revisar modelo relacional.

### Critérios de conclusão

- Modelo de dados finalizado.
- Relacionamentos definidos.
- Banco preparado para desenvolvimento.

---

## Fase 2 — Backend Core (P0)

### Objetivo

Implementar toda a estrutura principal da API.

### Funcionalidades

- CRUD de profissionais.
- CRUD de contatos.
- CRUD de departamentos.
- CRUD de cargos.

### Componentes

- Controllers
- Services
- Repositories
- DTOs
- Mappers
- Validações
- Exception Handler

### Recursos

- Paginação.
- Ordenação.
- Pesquisa.
- Filtros.
- Respostas padronizadas.

### Critérios de conclusão

- API funcional.
- Endpoints documentados.
- Principais regras de negócio implementadas.

---

## Fase 3 — Segurança (P0)

### Objetivo

Adicionar autenticação e autorização.

### Funcionalidades

- Login.
- Logout.
- JWT.
- Spring Security.
- Usuário administrador.
- Roles.
- Proteção de endpoints.

### Critérios de conclusão

- Apenas usuários autenticados acessam recursos protegidos.
- Tokens funcionando corretamente.

---

## Fase 4 — Dashboard (P1)

### Objetivo

Disponibilizar indicadores administrativos.

### Funcionalidades

- Total de profissionais.
- Profissionais ativos.
- Profissionais inativos.
- Distribuição por departamento.
- Distribuição por cargo.
- Últimos profissionais cadastrados.

### Critérios de conclusão

- Dashboard consumindo dados reais da API.

---

## Fase 5 — Frontend (P0)

### Objetivo

Desenvolver toda a interface web do sistema.

### Páginas

- Login.
- Dashboard.
- Profissionais.
- Contatos.
- Departamentos.
- Cargos.
- Perfil.

### Componentes

- Sidebar.
- Navbar.
- Tabelas.
- Formulários.
- Modais.
- Cards.
- Paginação.

### Recursos

- Loading.
- Empty State.
- Mensagens de sucesso.
- Mensagens de erro.
- Responsividade.

### Critérios de conclusão

- Interface totalmente funcional.
- Integração completa com a API.

---

## Fase 6 — Integração (P0)

### Objetivo

Integrar frontend, backend e banco de dados.

### Atividades

- Configurar Axios.
- Criar camada de serviços.
- Configurar autenticação.
- Configurar interceptadores.
- Tratamento de erros.
- Controle de sessão.

### Critérios de conclusão

- Sistema funcionando de ponta a ponta.

---

## Fase 7 — Qualidade (P1)

### Objetivo

Melhorar a confiabilidade e a manutenção do projeto.

### Atividades

- Testes unitários.
- Testes de integração.
- Refatorações.
- Revisão de código.
- Documentação Swagger.
- Revisão do README.
- Revisão da documentação técnica.

### Critérios de conclusão

- Projeto estável.
- Testes executando com sucesso.
- Documentação atualizada.

---

## Fase 8 — Deploy (P0)

### Objetivo

Publicar o sistema em ambiente de produção.

### Backend

- Publicação da API.

### Frontend

- Publicação da aplicação web.

### Banco

- PostgreSQL em ambiente remoto.

### Infraestrutura

- HTTPS.
- Variáveis de ambiente.
- Configuração de domínio.
- Monitoramento básico.

### Critérios de conclusão

- Sistema disponível publicamente.
- Frontend integrado ao backend.
- Banco remoto funcionando.
- README atualizado com instruções de acesso.

---

# 4. Melhorias Futuras (P2)

Após a conclusão do MVP, poderão ser desenvolvidas novas funcionalidades.

## Funcionalidades planejadas

- Recuperação de senha.
- Upload de foto do profissional.
- Upload de documentos.
- Exportação para PDF.
- Exportação para Excel.
- Histórico de alterações.
- Auditoria completa.
- Notificações.
- Dashboard avançado.
- Permissões mais granulares.
- Multiempresa (Multi-Tenant).
- API pública.
- Aplicativo mobile.

---

# 5. Fluxo de Desenvolvimento

Cada fase seguirá obrigatoriamente o seguinte processo:

1. Planejamento.
2. Documentação.
3. Arquitetura.
4. Implementação.
5. Revisão.
6. Testes.
7. Aprovação.
8. Commit.
9. Deploy (quando aplicável).

Nenhuma fase deverá ser iniciada antes da conclusão e validação da fase anterior.

---

# 6. Situação Atual

| Etapa | Status |
|--------|--------|
| Product Overview | ✅ Concluído |
| Requirements | ✅ Concluído |
| Roadmap | ✅ Concluído |
| Architecture | ⏳ Próxima etapa |
| Database | ⏳ Pendente |
| API Design | ⏳ Pendente |
| Implementação | ⏳ Pendente |
| Revisão | ⏳ Pendente |
| Deploy | ⏳ Pendente |

---

# 7. Objetivo Final

Ao término deste roadmap, o **Professional Management System** deverá ser uma aplicação full stack moderna, documentada, testada e publicada em ambiente de produção, servindo como projeto principal do portfólio e demonstrando competências em arquitetura de software, desenvolvimento backend, frontend, banco de dados, segurança, testes, Docker e deploy.
