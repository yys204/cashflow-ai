import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login", //如果不登录，跳转到哪里
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname === "/"; // 首页是受保护的

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // 重定向到登录页
      } else if (isLoggedIn) {
        // 如果已登录但在登录页，转去首页
        return Response.redirect(new URL("/", nextUrl));
      }
      return true;
    },
  },
  providers: [], // 暂时留空
} satisfies NextAuthConfig;