"use client";

import { useQuery } from "@tanstack/react-query";
import dynamic from 'next/dynamic';
import Link from "next/link";
import { RefreshCw } from "lucide-react";

const MapWithNoSSR = dynamic(() => import('../MapComponent'), { ssr: false });

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
        <Link href="/trips" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#d6deea] hover:bg-[#202b39]">
          <span>🚕</span> <span>Trip Management</span>
        </Link>
        <Link href="/map" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold bg-[#ffbd19] text-[#101827]">
          <span>🗺️</span> <span>Live Map</span>
        </Link>
        <Link href="/pricing" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#d6deea] hover:bg-[#202b39]">
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

export default function LiveMapPage() {
  const { data: trips, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ['liveTrips'],
    queryFn: async () => {
      const res = await fetch('https://torq-backend.onrender.com/trips/admin/all');
      if (!res.ok) throw new Error('Failed to fetch trips');
      return res.json();
    },
  });

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : 'Loading...';

  const activeTrips = trips?.filter((t: any) => ['REQUESTED', 'ACCEPTED', 'ARRIVED', 'IN_PROGRESS'].includes(t.status)) || [];

  return (
    <div className="flex h-screen bg-[#f4f7fb] font-sans text-[#10203e] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-5 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-extrabold">Live Operations Map</h1>
            <p className="text-xs text-slate-500 mt-1">Real-time view of active trips across Nairobi.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs bg-white border rounded-lg px-3 py-2 shadow-sm flex items-center gap-2">
              <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
              Last updated: {lastUpdated}
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#dfe7f1] rounded-xl shadow-sm p-3 flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <b className="text-sm">Active Trips <span className="text-green-500">●</span> <small className="font-normal text-slate-500">({activeTrips.length} active)</small></b>
          </div>
          <div className="flex-1 rounded-lg overflow-hidden border relative">
            <MapWithNoSSR trips={activeTrips} />
          </div>
        </div>
      </main>
    </div>
  );
}
