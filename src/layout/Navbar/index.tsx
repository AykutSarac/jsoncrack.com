import React from "react";
import Link from "next/link";
import { Button, Menu } from "@mantine/core";
import styled from "styled-components";
import { BiChevronDown } from "react-icons/bi";
import useUser from "src/store/useUser";
import { JSONCrackLogo } from "../JsonCrackLogo";

const StyledNavbarWrapper = styled.div``;

const StyledNavbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 56px;
  margin: 0 auto;
  border-bottom: 1px solid gray;
  background: rgba(255, 255, 255, 0.75);
  padding: 8px 16px;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.35),
    0 2px 5px 0 rgba(0, 0, 0, 0.35);

  @media only screen and (max-width: 1024px) {
    .desktop {
      display: none;
    }
  }

  @media only screen and (max-width: 768px) {
    .hide-mobile {
      display: none;
    }
  }
`;

const Left = styled.div``;

const Middle = styled.div``;

const Right = styled.div`
  display: flex;
  gap: 16px;
`;

export const Navbar = () => {
  const isAuthenticated = useUser(state => state.isAuthenticated);

  return (
    <StyledNavbarWrapper>
      <StyledNavbar>
        <Left>
          <JSONCrackLogo />
        </Left>
        <Middle className="hide-mobile">
          <Button component={Link} href="/pricing" variant="subtle" color="dark" radius="md">
            Pricing
          </Button>
          <Button
            component={Link}
            href="https://marketplace.visualstudio.com/items?itemName=AykutSarac.jsoncrack-vscode"
            prefetch={false}
            variant="subtle"
            color="dark"
            radius="md"
          >
            VS Code
          </Button>
          <Button
            component={Link}
            href="/docs"
            prefetch={false}
            variant="subtle"
            color="dark"
            radius="md"
          >
            Docs
          </Button>
          <Menu trigger="hover" offset={15} withArrow>
            <Menu.Target>
              <Button
                variant="subtle"
                color="dark"
                radius="md"
                rightSection={<BiChevronDown size="18" />}
              >
                Legal
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item component={Link} href="/legal/privacy" prefetch={false}>
                Privacy Policy
              </Menu.Item>
              <Menu.Item component={Link} href="/legal/terms" prefetch={false}>
                Terms and Conditions
              </Menu.Item>
              <Menu.Item component={Link} href="/legal/subscription-refund" prefetch={false}>
                Subscription
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item component="a" href="mailto:contact@jsoncrack.com">
                contact@jsoncrack.com
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Menu trigger="hover" offset={15} withArrow>
            <Menu.Target>
              <Button
                variant="subtle"
                color="dark"
                radius="md"
                rightSection={<BiChevronDown size="18" />}
              >
                Social
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item component="a" href="https://twitter.com/jsoncrack">
                𝕏 (Twitter)
              </Menu.Item>
              <Menu.Item component="a" href="https://discord.gg/yVyTtCRueq">
                Discord
              </Menu.Item>
              <Menu.Item component="a" href="https://www.linkedin.com/company/herowand">
                LinkedIn
              </Menu.Item>
              <Menu.Item component="a" href="https://github.com/AykutSarac/jsoncrack.com">
                GitHub
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Middle>
        <Right>
          {!isAuthenticated && (
            <Button
              component={Link}
              href="/sign-in"
              prefetch={false}
              variant="outline"
              color="grape.9"
              className="hide-mobile"
            >
              Login
            </Button>
          )}
          <Button color="grape.9" component={Link} href="/editor" prefetch={false}>
            Editor
          </Button>
        </Right>
      </StyledNavbar>
    </StyledNavbarWrapper>
  );
};
