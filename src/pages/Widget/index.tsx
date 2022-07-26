import { decompress } from "compress-json";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";
import toast from "react-hot-toast";
import { defaultJson } from "src/constants/data";
import { isValidJson } from "src/utils/isValidJson";
import styled from "styled-components";

const Graph = dynamic<any>(
  () => import("src/components/Graph").then((c) => c.Graph),
  { ssr: false }
);

const StyledAttribute = styled.a`
  position: fixed;
  bottom: 0;
  right: 0;
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};
  background: ${({ theme }) => theme.SILVER_DARK};
  padding: 4px 8px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 3px 0 0 0;
  opacity: 0.8;

  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

const WidgetPage = () => {
  const { query, push } = useRouter();
  const [json, setJson] = React.useState("");
  const [params, setParams] = React.useState("");
  React.useEffect(() => {
    if (query.json) {
      setParams(`?json=${query.json}`);
      const jsonURI = decodeURIComponent(query.json as string);
      const isJsonValid = isValidJson(jsonURI);
      if (isJsonValid) {
        const jsonDecoded = decompress(JSON.parse(isJsonValid));
        const jsonString = JSON.stringify(jsonDecoded);
        setJson(jsonString);
      }
    } else if (query.url) {
      toast.loading("Loading...", { id: "toastFetch" });
      setParams(`?url=${query.url}`);
      fetch(query.url as string)
        .then((res) => res.json())
        .then((json) => {
          setJson(JSON.stringify(json));
        })
        .catch(() => toast.error("Failed to fetch JSON!"))
        .finally(() => toast.dismiss("toastFetch"));
      } else {
    setJson(JSON.stringify(defaultJson));
      }

    if (!inIframe()) push("/");
  }, [query?.json, query?.url, push]);

  return (
    <div>
      <Graph json={json} isWidget />
      <StyledAttribute
        href={`https://jsonvisio.com/editor${params}`}
        target="_blank"
        rel="noreferrer"
      >
        jsonvisio.com
      </StyledAttribute>
    </div>
  );
};

export default WidgetPage;
