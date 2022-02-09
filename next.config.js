const withTM = require('next-transpile-modules')(['reaflow']);

/** @type {import('next').NextConfig} */
const nextConfig = withTM({
  exportPathMap: () => ({
    '/': { page: '/' },
    '/editor': { page: '/editor' },
  }),
  trailingSlash: true,
  experimental: {
    esmExternals: 'loose'
  }
});

module.exports = nextConfig;
