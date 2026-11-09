"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import dynamic from 'next/dynamic';
import { Bell, Search, Bike, Users, Star, Wallet } from "lucide-react";
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';

// Dynamically import the map so it doesn't break SSR
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });

const API_URL = "https://torq-backend.onrender.com/api/admin/dashboard";

// Define fallback data just in case the API is loading or fails
const fallbackPieData = [
  { name: 'Completed', value: 0, color: '#10b981' },
  { name: 'In Progress', value: 0, color: '#3b82f6' },
  { name: 'Pending', value: 0, color: '#f59e0b' },
  { name: 'Cancelled', value: 0, color: '#ef4444' },
];

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    setIsMounted(true);
    setLastUpdated(new Date().toLocaleTimeString('en-US'));
    const interval = setInterval(() => {
      setLastUpdated(new Date().toLocaleTimeString('en-US'));
    }, 30000);

    // Fetch API Data
    async function fetchDashboardData() {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setDashboardData(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setLoading(false);
      }
    }
    fetchDashboardData();

    return () => clearInterval(interval);
  }, []);

  // Prepare pie chart data from API (fallback if loading/error)
  const pieData = dashboardData ? [
    { name: 'Completed', value: dashboardData.tripStatus.completed, color: '#10b981' },
    { name: 'In Progress', value: dashboardData.tripStatus.inProgress, color: '#3b82f6' },
    { name: 'Pending', value: dashboardData.tripStatus.pending, color: '#f59e0b' },
    { name: 'Cancelled', value: dashboardData.tripStatus.cancelled, color: '#ef4444' },
  ] : fallbackPieData;

  // Total for percentage calculation
  const totalTrips = pieData.reduce((acc, curr) => acc + curr.value, 0) || 1;

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, Admin. Here's what's happening with TORQ today.</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Last updated: {lastUpdated}
            </div>
            <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600">
              Wed, 28 Oct 2026
            </div>
          </div>
        </div>

        {/* KPI Cards - NOW USING REAL DATA */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#FCD34D] rounded-lg text-black"><Bike size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Total Trips (Today)</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? "..." : dashboardData?.stats?.totalTrips || 0}
            </div>
            <div className="text-xs text-green-500 mt-1">↑ 12% vs yesterday</div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#FCD34D] rounded-lg text-black"><Bike size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Active Riders</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? "..." : dashboardData?.stats?.activeRiders || 0}
            </div>
            <div className="text-xs text-green-500 mt-1">↑ 8% vs yesterday</div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#FCD34D] rounded-lg text-black"><Users size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Active Customers</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? "..." : dashboardData?.stats?.activeCustomers || 0}
            </div>
            <div className="text-xs text-green-500 mt-1">↑ 15% vs yesterday</div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#FCD34D] rounded-lg text-black"><Wallet size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Total Revenue (Today)</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? "..." : dashboardData?.stats?.totalRevenue || 0}
            </div>
            <div className="text-xs text-green-500 mt-1">↑ 18% vs yesterday</div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#FCD34D] rounded-lg text-black"><Star size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Average Rating</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? "..." : dashboardData?.stats?.averageRating || 0}
            </div>
            <div className="text-xs text-green-500 mt-1">↑ 2% vs last week</div>
          </div>
        </div>

        {/* Middle Section - Map & Pie Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* Map Card */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-gray-900">Live Trips</h2>
                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Live riders on map
                </span>
              </div>
              <button className="text-sm text-blue-600 hover:underline">View full map →</button>
            </div>
            
            <div className="h-[350px] w-full rounded-lg overflow-hidden border border-gray-100 relative z-0">
              {isMounted && (
                <MapContainer center={[-1.286389, 36.817223]} zoom={11} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[-1.286389, 36.817223]} />
                </MapContainer>
              )}
            </div>
          </div>

          {/* Trip Status Chart - NOW USING REAL DATA */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4">Trip Status</h2>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {pieData.map((item) => (
                <div key={item.name} className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-gray-900 font-medium">
                    {Math.round((item.value / totalTrips) * 100)}% ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section - Revenue Chart */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-gray-900">Revenue Overview</h2>
            <select className="border border-gray-200 rounded-md px-3 py-1.5 text-sm bg-gray-50">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              {/* Using API data for the bar chart if available */}
              <BarChart data={loading ? [] : dashboardData?.revenueChart || []}>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="amount" fill="#FCD34D" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}