import React from "react";
import Link from "next/link";
import { Button } from "@mantine/core";
import styled from "styled-components";
import { JSONCrackLogo } from "./JsonCrackLogo";

const StyledNavbarWrapper = styled.div`
  z-index: 3;
  transition: background 0.2s ease-in-out;
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
`;

const Left = styled.div`
  width: 100%;
`;

const Right = styled.div`
  display: flex;
  gap: 16px;
`;

export const Navbar = () => {
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
            color="black"
            radius="md"
            visibleFrom="sm"
            size="md"
          >
            VS Code
          </Button>
          <Button
            component={Link}
            prefetch={false}
            href="/#pricing"
            variant="subtle"
            color="black"
            radius="md"
            visibleFrom="sm"
            size="md"
          >
            Pricing
          </Button>
          <Button
            component={Link}
            prefetch={false}
            href="/#faq"
            variant="subtle"
            color="black"
            radius="md"
            visibleFrom="sm"
            size="md"
          >
            FAQ
          </Button>
          <Button
            component={Link}
            prefetch={false}
            href="/docs"
            variant="subtle"
            color="black"
            radius="md"
            visibleFrom="sm"
            size="md"
          >
            Docs
          </Button>
        </Left>
        <Right>
          <Button
            component="a"
            href="https://app.jsoncrack.com/sign-in"
            variant="gradient"
            gradient={{ from: "#FFFFFF", to: "#f5f5f5", deg: 180 }}
            c="dark"
            radius="lg"
            visibleFrom="sm"
            size="md"
            style={{ border: "1px solid #E2E2E2" }}
          >
            Sign in
          </Button>
          <Button
            variant="gradient"
            style={{ border: "1px solid #625BF6" }}
            component={Link}
            prefetch={false}
            href="/#pricing"
            visibleFrom="sm"
            radius="lg"
            size="md"
          >
            Get started for free
          </Button>
        </Right>
      </StyledNavbar>
    </StyledNavbarWrapper>
  );
};
