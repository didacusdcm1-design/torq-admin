"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { Users, CheckCircle2, Clock, X, ShieldAlert, Bike, FileText } from "lucide-react";

export default function RidersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedRider, setSelectedRider] = useState<any>(null);

  const { data: ridersResponse, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ["riders", search],
    queryFn: async () => {
      const response = await api.get(`/riders?search=${search}`);
      console.log("RIDERS API RESPONSE:", response.data); // <-- Debug log
      return response.data;
    },
  });

  const riders = Array.isArray(ridersResponse) ? ridersResponse.filter((u: any) => u.role === 'RIDER') : [];
  
  // DEBUG: Log the riders array to see if riderProfile is there
  console.log("FILTERED RIDERS:", riders);

  // Calculate counts safely
  const pendingCount = riders.filter((r: any) => {
    const status = r.riderProfile?.verificationStatus || r.riderProfile?.verification_status;
    return status === 'PENDING_REVIEW' || !status;
  }).length;

  const approvedCount = riders.filter((r: any) => {
    const status = r.riderProfile?.verificationStatus || r.riderProfile?.verification_status;
    return status === 'APPROVED';
  }).length;

  const approveMutation = useMutation({
    mutationFn: async (userId: string) => {
      return await api.patch(`/riders/approve/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["riders"] });
      setSelectedRider(null);
      alert("Rider Approved Successfully!");
    },
    onError: () => alert("Failed to approve rider.")
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ userId, reason }: { userId: string, reason: string }) => {
      return await api.patch(`/riders/reject/${userId}`, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["riders"] });
      setSelectedRider(null);
      alert("Rider Rejected.");
    },
    onError: () => alert("Failed to reject rider.")
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

        {/* Riders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Rider Name</th>
                <th className="p-4 font-semibold text-gray-600">Contact</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {riders.map((rider: any) => {
                const status = rider.riderProfile?.verificationStatus || rider.riderProfile?.verification_status || 'PENDING_REVIEW';
                
                return (
                  <tr key={rider.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{rider.riderProfile?.fullName || `Rider ${rider.id.substring(0, 4)}`}</td>
                    <td className="p-4 text-gray-700">{rider.phone}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                        status === 'PENDING_REVIEW' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => setSelectedRider(rider)}
                        className="px-3 py-1.5 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* DETAILS MODAL */}
        {selectedRider && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                <h2 className="text-xl font-bold text-gray-900">Rider Verification Details</h2>
                <button onClick={() => setSelectedRider(null)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2"><ShieldAlert size={16}/> Identity & Contact</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-500 block">Full Name</span> <span className="font-medium text-gray-900">{selectedRider.riderProfile?.fullName || 'N/A'}</span></div>
                    <div><span className="text-gray-500 block">Phone</span> <span className="font-medium text-gray-900">{selectedRider.phone}</span></div>
                    <div><span className="text-gray-500 block">National ID</span> <span className="font-medium text-gray-900">{selectedRider.riderProfile?.nationalId || 'N/A'}</span></div>
                    <div><span className="text-gray-500 block">Emergency Contact</span> <span className="font-medium text-gray-900">{selectedRider.riderProfile?.emergencyContact || 'N/A'}</span></div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2"><FileText size={16}/> Documents</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div><span className="text-gray-500 block">Driver's License No.</span> <span className="font-medium text-gray-900">{selectedRider.riderProfile?.licenseNumber || 'N/A'}</span></div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 bg-gray-100 p-4 rounded-lg text-center text-gray-500 text-sm border border-dashed border-gray-300">License Photo<br/>(Simulated)</div>
                    <div className="flex-1 bg-gray-100 p-4 rounded-lg text-center text-gray-500 text-sm border border-dashed border-gray-300">Rider Selfie<br/>(Simulated)</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2"><Bike size={16}/> Motorcycle</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-500 block">Make & Model</span> <span className="font-medium text-gray-900">{selectedRider.riderProfile?.bikeMake} {selectedRider.riderProfile?.bikeModel}</span></div>
                    <div><span className="text-gray-500 block">Color</span> <span className="font-medium text-gray-900">{selectedRider.riderProfile?.bikeColor || 'N/A'}</span></div>
                    <div><span className="text-gray-500 block">Registration</span> <span className="font-medium text-gray-900 font-bold">{selectedRider.riderProfile?.bikeReg || 'N/A'}</span></div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                <button 
                  onClick={() => {
                    const reason = prompt("Enter reason for rejection:");
                    if(reason) rejectMutation.mutate({ userId: selectedRider.id, reason });
                  }}
                  disabled={rejectMutation.isPending}
                  className="px-6 py-2.5 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                >
                  Reject Application
                </button>
                <button 
                  onClick={() => approveMutation.mutate(selectedRider.id)}
                  disabled={approveMutation.isPending || selectedRider.riderProfile?.verificationStatus === 'APPROVED'}
                  className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <CheckCircle2 size={18} />
                  {selectedRider.riderProfile?.verificationStatus === 'APPROVED' ? 'Already Approved' : 'Approve Rider'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}