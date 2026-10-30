"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { Star, Search, TrendingUp, AlertCircle } from "lucide-react";

export default function RatingsPage() {
  const [search, setSearch] = useState("");

  const { data: ratings, isLoading } = useQuery({
    queryKey: ["ratings"],
    queryFn: async () => {
      const response = await api.get('/ratings');
      return response.data;
    },
  });

  const filteredRatings = Array.isArray(ratings) 
    ? ratings.filter((r: any) => 
        r.name.toLowerCase().includes(search.toLowerCase()) || 
        r.phone.includes(search)
      )
    : [];

  // Calculate global stats
  const totalReviews = filteredRatings.reduce((sum: number, r: any) => sum + r.totalRatings, 0);
  const globalAverage = totalReviews > 0 
    ? filteredRatings.reduce((sum: number, r: any) => sum + (r.averageRating * r.totalRatings), 0) / totalReviews 
    : 0;
  
  const lowPerformers = filteredRatings.filter((r: any) => r.totalRatings > 0 && r.averageRating < 4.0).length;

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={14} 
            className={star <= rating ? "text-[#FCD34D] fill-[#FCD34D]" : "text-gray-300"} 
          />
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Ratings & Performance</h1>
          <p className="text-sm text-gray-500">Monitor rider quality and customer feedback.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#FCD34D] rounded-lg text-black"><Star size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Global Average</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 flex items-end gap-2">
              {globalAverage.toFixed(1)} <span className="text-lg text-gray-400 mb-1">/ 5.0</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><TrendingUp size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Total Reviews</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{totalReviews}</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg text-red-600"><AlertCircle size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Low Performers</span>
            </div>
            <div className="text-3xl font-bold text-red-600">{lowPerformers}</div>
            <p className="text-xs text-gray-400 mt-1">Riders with rating &lt; 4.0</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by rider name or phone..."
            className="w-full max-w-md pl-10 p-2.5 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Ratings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Rider</th>
                <th className="p-4 font-semibold text-gray-600">Phone</th>
                <th className="p-4 font-semibold text-gray-600">Total Rated Trips</th>
                <th className="p-4 font-semibold text-gray-600">Average Rating</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading ratings...</td></tr>}
              {!isLoading && filteredRatings.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-500">No riders found.</td></tr>}
              
              {filteredRatings.map((rider: any) => (
                <tr key={rider.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{rider.name}</td>
                  <td className="p-4 text-gray-700">{rider.phone}</td>
                  <td className="p-4 text-gray-700">{rider.totalRatings}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900">{rider.totalRatings > 0 ? rider.averageRating.toFixed(1) : 'N/A'}</span>
                      {renderStars(rider.averageRating)}
                    </div>
                  </td>
                  <td className="p-4">
                    {rider.totalRatings === 0 ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">NO RATINGS</span>
                    ) : rider.averageRating < 4.0 ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">NEEDS REVIEW</span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">GOOD</span>
                    )}
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