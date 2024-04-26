import React from "react";
import { Menu, Flex } from "@mantine/core";
import { CgChevronDown } from "react-icons/cg";
import { MdCompare } from "react-icons/md";
import { SiJsonwebtokens } from "react-icons/si";
import { VscSearchFuzzy, VscJson, VscGroupByRefType, VscLock } from "react-icons/vsc";
import { gaEvent } from "src/lib/utils/gaEvent";
import useModal from "src/store/useModal";
import * as Styles from "./styles";

export const ToolsMenu = () => {
  const setVisible = useModal(state => state.setVisible);

  return (
    <Menu shadow="md" withArrow>
      <Menu.Target>
        <Styles.StyledToolElement onClick={() => gaEvent("click", "tools menu")}>
          <Flex align="center" gap={3}>
            Tools <CgChevronDown />
          </Flex>
        </Styles.StyledToolElement>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          fz={12}
          leftSection={<MdCompare />}
          rightSection={<VscLock />}
          onClick={() => setVisible("premium")(true)}
        >
          Compare Data
        </Menu.Item>
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
