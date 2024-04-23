import React from "react";
import Link from "next/link";
import { Box, Burger, Button, Flex, Menu, Overlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import styled from "styled-components";
import { BiChevronDown } from "react-icons/bi";
import useUser from "src/store/useUser";
import { JSONCrackLogo } from "../JsonCrackLogo";

const StyledNavbarWrapper = styled.div`
  position: sticky;
  top: -1px;
  left: 0;
  z-index: 3;
  transition: background 0.2s ease-in-out;

  &.is-pinned {
    background: rgba(255, 255, 255, 0.5);
    border-bottom: 1px solid gray;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  }
`;

const StyledNavbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 56px;
  margin: 0 auto;
  padding: 46px 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);

  @media only screen and (max-width: 768px) {
    padding: 16px 24px;
  }

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
  const hasSession = useUser(state => !!state.user);
  const premium = useUser(state => !!state.premium);
  const [opened, { toggle }] = useDisclosure();

  React.useEffect(() => {
    const el = document.querySelector(".navbar");
    const observer = new IntersectionObserver(
      ([e]) => e.target.classList.toggle("is-pinned", e.intersectionRatio < 1),
      { threshold: [1] }
    );

    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <StyledNavbarWrapper className="navbar">
      <StyledNavbar>
        <Left>
          <JSONCrackLogo />
          <Button
            ml="lg"
            component="a"
            href="https://marketplace.visualstudio.com/items?itemName=AykutSarac.jsoncrack-vscode"
            target="_blank"
            variant="subtle"
            color="gray"
            radius="md"
            visibleFrom="sm"
            size="md"
          >
            VS Code
          </Button>
          <Button
            component={Link}
            href="/pricing"
            variant="subtle"
            color="gray"
            radius="md"
            visibleFrom="sm"
            size="md"
          >
            Pricing
          </Button>
          <Button
            component={Link}
            prefetch={false}
            href="/docs"
            variant="subtle"
            color="gray"
            radius="md"
            visibleFrom="sm"
            size="md"
          >
            Embed
          </Button>
          <Menu trigger="hover" offset={15} withArrow shadow="md">
            <Menu.Target>
              <Button
                variant="subtle"
                color="gray"
                radius="md"
                rightSection={<BiChevronDown size="18" />}
                visibleFrom="sm"
                size="md"
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
                color="gray"
                radius="md"
                rightSection={<BiChevronDown size="18" />}
                visibleFrom="sm"
                size="md"
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
          {!hasSession && (
            <>
              <Button
                component="a"
                href="https://app.jsoncrack.com/sign-in"
                variant="outline"
                color="gray"
                className="hide-mobile"
                radius="md"
                visibleFrom="sm"
                size="md"
              >
                Login
              </Button>
              <Button
                component={Link}
                prefetch={false}
                href={premium ? "https://app.jsoncrack.com/editor" : "/editor"}
                color="dark"
                className="hide-mobile"
                visibleFrom="sm"
                radius="md"
                size="md"
              >
                Editor
              </Button>
            </>
          )}
          {hasSession && (
            <Button
              color="dark"
              size="md"
              radius="md"
              component={Link}
              href="/editor"
              prefetch={false}
              visibleFrom="sm"
            >
              Editor
            </Button>
          )}
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
                    color="dark"
                    radius="md"
                    onClick={toggle}
                  >
                    Pricing
                  </Button>
                  <Menu trigger="click" offset={15} withArrow shadow="md">
                    <Menu.Target>
                      <Button
                        variant="transparent"
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
                </Flex>
              </Box>
            </Overlay>
          )}
        </Right>
      </StyledNavbar>
    </StyledNavbarWrapper>
  );
};
