/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export (GitHub Pages, 4everland, IPFS)
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // GitHub Pages için basePath (repo adı)
  // Kendi domain kullanırsan kaldır
  basePath: process.env.NODE_ENV === 'production' && process.env.GITHUB_PAGES === 'true' 
    ? '/vynryx' 
    : '',
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
}

module.exports = nextConfig
