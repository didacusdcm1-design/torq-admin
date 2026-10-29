"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { Wallet, TrendingUp, CheckCircle2 } from "lucide-react";

export default function WalletsPage() {
  const { data: wallets, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ["wallets"],
    queryFn: async () => {
      const response = await api.get('/wallets/riders');
      return response.data;
    },
  });

  const lastUpdatedTime = new Date(dataUpdatedAt).toLocaleTimeString("en-KE", {
    timeZone: "Africa/Nairobi",
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
  };

  // Calculate overall platform totals
  const totalPayoutsPending = wallets?.reduce((sum: number, w: any) => sum + w.availableBalance, 0) || 0;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Wallets & Payouts</h1>
            <p className="text-sm text-gray-500">Manage rider earnings and process withdrawals.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
            <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></span>
            Last updated: {lastUpdatedTime}
          </div>
        </div>

        {/* Global KPI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><TrendingUp size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Total Outstanding Payouts</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(totalPayoutsPending)}</div>
            <div className="text-xs text-gray-400 mt-1">Total balance owed to all riders combined.</div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#FCD34D] rounded-lg text-black"><Wallet size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Active Riders</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{wallets?.length || 0}</div>
            <div className="text-xs text-gray-400 mt-1">Riders with active wallets.</div>
          </div>
        </div>

        {/* Riders Wallets Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Rider Details</th>
                <th className="p-4 font-semibold text-gray-600">Completed Trips</th>
                <th className="p-4 font-semibold text-gray-600">Total Earnings</th>
                <th className="p-4 font-semibold text-gray-600">Available Balance</th>
                <th className="p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading wallets...</td></tr>}
              {!isLoading && wallets?.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-500">No riders found.</td></tr>}
              
              {wallets?.map((wallet: any) => (
                <tr key={wallet.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{wallet.phone}</div>
                    <div className="text-sm text-gray-500">{wallet.email || 'No email'}</div>
                  </td>
                  <td className="p-4 text-gray-700">{wallet.totalTrips} trips</td>
                  <td className="p-4 text-gray-900 font-semibold">{formatCurrency(wallet.totalEarnings)}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 font-bold rounded-full text-sm">
                      {formatCurrency(wallet.availableBalance)}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      disabled={wallet.availableBalance <= 0}
                      onClick={() => alert(`Payout request of ${formatCurrency(wallet.availableBalance)} initiated for rider ${wallet.phone}.`)}
                      className="flex items-center gap-1 text-sm bg-gray-900 text-white px-3 py-1.5 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <CheckCircle2 size={14} /> Process Payout
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}