# remix-saas-starter

## How to create the environment

```sh
npx create-remix remix-saas-starter
cd remix-saas-starter

npm install --save-dev prisma
npm install @prisma/client
npx prisma init --datasource-provider postgresql

docker-compose run -p 5432:5432 -d postgres
npm prisma migrate dev
touch prisma/seed.ts
npm prisma db seed
npm prisma migrate reset

# https://chakra-ui.com/getting-started/remix-guide
npm i @chakra-ui/react @emotion/react@^11 @emotion/styled@^11 framer-motion@^6 @emotion/server@^11
```

## Getting Started

```sh
npm run de
```
