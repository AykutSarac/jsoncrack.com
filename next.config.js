const withPWA = require("next-pwa");

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  exportPathMap: () => ({
    "/": { page: "/" },
    "/editor": { page: "/Editor" },
    "/widget": { page: "/Widget" },
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
