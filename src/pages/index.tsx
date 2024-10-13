import React from "react";
import type { InferGetStaticPropsType, GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { SEO } from "src/constants/seo";
import { FAQ } from "src/containers/Landing/FAQ";
import { Features } from "src/containers/Landing/Features";
import { HeroPreview } from "src/containers/Landing/HeroPreview";
import { HeroSection } from "src/containers/Landing/HeroSection";
import { LovedBy } from "src/containers/Landing/LovedBy";
import { Section1 } from "src/containers/Landing/Section1";
import { SeePremium } from "src/containers/Landing/SeePremium";
import Layout from "src/layout/Layout";

export const HomePage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <Layout>
      <NextSeo {...SEO} canonical="https://jsoncrack.com" />
      <HeroSection />
      <HeroPreview />
      <Section1 />
      <Features />
      <FAQ />
      <LovedBy stars={props.stars} />
      <SeePremium />
    </Layout>
  );
};

export default HomePage;

export const getStaticProps = (async () => {
  const res = await fetch("https://api.github.com/repos/AykutSarac/jsoncrack.com");
  const data = await res.json();

  return {
    props: {
      stars: data.stargazers_count,
    },
  };
}) satisfies GetStaticProps<{ stars: number }>;
