# Student Bus

## ⚙️ Dependências

<details>
  <summary><a>bcryptjs</a></summary>

```sh
$ npm i bcryptjs

# Instalação das tipagens
$ npm i @types/bcryptjs -D
```

</details>

---

<details>
  <summary><a>Commitizen</a></summary>

```sh
$ npm i commitizen -D

# Configuração do Commitizen
$ npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

Atualizar `.git/hooks/prepare-commit-msg` com o código:

```sh
#!/bin/bash
exec < /dev/tty && node_modules/.bin/cz --hook || true
```

</details>

---

<details>
  <summary><a>Dotenv</a></summary>

```sh
$ npm i dotenv
```

</details>

---

<details>
  <summary><a>ESLint</a></summary>

```sh
$ npm i eslint -D

# Instalando o plugin ESLint da Rocketseat para formatação do código
$ npm i @rocketseat/eslint-config

# Configuração do ESlint (opcional)
$ npx eslint --init

```

Adicionar ao `.eslintrc.json`:

```json
{
  "extends": "@rocketseat/eslint-config/node",
  "rules": {
    "camelcase": "off",
    "no-useless-constructor": "off"
  }
}
```

> Alterar o arquivo `node.js` nas dependências do plugin em **node_modules** para aceitar ponto e vírgula ao final das linhas.

</details>

---

<details>
  <summary><a>Faker-js</a></summary>

```sh
# Lib para gerar dados fictícios
$ npm i @faker-js/faker -D
```

</details>

---

<details>
  <summary><a>Fastify</a></summary>

```sh
$ npm i fastify

# Lib integrada ao fastify para a criação de Json Web Tokens
$ npm i @fastify/jwt
```

</details>

---

<details>
  <summary><a>Semantic-release</a></summary>

```sh
$ npm i semantic-release -D

# Plugins adicionais
$ npm i @semantic-release/git @semantic-release/changelog -D
```

Arquivo de configuração do semantic-release, ``.releaserc.json`:

```json
{
  "branches": ["main", { "name": "alpha", "prerelease": true }],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/github",
    "@semantic-release/changelog",
    [
      "@semantic-release/git",
      {
        "assets": ["package.json", "package-lock.json", "CHANGELOG.md"],
        "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ]
  ]
}
```

</details>

---

<details>
  <summary><a>Supertest</a></summary>

```sh
# Realiza as chamadas HTTP dos testes para a aplicação sem a necessidade de colocar a aplicação no ar
$ npm i supertest -D
```

</details>

---

<details>
  <summary><a>TypeScript</a></summary>

```sh
# Instalação do TypeScript e das tipagens para node
$ npm i typescript @types/node -D

# Inicializando o TypeScript
$ npx tsc --init

# Permite que o node execute código TypeScript
$ npm i tsx -D

# Realiza a conversão do código de TypeScrip para JavaScript (build)
$ npm i tsup -D
```

</details>

---

<details>
  <summary><a>Vitest</a></summary>

```sh
$ npm i vitest -D

# Plugin para que o vitest consiga entender os paths configurados no tsconfig
$ npm i vite-tsconfig-paths -D

# Interface para visualizar e executar os testes
$ npm i @vitest/ui -D
```

Criar arquivo de configuração do Vitest (`vite.config.ts`):

> Adicionando o plugin nas configurações do Vitest

```ts
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
});
```

Adicionar os scripts de testes ao `package.json`:

```json
"scripts": {
  ...
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage",
  "test:ui": "vitest --ui"
},
```

### Test Environment no Vitest

- É necessário criar uma pasta com o nome `vitest-environment-[name]` e iniciar um projeto node dentro dela. Nesse caso à criei na pasta **prisma**.

```sh
# Criando um projeto node em `vitest-environment-prisma`
$ npm init -y
```

- Alterações no `package.json` em **vitest-environment-prisma**:

```json
{
  // Nome do arquivo de execução dentro de "vitest-environment-prisma"
  "main": "setup-e2e.ts"
}
```

> Criar o arquivo de execução. Neste caso é o arquivo `setup-e2e.ts`.

- Adicionar ao **defineConfig** no arquivo `vite.config.ts`:

```ts
test: {
  // O segundo elemento do array environmentMatchGlobs, deve ser exatament o nome ao final de vitest-environmemnt-[name]
  // Nesse caso, vitest-environment-prisma
  environmentMatchGlobs: [['src/infra/http/controllers/**', 'prisma']],
}
```

- Necessário instalar o `npm-run-all` para rodar os scripts de teste e2e.

```sh
# Executar scripts, os convertendo para funcionar de acordo com o SO que esteja usando
$ npm i npm-run-all -D
```

- Atualizar os scripts de teste para:

```json
"scripts": {
  ...
  "test:create-prisma-environment": "npm link ./prisma/vitest-environment-prisma",
  "test:install-prisma-environment": "npm link vitest-environment-prisma",
  "test": "vitest run --dir src/domain/use-cases",
  "test:watch": "vitest --dir src/domain/use-cases",
  "pretest:e2e": "run-s test:create-prisma-environment test:install-prisma-environment",
  "test:e2e": "vitest run --dir src/infra/http",
  "test:e2e:watch": "vitest --dir src/infra/http",
  "test:coverage": "vitest run --coverage",
  "test:ui": "vitest --ui"
}
```

</details>

---

<details>
  <summary><a>Zod</a></summary>
  
  ```sh
  $ npm i zod
  ```
</details>

---
