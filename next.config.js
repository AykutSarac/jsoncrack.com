const withPWA = require("next-pwa");

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  exportPathMap: () => ({
    "/": { page: "/" },
    "/editor": { page: "/editor" },
  }),
  compiler: {
    styledComponents: true,
  },
  experimental: {
    esmExternals: "loose",
    outputStandalone: true,
  },
  pwa: {
    disable: true,
    dest: "public",
    register: true,
    scope: "/editor",
  },
};

module.exports = withPWA(nextConfig);
