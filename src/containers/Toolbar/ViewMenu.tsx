import React from "react";
import { Menu, Flex, Text, SegmentedControl } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import toast from "react-hot-toast";
import { CgChevronDown } from "react-icons/cg";
import { VscExpandAll, VscCollapseAll, VscTarget } from "react-icons/vsc";
import { ViewMode } from "src/enums/viewMode.enum";
import useToggleHide from "src/hooks/useToggleHide";
import { gaEvent } from "src/lib/utils/gaEvent";
import { getNextDirection } from "src/lib/utils/getNextDirection";
import useGraph from "src/modules/GraphView/stores/useGraph";
import useConfig from "src/store/useConfig";
import * as Styles from "./styles";

function rotateLayout(direction: "LEFT" | "RIGHT" | "DOWN" | "UP") {
  if (direction === "LEFT") return 90;
  if (direction === "UP") return 180;
  if (direction === "RIGHT") return 270;
  return 360;
}

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
        <Styles.StyledToolElement onClick={() => gaEvent("View Menu", "open menu")}>
          <Flex align="center" gap={3}>
            View <CgChevronDown />
          </Flex>
        </Styles.StyledToolElement>
      </Menu.Target>
      <Menu.Dropdown>
        <SegmentedControl
          miw={205}
          size="xs"
          value={viewMode}
          onChange={e => {
            setViewMode(e as ViewMode);
            gaEvent("View Menu", "change view mode", e as string);
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
                gaEvent("View Menu", "rotate layout");
              }}
              leftSection={<Styles.StyledFlowIcon rotate={rotateLayout(direction || "RIGHT")} />}
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
                gaEvent("View Menu", "expand collapse graph");
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
