import React from "react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { ThemeProvider } from "styled-components";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { monaSans } from "src/constants/customFonts";
import GlobalStyle from "src/constants/globalStyle";
import { lightTheme } from "src/constants/theme";

const Toaster = dynamic(() => import("react-hot-toast").then(c => c.Toaster));
const ExternalMode = dynamic(() => import("src/layout/ExternalMode"));
const GoogleAnalytics = dynamic(() => import("src/components/GoogleAnalytics"));
const ModalController = dynamic(() => import("src/layout/ModalController"));

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
              primaryShade: 8,
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
