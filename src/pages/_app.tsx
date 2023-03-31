import React from "react";
import type { AppProps } from "next/app";
import localFont from "next/font/local";
import { ThemeProvider } from "styled-components";
import { MantineProvider } from "@mantine/core";
import { init } from "@sentry/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { GoogleAnalytics } from "src/components/GoogleAnalytics";
import GlobalStyle from "src/constants/globalStyle";
import { darkTheme, lightTheme } from "src/constants/theme";
import { ModalController } from "src/containers/ModalController";
import useStored from "src/store/useStored";

if (process.env.NODE_ENV !== "development") {
  init({
    dsn: "https://d3345591295d4dd1b8c579b62003d939@o1284435.ingest.sentry.io/6495191",
    tracesSampleRate: 0.25,
    release: "production",
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const monaSans = localFont({
  src: "../pages/Mona-Sans.woff2",
  variable: "--mona-sans",
  display: "swap",
  fallback: ["Arial, Helvetica, sans-serif", "Tahoma, Verdana, sans-serif"],
});

function JsonCrack({ Component, pageProps }: AppProps) {
  const [isReady, setReady] = React.useState(false);
  const lightmode = useStored(state => state.lightmode);

  React.useEffect(() => {
    setReady(true);
  }, []);

  if (isReady)
    return (
      <QueryClientProvider client={queryClient}>
        <GoogleAnalytics />
        <ThemeProvider theme={lightmode ? lightTheme : darkTheme}>
          <GlobalStyle />
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            withCSSVariables
            theme={{
              colorScheme: lightmode ? "light" : "dark",
              fontFamily: monaSans.style.fontFamily,
              components: {
                Divider: {
                  styles: () => ({
                    root: {
                      borderTopColor: "#4D4D4D !important",
                    },
                  }),
                },
                Modal: {
                  styles: theme => ({
                    title: {
                      fontWeight: 700,
                    },
                    header: {
                      backgroundColor: theme.colorScheme === "dark" ? "#36393E" : "#FFFFFF",
                    },
                    body: {
                      backgroundColor: theme.colorScheme === "dark" ? "#36393E" : "#FFFFFF",
                    },
                  }),
                },
                Button: {
                  styles: theme => ({
                    inner: {
                      fontWeight: 700,
                    },
                  }),
                },
              },
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
          </MantineProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
}

export default JsonCrack;
