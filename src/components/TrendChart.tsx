"use client";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine
} from "recharts";

type Props = {
  data: { name: string; amount: number }[];
};

export default function TrendChart({ data }: Props) {
  if (data.length === 0) return null;

  return (
    <div className="h-[240px] w-full mt-4">
      <div className="flex justify-between items-center mb-6 px-2">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">最近 7 笔交易趋势</h3>
      </div>
      
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          {/* 定义渐变色：让柱子看起来高级 */}
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.2}/>
            </linearGradient>
          </defs>

          {/* 隐藏轴线，只留文字 */}
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 12 }} 
            dy={10}
          />
          
          {/* 0刻度线 */}
          <ReferenceLine y={0} stroke="#e5e7eb" />

          <Tooltip 
            cursor={{ fill: 'rgba(0,0,0,0.05)', radius: 8 }}
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(4px)'
            }}
          />

          <Bar dataKey="amount" radius={[6, 6, 6, 6]} barSize={40}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.amount > 0 ? "url(#colorIncome)" : "url(#colorExpense)"} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}