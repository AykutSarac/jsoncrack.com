import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { monaSans } from "src/constants/fonts";

const StyledTitle = styled.div<{ fontSize: string }>`
  font-weight: 800;
  margin: 0;
  font-family: ${monaSans.style.fontFamily};
  font-size: ${({ fontSize }) => fontSize};
  white-space: nowrap;
  z-index: 10;
  color: ${({ theme }) => theme.INTERACTIVE_HOVER};
`;

interface LogoProps extends React.ComponentPropsWithoutRef<"a"> {
  fontSize?: string;
}

export const JSONCrackLogo: React.FC<LogoProps> = ({ fontSize = "1.2rem", ...props }) => {
  return (
    <StyledTitle as={Link} fontSize={fontSize} href="/" prefetch={false} {...props}>
      JSON CRACK
    </StyledTitle>
  );
};
