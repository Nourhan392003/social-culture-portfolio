import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['www.arab7on.com', 'arab7on.com'], // إضافة الطريقة القديمة كدعم إضافي لـ Turbopack
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'www.arab7on.com',
      },
      {
        protocol: 'http',
        hostname: 'www.arab7on.com',
      },
      {
        protocol: 'https',
        hostname: 'arab7on.com',
      }
    ],
  },
};

export default nextConfig;
