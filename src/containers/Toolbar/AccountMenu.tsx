import React from "react";
import Link from "next/link";
import { Menu, Avatar, Text } from "@mantine/core";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { VscSignIn, VscFeedback, VscSignOut } from "react-icons/vsc";
import useModal from "src/store/useModal";
import useUser from "src/store/useUser";
import * as Styles from "./styles";

export const AccountMenu = () => {
  const user = useUser(state => state.user);
  const premium = useUser(state => state.premium);
  const logout = useUser(state => state.logout);
  const setVisible = useModal(state => state.setVisible);

  return (
    <Menu shadow="md" trigger="click" closeOnItemClick={false} withArrow>
      <Menu.Target>
        <Styles.StyledToolElement>
          <Avatar
            color="grape"
            variant="filled"
            size={20}
            radius="xl"
            src={user?.user_metadata.avatar_url}
            alt={user?.user_metadata.name}
          >
            {user?.user_metadata.name[0]}
          </Avatar>
        </Styles.StyledToolElement>
      </Menu.Target>
      <Menu.Dropdown>
        {user ? (
          <Menu.Item
            leftSection={
              <Avatar color="grape" alt={user.user_metadata.name} size={20} radius="xl" />
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
        {!premium && (
          <Menu.Item
            leftSection={<MdOutlineWorkspacePremium color="red" />}
            onClick={() => setVisible("premium")(true)}
            closeMenuOnClick
          >
            <Text variant="gradient" fw="bold" gradient={{ from: "orange", to: "red" }} size="xs">
              Get Premium
            </Text>
          </Menu.Item>
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
