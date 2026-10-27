"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Search, RefreshCw, CheckCircle } from "lucide-react";

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
        <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#d6deea] hover:bg-[#202b39]"><span>⌂</span> <span>Dashboard</span></Link>
        <Link href="/trips" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#d6deea] hover:bg-[#202b39]"><span>🚕</span> <span>Trip Management</span></Link>
        <Link href="/map" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#d6deea] hover:bg-[#202b39]"><span>🗺️</span> <span>Live Map</span></Link>
        <Link href="/pricing" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#d6deea] hover:bg-[#202b39]"><span>💰</span> <span>Fare & Pricing</span></Link>
        <Link href="/finance" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#d6deea] hover:bg-[#202b39]"><span>💳</span> <span>Wallets & Payouts</span></Link>
        <Link href="/customers" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#d6deea] hover:bg-[#202b39]"><span>♙</span> <span>Customers</span></Link>
        <Link href="/riders" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold bg-[#ffbd19] text-[#101827]"><span>♟</span> <span>Riders</span></Link>
      </nav>
      <div className="p-4 border-t border-slate-700 text-xs text-slate-400">🟢 System Operational</div>
    </aside>
  );
};

export default function RidersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: riders, isLoading, dataUpdatedAt, refetch } = useQuery({
    queryKey: ['adminRiders'],
    queryFn: async () => {
      const res = await fetch('https://torq-backend.onrender.com/admin/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      return res.json();
    },
  });

  const approveRider = async (userId: string) => {
    try {
      const res = await fetch(`https://torq-backend.onrender.com/trips/admin/riders/${userId}/approve`, {
        method: 'PATCH',
      });
      if (res.ok) {
        alert('Rider Approved Successfully!');
        refetch();
      }
    } catch (e) {
      alert('Failed to approve rider');
    }
  };

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : 'Loading...';
  const filteredRiders = riders?.filter((u: any) => (u.email || "").toLowerCase().includes(searchTerm.toLowerCase())) || [];

  return (
    <div className="flex h-screen bg-[#f4f7fb] font-sans text-[#10203e] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-extrabold">Rider Management</h1>
            <p className="text-xs text-slate-500 mt-1">View, approve, and manage all registered riders.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs bg-white border rounded-lg px-3 py-2 shadow-sm flex items-center gap-2">
              <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
              Last updated: {lastUpdated}
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#dfe7f1] rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#dfe7f1] bg-[#f7f9fc] flex justify-between items-center">
            <div className="relative w-96">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input 
                type="text" placeholder="Search riders by email..." 
                className="w-full pl-9 pr-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffbd19] text-sm"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-xs text-slate-500 font-semibold">Showing {filteredRiders.length} riders</div>
          </div>

          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-white text-[#51627d] text-[10px] uppercase border-b border-[#edf1f6]">
                <th className="p-4 font-bold">Rider Name / Email</th>
                <th className="p-4 font-bold">Phone Number</th>
                <th className="p-4 font-bold">Password (Hashed)</th>
                <th className="p-4 font-bold">OTP Code</th>
                <th className="p-4 font-bold">Verification Status</th>
                <th className="p-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">Loading riders...</td></tr>
              ) : filteredRiders.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No riders found.</td></tr>
              ) : (
                filteredRiders.map((user: any) => (
                  <tr key={user.id} className="border-t border-[#edf1f6] text-xs hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-semibold">{user.riderProfile?.fullName || 'N/A'}</div>
                      <div className="text-slate-500">{user.email}</div>
                    </td>
                    <td className="p-4 font-mono">{user.phone || 'N/A'}</td>
                    <td className="p-4 font-mono text-slate-400 max-w-[150px] truncate" title={user.password}>{user.password}</td>
                    <td className="p-4 font-mono text-green-600 font-bold">{user.otpCode || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        user.riderProfile?.verificationStatus === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                        user.riderProfile?.verificationStatus === 'PENDING' ? 'bg-orange-100 text-orange-700' : 
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {user.riderProfile?.verificationStatus || 'INCOMPLETE'}
                      </span>
                    </td>
                    <td className="p-4">
                      {user.riderProfile?.verificationStatus === 'PENDING' && (
                        <button 
                          onClick={() => approveRider(user.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1 text-[10px] font-bold hover:bg-green-700"
                        >
                          <CheckCircle size={12} /> Approve
                        </button>
                      )}
                    </td>
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
