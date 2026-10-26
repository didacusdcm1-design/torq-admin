"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Search } from "lucide-react";

export default function RidersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch('https://torq-backend.onrender.com/trips/admin/users')
      .then(res => res.json())
      .then(data => { setUsers(data.filter((u: any) => u.role === 'RIDER')); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const filteredRiders = users.filter(u => u.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex h-screen bg-[#f4f7fb] font-sans text-[#10203e] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-extrabold">Rider Management</h1>
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input type="text" placeholder="Search riders..." className="w-full pl-9 pr-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffbd19]" onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="bg-white border border-[#dfe7f1] rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left whitespace-nowrap">
            <thead><tr className="bg-[#f7f9fc] text-[#51627d] text-[10px] uppercase border-b border-[#edf1f6]"><th className="p-4 font-bold">Rider ID</th><th className="p-4 font-bold">Email</th><th className="p-4 font-bold">Phone</th><th className="p-4 font-bold">Joined</th><th className="p-4 font-bold">Status</th></tr></thead>
            <tbody>
              {loading ? ( <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading riders...</td></tr> ) : filteredRiders.length === 0 ? ( <tr><td colSpan={5} className="p-8 text-center text-slate-500">No riders found.</td></tr> ) : (
                filteredRiders.map((user) => (
                  <tr key={user.id} className="border-t border-[#edf1f6] text-xs hover:bg-gray-50">
                    <td className="p-4 font-mono text-gray-500">{user.id.substring(0, 8)}</td>
                    <td className="p-4 font-semibold">{user.email}</td>
                    <td className="p-4">{user.phone || 'N/A'}</td>
                    <td className="p-4 text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="p-4"><span className="px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700">ACTIVE</span></td>
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
