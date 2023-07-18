import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from "next/document";
import Script from "next/script";
import { ServerStyleSheet } from "styled-components";
import { createGetInitialProps } from "@mantine/next";
import { SeoTags } from "src/components/SeoTags";

const getInitialProps = createGetInitialProps();

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...getInitialProps,
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

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
        </Head>
        <body>
          <Main />
          <Script
            src="https://m.servedby-buysellads.com/monetization.js"
            strategy="beforeInteractive"
          />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
