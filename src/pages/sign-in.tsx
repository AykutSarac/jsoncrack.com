import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { AiOutlineGithub, AiOutlineGoogle } from "react-icons/ai";
import { altogic } from "src/api/altogic";
import { Button } from "src/components/Button";
import { Footer } from "src/components/Footer";
import { Navbar } from "src/components/Navbar";
import useUser from "src/store/useUser";
import styled from "styled-components";

const StyledPageWrapper = styled.div`
  padding: 5%;
`;

const StyledHeroSection = styled.section`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const StyledLoginButtons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 60px;
  gap: 24px;
`;

const SignIn = () => {
  const isPremium = useUser(state => state.isPremium());
  const { replace } = useRouter();

  React.useEffect(() => {
    if (isPremium) replace("/editor");
  }, [isPremium, replace]);

  const handleLoginClick = () => {
    altogic.auth.signInWithProvider("google");
  };

  return (
    <>
      <Navbar />
      <StyledPageWrapper>
        <StyledHeroSection>
          <Link href="/">
            <img src="assets/icon.png" alt="json crack" width="400" />
          </Link>
          <h1>Sign In</h1>
        </StyledHeroSection>
        <StyledLoginButtons>
          <Button status="DANGER" onClick={handleLoginClick}>
            <AiOutlineGoogle size={24} />
            Login with Google
          </Button>
          <Button status="TERTIARY" disabled>
            <AiOutlineGithub size={24} />
            Login with GitHub
          </Button>
        </StyledLoginButtons>
      </StyledPageWrapper>
      <Footer />
    </>
  );
};

export default SignIn;
