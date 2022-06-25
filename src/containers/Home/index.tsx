import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import {
  HiCursorClick,
  HiLightningBolt,
  HiOutlineDownload,
  HiOutlineSearchCircle,
} from "react-icons/hi";
import { Producthunt } from "src/components/Producthunt";
import { CarbonAds } from "src/components/CarbonAds";
import pkg from "../../../package.json";
import * as Styles from "./styles";

const Home: React.FC = () => {
  const { push } = useRouter();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    setIsMobile(window.screen.width <= 768);
  }, []);

  return (
    <Styles.StyledHome>
      <Head>
        <title>JSON Visio - Directly onto graphs</title>
      </Head>
      <Styles.StyledNavbar>
        <Styles.StyledNavLink href="/editor">Editor</Styles.StyledNavLink>
        <Link href="#features" passHref>
          <Styles.StyledNavLink>Features</Styles.StyledNavLink>
        </Link>
        <Link href="#sponsor" passHref>
          <Styles.StyledNavLink>Sponsor</Styles.StyledNavLink>
        </Link>
        <Styles.StyledNavLink
          href="https://github.com/AykutSarac/jsonvisio.com"
          target="_blank"
          rel="external"
        >
          GitHub
        </Styles.StyledNavLink>
      </Styles.StyledNavbar>

      <Styles.StyledHeroSection id="main">
        <Styles.StyledTitle>
          <Styles.StyledGradientText>JSON</Styles.StyledGradientText> Visio
        </Styles.StyledTitle>
        <Styles.StyledSubTitle>
          Seamlessly visualize your JSON data
          <Styles.StyledHighlightedText>instantly</Styles.StyledHighlightedText>
          into graphs.
        </Styles.StyledSubTitle>
        <Styles.StyledMinorTitle>
          Paste - Import - Fetch!
        </Styles.StyledMinorTitle>
        <Styles.StyledButton
          onClick={() => window.location.replace("/editor")}
          disabled={isMobile}
        >
          {isMobile ? "Incompatible Device" : "GO TO EDITOR"}
        </Styles.StyledButton>
      </Styles.StyledHeroSection>

      <Styles.StyledPreviewSection>
        <Styles.StyledImage
          width="1200"
          height="auto"
          src="/jsonvisio-screenshot.png"
          alt="preview"
        />
      </Styles.StyledPreviewSection>

      <Styles.StyledFeaturesSection id="features">
        <Styles.StyledSectionCard>
          <Styles.StyledCardIcon>
            <HiCursorClick size={50} color="#3BA55D" />
          </Styles.StyledCardIcon>
          <Styles.StyledCardTitle>EASY-TO-USE</Styles.StyledCardTitle>
          <Styles.StyledCardDescription>
            Don&apos;t even bother to update your schema to view your JSON into
            graphs; directly paste, import or fetch! JSON Visio helps you to
            visualize without any additional values and save your time.
          </Styles.StyledCardDescription>
        </Styles.StyledSectionCard>

        <Styles.StyledSectionCard>
          <Styles.StyledCardIcon>
            <HiOutlineSearchCircle size={50} color="#5865F2" />
          </Styles.StyledCardIcon>
          <Styles.StyledCardTitle>SEARCH</Styles.StyledCardTitle>
          <Styles.StyledCardDescription>
            Have a huge file of values, keys or arrays? Worry no more, type in
            the keyword you are looking for into search input and it will take
            you to each node with matching result highlighting the line to
            understand better!
          </Styles.StyledCardDescription>
        </Styles.StyledSectionCard>

        <Styles.StyledSectionCard>
          <Styles.StyledCardIcon>
            <HiOutlineDownload size={50} color="#DA2877" />
          </Styles.StyledCardIcon>
          <Styles.StyledCardTitle>DOWNLOAD</Styles.StyledCardTitle>
          <Styles.StyledCardDescription>
            Download the graph to your local machine and use it wherever you
            want, to your blogs, website or make it a poster and paste to the
            wall. Who wouldn&apos;t want to see a JSON Visio graph onto their
            wall, eh?
          </Styles.StyledCardDescription>
        </Styles.StyledSectionCard>

        <Styles.StyledSectionCard>
          <Styles.StyledCardIcon>
            <HiLightningBolt size={50} color="#F5E027" />
          </Styles.StyledCardIcon>
          <Styles.StyledCardTitle>LIVE</Styles.StyledCardTitle>
          <Styles.StyledCardDescription>
            With Microsoft&apos;s Monaco Editor which is also used by VS Code,
            easily edit your JSON and directly view through the graphs. Also
            there&apos;s a JSON validator above of it to make sure there is no
            type error.
          </Styles.StyledCardDescription>
        </Styles.StyledSectionCard>
      </Styles.StyledFeaturesSection>

      <Styles.StyledGitHubSection id="github">
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
            contributing; implementing new features, fixing bugs and doing
            changes minor to major!
          </Styles.StyledMinorTitle>
          <Styles.StyledButton
            onClick={() => push("https://github.com/AykutSarac/jsonvisio.com")}
            status="SECONDARY"
          >
            STAR ON GITHUB
          </Styles.StyledButton>
        </Styles.StyledSectionArea>
      </Styles.StyledGitHubSection>

      <Styles.StyledPaidSection>
        <Styles.StyledProducthunt>
          <Styles.StyledSubTitle>
            Support JSON Visio at
            <br />
            <Styles.StyledHighlightedText>
              Product Hunt
            </Styles.StyledHighlightedText>
          </Styles.StyledSubTitle>
          <Producthunt />
        </Styles.StyledProducthunt>
        <Styles.StyledAffiliate>
          <Styles.StyledSubTitle>Affiliate</Styles.StyledSubTitle>
          <CarbonAds />
        </Styles.StyledAffiliate>
      </Styles.StyledPaidSection>

      <Styles.StyledSponsorSection id="sponsor">
        <Styles.StyledSubTitle>Sponsors</Styles.StyledSubTitle>
        <Styles.StyledMinorTitle>
          Your supports make JSON Visio possible to continue and accessible for
          everyone!
        </Styles.StyledMinorTitle>
        <Styles.StyledButton
          status="SUCCESS"
          onClick={() => push("https://www.patreon.com/aykutsarac")}
        >
          Become A Sponsor!
        </Styles.StyledButton>
      </Styles.StyledSponsorSection>

      <Styles.StyledFooter>
        <Styles.StyledFooterText>
          © 2022 JSON Visio - {pkg.version}
        </Styles.StyledFooterText>
        <Styles.StyledIconLinks>
          <Styles.StyledNavLink
            href="https://github.com/AykutSarac/jsonvisio.com"
            target="_blank"
            aria-label="github"
          >
            <FaGithub size={26} />
          </Styles.StyledNavLink>

          <Styles.StyledNavLink
            href="https://www.linkedin.com/in/aykutsarac/"
            target="_blank"
            aria-label="linkedin"
          >
            <FaLinkedin size={26} />
          </Styles.StyledNavLink>

          <Styles.StyledNavLink
            href="https://twitter.com/aykutsarach"
            target="_blank"
            aria-label="twitter"
          >
            <FaTwitter size={26} />
          </Styles.StyledNavLink>
        </Styles.StyledIconLinks>
      </Styles.StyledFooter>
    </Styles.StyledHome>
  );
};

export default Home;
