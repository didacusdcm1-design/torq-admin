"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { Users, Search, Phone, Mail, MapPin } from "lucide-react";

type Passenger = {
  id: string;
  phone: string;
  email: string;
  createdAt: string;
  role: string;
};

export default function PassengersPage() {
  const [search, setSearch] = useState("");

  const { data: usersResponse, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ["passengers", search],
    queryFn: async () => {
      const response = await api.get(`/riders?search=${search}`);
      return response.data;
    },
  });

  // Filter specifically for Customers
  const passengers: Passenger[] = Array.isArray(usersResponse) 
    ? usersResponse.filter((u: any) => u.role === 'CUSTOMER') 
    : [];

  const totalPassengers = passengers.length;

  const lastUpdatedTime = new Date(dataUpdatedAt).toLocaleTimeString("en-KE", {
    timeZone: "Africa/Nairobi",
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Passengers</h1>
            <p className="text-sm text-gray-500">Manage all registered customers and their trip history.</p>
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
              <span className="text-sm text-gray-500 font-medium">Total Passengers</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{totalPassengers}</div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><MapPin size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Active Today</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">--</div>
            <div className="text-xs text-gray-400 mt-1">Requires trip data integration</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Phone size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Verified Numbers</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{totalPassengers}</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search passengers by phone or email..."
            className="w-full max-w-md pl-10 p-2.5 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Passengers Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Passenger</th>
                <th className="p-4 font-semibold text-gray-600">Contact</th>
                <th className="p-4 font-semibold text-gray-600">Joined</th>
                <th className="p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={4} className="p-8 text-center text-gray-500">Loading passengers...</td></tr>}
              {!isLoading && passengers.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-500">No passengers found.</td></tr>}
              
              {passengers.map((passenger: Passenger) => (
                <tr key={passenger.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                        {passenger.phone ? passenger.phone.substring(0,2) : 'P'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Passenger {passenger.id.substring(0, 4)}</div>
                        <div className="text-xs text-gray-500">ID: {passenger.id.substring(0, 8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                      <Phone size={14} className="text-gray-400" /> {passenger.phone || 'N/A'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Mail size={14} className="text-gray-400" /> {passenger.email || 'No email'}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(passenger.createdAt).toLocaleDateString('en-KE')}
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => alert("Passenger profile coming soon.")}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      View Details
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