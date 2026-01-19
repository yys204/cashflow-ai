FROM node:20-alpine AS base

# 1. 依赖安装阶段
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
# 安装 pnpm 并安装依赖
RUN npm install -g pnpm && pnpm i --frozen-lockfile

# 2. 构建阶段
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# 生成 Prisma Client
RUN npx prisma generate
# 构建 Next.js 应用
RUN npm install -g pnpm && pnpm run build

# 3. 运行阶段 (生产环境)
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

# 创建非 root 用户提高安全性
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建产物
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# 复制 prisma 目录用于迁移
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000
ENV PORT 3000

# 启动命令
CMD ["node", "server.js"]