import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import {
  HiCursorClick,
  HiLightningBolt,
  HiOutlineDownload,
  HiOutlineSearchCircle,
} from "react-icons/hi";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { Button } from "src/components/Button";
import { Producthunt } from "src/components/Producthunt";
import styled from "styled-components";
import pkg from "../../package.json";

const StyledHome = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8em;
  font-family: "Roboto", sans-serif;

  * {
    box-sizing: border-box;
  }

  @media only screen and (max-width: 768px) {
    gap: 3em;
  }
`;

const StyledGradientText = styled.span`
  background: #ffb76b;
  background: linear-gradient(
    to right,
    #ffb76b 0%,
    #ffa73d 30%,
    #ff7c00 60%,
    #ff7f04 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StyledNavbar = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 16px 16px;
  gap: 20px;

  @media only screen and (max-width: 768px) {
    a:first-of-type {
      display: none;
    }
  }
`;

const StyledHeroSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5em;
  min-height: 45vh;
  padding: 0 3%;
`;

const StyledNavLink = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    font-weight: 500;
    color: ${({ theme }) => theme.ORANGE};
  }
`;

const StyledTitle = styled.h1`
  font-size: 5rem;
  font-weight: 900;
  margin: 0;

  @media only screen and (max-width: 768px) {
    font-size: 3rem;
  }
`;

const StyledSubTitle = styled.h2`
  color: #dedede;
  text-align: center;
  font-size: 2.5rem;
  max-width: 40rem;
  margin: 0;

  @media only screen and (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const StyledMinorTitle = styled.p`
  color: #b4b4b4;
  text-align: center;
  font-size: 1.25rem;
  margin: 0;
  letter-spacing: 1.2px;

  @media only screen and (max-width: 992px) {
    font-size: 1rem;
  }
`;

const StyledButton = styled(Button)`
  background: ${({ status }) => !status && "#a13cc2"};
  padding: 12px 24px;

  div {
    font-family: "Roboto", sans-serif;
    font-weight: 700;
    font-size: 16px;
  }

  @media only screen and (max-width: 768px) {
    &:first-of-type {
      pointer-events: none;

      div {
        content: "Incompatible Device";
      }
    }
  }
`;

const StyledFeaturesSection = styled.section`
  display: flex;
  max-width: 85%;
  margin: 0 auto;
  gap: 2rem;
  padding: 60px 3%;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    max-width: 80%;
  }
`;

const StyledSectionCard = styled.div`
  text-align: center;
  flex: 1;
`;

const StyledCardTitle = styled.div`
  font-weight: 700;
  font-size: 1.5rem;
  padding: 1.5rem 0 0.5rem;
  letter-spacing: 1px;
`;

const StyledCardIcon = styled.div``;

const StyledCardDescription = styled.p`
  color: #e0e0e0;
  text-align: left;
  line-height: 1.5rem;
  font-size: 0.875rem;
`;

const StyledGitHubSection = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  max-width: 85%;
  margin: 0 auto;
  gap: 4rem;
  line-height: 1.5;
  padding: 60px 3%;

  & > div {
    width: 100%;
  }

  @media only screen and (max-width: 768px) {
    flex-direction: column-reverse;
    max-width: 80%;
  }
`;

const StyledSectionArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 40%;
  margin-top: 3rem;

  h2,
  p {
    text-align: left;
    letter-spacing: unset;
  }

  @media only screen and (max-width: 768px) {
    width: 100%;

    h2,
    p {
      text-align: center;
    }

    button {
      align-self: center;
    }
  }
`;

const StyledSponsorSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 85%;
  margin: 0 auto;
  gap: 2rem;
  line-height: 1.5;
  padding: 60px 3%;

  @media only screen and (max-width: 768px) {
    max-width: 80%;
  }
`;

const StyledPreviewSection = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  max-width: 85%;
  margin: 0 auto;
  padding: 0 3%;

  @media only screen and (max-width: 768px) {
    display: none;
    max-width: 80%;
  }
`;

const StyledImage = styled.img`
  max-width: 100%;
  filter: drop-shadow(0px 0px 12px rgba(255, 255, 255, 0.6));
`;

const StyledFooter = styled.footer`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 80%;
  margin: 0 auto;
  padding: 30px 3%;
  border-top: 1px solid #b4b4b4;
  opacity: 0.7;
`;

const StyledFooterText = styled.p`
  color: #b4b4b4;
`;

const StyledIconLinks = styled.div`
  display: flex;
  gap: 20px;

  ${StyledNavLink} {
    color: unset;
  }
`;

const StyledHighlightedText = styled.span`
  text-decoration: underline;
  text-decoration-style: dashed;
  text-decoration-color: #eab308;
`;

const StyledProducthuntSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;

  max-width: 85%;
  margin: 0 auto;
  padding: 60px 3%;

  ${StyledSectionArea} {
    margin: 0;
    width: 100%;

    h2 {
      text-align: right;
    }
  }

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    max-width: 80%;

    ${StyledSectionArea} {
      h2 {
        text-align: center;
      }
    }
  }
`;

const Home: React.FC = () => {
  const { push } = useRouter();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    setIsMobile(window.screen.width <= 768);
  }, []);

  return (
    <StyledHome>
      <Head>
        <title>JSON Visio - Directly onto graphs</title>
      </Head>
      <StyledNavbar>
        <Link href="/editor" passHref>
          <StyledNavLink>Editor</StyledNavLink>
        </Link>
        <Link href="#features" passHref>
          <StyledNavLink>Features</StyledNavLink>
        </Link>
        <Link href="#sponsor" passHref>
          <StyledNavLink>Sponsor</StyledNavLink>
        </Link>
        <StyledNavLink
          href="https://github.com/AykutSarac/jsonvisio.com"
          target="_blank"
          rel="external"
        >
          GitHub
        </StyledNavLink>
      </StyledNavbar>

      <StyledHeroSection id="main">
        <StyledTitle>
          <StyledGradientText>JSON</StyledGradientText> Visio
        </StyledTitle>
        <StyledSubTitle>
          Seamlessly visualize your JSON data{" "}
          <StyledHighlightedText>instantly</StyledHighlightedText> into graphs.
        </StyledSubTitle>
        <StyledMinorTitle>Paste - Import - Fetch!</StyledMinorTitle>
        <StyledButton onClick={() => push("/editor")} disabled={isMobile}>
          {isMobile ? "Incompatible Device" : "GO TO EDITOR"}
        </StyledButton>
      </StyledHeroSection>

      <StyledPreviewSection>
        <StyledImage
          width="1200"
          height="auto"
          src="/jsonvisio-screenshot.png"
          alt="preview"
        />
      </StyledPreviewSection>

      <StyledFeaturesSection id="features">
        <StyledSectionCard>
          <StyledCardIcon>
            <HiCursorClick size={50} color="#3BA55D" />
          </StyledCardIcon>
          <StyledCardTitle>EASY-TO-USE</StyledCardTitle>
          <StyledCardDescription>
            Don&apos;t even bother to update your schema to view your JSON into
            graphs; directly paste, import or fetch! JSON Visio helps you to
            visualize without any additional values and save your time.
          </StyledCardDescription>
        </StyledSectionCard>

        <StyledSectionCard>
          <StyledCardIcon>
            <HiOutlineSearchCircle size={50} color="#5865F2" />
          </StyledCardIcon>
          <StyledCardTitle>SEARCH</StyledCardTitle>
          <StyledCardDescription>
            Have a huge file of values, keys or arrays? Worry no more, type in
            the keyword you are looking for into search input and it will take
            you to each node with matching result highlighting the line to
            understand better!
          </StyledCardDescription>
        </StyledSectionCard>

        <StyledSectionCard>
          <StyledCardIcon>
            <HiOutlineDownload size={50} color="#DA2877" />
          </StyledCardIcon>
          <StyledCardTitle>DOWNLOAD</StyledCardTitle>
          <StyledCardDescription>
            Download the graph to your local machine and use it wherever you
            want, to your blogs, website or make it a poster and paste to the
            wall. Who wouldn&apos;t want to see a JSON Visio graph onto their
            wall, eh?
          </StyledCardDescription>
        </StyledSectionCard>

        <StyledSectionCard>
          <StyledCardIcon>
            <HiLightningBolt size={50} color="#F5E027" />
          </StyledCardIcon>
          <StyledCardTitle>LIVE</StyledCardTitle>
          <StyledCardDescription>
            With Microsoft&apos;s Monaco Editor which is also used by VS Code,
            easily edit your JSON and directly view through the graphs. Also
            there&apos;s a JSON validator above of it to make sure there is no
            type error.
          </StyledCardDescription>
        </StyledSectionCard>
      </StyledFeaturesSection>

      <StyledGitHubSection id="github">
        <TwitterTweetEmbed
          tweetId="1519363257794015233"
          options={{
            width: "600",
            align: "center",
          }}
        />
        <StyledSectionArea>
          <StyledSubTitle>Open Source Community</StyledSubTitle>
          <StyledMinorTitle>
            Join the Open Source Community by suggesting new ideas, support by
            contributing; implementing new features, fixing bugs and doing
            changes minor to major!
          </StyledMinorTitle>
          <StyledButton
            onClick={() => push("https://github.com/AykutSarac/jsonvisio.com")}
            status="SECONDARY"
          >
            STAR ON GITHUB
          </StyledButton>
        </StyledSectionArea>
      </StyledGitHubSection>

      <StyledSponsorSection id="sponsor">
        <StyledSubTitle>Sponsors</StyledSubTitle>
        <StyledMinorTitle>
          Your supports make JSON Visio possible to continue and accessible for
          everyone!
        </StyledMinorTitle>
        <StyledButton
          status="SUCCESS"
          onClick={() => push("https://www.patreon.com/aykutsarac")}
        >
          Become A Sponsor!
        </StyledButton>
      </StyledSponsorSection>

      <StyledProducthuntSection>
        <StyledSectionArea>
          <StyledSubTitle>
            Support JSON Visio at
            <br />
            <StyledHighlightedText>Product Hunt</StyledHighlightedText>
          </StyledSubTitle>
        </StyledSectionArea>
        <Producthunt />
      </StyledProducthuntSection>

      <StyledFooter>
        <StyledFooterText>© 2022 JSON Visio - {pkg.version}</StyledFooterText>
        <StyledIconLinks>
          <StyledNavLink
            href="https://github.com/AykutSarac/jsonvisio.com"
            target="_blank"
            aria-label="github"
          >
            <FaGithub size={26} />
          </StyledNavLink>

          <StyledNavLink
            href="https://www.linkedin.com/in/aykutsarac/"
            target="_blank"
            aria-label="linkedin"
          >
            <FaLinkedin size={26} />
          </StyledNavLink>

          <StyledNavLink
            href="https://twitter.com/aykutsarach"
            target="_blank"
            aria-label="twitter"
          >
            <FaTwitter size={26} />
          </StyledNavLink>
        </StyledIconLinks>
      </StyledFooter>
    </StyledHome>
  );
};

export default Home;
