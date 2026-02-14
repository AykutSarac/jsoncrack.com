import React from "react";
import { Box } from "@mantine/core";
import styled from "styled-components";
import { JsonCrack } from "@jsoncrack/react-canvas";
import type { NodeData } from "@jsoncrack/react-canvas";
import { useLongPress } from "use-long-press";
import { SUPPORTED_LIMIT } from "../../../../constants/graph";
import useConfig from "../../../../store/useConfig";
import useJson from "../../../../store/useJson";
import { useModal } from "../../../../store/useModal";
import { NotSupported } from "./NotSupported";
import { OptionsMenu } from "./OptionsMenu";
import { SecureInfo } from "./SecureInfo";
import { ZoomControl } from "./ZoomControl";
import useGraph from "./stores/useGraph";

const StyledEditorWrapper = styled.div<{ $widget: boolean }>`
  width: 100%;
  height: 100vh;

  @media only screen and (max-width: 320px) {
    height: 100vh;
  }
`;

interface GraphProps {
  isWidget?: boolean;
}

export const GraphView = ({ isWidget = false }: GraphProps) => {
  const setViewPort = useGraph(state => state.setViewPort);
  const direction = useGraph(state => state.direction);
  const setSelectedNode = useGraph(state => state.setSelectedNode);
  const gesturesEnabled = useConfig(state => state.gesturesEnabled);
  const rulersEnabled = useConfig(state => state.rulersEnabled);
  const imagePreviewEnabled = useConfig(state => state.imagePreviewEnabled);
  const darkmodeEnabled = useConfig(state => state.darkmodeEnabled);
  const json = useJson(state => state.json);
  const setVisible = useModal(state => state.setVisible);

  const callback = React.useCallback(() => {
    const canvas = document.querySelector(".jsoncrack-canvas") as HTMLDivElement | null;
    canvas?.classList.add("dragging");
  }, []);

  const bindLongPress = useLongPress(callback, {
    threshold: 150,
    onFinish: () => {
      const canvas = document.querySelector(".jsoncrack-canvas") as HTMLDivElement | null;
      canvas?.classList.remove("dragging");
    },
  });

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
      {!isWidget && <OptionsMenu />}
      {!isWidget && <SecureInfo />}
      <ZoomControl />
      <StyledEditorWrapper
        $widget={isWidget}
        onContextMenu={event => event.preventDefault()}
        onClick={blurOnClick}
        {...bindLongPress()}
      >
        <JsonCrack
          key={[direction, gesturesEnabled, rulersEnabled, imagePreviewEnabled].join("-")}
          json={json}
          theme={darkmodeEnabled ? "dark" : "light"}
          direction={direction}
          showControls={false}
          showGrid={rulersEnabled}
          zoomOnScroll={gesturesEnabled}
          imagePreview={imagePreviewEnabled}
          maxVisibleNodes={maxVisibleNodes}
          fitViewOnLayout
          onViewPortCreate={setViewPort}
          onNodeClick={handleNodeClick}
          renderTooLarge={() => <NotSupported />}
        />
      </StyledEditorWrapper>
    </Box>
  );
};
