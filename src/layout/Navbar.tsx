import React from "react";
import Link from "next/link";
import { Button } from "@mantine/core";
import styled from "styled-components";
import { JSONCrackLogo } from "./JsonCrackLogo";

const StyledNavbarWrapper = styled.div`
  z-index: 3;
  transition: background 0.2s ease-in-out;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const StyledNavbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 24px;
  background: white;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);

  @media only screen and (max-width: 768px) {
    padding: 16px 24px;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  @media only screen and (max-width: 768px) {
    & > *:not(:first-child) {
      display: none;
    }
  }
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
            component="a"
            href="https://marketplace.visualstudio.com/items?itemName=AykutSarac.jsoncrack-vscode"
            target="_blank"
            variant="subtle"
            color="black"
            radius="sm"
            size="sm"
            ml="sm"
          >
            VS Code
          </Button>
          <Button
            component={Link}
            prefetch={false}
            href="/#pricing"
            variant="subtle"
            color="black"
            radius="sm"
            size="sm"
          >
            Pricing
          </Button>
          <Button
            component={Link}
            prefetch={false}
            href="/affiliates"
            variant="subtle"
            color="black"
            radius="sm"
            size="sm"
          >
            Affiliate
          </Button>
        </Left>
        <Right>
          <Button
            variant="subtle"
            color="dark"
            component="a"
            href="https://app.jsoncrack.com/sign-in"
            radius="md"
            visibleFrom="sm"
            size="md"
          >
            Log in
          </Button>
          <Button
            component="a"
            color="indigo"
            href="/editor"
            radius="md"
            visibleFrom="sm"
            size="md"
          >
            Editor
          </Button>
        </Right>
      </StyledNavbar>
    </StyledNavbarWrapper>
  );
};
