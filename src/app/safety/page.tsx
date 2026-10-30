"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { ShieldAlert, AlertTriangle, ShieldCheck } from "lucide-react";

export default function SafetyPage() {
  const queryClient = useQueryClient();

  const { data: incidents, isLoading } = useQuery({
    queryKey: ["safety-incidents"],
    queryFn: async () => {
      const response = await api.get('/safety');
      return response.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      return await api.patch(`/safety/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["safety-incidents"] });
    }
  });

  const criticalCount = incidents?.filter((i: any) => i.severity === 'CRITICAL' && i.status !== 'RESOLVED').length || 0;
  const openCount = incidents?.filter((i: any) => i.status === 'OPEN').length || 0;
  const resolvedCount = incidents?.filter((i: any) => i.status === 'RESOLVED').length || 0;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Safety & Incidents</h1>
          <p className="text-sm text-gray-500">Emergency SOS alerts and safety reports.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm bg-red-50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-200 rounded-lg text-red-700"><ShieldAlert size={20}/></div>
              <span className="text-sm text-red-800 font-medium">Critical SOS Alerts</span>
            </div>
            <div className="text-3xl font-bold text-red-700">{criticalCount}</div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600"><AlertTriangle size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Open Incidents</span>
            </div>
            <div className="text-3xl font-bold text-yellow-600">{openCount}</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg text-green-600"><ShieldCheck size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Resolved</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{resolvedCount}</div>
          </div>
        </div>

        {/* Incidents Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Incident Ref</th>
                <th className="p-4 font-semibold text-gray-600">Type</th>
                <th className="p-4 font-semibold text-gray-600">Description</th>
                <th className="p-4 font-semibold text-gray-600">Severity</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading incidents...</td></tr>}
              {!isLoading && incidents?.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-500">No incidents reported.</td></tr>}
              
              {incidents?.map((incident: any) => (
                <tr key={incident.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{incident.incidentRef}</td>
                  <td className="p-4">
                    <span className="font-bold text-gray-700">{incident.type}</span>
                  </td>
                  <td className="p-4 text-gray-600 max-w-xs truncate">{incident.description}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      incident.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' : 
                      incident.severity === 'HIGH' ? 'bg-orange-100 text-orange-700' : 
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {incident.severity}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      incident.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 
                      incident.status === 'INVESTIGATING' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {incident.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <select 
                      value={incident.status}
                      onChange={(e) => updateStatusMutation.mutate({ id: incident.id, status: e.target.value })}
                      className="text-sm border border-gray-300 rounded p-1 text-black"
                    >
                      <option value="OPEN">Open</option>
                      <option value="INVESTIGATING">Investigating</option>
                      <option value="RESOLVED">Resolved</option>
                    </select>
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