import React from "react";
import { Menu, Flex, Text, SegmentedControl } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import styled from "styled-components";
import { event as gaEvent } from "nextjs-google-analytics";
import toast from "react-hot-toast";
import { CgChevronDown } from "react-icons/cg";
import { TiFlowMerge } from "react-icons/ti";
import { VscExpandAll, VscCollapseAll, VscTarget } from "react-icons/vsc";
import useGraph from "src/containers/Editor/components/views/GraphView/stores/useGraph";
import { ViewMode } from "src/enums/viewMode.enum";
import useToggleHide from "src/hooks/useToggleHide";
import useConfig from "src/store/useConfig";
import type { LayoutDirection } from "src/types/graph";
import { StyledToolElement } from "./styles";

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

export const ViewMenu = () => {
  const { validateHiddenNodes } = useToggleHide();
  const [coreKey, setCoreKey] = React.useState("CTRL");
  const setDirection = useGraph(state => state.setDirection);
  const direction = useGraph(state => state.direction);
  const expandGraph = useGraph(state => state.expandGraph);
  const collapseGraph = useGraph(state => state.collapseGraph);
  const focusFirstNode = useGraph(state => state.focusFirstNode);
  const graphCollapsed = useGraph(state => state.graphCollapsed);
  const viewMode = useConfig(state => state.viewMode);
  const setViewMode = useConfig(state => state.setViewMode);

  const toggleDirection = () => {
    const nextDirection = getNextDirection(direction || "RIGHT");
    if (setDirection) setDirection(nextDirection);
  };

  const toggleExpandCollapseGraph = () => {
    if (graphCollapsed) expandGraph();
    else collapseGraph();

    validateHiddenNodes();
    toast(`${graphCollapsed ? "Expanded" : "Collapsed"} graph.`);
  };

  useHotkeys([
    ["mod+shift+d", toggleDirection],
    ["mod+shift+c", toggleExpandCollapseGraph],
    [
      "mod+f",
      () => {
        const input = document.querySelector("#search-node") as HTMLInputElement;
        input.focus();
      },
    ],
  ]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setCoreKey(navigator.userAgent.indexOf("Mac OS X") ? "⌘" : "CTRL");
    }
  }, []);

  return (
    <Menu shadow="md" closeOnItemClick={false} withArrow>
      <Menu.Target>
        <StyledToolElement onClick={() => gaEvent("show_view_menu")}>
          <Flex align="center" gap={3}>
            View <CgChevronDown />
          </Flex>
        </StyledToolElement>
      </Menu.Target>
      <Menu.Dropdown>
        <SegmentedControl
          miw={205}
          size="xs"
          value={viewMode}
          onChange={e => {
            setViewMode(e as ViewMode);
            gaEvent("change_view_mode", { label: e });
          }}
          data={[
            { value: ViewMode.Graph, label: "Graph" },
            { value: ViewMode.Tree, label: "Tree" },
          ]}
          fullWidth
        />
        {viewMode === ViewMode.Graph && (
          <>
            <Menu.Item
              mt="xs"
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
            <Menu.Item fz={12} onClick={focusFirstNode} leftSection={<VscTarget />}>
              Focus to First Node
            </Menu.Item>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};
