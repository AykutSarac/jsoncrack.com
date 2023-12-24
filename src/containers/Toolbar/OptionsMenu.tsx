import React from "react";
import { Menu, Text, Flex } from "@mantine/core";
import { BsCheck2 } from "react-icons/bs";
import { MdSettings } from "react-icons/md";
import useConfig from "src/store/useConfig";
import * as Styles from "./styles";

export const OptionsMenu = () => {
  const toggleGestures = useConfig(state => state.toggleGestures);
  const toggleChildrenCount = useConfig(state => state.toggleChildrenCount);
  const toggleDarkMode = useConfig(state => state.toggleDarkMode);
  const toggleRulers = useConfig(state => state.toggleRulers);
  const toggleCollapseButton = useConfig(state => state.toggleCollapseButton);
  const toggleImagePreview = useConfig(state => state.toggleImagePreview);

  const gesturesEnabled = useConfig(state => state.gesturesEnabled);
  const childrenCountVisible = useConfig(state => state.childrenCountVisible);
  const darkmodeEnabled = useConfig(state => state.darkmodeEnabled);
  const rulersEnabled = useConfig(state => state.rulersEnabled);
  const collapseButtonVisible = useConfig(state => state.collapseButtonVisible);
  const imagePreviewEnabled = useConfig(state => state.imagePreviewEnabled);

  return (
    <Menu shadow="md" trigger="click" closeOnItemClick={false} withArrow>
      <Menu.Target>
        <Styles.StyledToolElement>
          <Flex gap={4}>
            <MdSettings size="18" />
          </Flex>
        </Styles.StyledToolElement>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<BsCheck2 opacity={rulersEnabled ? 100 : 0} />}
          onClick={() => toggleRulers(!rulersEnabled)}
        >
          <Text size="xs">Rulers</Text>
        </Menu.Item>
        <Menu.Item
          leftSection={<BsCheck2 opacity={gesturesEnabled ? 100 : 0} />}
          onClick={() => toggleGestures(!gesturesEnabled)}
        >
          <Text size="xs">Trackpad Gestures</Text>
        </Menu.Item>
        <Menu.Item
          leftSection={<BsCheck2 opacity={childrenCountVisible ? 100 : 0} />}
          onClick={() => toggleChildrenCount(!childrenCountVisible)}
        >
          <Text size="xs">Item Count</Text>
        </Menu.Item>
        <Menu.Item
          leftSection={<BsCheck2 opacity={imagePreviewEnabled ? 100 : 0} />}
          onClick={() => toggleImagePreview(!imagePreviewEnabled)}
        >
          <Text size="xs">Image Link Preview</Text>
        </Menu.Item>
        <Menu.Item
          leftSection={<BsCheck2 opacity={collapseButtonVisible ? 100 : 0} />}
          onClick={() => toggleCollapseButton(!collapseButtonVisible)}
        >
          <Text size="xs">Show Expand/Collapse</Text>
        </Menu.Item>
        <Menu.Item
          leftSection={<BsCheck2 opacity={darkmodeEnabled ? 100 : 0} />}
          onClick={() => toggleDarkMode(!darkmodeEnabled)}
        >
          <Text size="xs">Dark Mode</Text>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
