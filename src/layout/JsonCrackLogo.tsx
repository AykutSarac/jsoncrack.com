import React from "react";
import localFont from "next/font/local";
import Link from "next/link";
import styled from "styled-components";
import { isIframe } from "src/lib/utils/widget";

const monaSans = localFont({
  src: "../assets/fonts/Mona-Sans.woff2",
  variable: "--mona-sans",
  display: "swap",
  fallback: ["Futura, Helvetica, sans-serif", "Tahoma, Verdana, sans-serif"],
});

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

export const JSONCrackLogo = ({ fontSize = "1.2rem", ...props }: LogoProps) => {
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
