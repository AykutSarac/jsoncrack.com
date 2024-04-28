import React from "react";
import { MantineProvider } from "@mantine/core";
import styled, { ThemeProvider } from "styled-components";
import { lightTheme } from "src/constants/theme";
import { Footer } from "../Footer";
import { Navbar } from "../Navbar";

const StyledLayoutWrapper = styled.div`
  padding-bottom: 48px;
`;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <React.Suspense>
      <MantineProvider forceColorScheme="light">
        <ThemeProvider theme={lightTheme}>
          <StyledLayoutWrapper>
            <Navbar />
            {children}
            <Footer />
          </StyledLayoutWrapper>
        </ThemeProvider>
      </MantineProvider>
    </React.Suspense>
  );
};

export default Layout;
