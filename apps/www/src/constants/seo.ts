import type { DefaultSeoProps } from "next-seo/pages";

export const SEO: DefaultSeoProps = {
  title: "JSON Crack | Online JSON Viewer - Transform your data into interactive graphs",
  description:
    "JSON Crack Editor is a tool for visualizing into graphs, analyzing, editing, formatting, querying, transforming and validating JSON, CSV, YAML, XML, and more.",
  themeColor: "#36393E",
  openGraph: {
    type: "website",
    images: [
      {
        url: "https://jsoncrack.com/assets/jsoncrack.png",
        width: 1200,
        height: 627,
      },
    ],
  },
  twitter: {
    handle: "@jsoncrack",
    cardType: "summary_large_image",
  },
  additionalLinkTags: [
    {
      rel: "manifest",
      href: "/manifest.json",
    },
    {
      rel: "icon",
      href: "/favicon.ico",
      sizes: "48x48",
    },
  ],
};
