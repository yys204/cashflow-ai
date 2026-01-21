"use client";

// 🚨 1. 关键修改：从 "react" 导入 useActionState
import { useActionState, useState } from "react"; 
import { login, register } from "@/app/auth-actions";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  
  // 🚨 2. 关键修改：使用 useActionState
  // 它现在的返回值多了一个 isPending (第三个参数)，非常方便用来做 Loading 状态
  const [errorMessage, dispatch, isPending] = useActionState(
    async (prevState: string | undefined, formData: FormData) => {
      // 这里的逻辑不用变
      if (isLogin) return await login(prevState, formData);
      return await register(prevState, formData);
    },
    undefined // 初始状态
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "登录 CashFlow" : "注册新账户"}
        </h1>
        
        <form action={dispatch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">邮箱</label>
            <input name="email" type="email" required className="mt-1 w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">密码</label>
            <input name="password" type="password" required className="mt-1 w-full border rounded px-3 py-2" />
          </div>
          
          {errorMessage && (
            <div className="text-red-500 text-sm text-center">{errorMessage}</div>
          )}

          {/* 🚨 3. 利用 isPending 做按钮禁用 */}
          <button 
            disabled={isPending}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "处理中..." : (isLogin ? "登录" : "注册")}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button 
            type="button" // 记得加 type="button"，防止触发表单提交
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-500 hover:text-black underline"
          >
            {isLogin ? "没有账号？去注册" : "已有账号？去登录"}
          </button>
        </div>
      </div>
    </div>
  );
}