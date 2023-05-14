import React from "react";
import { FooterLinks } from "./FooterLinks";

export const Footer = () => {
  return (
    <FooterLinks
      data={[
        {
          title: "Developers",
          links: [
            {
              label: "Open Source",
              link: "/oss",
            },
            {
              label: "Contributing",
              link: "https://github.com/AykutSarac/jsoncrack.com/blob/main/CONTRIBUTING.md",
            },
          ],
        },
        {
          title: "JSON Crack",
          links: [
            {
              label: "JSON Crack",
              link: "https://jsoncrack.com",
            },
            {
              label: "Terms of Service",
              link: "#",
            },
            {
              label: "Privacy Policy",
              link: "#",
            },
          ],
        },
        {
          title: "Social",
          links: [
            {
              label: "Discord",
              link: "https://discord.gg/yVyTtCRueq",
            },
            {
              label: "Twitter",
              link: "https://twitter.com/jsoncrack",
            },
            {
              label: "GitHub",
              link: "https://github.com/AykutSarach",
            },
            {
              label: "LinkedIn",
              link: "https://www.linkedin.com/company/herowand",
            },
          ],
        },
      ]}
    />
  );
};
