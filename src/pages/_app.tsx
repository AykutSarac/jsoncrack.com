import React from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { init } from "@sentry/nextjs";
import { decompress } from "compress-json";
import { Toaster } from "react-hot-toast";
import { GoogleAnalytics } from "src/components/GoogleAnalytics";
import { SupportButton } from "src/components/SupportButton";
import GlobalStyle from "src/constants/globalStyle";
import { darkTheme, lightTheme } from "src/constants/theme";
import useConfig from "src/store/useConfig";
import useStored from "src/store/useStored";
import { isJsonValid } from "src/utils/isJsonValid";
import { ThemeProvider } from "styled-components";

if (process.env.NODE_ENV !== "development") {
  init({
    dsn: "https://d3345591295d4dd1b8c579b62003d939@o1284435.ingest.sentry.io/6495191",
    tracesSampleRate: 0.5,
  });
}

function JsonCrack({ Component, pageProps }: AppProps) {
  const { query, pathname } = useRouter();
  const lightmode = useStored(state => state.lightmode);
  const setJson = useConfig(state => state.setJson);
  const [isRendered, setRendered] = React.useState(false);

  React.useEffect(() => {
    try {
      if (pathname !== "/editor") return;
      if (!query.json) return;
      const _isJsonValid =
        typeof query.json === "string" &&
        isJsonValid(decodeURIComponent(query.json));
      if (_isJsonValid) {
        const jsonDecoded = decompress(JSON.parse(query.json as string));
        const jsonString = JSON.stringify(jsonDecoded);
        setJson(jsonString);
      }
    } catch (error) {
      console.error(error);
    }
  }, [pathname, query.json, setJson]);

  React.useEffect(() => {
    setRendered(true);
  }, []);

  if (isRendered)
    return (
      <>
        <GoogleAnalytics />
        <ThemeProvider theme={lightmode ? lightTheme : darkTheme}>
          <GlobalStyle />
          <Component {...pageProps} />
          <Toaster
            position="bottom-right"
            containerStyle={{
              right: 60,
            }}
            toastOptions={{
              style: {
                background: "#4D4D4D",
                color: "#B9BBBE",
              },
            }}
          />
          <SupportButton />
        </ThemeProvider>
      </>
    );
}

export default JsonCrack;
