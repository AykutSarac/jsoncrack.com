import React from "react";
import type { AppProps } from "next/app";
import toast, { Toaster } from "react-hot-toast";
import { ThemeProvider } from "styled-components";
import { init } from "@sentry/nextjs";

import GlobalStyle from "src/constants/globalStyle";
import { darkTheme, lightTheme } from "src/constants/theme";
import { GoogleAnalytics } from "src/components/GoogleAnalytics";
import useConfig from "src/hooks/store/useConfig";
import { decompress } from "compress-json";
import { useRouter } from "next/router";
import { isValidJson } from "src/utils/isValidJson";

if (process.env.NODE_ENV !== "development") {
  init({
    dsn: "https://d3345591295d4dd1b8c579b62003d939@o1284435.ingest.sentry.io/6495191",
    tracesSampleRate: 0.5,
  });
}

function JsonVisio({ Component, pageProps }: AppProps) {
  const { json, url } = useRouter().query;

  const lightmode = useConfig((state) => state.settings.lightmode);
  const [isRendered, setRendered] = React.useState(false);

  const updateJson = useConfig((state) => state.updateJson);

  React.useEffect(() => {
    const isJsonValid =
      typeof json === "string" && isValidJson(decodeURIComponent(json));

    if (isJsonValid) {
      const jsonDecoded = decompress(JSON.parse(isJsonValid));
      const jsonString = JSON.stringify(jsonDecoded);

      updateJson(jsonString);
    } else if (url) {
        toast.loading("Loading...", { id: "toastFetch" });
        fetch(url as string)
          .then((res) => res.json())
          .then((json) => {
            updateJson(JSON.stringify(json));
          })
          .catch(() => toast.error("Failed to fetch JSON!"))
          .finally(() => toast.dismiss("toastFetch"));
      }
  }, [url, json, updateJson]);

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

    setRendered(true);
  }, []);

  if (!isRendered) return null;

  return (
    <>
      <GoogleAnalytics />
      <ThemeProvider theme={lightmode ? lightTheme : darkTheme}>
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

export default JsonVisio;
