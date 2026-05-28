/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/50points',
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/50points',
        permanent: false,
        basePath: false,
      },
      {
        source: '/:path((?!50points|_next|favicon\\.ico).*)',
        destination: '/50points/:path',
        permanent: false,
        basePath: false,
      },
    ];
  },
};

export default nextConfig;
