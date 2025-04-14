/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig; 