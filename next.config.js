const withTM = require("next-transpile-modules")(["reaflow", "next-pwa"]);

const nextConfig = withTM({
  reactStrictMode: true,
  exportPathMap: () => ({
    "/": { page: "/" },
    "/editor": { page: "/editor" },
  }),
  experimental: {
    esmExternals: "loose",
    outputStandalone: true,
  },
  compiler: {
    styledComponents: true,
    swcMinify: true,
  },
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
  },
});

module.exports = nextConfig;
