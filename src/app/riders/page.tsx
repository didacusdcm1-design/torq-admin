"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { Users, CheckCircle2, Clock, XCircle, Search, ShieldAlert } from "lucide-react";

type Rider = {
  id: string;
  phone: string;
  email: string;
  isOnline: boolean;
  createdAt: string;
  role: string;
};

export default function RidersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: ridersResponse, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ["riders", search],
    queryFn: async () => {
      // We fetch all users and filter by role on the frontend for this view
      const response = await api.get(`/riders?search=${search}`);
      return response.data;
    },
  });

  // Safe array extraction
  const riders: Rider[] = Array.isArray(ridersResponse) 
    ? ridersResponse.filter((u: any) => u.role === 'RIDER') 
    : [];

  // Calculate KPIs
  const totalRiders = riders.length;
  const onlineRiders = riders.filter(r => r.isOnline).length;
  const offlineRiders = totalRiders - onlineRiders;

  const lastUpdatedTime = new Date(dataUpdatedAt).toLocaleTimeString("en-KE", {
    timeZone: "Africa/Nairobi",
  });

  // Format phone for display
  const formatPhone = (phone: string) => {
    if (!phone) return 'N/A';
    return phone;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Riders & Drivers</h1>
            <p className="text-sm text-gray-500">Manage all registered motorcycle operators.</p>
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
            <div className="text-3xl font-bold text-gray-900">{totalRiders}</div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg text-green-600"><CheckCircle2 size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Online Now</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{onlineRiders}</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><Clock size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Offline</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{offlineRiders}</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search riders by phone or email..."
            className="w-full max-w-md pl-10 p-2.5 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Riders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Rider</th>
                <th className="p-4 font-semibold text-gray-600">Contact</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Joined</th>
                <th className="p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading riders...</td></tr>}
              {!isLoading && riders.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-500">No riders found.</td></tr>}
              
              {riders.map((rider: Rider) => (
                <tr key={rider.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                        {rider.phone ? rider.phone.substring(0,2) : 'R'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Rider {rider.id.substring(0, 4)}</div>
                        <div className="text-xs text-gray-500">ID: {rider.id.substring(0, 8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-gray-900">{formatPhone(rider.phone)}</div>
                    <div className="text-sm text-gray-500">{rider.email || 'No email'}</div>
                  </td>
                  <td className="p-4">
                    {rider.isOnline ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Offline
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(rider.createdAt).toLocaleDateString('en-KE')}
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => alert("Rider details modal coming soon.")}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      View Profile
                    </button>
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