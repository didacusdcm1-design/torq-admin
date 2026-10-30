"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { MessageSquare, Scale, CheckCircle2, DollarSign } from "lucide-react";

export default function DisputesPage() {
  const queryClient = useQueryClient();

  const { data: disputes, isLoading } = useQuery({
    queryKey: ["disputes"],
    queryFn: async () => {
      const response = await api.get('/disputes');
      return response.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      return await api.patch(`/disputes/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disputes"] });
    }
  });

  const openCount = disputes?.filter((d: any) => d.status === 'OPEN' || d.status === 'UNDER_REVIEW').length || 0;
  const resolvedCount = disputes?.filter((d: any) => d.status === 'RESOLVED').length || 0;
  const totalDisputedAmount = disputes?.reduce((sum: number, d: any) => sum + d.amount, 0) || 0;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Disputes</h1>
          <p className="text-sm text-gray-500">Resolve financial conflicts between customers and riders.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600"><Scale size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Open Disputes</span>
            </div>
            <div className="text-3xl font-bold text-yellow-600">{openCount}</div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg text-red-600"><DollarSign size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Total Disputed (KES)</span>
            </div>
            <div className="text-3xl font-bold text-red-600">{totalDisputedAmount.toFixed(2)}</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg text-green-600"><CheckCircle2 size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Resolved</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{resolvedCount}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Ref</th>
                <th className="p-4 font-semibold text-gray-600">Subject</th>
                <th className="p-4 font-semibold text-gray-600">Amount (KES)</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading disputes...</td></tr>}
              {!isLoading && disputes?.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-500">No disputes found.</td></tr>}
              
              {disputes?.map((dispute: any) => (
                <tr key={dispute.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{dispute.disputeRef}</td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{dispute.subject}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{dispute.description}</div>
                  </td>
                  <td className="p-4 font-bold text-red-600">{dispute.amount.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      dispute.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 
                      dispute.status === 'UNDER_REVIEW' ? 'bg-yellow-100 text-yellow-700' : 
                      dispute.status === 'REJECTED' ? 'bg-gray-100 text-gray-600' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {dispute.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <select 
                      value={dispute.status}
                      onChange={(e) => updateStatusMutation.mutate({ id: dispute.id, status: e.target.value })}
                      className="text-sm border border-gray-300 rounded p-1 text-black"
                    >
                      <option value="OPEN">Open</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="REJECTED">Rejected</option>
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