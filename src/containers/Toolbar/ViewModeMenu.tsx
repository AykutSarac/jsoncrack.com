import React from "react";
import { Menu, Flex, SegmentedControl } from "@mantine/core";
import { CgChevronDown } from "react-icons/cg";
import { ViewMode } from "src/enums/viewMode.enum";
import useConfig from "src/store/useConfig";
import * as Styles from "./styles";

export const ViewModeMenu = () => {
  const viewMode = useConfig(state => state.viewMode);
  const setViewMode = useConfig(state => state.setViewMode);

  return (
    <Menu trigger="click" shadow="md" withArrow>
      <Menu.Target>
        <Styles.StyledToolElement title="View Mode">
          <Flex align="center" gap={3}>
            View Mode <CgChevronDown />
          </Flex>
        </Styles.StyledToolElement>
      </Menu.Target>
      <Menu.Dropdown>
        <SegmentedControl
          value={viewMode}
          onChange={e => setViewMode(e as ViewMode)}
          data={[
            { value: ViewMode.Graph, label: "Graph" },
            { value: ViewMode.Tree, label: "Tree" },
          ]}
        />
      </Menu.Dropdown>
    </Menu>
  );
};
