import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";

import GlobalStyle from "src/constants/globalStyle";
import { darkTheme } from "src/constants/theme";
import { Loading } from "src/components/Loading";
import { useLoading } from "src/hooks/useLoading";

function AykutSarac({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const data = useLoading();

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

    if (!data) return null;

  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyle />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default AykutSarac;
