import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. 开启独立部署模式 (Docker 必需)
  output: "standalone",

  // 2. 忽略 ESLint 检查
  // 这里的注释会让 TypeScript 忽略下一行的类型报错，强制生效
  // @ts-expect-error Next.js 16 type definition might be strict
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 3. 忽略 TypeScript 类型检查
  // @ts-expect-error Next.js 16 type definition might be strict
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;