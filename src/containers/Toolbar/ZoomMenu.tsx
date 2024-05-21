import React from "react";
import { Menu, Flex, Input, Text } from "@mantine/core";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
import { CgChevronDown } from "react-icons/cg";
import { gaEvent } from "src/lib/utils/gaEvent";
import useGraph from "src/modules/GraphView/stores/useGraph";
import * as Styles from "./styles";

export const ZoomMenu = () => {
  const zoomIn = useGraph(state => state.zoomIn);
  const zoomOut = useGraph(state => state.zoomOut);
  const centerView = useGraph(state => state.centerView);
  const setZoomFactor = useGraph(state => state.setZoomFactor);

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
        <Styles.StyledToolElement onClick={() => gaEvent("Zoom Menu", "open menu")}>
          <Flex gap={4} align="center">
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
        <Menu.Item
          rightSection="+"
          onClick={() => {
            zoomIn();
            gaEvent("Zoom Menu", "zoom in");
          }}
        >
          <Text size="xs">Zoom in</Text>
        </Menu.Item>
        <Menu.Item
          rightSection="-"
          onClick={() => {
            zoomOut();
            gaEvent("Zoom Menu", "zoom out");
          }}
        >
          <Text size="xs">Zoom out</Text>
        </Menu.Item>
        <Menu.Item
          rightSection="⇧ 1"
          onClick={() => {
            centerView();
            gaEvent("Zoom Menu", "center view");
          }}
        >
          <Text size="xs">Zoom to fit</Text>
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            setZoomFactor(50 / 100);
            gaEvent("Zoom Menu", "zoom to 50%");
          }}
        >
          <Text size="xs">Zoom to %50</Text>
        </Menu.Item>
        <Menu.Item
          rightSection="⇧ 0"
          onClick={() => {
            setZoomFactor(100 / 100);
            gaEvent("Zoom Menu", "zoom to 100%");
          }}
        >
          <Text size="xs">Zoom to %100</Text>
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            setZoomFactor(200 / 100);
            gaEvent("Zoom Menu", "zoom to 200%");
          }}
        >
          <Text size="xs">Zoom to %200</Text>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
