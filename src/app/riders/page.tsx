"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { Users, CheckCircle2, Clock, Search, XCircle } from "lucide-react";

export default function RidersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: ridersResponse, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ["riders", search],
    queryFn: async () => {
      const response = await api.get(`/riders?search=${search}`);
      return response.data;
    },
  });

  // Filter for riders and read the profile data
  const riders = Array.isArray(ridersResponse) ? ridersResponse.filter((u: any) => u.role === 'RIDER') : [];
  
  const pendingCount = riders.filter((r: any) => r.riderProfile?.verificationStatus === 'PENDING_REVIEW').length;
  const approvedCount = riders.filter((r: any) => r.riderProfile?.verificationStatus === 'APPROVED').length;

  const approveMutation = useMutation({
    mutationFn: async (userId: string) => {
      return await api.patch(`/riders/approve/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["riders"] });
      alert("Rider Approved Successfully!");
    },
    onError: () => {
      alert("Failed to approve rider. Ensure you are logged in.");
    }
  });

  const lastUpdatedTime = new Date(dataUpdatedAt).toLocaleTimeString("en-KE", { timeZone: "Africa/Nairobi" });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Riders & Drivers</h1>
            <p className="text-sm text-gray-500">Approve new riders and manage the fleet.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
            <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></span>
            Last updated: {lastUpdatedTime}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#FCD34D] rounded-lg text-black"><Users size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Total Riders</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{riders.length}</div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg text-green-600"><CheckCircle2 size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Approved</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{approvedCount}</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600"><Clock size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Pending Approval</span>
            </div>
            <div className="text-3xl font-bold text-yellow-600">{pendingCount}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Rider</th>
                <th className="p-4 font-semibold text-gray-600">Contact</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {riders.map((rider: any) => (
                <tr key={rider.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{rider.riderProfile?.fullName || `Rider ${rider.id.substring(0, 4)}`}</td>
                  <td className="p-4 text-gray-700">{rider.phone}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      rider.riderProfile?.verificationStatus === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                      rider.riderProfile?.verificationStatus === 'PENDING_REVIEW' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {rider.riderProfile?.verificationStatus || 'PENDING_REVIEW'}
                    </span>
                  </td>
                  <td className="p-4">
                    {rider.riderProfile?.verificationStatus !== 'APPROVED' ? (
                      <button 
                        onClick={() => approveMutation.mutate(rider.id)}
                        className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                      >
                        Approve Rider
                      </button>
                    ) : (
                      <span className="text-green-600 text-sm font-medium flex items-center gap-1"><CheckCircle2 size={14}/> Verified</span>
                    )}
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