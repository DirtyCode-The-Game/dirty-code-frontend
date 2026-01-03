# Dirty Code - The Game

<p align="center">
  <img src="https://img.shields.io/badge/Java-25-orange" alt="Java 25">
  <img src="https://img.shields.io/badge/Spring%20Boot-4.0.1-brightgreen" alt="Spring Boot">
  <img src="https://img.shields.io/badge/Next.js-15-black" alt="Next.js">
</p>

## 🚀 Como participar do projeto

Para contribuir com o Dirty Code, siga rigorosamente as regras abaixo:

### 🌿 Padronização de Branchs
- Toda branch deve seguir o padrão: `DCTG-NumeroDaTask` (Exemplo: `DCTG-42`).
- Branches devem ser abertas a partir da `DEVELOP`.

### 🔃 Pull Requests (PR)
- PRs devem ser abertos **sempre** apontando para a branch `DEVELOP`.
- PRs devem ser pequenos e focados em uma única tarefa/funcionalidade.
- PRs no backend **devem** conter logs seguindo o padrão já estabelecido no projeto.
- Não serão mergeados códigos sem uma tarefa prevista no board. Caso encontre um bug, crie a tarefa antes de corrigi-lo.

### 🛡️ Merges e Administração
- Usuários não administradores **não estão autorizados** a realizar o MERGE.
- O merge deve ser feito exclusivamente por um **ADMIN**.

---

## 💻 Configuração do Ambiente

O projeto é composto por um Backend (Spring Boot) e um Frontend (Next.js).

### ☕ Backend

#### Perfis de Ambiente
- **Padrão (Offline/Local)**: Utiliza banco de dados H2 (em memória) e não requer integrações externas (Firebase/Google). Ideal para novos desenvolvedores.
- **DEV / QA**: Perfis que utilizam integrações reais.
    - **Atenção**: Arquivos `.env` ou configurações destes perfis contêm chaves sensíveis e **não são compartilhados** por segurança. O uso é restrito a admins ou pessoas autorizadas.

#### Como subir o Backend:
1. Certifique-se de ter o **Java 25** instalado.
2. Execute o comando: `./gradlew bootRun`
3. O backend estará disponível em `http://localhost:8080/dirty-code`
4. Console do H2: `http://localhost:8080/dirty-code/h2-console` (JDBC URL: `jdbc:h2:mem:dirtycode`)

### 🌐 Frontend

#### Como subir o Frontend:
1. Acesse a pasta do frontend: `cd ../dirty-code-frontend`
2. Instale as dependências: `npm install`
3. Inicie o servidor: `npm run dev`
4. O frontend estará disponível em `http://localhost:3000`

---