"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import dynamic from 'next/dynamic';
import Link from "next/link";
import { RefreshCw } from "lucide-react";

const MapWithNoSSR = dynamic(() => import('./MapComponent'), { ssr: false });
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

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
        <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold bg-[#ffbd19] text-[#101827]">
          <span>⌂</span> <span>Dashboard</span>
        </Link>
        <Link href="/trips" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#d6deea] hover:bg-[#202b39]">
          <span>🚕</span> <span>Trip Management</span>
        </Link>
        <Link href="/map" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#d6deea] hover:bg-[#202b39]">
          <span>🗺️</span> <span>Live Map</span>
        </Link>
        <Link href="/pricing" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#d6deea] hover:bg-[#202b39]">

     <Link href="/finance" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#d6deea] hover:bg-[#202b39]">
       <span>💳</span> <span>Wallets & Payouts</span>
     </Link>
          <span>💰</span> <span>Fare & Pricing</span>
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

export default function AdminDashboard() {
  const [date, setDate] = useState("");
  
  useEffect(() => {
    setDate(new Date().toLocaleDateString('en-KE',{weekday:'short',day:'2-digit',month:'short',year:'numeric'}));
  }, []);

  const { data: stats, isLoading, isError, dataUpdatedAt } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const res = await fetch('https://torq-backend.onrender.com/admin/dashboard-stats');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
  });

  const { data: tripsData } = useQuery({
    queryKey: ['dashboardTrips'],
    queryFn: async () => {
      const res = await fetch('https://torq-backend.onrender.com/trips/admin/all');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
  });

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : 'Loading...';

  const donutData = {
    labels: ['Completed','In Progress','Pending','Cancelled'],
    datasets: [{ data: [606,135,59,42], backgroundColor: ['#20b66a','#2784f5','#ffb51b','#fa4e52'], borderWidth: 0 }]
  };

  const barData = {
    labels: ['Apr 19','Apr 20','Apr 21','Apr 22','Apr 23','Apr 24','Apr 25'],
    datasets: [{ data: [330,370,440,370,490,560,630], backgroundColor: '#ffb91c', borderRadius: 4 }]
  };

  const activeTrips = tripsData?.filter((t: any) => ['REQUESTED', 'ACCEPTED', 'ARRIVED', 'IN_PROGRESS'].includes(t.status)) || [];

  return (
    <div className="flex h-screen bg-[#f4f7fb] font-sans text-[#10203e] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-5">
        <header className="h-14 bg-[#101822] text-white rounded-lg flex items-center justify-between px-4 mb-5">
          <button className="text-xl">☰</button>
          <div className="rounded-lg bg-slate-700 px-4 py-2 w-80 text-xs flex items-center gap-2">
            <span>⌕</span>
            <input className="bg-transparent outline-none w-full text-white placeholder-slate-400" placeholder="Search trips, riders, customers..." />
          </div>
          <div className="text-xs flex items-center gap-4">
            <span>♧</span> <span>🔔</span> <b>Admin</b> · Super Admin
          </div>
        </header>

        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-extrabold">Dashboard</h1>
            <p className="text-xs text-slate-500 mt-1">Welcome back, Admin. Here's what's happening with TORQ today.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs bg-white border rounded-lg px-3 py-2 shadow-sm flex items-center gap-2">
              <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
              Last updated: {lastUpdated}
            </div>
            <div className="text-xs bg-white border rounded-lg px-3 py-2 shadow-sm">{date}</div>
          </div>
        </div>

        {isError && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 text-sm">
            Failed to connect to the backend. Please check your Render server.
          </div>
        )}

        <section className="grid grid-cols-5 gap-3 mb-3">
          <div className="bg-white border border-[#dfe7f1] rounded-xl p-4 shadow-sm">
            <div className="flex gap-3 items-center">
              <div className="bg-[#ffbd19] text-[#111827] rounded-xl p-3 text-xl font-bold">🏍</div>
              <div>
                <div className="text-[11px] text-slate-500">Total Trips (Today)</div>
                <b className="text-2xl">{isLoading ? "..." : stats?.totalTripsToday || 0}</b>
              </div>
            </div>
            <p className="text-[10px] text-green-600 mt-2">↑ 12% <span className="text-slate-400">vs yesterday</span></p>
          </div>

          <div className="bg-white border border-[#dfe7f1] rounded-xl p-4 shadow-sm">
            <div className="flex gap-3 items-center">
              <div className="bg-[#ffbd19] text-[#111827] rounded-xl p-3 text-xl font-bold">♟</div>
              <div>
                <div className="text-[11px] text-slate-500">Active Riders</div>
                <b className="text-2xl">{isLoading ? "..." : stats?.activeRiders || 0}</b>
              </div>
            </div>
            <p className="text-[10px] text-green-600 mt-2">↑ 8% <span className="text-slate-400">vs yesterday</span></p>
          </div>

          <div className="bg-white border border-[#dfe7f1] rounded-xl p-4 shadow-sm">
            <div className="flex gap-3 items-center">
              <div className="bg-[#ffbd19] text-[#111827] rounded-xl p-3 text-xl font-bold">♙</div>
              <div>
                <div className="text-[11px] text-slate-500">Active Customers</div>
                <b className="text-2xl">{isLoading ? "..." : stats?.activeCustomers || 0}</b>
              </div>
            </div>
            <p className="text-[10px] text-green-600 mt-2">↑ 15% <span className="text-slate-400">vs yesterday</span></p>
          </div>

          <div className="bg-white border border-[#dfe7f1] rounded-xl p-4 shadow-sm">
            <div className="flex gap-3 items-center">
              <div className="bg-[#ffbd19] text-[#111827] rounded-xl p-3 text-xl font-bold">KSh</div>
              <div>
                <div className="text-[11px] text-slate-500">Total Revenue (Today)</div>
                <b className="text-2xl">{isLoading ? "..." : (stats?.revenueToday || 0).toLocaleString()}</b>
              </div>
            </div>
            <p className="text-[10px] text-green-600 mt-2">↑ 18% <span className="text-slate-400">vs yesterday</span></p>
          </div>

          <div className="bg-white border border-[#dfe7f1] rounded-xl p-4 shadow-sm">
            <div className="flex gap-3 items-center">
              <div className="bg-[#ffbd19] text-[#111827] rounded-xl p-3 text-xl font-bold">★</div>
              <div>
                <div className="text-[11px] text-slate-500">Average Rating</div>
                <b className="text-2xl">4.7</b>
              </div>
            </div>
            <p className="text-[10px] text-green-600 mt-2">↑ 2% <span className="text-slate-400">vs last week</span></p>
          </div>
        </section>

        <section className="grid grid-cols-[1.55fr_1fr] gap-3 mb-3">
          <div className="bg-white border border-[#dfe7f1] rounded-xl p-3 shadow-sm">
            <div className="flex justify-between mb-3">
              <b className="text-sm">Live Trips <span className="text-green-500">●</span> <small className="font-normal text-slate-500">Live riders on map</small></b>
              <Link href="/map" className="text-xs text-blue-600">View full map ›</Link>
            </div>
            <div className="relative h-[330px] rounded-lg overflow-hidden border">
              <MapWithNoSSR trips={activeTrips} />
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-white border border-[#dfe7f1] rounded-xl p-4 shadow-sm">
              <b className="text-sm">Trip Status</b>
              <div className="flex items-center gap-4 mt-3">
                <div className="w-2/5 relative"><Doughnut data={donutData} options={{ cutout: '72%', plugins: { legend: { display: false } } }} /></div>
                <div className="flex-1 space-y-3 text-[11px]">
                  <p>🟢 Completed <b className="float-right">72% (606)</b></p>
                  <p>🔵 In Progress <b className="float-right">16% (135)</b></p>
                  <p>🟡 Pending <b className="float-right">7% (59)</b></p>
                  <p>🔴 Cancelled <b className="float-right">5% (42)</b></p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#dfe7f1] rounded-xl p-4 shadow-sm">
              <div className="flex justify-between mb-2">
                <b className="text-sm">Revenue Overview</b>
                <select className="border rounded px-2 py-1 text-[10px] outline-none"><option>Last 7 days</option><option>Last 30 days</option></select>
              </div>
              <div className="h-[140px]"><Bar data={barData} options={{ plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { color: '#edf1f6' } } } }} /></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}