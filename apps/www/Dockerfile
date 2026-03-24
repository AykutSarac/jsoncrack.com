# syntax=docker/dockerfile:1.6

FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat && npm install -g pnpm@10.20.0
WORKDIR /app

FROM base AS pruner
COPY . .
RUN pnpm dlx turbo@2.8.20 prune www --docker

FROM base AS installer
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

ENV PNPM_SKIP_LIFECYCLE_SCRIPTS=1
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm config set store-dir /root/.pnpm-store && \
    pnpm install --frozen-lockfile --ignore-scripts

COPY --from=pruner /app/out/full/ .
RUN pnpm turbo run build

FROM nginxinc/nginx-unprivileged:stable AS production
WORKDIR /app
COPY --from=installer /app/apps/www/out /app
COPY apps/www/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
