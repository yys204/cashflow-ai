import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 1. 创建 Postgres 连接池
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

// 2. 创建适配器
// 这是 Prisma 7 唯一接受的直连方式
const adapter = new PrismaPg(pool);

// 3. 实例化 Client
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ 
  adapter 
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;