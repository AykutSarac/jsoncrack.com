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

      const initialProps = await getInitialProps(ctx);

      return {
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
            description="Innovative and open-source visualization application that transforms various data formats, such as JSON, YAML, XML, CSV and more, into interactive graphs."
            title="JSON Crack - Visualize Data to Graphs"
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
