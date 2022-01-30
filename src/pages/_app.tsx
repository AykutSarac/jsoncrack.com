import GlobalStyle from "src/constants/globalStyle";
import { darkTheme } from "src/constants/theme";
import type { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import { Layout } from "src/components/Layout";

function AykutSarac({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={darkTheme}>
      <Layout>
        <GlobalStyle />
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default AykutSarac;
