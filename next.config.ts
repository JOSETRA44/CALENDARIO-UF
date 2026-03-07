import type { NextConfig } from 'next';

// For GitHub Pages: set this to your repo name (e.g. '/calendario-uf')
// Leave as '' if deploying to a custom domain or username.github.io
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const config: NextConfig = {
  output: 'export',          // Static HTML export — required for GitHub Pages
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,       // GitHub Pages needs trailing slashes
  images: {
    unoptimized: true,       // next/image optimization not available on static hosts
  },
};

export default config;
