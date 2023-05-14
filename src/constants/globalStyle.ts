import localFont from "next/font/local";
import { createGlobalStyle } from "styled-components";

const monaSans = localFont({
  src: "../pages/Mona-Sans.woff2",
  variable: "--mona-sans",
  display: "swap",
  fallback: ["Arial, Helvetica, sans-serif", "Tahoma, Verdana, sans-serif"],
});

const GlobalStyle = createGlobalStyle`
  html, body {
    color: ${({ theme }) => theme.FULL_WHITE} !important;
    font-weight: 400;
    font-size: 16px;
    font-family: ${monaSans.style.fontFamily};
    background: #141517;

    @media only screen and (max-width: 768px) {
      background-position: right;
    }
  }

  * {
    -webkit-tap-highlight-color: transparent;
    scroll-behavior: smooth !important;
  }

  .hide {
    display: none;
  }

  .mantine-Modal-inner {
    padding: 0;
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

  #carbonads * {
    margin: initial;
    padding: initial;
    line-height: initial;
  }

  #carbonads {
    --carbon-font-size: 16px;
    --carbon-padding-size: 12px;
  }

  #carbonads {
    width: 100%;
    z-index: 100;
    display: block;

    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue',
      Helvetica, Arial, sans-serif;
    font-size: var(--carbon-font-size);
  }

  #carbonads > span {
    min-width: 18.75em;
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
