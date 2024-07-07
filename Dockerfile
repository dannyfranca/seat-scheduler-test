# Build stage
FROM node:20.15.0-alpine3.20 AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run type-check
RUN pnpm run build

FROM node:20.15.0-alpine3.20

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package.json ./
COPY ./migrations/boot.sql ./migrations/boot.sql

ENV NODE_ENV production

CMD ["node", "dist/main.js"]
