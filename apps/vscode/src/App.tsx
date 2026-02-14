import { useCallback, useEffect, useState } from "react";
import { Anchor, Box, MantineProvider, Text } from "@mantine/core";
import type { NodeData } from "jsoncrack";
import { JsonCrack } from "jsoncrack";
import { NodeModal } from "./components/NodeModal";

function getTheme() {
  const theme = document.body.getAttribute("data-vscode-theme-kind");
  if (theme?.includes("light")) return "light" as const;
  return "dark";
}

const App: React.FC = () => {
  const [json, setJson] = useState("{}");
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const theme = getTheme();

  useEffect(() => {
    const vscode = window?.acquireVsCodeApi?.();
    vscode?.postMessage("ready");

    const onMessage = (event: MessageEvent<{ json?: string }>) => {
      const jsonData = event.data?.json;
      if (typeof jsonData === "string") {
        setJson(jsonData);
      }
    };

    window.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, []);

  const handleNodeClick = useCallback((node: NodeData) => {
    setSelectedNode(node);
  }, []);

  const closeNodeModal = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <MantineProvider forceColorScheme={theme}>
      <Box h="100vh" w="100vw">
        <JsonCrack json={json} theme={theme} showControls={false} onNodeClick={handleNodeClick} />
        {selectedNode && (
          <NodeModal opened={!!selectedNode} onClose={closeNodeModal} nodeData={selectedNode} />
        )}
        <Anchor
          pos="fixed"
          bottom={0}
          left={0}
          href="https://jsoncrack.com/editor?utm_source=vscode&utm_campaign=attribute"
          target="_blank"
        >
          <Box px="12" py="4" bg="dark">
            <Text fz="sm" c="white">
              Powered by JSON Crack
            </Text>
          </Box>
        </Anchor>
      </Box>
    </MantineProvider>
  );
};

export default App;

declare global {
  interface Window {
    acquireVsCodeApi?: () => any;
  }
}
