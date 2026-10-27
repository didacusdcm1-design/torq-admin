"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { RefreshCw, DollarSign, ArrowUpRight } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-[238px] bg-[#0b121b] text-[#e8eef8] flex flex-col z-20 shrink-0 h-screen">
      <div className="flex items-center gap-2 px-4 py-5 border-b border-slate-700">
        <b className="text-4xl italic text-[#ffbd19]">ϟ</b>
        <div>
          <div className="text-2xl font-extrabold text-white leading-none">TORQ</div>
          <div className="text-[9px] tracking-widest mt-1">RIDE • DELIVER • CONNECT</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto mt-2 px-2 space-y-1 pb-4">
        <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#d6deea] hover:bg-[#202b39]">
          <span>⌂</span> <span>Dashboard</span>
        </Link>
        <Link href="/trips" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#d6deea] hover:bg-[#202b39]">
          <span>🚕</span> <span>Trip Management</span>
        </Link>
        <Link href="/map" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#d6deea] hover:bg-[#202b39]">
          <span>🗺️</span> <span>Live Map</span>
        </Link>
        <Link href="/pricing" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#d6deea] hover:bg-[#202b39]">
          <span>💰</span> <span>Fare & Pricing</span>
        </Link>
        <Link href="/finance" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold bg-[#ffbd19] text-[#101827]">
          <span>💳</span> <span>Wallets & Payouts</span>
        </Link>
        <Link href="/customers" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#d6deea] hover:bg-[#202b39]">
          <span>♙</span> <span>Customers</span>
        </Link>
        <Link href="/riders" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#d6deea] hover:bg-[#202b39]">
          <span>♟</span> <span>Riders</span>
        </Link>
      </nav>
      <div className="p-4 border-t border-slate-700 text-xs text-slate-400">
        🟢 System Operational<br/><br/>TORQ Admin • Live Data
      </div>
    </aside>
  );
};

export default function FinancePage() {
  const queryClient = useQueryClient();

  const { data: wallets, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ['wallets'],
    queryFn: async () => {
      const res = await fetch('https://torq-backend.onrender.com/admin/wallets');
      if (!res.ok) throw new Error('Failed to fetch wallets');
      return res.json();
    },
  });

  const payoutMutation = useMutation({
    mutationFn: async ({ id, amount }: { id: string, amount: number }) => {
      const res = await fetch(`https://torq-backend.onrender.com/admin/wallets/${id}/payout`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      if (!res.ok) throw new Error('Payout failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
    },
  });

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : 'Loading...';

  return (
    <div className="flex h-screen bg-[#f4f7fb] font-sans text-[#10203e] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-extrabold">Wallets & Payouts</h1>
            <p className="text-xs text-slate-500 mt-1">Manage rider earnings and process payouts.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs bg-white border rounded-lg px-3 py-2 shadow-sm flex items-center gap-2">
              <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
              Last updated: {lastUpdated}
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#dfe7f1] rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-[#f7f9fc] text-[#51627d] text-[10px] uppercase border-b border-[#edf1f6]">
                <th className="p-4 font-bold">Rider Email</th>
                <th className="p-4 font-bold">Available Balance</th>
                <th className="p-4 font-bold">Pending Earnings</th>
                <th className="p-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-500">Loading wallets...</td></tr>
              ) : wallets?.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-500">No wallets found.</td></tr>
              ) : (
                wallets?.map((wallet: any) => (
                  <tr key={wallet.id} className="border-t border-[#edf1f6] text-xs hover:bg-gray-50">
                    <td className="p-4 font-semibold">{wallet.user?.email || 'N/A'}</td>
                    <td className="p-4 font-bold text-green-600">KSh {wallet.balance.toFixed(2)}</td>
                    <td className="p-4 text-slate-500">KSh {wallet.pendingEarnings.toFixed(2)}</td>
                    <td className="p-4">
                      <button 
                        onClick={() => payoutMutation.mutate({ id: wallet.id, amount: wallet.balance })}
                        disabled={wallet.balance <= 0 || payoutMutation.isPending}
                        className="bg-[#0b121b] text-white px-3 py-1 rounded flex items-center gap-1 text-[10px] font-bold hover:bg-gray-800 disabled:opacity-50"
                      >
                        <ArrowUpRight size={12} /> Payout
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
