import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import { Button, Center, Container, Stack } from "@mantine/core";
import { AiOutlineGithub, AiOutlineGoogle } from "react-icons/ai";
import { altogic } from "src/api/altogic";
import { Footer } from "src/layout/Footer";
import { Navbar } from "src/layout/Navbar";
import useUser from "src/store/useUser";

const StyledPageWrapper = styled.div`
  padding: 5%;
`;

const StyledHeroSection = styled.section`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const SignIn = () => {
  const { isReady, replace, query } = useRouter();
  const checkSession = useUser(state => state.checkSession);
  const isAuthenticated = useUser(state => state.isAuthenticated);

  const isAuthenticating = React.useMemo(() => {
    if (query?.access_token) return true;
    return false;
  }, [query]);

  React.useEffect(() => {
    if (isAuthenticated) replace("/editor");
  }, [isReady, isAuthenticated, replace]);

  const handleLoginClick = (provider: "github" | "google") => {
    altogic.auth.signInWithProvider(provider);
  };

  return (
    <>
      <Head>
        <title>Sign In | JSON Crack</title>
      </Head>
      <Navbar />
      <StyledPageWrapper>
        <StyledHeroSection>
          <Link href="/">
            <img src="assets/icon.png" alt="json crack" width="400" />
          </Link>
          <h1>{isAuthenticating ? "Continue With" : "Sign In"}</h1>
        </StyledHeroSection>
        <Container>
          <Center>
            {isAuthenticating ? (
              <Stack my={60} w={250} spacing="xl">
                <Button size="lg" color="orange" onClick={checkSession}>
                  JSON Crack
                </Button>
                <Button
                  component="a"
                  href={window.location.href.replace(window.location.host, "editor.herowand.com")}
                  size="lg"
                  color="teal"
                >
                  Herowand Editor
                </Button>
              </Stack>
            ) : (
              <Stack my={60} w={250} spacing="xl">
                <Button
                  size="lg"
                  color="red"
                  onClick={() => handleLoginClick("google")}
                  leftIcon={<AiOutlineGoogle size={24} />}
                >
                  Sign In with Google
                </Button>
                <Button
                  size="lg"
                  variant="white"
                  color="gray"
                  onClick={() => handleLoginClick("github")}
                  leftIcon={<AiOutlineGithub size={24} />}
                >
                  Sign In with GitHub
                </Button>
              </Stack>
            )}
          </Center>
        </Container>
      </StyledPageWrapper>
      <Footer />
    </>
  );
};

export default SignIn;
