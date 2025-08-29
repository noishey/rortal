/** @type {import('next').NextConfig} */ // TypeScript type annotation for config
const nextConfig = {
  reactStrictMode: true, // Enable React strict mode for better debugging
  webpack: (config) => { // Custom webpack configuration
    config.resolve.fallback = { // Polyfill configuration for browser compatibility
      ...config.resolve.fallback, // Spread existing fallbacks
      fs: false, // Disable filesystem module in browser
      net: false, // Disable network module in browser
      tls: false, // Disable TLS module in browser
      crypto: false, // Disable crypto module (use Web Crypto API instead)
    };
    return config; // Return modified webpack config
  },
  images: { // Next.js Image component configuration
    remotePatterns: [ // Allow images from external domains
      {
        protocol: 'https', // Only allow HTTPS images
        hostname: 'a223539ccf6caa2d76459c9727d276e6.r2.cloudflarestorage.com', // Cloudflare R2 storage domain
        port: '', // No specific port required
        pathname: '/stable-horde/**', // Allow all paths under stable-horde
      },
    ],
  },
};

export default nextConfig; // Export configuration for Next.js