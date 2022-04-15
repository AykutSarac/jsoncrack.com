import Document, {
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";
import { SeoTags } from "src/components/SeoTags";

const isDevelopment = process.env.NODE_ENV === "development";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {!isDevelopment && (
            <>
              <script
                async
                src="https://www.googletagmanager.com/gtag/js?id=G-JKZEHMJBMH"
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `window.dataLayer = window.dataLayer || [];
                          function gtag(){dataLayer.push(arguments);}
                          gtag('js', new Date());
                          gtag('config', 'G-JKZEHMJBMH');
                    `,
                }}
              />
            </>
          )}
          <SeoTags
            description="Simple visualization tool for your JSON data. No forced structure, paste your JSON and view it instantly."
            title="JSON Visio - Directly into graphs"
            image="https://jsonvisio.com/preview.png"
          />
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Catamaran:wght@300;400;500;600;700&family=PT+Sans:wght@400;500;700&display=swap"
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
