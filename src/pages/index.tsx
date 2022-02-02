import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "src/components/Button";
import { Container } from "src/components/Container";
import { Navbar } from "src/components/Navbar";
import styled from "styled-components";

const StyledHome = styled.div`
  padding: 24px;
`;

const StyledContent = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.SILVER};
  width: 50%;
`;

const StyledHeader = styled.h1`
  font-size: 54px;
  color: ${({ theme }) => theme.FULL_WHITE};
`;

const StyledSubContent = styled.div`
  margin-bottom: 20px;
`;

const Home: React.FC = () => {
  const route = useRouter();

  return (
    <StyledHome>
      <Navbar />
      <Container>
        <StyledContent>
          <StyledHeader>
            Visualize your JSON into interactive graphs.
          </StyledHeader>
          <StyledSubContent>
            Simple visualization tool for your JSON data. No forced structure,
            simply paste your JSON data and view it instantly.
          </StyledSubContent>
          <Button onClick={() => route.push("/editor")}>
            Start Generating
          </Button>
        </StyledContent>
        <Image
          src="/graphs.svg"
          width={500}
          height={400}
          layout="fixed"
          alt="graphs"
        />
      </Container>
    </StyledHome>
  );
};

export default Home;
