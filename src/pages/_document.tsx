import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import { ServerStyleSheet } from "styled-components";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
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
          <meta name="title" content="JSON Visio" />
          <meta
            name="description"
            content="Simple visualization tool for your JSON data. No forced structure, paste your JSON and view it instantly."
          />

          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://jsonvisio.com/" />
          <meta property="og:title" content="JSON Visio" />
          <meta
            property="og:description"
            content="Simple visualization tool for your JSON data. No forced structure, paste your JSON and view it instantly."
          />
          <meta property="og:image" content="https://jsonvisio.com/image.png" />

          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://jsonvisio.com/" />
          <meta property="twitter:title" content="JSON Visio" />
          <meta
            property="twitter:description"
            content="Simple visualization tool for your JSON data. No forced structure, paste your JSON and view it instantly."
          />
          <meta property="twitter:image" content="https://jsonvisio.com/image.png" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Catamaran:wght@300;400;500;600;700&family=PT+Sans:wght@400;700&display=swap"
            rel="stylesheet"
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
