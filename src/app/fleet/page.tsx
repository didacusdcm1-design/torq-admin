"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { Truck, Search, Bike, ShieldCheck, ShieldAlert } from "lucide-react";

export default function FleetPage() {
  const [search, setSearch] = useState("");

  const { data: fleet, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ["fleet", search],
    queryFn: async () => {
      const response = await api.get(`/fleet`);
      return response.data;
    },
    refetchInterval: false,
  });

  const filteredFleet = Array.isArray(fleet) 
    ? fleet.filter((bike: any) => 
        bike.bikeReg.toLowerCase().includes(search.toLowerCase()) || 
        bike.riderName.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const totalBikes = filteredFleet.length;
  const approvedBikes = filteredFleet.filter((b: any) => b.verificationStatus === 'APPROVED').length;
  const pendingBikes = totalBikes - approvedBikes;

  const lastUpdatedTime = new Date(dataUpdatedAt).toLocaleTimeString("en-KE", { timeZone: "Africa/Nairobi" });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Motorcycle Fleet</h1>
            <p className="text-sm text-gray-500">Manage all registered motorcycles and their assigned riders.</p>
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
              <div className="p-2 bg-[#FCD34D] rounded-lg text-black"><Truck size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Total Motorcycles</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{totalBikes}</div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg text-green-600"><ShieldCheck size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Verified Bikes</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{approvedBikes}</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600"><ShieldAlert size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Pending Verification</span>
            </div>
            <div className="text-3xl font-bold text-yellow-600">{pendingBikes}</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by registration or rider name..."
            className="w-full max-w-md pl-10 p-2.5 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Fleet Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Registration</th>
                <th className="p-4 font-semibold text-gray-600">Make & Model</th>
                <th className="p-4 font-semibold text-gray-600">Color</th>
                <th className="p-4 font-semibold text-gray-600">Assigned Rider</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading fleet...</td></tr>}
              {!isLoading && filteredFleet.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-500">No motorcycles found.</td></tr>}
              
              {filteredFleet.map((bike: any) => (
                <tr key={bike.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-900">{bike.bikeReg}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Bike size={16} className="text-gray-400" />
                      <span className="text-gray-700">{bike.bikeMake} {bike.bikeModel}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-700">{bike.bikeColor}</td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-gray-900">{bike.riderName}</div>
                    <div className="text-xs text-gray-500">{bike.riderPhone}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      bike.verificationStatus === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                      bike.verificationStatus === 'PENDING_REVIEW' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {bike.verificationStatus}
                    </span>
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