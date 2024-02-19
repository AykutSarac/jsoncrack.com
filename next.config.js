const million = require("million/compiler");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/**
 * @type {import('next').NextConfig}
 */
const config = {
  output: "export",
  reactStrictMode: false,
  productionBrowserSourceMaps: true,
  compiler: {
    styledComponents: true,
  },
  webpack: config => {
    config.resolve.fallback = { fs: false };
    config.output.webassemblyModuleFilename = "static/wasm/[modulehash].wasm";
    config.experiments = { asyncWebAssembly: true };

    return config;
  },
};

const bundleAnalyzerConfig = withBundleAnalyzer(config);

module.exports = million.next(bundleAnalyzerConfig, { auto: true });
