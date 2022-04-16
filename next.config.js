const withTM = require("next-transpile-modules")(["reaflow"]);

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
    removeConsole: {
      exclude: ["error"],
    },
  },
});

module.exports = nextConfig;
