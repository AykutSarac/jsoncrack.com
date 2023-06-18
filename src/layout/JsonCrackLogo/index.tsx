import React from "react";
import Link from "next/link";
import styled from "styled-components";

const StyledTitle = styled.div<{ fontSize: string }>`
  font-weight: 900;
  margin: 0;
  color: ${({ theme }) => theme.INTERACTIVE_HOVER};
  font-family: var(--mona-sans);
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

export const JSONCrackLogo: React.FC<{ fontSize?: string }> = ({ fontSize = "1.2rem" }) => {
  return (
    <Link href="/">
      <StyledTitle fontSize={fontSize}>
        <StyledGradientText>JSON</StyledGradientText> CRACK
      </StyledTitle>
    </Link>
  );
};
