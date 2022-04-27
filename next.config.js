const withPWA = require("next-pwa");

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  exportPathMap: () => ({
    "/": { page: "/" },
    "/editor": { page: "/_offline" },
  }),
  compiler: {
    styledComponents: true,
  },
  pwa: {
    dest: "public",
    register: true,
    fallbacks: {
      document: "/editor",
    },
  },
};

module.exports = withPWA(nextConfig);
