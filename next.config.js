const isProd = process.env.NODE_ENV === "production";
const assetPrefix = isProd ? '/jsonvisio.com' : ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/jsonvisio.com',
  exportPathMap: () => ({
    '/': { page: '/' },
    '/editor': { page: '/editor' },
  }),
  assetPrefix,
  reactStrictMode: true,
  trailingSlash: true,
};

module.exports = nextConfig;
