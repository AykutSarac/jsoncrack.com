import React from "react";
import { Flex, Menu, Popover, Text, Tooltip } from "@mantine/core";
import styled from "styled-components";
import { event as gaEvent } from "nextjs-google-analytics";
import { IoMdCheckmark } from "react-icons/io";
import { LuPanelLeftClose } from "react-icons/lu";
import { LuChevronDown } from "react-icons/lu";
import { VscCheck, VscError, VscRunAll, VscSync, VscSyncIgnored } from "react-icons/vsc";
import { formats } from "../../enums/file.enum";
import useConfig from "../../store/useConfig";
import useFile from "../../store/useFile";
import useGraph from "./views/GraphView/stores/useGraph";

const StyledBottomBar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px;
  border-bottom: 1px solid ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
  background: ${({ theme }) => theme.TOOLBAR_BG};
  z-index: 2;
  flex-shrink: 0;

  @media screen and (max-width: 320px) {
    display: none;
  }
`;

const StyledLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0;

  @media screen and (max-width: 480px) {
    display: none;
  }
`;

const StyledRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
`;

const StyledBottomBarItem = styled.button<{ $bg?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: fit-content;
  margin: 0;
  height: 26px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};
  background: ${({ $bg }) => $bg || "transparent"};
  border: none;
  border-radius: 6px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
  transition:
    background-color 120ms ease,
    color 120ms ease;

  &:hover:not(&:disabled) {
    background-color: ${({ theme }) =>
      theme.BACKGROUND_SECONDARY === "#f2f3f5"
        ? "rgba(0, 0, 0, 0.05)"
        : "rgba(255, 255, 255, 0.05)"};
    color: ${({ theme }) => theme.INTERACTIVE_HOVER};
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`;

export const BottomBar = () => {
  const data = useFile(state => state.fileData);
  const toggleLiveTransform = useConfig(state => state.toggleLiveTransform);
  const liveTransformEnabled = useConfig(state => state.liveTransformEnabled);
  const error = useFile(state => state.error);
  const setContents = useFile(state => state.setContents);
  const toggleFullscreen = useGraph(state => state.toggleFullscreen);
  const fullscreen = useGraph(state => state.fullscreen);
  const setFormat = useFile(state => state.setFormat);
  const currentFormat = useFile(state => state.format);

  const toggleEditor = () => {
    toggleFullscreen(!fullscreen);
    gaEvent("toggle_fullscreen");
  };

  React.useEffect(() => {
    if (data?.name) window.document.title = `${data.name} | JSON Crack`;
  }, [data]);

  return (
    <StyledBottomBar>
      <StyledLeft>
        <Tooltip label="Close editor" position="bottom" withArrow openDelay={750}>
          <StyledBottomBarItem onClick={toggleEditor} aria-label="close editor">
            <LuPanelLeftClose size={14} />
          </StyledBottomBarItem>
        </Tooltip>
        <StyledBottomBarItem>
          {error ? (
            <Popover width="auto" shadow="md" position="top" withArrow>
              <Popover.Target>
                <Flex align="center" gap={2}>
                  <VscError color="red" />
                  <Text c="red" fw={500} fz="xs">
                    Invalid
                  </Text>
                </Flex>
              </Popover.Target>
              <Popover.Dropdown style={{ pointerEvents: "none" }}>
                <Text size="xs">{error}</Text>
              </Popover.Dropdown>
            </Popover>
          ) : (
            <Flex align="center" gap={2}>
              <VscCheck />
              <Text size="xs">Valid</Text>
            </Flex>
          )}
        </StyledBottomBarItem>
        <StyledBottomBarItem
          onClick={() => {
            toggleLiveTransform(!liveTransformEnabled);
            gaEvent("toggle_live_transform");
          }}
        >
          {liveTransformEnabled ? <VscSync /> : <VscSyncIgnored />}
          <Text fz="xs">Live Transform</Text>
        </StyledBottomBarItem>
        {!liveTransformEnabled && (
          <StyledBottomBarItem onClick={() => setContents({})} disabled={!!error}>
            <VscRunAll />
            Click to Transform
          </StyledBottomBarItem>
        )}
      </StyledLeft>

      <StyledRight>
        <Menu offset={8}>
          <Menu.Target>
            <StyledBottomBarItem>
              <Flex align="center" gap={2}>
                <Text size="xs">{currentFormat?.toUpperCase()}</Text>
                <LuChevronDown size={12} />
              </Flex>
            </StyledBottomBarItem>
          </Menu.Target>
          <Menu.Dropdown>
            {formats.map(format => (
              <Menu.Item
                key={format.value}
                onClick={() => setFormat(format.value)}
                rightSection={currentFormat === format.value && <IoMdCheckmark />}
              >
                {format.label}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      </StyledRight>
    </StyledBottomBar>
  );
};
