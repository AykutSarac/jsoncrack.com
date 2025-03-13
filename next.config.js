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
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { fs: false };
    config.output.webassemblyModuleFilename = "static/wasm/[modulehash].wasm";
    config.experiments = { asyncWebAssembly: true, layers: true };

    if (!isServer) {
      config.output.environment = { ...config.output.environment, asyncFunction: true };
    }

    return config;
  },
};

const configExport = () => {
  if (process.env.ANALYZE === "true") return withBundleAnalyzer(config);

  if (process.env.GITHUB_REPOSITORY === "AykutSarac/jsoncrack.com") {
    return withSentryConfig(
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
  }

  return config;
};

module.exports = configExport();
