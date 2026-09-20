import { useCallback, useEffect, useState } from "react";
import { Anchor, Box, MantineProvider, Text } from "@mantine/core";
import { CodeHighlightAdapterProvider, createShikiAdapter } from "@mantine/code-highlight";
import type { NodeData } from "jsoncrack-react";
import { JSONCrack } from "jsoncrack-react";
import { NodeModal } from "./components/NodeModal";

async function loadShiki() {
  const { createHighlighter } = await import("shiki");
  return createHighlighter({ langs: ["json"], themes: [] });
}

const shikiAdapter = createShikiAdapter(loadShiki);

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

    const onMessage = async (event: MessageEvent<{ json?: string; format?: string }>) => {
      const jsonData = event.data?.json;
      if (typeof jsonData !== "string") return;

      // YAML needs to be converted to a JS object before the JSON-only
      // graph renderer can visualize it. js-yaml is loaded on demand.
      if (event.data?.format === "yaml") {
        try {
          const { load } = await import("js-yaml");
          setJson(JSON.stringify(load(jsonData) as object));
        } catch (error) {
          console.error("Failed to parse YAML", error);
          setJson("{}");
        }
        return;
      }

      setJson(jsonData);
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
      <CodeHighlightAdapterProvider adapter={shikiAdapter}>
        <Box h="100vh" w="100vw">
          <JSONCrack json={json} theme={theme} showControls={false} onNodeClick={handleNodeClick} />
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
      </CodeHighlightAdapterProvider>
    </MantineProvider>
  );
};

export default App;

declare global {
  interface Window {
    acquireVsCodeApi?: () => any;
  }
}
