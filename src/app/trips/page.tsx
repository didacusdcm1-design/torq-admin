"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Search, RefreshCw } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-[238px] bg-[#0b121b] text-[#e8eef8] flex flex-col z-20 shrink-0 h-screen">
      <div className="flex items-center gap-2 px-4 py-5 border-b border-slate-700">
        <b className="text-4xl italic text-[#ffbd19]">ϟ</b>
        <div>
          <div className="text-2xl font-extrabold text-white leading-none">TORQ</div>
          <div className="text-[9px] tracking-widest mt-1">RIDE • DELIVER • CONNECT</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto mt-2 px-2 space-y-1 pb-4">
        <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#d6deea] hover:bg-[#202b39]">
          <span>⌂</span> <span>Dashboard</span>
        </Link>
        <Link href="/trips" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold bg-[#ffbd19] text-[#101827]">
          <span>🚕</span> <span>Trip Management</span>
        </Link>
        <Link href="/customers" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#d6deea] hover:bg-[#202b39]">
          <span>♙</span> <span>Customers</span>
        </Link>
        <Link href="/riders" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#d6deea] hover:bg-[#202b39]">
          <span>♟</span> <span>Riders</span>
        </Link>
      </nav>
      <div className="p-4 border-t border-slate-700 text-xs text-slate-400">
        🟢 System Operational<br/><br/>TORQ Admin • Live Data
      </div>
    </aside>
  );
};

export default function TripsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const { data: trips, isLoading, isError, dataUpdatedAt } = useQuery({
    queryKey: ['adminTrips', activeSearch],
    queryFn: async () => {
      const res = await fetch(`https://torq-backend.onrender.com/trips/admin/all?search=${activeSearch}`);
      if (!res.ok) throw new Error('Failed to fetch trips');
      return res.json();
    },
  });

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : 'Loading...';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchTerm);
  };

  return (
    <div className="flex h-screen bg-[#f4f7fb] font-sans text-[#10203e] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-extrabold">Trip Management</h1>
            <p className="text-xs text-slate-500 mt-1">Monitor and manage all rides across the platform.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs bg-white border rounded-lg px-3 py-2 shadow-sm flex items-center gap-2">
              <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
              Last updated: {lastUpdated}
            </div>
          </div>
        </div>

        {isError && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 text-sm">
            Failed to connect to the backend. Please check your Render server.
          </div>
        )}

        <div className="bg-white border border-[#dfe7f1] rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#dfe7f1] bg-[#f7f9fc] flex justify-between items-center">
            <form onSubmit={handleSearch} className="relative w-96">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search by Trip ID, Customer, or Rider..." 
                className="w-full pl-9 pr-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffbd19] text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
            <div className="text-xs text-slate-500 font-semibold">
              Showing {trips?.length || 0} recent trips
            </div>
          </div>

          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-white text-[#51627d] text-[10px] uppercase border-b border-[#edf1f6]">
                <th className="p-4 font-bold">Trip ID</th>
                <th className="p-4 font-bold">Customer</th>
                <th className="p-4 font-bold">Rider</th>
                <th className="p-4 font-bold">Pickup Lat/Lng</th>
                <th className="p-4 font-bold">Dropoff Lat/Lng</th>
                <th className="p-4 font-bold">Fare</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} className="p-8 text-center text-slate-500">Loading trips...</td></tr>
              ) : trips?.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-slate-500">No trips found.</td></tr>
              ) : (
                trips?.map((trip: any) => (
                  <tr key={trip.id} className="border-t border-[#edf1f6] text-xs hover:bg-gray-50">
                    <td className="p-4 font-mono text-gray-500">{trip.id.substring(0, 8)}</td>
                    <td className="p-4 font-semibold">{trip.customer?.email || 'N/A'}</td>
                    <td className="p-4">{trip.rider?.email || <span className="text-orange-500 italic">Unassigned</span>}</td>
                    <td className="p-4">{trip.pickupLat.toFixed(4)}, {trip.pickupLng.toFixed(4)}</td>
                    <td className="p-4">{trip.dropoffLat.toFixed(4)}, {trip.dropoffLng.toFixed(4)}</td>
                    <td className="p-4 font-bold text-green-600">KSh {trip.estimatedFare}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-[9px] font-bold ${
                        trip.status === 'COMPLETED' ? 'bg-[#dcfce7] text-[#15803d]' : 
                        trip.status === 'ACCEPTED' ? 'bg-[#dbeafe] text-[#1d4ed8]' : 
                        trip.status === 'REQUESTED' ? 'bg-[#fef3c7] text-[#a16207]' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {trip.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">{new Date(trip.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
