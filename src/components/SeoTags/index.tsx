import React from "react";
import packageJson from "package.json";

interface SeoTagsProps {
  title: string;
  description: string;
  image: string;
}

export const SeoTags: React.FC<SeoTagsProps> = ({
  description,
  title,
  image,
}) => (
  <>
    <meta name="description" content={description} />

    {/* <!-- Facebook Meta Tags --> */}
    <meta property="og:url" content={packageJson.homepage} />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />

    {/* <!-- Twitter Meta Tags --> */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta property="twitter:domain" content="jsoncrack.com" />
    <meta property="twitter:url" content={packageJson.homepage} />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
  </>
);
