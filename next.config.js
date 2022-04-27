const withPWA = require("next-pwa");

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
    dest: "public",
    register: true,
  },
};

module.exports = withPWA(nextConfig);
