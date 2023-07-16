import React from "react";
import { useRouter } from "next/router";

export const HovercardAds = () => {
  const router = useRouter();

  React.useEffect(() => {
    const isAvailable = document.querySelectorAll("#_hellobar_")[0];

    if (typeof window._bsa !== "undefined" && window._bsa && !!!isAvailable) {
      window._bsa.init("hellobar", "CE7IPKQL", "placement:jsoncrackcom");
    }

    if (isAvailable) {
      window._bsa.reload("#_hellobar_");
    }
  }, [router.asPath]);

  return <div id="hellobarContainer"></div>;
};
