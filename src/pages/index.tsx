import React from "react";
import { Button } from "src/components/Button";
import { Container } from "src/components/Container";
import { Navbar } from "src/components/Navbar";
import { Image } from "src/components/Image";
import styled from "styled-components";
import { AiFillGithub } from "react-icons/ai";
import { Footer } from "src/components/Footer";
import Head from "next/head";
import { Producthunt } from "src/components/Producthunt";
import { useRouter } from "next/router";

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
  font-size: 3rem;
  color: ${({ theme }) => theme.FULL_WHITE};

  @media only screen and (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const StyledSubContent = styled.div`
  margin-bottom: 20px;
`;

const StyledText = styled.span<{ white?: boolean }>`
  color: ${({ theme, white }) => (white ? theme.FULL_WHITE : theme.ORANGE)};
`;

const Home: React.FC = () => {
  const { push } = useRouter();

  return (
    <StyledHome>
      <Head>
        <title>JSON Visio</title>
      </Head>
      <Navbar />
      <Container>
        <StyledContent>
          <StyledHeader as="h1">
            Visualize your JSON into interactive graphs.
          </StyledHeader>
          <StyledSubContent>
            Simple visualization tool for your JSON data. No forced structure,
            paste your JSON and view it instantly.
          </StyledSubContent>
          <Button status="SECONDARY" onClick={() => push("/editor")}>
            Start Generating
          </Button>
        </StyledContent>
        <Image src="421.svg" width={500} height={400} alt="graphs" />
      </Container>

      <Container reverse>
        <StyledContent>
          <StyledHeader>No Rules</StyledHeader>
          <StyledSubContent>
            Be free, you don&apos;t have to restructure your json to transform
            it onto graphs. We&apos;ve done it at our side, so you can just
            paste your JSON.
          </StyledSubContent>
          <Button status="SUCCESS" onClick={() => push("/editor")}>
            Paste It!
          </Button>
        </StyledContent>
        <Image src="graphs3.svg" width={500} height={400} alt="preview" />
      </Container>

      <Container>
        <StyledContent>
          <StyledHeader>Import File</StyledHeader>
          <StyledSubContent>
            Have an existing file for your data? No worries, directly import it
            into our editor without having to scroll through all of it!
          </StyledSubContent>
          <Button status="SUCCESS" onClick={() => push("/editor")}>
            Import JSON
          </Button>
        </StyledContent>
        <Image src="graphs4.svg" width={500} height={400} alt="preview" />
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
            onClick={() => push("https://github.com/AykutSarac/jsonvisio.com")}
          >
            <AiFillGithub size={20} />
            Check GitHub
          </Button>
        </StyledContent>
        <Image src="graphs5.svg" width={500} height={400} alt="preview" />
      </Container>
      <Producthunt />
      <Footer />
    </StyledHome>
  );
};

export default Home;
