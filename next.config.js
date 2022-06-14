const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  exportPathMap: () => ({
    "/": { page: "/" },
    "/editor": { page: "/editor" },
  }),
  compiler: {
    styledComponents: true,
  },
  pwa: {
    disable: process.env.NODE_ENV === "development",
    runtimeCaching,
    dest: "public",
    register: true,
    fallbacks: {
      document: "/editor",
    },
  },
};

module.exports = withPWA(nextConfig);
