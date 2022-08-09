const withPWA = require("next-pwa");

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  exportPathMap: () => ({
    "/": { page: "/Home" },
    "/editor": { page: "/Editor", query: { title: "json" } },
    "/widget": { page: "/Widget", query: { title: "json" } },
  }),
  pwa: {
    disable: true, // disable temp until issue #61 solved
    dest: "public",
    fallbacks: {
      document: "/editor",
    },
  },
};

module.exports = withPWA(nextConfig);
