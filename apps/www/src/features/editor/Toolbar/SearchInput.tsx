import React from "react";
import { ActionIcon, TextInput, Tooltip } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import styled from "styled-components";
import { AiOutlineSearch } from "react-icons/ai";
import { LuChevronDown, LuChevronUp, LuX } from "react-icons/lu";
import { useFocusNode } from "../../../hooks/useFocusNode";

interface SearchInputProps {
  onClose?: () => void;
}

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
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

export const SearchInput = ({ onClose }: SearchInputProps) => {
  const { value, setValue, next, prev, clear, nodeCount, selectedNode } = useFocusNode();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const hasValue = value.length > 0;
  const hasMatches = nodeCount > 0;
  const noResults = hasValue && !hasMatches;

  React.useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const handleClose = () => {
    clear();
    onClose?.();
  };

  return (
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
        placeholder="Search nodes"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        onKeyDown={getHotkeyHandler([
          ["Enter", next],
          ["shift+Enter", prev],
          ["Escape", handleClose],
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
      <Tooltip label="Close (Esc)" position="top" withArrow openDelay={500}>
        <ActionIcon
          aria-label="close search"
          size="sm"
          radius="sm"
          variant="subtle"
          color="gray"
          onClick={handleClose}
        >
          <LuX size={14} />
        </ActionIcon>
      </Tooltip>
    </Row>
  );
};
