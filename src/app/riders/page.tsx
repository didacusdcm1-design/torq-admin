"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  User, 
  Phone, 
  Bike, 
  Key,
  X
} from "lucide-react";

export default function RidersPage() {
  const [search, setSearch] = useState("");
  const [selectedRider, setSelectedRider] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: riders, isLoading } = useQuery({
    queryKey: ["riders"],
    queryFn: async () => {
      const res = await fetch("https://torq-backend.onrender.com/riders");
      if (!res.ok) throw new Error("Failed to fetch riders");
      return res.json();
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (userId: string) => {
      await fetch(`https://torq-backend.onrender.com/riders/approve/${userId}`, { method: "PATCH" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["riders"] });
      setSelectedRider(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason: string }) => {
      await fetch(`https://torq-backend.onrender.com/riders/reject/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["riders"] });
      setSelectedRider(null);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ userId, password }: { userId: string; password: string }) => {
      await fetch(`https://torq-backend.onrender.com/riders/${userId}/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
    },
    onSuccess: () => alert("Password reset successfully"),
  });

  const filteredRiders = riders?.filter((rider: any) => 
    rider.name?.toLowerCase().includes(search.toLowerCase()) || 
    rider.phone?.includes(search)
  ) || [];

  return (
    <div className="p-8 bg-[#0a0a0a] min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Riders & Drivers</h1>
          <p className="text-gray-400">Approve new riders and manage the fleet.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-2 bg-[#FCD34D]/10 rounded-lg text-[#FCD34D]"><User size={20} /></div>
            <p className="text-gray-400 font-medium">Total Riders</p>
          </div>
          <p className="text-3xl font-bold">{riders?.length || 0}</p>
        </div>
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-2 bg-green-500/10 rounded-lg text-green-500"><CheckCircle2 size={20} /></div>
            <p className="text-gray-400 font-medium">Approved</p>
          </div>
          <p className="text-3xl font-bold text-green-500">
            {riders?.filter((r: any) => r.riderProfile?.verificationStatus === 'APPROVED').length || 0}
          </p>
        </div>
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500"><FileText size={20} /></div>
            <p className="text-gray-400 font-medium">Pending Approval</p>
          </div>
          <p className="text-3xl font-bold text-yellow-500">
            {riders?.filter((r: any) => r.riderProfile?.verificationStatus === 'PENDING').length || 0}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Rider List</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              className="bg-[#0a0a0a] border border-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-[#FCD34D]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 text-sm">
              <th className="p-4 font-medium">Rider Name</th>
              <th className="p-4 font-medium">Contact</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">Loading riders...</td></tr>
            ) : filteredRiders.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">No riders found.</td></tr>
            ) : filteredRiders.map((rider: any) => (
              <tr key={rider.id} className="border-b border-gray-800/50 hover:bg-[#222] transition-colors">
                <td className="p-4 font-medium">{rider.name}</td>
                <td className="p-4 text-gray-400">{rider.phone}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    rider.riderProfile?.verificationStatus === 'APPROVED' ? 'bg-green-500/20 text-green-500' :
                    rider.riderProfile?.verificationStatus === 'REJECTED' ? 'bg-red-500/20 text-red-500' :
                    'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {rider.riderProfile?.verificationStatus || 'PENDING'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => setSelectedRider(rider)}
                    className="bg-[#0a0a0a] border border-gray-700 hover:border-[#FCD34D] text-white px-4 py-2 rounded-lg text-sm transition-all"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rider Details Modal */}
      {selectedRider && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-[#111] z-10">
              <h2 className="text-xl font-bold">Rider Details</h2>
              <button onClick={() => setSelectedRider(null)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* IDENTITY & CONTACT */}
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2"><User size={16}/> Identity & Contact</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Full Name</p>
                    <p className="font-medium">{selectedRider.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <p className="font-medium">{selectedRider.phone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">National ID</p>
                    <p className="font-medium">{selectedRider.riderProfile?.nationalId || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Emergency Contact</p>
                    <p className="font-medium">{selectedRider.riderProfile?.emergencyContact || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* MOTORCYCLE */}
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2"><Bike size={16}/> Motorcycle</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Make & Model</p>
                    <p className="font-medium">{selectedRider.riderProfile?.bikeModel || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Color</p>
                    <p className="font-medium">{selectedRider.riderProfile?.bikeColor || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Registration</p>
                    <p className="font-medium">{selectedRider.riderProfile?.plateNumber || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* DOCUMENTS SECTION */}
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2"><FileText size={16}/> Uploaded Documents</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Driver's License</p>
                    {selectedRider.riderProfile?.licenseDocUrl ? (
                      <img src={"https://torq-backend.onrender.com/" + selectedRider.riderProfile.licenseDocUrl} alt="License" className="w-full h-32 object-cover rounded-lg border border-gray-700 cursor-pointer hover:opacity-80" onClick={(e) => window.open(e.currentTarget.src, "_blank")} />
                    ) : <div className="h-32 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-xs text-gray-500 border border-gray-800">No Image</div>}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Insurance</p>
                    {selectedRider.riderProfile?.insuranceDocUrl ? (
                      <img src={"https://torq-backend.onrender.com/" + selectedRider.riderProfile.insuranceDocUrl} alt="Insurance" className="w-full h-32 object-cover rounded-lg border border-gray-700 cursor-pointer hover:opacity-80" onClick={(e) => window.open(e.currentTarget.src, "_blank")} />
                    ) : <div className="h-32 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-xs text-gray-500 border border-gray-800">No Image</div>}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Bike Photo</p>
                    {selectedRider.riderProfile?.bikePhotoUrl ? (
                      <img src={"https://torq-backend.onrender.com/" + selectedRider.riderProfile.bikePhotoUrl} alt="Bike" className="w-full h-32 object-cover rounded-lg border border-gray-700 cursor-pointer hover:opacity-80" onClick={(e) => window.open(e.currentTarget.src, "_blank")} />
                    ) : <div className="h-32 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-xs text-gray-500 border border-gray-800">No Image</div>}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Selfie</p>
                    {selectedRider.riderProfile?.selfieUrl ? (
                      <img src={"https://torq-backend.onrender.com/" + selectedRider.riderProfile.selfieUrl} alt="Selfie" className="w-full h-32 object-cover rounded-lg border border-gray-700 cursor-pointer hover:opacity-80" onClick={(e) => window.open(e.currentTarget.src, "_blank")} />
                    ) : <div className="h-32 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-xs text-gray-500 border border-gray-800">No Image</div>}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-800 bg-[#111] flex flex-wrap justify-end gap-3 rounded-b-xl sticky bottom-0">
              <button onClick={() => { const reason = prompt("Reason:"); if(reason) rejectMutation.mutate({ userId: selectedRider.id, reason }); }} className="px-4 py-2 bg-red-500/10 text-red-500 font-semibold rounded-lg hover:bg-red-500/20 transition-colors">
                Reject
              </button>
              <button onClick={() => { const pass = prompt("Enter new password:"); if(pass) resetPasswordMutation.mutate({ userId: selectedRider.id, password: pass }); }} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors">
                <Key size={16}/> Reset Password
              </button>
              <button onClick={() => approveMutation.mutate(selectedRider.id)} disabled={selectedRider.riderProfile?.verificationStatus === 'APPROVED'} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50 transition-colors">
                <CheckCircle2 size={18}/>
                {selectedRider.riderProfile?.verificationStatus === 'APPROVED' ? 'Approved' : 'Approve Rider'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}