import React from "react";
import { ActionIcon, Flex, Tooltip, Text } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { event as gaEvent } from "nextjs-google-analytics";
import { LuFocus, LuMaximize, LuMinus, LuPlus } from "react-icons/lu";
import { SearchInput } from "../../Toolbar/SearchInput";
import useGraph from "./stores/useGraph";

export const ZoomControl = () => {
  const zoomIn = useGraph(state => state.zoomIn);
  const zoomOut = useGraph(state => state.zoomOut);
  const centerView = useGraph(state => state.centerView);
  const focusFirstNode = useGraph(state => state.focusFirstNode);

  useHotkeys(
    [
      ["mod+[plus]", () => zoomIn, { usePhysicalKeys: true }],
      ["mod+[minus]", () => zoomOut, { usePhysicalKeys: true }],
      ["shift+Digit1", centerView, { usePhysicalKeys: true }],
      ["shift+Digit2", focusFirstNode, { usePhysicalKeys: true }],
    ],
    []
  );

  return (
    <Flex
      align="center"
      gap="xs"
      style={{
        position: "absolute",
        bottom: "10px",
        left: "10px",
        alignItems: "start",
        zIndex: 100,
      }}
    >
      <ActionIcon.Group borderWidth={0}>
        <Tooltip
          label={
            <Flex fz="xs" gap="md">
              <Text fz="xs">Center first item</Text>
              <Text fz="xs" c="dimmed">
                ⇧ 2
              </Text>
            </Flex>
          }
          withArrow
        >
          <ActionIcon
            size="lg"
            variant="light"
            color="gray"
            onClick={() => {
              focusFirstNode();
              gaEvent("focus_first_node");
            }}
          >
            <LuFocus />
          </ActionIcon>
        </Tooltip>
        <Tooltip
          label={
            <Flex fz="xs" gap="md">
              <Text fz="xs">Fit to center</Text>
              <Text fz="xs" c="dimmed">
                ⇧ 1
              </Text>
            </Flex>
          }
          withArrow
        >
          <ActionIcon
            size="lg"
            variant="light"
            color="gray"
            onClick={() => {
              centerView();
              gaEvent("center_view");
            }}
          >
            <LuMaximize />
          </ActionIcon>
        </Tooltip>
        <ActionIcon
          size="lg"
          variant="light"
          color="gray"
          onClick={() => {
            zoomOut();
            gaEvent("zoom_out");
          }}
        >
          <LuMinus />
        </ActionIcon>
        <ActionIcon
          size="lg"
          variant="light"
          color="gray"
          onClick={() => {
            zoomIn();
            gaEvent("zoom_in");
          }}
        >
          <LuPlus />
        </ActionIcon>
      </ActionIcon.Group>
      <SearchInput />
    </Flex>
  );
};
