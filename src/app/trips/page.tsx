"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";

export default function TripsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { data: tripsResponse, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ["trips", search],
    queryFn: async () => {
      const response = await api.get(`/trips?search=${search}`);
      console.log("TRIPS API RESPONSE:", response.data); // Debug log
      return response.data;
    },
  });

  const trips = Array.isArray(tripsResponse) ? tripsResponse : [];

  const lastUpdatedTime = new Date(dataUpdatedAt).toLocaleTimeString("en-KE", {
    timeZone: "Africa/Nairobi",
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Trip Monitoring</h1>
            <p className="text-sm text-gray-500">Live view of all active and completed rides.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
            <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></span>
            Last updated: {lastUpdatedTime}
          </div>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Trip ID..."
            className="w-full max-w-md p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Trip ID</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Est. Fare (KES)</th>
                <th className="p-4 font-semibold text-gray-600">Created At</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={4} className="p-8 text-center text-gray-500">Loading trips...</td></tr>}
              {!isLoading && trips.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-500">No trips found. Please run the /seed-trip endpoint first.</td></tr>}
              
              {trips.map((trip: any) => (
                <tr 
                  key={trip.id} 
                  onClick={() => router.push(`/trips/${trip.id}`)}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="p-4 font-medium text-gray-900">{trip.id.substring(0, 8)}...</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      trip.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                      trip.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {trip.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-900 font-semibold">{trip.estimatedFare || '0.00'}</td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(trip.createdAt).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}
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