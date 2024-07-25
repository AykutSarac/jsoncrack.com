import React from "react";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { metaDescription } from "src/constants/landing";
import { FAQ } from "src/containers/Landing/FAQ";
import { Features } from "src/containers/Landing/Features";
import { HeroPreview } from "src/containers/Landing/HeroPreview";
import { HeroSection } from "src/containers/Landing/HeroSection";
import { LovedBy } from "src/containers/Landing/LovedBy";
import { PremiumVsFree } from "src/containers/Landing/PremiumVsFree";
import { Pricing } from "src/containers/Landing/Pricing";
import Layout from "src/layout/Layout";

export const HomePage = ({ stars }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <Layout>
      <Head>
        <title>JSON Crack | Transform your data into interactive graphs</title>
        <meta name="description" content={metaDescription} key="description" />
        <meta property="og:description" content={metaDescription} key="ogdescription" />
        <meta name="twitter:description" content={metaDescription} key="twdescription" />
        <link rel="canonical" href="https://jsoncrack.com" />
      </Head>
      <HeroSection />
      <HeroPreview />
      <Features />
      <PremiumVsFree />
      <LovedBy stars={stars} />
      <Pricing />
      <FAQ />
    </Layout>
  );
};

export default HomePage;

export const getStaticProps = (async () => {
  const res = await fetch("https://api.github.com/repos/AykutSarac/jsoncrack.com");
  const repo = await res.json();
  const stars = repo.stargazers_count;
  return { props: { stars } };
}) satisfies GetStaticProps<{
  stars: number;
}>;
