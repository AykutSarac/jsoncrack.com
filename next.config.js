// const withPWA = require("next-pwa");

// const pwaConfig = {
//   pwa: {
//     disable: true, // disable temp until issue #61 solved
//     dest: "public",
//     fallbacks: {
//       document: "/editor",
//     },
//   },
// };

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  exportPathMap: async () => ({
    "/": { page: "/" },
    "/editor": { page: "/Editor" },
    "/widget": { page: "/Widget" },
  }),
  //...pwaConfig,
};

module.exports = nextConfig;
