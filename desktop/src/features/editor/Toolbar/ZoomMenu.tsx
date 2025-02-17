import React from "react";
import { Menu, Flex, Input, Text } from "@mantine/core";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
import { event as gaEvent } from "nextjs-google-analytics";
import { CgChevronDown } from "react-icons/cg";
import useGraph from "../views/GraphView/stores/useGraph";
import { StyledToolElement } from "./styles";

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
        <StyledToolElement onClick={() => gaEvent("show_zoom_menu")}>
          <Flex gap={4} align="center" justify="center" miw="50">
            {Math.round(zoomFactor * 100)}%
            <CgChevronDown />
          </Flex>
        </StyledToolElement>
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
            gaEvent("zoom_in");
          }}
        >
          <Text size="xs">Zoom in</Text>
        </Menu.Item>
        <Menu.Item
          rightSection="-"
          onClick={() => {
            zoomOut();
            gaEvent("zoom_out");
          }}
        >
          <Text size="xs">Zoom out</Text>
        </Menu.Item>
        <Menu.Item
          rightSection="⇧ 1"
          onClick={() => {
            centerView();
            gaEvent("center_view");
          }}
        >
          <Text size="xs">Zoom to fit</Text>
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            setZoomFactor(50 / 100);
            gaEvent("zoom_50%");
          }}
        >
          <Text size="xs">Zoom to %50</Text>
        </Menu.Item>
        <Menu.Item
          rightSection="⇧ 0"
          onClick={() => {
            setZoomFactor(100 / 100);
            gaEvent("zoom_100%");
          }}
        >
          <Text size="xs">Zoom to %100</Text>
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            setZoomFactor(200 / 100);
            gaEvent("zoom_200%");
          }}
        >
          <Text size="xs">Zoom to %200</Text>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
