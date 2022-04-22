<div align="center">
  <a href="https://jsonvisio.com">
    <img width="512" alt="json visio logo" src="https://github.com/AykutSarac/jsonvisio.com/blob/main/public/logo.png">
  </a>
</div>

<div>
    <p align="center">
      <img alt="travis ci badge" src="https://img.shields.io/travis/com/AykutSarac/jsonvisio.com/main?style=flat-square" />
      <a href="https://github.com/AykutSarac/jsonvisio.com/blob/main/LICENSE">
      <img alt="license badge" src="https://img.shields.io/github/license/AykutSarac/jsonvisio.com?style=flat-square" />
      </a>
      <a href="https://opencollective.com/jsonvisio">
      <img alt="open collective badge" src="https://img.shields.io/opencollective/backers/jsonvisio.com?style=flat-square" />
      </a>
      <a href="https://github.com/AykutSarac/jsonvisio.com/releases">
      <img alt="version badge" src="https://img.shields.io/github/package-json/v/AykutSarac/jsonvisio.com?color=brightgreen&style=flat-square" />
      </a>
  </p>
  <p align="center">
    <i>Simple json visualization tool for your data.</i>
  </p>
  <img width="800" src="https://github.com/AykutSarac/jsonvisio.com/blob/main/public/jsonvisio.png" alt="preview 1" />

  <p align="center">
    <h2 align="center">Support JSON Visio<h2>
    </p>
  <p align="center">
    <a href="https://www.producthunt.com/posts/json-visio?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-json&#0045;visio" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=332281&theme=light" alt="JSON&#0032;Visio - Simple&#0032;visualization&#0032;tool&#0032;for&#0032;your&#0032;JSON&#0032;data&#0046; | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
    <a href="https://www.patreon.com/bePatron?u=55924790" data-patreon-widget-type="become-patron-button">
  <img height="54" alt="Become_a_patron" src="https://user-images.githubusercontent.com/47941171/161963362-78d9121c-99b8-4194-aaf7-2cef35b7f599.png">
    </a>
  </p>
</div>

# JSON Visio (jsonvisio.com)

JSON Visio is data visualization tool for your json data which seamlessly illustrates your data on graphs without having to restructure anything, paste directly or import file.

> <b><a href="https://jsonvisio.com">JSON Visio - Directly onto graphs</a></b>

## ⚡️ Features

* Advanced Error Message
* Search Nodes
* Save JSON locally
* Multiple layout direction support
* Compressed view
* Representative colors for arrays & keys
* Friendly UI
* Light/Dark Mode


## 🧩 Preview

<div align="center">
  <img width="800" src="https://github.com/AykutSarac/jsonvisio.com/blob/main/public/preview_2.png" alt="preview 1" />
  </div>

## 🛠 Development Setup

```sh
  npm install
  npm run dev
```

## 🛠 docker-compose
```
version: '3'
services:
  next:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: jsonvisio
    
    restart: always
    ports:
      - '3000:3000'
    volumes:
      - ./:/app
      - /app/node_modules
      - /app/.next
```


## License

This project is open source and available under the [MIT License](LICENSE).
