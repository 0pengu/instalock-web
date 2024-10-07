FROM node:20.12.2-alpine as build

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
COPY prisma/schema.prisma ./prisma/
RUN corepack enable pnpm && pnpm i --frozen-lockfile

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD pnpx tsx src/server/index.ts