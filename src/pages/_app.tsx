import React from "react";
import type { AppProps } from "next/app";
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/code-highlight/styles.css";
import { ThemeProvider } from "styled-components";
import { NextSeo, SoftwareAppJsonLd } from "next-seo";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { Toaster } from "react-hot-toast";
import GlobalStyle from "src/constants/globalStyle";
import { SEO } from "src/constants/seo";
import { lightTheme } from "src/constants/theme";

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

const IS_PROD = process.env.NODE_ENV === "production";

function JsonCrack({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextSeo {...SEO} />
      <SoftwareAppJsonLd
        name="JSON Crack"
        price="0"
        priceCurrency="USD"
        type="DeveloperApplication"
        operatingSystem="Browser"
        keywords="json, json editor, json viewer, json formatter, json beautifier, json validator, json minifier, json compressor, json decompressor, json parser, json converter, json to yaml, json to xml, json to csv, json to tsv, json to html, json to markdown, json to base64, json to url, json to query string, json to form data, json to javascript object, json to php array, json to python dictionary, json to ruby hash, json to java object, json to c# object, json to go object, json to rust object, json to swift object, json to kotlin object, json to typescript object, json to graphql, json to sql, json to mongodb, json to yaml, yaml to json, xml to json, csv to json, tsv to json, html to json, markdown to json, base64 to json, url to json, query string to json, form data to json, javascript object to json, php array to json, python dictionary to json, ruby hash to json, java object to json, c# object to json, go object to json, rust object to json, swift object to json, kotlin object to json, typescript object to json, graphql to json, sql to json, mongodb to json, yaml to json, json to yaml, xml to json, csv to json, tsv to json, html to json, markdown to json, base64 to json, url to json, query string to json, form data to json, javascript object to json, php array to json, python dictionary to json, ruby hash to json, java object to json, c# object to json, go object to json, rust object to json, swift object to json, kotlin object to json, typescript object to json, graphql to json, sql to json, mongodb to json"
        applicationCategory="DeveloperApplication"
        aggregateRating={{ ratingValue: "4.9", ratingCount: "19" }}
      />
      <MantineProvider defaultColorScheme="light" theme={theme}>
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
          {IS_PROD && <GoogleAnalytics trackPageViews />}
          <Component {...pageProps} />
        </ThemeProvider>
      </MantineProvider>
    </>
  );
}

export default JsonCrack;
