import React from "react";

export const CarbonAds = () => {
  const ref = React.useRef<HTMLDivElement>(null!);

  React.useEffect(() => {
    ref.current.innerHTML = "";
    const s = document.createElement("script");
    s.id = "_carbonads_js";
    s.src = `//cdn.carbonads.com/carbon.js?serve=CE7IPKQL&placement=jsoncrackcom`;
    ref.current.appendChild(s);
  }, []);

  return <div ref={ref} className="carbon-outer" />;
};
