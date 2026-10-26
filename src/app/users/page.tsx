"use client";

import { useEffect, useState } from "react";
import { Users, Car, Search, RefreshCw, ChevronLeft } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch('https://torq-backend.onrender.com/trips/admin/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch users:", err);
        setLoading(false);
      });
  }, []);

  const filteredUsers = users.filter(u => u.email?.toLowerCase().includes(search.toLowerCase()));
  const riders = filteredUsers.filter(u => u.role === 'RIDER');
  const customers = filteredUsers.filter(u => u.role === 'CUSTOMER');

  const UserTable = ({ title, data, roleColor }: { title: string, data: any[], roleColor: string }) => (
    <div className="bg-white border border-[#dfe7f1] rounded-xl shadow-sm overflow-hidden mb-8">
      <div className="p-4 border-b border-[#dfe7f1] bg-[#f7f9fc]">
        <h2 className="text-sm font-bold text-[#51627d] uppercase tracking-wider">{title} ({data.length})</h2>
      </div>
      <table className="w-full text-left whitespace-nowrap">
        <thead>
          <tr className="bg-white text-[#51627d] text-[10px] uppercase border-b border-[#edf1f6]">
            <th className="p-4 font-bold">User ID</th>
            <th className="p-4 font-bold">Email</th>
            <th className="p-4 font-bold">Phone</th>
            <th className="p-4 font-bold">Role</th>
            <th className="p-4 font-bold">Joined</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={5} className="p-8 text-center text-slate-500">No {title.toLowerCase()} found.</td></tr>
          ) : (
            data.map((user) => (
              <tr key={user.id} className="border-t border-[#edf1f6] text-xs hover:bg-gray-50">
                <td className="p-4 font-mono text-gray-500">{user.id.substring(0, 8)}</td>
                <td className="p-4 font-semibold">{user.email}</td>
                <td className="p-4">{user.phone || 'N/A'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${roleColor}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f4f7fb] font-sans text-[#10203e] overflow-hidden">
      <aside className="w-[238px] bg-[#0b121b] text-[#e8eef8] flex flex-col z-20 shrink-0">
        <div className="flex items-center gap-2 px-4 py-5 border-b border-slate-700">
          <b className="text-4xl italic text-[#ffbd19]">ϟ</b>
          <div>
            <div className="text-2xl font-extrabold text-white leading-none">TORQ</div>
            <div className="text-[9px] tracking-widest mt-1">RIDE • DELIVER • CONNECT</div>
          </div>
        </div>
        <nav className="flex-1 mt-2 px-2 space-y-1">
          <a href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#d6deea] hover:bg-[#202b39]">
            <span>⌂</span> Dashboard
          </a>
          <a href="/users" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold bg-[#ffbd19] text-[#101827]">
            <span>♙</span> Riders & Customers
          </a>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-5">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-extrabold">User Management</h1>
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by email..." 
              className="w-full pl-9 pr-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffbd19]"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading database users...</div>
        ) : (
          <>
            <UserTable title="Riders" data={riders} roleColor="bg-green-100 text-green-700" />
            <UserTable title="Customers" data={customers} roleColor="bg-blue-100 text-blue-700" />
          </>
        )}
      </main>
    </div>
  );
}
