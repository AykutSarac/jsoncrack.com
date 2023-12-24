import React from "react";
import { Menu, Flex } from "@mantine/core";
import { CgChevronDown } from "react-icons/cg";
import { SiJsonwebtokens } from "react-icons/si";
import { VscSearchFuzzy, VscJson, VscGroupByRefType } from "react-icons/vsc";
import useModal from "src/store/useModal";
import * as Styles from "./styles";

export const ToolsMenu = () => {
  const setVisible = useModal(state => state.setVisible);

  return (
    <Menu shadow="md" withArrow>
      <Menu.Target>
        <Styles.StyledToolElement>
          <Flex align="center" gap={3}>
            Tools <CgChevronDown />
          </Flex>
        </Styles.StyledToolElement>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item fz={12} leftSection={<VscSearchFuzzy />} onClick={() => setVisible("jq")(true)}>
          JSON Query (jq)
        </Menu.Item>
        <Menu.Item fz={12} leftSection={<VscJson />} onClick={() => setVisible("schema")(true)}>
          JSON Schema
        </Menu.Item>
        <Menu.Item
          fz={12}
          leftSection={<SiJsonwebtokens />}
          onClick={() => setVisible("jwt")(true)}
        >
          Decode JWT
        </Menu.Item>
        <Menu.Item
          fz={12}
          leftSection={<VscGroupByRefType />}
          onClick={() => setVisible("type")(true)}
        >
          Generate Type
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
