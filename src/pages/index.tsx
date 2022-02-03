import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "src/components/Button";
import { Container } from "src/components/Container";
import { Navbar } from "src/components/Navbar";
import styled from "styled-components";
import { AiFillGithub } from "react-icons/ai";

const StyledHome = styled.div`
  padding: 24px;
`;

const StyledContent = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.SILVER};
  width: 50%;

  @media only screen and (max-width: 768px) {
    width: 100%;
    text-align: center;

    button {
      margin-left: auto;
      margin-right: auto;
    }
  }
`;

const StyledHeader = styled.h2`
  font-size: 54px;
  color: ${({ theme }) => theme.FULL_WHITE};
`;

const StyledSubContent = styled.div`
  margin-bottom: 20px;
`;

const StyledText = styled.span<{ white?: boolean }>`
  color: ${({ theme, white }) => (white ? theme.FULL_WHITE : theme.ORANGE)};
`;

const Home: React.FC = () => {
  const route = useRouter();

  return (
    <StyledHome>
      <Navbar />
      <Container>
        <StyledContent>
          <StyledHeader as="h1">
            Visualize your JSON into interactive graphs.
          </StyledHeader>
          <StyledSubContent>
            Simple visualization tool for your JSON data. No forced structure,
            paste your JSON data and view it instantly.
          </StyledSubContent>
          <Button onClick={() => route.push("/editor")} status="SECONDARY">
            Start Generating
          </Button>
        </StyledContent>
        <Image src="/graphs.svg" width={500} height={400} alt="graphs" />
      </Container>

      <Container reverse>
        <StyledContent>
          <StyledHeader>No Rules</StyledHeader>
          <StyledSubContent>
            Be free, you don&apos;t have to restructure your json to transform
            it into graphs. We&apos;ve done it at our side, so you can just
            paste your JSON.
          </StyledSubContent>
          <Button onClick={() => route.push("/editor")} status="SUCCESS">
            Paste It!
          </Button>
        </StyledContent>
        <Image src="/graphs3.svg" width={500} height={400} alt="preview" />
      </Container>

      <Container>
        <StyledContent>
          <StyledHeader>Import File</StyledHeader>
          <StyledSubContent>
            Have an existing file for your data? No worries, directly import it
            into our editor without having to scroll through all of it!
          </StyledSubContent>
          <Button onClick={() => route.push("/editor")} status="SUCCESS">
            Import JSON
          </Button>
        </StyledContent>
        <Image src="/graphs4.svg" width={500} height={400} alt="preview" />
      </Container>

      <Container reverse>
        <StyledContent>
          <StyledHeader>Supported by Open Source</StyledHeader>
          <StyledSubContent>
            We do our work at open source. Help us improve by contributing to
            <StyledText> JSON</StyledText>
            <StyledText white> Visio</StyledText> at GitHub!
          </StyledSubContent>
          <Button
            onClick={() =>
              route.push("https://github.com/AykutSarac/jsonvisio.com")
            }
          >
            <AiFillGithub size={20} />
            Check GitHub
          </Button>
        </StyledContent>
        <Image src="/graphs5.svg" width={500} height={400} alt="preview" />
      </Container>
    </StyledHome>
  );
};

export default Home;
