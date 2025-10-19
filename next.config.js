/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export (GitHub Pages, 4everland, IPFS)
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // GitHub Pages için basePath
  basePath: '/vynryx',
  assetPrefix: '/vynryx/',
  webpack: (config, { isServer }) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    
    // OrbitDB + IPFS için Node.js polyfills
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
      };
    }
    
    return config;
  },
}

module.exports = nextConfig
