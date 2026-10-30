"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { Users, CheckCircle2, Clock, X, ShieldAlert, Bike, FileText, Key } from "lucide-react";

export default function RidersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedRider, setSelectedRider] = useState<any>(null);

  const { data: ridersResponse, isLoading } = useQuery({
    queryKey: ["riders", search],
    queryFn: async () => {
      const response = await api.get(`/riders?search=${search}`);
      return response.data;
    },
    refetchInterval: false,
  });

  const riders = Array.isArray(ridersResponse) ? ridersResponse.filter((u: any) => u.role === 'RIDER') : [];
  const pendingCount = riders.filter((r: any) => r.riderProfile?.verificationStatus === 'PENDING_REVIEW' || !r.riderProfile?.verificationStatus).length;
  const approvedCount = riders.filter((r: any) => r.riderProfile?.verificationStatus === 'APPROVED').length;

  const approveMutation = useMutation({
    mutationFn: async (userId: string) => await api.patch(`/riders/approve/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["riders"] });
      setSelectedRider(null);
      alert("Rider Approved!");
    },
    onError: (err: any) => alert(`Failed: ${err.response?.data?.message || 'Error'}`)
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ userId, reason }: { userId: string, reason: string }) => await api.patch(`/riders/reject/${userId}`, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["riders"] });
      setSelectedRider(null);
      alert("Rider Rejected.");
    },
    onError: (err: any) => alert(`Failed: ${err.response?.data?.message || 'Error'}`)
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ userId, password }: { userId: string, password: string }) => {
      return await api.patch(`/riders/${userId}/password`, { password });
    },
    onSuccess: () => alert("Password reset successfully!")
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Riders & Drivers</h1>
          <p className="text-sm text-gray-500">Approve new riders and manage the fleet.</p>
        </div>

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
                <th className="p-4 font-semibold text-gray-600">Rider Name</th>
                <th className="p-4 font-semibold text-gray-600">Contact</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {riders.map((rider: any) => {
                const status = rider.riderProfile?.verificationStatus || 'PENDING_REVIEW';
                return (
                  <tr key={rider.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{rider.riderProfile?.fullName || `Rider ${rider.id.substring(0, 4)}`}</td>
                    <td className="p-4 text-gray-700">{rider.phone}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${status === 'APPROVED' ? 'bg-green-100 text-green-700' : status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button onClick={() => setSelectedRider(rider)} className="px-3 py-1.5 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800">View Details</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {selectedRider && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                <h2 className="text-xl font-bold text-gray-900">Rider Details</h2>
                <button onClick={() => setSelectedRider(null)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2"><ShieldAlert size={16}/> Identity & Contact</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-500 block">Full Name</span> <span className="font-medium text-gray-900">{selectedRider.riderProfile?.fullName || 'N/A'}</span></div>
                    <div><span className="text-gray-500 block">Phone</span> <span className="font-medium text-gray-900">{selectedRider.phone || 'N/A'}</span></div>
                    <div><span className="text-gray-500 block">National ID</span> <span className="font-medium text-gray-900">{selectedRider.riderProfile?.nationalId || 'N/A'}</span></div>
                    <div><span className="text-gray-500 block">Emergency Contact</span> <span className="font-medium text-gray-900">{selectedRider.riderProfile?.emergencyContact || 'N/A'}</span></div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2"><Bike size={16}/> Motorcycle</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-500 block">Make & Model</span> <span className="font-medium text-gray-900">{selectedRider.riderProfile?.bikeMake || 'N/A'} {selectedRider.riderProfile?.bikeModel || ''}</span></div>
                    <div><span className="text-gray-500 block">Color</span> <span className="font-medium text-gray-900">{selectedRider.riderProfile?.bikeColor || 'N/A'}</span></div>
                    <div><span className="text-gray-500 block">Registration</span> <span className="font-medium text-gray-900 font-bold">{selectedRider.riderProfile?.bikeReg || 'N/A'}</span></div>
                  </div>
                </div>

                {/* DOCUMENTS SECTION */}
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2"><FileText size={16}/> Uploaded Documents</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Driver's License</p>
                      {selectedRider.riderProfile?.licenseDocUrl ? (
                        <img src={selectedRider.riderProfile.licenseDocUrl} alt="License" className="w-full h-32 object-cover rounded-lg border" />
                      ) : <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">No Image</div>}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Insurance</p>
                      {selectedRider.riderProfile?.insuranceDocUrl ? (
                        <img src={selectedRider.riderProfile.insuranceDocUrl} alt="Insurance" className="w-full h-32 object-cover rounded-lg border" />
                      ) : <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">No Image</div>}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Bike Photo</p>
                      {selectedRider.riderProfile?.bikePhotoUrl ? (
                        <img src={selectedRider.riderProfile.bikePhotoUrl} alt="Bike" className="w-full h-32 object-cover rounded-lg border" />
                      ) : <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">No Image</div>}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Selfie</p>
                      {selectedRider.riderProfile?.selfieUrl ? (
                        <img src={selectedRider.riderProfile.selfieUrl} alt="Selfie" className="w-full h-32 object-cover rounded-lg border" />
                      ) : <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">No Image</div>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50 flex flex-wrap justify-end gap-3 rounded-b-xl">
                <button onClick={() => { const reason = prompt("Reason:"); if(reason) rejectMutation.mutate({ userId: selectedRider.id, reason }); }} className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200">Reject</button>
                <button onClick={() => { const pass = prompt("Enter new password:"); if(pass) resetPasswordMutation.mutate({ userId: selectedRider.id, password: pass }); }} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center gap-2"><Key size={16}/> Reset Password</button>
                <button onClick={() => approveMutation.mutate(selectedRider.id)} disabled={selectedRider.riderProfile?.verificationStatus === 'APPROVED'} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"><CheckCircle2 size={18}/> {selectedRider.riderProfile?.verificationStatus === 'APPROVED' ? 'Approved' : 'Approve Rider'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}