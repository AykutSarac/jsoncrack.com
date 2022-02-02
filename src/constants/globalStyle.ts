import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    color: ${({ theme }) => theme.FULL_WHITE};
    background: ${({ theme }) => theme.BLACK_PRIMARY};
    font-family: 'Catamaran', sans-serif;
    font-weight: 400;
    font-size: 16px;
  }

  a {
    text-decoration: none;
    color: unset;

    &:hover {
      transition: 0.2s;
      color: ${({ theme }) => theme.BLURPLE};
    }
  }

  button {
    min-height: 32px;
    min-width: 60px;
    border: none;
    border-radius: 5px;
    padding: 2px 16px;
    outline: none;
    font-family: 'Catamaran', sans-serif;
    font-weight: 500;
    font-size: 14px;
    transition: 0.3s;
    

    div {
      white-space: normal;
      margin: 0 auto;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    &:hover {
      box-shadow: 3px 3px 5px ${({ theme }) => theme.BLACK};
    }
  }
`;

export default GlobalStyle;
