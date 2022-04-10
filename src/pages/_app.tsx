import React from "react";
import type { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";

import GlobalStyle from "src/constants/globalStyle";
import { darkTheme } from "src/constants/theme";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import * as gtag from "src/utils/gtag";
import { GoogleAnalytics } from "src/components/GoogleAnalytics";

const isDevelopment = process.env.NODE_ENV === "development";

function JsonVisio({ Component, pageProps }: AppProps) {
  const router = useRouter();
  React.useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      {!isDevelopment && <GoogleAnalytics />}
      <ThemeProvider theme={darkTheme}>
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
