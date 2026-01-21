FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm
# 1. deps
FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
pnpm config set registry https://registry.npmmirror.com \
 && pnpm install --frozen-lockfile

# 2. builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

RUN pnpm prisma generate
RUN pnpm build

# 3. runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
