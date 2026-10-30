"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { Gift, Plus, Tag, Percent, DollarSign } from "lucide-react";

export default function PromotionsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("FIXED");
  const [discountValue, setDiscountValue] = useState("");
  const [usageLimit, setUsageLimit] = useState("");

  const { data: promos, isLoading } = useQuery({
    queryKey: ["promotions"],
    queryFn: async () => {
      const response = await api.get('/promotions');
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newPromo: any) => {
      return await api.post('/promotions', newPromo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      setIsModalOpen(false);
      setCode(""); setDiscountValue(""); setUsageLimit("");
    }
  });

  const toggleMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.patch(`/promotions/${id}/toggle`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    }
  });

  const activePromos = promos?.filter((p: any) => p.isActive).length || 0;
  const totalUses = promos?.reduce((sum: number, p: any) => sum + p.timesUsed, 0) || 0;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Promotions</h1>
            <p className="text-sm text-gray-500">Manage promo codes and discounts.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#FCD34D] text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
          >
            <Plus size={18} /> Create Promo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#FCD34D] rounded-lg text-black"><Gift size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Total Promos</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{promos?.length || 0}</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg text-green-600"><Tag size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Active Promos</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{activePromos}</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Percent size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Total Uses</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">{totalUses}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Code</th>
                <th className="p-4 font-semibold text-gray-600">Discount</th>
                <th className="p-4 font-semibold text-gray-600">Usage</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading promotions...</td></tr>}
              {!isLoading && promos?.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-500">No promo codes found.</td></tr>}
              
              {promos?.map((promo: any) => (
                <tr key={promo.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-900 font-mono tracking-wider">{promo.code}</td>
                  <td className="p-4 text-gray-700">
                    {promo.discountType === 'FIXED' ? `KES ${promo.discountValue}` : `${promo.discountValue}% Off`}
                  </td>
                  <td className="p-4 text-gray-700">{promo.timesUsed} {promo.usageLimit ? `/ ${promo.usageLimit}` : ''}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      promo.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {promo.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => toggleMutation.mutate(promo.id)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        promo.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {promo.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Create New Promo</h2>
              <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate({ code, discountType, discountValue, usageLimit }); }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Promo Code</label>
                    <input type="text" required placeholder="e.g., TORQ50" value={code} onChange={(e) => setCode(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-black font-mono uppercase focus:ring-[#FCD34D] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                    <select value={discountType} onChange={(e) => setDiscountType(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-[#FCD34D] outline-none">
                      <option value="FIXED">Fixed Amount (KES)</option>
                      <option value="PERCENTAGE">Percentage (%)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                    <input type="number" step="0.01" required placeholder="e.g., 50" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-[#FCD34D] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit (Optional)</label>
                    <input type="number" placeholder="e.g., 100" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-[#FCD34D] outline-none" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
                  <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 bg-[#FCD34D] text-black font-semibold rounded-md hover:bg-yellow-400 disabled:opacity-50">
                    {createMutation.isPending ? "Creating..." : "Create Promo"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}