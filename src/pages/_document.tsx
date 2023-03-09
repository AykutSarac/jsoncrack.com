import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
import { createGetInitialProps } from "@mantine/next";
import { SeoTags } from "src/components/SeoTags";

const getInitialProps = createGetInitialProps();

class MyDocument extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html lang="en">
        <Head>
          <SeoTags
            description="Simple visualization tool for your JSON data. No forced structure, paste your JSON and view it instantly."
            title="JSON Crack - Crack your data into pieces"
            image="https://jsoncrack.com/assets/jsoncrack.png"
          />
          <meta name="theme-color" content="#36393E" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="icon" href="/favicon.ico" />
          <Script
            strategy="afterInteractive"
            src="//m.servedby-buysellads.com/monetization.js"
            type="text/javascript"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
