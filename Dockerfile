# Builder
FROM node:14-buster as builder
WORKDIR /src
COPY package.json /src
COPY yarn.lock /src
RUN yarn install --legacy-peer-deps
COPY . /src
RUN yarn run build

# App
FROM nginxinc/nginx-unprivileged
COPY --from=builder /src/out /app
COPY default.conf /etc/nginx/conf.d/default.conf
