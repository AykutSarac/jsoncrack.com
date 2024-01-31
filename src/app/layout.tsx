import React from "react";
import { Metadata } from "next";
import StyledComponentsRegistry from "src/lib/registry";
import CustomAppInit from "./CustomAppInit";

export const metadata: Metadata = {
  manifest: "/manifest.json",
  metadataBase: new URL("https://jsoncrack.com/"),
  icons: {
    icon: "/favicon.ico",
  },
  description:
    "Innovative and open-source visualization application that produces interactive graphs from various data formats, such as JSON, YAML, XML, CSV and more.",
  openGraph: {
    title: "JSON Crack - Visualize Data as Graphs",
    images: [
      {
        url: "https://jsoncrack.com/assets/jsoncrack.png",
      },
    ],
    type: "website",
    url: "https://jsoncrack.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Crack - Visualize Data as Graphs",
    description:
      "Innovative and open-source visualization application that produces interactive graphs from various data formats, such as JSON, YAML, XML, CSV and more.",
    images: [{ url: "https://jsoncrack.com/assets/jsoncrack.png" }],
  },
};

export const viewport = {
  themeColor: "#36393E",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <CustomAppInit>{children}</CustomAppInit>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
