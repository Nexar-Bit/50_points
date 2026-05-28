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
