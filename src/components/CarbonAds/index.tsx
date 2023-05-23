import React from "react";
import useUser from "src/store/useUser";

export const CarbonAds = () => {
  const ref = React.useRef<HTMLDivElement>(null!);
  const premium = useUser(state => state.premium);

  React.useEffect(() => {
    if (!premium) {
      ref.current.innerHTML = "";
      const s = document.createElement("script");
      s.id = "_carbonads_js";
      s.src = `//cdn.carbonads.com/carbon.js?serve=CE7IPKQL&placement=jsoncrackcom`;
      ref.current.appendChild(s);
    }
  }, [premium]);

  if (premium) return null;

  return <div ref={ref} className="carbon-outer" />;
};
