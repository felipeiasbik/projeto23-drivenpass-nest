# DrivenPass (Back-end) 
<img src="https://notion-emojis.s3-us-west-2.amazonaws.com/prod/svg-twitter/1f512.svg" alt="Driven Pass Logo" width="37" height="40">

##### Neste repositório você encontrará a API de um gerenciador de senhas. A aplicação permite utilizar-se de uma senha mestre segura, armazenando outras de diferentes plataformas. Este repositório contém o código-fonte do back-end do projeto.

##### Algumas tecnologias usadas no projeto: *Node.js, Nest.js, TypeScript, Prisma e Jest*.

### Visão Geral

O Driven Pass é uma aplicação que permite ao usuário acessar de forma segura os dados referentes a senhas de diferentes plataformas. Nele é possível armazenar desde informações de Wi-Fi a dados secretos de cartões de crédito.

Este projeto foi construído por:

- [Felipe Iasbik](https://github.com/felipeiasbik)

A **documentação oficial** pode ser acessada [aqui](https://drivenpass-e6yq.onrender.com/api).

### Principais recursos:

- Registro e login de usuários;
- Exclusão de usuário e todas as informações registradas;
- Registro, busca e deleção de credenciais;
- Registro, busca e deleção de notas;
- Registro, busca e deleção de cartões;


O projeto ainda conta com testes automatizados e documentação descrevendo os recursos. :)

### Como utilizar:
- Clone o repositório;
- Digite o seguinte comando na raíz do projeto:

  ```
  npm i
  ```
- Crie um arquivo .env;
- Crie um banco de dados no PostgreSQL;
- O seu arquivo .env deverá ficar da seguinte forma:

```
DATABASE_URL=postgres://SEUUSUARIO:SUASENHA@localhost:5432/SEUBANCODEDADOS
JWT_SECRET=CHAVE_SECRETA_EXEMPLO_#$1234abcd
CRYPTR_SECRET=CHAVE_SECRETA_EXEMPLO_#$1234abcd
```

### Para rodar o projeto:

###### Desenvolvimento:

```
npm run start
```

###### Modo de visualização:
```
npm run start:dev
```

###### Modo de produção:
```
npm run start:prod
```

### Para testar o projeto:

###### Testes e2e:

```
npm run test:e2e
```

###### Testes de cobertura:
```
npm run test:cov
```


### OBRIGADO PELA VISITA :D
