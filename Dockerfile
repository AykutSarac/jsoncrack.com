# Builder
FROM node:14-alpine as builder
WORKDIR /src
COPY . /src/
RUN npm install && npm run build

# App
FROM nginxinc/nginx-unprivileged
COPY --chown=nginx:nginx --from=builder /src/out /app
COPY default.conf /etc/nginx/conf.d/default.conf
