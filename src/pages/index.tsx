import React from "react";
import type { InferGetStaticPropsType, GetStaticProps } from "next";
import { NextSeo, SoftwareAppJsonLd } from "next-seo";
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
      <SoftwareAppJsonLd
        name="JSON Crack"
        price="0"
        priceCurrency="USD"
        type="DeveloperApplication"
        operatingSystem="All"
        keywords="json, json editor, json viewer, json formatter, json beautifier, json validator, json minifier, json compressor, json decompressor, json parser, json converter, json to yaml, json to xml, json to csv, json to tsv, json to html, json to markdown, json to base64, json to url, json to query string, json to form data, json to javascript object, json to php array, json to python dictionary, json to ruby hash, json to java object, json to c# object, json to go object, json to rust object, json to swift object, json to kotlin object, json to typescript object, json to graphql, json to sql, json to mongodb, json to yaml, yaml to json, xml to json, csv to json, tsv to json, html to json, markdown to json, base64 to json, url to json, query string to json, form data to json, javascript object to json, php array to json, python dictionary to json, ruby hash to json, java object to json, c# object to json, go object to json, rust object to json, swift object to json, kotlin object to json, typescript object to json, graphql to json, sql to json, mongodb to json, yaml to json, json to yaml, xml to json, csv to json, tsv to json, html to json, markdown to json, base64 to json, url to json, query string to json, form data to json, javascript object to json, php array to json, python dictionary to json, ruby hash to json, java object to json, c# object to json, go object to json, rust object to json, swift object to json, kotlin object to json, typescript object to json, graphql to json, sql to json, mongodb to json"
        applicationCategory="DeveloperApplication"
      />
      <HeroSection />
      <HeroPreview />
      <Section1 />
      <Features />
      <SeePremium />
      <LovedBy stars={props.stars} />
      <FAQ />
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
