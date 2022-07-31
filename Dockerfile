# Builder
FROM node:14-buster as builder

WORKDIR /src

COPY . /src

RUN yarn install

RUN yarn run build

# App
FROM nginx:alpine

COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /src/out /app

RUN rm -rf /usr/share/nginx/html \
  && ln -s /app /usr/share/nginx/html
