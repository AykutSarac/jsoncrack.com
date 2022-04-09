import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";

import GlobalStyle from "src/constants/globalStyle";
import { darkTheme } from "src/constants/theme";
import { Loading } from "src/components/Loading";
import { Toaster } from "react-hot-toast";

function JsonVisio({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const [pageLoading, setPageLoading] = React.useState<boolean>(false);
  React.useEffect(() => {
    const handleStart = () => {
      setPageLoading(true);
    };
    const handleComplete = () => {
      setPageLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);
  }, [router]);

  if (pageLoading)
    return (
      <ThemeProvider theme={darkTheme}>
        <GlobalStyle />
        <Head>
          <title>Loading... | JSON Visio</title>
        </Head>
        <Loading />
      </ThemeProvider>
    );

  return (
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
  );
}

export default JsonVisio;
