"use client";

import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import dynamic from 'next/dynamic';

// Load Map dynamically to prevent SSR errors
const MapWithNoSSR = dynamic(() => import('./MapComponent'), { ssr: false });

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const navItems = [
  { icon: "⌂", label: "Dashboard", active: true },
  { icon: "♧", label: "Trip Management" },
  { icon: "♙", label: "Customers" },
  { icon: "♟", label: "Riders" },
  { icon: "⌖", label: "Live Map" },
  { icon: "⚿", label: "Motorcycles & Documents" },
  { icon: "◷", label: "Dispatch & Availability" },
  { icon: "▣", label: "Fare & Pricing" },
  { icon: "◎", label: "Revenue & Commissions" },
  { icon: "▤", label: "Payments & Reconciliation" },
  { icon: "♧", label: "Rider Earnings & Payouts" },
  { icon: "◉", label: "Cancellations & Refunds" },
  { icon: "✉", label: "Support & Complaints" },
  { icon: "⚠", label: "Safety & Incidents" },
  { icon: "☆", label: "Ratings & Reviews" },
  { icon: "♧", label: "Counties & Zones" },
  { icon: "▦", label: "Google Sheets Sync" },
  { icon: "▧", label: "Reports" },
  { icon: "♙", label: "Staff & Permissions" },
  { icon: "♥", label: "System Health" },
];

export default function AdminDashboard() {
  const [date, setDate] = useState("");
  
  // Fix: Only set the date on the client side to avoid hydration mismatch
  useEffect(() => {
    setDate(new Date().toLocaleDateString('en-KE',{weekday:'short',day:'2-digit',month:'short',year:'numeric'}));
  }, []);

  const donutData = {
    labels: ['Completed','In Progress','Pending','Cancelled'],
    datasets: [{ data: [606,135,59,42], backgroundColor: ['#20b66a','#2784f5','#ffb51b','#fa4e52'], borderWidth: 0 }]
  };

  const barData = {
    labels: ['Apr 19','Apr 20','Apr 21','Apr 22','Apr 23','Apr 24','Apr 25'],
    datasets: [{ data: [330,370,440,370,490,560,630], backgroundColor: '#ffb91c', borderRadius: 4 }]
  };

  // Fixed static percentages to prevent hydration mismatch
  const kpis = [
    { icon: "🏍", label: "Total Trips (Today)", val: "842", trend: "12%" },
    { icon: "♟", label: "Active Riders", val: "236", trend: "8%" },
    { icon: "♙", label: "Active Customers", val: "4,892", trend: "15%" },
    { icon: "KSh", label: "Total Revenue (Today)", val: "412,560", trend: "18%" },
    { icon: "★", label: "Average Rating", val: "4.7", trend: "2%" }
  ];

  return (
    <div className="flex h-screen bg-[#f4f7fb] font-sans text-[#10203e] overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-[238px] bg-[#0b121b] text-[#e8eef8] flex flex-col z-20 shrink-0">
        <div className="flex items-center gap-2 px-4 py-5 border-b border-slate-700">
          <b className="text-4xl italic text-[#ffbd19]">ϟ</b>
          <div>
            <div className="text-2xl font-extrabold text-white leading-none">TORQ</div>
            <div className="text-[9px] tracking-widest mt-1">RIDE • DELIVER • CONNECT</div>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto mt-2 px-2 space-y-1 pb-4">
          {navItems.map((item, i) => (
            <a key={i} href="#" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${item.active ? 'bg-[#ffbd19] text-[#101827]' : 'text-[#d6deea] hover:bg-[#202b39]'}`}>
              <span>{item.icon}</span> <span>{item.label}</span>
            </a>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-700 text-xs text-slate-400">
          🟢 System Operational<br/><br/>TORQ Admin • Demo UI
        </div>
      </aside>

      {/* MAIN CONTENT */}
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

        {/* KPI CARDS */}
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

        {/* CHARTS & MAP */}
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

        {/* TABLES */}
        <section className="grid grid-cols-[1.55fr_1fr] gap-3 mb-3">
          <div className="bg-white border border-[#dfe7f1] rounded-xl p-3 shadow-sm overflow-hidden">
            <div className="flex justify-between mb-3"><b className="text-sm">Recent Trips</b><button className="text-xs text-blue-600">View all ›</button></div>
            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap text-left">
                <thead><tr className="bg-[#f7f9fc] text-[#51627d] text-[10px]"><th className="p-3">Trip #</th><th className="p-3">Customer</th><th className="p-3">Rider</th><th className="p-3">Pickup</th><th className="p-3">Destination</th><th className="p-3">Fare</th><th className="p-3">Status</th><th className="p-3">Time</th></tr></thead>
                <tbody>
                  <tr className="border-t border-[#edf1f6] text-[10px]"><td className="p-3">TRP-7842</td><td className="p-3">Grace Wanjiku</td><td className="p-3">Brian Otieno</td><td className="p-3">Westlands</td><td className="p-3">Kileleshwa</td><td className="p-3">KSh 280</td><td className="p-3"><span className="bg-[#dcfce7] text-[#15803d] px-2 py-1 rounded-full text-[9px] font-bold">Completed</span></td><td className="p-3">10:42 AM</td></tr>
                  <tr className="border-t border-[#edf1f6] text-[10px]"><td className="p-3">TRP-7841</td><td className="p-3">James Mwangi</td><td className="p-3">Peter Njoroge</td><td className="p-3">CBD</td><td className="p-3">Upper Hill</td><td className="p-3">KSh 150</td><td className="p-3"><span className="bg-[#dbeafe] text-[#1d4ed8] px-2 py-1 rounded-full text-[9px] font-bold">In Progress</span></td><td className="p-3">10:38 AM</td></tr>
                  <tr className="border-t border-[#edf1f6] text-[10px]"><td className="p-3">TRP-7840</td><td className="p-3">Amina Hassan</td><td className="p-3">Daniel Mutua</td><td className="p-3">Kibera</td><td className="p-3">Westlands</td><td className="p-3">KSh 320</td><td className="p-3"><span className="bg-[#dcfce7] text-[#15803d] px-2 py-1 rounded-full text-[9px] font-bold">Completed</span></td><td className="p-3">10:35 AM</td></tr>
                  <tr className="border-t border-[#edf1f6] text-[10px]"><td className="p-3">TRP-7839</td><td className="p-3">Collins Ochieng</td><td className="p-3">Samuel Kimani</td><td className="p-3">Mathare</td><td className="p-3">CBD</td><td className="p-3">KSh 180</td><td className="p-3"><span className="bg-[#fef3c7] text-[#a16207] px-2 py-1 rounded-full text-[9px] font-bold">Pending</span></td><td className="p-3">10:31 AM</td></tr>
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
