#!/bin/bash
corepack enable && corepack prepare yarn@4.9.1 --activate

yarn install --immutable

yarn add -D pactum
yarn add -D dotenv
yarn add -D dotenv-cli

yarn prisma generate

yarn prisma migrate deploy

yarn dotenv -e .env.test -- prisma migrate deploy

yarn test:e2e