import React from "react";
import { Button } from "src/components/Button";
import { Container } from "src/components/Container";
import { Navbar } from "src/components/Navbar";
import { Image } from "src/components/Image";
import styled from "styled-components";
import { AiFillGithub } from "react-icons/ai";
import { Footer } from "src/components/Footer";
import Link from "next/link";
import Head from "next/head";

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

  @media only screen and (max-width: 768px) {
    font-size: 36px;
  }
`;

const StyledSubContent = styled.div`
  margin-bottom: 20px;
`;

const StyledText = styled.span<{ white?: boolean }>`
  color: ${({ theme, white }) => (white ? theme.FULL_WHITE : theme.ORANGE)};
`;

const Home: React.FC = () => {
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
          <Link href="/editor" passHref>
            <a>
              <Button status="SECONDARY">Start Generating</Button>
            </a>
          </Link>
        </StyledContent>
        <Image src="graphs.svg" width={500} height={400} alt="graphs" />
      </Container>

      <Container reverse>
        <StyledContent>
          <StyledHeader>No Rules</StyledHeader>
          <StyledSubContent>
            Be free, you don&apos;t have to restructure your json to transform
            it into graphs. We&apos;ve done it at our side, so you can just
            paste your JSON.
          </StyledSubContent>
          <Link href="/editor" passHref>
            <a>
              <Button status="SUCCESS">Paste It!</Button>
            </a>
          </Link>
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
          <Link href="/editor" passHref>
            <a>
              <Button status="SUCCESS">Import JSON</Button>
            </a>
          </Link>
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
          <Link href="https://github.com/AykutSarac/jsonvisio.com" passHref>
            <a rel="me" target="_blank">
              <Button>
                <AiFillGithub size={20} />
                Check GitHub
              </Button>
            </a>
          </Link>
        </StyledContent>
        <Image src="graphs5.svg" width={500} height={400} alt="preview" />
      </Container>
      <Footer />
    </StyledHome>
  );
};

export default Home;
