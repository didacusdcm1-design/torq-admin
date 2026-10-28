"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";

type Trip = {
  id: string;
  bookingRef: string;
  status: string;
  pickupAddress: string;
  destinationAddress: string;
  fare: number;
  createdAt: string;
  rider?: { firstName: string; lastName: string };
  customer?: { firstName: string; lastName: string };
};

export default function TripsPage() {
  const [search, setSearch] = useState("");

  // 30-Second Auto-Refreshing Query for Trips
  const { data: trips, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ["trips", search],
    queryFn: async () => {
      // Note: You will need to ensure your NestJS backend has a GET /trips endpoint
      const response = await api.get(`/trips?search=${search}`);
      return response.data;
    },
  });

  const lastUpdatedTime = new Date(dataUpdatedAt).toLocaleTimeString("en-KE", {
    timeZone: "Africa/Nairobi",
  });

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
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
            placeholder="Search by Trip ID or Booking Ref..."
            className="w-full max-w-md p-2 border border-gray-300 rounded-md text-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Booking Ref</th>
                <th className="p-4 font-semibold text-gray-600">Customer</th>
                <th className="p-4 font-semibold text-gray-600">Rider</th>
                <th className="p-4 font-semibold text-gray-600">Route</th>
                <th className="p-4 font-semibold text-gray-600">Fare (KES)</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading trips...</td></tr>}
              {!isLoading && trips?.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-500">No trips found.</td></tr>}
              
              {trips?.map((trip: Trip) => (
                <tr key={trip.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{trip.bookingRef}</td>
                  <td className="p-4 text-gray-700">{trip.customer?.firstName || 'N/A'}</td>
                  <td className="p-4 text-gray-700">{trip.rider?.firstName || 'Searching...'}</td>
                  <td className="p-4 text-sm text-gray-500">
                    {trip.pickupAddress?.substring(0, 20)}... <br/> to <br/> {trip.destinationAddress?.substring(0, 20)}...
                  </td>
                  <td className="p-4 text-gray-900 font-semibold">{trip.fare?.toFixed(2) || '0.00'}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      trip.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                      trip.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {trip.status}
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
