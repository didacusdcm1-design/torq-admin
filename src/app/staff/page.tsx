"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { UserCog, Plus, UserCheck, Eye, Lock } from "lucide-react";

export default function StaffPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("SUPPORT_OFFICER");
  const [password, setPassword] = useState("");

  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");

  const { data: staff, isLoading } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => (await api.get('/staff')).data,
  });

  const createMutation = useMutation({
    mutationFn: async (newStaff: any) => await api.post('/staff', newStaff),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      setIsModalOpen(false);
      setName(""); setEmail(""); setPassword("");
    }
  });

  const toggleMutation = useMutation({
    mutationFn: async (id: string) => await api.patch(`/staff/${id}/toggle`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff"] }),
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async ({ id, password }: { id: string, password: string }) => {
      return await api.patch(`/staff/${id}/password`, { password });
    },
    onSuccess: () => {
      setEditingStaff(null);
      setNewPassword("");
      alert("Password updated successfully!");
    }
  });

  const activeCount = staff?.filter((s: any) => s.isActive).length || 0;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
            <p className="text-sm text-gray-500">Manage your administrative team.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-[#FCD34D] text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors">
            <Plus size={18} /> Add Staff
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#FCD34D] rounded-lg text-black"><UserCog size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Total Staff</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{staff?.length || 0}</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg text-green-600"><UserCheck size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Active Staff</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{activeCount}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Name</th>
                <th className="p-4 font-semibold text-gray-600">Email</th>
                <th className="p-4 font-semibold text-gray-600">Role</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading staff...</td></tr>}
              {!isLoading && staff?.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-500">No staff found.</td></tr>}
              {staff?.map((member: any) => (
                <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{member.name}</td>
                  <td className="p-4 text-gray-600">{member.email}</td>
                  <td className="p-4"><span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">{member.role}</span></td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${member.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{member.isActive ? 'ACTIVE' : 'SUSPENDED'}</span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => toggleMutation.mutate(member.id)} className={`px-3 py-1.5 rounded-md text-sm font-medium ${member.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                      {member.isActive ? 'Suspend' : 'Activate'}
                    </button>
                    <button onClick={() => setEditingStaff(member)} className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md">
                      <Lock size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CREATE STAFF MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Add New Staff Member</h2>
              <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate({ name, email, role, password }); }}>
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-[#FCD34D] outline-none" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-[#FCD34D] outline-none" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Password</label><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-[#FCD34D] outline-none" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-[#FCD34D] outline-none">
                      <option value="SUPPORT_OFFICER">Support Officer</option>
                      <option value="FINANCE_OFFICER">Finance Officer</option>
                      <option value="OPERATIONS_MANAGER">Operations Manager</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
                  <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 bg-[#FCD34D] text-black font-semibold rounded-md hover:bg-yellow-400 disabled:opacity-50">{createMutation.isPending ? "Adding..." : "Add Staff"}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EDIT PASSWORD MODAL */}
        {editingStaff && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Change Password: {editingStaff.name}</h2>
              <form onSubmit={(e) => { e.preventDefault(); updatePasswordMutation.mutate({ id: editingStaff.id, password: newPassword }); }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-[#FCD34D] outline-none" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setEditingStaff(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
                  <button type="submit" disabled={updatePasswordMutation.isPending} className="px-4 py-2 bg-[#FCD34D] text-black font-semibold rounded-md hover:bg-yellow-400 disabled:opacity-50">
                    {updatePasswordMutation.isPending ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}