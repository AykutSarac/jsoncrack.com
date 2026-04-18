import React from "react";
import { ActionIcon, Divider, Flex, Menu, Tooltip } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import styled, { css } from "styled-components";
import type { LayoutDirection } from "jsoncrack-react";
import { event as gaEvent } from "nextjs-google-analytics";
import { BsCheck2 } from "react-icons/bs";
import { FaMoon, FaSun } from "react-icons/fa6";
import {
  LuCopyMinus,
  LuCopyPlus,
  LuImageDown,
  LuMinus,
  LuPlus,
  LuSearch,
  LuSettings2,
} from "react-icons/lu";
import { MdFullscreen, MdOutlineCenterFocusStrong } from "react-icons/md";
import { TbArrowsLeftRight } from "react-icons/tb";
import useConfig from "../../../../../store/useConfig";
import useJson from "../../../../../store/useJson";
import { useModal } from "../../../../../store/useModal";
import { SearchInput } from "../../../Toolbar/SearchInput";
import useGraph from "../stores/useGraph";

const glassSurface = css`
  border-radius: 14px;
  background: ${({ theme }) =>
    theme.BACKGROUND_SECONDARY === "#f2f3f5"
      ? "rgba(255, 255, 255, 0.72)"
      : "rgba(28, 28, 30, 0.72)"};
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid
    ${({ theme }) =>
      theme.BACKGROUND_SECONDARY === "#f2f3f5"
        ? "rgba(0, 0, 0, 0.06)"
        : "rgba(255, 255, 255, 0.08)"};
  box-shadow:
    ${({ theme }) =>
      theme.BACKGROUND_SECONDARY === "#f2f3f5"
        ? "inset 0 1px 0 rgba(255, 255, 255, 0.9)"
        : "inset 0 1px 0 rgba(255, 255, 255, 0.06)"},
    0 1px 2px
      ${({ theme }) =>
        theme.BACKGROUND_SECONDARY === "#f2f3f5" ? "rgba(0, 0, 0, 0.04)" : "rgba(0, 0, 0, 0.25)"},
    0 8px 24px -4px
      ${({ theme }) =>
        theme.BACKGROUND_SECONDARY === "#f2f3f5"
          ? "rgba(15, 23, 42, 0.12)"
          : "rgba(0, 0, 0, 0.45)"};
`;

const StyledToolbarDock = styled.div`
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const StyledSearchBar = styled.div`
  ${glassSurface}
  padding: 6px 8px;
  min-width: 360px;
`;

const StyledToolbar = styled.div`
  ${glassSurface}
  display: flex;
  align-items: center;
  padding: 5px;

  [data-mantine-divider] {
    border-color: ${({ theme }) =>
      theme.BACKGROUND_SECONDARY === "#f2f3f5"
        ? "rgba(15, 23, 42, 0.1)"
        : "rgba(255, 255, 255, 0.08)"};
    height: 18px;
    align-self: center;
  }
`;

const getNextDirection = (direction: LayoutDirection): LayoutDirection => {
  if (direction === "RIGHT") return "DOWN";
  if (direction === "DOWN") return "LEFT";
  if (direction === "LEFT") return "UP";
  return "RIGHT";
};

export const Toolbar = () => {
  const zoomIn = useGraph(state => state.zoomIn);
  const zoomOut = useGraph(state => state.zoomOut);
  const centerView = useGraph(state => state.centerView);
  const focusFirstNode = useGraph(state => state.focusFirstNode);
  const direction = useGraph(state => state.direction);
  const setDirection = useGraph(state => state.setDirection);
  const collapsedPaths = useGraph(state => state.collapsedPaths);
  const expandAll = useGraph(state => state.expandAll);
  const collapseAllDepth1 = useGraph(state => state.collapseAllDepth1);
  const json = useJson(state => state.json);
  const setVisible = useModal(state => state.setVisible);
  const darkmodeEnabled = useConfig(state => state.darkmodeEnabled);
  const toggleDarkMode = useConfig(state => state.toggleDarkMode);
  const gesturesEnabled = useConfig(state => state.gesturesEnabled);
  const toggleGestures = useConfig(state => state.toggleGestures);
  const rulersEnabled = useConfig(state => state.rulersEnabled);
  const toggleRulers = useConfig(state => state.toggleRulers);

  const [searchOpen, setSearchOpen] = React.useState(false);
  const [coreKey, setCoreKey] = React.useState("CTRL");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setCoreKey(navigator.userAgent.indexOf("Mac OS X") !== -1 ? "⌘" : "CTRL");
    }
  }, []);

  const handleSearchToggle = () => {
    setSearchOpen(current => !current);
  };

  const toggleDirection = () => {
    setDirection(getNextDirection(direction || "RIGHT"));
    gaEvent("rotate_layout", { label: direction });
  };

  useHotkeys(
    [
      ["mod+[plus]", zoomIn, { usePhysicalKeys: true }],
      ["mod+[minus]", zoomOut, { usePhysicalKeys: true }],
      ["shift+Digit1", focusFirstNode, { usePhysicalKeys: true }],
      ["shift+Digit2", centerView, { usePhysicalKeys: true }],
      ["mod+f", handleSearchToggle],
      ["mod+s", () => setVisible("DownloadModal", true)],
      ["mod+shift+d", toggleDirection],
    ],
    []
  );

  return (
    <StyledToolbarDock>
      {searchOpen && (
        <StyledSearchBar>
          <SearchInput onClose={() => setSearchOpen(false)} />
        </StyledSearchBar>
      )}
      <StyledToolbar>
        <Flex gap={4} align="center">
          <Tooltip label="Center first item (⇧1)" position="top" withArrow openDelay={750}>
            <ActionIcon
              aria-label="center first item"
              size="lg"
              radius="md"
              variant="subtle"
              color="gray"
              onClick={() => {
                focusFirstNode();
                gaEvent("focus_first_node");
              }}
            >
              <MdOutlineCenterFocusStrong size={18} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Fit to center (⇧2)" position="top" withArrow openDelay={750}>
            <ActionIcon
              aria-label="fit to center"
              size="lg"
              radius="md"
              variant="subtle"
              color="gray"
              onClick={() => {
                centerView();
                gaEvent("center_view");
              }}
            >
              <MdFullscreen size={20} />
            </ActionIcon>
          </Tooltip>

          <ActionIcon
            aria-label="zoom out"
            size="lg"
            radius="md"
            variant="subtle"
            color="gray"
            onClick={() => {
              zoomOut();
              gaEvent("zoom_out");
            }}
          >
            <LuMinus size={16} />
          </ActionIcon>

          <ActionIcon
            aria-label="zoom in"
            size="lg"
            radius="md"
            variant="subtle"
            color="gray"
            onClick={() => {
              zoomIn();
              gaEvent("zoom_in");
            }}
          >
            <LuPlus size={16} />
          </ActionIcon>

          <Divider orientation="vertical" mx={2} />

          <Tooltip label={`Export (${coreKey}+S)`} position="top" withArrow openDelay={750}>
            <ActionIcon
              aria-label="export"
              size="lg"
              radius="md"
              variant="subtle"
              color="gray"
              onClick={() => setVisible("DownloadModal", true)}
            >
              <LuImageDown size={18} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label={`Search (${coreKey}+F)`} position="top" withArrow openDelay={750}>
            <ActionIcon
              aria-label="search"
              size="lg"
              radius="md"
              variant={searchOpen ? "light" : "subtle"}
              color="gray"
              onClick={handleSearchToggle}
            >
              <LuSearch size={18} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Rotate layout" position="top" withArrow openDelay={750}>
            <ActionIcon
              aria-label="rotate layout"
              size="lg"
              radius="md"
              variant="subtle"
              color="gray"
              onClick={toggleDirection}
            >
              <TbArrowsLeftRight size={18} />
            </ActionIcon>
          </Tooltip>

          <Tooltip
            label={
              collapsedPaths.length > 0
                ? `Expand all (${collapsedPaths.length} collapsed)`
                : "Collapse all"
            }
            position="top"
            withArrow
            openDelay={750}
          >
            <ActionIcon
              aria-label={collapsedPaths.length > 0 ? "expand all" : "collapse all"}
              size="lg"
              radius="md"
              variant="subtle"
              color="gray"
              onClick={() => {
                if (collapsedPaths.length > 0) {
                  expandAll();
                  gaEvent("expand_all");
                } else {
                  collapseAllDepth1(json);
                  gaEvent("collapse_all");
                }
              }}
            >
              {collapsedPaths.length > 0 ? <LuCopyPlus size={18} /> : <LuCopyMinus size={18} />}
            </ActionIcon>
          </Tooltip>

          <Divider orientation="vertical" mx={2} />

          <Menu trigger="click" position="top-end">
            <Menu.Target>
              <Tooltip label="Preferences" position="top" withArrow openDelay={750}>
                <ActionIcon
                  aria-label="preferences"
                  size="lg"
                  radius="md"
                  variant="subtle"
                  color="gray"
                >
                  <LuSettings2 size={18} />
                </ActionIcon>
              </Tooltip>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                fz="sm"
                leftSection={darkmodeEnabled ? <FaSun /> : <FaMoon />}
                onClick={() => toggleDarkMode(!darkmodeEnabled)}
                closeMenuOnClick={false}
              >
                {darkmodeEnabled ? "Light Mode" : "Dark Mode"}
              </Menu.Item>
              <Menu.Item
                fz="sm"
                rightSection={<BsCheck2 display={gesturesEnabled ? "initial" : "none"} />}
                onClick={() => {
                  toggleGestures(!gesturesEnabled);
                  gaEvent("toggle_gestures", { label: gesturesEnabled ? "on" : "off" });
                }}
                closeMenuOnClick={false}
              >
                Zoom on Scroll
              </Menu.Item>
              <Menu.Item
                fz="sm"
                rightSection={<BsCheck2 display={rulersEnabled ? "initial" : "none"} />}
                onClick={() => {
                  toggleRulers(!rulersEnabled);
                  gaEvent("toggle_rulers", { label: rulersEnabled ? "on" : "off" });
                }}
                closeMenuOnClick={false}
              >
                Rulers
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>
      </StyledToolbar>
    </StyledToolbarDock>
  );
};
