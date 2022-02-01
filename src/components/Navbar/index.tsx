import Link from "next/link";
import React from "react";
import styled from "styled-components";

const StyledNavbar = styled.div`
  display: flex;
  justify-content: space-between;
  width: 75%;
  margin: 0 auto 20px;
`;

const StyledLogo = styled.div`
  font-weight: 600;
  font-size: 20px;
  cursor: pointer;
`;

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-evenly;
  gap: 20px;
`;

const Navbar: React.FC = () => {
  return (
    <StyledNavbar>
      <Link href="/" passHref>
        <StyledLogo>JSON Visio</StyledLogo>
      </Link>
      <StyledNav>
        <Link href="/editor">
          <a>Editor</a>
        </Link>
        <Link href="https://github.com/AykutSarac/jsonvisio.com">
          <a>GitHub</a>
        </Link>
      </StyledNav>
    </StyledNavbar>
  );
};

export default Navbar;
