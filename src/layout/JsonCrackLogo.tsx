import React, { useEffect } from "react";
import localFont from "next/font/local";
import Link from "next/link";
import { Image } from "@mantine/core";
import styled from "styled-components";

const monaSans = localFont({
  src: "../assets/fonts/Mona-Sans.woff2",
  variable: "--mona-sans",
  display: "swap",
  fallback: ["Futura, Helvetica, sans-serif", "Tahoma, Verdana, sans-serif"],
});

const StyledLogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  mix-blend-mode: difference;
`;

const StyledTitle = styled.span<{ fontSize: string }>`
  font-weight: 800;
  margin: 0;
  font-family: ${monaSans.style.fontFamily} !important;
  font-size: ${({ fontSize }) => fontSize};
  white-space: nowrap;
  z-index: 10;
  vertical-align: middle;
`;

interface LogoProps extends React.ComponentPropsWithoutRef<"div"> {
  fontSize?: string;
  hideLogo?: boolean;
  hideText?: boolean;
}

export const JSONCrackLogo = ({ fontSize = "1.2rem", hideText, hideLogo, ...props }: LogoProps) => {
  const [isIframe, setIsIframe] = React.useState(false);

  useEffect(() => {
    setIsIframe(window !== undefined && window.location.href.includes("widget"));
  }, []);

  return (
    <Link href="/" prefetch={false} target={isIframe ? "_blank" : "_self"}>
      <StyledLogoWrapper>
        {!hideLogo && (
          <Image
            src="/assets/logo.svg"
            width={parseFloat(fontSize) * 18}
            height={parseFloat(fontSize) * 18}
            alt="logo"
            mb="2"
          />
        )}
        {!hideText && (
          <StyledTitle fontSize={fontSize} {...props}>
            JSON CRACK
          </StyledTitle>
        )}
      </StyledLogoWrapper>
    </Link>
  );
};
