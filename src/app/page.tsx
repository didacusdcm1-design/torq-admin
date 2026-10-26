"use client";

import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import dynamic from 'next/dynamic';
import Link from "next/link";

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
          <span>♧</span> <span>Trip Management</span>
        </Link>
        <Link href="/customers" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#d6deea] hover:bg-[#202b39]">
          <span>♙</span> <span>Customers</span>
        </Link>
        <Link href="/riders" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#d6deea] hover:bg-[#202b39]">
          <span>♟</span> <span>Riders</span>
        </Link>
        <Link href="/map" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#d6deea] hover:bg-[#202b39]">
          <span>⌖</span> <span>Live Map</span>
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
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDate(new Date().toLocaleDateString('en-KE',{weekday:'short',day:'2-digit',month:'short',year:'numeric'}));
    
    fetch('https://torq-backend.onrender.com/trips/admin/all')
      .then(res => res.json())
      .then(data => {
        setTrips(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch trips:", err);
        setLoading(false);
      });
  }, []);

  const donutData = {
    labels: ['Completed','In Progress','Pending','Cancelled'],
    datasets: [{ data: [606,135,59,42], backgroundColor: ['#20b66a','#2784f5','#ffb51b','#fa4e52'], borderWidth: 0 }]
  };

  const barData = {
    labels: ['Apr 19','Apr 20','Apr 21','Apr 22','Apr 23','Apr 24','Apr 25'],
    datasets: [{ data: [330,370,440,370,490,560,630], backgroundColor: '#ffb91c', borderRadius: 4 }]
  };

  const kpis = [
    { icon: "🏍", label: "Total Trips (Today)", val: "842", trend: "12%" },
    { icon: "♟", label: "Active Riders", val: "236", trend: "8%" },
    { icon: "♙", label: "Active Customers", val: "4,892", trend: "15%" },
    { icon: "KSh", label: "Total Revenue (Today)", val: "412,560", trend: "18%" },
    { icon: "★", label: "Average Rating", val: "4.7", trend: "2%" }
  ];

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
          <div className="text-xs bg-white border rounded-lg px-3 py-2 shadow-sm">{date}</div>
        </div>

        <section className="grid grid-cols-5 gap-3 mb-3">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-white border border-[#dfe7f1] rounded-xl p-4 shadow-sm">
              <div className="flex gap-3 items-center">
                <div className="bg-[#ffbd19] text-[#111827] rounded-xl p-3 text-xl font-bold">{kpi.icon}</div>
                <div>
                  <div className="text-[11px] text-slate-500">{kpi.label}</div>
                  <b className="text-2xl">{kpi.val}</b>
                </div>
              </div>
              <p className="text-[10px] text-green-600 mt-2">↑ {kpi.trend} <span className="text-slate-400">vs yesterday</span></p>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-[1.55fr_1fr] gap-3 mb-3">
          <div className="bg-white border border-[#dfe7f1] rounded-xl p-3 shadow-sm">
            <div className="flex justify-between mb-3">
              <b className="text-sm">Live Trips <span className="text-green-500">●</span> <small className="font-normal text-slate-500">Live riders on map</small></b>
              <a href="#" className="text-xs text-blue-600">View all ›</a>
            </div>
            <div className="relative h-[330px] rounded-lg overflow-hidden border">
              <MapWithNoSSR />
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

        <section className="grid grid-cols-[1.55fr_1fr] gap-3 mb-3">
          <div className="bg-white border border-[#dfe7f1] rounded-xl p-3 shadow-sm overflow-hidden">
            <div className="flex justify-between mb-3"><b className="text-sm">Recent Trips (Live from Database)</b><button className="text-xs text-blue-600">View all ›</button></div>
            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap text-left">
                <thead><tr className="bg-[#f7f9fc] text-[#51627d] text-[10px]"><th className="p-3">Trip #</th><th className="p-3">Customer</th><th className="p-3">Rider</th><th className="p-3">Pickup Lat/Lng</th><th className="p-3">Destination Lat/Lng</th><th className="p-3">Fare</th><th className="p-3">Status</th></tr></thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={7} className="p-3 text-center text-slate-500">Loading live trips...</td></tr>
                  ) : trips.length === 0 ? (
                    <tr><td colSpan={7} className="p-3 text-center text-slate-500">No trips found in the database yet.</td></tr>
                  ) : (
                    trips.map((trip: any) => (
                      <tr key={trip.id} className="border-t border-[#edf1f6] text-[10px]">
                        <td className="p-3">{trip.id.substring(0, 8)}</td>
                        <td className="p-3">{trip.customer?.email || 'N/A'}</td>
                        <td className="p-3">{trip.rider?.email || 'Pending'}</td>
                        <td className="p-3">{trip.pickupLat.toFixed(2)}, {trip.pickupLng.toFixed(2)}</td>
                        <td className="p-3">{trip.dropoffLat.toFixed(2)}, {trip.dropoffLng.toFixed(2)}</td>
                        <td className="p-3">KSh {trip.estimatedFare}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-[9px] font-bold ${
                            trip.status === 'COMPLETED' ? 'bg-[#dcfce7] text-[#15803d]' : 
                            trip.status === 'IN_PROGRESS' ? 'bg-[#dbeafe] text-[#1d4ed8]' : 
                            'bg-[#fef3c7] text-[#a16207]'
                          }`}>
                            {trip.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-[#dfe7f1] rounded-xl p-3 shadow-sm">
            <div className="flex justify-between mb-3"><b className="text-sm">Top Performing Riders</b><button className="text-xs text-blue-600">View all ›</button></div>
            <table className="w-full text-left">
              <thead><tr className="bg-[#f7f9fc] text-[#51627d] text-[10px]"><th className="p-3">#</th><th className="p-3">Rider</th><th className="p-3">Trips</th><th className="p-3">Rating</th><th className="p-3">Earnings</th></tr></thead>
              <tbody>
                <tr className="border-t border-[#edf1f6] text-[10px]"><td className="p-3">1</td><td className="p-3">John Kamau</td><td className="p-3">184</td><td className="p-3">⭐ 4.9</td><td className="p-3">KSh 86,420</td></tr>
                <tr className="border-t border-[#edf1f6] text-[10px]"><td className="p-3">2</td><td className="p-3">Peter Njoroge</td><td className="p-3">162</td><td className="p-3">⭐ 4.8</td><td className="p-3">KSh 74,230</td></tr>
                <tr className="border-t border-[#edf1f6] text-[10px]"><td className="p-3">3</td><td className="p-3">Daniel Mutua</td><td className="p-3">148</td><td className="p-3">⭐ 4.7</td><td className="p-3">KSh 68,120</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
