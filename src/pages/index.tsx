import React from "react";
import type { InferGetStaticPropsType, GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { SEO } from "../constants/seo";
import { FAQ } from "../layout/Landing/FAQ";
import { Features } from "../layout/Landing/Features";
import { HeroPreview } from "../layout/Landing/HeroPreview";
import { HeroSection } from "../layout/Landing/HeroSection";
import { Section1 } from "../layout/Landing/Section1";
import { Section2 } from "../layout/Landing/Section2";
import { Section3 } from "../layout/Landing/Section3";
import Layout from "../layout/PageLayout";

export const HomePage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <Layout>
      <NextSeo {...SEO} canonical="https://jsoncrack.com" />
      <HeroSection stars={props.stars} />
      <HeroPreview />
      <Section1 />
      <Section2 />
      <Section3 />
      <Features />
      <FAQ />
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
