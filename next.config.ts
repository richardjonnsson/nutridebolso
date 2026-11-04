import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['192.168.1.12', '192.168.1.12:3000', 'localhost:3000'],
};

export default nextConfig;
