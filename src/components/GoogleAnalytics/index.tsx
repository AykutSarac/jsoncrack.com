import Script from "next/script";
import React from "react";

const isDevelopment = process.env.NODE_ENV === "development";

export const GoogleAnalytics = () => {
  if (isDevelopment) return null;

  return (
    <>
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-JKZEHMJBMH`}
      />
      <Script
        id="gtag-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JKZEHMJBMH', {
                page_path: window.location.pathname,
            });
        `,
        }}
      />
    </>
  );
};
