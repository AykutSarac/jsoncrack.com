import React from "react";
import { FooterLinks } from "./FooterLinks";

export const Footer = () => {
  return (
    <FooterLinks
      data={[
        {
          title: "Product",
          links: [
            {
              label: "GitHub",
              link: "https://github.com/AykutSarac/jsoncrack.com",
            },
            {
              label: "Supporters",
              link: "/oss",
            },
            {
              label: "Contributing",
              link: "https://github.com/AykutSarac/jsoncrack.com/blob/main/CONTRIBUTING.md",
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
              label: "𝕏 (Twitter)",
              link: "https://twitter.com/jsoncrack",
            },
            {
              label: "LinkedIn",
              link: "https://www.linkedin.com/company/herowand",
            },
          ],
        },
        {
          title: "Legal",
          links: [
            {
              label: "Terms",
              link: "/legal/terms",
            },
            {
              label: "Privacy",
              link: "/legal/privacy",
            },
            {
              label: "Subscription & Refund",
              link: "/legal/subscription-refund",
            },
          ],
        },
      ]}
    />
  );
};
