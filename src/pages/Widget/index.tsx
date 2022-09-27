import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { baseURL } from "src/constants/data";
import useGraph from "src/hooks/store/useGraph";
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
  const { push } = useRouter();
  const [json, setJson] = React.useState<string | null>(null);
  const setGraphValue = useGraph(state => state.setGraphValue);

  React.useEffect(() => {
    const dataJson = window.self.frameElement?.getAttribute("data-json");
    if (dataJson) setJson(dataJson);
  }, []);

  React.useEffect(() => {
    if (json) {
      const jsonURI = decodeURIComponent(json);
      const isJsonValid = isValidJson(jsonURI);

      if (isJsonValid) {
        const { nodes, edges } = parser(jsonURI);

        setGraphValue("nodes", nodes);
        setGraphValue("edges", edges);
      }
    }

    if (!inIframe()) push("/");
  }, [push, json, setGraphValue]);

  return (
    <>
      <Graph isWidget />
      <StyledAttribute href={`${baseURL}/editor`} target="_blank" rel="noreferrer">
        jsoncrack.com
      </StyledAttribute>
    </>
  );
};

export default WidgetPage;
