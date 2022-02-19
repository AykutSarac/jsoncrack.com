import React from "react";
import Link from "next/link";
import styled from "styled-components";

interface NavbarProps {
  isWide?: boolean;
}

const StyledNavbar = styled.div`
  display: flex;
  justify-content: space-between;
  width: 75%;
  margin: 0 auto 80px;

  a:hover {
    color: ${({ theme }) => theme.ORANGE};
  }

  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;

const StyledLogo = styled.div`
  position: relative;
  font-weight: 600;
  font-size: 20px;
  cursor: pointer;
  font-weight: 700;
  color: #ffffff;
`;

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-evenly;
  gap: 20px;
`;

const StyledTitleWrapper = styled.span`
  color: ${({ theme }) => theme.ORANGE};
`;

export const Navbar: React.FC<NavbarProps> = () => {
  return (
    <StyledNavbar>
      <Link href="/">
        <a>
          <StyledLogo>
            <StyledTitleWrapper>JSON</StyledTitleWrapper> Visio
          </StyledLogo>
        </a>
      </Link>
      <StyledNav>
        <Link href="/editor">
          <a>Editor</a>
        </Link>
        <Link href="https://github.com/AykutSarac/jsonvisio.com">
          <a rel="me" target="_blank">
            GitHub
          </a>
        </Link>
      </StyledNav>
    </StyledNavbar>
  );
};
