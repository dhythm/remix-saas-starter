# remix-saas-starter

## How to create the environment

```sh
npx create-remix remix-saas-starter
cd remix-saas-starter

npm install --save-dev prisma
npm install @prisma/client
npx prisma init --datasource-provider postgresql
touch .env
# add DATABASE_URL into .env like DATABASE_URL=postgresql://postgres:passw0rd@127.0.0.1/postgres

docker-compose run -p 5432:5432 -d postgres
npx prisma migrate dev
touch prisma/seed.ts
npm install --save-dev esbuild-register
npx prisma db seed
npx prisma migrate reset
docker exec -it <CONTAINER_ID> psql -U postgres

# https://chakra-ui.com/getting-started/remix-guide
npm i @chakra-ui/react @emotion/react@^11 @emotion/styled@^11 framer-motion@^6 @emotion/server@^11

# Authentication
npm install bcryptjs
npm install --save-dev @types/bcryptjs
# add SESSION_SECRET into .env
```

## Getting Started

```sh
npm run de
```
