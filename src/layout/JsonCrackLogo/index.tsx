import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { monaSans } from "src/constants/fonts";
import { isIframe } from "src/lib/utils/widget";

const StyledTitle = styled.div<{ fontSize: string }>`
  font-weight: 800;
  margin: 0;
  font-family: ${monaSans.style.fontFamily};
  font-size: ${({ fontSize }) => fontSize};
  white-space: nowrap;
  z-index: 10;
  color: ${({ theme }) => theme.INTERACTIVE_HOVER};
  vertical-align: middle;
`;

interface LogoProps extends React.ComponentPropsWithoutRef<"a"> {
  fontSize?: string;
}

export const JSONCrackLogo: React.FC<LogoProps> = ({ fontSize = "1.2rem", ...props }) => {
  const logoText = React.useMemo(() => {
    if (typeof window === "undefined") return "JSON CRACK";
    return isIframe() ? "JC" : "JSON CRACK";
  }, []);

  return (
    <StyledTitle as={Link} fontSize={fontSize} href="/" prefetch={false} {...props}>
      {logoText}
    </StyledTitle>
  );
};
