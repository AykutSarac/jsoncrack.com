import React from "react";
import type { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";

import GlobalStyle from "src/constants/globalStyle";
import { darkTheme, lightTheme } from "src/constants/theme";
import { Toaster } from "react-hot-toast";
import { useConfig, withConfig } from "src/hocs/config";
import { GoogleAnalytics } from "src/components/GoogleAnalytics";

function JsonVisio({ Component, pageProps }: AppProps) {
  const {
    states: { settings },
  } = useConfig();

  return (
    <>
      <GoogleAnalytics />
      <ThemeProvider theme={settings.lightmode ? lightTheme : darkTheme}>
        <GlobalStyle />
        <Component {...pageProps} />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#4D4D4D",
              color: "#B9BBBE",
            },
          }}
        />
      </ThemeProvider>
    </>
  );
}

export default withConfig(JsonVisio);
