import React from "react";
import Script from "next/script";

const isDevelopment = process.env.NODE_ENV === "development";

export const GoogleAnalytics: React.FC = () => {
  if (isDevelopment) return null;

  return (
    <>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-JKZEHMJBMH" />
      <Script
        id="google-analytics"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-JKZEHMJBMH');
        `,
        }}
      />
    </>
  );
};
