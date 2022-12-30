import React from "react";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import { AiOutlineRight } from "react-icons/ai";
import {
  HiCursorClick,
  HiLightningBolt,
  HiOutlineDownload,
  HiOutlineSearchCircle,
} from "react-icons/hi";
import { IoRocketSharp } from "react-icons/io5";
import { SiVisualstudiocode } from "react-icons/si";
import { CarbonAds } from "src/components/CarbonAds";
import { Footer } from "src/components/Footer";
import { Producthunt } from "src/components/Producthunt";
import { Sponsors } from "src/components/Sponsors";
import { SupportButton } from "src/components/SupportButton";
import { baseURL } from "src/constants/data";
import { PricingCards } from "../PricingCards";
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
    <Link href="docs" passHref>
      <Styles.StyledNavLink>Documentation</Styles.StyledNavLink>
    </Link>
  </Styles.StyledNavbar>
);

const HeroSection = () => {
  const [isModalVisible, setModalVisible] = React.useState(false);

  return (
    <Styles.StyledHeroSection id="main">
      <Styles.StyledTitle>
        <Styles.StyledGradientText>JSON</Styles.StyledGradientText> CRACK
      </Styles.StyledTitle>
      <Styles.StyledSubTitle>
        Seamlessly visualize your JSON data{" "}
        <Styles.StyledHighlightedText>instantly</Styles.StyledHighlightedText> into graphs.
      </Styles.StyledSubTitle>

      <Styles.StyledButton href="/editor" link>
        GO TO EDITOR
        <AiOutlineRight strokeWidth="80" />
      </Styles.StyledButton>

      <Styles.StyledButtonWrapper>
        <Styles.StyledSponsorButton href="/pricing" link>
          GET PREMIUM
          <IoRocketSharp />
        </Styles.StyledSponsorButton>
        <Styles.StyledSponsorButton
          href="https://marketplace.visualstudio.com/items?itemName=AykutSarac.jsoncrack-vscode"
          link
          isBlue
        >
          GET IT ON VS CODE
          <SiVisualstudiocode />
        </Styles.StyledSponsorButton>
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
      <Script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></Script>
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
      <Styles.StyledButton href="/docs" status="SECONDARY" link>
        LEARN TO EMBED
      </Styles.StyledButton>
    </Styles.StyledSectionArea>
    <div>
      <Styles.StyledIframge
        src={`${baseURL}/widget`}
        onLoad={e => {
          const frame = e.currentTarget.contentWindow;
          setTimeout(() => {
            frame?.postMessage(
              {
                json: JSON.stringify({
                  "random images": [
                    "https://random.imagecdn.app/50/50?.png",
                    "https://random.imagecdn.app/80/80?.png",
                    "https://random.imagecdn.app/100/100?.png",
                  ],
                }),
                options: {
                  theme: "dark",
                },
              },
              "*"
            );
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
      <PricingCards />
      <SupportSection />
      <SponsorSection />
      <SupportButton />
      <Footer />
    </Styles.StyledHome>
  );
};

export default Home;
