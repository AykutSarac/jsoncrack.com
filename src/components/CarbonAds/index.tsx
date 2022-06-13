import React from "react";

const isDevelopment = process.env.NODE_ENV === "development";

export const CarbonAds = () => {
  if (isDevelopment) return null;
  
  return (
    <>
      <script
        async
        type="text/javascript"
        src="//cdn.carbonads.com/carbon.js?serve=CE7IPKQL&placement=jsonvisiocom"
        id="_carbonads_js"
      ></script>
    </>
  );
};
