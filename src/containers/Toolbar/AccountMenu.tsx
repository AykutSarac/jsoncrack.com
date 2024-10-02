import React from "react";
import { Menu, Avatar, Text } from "@mantine/core";
import { FaRegCircleUser } from "react-icons/fa6";
import { VscSignIn } from "react-icons/vsc";
import { StyledToolElement } from "./styles";

export const AccountMenu = () => {
  return (
    <Menu shadow="md" trigger="click" closeOnItemClick={false} withArrow>
      <Menu.Target>
        <StyledToolElement>
          <Avatar color="blue" variant="filled" size={20} radius="xl">
            <FaRegCircleUser size="12" />
          </Avatar>
        </StyledToolElement>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          component="a"
          href="https://todiagram.com/sign-up?utm_source=signup&utm_medium=app&utm_content=toolbar"
          target="_blank"
          leftSection={<VscSignIn />}
        >
          <Text size="xs">Sign up</Text>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
