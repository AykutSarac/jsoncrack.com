import React from "react";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Button, Flex, Text } from "@mantine/core";
import styled, { ThemeProvider } from "styled-components";
import { FaChevronRight } from "react-icons/fa6";
import { lightTheme } from "../../constants/theme";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

const inter = Inter({
  subsets: ["latin-ext"],
});

const StyledLayoutWrapper = styled.div`
  background: #fff;
  font-family: ${inter.style.fontFamily};
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  flex: 1;
`;

const PageLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <ThemeProvider theme={lightTheme}>
      <StyledLayoutWrapper>
        <Link
          href="https://todiagram.com/blog/todiagram-github-education?utm_source=jsoncrack&utm_medium=hero_badge&utm_campaign=github_education"
          target="_blank"
          rel="noopener"
        >
          <Flex gap="xs" justify="center" align="center" bg="indigo" py="xs">
            <Text fz="sm" fw="500" c="gray.2">
              ToDiagram joins GitHub Student Developer Pack!
            </Text>
            <Button size="compact-xs" variant="default" color="gray">
              Learn More <FaChevronRight />
            </Button>
          </Flex>
        </Link>
        <Navbar />
        <ContentWrapper>{children}</ContentWrapper>
        <Footer />
      </StyledLayoutWrapper>
    </ThemeProvider>
  );
};

export default PageLayout;
