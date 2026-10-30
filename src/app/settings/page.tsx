"use client";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { Save, AlertCircle, Settings } from "lucide-react";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ companyName: "", supportEmail: "", supportPhone: "", currency: "", timezone: "" });
  const [message, setMessage] = useState("");

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await api.get('/settings')).data,
  });

  useEffect(() => {
    if (settings) setFormData(settings);
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (newData: any) => await api.patch('/settings', newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      setMessage("✅ Settings saved successfully!");
      setTimeout(() => setMessage(""), 5000);
    },
    onError: () => setMessage("❌ Failed to save settings."),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  if (isLoading) return <DashboardLayout><div className="p-10 text-center text-gray-500">Loading settings...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Global Settings</h1><p className="text-sm text-gray-500">Configure company information and system defaults.</p></div>
        
        {message && (
          <div className={`p-4 rounded-lg mb-6 flex items-center gap-2 ${message.includes("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            <AlertCircle size={18} /><span className="font-medium">{message}</span>
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); updateMutation.mutate(formData); }} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#FCD34D] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <input type="text" name="currency" value={formData.currency} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#FCD34D] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
              <input type="email" name="supportEmail" value={formData.supportEmail} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#FCD34D] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Support Phone</label>
              <input type="text" name="supportPhone" value={formData.supportPhone} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#FCD34D] outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <input type="text" name="timezone" value={formData.timezone} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#FCD34D] outline-none" />
            </div>
          </div>
          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button type="submit" disabled={updateMutation.isPending} className="flex items-center gap-2 bg-[#FCD34D] text-black font-semibold px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50">
              <Save size={18} /> {updateMutation.isPending ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}