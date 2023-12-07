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

Arquivo de configuração do semantic-release (`.releaserc.json`):

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
  <summary><a>TSyringe</a></summary>

```sh
# Instalação Tsyringe para injeção automatica de dependências
$ npm i tsyringe

# Necessário instalar o `reflect-metadata`
$ npm i reflect-metadata
```

- Modificar o `tsconfig.json` para incluir as seguintes configurações:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

- Configurações do `app.ts` para o funcionamento do tsyringe:

```ts
// Deve ser importada na primeira linha do arquivo
import 'reflect-metadata'
...
import '@infra/container'
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

- Criar arquivo de configuração do Vitest (`vite.config.ts`):

> Adicionando o plugin nas configurações do **Vitest**

```ts
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    globals: true,
    root: './',
  },
  plugins: [tsconfigPaths()],
});
```

> A configuração `globals` torna as funções do **Vitest** globais. Mas é necessário adicionar o código abaixo no `tsconfig.json`:

```json
{
  "compilerOptions": {
    ...
    "types": [
      "vitest/globals"
    ],
    ...
  }
}
```

- Adicionar os scripts de testes ao `package.json`:

```json
"scripts": {
  ...
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage",
  "test:ui": "vitest --ui"
},
```

### Banco de dados isolado para testes e2e

- Arquivo de configuração para o ambiente isolado para os testes e2e (`setup-e2e.ts`):

```ts
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';

config({ path: '.env', override: true });
const prisma = new PrismaClient();

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provider a DATABASE_URL environment variable.');
  }
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set('schema', schemaId);

  return url.toString();
}

const schemaId = randomUUID();

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId);
  process.env.DATABASE_URL = databaseURL;

  // ? Diferente do 'dev', o 'deploy' vai somente rodar as migrations, sem verificar o schema e gerar novas migrations
  execSync('npx prisma migrate deploy');
});

afterAll(async () => {
  // ? Necessário ser o executeRawUnsafe, pq esta é uma ação perigosa, onde vai deletar um schema do banco
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
```

- Criar um novo arquivo de configuração do Vitest mas para os testes e2e (`vite.config.e2e.ts`):

```ts
import { defineConfig } from 'vitest/config';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    include: ['**/*.e2e.spec.ts'],
    globals: true,
    root: './',
    setupFiles: ['./test/setup-e2e.ts'],
  },
  plugins: [tsConfigPaths()],
});
```

> A configuração `setupFiles` vai receber o arquivo `setup-e2e.ts` que irá executar antes dos testes para preparar o ambiente isolado.

- Atualizar os scripts de teste em `package.json`:

```json
"scripts": {
  ...
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "vitest run --config ./vitest.config.e2e.ts",
  "test:e2e:watch": "vitest --config ./vitest.config.e2e.ts",
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
