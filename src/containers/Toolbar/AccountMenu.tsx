import React from "react";
import Link from "next/link";
import { Menu, Avatar, Text } from "@mantine/core";
import { VscSignIn, VscFeedback, VscSignOut } from "react-icons/vsc";
import useModal from "src/store/useModal";
import useUser from "src/store/useUser";
import { StyledToolElement } from "./styles";

export const AccountMenu = () => {
  const user = useUser(state => state.user?.user_metadata);
  const logout = useUser(state => state.logout);
  const setVisible = useModal(state => state.setVisible);

  const username = user?.full_name || user?.display_name || user?.name;

  return (
    <Menu shadow="md" trigger="click" closeOnItemClick={false} withArrow>
      <Menu.Target>
        <StyledToolElement>
          <Avatar color={user ? "teal" : "indigo"} variant="filled" size={20} radius="xl">
            {user && "JC"}
          </Avatar>
        </StyledToolElement>
      </Menu.Target>
      <Menu.Dropdown>
        {user ? (
          <Menu.Item
            leftSection={<Avatar color="indigo" alt={username} size={20} radius="xl" />}
            onClick={() => setVisible("account")(true)}
            closeMenuOnClick
          >
            <Text size="xs">{username ?? "Account"}</Text>
          </Menu.Item>
        ) : (
          <Link href="/sign-in" prefetch={false}>
            <Menu.Item leftSection={<VscSignIn />}>
              <Text size="xs">Sign in</Text>
            </Menu.Item>
          </Link>
        )}
        {user && (
          <>
            <Menu.Divider />
            <Link href="https://github.com/AykutSarac/jsoncrack.com/discussions" target="_blank">
              <Menu.Item leftSection={<VscFeedback />} closeMenuOnClick>
                <Text size="xs">Feedback</Text>
              </Menu.Item>
            </Link>
            <Menu.Item leftSection={<VscSignOut />} onClick={() => logout()} closeMenuOnClick>
              <Text size="xs">Log out</Text>
            </Menu.Item>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};
