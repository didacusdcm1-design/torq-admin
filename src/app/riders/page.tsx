"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";

// Types based on your backend schema
type Rider = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
};

export default function RiderManagementPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. The 30-Second Auto-Refreshing Query
  const { data: riders, isLoading, isError, dataUpdatedAt } = useQuery({
    queryKey: ["riders", search],
    queryFn: async () => {
      const response = await api.get(`/riders?search=${search}`);
      return response.data;
    },
  });

  // 2. The Reject Mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      return await api.patch(`/riders/${id}/reject`, { reason });
    },
    onSuccess: () => {
      // Automatically refetch the rider list after a successful rejection
      queryClient.invalidateQueries({ queryKey: ["riders"] });
      setIsModalOpen(false);
      setRejectReason("");
      setSelectedRider(null);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Failed to reject rider");
    }
  });

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRider && rejectReason.trim()) {
      rejectMutation.mutate({ id: selectedRider.id, reason: rejectReason });
    }
  };

  // Helper to format the last updated time (Nairobi Timezone)
  const lastUpdatedTime = new Date(dataUpdatedAt).toLocaleTimeString("en-KE", {
    timeZone: "Africa/Nairobi",
  });

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rider Management</h1>
            <p className="text-sm text-gray-500">
              View, approve, reject, and manage all registered riders.
            </p>
          </div>
          
          {/* Auto-Refresh Indicator */}
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
            <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></span>
            Last updated: {lastUpdatedTime}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search riders by email or name..."
            className="w-full max-w-md p-2 border border-gray-300 rounded-md text-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Rider Name / Email</th>
                <th className="p-4 font-semibold text-gray-600">Phone Number</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">Loading riders...</td></tr>
              )}
              {isError && (
                <tr><td colSpan={4} className="p-8 text-center text-red-500">Failed to load riders.</td></tr>
              )}
              {!isLoading && !isError && riders?.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">No riders found.</td></tr>
              )}
              {riders?.map((rider: Rider) => (
                <tr key={rider.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{rider.firstName} {rider.lastName}</div>
                    <div className="text-sm text-gray-500">{rider.email}</div>
                  </td>
                  <td className="p-4 text-gray-700">{rider.phone}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      rider.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                      rider.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {rider.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => {
                        setSelectedRider(rider);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      View / Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Rejection Modal */}
        {isModalOpen && selectedRider && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Reject Rider: {selectedRider.firstName}</h2>
              <form onSubmit={handleRejectSubmit}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Rejection (Required)
                </label>
                <textarea
                  required
                  className="w-full p-2 border border-gray-300 rounded-md mb-4 text-black"
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g., Invalid driving license document..."
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={rejectMutation.isPending}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    {rejectMutation.isPending ? "Rejecting..." : "Confirm Rejection"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
