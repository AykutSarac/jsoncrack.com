import React from "react";
import { Menu, Flex, Input, Text } from "@mantine/core";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
import { BsCheck2 } from "react-icons/bs";
import { CgChevronDown } from "react-icons/cg";
import useConfig from "src/store/useConfig";
import useGraph from "src/store/useGraph";
import * as Styles from "./styles";

export const ZoomMenu = () => {
  const zoomIn = useGraph(state => state.zoomIn);
  const zoomOut = useGraph(state => state.zoomOut);
  const toggleGestures = useConfig(state => state.toggleGestures);
  const toggleChildrenCount = useConfig(state => state.toggleChildrenCount);
  const toggleDarkMode = useConfig(state => state.toggleDarkMode);
  const toggleRulers = useConfig(state => state.toggleRulers);
  const toggleCollapseButton = useConfig(state => state.toggleCollapseButton);
  const toggleImagePreview = useConfig(state => state.toggleImagePreview);

  const centerView = useGraph(state => state.centerView);
  const setZoomFactor = useGraph(state => state.setZoomFactor);

  const gesturesEnabled = useConfig(state => state.gesturesEnabled);
  const childrenCountVisible = useConfig(state => state.childrenCountVisible);
  const darkmodeEnabled = useConfig(state => state.darkmodeEnabled);
  const rulersEnabled = useConfig(state => state.rulersEnabled);
  const collapseButtonVisible = useConfig(state => state.collapseButtonVisible);
  const imagePreviewEnabled = useConfig(state => state.imagePreviewEnabled);

  const zoomFactor = useGraph(state => state.viewPort?.zoomFactor || 1);
  const [tempZoomValue, setTempZoomValue] = React.useState(zoomFactor);

  React.useEffect(() => {
    if (!Number.isNaN(zoomFactor)) setTempZoomValue(zoomFactor);
  }, [zoomFactor]);

  useHotkeys([
    ["shift+Digit0", () => setZoomFactor(100 / 100)],
    ["shift+Digit1", centerView],
  ]);

  return (
    <Menu shadow="md" trigger="click" closeOnItemClick={false} withArrow>
      <Menu.Target>
        <Styles.StyledToolElement>
          <Flex gap={4}>
            {Math.round(zoomFactor * 100)}%
            <CgChevronDown />
          </Flex>
        </Styles.StyledToolElement>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item>
          <Input
            type="number"
            value={Math.round(tempZoomValue * 100)}
            onChange={e => setTempZoomValue(e.currentTarget.valueAsNumber / 100)}
            onKeyDown={getHotkeyHandler([["Enter", () => setZoomFactor(tempZoomValue)]])}
            size="xs"
            rightSection="%"
          />
        </Menu.Item>
        <Menu.Item rightSection="+" onClick={zoomIn}>
          <Text size="xs">Zoom in</Text>
        </Menu.Item>
        <Menu.Item rightSection="-" onClick={zoomOut}>
          <Text size="xs">Zoom out</Text>
        </Menu.Item>
        <Menu.Item rightSection="⇧ 1" onClick={centerView}>
          <Text size="xs">Zoom to fit</Text>
        </Menu.Item>
        <Menu.Item onClick={() => setZoomFactor(50 / 100)}>
          <Text size="xs">Zoom to %50</Text>
        </Menu.Item>
        <Menu.Item rightSection="⇧ 0" onClick={() => setZoomFactor(100 / 100)}>
          <Text size="xs">Zoom to %100</Text>
        </Menu.Item>
        <Menu.Item onClick={() => setZoomFactor(200 / 100)}>
          <Text size="xs">Zoom to %200</Text>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          icon={<BsCheck2 opacity={rulersEnabled ? 100 : 0} />}
          onClick={() => toggleRulers(!rulersEnabled)}
        >
          <Text size="xs">Rulers</Text>
        </Menu.Item>
        <Menu.Item
          icon={<BsCheck2 opacity={gesturesEnabled ? 100 : 0} />}
          onClick={() => toggleGestures(!gesturesEnabled)}
        >
          <Text size="xs">Trackpad Gestures</Text>
        </Menu.Item>
        <Menu.Item
          icon={<BsCheck2 opacity={childrenCountVisible ? 100 : 0} />}
          onClick={() => toggleChildrenCount(!childrenCountVisible)}
        >
          <Text size="xs">Item Count</Text>
        </Menu.Item>
        <Menu.Item
          icon={<BsCheck2 opacity={imagePreviewEnabled ? 100 : 0} />}
          onClick={() => toggleImagePreview(!imagePreviewEnabled)}
        >
          <Text size="xs">Image Link Preview</Text>
        </Menu.Item>
        <Menu.Item
          icon={<BsCheck2 opacity={collapseButtonVisible ? 100 : 0} />}
          onClick={() => toggleCollapseButton(!collapseButtonVisible)}
        >
          <Text size="xs">Show Expand/Collapse</Text>
        </Menu.Item>
        <Menu.Item
          icon={<BsCheck2 opacity={darkmodeEnabled ? 100 : 0} />}
          onClick={() => toggleDarkMode(!darkmodeEnabled)}
        >
          <Text size="xs">Dark Mode</Text>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
