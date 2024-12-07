import React from "react";
import type { InferGetStaticPropsType, GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { SEO } from "src/constants/seo";
import { FAQ } from "src/layout/Landing/FAQ";
import { Features } from "src/layout/Landing/Features";
import { HeroPreview } from "src/layout/Landing/HeroPreview";
import { HeroSection } from "src/layout/Landing/HeroSection";
import { LovedBy } from "src/layout/Landing/LovedBy";
import { Section1 } from "src/layout/Landing/Section1";
import { SeePremium } from "src/layout/Landing/SeePremium";
import Layout from "src/layout/PageLayout";

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
  try {
    const res = await fetch("https://api.github.com/repos/AykutSarac/jsoncrack.com");
    const data = await res.json();

    return {
      props: {
        stars: data?.stargazers_count || 0,
      },
    };
  } catch (error) {
    return {
      props: {
        stars: 0,
      },
    };
  }
}) satisfies GetStaticProps<{ stars: number }>;
