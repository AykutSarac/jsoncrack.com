import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import {
  Alert,
  Anchor,
  Center,
  Container,
  LoadingOverlay,
  MantineProvider,
  Text,
} from "@mantine/core";
import styled, { ThemeProvider } from "styled-components";
import { FaInfoCircle } from "react-icons/fa";
import { lightTheme } from "src/constants/theme";
import { JSONCrackLogo } from "src/layout/JsonCrackLogo";

const Toaster = dynamic(() => import("react-hot-toast").then(c => c.Toaster));

const StyledWrapper = styled.div`
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  &:before {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    background-size: 40px 40px;
    background-image: linear-gradient(to right, #f7f7f7 1px, transparent 1px),
      linear-gradient(to bottom, #f7f7f7 1px, transparent 1px);
    image-rendering: pixelated;
    -webkit-mask-image: linear-gradient(to bottom, transparent, 0%, white, 98%, transparent);
    mask-image: linear-gradient(to bottom, transparent, 0%, white, 98%, transparent);
  }
`;

const StyledPaper = styled.div`
  border-radius: 0px;
  max-width: 500px;
  width: 100%;
  padding: 24px;

  background: rgba(255, 255, 255, 0.09);
  border-radius: 12px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

function Loading() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const handleStart = (url: string) => url !== router.asPath && setLoading(true);
    const handleComplete = (url: string) => url === router.asPath && setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  });

  if (loading) return <LoadingOverlay visible />;
  return null;
}

export const AuthLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <StyledWrapper>
      <MantineProvider forceColorScheme="light">
        <ThemeProvider theme={lightTheme}>
          <Toaster
            position="bottom-right"
            containerStyle={{
              bottom: 34,
              right: 8,
              fontSize: 14,
            }}
            toastOptions={{
              style: {
                background: "#4D4D4D",
                color: "#B9BBBE",
                borderRadius: 4,
              },
            }}
          />

          <Container>
            <Center mb="xl">
              <JSONCrackLogo fontSize="1.5rem" />
            </Center>
            <Alert py="sm" mb="md" color="indigo" icon={<FaInfoCircle />}>
              Premium editor has been moved to{" "}
              <Anchor href="https://todiagram.com" inherit>
                todiagram.com
              </Anchor>
              .
            </Alert>
            <StyledPaper>
              {children}
              <Loading />
            </StyledPaper>
            <Text maw={250} ta="center" mx="auto" pos="relative" mt="md" fz="xs" c="gray.6">
              By continuing you are agreeing to our{" "}
              <Anchor fz="xs" component="a" href="/legal/terms" target="_blank">
                Terms of Service
              </Anchor>{" "}
              and{" "}
              <Anchor fz="xs" component="a" href="/legal/privacy" target="_blank">
                Privacy Policy
              </Anchor>
            </Text>
          </Container>
        </ThemeProvider>
      </MantineProvider>
    </StyledWrapper>
  );
};
