# Forca chat3desk

API desafio jogo da forca - chat2desk.

## Dependências

- [Node.js v14.17](https://nodejs.org/en/)
- [Express v4.17.1](https://expressjs.com/pt-br/)
- [Axios v0.23.0](https://www.npmjs.com/package/axios)
- [PostgreSQL v13](https://www.postgresql.org/)
- [Sequelize v6](https://sequelize.org/)
- [Dotenv v10](https://www.npmjs.com/package/dotenv)

## Dependências para desenvolvimento e execução dos testes

- [Jest v27](https://jestjs.io/pt-BR/)
- [Supertest v6.1](https://www.npmjs.com/package/supertest)
- [Sqlite v5](https://www.sqlite.org/index.html)
- [Sequelize CLI v6.2](https://sequelize.org/)

Caso se deseje instalar as dependências das bases de dados (PostgreSQL) via docker basta instalar as ferramentas de containerização e executar o docker-compose.

- [Docker](https://www.docker.com/)
- [Docker-compose](https://docs.docker.com/compose/)

```
sudo docker-compose up -d
```

## Instalação

Após a instalação e configuração das dependências, instale o projeto executando o comando NPM.

```
npm install
```

Crie um arquivo `.env` na raiz do repositório preenchendo os valores das variáveis presentes no arquivo [.env.example](.env.example)

Para a execução dos testes crie um arquivo `.env.test` na raiz do repositório preenchendo os valores das variáveis presentes no arquivo [.env.test.example](.env.test.example)

Para finalizar a instalação, configure o banco de dados que será integrado ao projeto.

Após configurar o bando de dados deve rodar o comando do sequelize-cli para executar as migrations:

```
npx sequelize db:migrate
```

Para desfazer as migrations, basta executar o comando:

```
npx sequelize db:migrate:undo:all
```

Finalmente, teste a instalação executando o projeto em modo de desenvolvimento.

```bash
npm run dev  # Inicia o projeto em modo de desenvolvimento
```

```bash
npm run test  # Executa todos os testes do projeto
```
