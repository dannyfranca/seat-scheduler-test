# Build stage
FROM node:22.4.0-alpine3.20 AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM node:22.4.0-alpine3.20

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package.json ./

ENV NODE_ENV production

CMD ["node", "dist/main.js"]
