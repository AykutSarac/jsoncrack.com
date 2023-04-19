import React from "react";
import Link from "next/link";
import styled from "styled-components";

const StyledNavbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 16px 48px;

  @media only screen and (max-width: 768px) {
    justify-content: center;

    a:first-of-type {
      display: none;
    }
  }
`;

const StyledLinkWrapper = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const StyledNavLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    font-weight: 500;
    color: ${({ theme }) => theme.ORANGE};
  }

  @media only screen and (max-width: 568px) {
    &.mobileHide {
      display: none;
    }
  }
`;

export const Navbar = () => (
  <StyledNavbar>
    <Link href="/">
      <img src="assets/icon.png" alt="json crack" width="120" />
    </Link>
    <StyledLinkWrapper>
      <StyledNavLink className="mobileHide" href="https://editor.herowand.com">
        More Data Formats
      </StyledNavLink>
      <StyledNavLink href="/editor">Editor</StyledNavLink>
      <StyledNavLink href="#features">Features</StyledNavLink>
      <StyledNavLink
        href="https://github.com/AykutSarac/jsoncrack.com"
        target="_blank"
        rel="external"
      >
        GitHub
      </StyledNavLink>
      <StyledNavLink className="mobileHide" href="docs">
        Documentation
      </StyledNavLink>
    </StyledLinkWrapper>
  </StyledNavbar>
);
