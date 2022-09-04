# Builder
FROM node:14-slim as builder
ARG jsoncrack_host
ENV NEXT_PUBLIC_JSONCRACK_HOST $jsoncrack_host
WORKDIR /src
COPY . /src
RUN yarn install --legacy-peer-deps
RUN yarn run build

# App
FROM nginxinc/nginx-unprivileged:alpine
COPY --from=builder /src/out /app
COPY default.conf /etc/nginx/conf.d/default.conf
