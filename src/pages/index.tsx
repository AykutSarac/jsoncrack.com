import React from "react";
import Head from "next/head";
import { generateJsonld } from "src/constants/jsonld";
import { metaDescription } from "src/constants/landing";
import { FAQ } from "src/containers/Landing/FAQ";
import { Features } from "src/containers/Landing/Features";
import { HeroPreview } from "src/containers/Landing/HeroPreview";
import { HeroSection } from "src/containers/Landing/HeroSection";
import { PremiumVsFree } from "src/containers/Landing/PremiumVsFree";
import { Pricing } from "src/containers/Landing/Pricing";
import Layout from "src/layout/Layout";

export const HomePage = () => {
  return (
    <Layout>
      <Head>
        <title>JSON Crack | Transform your data into interactive graphs</title>
        <meta name="description" content={metaDescription} key="description" />
        <meta property="og:description" content={metaDescription} key="ogdescription" />
        <meta name="twitter:description" content={metaDescription} key="twdescription" />
        <link rel="canonical" href="https://jsoncrack.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={generateJsonld()}
          key="product-jsonld"
        />
      </Head>
      <HeroSection />
      <HeroPreview />
      <Features />
      <PremiumVsFree />
      <Pricing />
      <FAQ />
    </Layout>
  );
};

export default HomePage;
