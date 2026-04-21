import React from "react";
import Link from "next/link";
import { ActionIcon, Flex, Group, TextInput, Tooltip } from "@mantine/core";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
import styled from "styled-components";
import toast from "react-hot-toast";
import { AiOutlineFullscreen, AiOutlineSearch } from "react-icons/ai";
import { FaChrome } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";
import { LuChevronDown, LuChevronUp, LuX } from "react-icons/lu";
import { TbExternalLink } from "react-icons/tb";
import { useFocusNode } from "../../../hooks/useFocusNode";
import { JSONCrackLogo } from "../../../layout/JSONCrackBrandLogo";
import { FileMenu } from "./FileMenu";
import { ThemeToggle } from "./ThemeToggle";
import { ToolsMenu } from "./ToolsMenu";
import { ViewMenu } from "./ViewMenu";
import { StyledToolElement } from "./styles";

const StyledToDiagramLink = styled.a`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 4px;
  white-space: nowrap;
  background: linear-gradient(135deg, #ff75b7 0%, #fed761 100%);
  color: #1a1a1a;
  text-decoration: none;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.85;
  }
`;

const StyledTools = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  gap: 4px;
  justify-content: space-between;
  height: 45px;
  padding: 6px 12px;
  background: ${({ theme }) => theme.TOOLBAR_BG};
  color: ${({ theme }) => theme.SILVER};
  z-index: 36;
  border-bottom: 1px solid ${({ theme }) => theme.SILVER_DARK};

  @media only screen and (max-width: 320px) {
    display: none;
  }
`;

const StyledSearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${({ theme }) => theme.BACKGROUND_SECONDARY};
  border-radius: 4px;
  padding: 2px 8px;
  min-width: 200px;
  max-width: 350px;
  border: 1px solid ${({ theme }) => theme.SILVER_DARK};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const StyledSearchInput = styled(TextInput)`
  flex: 1;
  input {
    min-height: 28px;
    height: 28px;
    padding: 0 4px;
    font-size: 13px;
    color: ${({ theme }) => theme.SILVER};
    background: transparent;
    border: none;
    outline: none;

    &::placeholder {
      color: ${({ theme }) => theme.SILVER}80;
    }
  }
`;

const SearchCounter = styled.div<{ $none?: boolean }>`
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme, $none }) =>
    $none
      ? theme.BACKGROUND_SECONDARY === "#f2f3f5"
        ? "#dc2626"
        : "#f87171"
      : theme.BACKGROUND_SECONDARY === "#f2f3f5"
        ? "rgba(15, 23, 42, 0.55)"
        : "rgba(255, 255, 255, 0.55)"};
  white-space: nowrap;
  padding: 0 4px;
  letter-spacing: 0.2px;
`;

function fullscreenBrowser() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {
      toast.error("Unable to enter fullscreen mode.");
    });
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

export const Toolbar = () => {
  const { value, setValue, next, prev, clear, nodeCount, selectedNode } = useFocusNode();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const hasValue = value.length > 0;
  const hasMatches = nodeCount > 0;
  const noResults = hasValue && !hasMatches;

  const handleKeyDown = getHotkeyHandler([
    ["Enter", next],
    ["shift+Enter", prev],
    ["Escape", clear],
  ]);

  useHotkeys([["mod+f", () => inputRef.current?.focus()]], []);

  return (
    <StyledTools>
      <Group gap="xs" justify="left" w="100%" style={{ flexWrap: "nowrap" }}>
        <StyledToolElement title="JSON Crack">
          <Flex gap="xs" align="center" justify="center">
            <JSONCrackLogo fontSize="14px" hideLogo />
          </Flex>
        </StyledToolElement>
        <FileMenu />
        <ViewMenu />
        <ToolsMenu />
      </Group>
      <Group gap="xs" justify="right" w="100%" style={{ flexWrap: "nowrap" }}>
        <StyledSearchContainer>
          <AiOutlineSearch size={14} opacity={0.6} />
          <StyledSearchInput
            ref={inputRef}
            variant="unstyled"
            type="search"
            size="xs"
            id="search-node-top"
            value={value}
            onChange={e => setValue(e.currentTarget.value)}
            placeholder="Search nodes (⌘F)"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            onKeyDown={handleKeyDown}
          />
          {hasValue && (
            <SearchCounter $none={noResults}>
              {noResults ? "No matches" : `${selectedNode + 1} / ${nodeCount}`}
            </SearchCounter>
          )}
          {hasValue && (
            <>
              <Tooltip label="Previous (⇧⏎)" position="bottom" withArrow openDelay={500}>
                <ActionIcon
                  aria-label="previous match"
                  size="sm"
                  radius="sm"
                  variant="subtle"
                  color="gray"
                  onClick={prev}
                  disabled={!hasMatches}
                >
                  <LuChevronUp size={14} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Next (⏎)" position="bottom" withArrow openDelay={500}>
                <ActionIcon
                  aria-label="next match"
                  size="sm"
                  radius="sm"
                  variant="subtle"
                  color="gray"
                  onClick={next}
                  disabled={!hasMatches}
                >
                  <LuChevronDown size={14} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Close (Esc)" position="bottom" withArrow openDelay={500}>
                <ActionIcon
                  aria-label="clear search"
                  size="sm"
                  radius="sm"
                  variant="subtle"
                  color="gray"
                  onClick={clear}
                >
                  <LuX size={14} />
                </ActionIcon>
              </Tooltip>
            </>
          )}
        </StyledSearchContainer>
        {process.env.NEXT_PUBLIC_DISABLE_EXTERNAL_MODE !== "true" && (
          <StyledToDiagramLink
            href="https://todiagram.com/editor?utm_source=jsoncrack&utm_medium=toolbar"
            target="_blank"
            rel="noopener"
          >
            Upgrade to Pro Editor <TbExternalLink size={14} />
          </StyledToDiagramLink>
        )}
        <ThemeToggle />
        <Link
          href="https://chromewebstore.google.com/detail/json-crack/hbaeglefdflnhodchjiaphmheaojikhh"
          rel="noopener"
          target="_blank"
        >
          <StyledToolElement title="Get Chrome Extension">
            <FaChrome size="20" />
          </StyledToolElement>
        </Link>
        <Link href="https://github.com/AykutSarac/jsoncrack.com" rel="noopener" target="_blank">
          <StyledToolElement title="GitHub">
            <FaGithub size="20" />
          </StyledToolElement>
        </Link>
        <StyledToolElement title="Fullscreen" onClick={fullscreenBrowser}>
          <AiOutlineFullscreen size="20" />
        </StyledToolElement>
      </Group>
    </StyledTools>
  );
};
