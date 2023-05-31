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
  {
    ...config,
    sentry: {
      widenClientFileUpload: true,
      disableServerWebpackPlugin: true,
    },
  },
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
