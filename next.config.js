const withPWA = require("next-pwa");

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  exportPathMap: () => ({
    "/": { page: "/" },
    "/editor": { page: "/Editor", query: { title: "json" } },
    "/widget": { page: "/widget", query: { title: "json" } },
  }),
  compiler: {
    styledComponents: true,
  },
  pwa: {
    // disable: process.env.NODE_ENV === "development",
    disable: true, // disable temp until issue #61 solved
    dest: "public",
    fallbacks: {
      document: "/editor",
    },
  },
};

module.exports = withPWA(nextConfig);
