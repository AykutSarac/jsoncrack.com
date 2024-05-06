import React from "react";
import { useMantineColorScheme } from "@mantine/core";
import styled, { ThemeProvider } from "styled-components";
import { lightTheme } from "src/constants/theme";
import { Footer } from "../Footer";
import { Navbar } from "../Navbar";

const StyledLayoutWrapper = styled.div`
  padding-bottom: 48px;
`;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setColorScheme } = useMantineColorScheme();

  React.useEffect(() => {
    setColorScheme("light");
  }, [setColorScheme]);

  return (
    <React.Suspense>
      <ThemeProvider theme={lightTheme}>
        <StyledLayoutWrapper>
          <Navbar />
          {children}
          <Footer />
        </StyledLayoutWrapper>
      </ThemeProvider>
    </React.Suspense>
  );
};

export default Layout;
