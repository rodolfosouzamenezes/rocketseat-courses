# DT Money - [VER DEPLOY](https://dt-money-three-rust.vercel.app)

Projeto para controle fincanceiro

![thumbnail](./docs/thumbnail.png)

## Tecnologias

<p align="start">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=vite,react,typescript,styledcomponents" />
    <img src="https://react-hook-form.com/images/logo/react-hook-form-logo-only.svg" height="50" width="50" alt="React Hook Form logo"  />
    <img src="https://avatars.githubusercontent.com/u/75042455?s=280&v=4" height="50" width="50" style="border-radius:20%" alt="Radix UI logo"  />
  </a>
</p>

## Manual de uso

### Inicialiando o servidor - [http://localhost:3333/](http://localhost:3333/)

Nesse projeto usamos as estratégia do JSON Server para simular requisições, siga os camandos abaixo para rodar o servidor:

```sh
npm install
```

```sh
npm run dev:server
```

Você tem a opção do [my-json-server](https://my-json-server.typicode.com) para "hospedar" sua API, nesse caso será necessário criar um arquivo `.env` com a URL do seu projeto:

```sh
## Usando JSON SERVER podemos usar o my-json-server para consumir nosso JSON, 
## Lembrando que ele deve estar nomeado como 'db.json' 
VITE_API="https://my-json-server.typicode.com/seu-github-user/seu-repositorio"
```

### Inicialiando o site - [http://localhost:5173/](http://localhost:5173/)

```sh
npm install
```

```sh
npm run dev
```