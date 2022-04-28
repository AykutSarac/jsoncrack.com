# Builder
FROM node:14-buster as builder

WORKDIR /src

COPY . /src

RUN npm install --legacy-peer-deps

RUN npm run build

# App
FROM nginx:alpine

COPY --from=builder /src/out /app

RUN rm -rf /usr/share/nginx/html \
  && ln -s /app /usr/share/nginx/html
