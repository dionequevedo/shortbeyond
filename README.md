# ShortBeyond - Automação de Testes de API com Playwright

Este repositório contém a suíte de automação de testes de API RESTful para a aplicação **ShortBeyond**, desenvolvida em JavaScript/Node.js utilizando o **Playwright Test Runner**.

A arquitetura do projeto foi desenhada para garantir a facilidade de manutenção, isolamento de ambiente e segurança no gerenciamento de credenciais, empregando **Dotenv** para variáveis de ambiente e **Podman** para a orquestração dos contêineres da aplicação e banco de dados.

---

## 🛠️ Tecnologias e Ferramentas

- **[Playwright Test (`@playwright/test`)](https://playwright.dev/):** Framework para execução automatizada de testes HTTP/API com suporte nativo a contextos de requisição (`APIRequestContext`).
- **[Dotenv](https://github.com/motdotla/dotenv):** Gerenciamento e carregamento dinâmico de credenciais e variáveis de ambiente a partir do arquivo `.env`.
- **[Podman](https://podman.io/):** Motor de contêineres *rootless* utilizado para subir a infraestrutura completa da aplicação (API, Banco de Dados PostgreSQL, Frontend e Adminer).
- **[@faker-js/faker](https://fakerjs.dev/):** Geração dinâmica de dados sintéticos para testes.
- **Node.js (v18+ / v20+):** Ambiente de execução JavaScript.

---

## 🚀 Melhorias de Código e Ampliação de Cobertura

Recentemente, a suíte de testes passou por refatorações e ampliação da cobertura para elevar a maturidade do projeto e a qualidade das validações:

1. **Validação de Respostas HTML no Redirecionamento (`GET /{code}`):**
   - Implementada verificação do cabeçalho `Content-Type: text/html`.
   - Adicionada leitura do corpo da resposta via `response.text()` para confirmar a integridade e estrutura do documento HTML (`<!doctype html>`).

2. **Asserção Completa de Coleções (`GET /api/links`):**
   - A verificação da listagem de links foi ampliada para iterar sobre todos os itens retornados no array de dados (`responseBody.data`).
   - Garante que cada item retornado possua as propriedades `id` (ULID válido), `original_url`, `short_code` (com exatamente 5 caracteres) e `title` devidamente preenchidas e tipadas.

3. **Custom Matchers Estendidos:**
   - Integração do matcher customizado `toBeULID()` para asserção de identificadores únicos no padrão ULID.

4. **Padronização de Massas de Teste (Factories):**
   - Ajustes nas factories (`userBR.js`) para geração de e-mails dinâmicos alinhados com o domínio aceito pela aplicação (`@dionequevedo.com.br`).

5. **Ampliação da Suíte (29 testes automatizados):**
   - 29 cenários de teste divididos em 4 suítes principais (`auth`, `health`, `links`, `redirect`), cobrindo cenários de sucesso, validações de parâmetros, regras de negócio e tratamento de exceções.

---

## 🏗️ Arquitetura da Infraestrutura (Podman)

Os serviços necessários para a execução dos testes são orquestrados através do manifesto Kubernetes/Podman `shortbeyond.yaml`. Ao subir o Pod no Podman, os seguintes contêineres são disponibilizados:

| Contêiner | Imagem | Porta Host | Descrição |
| :--- | :--- | :--- | :--- |
| `shortb-db` | `postgres:15` | `5432` | Banco de dados PostgreSQL (`ShortDB`) |
| `shortb-api` | `beyondtest/shortb-api:latest` | `3333` | API REST sob teste |
| `shortb-web` | `beyondtest/shortb-web:latest` | `80` | Interface web da aplicação |
| `shortb-adminer` | `adminer:latest` | `8080` | Interface gráfica de gerenciamento do banco de dados |

---

## 📁 Estrutura do Projeto

```text
.
├── .env                       # Variáveis de ambiente e credenciais (não comitar segredos)
├── playwright.config.js       # Configuração global do Playwright e integração com dotenv
├── shortbeyond.yaml           # Arquivo de especificação do Podman (Kube manifest)
├── package.json               # Dependências do projeto Node.js
└── playwright/
    ├── e2e/                   # Suítes de testes de API (.spec.js)
    │   ├── auth/              # Testes do módulo de autenticação (login, cadastro)
    │   ├── health/            # Testes de verificação de saúde da API
    │   ├── links/             # Testes das rotas de encurtamento, listagem e remoção de links
    │   └── redirect/          # Testes de redirecionamento de links (respostas HTML)
    └── support/               # Camada de suporte e abstrações
        ├── factories/         # Geradores de massa de dados de teste (Faker)
        ├── fixtures/          # Injeção de dependências e fixtures de teste
        ├── matchers/          # Custom matchers/assertions estendidos (ex: toBeULID)
        └── services/          # Service Objects (abstração das chamadas HTTP da API)
```

### Padrões de Projeto Utilizados

1. **Service Object Pattern (`playwright/support/services/`):** Abstrai as chamadas HTTP para a API em classes/módulos reutilizáveis (`auth.js`, `links.js`), desacoplando a regra de negócio das especificações de teste.
2. **Factory Pattern (`playwright/support/factories/`):** Abstrai a criação de objetos e payloads para os testes utilizando o `@faker-js/faker`.
3. **Fixture Pattern (`playwright/support/fixtures/`):** Disponibiliza os serviços diretamente nas especificações de teste através de injeção de dependências.
4. **Environment Management (`dotenv`):** As variáveis registradas no `.env` (como `BASE_URL`, `USER_LOGIN` e `PASSWORD_LOGIN`) são automaticamente injetadas na configuração do Playwright (`playwright.config.js`).

---

## 🚀 Como Executar o Projeto

### 1. Pré-requisitos

Certifique-se de ter instalado em sua máquina:
- **Node.js** (versão 18 ou superior)
- **npm** (gerenciador de pacotes)
- **Podman** (gerenciador de contêineres)

### 2. Instalação das Dependências

Instale as dependências do projeto Node.js:

```bash
npm install
```

### 3. Configuração do Arquivo `.env`

Crie ou valide o arquivo `.env` na raiz do projeto contendo as credenciais e a URL base da API:

```env
USER_LOGIN=dione@dionequevedo.com.br
PASSWORD_LOGIN=suasenhaaqui
BASE_URL=http://localhost:3333
```

### 4. Inicialização do Ambiente com Podman

Suba o pod com todos os contêineres necessários (API, Banco de Dados, Web e Adminer) executando:

```bash
podman play kube shortbeyond.yaml
```

Para verificar se todos os contêineres estão em execução:

```bash
podman ps
```

---

## 🧪 Execução dos Testes

### Executar todos os testes de API em modo headless:

```bash
npx playwright test
```

### Executar os testes utilizando a interface interativa (UI Mode):

```bash
npx playwright test --ui
```

### Executar uma suíte específica:

```bash
npx playwright test playwright/e2e/redirect/get.spec.js
```

### Visualizar o relatório HTML da última execução:

```bash
npx playwright show-report
```

---

## 🔴 Finalização do Ambiente

Para parar e remover o pod e os contêineres criados no Podman:

```bash
podman play kube --down shortbeyond.yaml
```
