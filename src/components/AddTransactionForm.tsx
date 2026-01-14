"use client"; // 声明这是客户端组件，因为我们要处理用户输入

import { addTransaction } from "@/app/actions";
import { useRef } from "react";

export default function AddTransactionForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100">
      <h2 className="text-lg font-bold mb-4">记一笔</h2>
      
      {/* 
        action={addTransaction} 
        这就是魔法。表单提交直接调用刚才写的服务端函数。
        不需要 onSubmit，不需要 fetch。
      */}
      <form 
        action={async (formData) => {
          await addTransaction(formData);
          formRef.current?.reset(); // 提交成功后清空表单
        }} 
        ref={formRef}
        className="flex gap-4 items-end"
      >
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            说明
          </label>
          <input
            name="label"
            type="text"
            placeholder="例如：打车、工资"
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="w-32">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            金额 (元)
          </label>
          <input
            name="amount"
            type="number"
            placeholder="0"
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors font-medium"
        >
          添加
        </button>
      </form>
    </div>
  );
}