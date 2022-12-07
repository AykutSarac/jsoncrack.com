import React from "react";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import { FaGithub, FaHeart, FaLinkedin, FaTwitter } from "react-icons/fa";
import {
  HiCursorClick,
  HiLightningBolt,
  HiOutlineDownload,
  HiOutlineSearchCircle,
} from "react-icons/hi";
import { SiVisualstudiocode } from "react-icons/si";
import { CarbonAds } from "src/components/CarbonAds";
import { Producthunt } from "src/components/Producthunt";
import { Sponsors } from "src/components/Sponsors";
import { defaultJson } from "src/constants/data";
import { GoalsModal } from "src/containers/Modals/GoalsModal";
import pkg from "../../../package.json";
import * as Styles from "./styles";

const Navbar = () => (
  <Styles.StyledNavbar>
    <Styles.StyledNavLink href="/editor">Editor</Styles.StyledNavLink>
    <Link href="#features" passHref>
      <Styles.StyledNavLink>Features</Styles.StyledNavLink>
    </Link>
    <Link href="#sponsor" passHref>
      <Styles.StyledNavLink>Sponsor</Styles.StyledNavLink>
    </Link>
    <Styles.StyledNavLink
      href="https://github.com/AykutSarac/jsoncrack.com"
      target="_blank"
      rel="external"
    >
      GitHub
    </Styles.StyledNavLink>
  </Styles.StyledNavbar>
);

const HeroSection = () => {
  const [isModalVisible, setModalVisible] = React.useState(false);

  return (
    <Styles.StyledHeroSection id="main">
      <Styles.StyledTitle>
        <Styles.StyledGradientText>JSON</Styles.StyledGradientText> Crack
      </Styles.StyledTitle>
      <Styles.StyledSubTitle>
        Seamlessly visualize your JSON data{" "}
        <Styles.StyledHighlightedText>instantly</Styles.StyledHighlightedText> into
        graphs.
      </Styles.StyledSubTitle>
      <Styles.StyledMinorTitle>Paste - Import - Fetch!</Styles.StyledMinorTitle>

      <Styles.StyledButton rel="prefetch" href="/editor" link>
        GO TO EDITOR
      </Styles.StyledButton>

      <Styles.StyledButtonWrapper>
        <Styles.StyledSponsorButton onClick={() => setModalVisible(true)}>
          Help JSON Crack&apos;s Goals
          <FaHeart />
        </Styles.StyledSponsorButton>
        <Link
          href="https://marketplace.visualstudio.com/items?itemName=AykutSarac.jsoncrack-vscode"
          passHref
        >
          <Styles.StyledSponsorButton isBlue>
            GET IT ON VS CODE
            <SiVisualstudiocode />
          </Styles.StyledSponsorButton>
        </Link>
        <GoalsModal visible={isModalVisible} setVisible={setModalVisible} />
      </Styles.StyledButtonWrapper>
    </Styles.StyledHeroSection>
  );
};

const PreviewSection = () => (
  <Styles.StyledPreviewSection>
    <Styles.StyledImageWrapper>
      <Styles.StyledImage
        width="1200"
        height="863"
        src="/assets/jsoncrack-screenshot.webp"
        alt="preview"
      />
    </Styles.StyledImageWrapper>
  </Styles.StyledPreviewSection>
);

const FeaturesSection = () => (
  <Styles.StyledFeaturesSection id="features">
    <Styles.StyledSectionCard>
      <Styles.StyledCardIcon>
        <HiCursorClick size={50} color="#3BA55D" />
      </Styles.StyledCardIcon>
      <Styles.StyledCardTitle>EASY-TO-USE</Styles.StyledCardTitle>
      <Styles.StyledCardDescription>
        Don&apos;t even bother to update your schema to view your JSON into graphs;
        directly paste, import or fetch! JSON Crack helps you to visualize without
        any additional values and save your time.
      </Styles.StyledCardDescription>
    </Styles.StyledSectionCard>

    <Styles.StyledSectionCard>
      <Styles.StyledCardIcon>
        <HiOutlineSearchCircle size={50} color="#5865F2" />
      </Styles.StyledCardIcon>
      <Styles.StyledCardTitle>SEARCH</Styles.StyledCardTitle>
      <Styles.StyledCardDescription>
        Have a huge file of values, keys or arrays? Worry no more, type in the
        keyword you are looking for into search input and it will take you to each
        node with matching result highlighting the line to understand better!
      </Styles.StyledCardDescription>
    </Styles.StyledSectionCard>

    <Styles.StyledSectionCard>
      <Styles.StyledCardIcon>
        <HiOutlineDownload size={50} color="#DA2877" />
      </Styles.StyledCardIcon>
      <Styles.StyledCardTitle>DOWNLOAD</Styles.StyledCardTitle>
      <Styles.StyledCardDescription>
        Download the graph to your local machine and use it wherever you want, to
        your blogs, website or make it a poster and paste to the wall. Who
        wouldn&apos;t want to see a JSON Crack graph onto their wall, eh?
      </Styles.StyledCardDescription>
    </Styles.StyledSectionCard>

    <Styles.StyledSectionCard>
      <Styles.StyledCardIcon>
        <HiLightningBolt size={50} color="#F5E027" />
      </Styles.StyledCardIcon>
      <Styles.StyledCardTitle>LIVE</Styles.StyledCardTitle>
      <Styles.StyledCardDescription>
        With Microsoft&apos;s Monaco Editor which is also used by VS Code, easily
        edit your JSON and directly view through the graphs. Also there&apos;s a JSON
        validator above of it to make sure there is no type error.
      </Styles.StyledCardDescription>
    </Styles.StyledSectionCard>
  </Styles.StyledFeaturesSection>
);

const GitHubSection = () => (
  <Styles.StyledSection id="github" reverse>
    <Styles.StyledTwitterQuote>
      <blockquote
        className="twitter-tweet"
        data-lang="en"
        data-dnt="true"
        data-theme="light"
      >
        <p lang="en" dir="ltr">
          Looking to understand or explore some JSON? Just paste or upload to
          visualize it as a graph with{" "}
          <a href="https://t.co/HlKSrhKryJ">https://t.co/HlKSrhKryJ</a> 😍 <br />
          <br />
          Thanks to{" "}
          <a href="https://twitter.com/aykutsarach?ref_src=twsrc%5Etfw">
            @aykutsarach
          </a>
          ! <a href="https://t.co/0LyPUL8Ezz">pic.twitter.com/0LyPUL8Ezz</a>
        </p>
        &mdash; GitHub (@github){" "}
        <a href="https://twitter.com/github/status/1519363257794015233?ref_src=twsrc%5Etfw">
          April 27, 2022
        </a>
      </blockquote>{" "}
      <Script
        async
        src="https://platform.twitter.com/widgets.js"
        charSet="utf-8"
      ></Script>
    </Styles.StyledTwitterQuote>
    <Styles.StyledSectionArea>
      <Styles.StyledSubTitle>Open Source Community</Styles.StyledSubTitle>
      <Styles.StyledMinorTitle>
        Join the Open Source Community by suggesting new ideas, support by
        contributing; implementing new features, fixing bugs and doing changes minor
        to major!
      </Styles.StyledMinorTitle>
      <Styles.StyledButton
        href="https://github.com/AykutSarac/jsoncrack.com"
        status="SECONDARY"
        link
      >
        STAR ON GITHUB
      </Styles.StyledButton>
    </Styles.StyledSectionArea>
  </Styles.StyledSection>
);

const EmbedSection = () => (
  <Styles.StyledSection id="embed">
    <Styles.StyledSectionArea>
      <Styles.StyledSubTitle>Embed Into Your Website</Styles.StyledSubTitle>
      <Styles.StyledMinorTitle>
        Easily embed the JSON Crack graph into your website to showcase your
        visitors, blog readers or anybody else!
      </Styles.StyledMinorTitle>
    </Styles.StyledSectionArea>
    <div>
      <Styles.StyledIframge
        src="https://jsoncrack.com/widget"
        onLoad={e => {
          const frame = e.currentTarget.contentWindow;
          setTimeout(() => {
            frame?.postMessage({
              json: defaultJson,
            }, "*");
          }, 500);
        }}
      ></Styles.StyledIframge>
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
    <Styles.StyledButton
      href="https://github.com/sponsors/AykutSarac"
      rel="external"
      status="SUCCESS"
      link
    >
      Become A Sponsor!
    </Styles.StyledButton>
    <Sponsors />
  </Styles.StyledSponsorSection>
);

const Footer = () => (
  <Styles.StyledFooter>
    <Styles.StyledFooterText>
      © 2022 JSON Crack - {pkg.version}
    </Styles.StyledFooterText>
    <Styles.StyledIconLinks>
      <Styles.StyledNavLink
        href="https://github.com/AykutSarac/jsoncrack.com"
        rel="external"
        target="_blank"
        aria-label="github"
      >
        <FaGithub size={26} />
      </Styles.StyledNavLink>

      <Styles.StyledNavLink
        href="https://www.linkedin.com/in/aykutsarac/"
        rel="me"
        target="_blank"
        aria-label="linkedin"
      >
        <FaLinkedin size={26} />
      </Styles.StyledNavLink>

      <Styles.StyledNavLink
        href="https://twitter.com/jsoncrack"
        rel="me"
        target="_blank"
        aria-label="twitter"
      >
        <FaTwitter size={26} />
      </Styles.StyledNavLink>
    </Styles.StyledIconLinks>
  </Styles.StyledFooter>
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
      <GitHubSection />
      <EmbedSection />
      <SupportSection />
      <SponsorSection />
      <Footer />
    </Styles.StyledHome>
  );
};

export default Home;
