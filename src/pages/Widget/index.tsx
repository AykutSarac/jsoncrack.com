import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { decompress } from "compress-json";
import { parse } from "jsonc-parser";
import toast from "react-hot-toast";
import { baseURL } from "src/constants/data";
import useGraph from "src/hooks/store/useGraph";
import fetchFileFromUrl from "src/utils/fetchFileFromUrl";
import { isValidJson } from "src/utils/isValidJson";
import { parser } from "src/utils/jsonParser";
import styled from "styled-components";

const Graph = dynamic<any>(() => import("src/components/Graph").then(c => c.Graph), {
  ssr: false,
});

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
  const setGraphValue = useGraph(state => state.setGraphValue);

  React.useEffect(() => {
    if (typeof query.url === "string") {
      setGraphValue("loading", true);
      setGraphValue("loading", true);
      fetchFileFromUrl(query.url)
        .then(json => {
          const { nodes, edges } = parser(json);

          setGraphValue("nodes", nodes);
          setGraphValue("edges", edges);
          setGraphValue("loading", false);
        })
        .catch(() => {
          toast.error("Failed to fetch remote file");
        })
        .finally(() => {
          setGraphValue("loading", false);
        });
    } else if (query.json) {
      const jsonURI = decodeURIComponent(query.json as string);
      const isJsonValid = isValidJson(jsonURI);

      if (isJsonValid) {
        const jsonDecoded = decompress(parse(isJsonValid));
        const { nodes, edges } = parser(JSON.stringify(jsonDecoded));

        setGraphValue("nodes", nodes);
        setGraphValue("edges", edges);
      }
    }

    if (!inIframe()) push("/");
  }, [push, query, setGraphValue]);

  return (
    <>
      <Graph isWidget />
      <StyledAttribute
        href={
          typeof query.url === "string"
            ? `${baseURL}/editor?url=${query.url}`
            : `${baseURL}/editor?json=${query.json}`
        }
        target="_blank"
        rel="noreferrer"
      >
        jsoncrack.com
      </StyledAttribute>
    </>
  );
};

export default WidgetPage;
