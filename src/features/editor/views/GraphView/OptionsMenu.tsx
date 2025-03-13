import React from "react";
import { ActionIcon, Button, Flex, Menu, Text } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import styled from "styled-components";
import { event as gaEvent } from "nextjs-google-analytics";
import { BsCheck2 } from "react-icons/bs";
import { LuChevronRight, LuImageDown, LuMenu } from "react-icons/lu";
import { TiFlowMerge } from "react-icons/ti";
import { VscExpandAll, VscCollapseAll } from "react-icons/vsc";
import useToggleHide from "../../../../hooks/useToggleHide";
import useConfig from "../../../../store/useConfig";
import { useModal } from "../../../../store/useModal";
import type { LayoutDirection } from "../../../../types/graph";
import useGraph from "./stores/useGraph";

const StyledFlowIcon = styled(TiFlowMerge)<{ rotate: number }>`
  transform: rotate(${({ rotate }) => `${rotate}deg`});
`;

const getNextDirection = (direction: LayoutDirection) => {
  if (direction === "RIGHT") return "DOWN";
  if (direction === "DOWN") return "LEFT";
  if (direction === "LEFT") return "UP";
  return "RIGHT";
};

const rotateLayout = (direction: LayoutDirection) => {
  if (direction === "LEFT") return 90;
  if (direction === "UP") return 180;
  if (direction === "RIGHT") return 270;
  return 360;
};

export const OptionsMenu = () => {
  const toggleGestures = useConfig(state => state.toggleGestures);
  const toggleChildrenCount = useConfig(state => state.toggleChildrenCount);
  const toggleRulers = useConfig(state => state.toggleRulers);
  const toggleCollapseButton = useConfig(state => state.toggleCollapseButton);
  const toggleImagePreview = useConfig(state => state.toggleImagePreview);
  const gesturesEnabled = useConfig(state => state.gesturesEnabled);
  const childrenCountVisible = useConfig(state => state.childrenCountVisible);
  const rulersEnabled = useConfig(state => state.rulersEnabled);
  const collapseButtonVisible = useConfig(state => state.collapseButtonVisible);
  const imagePreviewEnabled = useConfig(state => state.imagePreviewEnabled);
  const { validateHiddenNodes } = useToggleHide();
  const setDirection = useGraph(state => state.setDirection);
  const direction = useGraph(state => state.direction);
  const expandGraph = useGraph(state => state.expandGraph);
  const collapseGraph = useGraph(state => state.collapseGraph);
  const graphCollapsed = useGraph(state => state.graphCollapsed);
  const setVisible = useModal(state => state.setVisible);
  const [coreKey, setCoreKey] = React.useState("CTRL");

  const toggleDirection = () => {
    const nextDirection = getNextDirection(direction || "RIGHT");
    if (setDirection) setDirection(nextDirection);
  };

  const toggleExpandCollapseGraph = () => {
    if (graphCollapsed) expandGraph();
    else collapseGraph();

    validateHiddenNodes();
  };

  useHotkeys(
    [
      ["mod+shift+d", toggleDirection],
      ["mod+shift+c", toggleExpandCollapseGraph],
      [
        "mod+f",
        () => {
          const input = document.querySelector("#search-node") as HTMLInputElement;
          input.focus();
        },
      ],
    ],
    []
  );

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setCoreKey(navigator.userAgent.indexOf("Mac OS X") ? "⌘" : "CTRL");
    }
  }, []);

  return (
    <Flex
      gap="xs"
      align="center"
      style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        zIndex: 100,
      }}
    >
      <Menu withArrow>
        <Menu.Target>
          <ActionIcon aria-label="actions" size="lg" color="gray" variant="light">
            <LuMenu size="18" />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={<LuImageDown color="gray" />}
            onClick={() => setVisible("DownloadModal", true)}
          >
            <Flex fz="xs" justify="space-between" gap="md">
              <Text fz="xs">Export as image</Text>
              <Text ml="md" fz={10} c="dimmed">
                {coreKey} + S
              </Text>
            </Flex>
          </Menu.Item>
          <Menu.Item
            fz={12}
            onClick={() => {
              toggleDirection();
              gaEvent("rotate_layout", { label: direction });
            }}
            leftSection={<StyledFlowIcon rotate={rotateLayout(direction || "RIGHT")} />}
            rightSection={
              <Text ml="md" fz={10} c="dimmed">
                {coreKey} Shift D
              </Text>
            }
            closeMenuOnClick={false}
          >
            Rotate Layout
          </Menu.Item>
          <Menu.Item
            fz={12}
            onClick={() => {
              toggleExpandCollapseGraph();
              gaEvent("expand_collapse_graph", { label: graphCollapsed ? "expand" : "collapse" });
            }}
            leftSection={graphCollapsed ? <VscExpandAll /> : <VscCollapseAll />}
            rightSection={
              <Text ml="md" fz={10} c="dimmed">
                {coreKey} Shift C
              </Text>
            }
          >
            {graphCollapsed ? "Expand" : "Collapse"} Graph
          </Menu.Item>
          <Menu.Divider />
          <Menu position="right" trigger="hover" offset={0}>
            <Menu.Target>
              <Button
                variant="subtle"
                size="xs"
                color="text"
                fullWidth
                fw="400"
                rightSection={<LuChevronRight />}
                styles={{ root: { paddingInline: 11 }, inner: { justifyContent: "space-between" } }}
              >
                View Options
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<BsCheck2 opacity={rulersEnabled ? 100 : 0} />}
                onClick={() => {
                  toggleRulers(!rulersEnabled);
                  gaEvent("toggle_rulers", { label: rulersEnabled ? "on" : "off" });
                }}
              >
                <Text size="xs">Rulers</Text>
              </Menu.Item>
              <Menu.Item
                leftSection={<BsCheck2 opacity={gesturesEnabled ? 100 : 0} />}
                onClick={() => {
                  toggleGestures(!gesturesEnabled);
                  gaEvent("toggle_gestures", { label: gesturesEnabled ? "on" : "off" });
                }}
              >
                <Text size="xs">Trackpad Gestures</Text>
              </Menu.Item>
              <Menu.Item
                leftSection={<BsCheck2 opacity={childrenCountVisible ? 100 : 0} />}
                onClick={() => {
                  toggleChildrenCount(!childrenCountVisible);
                  gaEvent("toggle_children_count", { label: childrenCountVisible ? "on" : "off" });
                }}
              >
                <Text size="xs">Item Count</Text>
              </Menu.Item>
              <Menu.Item
                leftSection={<BsCheck2 opacity={imagePreviewEnabled ? 100 : 0} />}
                onClick={() => {
                  toggleImagePreview(!imagePreviewEnabled);
                  gaEvent("toggle_image_preview", { label: imagePreviewEnabled ? "on" : "off" });
                }}
              >
                <Text size="xs">Image Link Preview</Text>
              </Menu.Item>
              <Menu.Item
                leftSection={<BsCheck2 opacity={collapseButtonVisible ? 100 : 0} />}
                onClick={() => {
                  toggleCollapseButton(!collapseButtonVisible);
                  gaEvent("toggle_expand_collapse", {
                    label: collapseButtonVisible ? "on" : "off",
                  });
                }}
              >
                <Text size="xs">Show Expand/Collapse</Text>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Menu.Dropdown>
      </Menu>
    </Flex>
  );
};
