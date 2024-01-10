import React from "react";
import Link from "next/link";
import { Menu, Avatar, Text } from "@mantine/core";
import { useUser as useSupabaseUser } from "@supabase/auth-helpers-react";
import { VscSignIn, VscFeedback, VscSignOut } from "react-icons/vsc";
import useModal from "src/store/useModal";
import useUser from "src/store/useUser";
import * as Styles from "./styles";

export const AccountMenu = () => {
  const user = useSupabaseUser();
  const logout = useUser(state => state.logout);
  const setVisible = useModal(state => state.setVisible);

  console.log(user);

  return (
    <Menu shadow="md" trigger="click" closeOnItemClick={false} withArrow>
      <Menu.Target>
        <Styles.StyledToolElement>
          <Avatar color={user ? "teal" : "indigo"} variant="filled" size={20} radius="xl">
            {user && "JC"}
          </Avatar>
        </Styles.StyledToolElement>
      </Menu.Target>
      <Menu.Dropdown>
        {user ? (
          <Menu.Item
            leftSection={
              <Avatar color="indigo" alt={user.user_metadata?.name} size={20} radius="xl" />
            }
            onClick={() => setVisible("account")(true)}
            closeMenuOnClick
          >
            <Text size="xs">Account</Text>
          </Menu.Item>
        ) : (
          <Link href="/sign-in">
            <Menu.Item leftSection={<VscSignIn />}>
              <Text size="xs">Sign in</Text>
            </Menu.Item>
          </Link>
        )}
        {user && (
          <>
            <Menu.Divider />
            <Menu.Item
              leftSection={<VscFeedback />}
              onClick={() => setVisible("review")(true)}
              closeMenuOnClick
            >
              <Text size="xs">Feedback</Text>
            </Menu.Item>
            <Menu.Item leftSection={<VscSignOut />} onClick={() => logout()} closeMenuOnClick>
              <Text size="xs">Log out</Text>
            </Menu.Item>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};
