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

export async function getSummary() {
  const transactions = await prisma.transaction.findMany();

  // 计算总收入和总支出
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0);

  // 简单的按日期分组逻辑 (为了图表)
  // 这里我们简化处理，只取最近 5 笔数据的趋势作为演示
  // 实际项目中通常会在数据库层面做 group by
  const recentTrend = transactions
    .slice(0, 7) // 取前7条
    .reverse()   // 倒序变成正序（时间轴从左到右）
    .map(t => ({
      name: t.label.substring(0, 4), // 截取简短标签
      amount: t.amount
    }));

  return {
    income,
    expense,
    balance: income + expense,
    recentTrend
  };
}