import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch){ return user};
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
  // 通过回调函数把 ID 透传出来
  callbacks: {
    // 1. JWT 回调：当用户登录时触发
    // user 参数只在第一次登录时存在
    async jwt({ token, user }) {
      if (user) {
        // 把数据库里的 ID 存进加密的 Token 里
        token.id = user.id;
      }
      return token;
    },
    // 2. Session 回调：当你在前端或后端调用 auth() 时触发
    async session({ session, token }) {
      if (token?.id && session.user) {
        // 把 Token 里的 ID 拿出来，赋值给 session.user.id
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});