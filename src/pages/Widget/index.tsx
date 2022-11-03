import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { baseURL } from "src/constants/data";
import { NodeModal } from "src/containers/Modals/NodeModal";
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

const StyledDeprecated = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;

  a {
    text-decoration: underline;
  }
`;

const WidgetPage = () => {
  const { query, push } = useRouter();

  const [isModalVisible, setModalVisible] = React.useState(false);
  const [selectedNode, setSelectedNode] = React.useState<[string, string][]>([]);

  const collapsedNodes = useGraph(state => state.collapsedNodes);
  const collapsedEdges = useGraph(state => state.collapsedEdges);
  const loading = useGraph(state => state.loading);
  const setGraphValue = useGraph(state => state.setGraphValue);

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

    if (!inIframe()) push("/");
  }, [collapsedNodes, collapsedEdges, loading, push]);

  React.useEffect(() => {
    const handler = (event: EmbedMessage) => {
      try {
        if (!event.data?.json) return;
        const { nodes, edges } = parser(event.data.json);

        setGraphValue("nodes", nodes);
        setGraphValue("edges", edges);
      } catch (error) {
        console.error(error);
        toast.error("Invalid JSON!");
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [setGraphValue]);

  if (query.json)
    return (
      <StyledDeprecated>
        <h1>⚠️ Deprecated ⚠️</h1>
        <br />
        <a href="https://jsoncrack.com/embed" target="_blank" rel="noreferrer">
          https://jsoncrack.com/embed
        </a>
      </StyledDeprecated>
    );

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
