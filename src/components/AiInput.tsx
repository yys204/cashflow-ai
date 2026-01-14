"use client";

import { createTransactionFromText } from "@/app/ai-actions";
import { useState, useTransition } from "react";

export default function AiInput() {
  const [input, setInput] = useState("");
  // useTransition 是 React 处理异步加载状态的标准方式
  const [isPending, startTransition] = useTransition();

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    startTransition(async () => {
      // 调用服务端 AI 动作
      const result = await createTransactionFromText(input);
      if (result.success) {
        setInput(""); // 清空输入框
        // 可以在这里加个 toast 提示，但今天先从简
      } else {
        alert(result.message);
      }
    });
  };

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-100">
        <h2 className="text-lg font-bold mb-2 text-purple-900">✨ AI 智能记账</h2>
        <p className="text-sm text-purple-600 mb-4">
          试试输入： ”今天买咖啡花了35元“ 或 ”发工资了20000元“
        </p>

        <form onSubmit={handleAiSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="告诉 AI 你花了什么钱..."
            className="flex-1 border border-purple-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
            disabled={isPending}
          />
          <button
            type="submit"
            disabled={isPending}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isPending ? "分析中..." : "发送"}
          </button>
        </form>
      </div>
    </div>
  );
}