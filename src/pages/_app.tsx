import React from "react";
import type { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { GoogleAnalytics } from "src/components/GoogleAnalytics";
import { monaSans } from "src/constants/customFonts";
import GlobalStyle from "src/constants/globalStyle";
import { lightTheme } from "src/constants/theme";
import { ExternalMode } from "src/layout/DevMode";
import { ModalController } from "src/layout/ModalController";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function JsonCrack({ Component, pageProps }: AppProps) {
  const [isReady, setReady] = React.useState(false);

  React.useEffect(() => setReady(true), []);

  if (isReady)
    return (
      <QueryClientProvider client={queryClient}>
        <GoogleAnalytics />
        <ThemeProvider theme={lightTheme}>
          <GlobalStyle />
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            withCSSVariables
            theme={{
              colorScheme: "light",
              fontFamily: monaSans.style.fontFamily,
              headings: { fontFamily: monaSans.style.fontFamily },
            }}
          >
            <Component {...pageProps} />
            <ModalController />
            <Toaster
              position="top-right"
              containerStyle={{
                top: 40,
                right: 6,
                fontSize: 14,
              }}
              toastOptions={{
                style: {
                  background: "#4D4D4D",
                  color: "#B9BBBE",
                },
              }}
            />
            <ExternalMode />
          </MantineProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
}

export default JsonCrack;
