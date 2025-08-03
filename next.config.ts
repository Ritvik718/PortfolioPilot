import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.finnhub.io',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'image.cnbcfm.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/html2canvas-proxy',
        destination: 'https://html2canvas.proxy.beeceptor.com',
      },
    ];
  },
};

export default nextConfig;
