/** @type {import('next').NextConfig} */
const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_BACKEND_URL ||
  'http://localhost:8000';

 const nextConfig = {
  env: {
    // Expose backend URL to the browser bundle (Vercel: set API_BACKEND_URL only).
    NEXT_PUBLIC_API_URL: apiUrl,
    API_BACKEND_URL: process.env.API_BACKEND_URL || '',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const base = (process.env.API_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(
      /\/$/,
      ''
    );
    return [
      {
        source: '/backend-api/:path*',
        destination: `${base}/api/:path*`,
      },
    ];
  },
  webpack: (config, { dev }) => {
    // Windows can lock .next/webpack pack files (EBUSY), corrupting the cache and
    // causing prerender errors like "e[o] is not a function" on the next build.
    if (process.platform === 'win32') {
      config.cache = false;
    }
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/.next/**',
          '**/System Volume Information/**',
        ],
      };
    }
    return config;
  },
  async redirects() {
    return [
      {
        source: '/50points',
        destination: '/',
        permanent: false,
      },
      {
        source: '/50points/:path*',
        destination: '/:path*',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
