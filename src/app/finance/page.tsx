"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { DollarSign, Percent, Wallet, Activity } from "lucide-react";

export default function FinancePage() {
  const { data: summary, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ["ledger-summary"],
    queryFn: async () => {
      const response = await api.get('/ledger/summary');
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
            <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></span>
            Last updated: {lastUpdatedTime}
          </div>
        </div>

        {isLoading ? (
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
                <div className="text-xs text-gray-400 mt-1">Total value of all trips</div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600"><Percent size={20}/></div>
                  <span className="text-sm text-gray-500 font-medium">TORQ Commission</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(summary?.totalCommission || 0)}</div>
                <div className="text-xs text-gray-400 mt-1">15% platform revenue</div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Wallet size={20}/></div>
                  <span className="text-sm text-gray-500 font-medium">Rider Payouts</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(summary?.totalRiderEarnings || 0)}</div>
                <div className="text-xs text-gray-400 mt-1">Amount owed to riders</div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Activity size={20}/></div>
                  <span className="text-sm text-gray-500 font-medium">Transactions</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{summary?.totalTransactions || 0}</div>
                <div className="text-xs text-gray-400 mt-1">Total ledger entries</div>
              </div>
            </div>

            {/* Placeholder for Chart */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-80 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 font-medium">Revenue Chart</p>
                <p className="text-sm text-gray-400 mt-2">Chart integration coming in the next phase.</p>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}