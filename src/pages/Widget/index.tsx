import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { parse } from "jsonc-parser";
import toast from "react-hot-toast";
import { baseURL, defaultJson } from "src/constants/data";
import { NodeModal } from "src/containers/Modals/NodeModal";
import useConfig from "src/hooks/store/useConfig";
import useGraph from "src/hooks/store/useGraph";
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

interface EmbedMessage {
  data: {
    json?: string;
    options?: any;
  };
}

const WidgetPage = () => {
  const { query, push } = useRouter();
  const [json, setJson] = React.useState(defaultJson);

  React.useEffect(() => {
    if (query.json)
      setJson(
        JSON.stringify({
          warning: "⚠️ Query params are deprecated now",
          new: "Check out https://jsoncrack.com/embed",
        })
      );
  }, [query.json]);

  const [isModalVisible, setModalVisible] = React.useState(false);
  const [selectedNode, setSelectedNode] = React.useState<[string, string][]>([]);

  const collapsedNodes = useGraph(state => state.collapsedNodes);
  const collapsedEdges = useGraph(state => state.collapsedEdges);
  const loading = useGraph(state => state.loading);
  const setGraphValue = useGraph(state => state.setGraphValue);
  const centerView = useConfig(state => state.centerView);

  const openModal = React.useCallback(() => setModalVisible(true), []);

  React.useEffect(() => {
    const nodeList = collapsedNodes.map(id => `[id$="node-${id}"]`);
    const edgeList = collapsedEdges.map(id => `[class$="edge-${id}"]`);

    const hiddenItems = document.querySelectorAll(".hide");
    hiddenItems.forEach(item => item.classList.remove("hide"));

    if (nodeList.length) {
      const selectedNodes = document.querySelectorAll(nodeList.join(","));
      const selectedEdges = document.querySelectorAll(edgeList.join(","));

      selectedNodes.forEach(node => node.classList.add("hide"));
      selectedEdges.forEach(edge => edge.classList.add("hide"));
    }
  }, [collapsedNodes, collapsedEdges, loading]);

  React.useEffect(() => {
    const handler = (event: EmbedMessage) => {
      try {
        if (!event.data?.json) return;
        const parsedJson = JSON.stringify(parse(event.data.json));
        setJson(parsedJson);
      } catch (error) {
        toast.error("Invalid JSON!");
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  React.useEffect(() => {
    if (json) {
      const { nodes, edges } = parser(json);

      setGraphValue("nodes", nodes);
      setGraphValue("edges", edges);
    }

    if (!inIframe()) push("/");
  }, [push, json, setGraphValue, centerView]);

  return (
    <>
      <Graph openModal={openModal} setSelectedNode={setSelectedNode} isWidget />
      <NodeModal
        selectedNode={selectedNode}
        visible={isModalVisible}
        closeModal={() => setModalVisible(false)}
      />
      <StyledAttribute href={`${baseURL}/editor`} target="_blank" rel="noreferrer">
        jsoncrack.com
      </StyledAttribute>
    </>
  );
};

export default WidgetPage;
