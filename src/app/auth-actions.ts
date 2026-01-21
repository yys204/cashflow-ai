"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn,signOut  } from "@/auth";
import { AuthError } from "next-auth";

// 🚨 修改点：必须接收 prevState 作为第一个参数，哪怕你不用它
export async function register(prevState: string | undefined, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return "请填写完整";

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return "邮箱已被注册";

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  try {
    await signIn("credentials", { email, password, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      return "注册成功但登录失败";
    }
    throw error;
  }
}

// 🚨 修改点：同上，加上 prevState
export async function login(prevState: string | undefined, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", { email, password, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "邮箱或密码错误";
        default:
          return "登录失败";
      }
    }
    throw error;
  }
}

export async function logout() {
  // 退出后重定向回登录页
  await signOut({ redirectTo: "/login" });
}