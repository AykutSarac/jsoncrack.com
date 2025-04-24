import React from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/code-highlight/styles.css";
import { ThemeProvider } from "styled-components";
import { NextSeo, SoftwareAppJsonLd } from "next-seo";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { Toaster } from "react-hot-toast";
import GlobalStyle from "../constants/globalStyle";
import { SEO } from "../constants/seo";
import { lightTheme } from "../constants/theme";
import { smartColorSchemeManager } from "../lib/utils/mantineColorScheme";

const theme = createTheme({
  autoContrast: true,
  fontSmoothing: false,
  respectReducedMotion: true,
  cursorType: "pointer",
  fontFamily:
    'system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
  defaultGradient: {
    from: "#388cdb",
    to: "#0f037f",
    deg: 180,
  },
  primaryShade: 8,
  colors: {
    brightBlue: [
      "#e6f2ff",
      "#cee1ff",
      "#9bc0ff",
      "#649dff",
      "#3980fe",
      "#1d6dfe",
      "#0964ff",
      "#0054e4",
      "#004acc",
      "#003fb5",
    ],
  },
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

function JsonCrack({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  // Create a single smart manager that handles pathname logic internally
  const colorSchemeManager = smartColorSchemeManager({
    key: "editor-color-scheme",
    getPathname: () => pathname,
    dynamicPaths: ["/editor"], // Only editor paths use dynamic theme
  });

  return (
    <>
      <NextSeo {...SEO} />
      <SoftwareAppJsonLd
        name="JSON Crack"
        price="0"
        priceCurrency="USD"
        type="SoftwareApplication"
        operatingSystem="Browser"
        keywords="json, json viewer, json visualizer, json formatter, json editor, json parser, json to tree view, json to diagram, json graph, json beautifier, json validator, json to csv, json to yaml, json minifier, json schema, json data transformer, json api, online json viewer, online json formatter, online json editor, json tool"
        applicationCategory="DeveloperApplication"
        aggregateRating={{ ratingValue: "4.9", ratingCount: "19" }}
      />
      <MantineProvider
        colorSchemeManager={colorSchemeManager}
        defaultColorScheme="light"
        theme={theme}
      >
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
          {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && <GoogleAnalytics trackPageViews />}
          <Component {...pageProps} />
        </ThemeProvider>
      </MantineProvider>
    </>
  );
}

export default JsonCrack;
