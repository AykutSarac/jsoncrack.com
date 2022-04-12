import React from "react";

export const GoogleAnalytics: React.FC = () => {
  return (
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
  );
};
