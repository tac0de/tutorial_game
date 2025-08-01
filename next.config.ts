import type { NextConfig } from 'next';

const repoName =
  process.env.GITHUB_REPOSITORY?.split('/')[1] || 'tutorial_game';
// 예: /your-username.github.io/your-repo/ 로 배포 중이면 'your-repo'로 교체

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export', // 완전 정적 export 모드
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
  trailingSlash: true, // GitHub Pages에서 index.html 없는 404 회피에 도움
  images: {
    unoptimized: true, // next/image 사용 시 정적 export에서는 최적화 비활성화
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  webpack: (config, { dev }) => {
    if (dev) {
      // dev에서 HMR을 끄려는 기존 의도 유지
      config.watchOptions = {
        ignored: ['**/*'],
      };
    }
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
