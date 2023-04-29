import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
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
import { SupportButton } from "src/components/SupportButton";
import { baseURL } from "src/constants/data";
import { TABS } from "src/constants/previewSection";
import { Footer } from "src/layout/Footer";
import { Navbar } from "src/layout/Navbar";
import { Producthunt } from "src/layout/Producthunt";
import * as Styles from "./styles";

const SyntaxHighlighter = dynamic(() => import("react-syntax-highlighter/dist/cjs/prism-async"), {
  ssr: false,
});

const HeroSection = () => (
  <Styles.StyledHeroSection id="main">
    <Styles.StyledTitle>
      <Styles.StyledGradientText>JSON</Styles.StyledGradientText> CRACK
    </Styles.StyledTitle>
    <Styles.StyledSubTitle>
      Seamlessly visualize your JSON data{" "}
      <Styles.StyledHighlightedText>instantly</Styles.StyledHighlightedText> into graphs.
    </Styles.StyledSubTitle>
    <Link href="/editor">
      <Button color="grape" size="lg">
        GO TO EDITOR
        <AiOutlineRight strokeWidth="80" />
      </Button>
    </Link>
    <Styles.StyledButtonWrapper>
      <Link href="https://github.com/sponsors/AykutSarac" target="_blank" rel="noreferrer">
        <Button color="red" size="md" variant="outline" rightIcon={<IoHeart />}>
          SPONSOR US
        </Button>
      </Link>
      <Link href="https://marketplace.visualstudio.com/items?itemName=AykutSarac.jsoncrack-vscode">
        <Button color="blue" size="md" variant="outline" rightIcon={<SiVisualstudiocode />}>
          GET IT ON VS CODE
        </Button>
      </Link>
    </Styles.StyledButtonWrapper>
  </Styles.StyledHeroSection>
);

const PreviewSection = () => {
  const [currentTab, setCurrentTab] = React.useState(0);

  const updateTab = (tabId: number) => {
    const embed = document.getElementById("jcPreview") as HTMLIFrameElement;
    embed.contentWindow?.postMessage({
      json: TABS[tabId].json,
    });
    setCurrentTab(tabId);
  };

  return (
    <Styles.StyledPreviewSection>
      <Styles.StyledHighlightWrapper>
        <Styles.StyledTabsWrapper>
          {TABS.map(tab => (
            <Styles.StyledTab
              active={tab.id === currentTab}
              onClick={() => updateTab(tab.id)}
              key={tab.id}
            >
              {tab.name}
            </Styles.StyledTab>
          ))}
        </Styles.StyledTabsWrapper>
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
      </Styles.StyledHighlightWrapper>

      <Styles.StyledPreviewFrame
        title="Preview Embed"
        id="jcPreview"
        src={`${baseURL}/widget?json=63b73305c358219fbc421adf`}
        loading="eager"
      />
    </Styles.StyledPreviewSection>
  );
};

const FeaturesSection = () => (
  <Styles.StyledFeaturesSection id="features">
    <Styles.StyledSectionCard>
      <Styles.StyledCardIcon>
        <HiCursorClick size={50} color="#3BA55D" />
      </Styles.StyledCardIcon>
      <Styles.StyledCardTitle>EASY-TO-USE</Styles.StyledCardTitle>
      <Styles.StyledCardDescription>
        We believe that powerful software doesn&apos;t have to be difficult to use. That&apos;s why
        we&apos;ve designed our app to be as intuitive and easy-to-use as possible. You can quickly
        and easily load your JSON data and start exploring and analyzing it right away!
      </Styles.StyledCardDescription>
    </Styles.StyledSectionCard>

    <Styles.StyledSectionCard>
      <Styles.StyledCardIcon>
        <HiOutlineSearchCircle size={50} color="#5865F2" />
      </Styles.StyledCardIcon>
      <Styles.StyledCardTitle>SEARCH</Styles.StyledCardTitle>
      <Styles.StyledCardDescription>
        Have a huge file of values, keys or arrays? Worry no more, type in the keyword you are
        looking for into search input and it will take you to each node with matching result
        highlighting the line to understand better!
      </Styles.StyledCardDescription>
    </Styles.StyledSectionCard>

    <Styles.StyledSectionCard>
      <Styles.StyledCardIcon>
        <HiOutlineDownload size={50} color="#DA2877" />
      </Styles.StyledCardIcon>
      <Styles.StyledCardTitle>DOWNLOAD</Styles.StyledCardTitle>
      <Styles.StyledCardDescription>
        Download the graph to your local machine and use it wherever you want, to your blogs,
        website or make it a poster and paste to the wall. Who wouldn&apos;t want to see a JSON
        Crack graph onto their wall, eh?
      </Styles.StyledCardDescription>
    </Styles.StyledSectionCard>

    <Styles.StyledSectionCard>
      <Styles.StyledCardIcon>
        <HiLightningBolt size={50} color="#F5E027" />
      </Styles.StyledCardIcon>
      <Styles.StyledCardTitle>LIVE</Styles.StyledCardTitle>
      <Styles.StyledCardDescription>
        With Microsoft&apos;s Monaco Editor which is also used by VS Code, easily edit your JSON and
        directly view through the graphs. Also there&apos;s a JSON validator above of it to make
        sure there is no type error.
      </Styles.StyledCardDescription>
    </Styles.StyledSectionCard>
  </Styles.StyledFeaturesSection>
);

const GitHubSection = () => (
  <Styles.StyledSection id="github" reverse>
    <Styles.StyledTwitterQuote>
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
    </Styles.StyledTwitterQuote>
    <Styles.StyledSectionArea>
      <Styles.StyledSubTitle>Open Source Community</Styles.StyledSubTitle>
      <Styles.StyledMinorTitle>
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
      </Styles.StyledMinorTitle>
      <Button
        w={200}
        color="grape"
        size="md"
        component="a"
        href="https://github.com/AykutSarac/jsoncrack.com"
        leftIcon={<AiTwotoneStar />}
      >
        STAR ON GITHUB
      </Button>
    </Styles.StyledSectionArea>
  </Styles.StyledSection>
);

const EmbedSection = () => (
  <Styles.StyledSection id="embed">
    <Styles.StyledSectionArea>
      <Styles.StyledSubTitle>Embed Into Your Website</Styles.StyledSubTitle>
      <Styles.StyledMinorTitle>
        JSON Crack provides users with the necessary code to embed the app into a website easily
        using an iframe. This code can be easily copied and pasted into the desired location on the
        website, allowing users to quickly and easily integrate JSON Crack into existing workflows.
        <br />
        <br /> Once the app is embedded, users can use it to view and analyze JSON data directly on
        the website. This can be useful for a variety of purposes, such as quickly checking the
        structure of a JSON file or verifying the data contained within it. JSON Crack&apos;s
        intuitive interface makes it easy to navigate and understand even complex JSON data, making
        it a valuable tool for anyone working with JSON.
      </Styles.StyledMinorTitle>
      <Button w={200} size="md" component="a" href="/docs">
        LEARN TO EMBED
      </Button>
    </Styles.StyledSectionArea>
    <div>
      <Styles.StyledFrame
        title="Example Embed"
        src={`${baseURL}/widget?json=63c313d32ffa98f29b462315`}
        loading="lazy"
      ></Styles.StyledFrame>
    </div>
  </Styles.StyledSection>
);

const SupportSection = () => (
  <Styles.StyledPaidSection>
    <Styles.StyledProducthunt>
      <Styles.StyledSubTitle>
        Support JSON Crack at
        <br />
        <Styles.StyledHighlightedText>Product Hunt</Styles.StyledHighlightedText>
      </Styles.StyledSubTitle>
      <Producthunt />
    </Styles.StyledProducthunt>
    <Styles.StyledAffiliate>
      <Styles.StyledSubTitle>Affiliate</Styles.StyledSubTitle>
      <CarbonAds />
    </Styles.StyledAffiliate>
  </Styles.StyledPaidSection>
);

const SponsorSection = () => (
  <Styles.StyledSponsorSection id="sponsor">
    <Styles.StyledSubTitle>Sponsors</Styles.StyledSubTitle>
    <Styles.StyledMinorTitle>
      Your supports make JSON Crack possible to continue and accessible for everyone!
    </Styles.StyledMinorTitle>
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
  </Styles.StyledSponsorSection>
);

const Home: React.FC = () => {
  return (
    <Styles.StyledHome>
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
      <SupportButton />
      <Footer />
    </Styles.StyledHome>
  );
};

export default Home;
