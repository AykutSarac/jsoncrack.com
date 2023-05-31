const { withSentryConfig } = require("@sentry/nextjs");

/**
 * @type {import('next').NextConfig}
 */
const config = {
  reactStrictMode: false,
  productionBrowserSourceMaps: true,
  compiler: {
    styledComponents: true,
  },
};

module.exports = withSentryConfig(
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
