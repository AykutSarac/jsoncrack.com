import React from "react";
import Head from "next/head";
import Link from "next/link";
import { FaGithub, FaHeart, FaLinkedin, FaTwitter } from "react-icons/fa";
import {
  HiCursorClick,
  HiLightningBolt,
  HiOutlineDownload,
  HiOutlineSearchCircle,
} from "react-icons/hi";
import { SiVisualstudiocode } from "react-icons/si";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { CarbonAds } from "src/components/CarbonAds";
import { Producthunt } from "src/components/Producthunt";
import { Sponsors } from "src/components/Sponsors";
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

      <Styles.StyledButton rel="prefetch" href="/editor" target="_blank" link>
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
    <TwitterTweetEmbed
      tweetId="1519363257794015233"
      options={{
        width: "600",
        align: "center",
      }}
    />
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
      <Styles.StyledIframge src="https://jsoncrack.com/widget?json=%5B%5B%22squadName%22%2C%22homeTown%22%2C%22formed%22%2C%22secretBase%22%2C%22active%22%2C%22members%22%2C%22a%7C0%7C1%7C2%7C3%7C4%7C5%22%2C%22Super%20hero%20squad%22%2C%22Metro%20City%22%2C%22n%7CWW%22%2C%22Super%20tower%22%2C%22b%7CT%22%2C%22name%22%2C%22age%22%2C%22secretIdentity%22%2C%22powers%22%2C%22a%7CC%7CD%7CE%7CF%22%2C%22Molecule%20Man%22%2C%22n%7CT%22%2C%22Dan%20Jukes%22%2C%22Radiation%20resistance%22%2C%22Turning%20tiny%22%2C%22Radiation%20blast%22%2C%22a%7CK%7CL%7CM%22%2C%22o%7CG%7CH%7CI%7CJ%7CN%22%2C%22Madame%20Uppercut%22%2C%22n%7Cd%22%2C%22Jane%20Wilson%22%2C%22Million%20tonne%20punch%22%2C%22Damage%20resistance%22%2C%22Superhuman%20reflexes%22%2C%22a%7CS%7CT%7CU%22%2C%22o%7CG%7CP%7CQ%7CR%7CV%22%2C%22Eternal%20Flame%22%2C%22n%7C4C92%22%2C%22Unknown%22%2C%22Immortality%22%2C%22Heat%20Immunity%22%2C%22Inferno%22%2C%22Teleportation%22%2C%22Interdimensional%20travel%22%2C%22a%7Ca%7Cb%7Cc%7Cd%7Ce%22%2C%22o%7CG%7CX%7CY%7CZ%7Cf%22%2C%22a%7CO%7CW%7Cg%22%2C%22o%7C6%7C7%7C8%7C9%7CA%7CB%7Ch%22%5D%2C%22i%22%5D"></Styles.StyledIframge>
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
