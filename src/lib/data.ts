import { prisma } from "@/lib/prisma";

export async function getTransactions() {
  // 1. 使用 prisma 查询数据库
  // findMany = 查找多条
  // orderBy = 排序
  // 2. 返回查询结果
  const transactions = await prisma.transaction.findMany({
    orderBy: {
      date: 'desc' // 按日期倒序
    }
  });

  return transactions;
}