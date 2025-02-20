import React from "react";
import { Menu, Flex, SegmentedControl, Text } from "@mantine/core";
import { useSessionStorage } from "@mantine/hooks";
import { event as gaEvent } from "nextjs-google-analytics";
import { BsCheck2 } from "react-icons/bs";
import { CgChevronDown } from "react-icons/cg";
import { ViewMode } from "../../../enums/viewMode.enum";
import useConfig from "../../../store/useConfig";
import { StyledToolElement } from "./styles";

export const ViewMenu = () => {
  const darkmodeEnabled = useConfig(state => state.darkmodeEnabled);
  const toggleDarkMode = useConfig(state => state.toggleDarkMode);
  const [viewMode, setViewMode] = useSessionStorage({
    key: "viewMode",
    defaultValue: ViewMode.Graph,
  });

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
          size="xs"
          miw="120"
          w="100%"
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
          mb="4"
        />
        <Menu.Divider />
        <Menu.Item
          leftSection={<BsCheck2 opacity={darkmodeEnabled ? 100 : 0} />}
          onClick={() => {
            toggleDarkMode(!darkmodeEnabled);
            gaEvent("toggle_dark_mode", { label: darkmodeEnabled ? "on" : "off" });
          }}
        >
          <Text size="xs">Dark Mode</Text>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
