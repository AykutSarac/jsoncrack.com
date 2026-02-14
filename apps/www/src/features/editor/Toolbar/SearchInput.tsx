import React from "react";
import { Flex, Text, TextInput } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import { useOs } from "@mantine/hooks";
import { AiOutlineSearch } from "react-icons/ai";
import { useFocusNode } from "../../../hooks/useFocusNode";

export const SearchInput = () => {
  const [searchValue, setValue, skip, nodeCount, currentNode] = useFocusNode();
  const os = useOs();

  const coreKey = os === "macos" ? "⌘" : "Ctrl";

  return (
    <TextInput
      variant="unstyled"
      type="search"
      size="xs"
      id="search-node"
      w={180}
      value={searchValue}
      onChange={e => setValue(e.currentTarget.value)}
      placeholder={`Search Node (${coreKey} + F)`}
      autoComplete="off"
      autoCorrect="off"
      onKeyDown={getHotkeyHandler([["Enter", skip]])}
      leftSection={<AiOutlineSearch />}
      rightSection={
        searchValue && (
          <Flex h={30} align="center">
            <Text size="xs" c="dimmed" pr="md">
              {searchValue && `${nodeCount}/${nodeCount > 0 ? currentNode + 1 : "0"}`}
            </Text>
          </Flex>
        )
      }
      style={{ borderBottom: "1px solid gray" }}
    />
  );
};
