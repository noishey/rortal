/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'a223539ccf6caa2d76459c9727d276e6.r2.cloudflarestorage.com',
        port: '',
        pathname: '/stable-horde/**',
      },
    ],
  },
};

export default nextConfig; 