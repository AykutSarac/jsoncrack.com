import React from "react";
import { Box } from "@mantine/core";
import styled from "styled-components";
import { JSONCrack } from "jsoncrack-react";
import type { JSONCrackRef, NodeData } from "jsoncrack-react";
import { SUPPORTED_LIMIT } from "../../../../constants/graph";
import useConfig from "../../../../store/useConfig";
import useJson from "../../../../store/useJson";
import { useModal } from "../../../../store/useModal";
import { NotSupported } from "./NotSupported";
import { SecureInfo } from "./SecureInfo";
import { Toolbar } from "./Toolbar";
import useGraph from "./stores/useGraph";

const StyledEditorWrapper = styled.div<{ $widget: boolean }>`
  width: 100%;
  height: 100%;

  .jsoncrack-space {
    cursor: url("/assets/cursor.svg"), auto;
  }

  .jsoncrack-space:active {
    cursor: grabbing;
  }

  .jsoncrack-space rect {
    rx: 5;
    ry: 5;
    stroke-width: 1;
    filter: drop-shadow(
      2px 2px 0
        ${({ theme }) =>
          theme.BACKGROUND_SECONDARY === "#f2f3f5"
            ? "rgba(15, 23, 42, 0.25)"
            : "rgba(0, 0, 0, 0.6)"}
    );
  }

  .jsoncrack-space path {
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`;

interface GraphProps {
  isWidget?: boolean;
}

export const GraphView = ({ isWidget = false }: GraphProps) => {
  const setViewPort = useGraph(state => state.setViewPort);
  const setJsonCrackRef = useGraph(state => state.setJsonCrackRef);
  const direction = useGraph(state => state.direction);
  const setSelectedNode = useGraph(state => state.setSelectedNode);
  const gesturesEnabled = useConfig(state => state.gesturesEnabled);
  const rulersEnabled = useConfig(state => state.rulersEnabled);
  const darkmodeEnabled = useConfig(state => state.darkmodeEnabled);
  const json = useJson(state => state.json);
  const setVisible = useModal(state => state.setVisible);
  const jsonCrackRef = React.useRef<JSONCrackRef>(null);

  React.useEffect(() => {
    setJsonCrackRef(jsonCrackRef);
  }, [setJsonCrackRef]);

  const blurOnClick = React.useCallback(() => {
    if ("activeElement" in document) {
      (document.activeElement as HTMLElement | null)?.blur();
    }
  }, []);

  const handleNodeClick = React.useCallback(
    (node: NodeData) => {
      setSelectedNode(node);
      setVisible("NodeModal", true);
    },
    [setSelectedNode, setVisible]
  );

  const maxVisibleNodes = Number.isFinite(SUPPORTED_LIMIT) ? SUPPORTED_LIMIT : 1500;

  return (
    <Box pos="relative" h="100%" w="100%">
      {!isWidget && <SecureInfo />}
      {!isWidget && <Toolbar />}
      <StyledEditorWrapper
        $widget={isWidget}
        onContextMenu={event => event.preventDefault()}
        onClick={blurOnClick}
      >
        <JSONCrack
          ref={jsonCrackRef}
          key={[direction, gesturesEnabled, rulersEnabled].join("-")}
          json={json}
          theme={darkmodeEnabled ? "dark" : "light"}
          layoutDirection={direction}
          showControls={false}
          showGrid={rulersEnabled}
          trackpadZoom={gesturesEnabled}
          maxRenderableNodes={maxVisibleNodes}
          centerOnLayout
          onViewportCreate={setViewPort}
          onNodeClick={handleNodeClick}
          renderNodeLimitExceeded={() => <NotSupported />}
        />
      </StyledEditorWrapper>
    </Box>
  );
};
