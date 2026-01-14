import { getTransactions } from '@/lib/data';
import { Transaction } from '@/lib/types';
import AddTransactionForm from "@/components/AddTransactionForm";
import AiInput from "@/components/AiInput";
import { deleteTransaction } from "@/app/actions"; // 引入删除动作
// 强制动态渲染
export const dynamic = 'force-dynamic';
export default async function Home() {
  // 在服务器端获取交易数据，不在浏览器端显示
  const transactions = await getTransactions();
  console.log(transactions,'111');
  
  return (
    <main className="p-8 max-w-2xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">CashFlow AI</h1>
      {/* 1. AI 输入框放在最显眼的位置 */}
      <AiInput />
      {/* 2. 传统手动输入框（保留作为备用） */}
      <details className="mb-8">
        <summary className="cursor-pointer text-gray-500 text-sm hover:text-gray-900">
          或者切换到：手动录入模式
        </summary>
        <div className="mt-4">
          <AddTransactionForm />
        </div>
      </details>
      
      <div className="space-y-4">
        {transactions.map((item) => (
          <div key={item.id} className="group flex justify-between items-center p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition">
            <div>
              <div className="font-medium text-lg">{item.label}</div>
              <div className="text-sm text-gray-500">
                {item.date.toLocaleDateString()} {item.date.toLocaleTimeString()}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`text-lg font-bold ${item.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                {item.amount > 0 ? "+" : ""}{item.amount}
              </div>
              
              {/* 2. 删除按钮：也是一个独立的 Form */}
              <form action={deleteTransaction.bind(null, item.id)}>
                <button 
                  type="submit"
                  className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="删除"
                >
                  ✕
                </button>
              </form>
            </div>
          </div>
        ))}

        {transactions.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            还没有账目，试着在上面添加一笔？
          </div>
        )}
      </div>
    </main>
  );
}