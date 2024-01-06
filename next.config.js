const million = require("million/compiler");
const { withSentryConfig } = require("@sentry/nextjs");
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

const sentryConfig = withSentryConfig(
  config,
  {
    silent: true,
    org: "aykut-sarac",
    project: "json-crack",
  },
  {
    widenClientFileUpload: true,
    hideSourceMaps: true,
    disableLogger: true,
    disableServerWebpackPlugin: true,
  }
);

module.exports = million.next(
  process.env.ANALYZE === "true" ? bundleAnalyzerConfig : sentryConfig,
  { auto: true }
);
