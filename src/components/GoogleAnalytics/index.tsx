import React from "react";
import Script from "next/script";
import ReactGA from "react-ga";

const isDevelopment = process.env.NODE_ENV === "development";
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

ReactGA.initialize(GA_TRACKING_ID, { testMode: isDevelopment, useExistingGa: true });

const GoogleAnalytics: React.FC = () => {
  if (isDevelopment) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics;
