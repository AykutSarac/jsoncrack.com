import React from "react";
import { Menu, Flex, Text } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import ReactGA from "react-ga4";
import toast from "react-hot-toast";
import { CgChevronDown, CgArrowsShrinkH, CgArrowsMergeAltH } from "react-icons/cg";
import { VscExpandAll, VscCollapseAll, VscTarget } from "react-icons/vsc";
import useToggleHide from "src/hooks/useToggleHide";
import { getNextDirection } from "src/lib/utils/graph/getNextDirection";
import useGraph from "src/store/useGraph";
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
  const toggleFold = useGraph(state => state.toggleFold);
  const setDirection = useGraph(state => state.setDirection);
  const direction = useGraph(state => state.direction);
  const expandGraph = useGraph(state => state.expandGraph);
  const collapseGraph = useGraph(state => state.collapseGraph);
  const focusFirstNode = useGraph(state => state.focusFirstNode);
  const foldNodes = useGraph(state => state.foldNodes);
  const graphCollapsed = useGraph(state => state.graphCollapsed);

  const toggleFoldNodes = () => {
    toggleFold(!foldNodes);
    toast(`${foldNodes ? "Unfolded" : "Folded"} nodes`);
  };

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
    ["mod+shift+f", toggleFoldNodes],
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
        <Styles.StyledToolElement>
          <Flex align="center" gap={3}>
            View <CgChevronDown />
          </Flex>
        </Styles.StyledToolElement>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          fz={12}
          onClick={() => {
            toggleDirection();
            ReactGA.event({
              action: "toggle_layout_direction",
              category: "User",
              label: "Tools",
            });
          }}
          icon={<Styles.StyledFlowIcon rotate={rotateLayout(direction || "RIGHT")} />}
          rightSection={
            <Text ml="md" fz={10} color="dimmed">
              {coreKey} Shift D
            </Text>
          }
        >
          Rotate Layout
        </Menu.Item>
        <Menu.Item
          fz={12}
          onClick={() => {
            toggleFoldNodes();
            ReactGA.event({
              action: "toggle_fold_nodes",
              category: "User",
              label: "Tools",
            });
          }}
          icon={foldNodes ? <CgArrowsShrinkH /> : <CgArrowsMergeAltH />}
          rightSection={
            <Text ml="md" fz={10} color="dimmed">
              {coreKey} Shift F
            </Text>
          }
        >
          {foldNodes ? "Unfold" : "Fold"} Nodes
        </Menu.Item>
        <Menu.Item
          fz={12}
          onClick={() => {
            toggleExpandCollapseGraph();
            ReactGA.event({
              action: "toggle_collapse_nodes",
              category: "User",
              label: "Tools",
            });
          }}
          icon={graphCollapsed ? <VscExpandAll /> : <VscCollapseAll />}
          rightSection={
            <Text ml="md" fz={10} color="dimmed">
              {coreKey} Shift C
            </Text>
          }
        >
          {graphCollapsed ? "Expand" : "Collapse"} Nodes
        </Menu.Item>
        <Menu.Item fz={12} onClick={focusFirstNode} icon={<VscTarget />}>
          Focus to First Node
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
