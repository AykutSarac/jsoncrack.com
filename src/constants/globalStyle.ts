import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html, body {
    background: rgb(246,249,253);
    background: radial-gradient(circle, rgb(245 245 245) 33%, rgb(252 252 255) 100%);
  }

  *,
  *::before,
  *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      scroll-behavior: smooth !important;
      -webkit-tap-highlight-color: transparent;
  }

  .hide {
    display: none;
  }

  svg {
    vertical-align: text-top;
  }

  a {
    color: unset;
    text-decoration: none;
  }

  button {
    border: none;
    outline: none;
    background: transparent;
    width: fit-content;
    margin: 0;
    padding: 0;
    cursor: pointer;
  }
`;

export default GlobalStyle;
