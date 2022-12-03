const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === "development",
  scope: "/editor",
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  exportPathMap: async () => ({
    "/": { page: "/" },
    "/editor": { page: "/editor", query: { json: 'string' } },
    "/widget": { page: "/widget" },
    "/embed": { page: "/embed" },
  }),
};

module.exports = withPWA(nextConfig);
