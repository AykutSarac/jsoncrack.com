import React from "react";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "styled-components";
import * as Sentry from "@sentry/nextjs";

import GlobalStyle from "src/constants/globalStyle";
import { darkTheme, lightTheme } from "src/constants/theme";
import { useConfig, withConfig } from "src/hocs/config";
import { GoogleAnalytics } from "src/components/GoogleAnalytics";
import Script from "next/script";

if (process.env.NODE_ENV !== "development") {
  Sentry.init({
    dsn: "https://d3345591295d4dd1b8c579b62003d939@o1284435.ingest.sentry.io/6495191",
    tracesSampleRate: 0.5,
  });
}

function JsonVisio({ Component, pageProps }: AppProps) {
  const { settings } = useConfig();

  React.useEffect(() => {
    if (!window.matchMedia("(display-mode: standalone)").matches) {
      navigator.serviceWorker
        ?.getRegistrations()
        .then(function (registrations) {
          for (let registration of registrations) {
            registration.unregister();
          }
        })
        .catch(function (err) {
          console.log("Service Worker registration failed: ", err);
        });
    }
  }, []);

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
