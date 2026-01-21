import { getTransactions, getSummary } from "@/lib/data";
import AddTransactionForm from "@/components/AddTransactionForm";
import AiInput from "@/components/AiInput";
import TrendChart from "@/components/TrendChart";
import { deleteTransaction } from "@/app/actions";
import { Wallet, TrendingUp, TrendingDown, History, Plus } from "lucide-react"; // 引入图标
import { auth } from "@/auth"; // 👈 引入 auth
import UserHeader from "@/components/UserHeader"; // 👈 引入新组件
export const dynamic = 'force-dynamic';

export default async function Home() {
  const session = await auth(); // 👈 获取当前登录用户信息
  const [transactions, summary] = await Promise.all([
    getTransactions(),
    getSummary()
  ]);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* 标题区 */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">CashFlow AI</h1>
            <p className="text-gray-500 mt-1">你的 2026 智能财务助手</p>
          </div>
          <UserHeader email={session?.user?.email} />
        </header>

        {/* 1. 资产概览卡片 (Bento Grid 风格) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 净资产 - 黑色高亮 */}
          <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-gray-400 text-sm font-medium mb-1">净资产</p>
              <h2 className="text-3xl font-bold font-mono tracking-tight">
                ¥{summary.balance.toLocaleString()}
              </h2>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
              <Wallet className="w-32 h-32 text-white" />
            </div>
          </div>

          {/* 收入 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-gray-500 text-sm font-medium">总收入</p>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 font-mono">
              +¥{summary.income.toLocaleString()}
            </h2>
          </div>

          {/* 支出 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="w-4 h-4 text-red-600" />
              </div>
              <p className="text-gray-500 text-sm font-medium">总支出</p>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 font-mono">
              ¥{summary.expense.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* 2. AI 输入框 */}
        <section className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-white rounded-2xl p-1 shadow-sm">
            <AiInput />
          </div>
        </section>

        {/* 3. 图表区 */}
        {transactions.length > 0 && (
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <TrendChart data={summary.recentTrend} />
          </section>
        )}

        {/* 4. 交易列表 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <History className="w-5 h-5" />
              最近交易
            </h3>
            {/* 这里的详情折叠保留，作为手动入口 */}
            <details className="relative">
              <summary className="list-none cursor-pointer p-2 hover:bg-gray-100 rounded-full transition text-gray-500">
                <Plus className="w-5 h-5" />
              </summary>
              <div className="absolute right-0 top-10 w-80 bg-white p-4 shadow-xl rounded-xl border border-gray-100 z-50">
                <AddTransactionForm />
              </div>
            </details>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {transactions.map((item, index) => (
              <div 
                key={item.id} 
                className={`flex justify-between items-center p-5 hover:bg-gray-50 transition-colors ${
                  index !== transactions.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {item.amount > 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{item.label}</div>
                    <div className="text-xs text-gray-400 font-mono mt-0.5">
                      {new Date(item.date).toLocaleString('zh-CN', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
                
                <div className={`text-lg font-bold font-mono ${item.amount > 0 ? "text-green-600" : "text-gray-900"}`}>
                  {item.amount > 0 ? "+" : ""}{item.amount}
                </div>
                
                {/* 删除按钮 (仅hover显示) */}
                <form action={deleteTransaction.bind(null, item.id)} className="ml-4">
                  <button className="text-gray-300 hover:text-red-500 transition-colors p-2">✕</button>
                </form>
              </div>
            ))}

            {transactions.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <div className="mb-2">👻</div>
                暂无数据，让 AI 帮你记一笔吧
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}