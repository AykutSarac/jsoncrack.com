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
  assetPrefix: "js",
};

module.exports =
  process.env.ANALYZE === "true"
    ? withBundleAnalyzer(config)
    : withSentryConfig(
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
