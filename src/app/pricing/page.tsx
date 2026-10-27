"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Save, RefreshCw, DollarSign } from "lucide-react";

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
        <Link href="/pricing" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold bg-[#ffbd19] text-[#101827]">
          <span>💰</span> <span>Fare & Pricing</span>
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

export default function PricingPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ baseFare: 50, perKmRate: 20, commission: 0.15 });
  const [message, setMessage] = useState("");

  const { data: pricing, isLoading } = useQuery({
    queryKey: ['pricing'],
    queryFn: async () => {
      const res = await fetch('https://torq-backend.onrender.com/pricing');
      if (!res.ok) throw new Error('Failed to fetch pricing');
      return res.json();
    },
  });

  useEffect(() => {
    if (pricing) {
      setFormData({
        baseFare: pricing.baseFare,
        perKmRate: pricing.perKmRate,
        commission: pricing.commission,
      });
    }
  }, [pricing]);

  const mutation = useMutation({
    mutationFn: async (newData: any) => {
      const res = await fetch('https://torq-backend.onrender.com/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });
      if (!res.ok) throw new Error('Failed to update pricing');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing'] });
      setMessage("Pricing updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="flex h-screen bg-[#f4f7fb] font-sans text-[#10203e] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-extrabold">Fare & Pricing</h1>
            <p className="text-xs text-slate-500 mt-1">Configure how much TORQ charges for rides.</p>
          </div>
        </div>

        {message && (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6 text-sm font-bold flex items-center gap-2">
            <Save size={16} /> {message}
          </div>
        )}

        <div className="bg-white border border-[#dfe7f1] rounded-xl shadow-sm p-8 max-w-2xl">
          {isLoading ? (
            <div className="flex justify-center py-10"><RefreshCw className="animate-spin text-slate-400" /></div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Base Fare (KSh)</label>
                <p className="text-xs text-slate-500 mb-3">The starting price for every trip, before distance is added.</p>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 text-gray-400" size={16} />
                  <input 
                    type="number" 
                    value={formData.baseFare}
                    onChange={(e) => setFormData({ ...formData, baseFare: Number(e.target.value) })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffbd19] font-semibold text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Per Kilometer Rate (KSh)</label>
                <p className="text-xs text-slate-500 mb-3">How much is added to the fare for every kilometer traveled.</p>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 text-gray-400" size={16} />
                  <input 
                    type="number" 
                    value={formData.perKmRate}
                    onChange={(e) => setFormData({ ...formData, perKmRate: Number(e.target.value) })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffbd19] font-semibold text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Platform Commission (%)</label>
                <p className="text-xs text-slate-500 mb-3">The percentage TORQ keeps from each trip.</p>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.commission * 100}
                  onChange={(e) => setFormData({ ...formData, commission: Number(e.target.value) / 100 })}
                  className="w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffbd19] font-semibold text-lg"
                />
              </div>

              <div className="pt-4 border-t">
                <button 
                  type="submit" 
                  disabled={mutation.isPending}
                  className="bg-[#0b121b] text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {mutation.isPending ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                  Save Pricing Rules
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
