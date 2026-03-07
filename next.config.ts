import type { NextConfig } from 'next';

// For GitHub Pages: set this to your repo name (e.g. '/calendario-uf')
// Leave as '' if deploying to a custom domain or username.github.io
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

// Enable static export only when explicitly building for GitHub Pages
const forGitHubPages = process.env.GITHUB_PAGES === 'true';

const config: NextConfig = {
  output: forGitHubPages ? 'export' : undefined,
  ...(forGitHubPages && {
    basePath,
    assetPrefix: basePath,
    trailingSlash: true,
  }),
  images: {
    unoptimized: forGitHubPages,
  },
};

export default config;
