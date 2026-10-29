"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { DollarSign, Percent, Wallet, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function FinancePage() {
  const { data: summary, isLoading: summaryLoading, dataUpdatedAt } = useQuery({
    queryKey: ["ledger-summary"],
    queryFn: async () => {
      const response = await api.get('/ledger/summary');
      return response.data;
    },
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ["ledger-chart"],
    queryFn: async () => {
      const response = await api.get('/ledger/chart-data');
      return response.data;
    },
  });

  const lastUpdatedTime = new Date(dataUpdatedAt).toLocaleTimeString("en-KE", {
    timeZone: "Africa/Nairobi",
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Revenue & Finance</h1>
            <p className="text-sm text-gray-500">Track TORQ's gross volume, commission, and rider payouts.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
            <span className={`w-2 h-2 rounded-full ${summaryLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></span>
            Last updated: {lastUpdatedTime}
          </div>
        </div>

        {summaryLoading ? (
          <div className="p-10 text-center text-gray-500">Loading financial data...</div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#FCD34D] rounded-lg text-black"><DollarSign size={20}/></div>
                  <span className="text-sm text-gray-500 font-medium">Gross Volume</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(summary?.grossVolume || 0)}</div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600"><Percent size={20}/></div>
                  <span className="text-sm text-gray-500 font-medium">TORQ Commission</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(summary?.totalCommission || 0)}</div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Wallet size={20}/></div>
                  <span className="text-sm text-gray-500 font-medium">Rider Payouts</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(summary?.totalRiderEarnings || 0)}</div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Activity size={20}/></div>
                  <span className="text-sm text-gray-500 font-medium">Transactions</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{summary?.totalTransactions || 0}</div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-6">Revenue Trend</h2>
              <div className="h-80 w-full">
                {chartLoading ? (
                  <div className="flex items-center justify-center h-full text-gray-500">Loading chart...</div>
                ) : chartData && chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FCD34D" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#FCD34D" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(value) => `Ksh ${value}`} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [`Ksh ${value.toFixed(2)}`, undefined]}
                      />
                      <Area type="monotone" dataKey="revenue" name="Gross Revenue" stroke="#FCD34D" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                      <Area type="monotone" dataKey="commission" name="TORQ Commission" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCommission)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">No financial data available yet.</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}