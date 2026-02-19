import React from "react";
import { ActionIcon, Flex, Menu, Text } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import styled from "styled-components";
import type { LayoutDirection } from "jsoncrack-react";
import { event as gaEvent } from "nextjs-google-analytics";
import { BsCheck2 } from "react-icons/bs";
import { LuImageDown, LuMenu } from "react-icons/lu";
import { TiFlowMerge } from "react-icons/ti";
import useConfig from "../../../../store/useConfig";
import { useModal } from "../../../../store/useModal";
import useGraph from "./stores/useGraph";

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

export const OptionsMenu = () => {
  const toggleGestures = useConfig(state => state.toggleGestures);
  const toggleRulers = useConfig(state => state.toggleRulers);
  const gesturesEnabled = useConfig(state => state.gesturesEnabled);
  const rulersEnabled = useConfig(state => state.rulersEnabled);
  const setDirection = useGraph(state => state.setDirection);
  const direction = useGraph(state => state.direction);
  const setVisible = useModal(state => state.setVisible);
  const [coreKey, setCoreKey] = React.useState("CTRL");

  const toggleDirection = () => {
    const nextDirection = getNextDirection(direction || "RIGHT");
    if (setDirection) setDirection(nextDirection);
  };

  useHotkeys(
    [
      ["mod+shift+d", toggleDirection],
      [
        "mod+f",
        () => {
          const input = document.querySelector("#search-node") as HTMLInputElement;
          input.focus();
        },
      ],
    ],
    []
  );

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setCoreKey(navigator.userAgent.indexOf("Mac OS X") ? "⌘" : "CTRL");
    }
  }, []);

  return (
    <Flex
      gap="xs"
      align="center"
      style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        zIndex: 100,
      }}
    >
      <Menu withArrow>
        <Menu.Target>
          <ActionIcon aria-label="actions" size="lg" color="gray" variant="light">
            <LuMenu size="18" />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            fz="sm"
            leftSection={<LuImageDown color="gray" />}
            onClick={() => setVisible("DownloadModal", true)}
          >
            <Flex justify="space-between" gap="md">
              <Text inherit>Export</Text>
              <Text fz="xs" ml="md" c="dimmed">
                {coreKey} + S
              </Text>
            </Flex>
          </Menu.Item>
          <Menu.Item
            fz="sm"
            onClick={() => {
              toggleDirection();
              gaEvent("rotate_layout", { label: direction });
            }}
            leftSection={
              <StyledFlowIcon color="gray" rotate={rotateLayout(direction || "RIGHT")} />
            }
            rightSection={
              <Text fz="xs" ml="md" c="dimmed">
                {coreKey} Shift D
              </Text>
            }
            closeMenuOnClick={false}
          >
            Rotate Layout
          </Menu.Item>
          <Menu.Divider />
          <Menu.Sub position="right" offset={0}>
            <Menu.Sub.Target>
              <Menu.Sub.Item fz="sm">View Options</Menu.Sub.Item>
            </Menu.Sub.Target>
            <Menu.Sub.Dropdown>
              <Menu.Item
                fz="sm"
                leftSection={<BsCheck2 opacity={rulersEnabled ? 100 : 0} />}
                onClick={() => {
                  toggleRulers(!rulersEnabled);
                  gaEvent("toggle_rulers", { label: rulersEnabled ? "on" : "off" });
                }}
                closeMenuOnClick={false}
              >
                Rulers
              </Menu.Item>
              <Menu.Item
                fz="sm"
                leftSection={<BsCheck2 opacity={gesturesEnabled ? 100 : 0} />}
                onClick={() => {
                  toggleGestures(!gesturesEnabled);
                  gaEvent("toggle_gestures", { label: gesturesEnabled ? "on" : "off" });
                }}
              >
                Zoom on Scroll
              </Menu.Item>
            </Menu.Sub.Dropdown>
          </Menu.Sub>
        </Menu.Dropdown>
      </Menu>
    </Flex>
  );
};
