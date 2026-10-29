"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { PlusCircle } from "lucide-react";

export default function TripsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [pickupLat, setPickupLat] = useState("-1.2635");
  const [pickupLng, setPickupLng] = useState("36.8027");
  const [dropoffLat, setDropoffLat] = useState("-1.3192");
  const [dropoffLng, setDropoffLng] = useState("36.9276");
  const [distanceKm, setDistanceKm] = useState("10");
  const [durationMins, setDurationMins] = useState("20");

  const { data: tripsResponse, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ["trips", search],
    queryFn: async () => {
      const response = await api.get(`/trips?search=${search}`);
      return response.data;
    },
  });

  const trips = Array.isArray(tripsResponse) ? tripsResponse : [];

  const bookMutation = useMutation({
    mutationFn: async (newTrip: any) => {
      // Note: This requires a valid JWT token in the api interceptor
      return await api.post('/trips/dispatch', newTrip);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      alert("Failed to book trip. Ensure you are logged in. " + (error.response?.data?.message || ""));
    }
  });

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bookMutation.mutate({
      pickupLat: parseFloat(pickupLat),
      pickupLng: parseFloat(pickupLng),
      dropoffLat: parseFloat(dropoffLat),
      dropoffLng: parseFloat(dropoffLng),
      distanceKm: parseFloat(distanceKm),
      durationMins: parseInt(durationMins),
    });
  };

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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
              <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></span>
              Last updated: {lastUpdatedTime}
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-[#FCD34D] text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              <PlusCircle size={18} /> Book Trip
            </button>
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
                <th className="p-4 font-semibold text-gray-600">Pickup PIN</th>
                <th className="p-4 font-semibold text-gray-600">Distance (KM)</th>
                <th className="p-4 font-semibold text-gray-600">Est. Fare (KES)</th>
                <th className="p-4 font-semibold text-gray-600">Created At</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading trips...</td></tr>}
              {!isLoading && trips.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-500">No trips found.</td></tr>}
              
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
                  <td className="p-4 font-mono text-gray-700">{trip.pickupPin || '----'}</td>
                  <td className="p-4 text-gray-700">{trip.distanceKm || 0} km</td>
                  <td className="p-4 text-gray-900 font-semibold">{trip.estimatedFare || '0.00'}</td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(trip.createdAt).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Book Trip Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Book New Trip (Test Fare Calculator)</h2>
              <form onSubmit={handleBookSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Pickup Lat</label>
                    <input type="text" value={pickupLat} onChange={(e) => setPickupLat(e.target.value)} className="w-full p-2 border rounded text-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Pickup Lng</label>
                    <input type="text" value={pickupLng} onChange={(e) => setPickupLng(e.target.value)} className="w-full p-2 border rounded text-black" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Dropoff Lat</label>
                    <input type="text" value={dropoffLat} onChange={(e) => setDropoffLat(e.target.value)} className="w-full p-2 border rounded text-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Dropoff Lng</label>
                    <input type="text" value={dropoffLng} onChange={(e) => setDropoffLng(e.target.value)} className="w-full p-2 border rounded text-black" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Distance (KM)</label>
                    <input type="number" step="0.1" value={distanceKm} onChange={(e) => setDistanceKm(e.target.value)} className="w-full p-2 border rounded text-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Duration (Mins)</label>
                    <input type="number" value={durationMins} onChange={(e) => setDurationMins(e.target.value)} className="w-full p-2 border rounded text-black" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
                  <button type="submit" disabled={bookMutation.isPending} className="px-4 py-2 bg-[#FCD34D] text-black font-semibold rounded-md hover:bg-yellow-400 disabled:opacity-50">
                    {bookMutation.isPending ? "Calculating..." : "Book & Calculate"}
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
