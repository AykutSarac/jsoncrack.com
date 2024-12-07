import React from "react";
import { Inter } from "next/font/google";
import styled, { ThemeProvider } from "styled-components";
import { lightTheme } from "src/constants/theme";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

const inter = Inter({
  subsets: ["latin-ext"],
});

const StyledLayoutWrapper = styled.div`
  background: #fff;
  font-family: ${inter.style.fontFamily};
`;

const PageLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <ThemeProvider theme={lightTheme}>
      <StyledLayoutWrapper>
        <Navbar />
        {children}
        <Footer />
      </StyledLayoutWrapper>
    </ThemeProvider>
  );
};

export default PageLayout;
