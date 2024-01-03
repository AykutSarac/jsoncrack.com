import React from "react";
import Link from "next/link";
import { Alert, Box, Burger, Button, Flex, Menu, Overlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import styled from "styled-components";
import { BiChevronDown } from "react-icons/bi";
import useUser from "src/store/useUser";
import { JSONCrackLogo } from "../JsonCrackLogo";

const StyledNavbarWrapper = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  z-index: 3;
`;

const StyledNavbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 56px;
  margin: 0 auto;
  border-bottom: 1px solid gray;
  background: #ffffff;
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

const Right = styled.div`
  display: flex;
  gap: 16px;
`;

export const Navbar = () => {
  const isAuthenticated = useUser(state => state.isAuthenticated);
  const [opened, { toggle }] = useDisclosure();

  return (
    <StyledNavbarWrapper>
      <StyledNavbar>
        <Left>
          <JSONCrackLogo />
          <Button
            ml="lg"
            component={Link}
            href="/pricing"
            variant="subtle"
            color="black"
            radius="md"
            visibleFrom="sm"
          >
            Pricing
          </Button>
          <Button
            component="a"
            href="https://marketplace.visualstudio.com/items?itemName=AykutSarac.jsoncrack-vscode"
            target="_blank"
            variant="subtle"
            color="black"
            radius="md"
            visibleFrom="sm"
          >
            VS Code
          </Button>
          <Button
            component={Link}
            href="/docs"
            prefetch={false}
            variant="subtle"
            color="black"
            radius="md"
            visibleFrom="sm"
          >
            Docs
          </Button>
          <Menu trigger="hover" offset={15} withArrow shadow="md">
            <Menu.Target>
              <Button
                variant="subtle"
                color="black"
                radius="md"
                rightSection={<BiChevronDown size="18" />}
                visibleFrom="sm"
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
          <Menu trigger="hover" offset={15} withArrow shadow="md">
            <Menu.Target>
              <Button
                variant="subtle"
                color="black"
                radius="md"
                rightSection={<BiChevronDown size="18" />}
                visibleFrom="sm"
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
        </Left>
        <Right>
          {!isAuthenticated && (
            <Button
              component={Link}
              href="/sign-in"
              variant="outline"
              color="dark"
              className="hide-mobile"
              visibleFrom="sm"
            >
              Login
            </Button>
          )}
          <Button color="dark" component={Link} href="/editor" prefetch={false} visibleFrom="sm">
            Editor
          </Button>
          <Burger opened={opened} onClick={toggle} aria-label="Toggle navigation" hiddenFrom="sm" />
          {opened && (
            <Overlay top={56} h="100dvh">
              <Box
                bg="white"
                top={56}
                left={0}
                pos="fixed"
                w="100%"
                pb="lg"
                style={{ zIndex: 3, borderBottom: "1px solid black" }}
              >
                <Flex pt="lg" direction="column" align="center" justify="center" gap="lg">
                  <Button
                    component={Link}
                    href="/pricing"
                    variant="transparent"
                    color="black"
                    radius="md"
                    onClick={toggle}
                  >
                    Pricing
                  </Button>
                  <Button
                    component="a"
                    href="https://marketplace.visualstudio.com/items?itemName=AykutSarac.jsoncrack-vscode"
                    target="_blank"
                    variant="transparent"
                    color="black"
                    radius="md"
                    onClick={toggle}
                  >
                    VS Code
                  </Button>
                  <Button
                    component={Link}
                    href="/docs"
                    prefetch={false}
                    variant="transparent"
                    color="black"
                    radius="md"
                    onClick={toggle}
                  >
                    Docs
                  </Button>
                  <Menu trigger="click" offset={15} withArrow shadow="md">
                    <Menu.Target>
                      <Button
                        variant="transparent"
                        color="black"
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
                      <Menu.Item
                        component={Link}
                        href="/legal/subscription-refund"
                        prefetch={false}
                      >
                        Subscription
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item component="a" href="mailto:contact@jsoncrack.com">
                        contact@jsoncrack.com
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                  <Menu trigger="click" offset={15} withArrow shadow="md">
                    <Menu.Target>
                      <Button
                        variant="transparent"
                        color="black"
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
                </Flex>
              </Box>
            </Overlay>
          )}
        </Right>
      </StyledNavbar>
      <Link href="/pricing">
        <Alert color="red" variant="filled" radius={0} fw="bold">
          Unlock premium features now with ~30% discount on the Premium plan!
        </Alert>
      </Link>
    </StyledNavbarWrapper>
  );
};
