import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    color: ${({ theme }) => theme.FULL_WHITE};
    font-family: 'Catamaran', sans-serif;
    font-weight: 400;
    font-size: 16px;
    scroll-behavior: smooth;

    background-color: #000000;
    opacity: 1;
    background-image: radial-gradient(#414141 0.5px, #000000 0.5px);
    background-size: 10px 10px;
  }
  
  a {
    text-decoration: none;
    color: unset;
  }

  button {
    min-height: 32px;
    border: none;
    border-radius: 3px;
    outline: none;
    font-family: 'Catamaran', sans-serif;
    font-weight: 500;
    font-size: 14px;
    background-image: none;
    cursor: pointer;

    div {
      white-space: normal;
      margin: 0 auto;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    &:hover {
      background-image: linear-gradient(rgba(0, 0, 0, 0.1) 0 0);
    }
  }

  #carbonads * {
  margin: initial;
  padding: initial;
  line-height: initial;
  }

  #carbonads {
    --carbon-font-size: 16px;
    --carbon-padding-size: 12px;
    border-radius: 4px;
    overflow: hidden;
  }

  #carbonads {
    z-index: 100;
    display: inline-block;

    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue',
      Helvetica, Arial, sans-serif;
    font-size: var(--carbon-font-size);
  }

  #carbonads > span {

    min-width: 18.75em;
    max-width: clamp(18.75em, 22.5em, 24.5em);
    min-height: 100px;
    background-color: hsl(0, 0%, 10%);
    box-shadow: 0 0 1px hsl(0deg 0% 0% / 0.085),
      0 0 2px hsl(0deg 0% 0% / 0.085),
      0 0 4px hsl(0deg 0% 0% / 0.085),
      0 0 8px hsl(0deg 0% 0% / 0.085);
  }

  #carbonads a {
    text-decoration: none;
    color: #ddd;
  }

  #carbonads a:hover {
    color: #ddd;
  }

  #carbonads span {
    display: block;
    position: relative;
  }

  #carbonads .carbon-wrap {
    display: flex;
  }

  #carbonads .carbon-img {
    height: 100px;
    width: 130px;
  }

  #carbonads .carbon-img img {
    display: block;
  }

  #carbonads .carbon-text {
    padding: 0.625em 1em;

    font-size: 0.8125em;
    margin-bottom: 1em;
    line-height: 1.4;
    text-align: left;
  }

  #carbonads .carbon-poweredby {
    display: block;
    padding: 6px 8px;
    color: #aaa;
    background: #1e2021;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.1ch;
    font-weight: 600;
    font-size: 0.5em;
    line-height: 1;
    border-top-left-radius: 3px;
    position: absolute;
    bottom: 0;
    right: 0;
  }
`;

export default GlobalStyle;
