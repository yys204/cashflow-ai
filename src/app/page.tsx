import { getTransactions } from '@/lib/data';
import { Transaction } from '@/lib/types';


export default async function Home() {
  // 在服务器端获取交易数据，不在浏览器端显示
  const transactions = await getTransactions();
  console.log(transactions,'111');
  
  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">CashFlow AI</h1>
      
      <div className="space-y-4">
        {transactions.map((item: Transaction) => (
          
          <div key={item.id} className="flex justify-between p-4 border rounded shadow-sm">
            <div>
              <div className="font-medium">{item.label}</div>
              <div className="text-sm text-gray-500">{item.date.toLocaleDateString()}</div>
            </div>
            <div className={item.amount > 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
              {item.amount}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}