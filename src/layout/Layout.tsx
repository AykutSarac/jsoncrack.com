import React from "react";
import styled, { ThemeProvider } from "styled-components";
import { lightTheme } from "src/constants/theme";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

const StyledLayoutWrapper = styled.div`
  padding-bottom: 48px;
`;

const Layout = ({ children }: React.PropsWithChildren) => {
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

export default Layout;
