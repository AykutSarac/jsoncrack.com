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
`;

export default GlobalStyle;
