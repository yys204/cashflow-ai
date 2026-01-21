"use server"; // 👈 这一行是灵魂，声明这是服务端代码

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
// 这个函数虽然写在前端文件旁，但它只在服务器运行
export async function addTransaction(formData: FormData) {
  const session = await auth();
  console.log(session,'session');
  if (!session?.user?.id) return; // 没登录不许写
  // 1. 从表单数据中提取值
  const label = formData.get("label") as string;
  const amountRaw = formData.get("amount") as string;
  
  // 简单的校验
  if (!label || !amountRaw) {
    return;
  }

  // 2. 直接调用数据库 (无需 fetch)
  try {
    await prisma.transaction.create({
      data: {
        label,
        amount: Number(amountRaw), // 转成数字
        userId: session.user.id, // 🚨 写入时必须打上用户标签
      },
    });

    // 3. 关键一步：告诉 Next.js "首页的数据变了，请刷新"
    // 这样页面会自动重新渲染列表，不需要你手动操作 DOM
    revalidatePath("/");
    
  } catch (e) {
    console.error("写入失败:", e);
    // 实际项目中这里会返回错误信息给前端
  }
}

// 删除功能顺手也写了
export async function deleteTransaction(id: any) {
  const session = await auth();
  if (!session?.user?.id) return; // 没登录不许写
  await prisma.transaction.delete({
    where: { id,userId: session.user.id },
  });
  revalidatePath("/"); // 刷新页面
}