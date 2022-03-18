const withTM = require("next-transpile-modules")(["reaflow"]);

const nextConfig = withTM({
  exportPathMap: () => ({
    "/": { page: "/" },
    "/editor": { page: "/editor" },
  }),
  experimental: {
    esmExternals: "loose",
  },
  compiler: {
    styledComponents: true,
    swcMinify: true,
  },
});

module.exports = nextConfig;
