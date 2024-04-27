import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from "next/document";
import { ServerStyleSheet } from "styled-components";

const metatags = Object.freeze({
  title: "JSON Crack | More Than A JSON Editor",
  image: "https://jsoncrack.com/assets/jsoncrack.png",
});

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
          <meta name="theme-color" content="#36393E" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="icon" href="/favicon.ico" />

          <meta property="og:url" content="https://jsoncrack.com" key="ogurl" />
          <meta property="og:type" content="website" key="ogtype" />
          <meta property="og:title" content={metatags.title} key="ogtitle" />
          <meta property="og:image" content={metatags.image} key="ogimage" />
          <meta name="twitter:card" content="summary_large_image" key="twcard" />
          <meta property="twitter:domain" content="https://jsoncrack.com" key="twdomain" />
          <meta property="twitter:url" content="https://jsoncrack.com" key="twurl" />
          <meta name="twitter:title" content={metatags.title} key="twtitle" />
          <meta name="twitter:image" content={metatags.image} key="twimage" />
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
