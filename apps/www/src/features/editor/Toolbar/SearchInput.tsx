import React from "react";
import { ActionIcon, Text, TextInput, Tooltip } from "@mantine/core";
import { getHotkeyHandler, useOs } from "@mantine/hooks";
import styled from "styled-components";
import { AiOutlineSearch } from "react-icons/ai";
import { LuChevronDown, LuChevronUp, LuX } from "react-icons/lu";
import { useFocusNode } from "../../../hooks/useFocusNode";

interface SearchInputProps {
  onClose?: () => void;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 320px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 4px 2px 8px;
  border-radius: 8px;
  background: ${({ theme }) =>
    theme.BACKGROUND_SECONDARY === "#f2f3f5"
      ? "rgba(15, 23, 42, 0.04)"
      : "rgba(255, 255, 255, 0.05)"};
  border: 1px solid
    ${({ theme }) =>
      theme.BACKGROUND_SECONDARY === "#f2f3f5"
        ? "rgba(15, 23, 42, 0.08)"
        : "rgba(255, 255, 255, 0.08)"};
  transition: border-color 120ms ease;

  &:focus-within {
    border-color: ${({ theme }) =>
      theme.BACKGROUND_SECONDARY === "#f2f3f5"
        ? "rgba(59, 130, 246, 0.6)"
        : "rgba(96, 165, 250, 0.6)"};
  }
`;

const Counter = styled.div<{ $none?: boolean }>`
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

const Hint = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 10.5px;
  color: ${({ theme }) =>
    theme.BACKGROUND_SECONDARY === "#f2f3f5"
      ? "rgba(15, 23, 42, 0.5)"
      : "rgba(255, 255, 255, 0.45)"};
  padding: 0 2px;
  letter-spacing: 0.2px;

  kbd {
    display: inline-block;
    padding: 1px 5px;
    margin: 0 2px;
    font-size: 10px;
    font-family: inherit;
    color: inherit;
    background: ${({ theme }) =>
      theme.BACKGROUND_SECONDARY === "#f2f3f5"
        ? "rgba(15, 23, 42, 0.06)"
        : "rgba(255, 255, 255, 0.08)"};
    border: 1px solid
      ${({ theme }) =>
        theme.BACKGROUND_SECONDARY === "#f2f3f5"
          ? "rgba(15, 23, 42, 0.1)"
          : "rgba(255, 255, 255, 0.08)"};
    border-radius: 3px;
    line-height: 1;
  }
`;

export const SearchInput = ({ onClose }: SearchInputProps) => {
  const { value, setValue, next, prev, clear, nodeCount, selectedNode } = useFocusNode();
  const os = useOs();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const coreKey = os === "macos" ? "⌘" : "Ctrl";
  const hasValue = value.length > 0;
  const hasMatches = nodeCount > 0;
  const noResults = hasValue && !hasMatches;

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleClear = () => {
    clear();
    inputRef.current?.focus();
  };

  const handleEscape = () => {
    if (hasValue) {
      clear();
      return;
    }
    onClose?.();
  };

  return (
    <Wrapper>
      <Row>
        <AiOutlineSearch size={14} opacity={0.6} />
        <TextInput
          ref={inputRef}
          variant="unstyled"
          type="search"
          size="xs"
          id="search-node"
          flex={1}
          value={value}
          onChange={e => setValue(e.currentTarget.value)}
          placeholder={`Search nodes (${coreKey}+F)`}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          onKeyDown={getHotkeyHandler([
            ["Enter", next],
            ["shift+Enter", prev],
            ["Escape", handleEscape],
          ])}
          styles={{
            input: { minHeight: 26, height: 26, padding: "0 4px" },
          }}
        />
        {hasValue && (
          <Counter $none={noResults}>
            {noResults ? "No matches" : `${selectedNode + 1} / ${nodeCount}`}
          </Counter>
        )}
        <Tooltip label="Previous (⇧⏎)" position="top" withArrow openDelay={500}>
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
        <Tooltip label="Next (⏎)" position="top" withArrow openDelay={500}>
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
        <Tooltip label="Clear (Esc)" position="top" withArrow openDelay={500}>
          <ActionIcon
            aria-label="clear search"
            size="sm"
            radius="sm"
            variant="subtle"
            color="gray"
            onClick={handleClear}
            disabled={!hasValue}
          >
            <LuX size={14} />
          </ActionIcon>
        </Tooltip>
      </Row>
      <Hint>
        <Text component="span" inherit>
          <kbd>↵</kbd> next <kbd>⇧ ↵</kbd> prev
        </Text>
        <Text component="span" inherit>
          <kbd>Esc</kbd> close
        </Text>
      </Hint>
    </Wrapper>
  );
};
