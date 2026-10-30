"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { ScrollText, Activity, User, Clock } from "lucide-react";

export default function AuditLogsPage() {
  const { data: logs, isLoading } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      const response = await api.get('/audit-logs');
      return response.data;
    },
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-sm text-gray-500">Track all administrative actions for security and compliance.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#FCD34D] rounded-lg text-black"><Activity size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Total Actions Logged</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{logs?.length || 0}</div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Clock size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Latest Action</span>
            </div>
            <div className="text-lg font-bold text-gray-900 truncate">
              {logs?.[0] ? new Date(logs[0].createdAt).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' }) : 'N/A'}
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Timestamp</th>
                <th className="p-4 font-semibold text-gray-600">Actor</th>
                <th className="p-4 font-semibold text-gray-600">Action</th>
                <th className="p-4 font-semibold text-gray-600">Entity</th>
                <th className="p-4 font-semibold text-gray-600">Details</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading logs...</td></tr>}
              {!isLoading && logs?.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-500">No audit logs found.</td></tr>}
              
              {logs?.map((log: any) => (
                <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(log.createdAt).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}
                  </td>
                  <td className="p-4 font-medium text-gray-900 flex items-center gap-2">
                    <User size={14} className="text-gray-400" /> {log.actorId || 'System'}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-700">
                    {log.entity} <span className="text-gray-400 text-xs">({log.entityId || 'N/A'})</span>
                  </td>
                  <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                    {log.details || 'No additional details.'}
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