"use client";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { Server, Database, Activity, CheckCircle2, XCircle } from "lucide-react";

export default function SystemHealthPage() {
  const { data: health, isLoading } = useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const response = await api.get('/system/health');
      return response.data;
    },
    refetchInterval: 10000,
  });

  const StatusBadge = ({ status }: { status: string }) => (
    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${status === 'UP' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
      {status === 'UP' ? <CheckCircle2 size={14}/> : <XCircle size={14}/>} {status}
    </span>
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">System Health</h1>
        {isLoading ? <div className="p-10 text-center text-gray-500">Checking system status...</div> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4"><Server size={24} className="text-blue-500"/> <h2 className="font-bold text-gray-700">Backend API</h2></div>
              <StatusBadge status={health?.api || 'DOWN'} />
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4"><Database size={24} className="text-purple-500"/> <h2 className="font-bold text-gray-700">Database</h2></div>
              <StatusBadge status={health?.database || 'DOWN'} />
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4"><Activity size={24} className="text-[#FCD34D]"/> <h2 className="font-bold text-gray-700">Last Checked</h2></div>
              <p className="text-sm text-gray-500">{health?.timestamp ? new Date(health.timestamp).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' }) : 'N/A'}</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}