<center>
  <a href="https://jsonvisio.com">
    <img width="1080" alt="jsonvisio" src="https://user-images.githubusercontent.com/47941171/182015412-f048058e-6e31-4cf6-bcfc-ab9ba3f6e005.png">
  </a>
</center>

<p>
    <p align="center">
        <img alt="travis ci badge" src="https://img.shields.io/travis/com/AykutSarac/jsonvisio.com/main?style=flat-square" />
      <a href="https://github.com/AykutSarac/jsonvisio.com/blob/main/LICENSE">
        <img alt="license badge" src="https://img.shields.io/github/license/AykutSarac/jsonvisio.com?style=flat-square" />
      </a>
      <a href="https://github.com/AykutSarac/jsonvisio.com/releases">
        <img alt="version badge" src="https://img.shields.io/github/package-json/v/AykutSarac/jsonvisio.com?color=brightgreen&style=flat-square" />
      </a>
      <a href="https://github.com/sponsors/AykutSarac">
        <img alt="github sponsors" src="https://img.shields.io/github/sponsors/AykutSarac?style=flat-square" />
      </a>
  </p>
  <p align="center">
    <i>Simple json visualization tool for your data.</i>
    <p align="center">
    <a href="https://www.producthunt.com/posts/json-visio?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-json&#0045;visio" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=332281&theme=light" alt="JSON&#0032;Visio - Simple&#0032;visualization&#0032;tool&#0032;for&#0032;your&#0032;JSON&#0032;data&#0046; | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
    </p>
  </p>

  <p align="center">
      <img width="800" src="/public/jsonvisio-screenshot.webp" alt="preview 1" />
  </p>


# JSON Visio (jsonvisio.com)
JSON Visio is a tool that generates graph diagrams from JSON objects. These diagrams are much easier to navigate than the textual format and to make it even more convenient, the tool also allows you to search the nodes. Additionally, the generated diagrams can also be downloaded or clipboard as image.

You can use the web version at [jsonvisio.com](https://jsonvisio.com) or also run it locally as [Docker container](https://github.com/AykutSarac/jsonvisio.com#-docker).

> <b><a href="https://jsonvisio.com">JSON Visio - Directly onto graphs</a></b>

## ⚡️ Features
* Search Nodes
* Share links & Create Embed Widgets
* Download/Clipboard as image
* Upload JSON locally or fetch from URL
* Great UI/UX
* Light/Dark Mode
* Advanced Error Message


## 🛠 Development Setup

```console
  npm install --legacy-peer-deps
  npm run dev
```
  
## 🐳 Docker

```
A Docker file is provided in the root of the repository.
If you want to run JSON Visio locally:
  
* Build Docker image with `docker build -t jsonvisio .`
* Run locally with `docker run -p 8888:8080 jsonvisio`
* Go to [http://localhost:8888]
```

## License

This project is open source and available under the [MIT License](LICENSE).
