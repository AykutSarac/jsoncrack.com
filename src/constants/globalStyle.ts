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
  }

  #carbonads {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', Helvetica, Arial,
      sans-serif;
      overflow: hidden;
      border-radius: 4px;
  }

  #carbonads {
    display: flex;
    background-color: #111827;
    box-shadow: 0 1px 4px 1px hsla(0, 0%, 0%, 0.1);
    z-index: 100;
  }

  #carbonads a {
    color: inherit;
    text-decoration: none;
  }

  #carbonads a:hover {
    color: inherit;
  }
  
  #carbonads span {
    position: relative;
    display: block;
    overflow: hidden;
  }

  #carbonads .carbon-wrap {
    display: flex;
  }

  #carbonads .carbon-img {
    display: block;
    margin: 0;
    line-height: 1;
  }

  #carbonads .carbon-img img {
    display: block;
  }
  
  #carbonads .carbon-text {
    font-size: 13px;
    padding: 10px;
    margin-bottom: 16px;
    line-height: 1.5;
    text-align: left;
  }

  #carbonads .carbon-poweredby {
    display: block;
    padding: 6px 8px;
    background: #111827;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
    font-size: 8px;
    line-height: 1;
    border-top-left-radius: 3px;
    position: absolute;
    bottom: 0;
    right: 0;
  }
`;

export default GlobalStyle;
