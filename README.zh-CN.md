<center>
  <a href="https://jsoncrack.com">
    <img width="1080" alt="jsoncrack" src="https://user-images.githubusercontent.com/47941171/187418000-8edea92b-b3ac-4b07-9c4c-e42f6763817d.png">
  </a>
</center>

<p>
    <p align="center">
      <a href="https://discord.gg/yVyTtCRueq">
        <img alt="github sponsors" src="https://dcbadge.vercel.app/api/server/yVyTtCRueq?style=flat-square" />
      </a>
      <a href="https://app.travis-ci.com/github/AykutSarac/jsoncrack.com">
        <img alt="travis ci badge" src="https://img.shields.io/travis/com/AykutSarac/jsoncrack.com/main?style=flat-square" />
      </a>
      <a href="https://github.com/AykutSarac/jsoncrack.com/blob/main/LICENSE">
        <img alt="license badge" src="https://img.shields.io/github/license/AykutSarac/jsoncrack.com?style=flat-square" />
      </a>
      <a href="https://github.com/AykutSarac/jsoncrack.com/releases">
        <img alt="version badge" src="https://img.shields.io/github/package-json/v/AykutSarac/jsoncrack.com?color=brightgreen&style=flat-square" />
      </a>
      <a href="https://github.com/sponsors/AykutSarac">
        <img alt="github sponsors" src="https://img.shields.io/github/sponsors/AykutSarac?style=flat-square" />
      </a>
  </p>

  **中文** | [English](./README.md)

  <p align="center">
    <i>用于 json 数据可视化的简易工具</i>
    <p align="center">
    <a href="https://www.producthunt.com/posts/json-crack?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-json&#0045;crack" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=332281&theme=light" alt="JSON&#0032;Crack - Simple&#0032;visualization&#0032;tool&#0032;for&#0032;your&#0032;JSON&#0032;data&#0046; | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
    </p>
  </p>


  <p align="center">
      <img width="800" src="./public/assets/jsoncrack-screenshot.webp" alt="preview 1" />
  </p>

# JSON Crack (jsoncrack.com)

JSON Crack 是一个根据 JSON 对象生成图表的工具。这些图表比文本格式更易于导航，使得更为方便，该工具还允许你去搜索节点。除此之外，也可以作为图片来下载或复制数据到剪切板。



你可以在 [jsoncrack.com](https://jsoncrack.com) 上使用 web 版本，或者也可以将其作为 [Docker container](https://github.com/AykutSarac/jsoncrack.com#-docker) 在本地运行。

> <b><a href="https://jsoncrack.com">JSON Crack - 把你的数据分解成碎片</a></b>

## ⚡️ 功能

- 搜索节点
- 分享链接和生成可嵌入的小部件
- 下载为图片或复制到剪切板
- 上传本地的 JSON 数据或者通过 URL 请求来展示
- 创建 UI/UX
- 昼夜模式
- 高级错误消息

## 🛠 本地开发

```console
  npm install
  npm run dev
```

## 🐳 Docker

在仓库根目录下提供一个 [`Dockerfile`](Dockerfile) 文件

如果你想在本地运行 JSON Crack:

* 用 `docker build -t jsoncrack` 构建一个 Docker 镜像
* 用 `docker run -p 8888:8080 jsoncrack` 本地运行
* 前往 http://localhost:8888

## 协议

此项目开源并在 [GNU General Public License v3.0](LICENSE) 下可用
