# Builder
FROM node:18-alpine as builder
WORKDIR /src

# Cache dependencies first
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy other files and build
COPY . /src/
RUN yarn build

# App
FROM nginxinc/nginx-unprivileged
COPY --chown=nginx:nginx --from=builder /src/out /app
COPY default.conf /etc/nginx/conf.d/default.conf
