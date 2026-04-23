import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',        // Static export → Cloudflare Pages
  images: {
    unoptimized: true,     // Required for static export
  },
  experimental: {
    // Allows Next.js font downloads to work in sandboxed/CI environments
    turbopackUseSystemTlsCerts: true,
  },
};

export default nextConfig;
