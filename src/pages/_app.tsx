import React from "react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { StyleSheetManager, ThemeProvider } from "styled-components";
import { MantineProvider, MantineThemeOverride } from "@mantine/core";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import ReactGA from "react-ga4";
import { monaSans } from "src/constants/fonts";
import GlobalStyle from "src/constants/globalStyle";
import { lightTheme } from "src/constants/theme";
import { supabase } from "src/lib/api/supabase";
import useUser from "src/store/useUser";

const isDevelopment = process.env.NODE_ENV === "development";
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

ReactGA.initialize(GA_TRACKING_ID, { testMode: isDevelopment });

const Toaster = dynamic(() => import("react-hot-toast").then(c => c.Toaster));
const ExternalMode = dynamic(() => import("src/layout/ExternalMode"));
const ModalController = dynamic(() => import("src/layout/ModalController"));

const mantineTheme: MantineThemeOverride = {
  colorScheme: "light",
  fontFamily: monaSans.style.fontFamily,
  headings: { fontFamily: monaSans.style.fontFamily },
  primaryShade: 8,
};

function JsonCrack({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
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
    <SessionContextProvider supabaseClient={supabase}>
      <StyleSheetManager>
        <ThemeProvider theme={lightTheme}>
          <GlobalStyle />
          <MantineProvider theme={mantineTheme} withGlobalStyles withNormalizeCSS withCSSVariables>
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
      </StyleSheetManager>
    </SessionContextProvider>
  );
}

export default JsonCrack;
