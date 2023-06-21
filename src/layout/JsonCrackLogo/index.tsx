import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { monaSans } from "src/constants/customFonts";

const StyledTitle = styled.div<{ fontSize: string }>`
  font-weight: 900;
  margin: 0;
  color: ${({ theme }) => theme.INTERACTIVE_HOVER};
  font-family: ${monaSans.style.fontFamily};
  font-size: ${({ fontSize }) => fontSize};
  white-space: nowrap;
`;

const StyledGradientText = styled.span`
  background: #ffb76b;
  background: linear-gradient(to right, #fca74d 0%, #fda436 30%, #ff7c00 60%, #ff7f04 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

interface LogoProps extends React.ComponentPropsWithoutRef<"a"> {
  fontSize?: string;
}

export const JSONCrackLogo: React.FC<LogoProps> = ({ fontSize = "1.2rem", ...props }) => {
  return (
    <Link href="/" prefetch={false} {...props}>
      <StyledTitle fontSize={fontSize}>
        <StyledGradientText>JSON</StyledGradientText> CRACK
      </StyledTitle>
    </Link>
  );
};
