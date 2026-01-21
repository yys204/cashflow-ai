"use client";

import { logout } from "@/app/auth-actions";
import { LogOut, User } from "lucide-react";

export default function UserHeader({ email }: { email: string | null | undefined }) {
  return (
    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
      {/* 左侧：用户信息 */}
      <div className="flex items-center gap-2 text-sm text-gray-600 border-r border-gray-100 pr-3">
        <div className="bg-gray-100 p-1.5 rounded-full">
          <User className="w-4 h-4 text-gray-500" />
        </div>
        <span className="font-medium max-w-[150px] truncate">
          {email || "用户"}
        </span>
      </div>

      {/* 右侧：退出按钮 */}
      <form action={logout}>
        <button 
          type="submit"
          className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
          title="退出登录"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}