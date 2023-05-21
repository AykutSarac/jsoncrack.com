import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import styled, { ThemeProvider } from "styled-components";
import { Button } from "@mantine/core";
import { AiOutlineRight, AiTwotoneStar } from "react-icons/ai";
import {
  HiCursorClick,
  HiLightningBolt,
  HiOutlineDownload,
  HiOutlineSearchCircle,
} from "react-icons/hi";
import { IoHeart } from "react-icons/io5";
import { SiVisualstudiocode } from "react-icons/si";
import vscDarkPlus from "react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus";
import { CarbonAds } from "src/components/CarbonAds";
import { Sponsors } from "src/components/Sponsors";
import { baseURL } from "src/constants/data";
import { TABS } from "src/constants/previewSection";
import { darkTheme } from "src/constants/theme";
import { Footer } from "src/layout/Footer";
import { Navbar } from "src/layout/Navbar";
import { Producthunt } from "src/layout/Producthunt";

const SyntaxHighlighter = dynamic(() => import("react-syntax-highlighter/dist/cjs/prism-async"), {
  ssr: false,
});

const StyledButtonWrapper = styled.div`
  display: flex;
  gap: 18px;

  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const StyledTwitterQuote = styled.div`
  width: 100%;
  height: 100%;

  blockquote.twitter-tweet {
    display: inline-block;
    font-family: "Helvetica Neue", Roboto, "Segoe UI", Calibri, sans-serif;
    font-size: 12px;
    font-weight: bold;
    line-height: 16px;
    border-color: #eee #ddd #bbb;
    border-radius: 5px;
    border-style: solid;
    border-width: 1px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    margin: 10px 5px;
    padding: 0 16px 16px 16px;
    max-width: 468px;
  }

  blockquote.twitter-tweet p {
    font-size: 16px;
    font-weight: normal;
    line-height: 20px;
  }

  blockquote.twitter-tweet a {
    color: inherit;
    font-weight: normal;
    text-decoration: none;
    outline: 0 none;
  }

  blockquote.twitter-tweet a:hover,
  blockquote.twitter-tweet a:focus {
    text-decoration: underline;
  }
`;

const StyledHome = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8em;

  background-color: #000000 !important;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 800'%3E%3Cg fill-opacity='0.3'%3E%3Ccircle fill='%23000000' cx='400' cy='400' r='600'/%3E%3Ccircle fill='%23110718' cx='400' cy='400' r='500'/%3E%3Ccircle fill='%23220e30' cx='400' cy='400' r='400'/%3E%3Ccircle fill='%23331447' cx='400' cy='400' r='300'/%3E%3Ccircle fill='%23441b5f' cx='400' cy='400' r='200'/%3E%3Ccircle fill='%23552277' cx='400' cy='400' r='100'/%3E%3C/g%3E%3C/svg%3E");
  background-attachment: fixed;
  background-size: cover;

  * {
    box-sizing: border-box;
  }

  @media only screen and (max-width: 768px) {
    gap: 3em;
  }
`;

const StyledGradientText = styled.span`
  background: #ffb76b;
  background: linear-gradient(to right, #ffb76b 0%, #ffa73d 30%, #ff7c00 60%, #ff7f04 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StyledHeroSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5em;
  min-height: 40vh;
  padding: 0 3%;
  margin-top: -8em;

  h2 {
    margin-bottom: 25px;
  }
`;

const StyledTitle = styled.h1`
  font-weight: 900;
  margin: 0;
  font-size: min(6vw, 86px);
  color: white;
  font-family: var(--mona-sans);

  @media only screen and (max-width: 768px) {
    font-size: 2.5rem;
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
  font-size: 1rem;
  margin: 0;
  letter-spacing: 1.2px;

  @media only screen and (max-width: 992px) {
    font-size: 1rem;
  }
`;

const StyledFeaturesSection = styled.section`
  display: grid;
  margin: 0 auto;
  max-width: 80%;
  justify-content: center;
  grid-template-columns: repeat(2, 40%);
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 60px;
  grid-row-gap: 60px;

  @media only screen and (min-width: 1024px) {
    max-width: 60%;
  }

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    max-width: 80%;
    display: flex;
  }
`;

const StyledSectionCard = styled.div`
  text-align: center;
  flex: 1;
  border: 1px solid ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
  background: rgb(48, 0, 65);
  background: linear-gradient(
    138deg,
    rgba(48, 0, 65, 0.8870141806722689) 0%,
    rgba(72, 12, 84, 0.40802258403361347) 33%,
    rgba(65, 8, 92, 0.6012998949579832) 100%
  );
  border-radius: 6px;
  padding: 16px;
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

const StyledFrame = styled.iframe`
  width: 100%;
  height: 100%;
  min-height: 200px;
  border: 2px solid ${({ theme }) => theme.PRIMARY};
  border-radius: 6px;

  @media only screen and (min-width: 768px) {
    min-height: 384px;
  }
`;

const StyledPreviewFrame = styled(StyledFrame)`
  border: none;
  border-left: 2px solid ${({ theme }) => theme.PRIMARY};
  border-radius: 0;
  height: 476px;
  width: 50%;
`;

const StyledSection = styled.section<{ reverse?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  max-width: 85%;
  margin: 0 auto;
  gap: 4rem;
  line-height: 1.5;
  padding: 50px 3%;

  & > div {
    width: 100%;
  }

  @media only screen and (max-width: 1200px) {
    flex-direction: ${({ reverse }) => (reverse ? "column-reverse" : "column")};
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
    align-items: center;

    h2 {
      text-align: center;
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
  padding: 50px 3%;

  @media only screen and (max-width: 768px) {
    max-width: 90%;
  }
`;

const StyledPreviewSection = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 70%;
  margin: 0 auto;
  background: ${({ theme }) => theme.BLACK_SECONDARY};
  border: 2px solid ${({ theme }) => theme.PRIMARY};
  border-radius: 6px;
  overflow: hidden;
  height: 480px;

  @media only screen and (max-width: 992px) {
    display: none;
  }
`;

const StyledHighlightWrapper = styled.div`
  width: 50%;
`;

const StyledTabsWrapper = styled.div`
  display: flex;
  gap: 10px;
  padding: 8px 8px;
  padding-bottom: 0;
  height: 34px;

  pre {
    border-top: 2px solid ${({ theme }) => theme.PRIMARY};
  }
`;

const StyledTab = styled.button<{ active?: boolean }>`
  border-radius: 6px 6px 0 0;
  background: ${({ active }) => active && "#1e1e1e"};
  border: 2px solid ${({ theme, active }) => (active ? theme.PRIMARY : "transparent")};
  border-bottom: 0;
  margin-bottom: -2px;
  padding: 4px 8px;
  min-width: 80px;
  max-width: 150px;
  color: ${({ theme, active }) => (active ? theme.INTERACTIVE_ACTIVE : theme.INTERACTIVE_NORMAL)};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 12px;
  font-weight: 600;

  &:hover {
    color: ${({ theme, active }) => !active && theme.INTERACTIVE_HOVER};
  }
`;

const StyledHighlightedText = styled.span`
  text-decoration: underline;
  text-decoration-style: dashed;
  text-decoration-color: #eab308;
`;

const StyledProducthunt = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 3rem;
  border-right: 1px solid white;
  padding-right: 3rem;

  @media only screen and (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid white;
    padding-bottom: 3rem;
    padding-right: 0;
  }
`;

const StyledPaidSection = styled.section`
  display: flex;
  max-width: 85%;
  margin: 0 auto;
  gap: 2rem;
  padding: 50px 3%;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    max-width: 80%;
  }
`;

const StyledAffiliate = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 3rem;

  .carbon-outer {
    max-width: 430px;
  }
`;

const HeroSection = () => (
  <StyledHeroSection id="main">
    <StyledTitle>
      <StyledGradientText>JSON</StyledGradientText> CRACK
    </StyledTitle>
    <StyledSubTitle>
      Seamlessly visualize your JSON data <StyledHighlightedText>instantly</StyledHighlightedText>{" "}
      into graphs.
    </StyledSubTitle>
    <Link href="/editor">
      <Button color="grape" size="lg">
        GO TO EDITOR
        <AiOutlineRight strokeWidth="80" />
      </Button>
    </Link>
    <StyledButtonWrapper>
      <Link href="https://github.com/sponsors/AykutSarac" target="_blank" rel="noreferrer">
        <Button color="red" size="md" variant="outline" rightIcon={<IoHeart />}>
          SPONSOR
        </Button>
      </Link>
      <Link href="https://marketplace.visualstudio.com/items?itemName=AykutSarac.jsoncrack-vscode">
        <Button color="blue" size="md" variant="outline" rightIcon={<SiVisualstudiocode />}>
          GET IT ON VS CODE
        </Button>
      </Link>
    </StyledButtonWrapper>
  </StyledHeroSection>
);

const PreviewSection = () => {
  const [currentTab, setCurrentTab] = React.useState(0);
  const [loaded, setLoaded] = React.useState(false);
  const widgetRef = React.useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    const eventFn = (event: MessageEvent) => {
      if (event.source === widgetRef.current?.contentWindow) {
        setLoaded(true);
      }
    };

    window.addEventListener("message", eventFn, false);
    return () => window.removeEventListener("message", eventFn);
  }, []);

  React.useEffect(() => {
    if (loaded && widgetRef.current) {
      const message = { json: TABS[currentTab].json };
      widgetRef.current.contentWindow?.postMessage(message, "*");
    }
  }, [currentTab, loaded]);

  return (
    <StyledPreviewSection>
      <StyledHighlightWrapper>
        <StyledTabsWrapper>
          {TABS.map(tab => (
            <StyledTab
              active={tab.id === currentTab}
              onClick={() => setCurrentTab(tab.id)}
              key={tab.id}
            >
              {tab.name}
            </StyledTab>
          ))}
        </StyledTabsWrapper>
        <SyntaxHighlighter
          style={vscDarkPlus}
          customStyle={{
            fontSize: "16px",
            width: "100%",
            height: "440px",
            margin: "0",
            borderTop: "2px solid #4D4D4D",
          }}
          language="json"
          showLineNumbers
        >
          {TABS[currentTab].json}
        </SyntaxHighlighter>
      </StyledHighlightWrapper>

      <StyledPreviewFrame
        ref={widgetRef}
        title="Preview Embed"
        id="jcPreview"
        src={`${baseURL}/widget`}
        loading="eager"
      />
    </StyledPreviewSection>
  );
};

const FeaturesSection = () => (
  <StyledFeaturesSection id="features">
    <StyledSectionCard>
      <StyledCardIcon>
        <HiCursorClick size={50} color="#3BA55D" />
      </StyledCardIcon>
      <StyledCardTitle>EASY-TO-USE</StyledCardTitle>
      <StyledCardDescription>
        We believe that powerful software doesn&apos;t have to be difficult to use. That&apos;s why
        we&apos;ve designed our app to be as intuitive and easy-to-use as possible. You can quickly
        and easily load your JSON data and start exploring and analyzing it right away!
      </StyledCardDescription>
    </StyledSectionCard>

    <StyledSectionCard>
      <StyledCardIcon>
        <HiOutlineSearchCircle size={50} color="#5865F2" />
      </StyledCardIcon>
      <StyledCardTitle>SEARCH</StyledCardTitle>
      <StyledCardDescription>
        Have a huge file of values, keys or arrays? Worry no more, type in the keyword you are
        looking for into search input and it will take you to each node with matching result
        highlighting the line to understand better!
      </StyledCardDescription>
    </StyledSectionCard>

    <StyledSectionCard>
      <StyledCardIcon>
        <HiOutlineDownload size={50} color="#DA2877" />
      </StyledCardIcon>
      <StyledCardTitle>DOWNLOAD</StyledCardTitle>
      <StyledCardDescription>
        Download the graph to your local machine and use it wherever you want, to your blogs,
        website or make it a poster and paste to the wall. Who wouldn&apos;t want to see a JSON
        Crack graph onto their wall, eh?
      </StyledCardDescription>
    </StyledSectionCard>

    <StyledSectionCard>
      <StyledCardIcon>
        <HiLightningBolt size={50} color="#F5E027" />
      </StyledCardIcon>
      <StyledCardTitle>LIVE</StyledCardTitle>
      <StyledCardDescription>
        With Microsoft&apos;s Monaco Editor which is also used by VS Code, easily edit your JSON and
        directly view through the graphs. Also there&apos;s a JSON validator above of it to make
        sure there is no type error.
      </StyledCardDescription>
    </StyledSectionCard>
  </StyledFeaturesSection>
);

const GitHubSection = () => (
  <StyledSection id="github" reverse>
    <StyledTwitterQuote>
      <blockquote className="twitter-tweet" data-lang="en" data-dnt="true" data-theme="light">
        <p lang="en" dir="ltr">
          Looking to understand or explore some JSON? Just paste or upload to visualize it as a
          graph with <a href="https://t.co/HlKSrhKryJ">https://t.co/HlKSrhKryJ</a> 😍 <br />
          <br />
          Thanks to <a href="https://twitter.com/aykutsarach?ref_src=twsrc%5Etfw">
            @aykutsarach
          </a>! <a href="https://t.co/0LyPUL8Ezz">pic.twitter.com/0LyPUL8Ezz</a>
        </p>
        &mdash; GitHub (@github){" "}
        <a href="https://twitter.com/github/status/1519363257794015233?ref_src=twsrc%5Etfw">
          April 27, 2022
        </a>
      </blockquote>{" "}
      <Script strategy="lazyOnload" src="https://platform.twitter.com/widgets.js"></Script>
    </StyledTwitterQuote>
    <StyledSectionArea>
      <StyledSubTitle>Open Source Community</StyledSubTitle>
      <StyledMinorTitle>
        At JSON Crack, we believe in the power of open source software and the communities that
        support it. That&apos;s why we&apos;re proud to be part of the open source community and to
        contribute to the development and growth of open source tools and technologies.
        <br />
        <br /> As part of our commitment to the open source community, we&apos;ve made our app
        freely available to anyone who wants to use it, and we welcome contributions from anyone
        who&apos;s interested in helping to improve it. Whether you&apos;re a developer, a data
        scientist, or just someone who&apos;s passionate about open source, we&apos;d love to have
        you join our community and help us make JSON Crack the best it can be.
        <br />
        <br /> So why not join us and become part of the JSON Crack open source community today? We
        can&apos;t wait to see what we can accomplish together!
      </StyledMinorTitle>
      <Button
        w="fit-content"
        color="grape"
        size="md"
        component="a"
        href="https://github.com/AykutSarac/jsoncrack.com"
        leftIcon={<AiTwotoneStar />}
      >
        STAR ON GITHUB
      </Button>
    </StyledSectionArea>
  </StyledSection>
);

const EmbedSection = () => (
  <StyledSection id="embed">
    <StyledSectionArea>
      <StyledSubTitle>Embed Into Your Website</StyledSubTitle>
      <StyledMinorTitle>
        JSON Crack provides users with the necessary code to embed the app into a website easily
        using an iframe. This code can be easily copied and pasted into the desired location on the
        website, allowing users to quickly and easily integrate JSON Crack into existing workflows.
        <br />
        <br /> Once the app is embedded, users can use it to view and analyze JSON data directly on
        the website. This can be useful for a variety of purposes, such as quickly checking the
        structure of a JSON file or verifying the data contained within it. JSON Crack&apos;s
        intuitive interface makes it easy to navigate and understand even complex JSON data, making
        it a valuable tool for anyone working with JSON.
      </StyledMinorTitle>
      <Button w="fit-content" size="md" component="a" href="/docs">
        LEARN TO EMBED
      </Button>
    </StyledSectionArea>
    <div>
      <StyledFrame
        title="Example Embed"
        src={`${baseURL}/widget?json=63c313d32ffa98f29b462315`}
        loading="lazy"
      ></StyledFrame>
    </div>
  </StyledSection>
);

const SupportSection = () => (
  <StyledPaidSection>
    <StyledProducthunt>
      <StyledSubTitle>
        Support JSON Crack at
        <br />
        <StyledHighlightedText>Product Hunt</StyledHighlightedText>
      </StyledSubTitle>
      <Producthunt />
    </StyledProducthunt>
    <StyledAffiliate>
      <StyledSubTitle>Affiliate</StyledSubTitle>
      <CarbonAds />
    </StyledAffiliate>
  </StyledPaidSection>
);

const SponsorSection = () => (
  <StyledSponsorSection id="sponsor">
    <StyledSubTitle>Sponsors</StyledSubTitle>
    <StyledMinorTitle>
      Your supports make JSON Crack possible to continue and accessible for everyone!
    </StyledMinorTitle>
    <Button
      size="md"
      component="a"
      color="green"
      href="https://github.com/sponsors/AykutSarac"
      rel="external"
    >
      Become A Sponsor!
    </Button>
    <Sponsors />
  </StyledSponsorSection>
);

const HomePage = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <StyledHome>
        <Head>
          <title>JSON Crack - Crack your data into pieces</title>
        </Head>
        <Navbar />
        <HeroSection />
        <PreviewSection />
        <FeaturesSection />
        <SupportSection />
        <GitHubSection />
        <EmbedSection />
        <SponsorSection />
        <Footer />
      </StyledHome>{" "}
    </ThemeProvider>
  );
};

export default HomePage;
