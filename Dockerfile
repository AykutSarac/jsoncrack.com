# Builder
FROM node:16-alpine as builder
WORKDIR /src
COPY . /src/
RUN yarn install --frozen-lockfile && yarn build

# App
FROM nginxinc/nginx-unprivileged
COPY --chown=nginx:nginx --from=builder /src/out /app
COPY default.conf /etc/nginx/conf.d/default.conf
