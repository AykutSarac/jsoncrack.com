import React from "react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { DM_Sans } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/code-highlight/styles.css";
import { ThemeProvider } from "styled-components";
import ReactGA from "react-ga4";
import GlobalStyle from "src/constants/globalStyle";
import { lightTheme } from "src/constants/theme";
import { Loading } from "src/layout/Loading";
import { supabase } from "src/lib/api/supabase";
import useUser from "src/store/useUser";

const dmSans = DM_Sans({
  subsets: ["latin-ext"],
});

const theme = createTheme({
  autoContrast: true,
  fontSmoothing: false,
  respectReducedMotion: true,
  cursorType: "pointer",
  fontFamily: dmSans.style.fontFamily,
  defaultGradient: {
    from: "#625BF6",
    to: "#362EF3",
    deg: 180,
  },
  primaryShade: 8,
  radius: {
    lg: "12px",
  },
  components: {
    Button: {
      defaultProps: {
        fw: 500,
      },
    },
  },
});

const Toaster = dynamic(() => import("react-hot-toast").then(c => c.Toaster));

const isDevelopment = process.env.NODE_ENV === "development";
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID as string;

ReactGA.initialize(GA_TRACKING_ID, { testMode: isDevelopment });

function JsonCrack({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const setSession = useUser(state => state.setSession);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSession(session);
    });
  }, [setSession]);

  React.useEffect(() => {
    const handleRouteChange = (page: string) => {
      ReactGA.send({ hitType: "pageview", page });
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <title>JSON Crack | Best JSON Viewer, Formatter and Visualizer for everyone</title>
      </Head>
      <ThemeProvider theme={lightTheme}>
        <Toaster
          position="bottom-right"
          containerStyle={{
            bottom: 34,
            right: 8,
            fontSize: 14,
          }}
          toastOptions={{
            style: {
              background: "#4D4D4D",
              color: "#B9BBBE",
              borderRadius: 4,
            },
          }}
        />
        <GlobalStyle />
        <MantineProvider defaultColorScheme="light" theme={theme}>
          <Loading />
          <Component {...pageProps} />
        </MantineProvider>
      </ThemeProvider>
    </>
  );
}

export default JsonCrack;
