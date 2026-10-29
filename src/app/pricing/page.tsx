"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { Save, AlertCircle, Calculator } from "lucide-react";

export default function PricingPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    baseFare: 50,
    perKmRate: 30,
    perMinuteRate: 5,
    commissionRate: 0.15
  });
  const [message, setMessage] = useState("");

  const { data: pricing, isLoading } = useQuery({
    queryKey: ["pricing"],
    queryFn: async () => {
      const response = await api.get('/pricing');
      return response.data;
    },
  });

  useEffect(() => {
    if (pricing) {
      setFormData({
        baseFare: pricing.baseFare,
        perKmRate: pricing.perKmRate,
        perMinuteRate: pricing.perMinuteRate,
        commissionRate: pricing.commissionRate
      });
    }
  }, [pricing]);

  const updateMutation = useMutation({
    mutationFn: async (newData: any) => {
      return await api.patch('/pricing', newData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing"] });
      setMessage("✅ Pricing updated successfully! Changes will apply to new trips.");
      setTimeout(() => setMessage(""), 5000);
    },
    onError: (error: any) => {
      setMessage("❌ Failed to update pricing. Ensure the backend is running.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  if (isLoading) return <DashboardLayout><div className="p-10 text-center">Loading pricing...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Pricing & Fares</h1>
          <p className="text-sm text-gray-500">Configure TORQ's global fare calculator rules.</p>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-6 flex items-center gap-2 ${message.includes("✅") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            <AlertCircle size={18} />
            <span className="font-medium">{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Base Fare (KES)</label>
              <input 
                type="number" step="1" name="baseFare" value={formData.baseFare} onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#FCD34D] outline-none" 
              />
              <p className="text-xs text-gray-400 mt-1">Flat fee for every trip.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Per KM Rate (KES)</label>
              <input 
                type="number" step="1" name="perKmRate" value={formData.perKmRate} onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#FCD34D] outline-none" 
              />
              <p className="text-xs text-gray-400 mt-1">Charge per kilometer.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Per Minute Rate (KES)</label>
              <input 
                type="number" step="1" name="perMinuteRate" value={formData.perMinuteRate} onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#FCD34D] outline-none" 
              />
              <p className="text-xs text-gray-400 mt-1">Charge per minute of travel.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">TORQ Commission (%)</label>
              <input 
                type="number" step="0.01" name="commissionRate" value={formData.commissionRate} onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#FCD34D] outline-none" 
              />
              <p className="text-xs text-gray-400 mt-1">e.g., 0.15 for 15%.</p>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button 
              type="submit" 
              disabled={updateMutation.isPending}
              className="flex items-center gap-2 bg-[#FCD34D] text-black font-semibold px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              <Save size={18} />
              {updateMutation.isPending ? "Saving..." : "Save Pricing Rules"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}