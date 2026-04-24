import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',        // Static export → Cloudflare Pages
  images: {
    unoptimized: true,     // Required for static export
  },
  experimental: {
    turbopackUseSystemTlsCerts: true,  // Fix TLS for Google Fonts in CI/sandbox
  },
};

export default nextConfig;
