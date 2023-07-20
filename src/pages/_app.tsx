import React from "react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { ThemeProvider } from "styled-components";
import { MantineProvider, MantineThemeOverride } from "@mantine/core";
import { pageview } from "react-ga";
import { monaSans } from "src/constants/customFonts";
import GlobalStyle from "src/constants/globalStyle";
import { lightTheme } from "src/constants/theme";

const Toaster = dynamic(() => import("react-hot-toast").then(c => c.Toaster));
const ExternalMode = dynamic(() => import("src/layout/ExternalMode"));
const ModalController = dynamic(() => import("src/layout/ModalController"));
const GoogleAnalytics = dynamic(() => import("src/components/GoogleAnalytics"));

const mantineTheme: MantineThemeOverride = {
  colorScheme: "light",
  fontFamily: monaSans.style.fontFamily,
  headings: { fontFamily: monaSans.style.fontFamily },
  primaryShade: 8,
};

function JsonCrack({ Component, pageProps }: AppProps) {
  const router = useRouter();

  React.useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <GoogleAnalytics />
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
    </>
  );
}

export default JsonCrack;
