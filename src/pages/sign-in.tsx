import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import { Button, Center, Container, Stack } from "@mantine/core";
import { AiOutlineGithub, AiOutlineGoogle } from "react-icons/ai";
import { altogic } from "src/api/altogic";
import { Footer } from "src/components/Footer";
import { Navbar } from "src/components/Navbar";
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
  const { isReady, replace } = useRouter();
  const checkSession = useUser(state => state.checkSession);
  const isAuthenticated = useUser(state => state.isAuthenticated);

  React.useEffect(() => {
    if (!isReady) checkSession();
    if (isAuthenticated) replace("/editor");
  }, [isReady, isAuthenticated, replace, checkSession]);

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
          <h1>Sign In</h1>
        </StyledHeroSection>
        <Container>
          <Center>
            <Stack my={60} w={250} spacing="xl">
              <Button
                size="md"
                color="red"
                onClick={() => handleLoginClick("google")}
                leftIcon={<AiOutlineGoogle size={24} />}
              >
                Sign In with Google
              </Button>
              <Button
                size="md"
                variant="white"
                color="gray"
                onClick={() => handleLoginClick("github")}
                leftIcon={<AiOutlineGithub size={24} />}
              >
                Sign In with GitHub
              </Button>
            </Stack>
          </Center>
        </Container>
      </StyledPageWrapper>
      <Footer />
    </>
  );
};

export default SignIn;
