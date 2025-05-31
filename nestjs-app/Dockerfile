# -------- Build stage --------
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Enable corepack and install yarn 4.x
RUN corepack enable && corepack prepare yarn@4.9.1 --activate

# Copy dependencies first (for Docker cache)
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn

# Install deps
RUN yarn install --immutable

# Copy the rest of the app
COPY . .

RUN yarn add @prisma/client

# Generate Prisma client
RUN yarn prisma generate

RUN yarn add @prisma/client
# Build the TypeScript app
RUN yarn build


# -------- Runtime stage --------
FROM node:20-alpine

WORKDIR /usr/src/app

# Enable corepack and yarn
RUN corepack enable && corepack prepare yarn@4.9.1 --activate

# Copy necessary files from builder
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/.env .env
COPY --from=builder /usr/src/app/.env.test .env.test
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/prisma ./prisma

# ✅ Copy .env file so ConfigService and Prisma can access it
COPY --from=builder /usr/src/app/.env .env

EXPOSE 3000

# Start the app
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && node dist/main"]


