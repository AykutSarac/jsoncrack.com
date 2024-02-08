import React from "react";
import { Flex, Text, TextInput } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import ReactGA from "react-ga4";
import { AiOutlineSearch } from "react-icons/ai";
import { useFocusNode } from "src/hooks/useFocusNode";
import useGraph from "src/store/useGraph";

export const SearchInput: React.FC = () => {
  const [searchValue, setValue, skip, nodeCount, currentNode] = useFocusNode();
  const setSearchInputValue = useGraph(state => state.setSearchInputValue);

  return (
    <TextInput
      type="search"
      size="xs"
      id="search-node"
      w={180}
      value={searchValue}
      onChange={e => {
        setValue(e.currentTarget.value);
        setSearchInputValue(e.currentTarget.value);
      }}
      onFocus={() => ReactGA.event({ action: "focus_node_search", category: "User" })}
      placeholder="Search Node"
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
    />
  );
};
