"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { Key, ShieldCheck, Edit2, X, Check } from "lucide-react";

const AVAILABLE_PERMISSIONS = [
  { id: "view_riders", label: "View Riders" },
  { id: "approve_riders", label: "Approve Riders" },
  { id: "view_trips", label: "View Trips" },
  { id: "cancel_trips", label: "Cancel Trips" },
  { id: "view_finance", label: "View Finance" },
  { id: "manage_payouts", label: "Manage Payouts" },
  { id: "view_support", label: "View Support Tickets" },
  { id: "view_safety", label: "View Safety Incidents" },
  { id: "manage_settings", label: "Manage Settings" },
  { id: "manage_staff", label: "Manage Staff" },
];

export default function RolesPage() {
  const queryClient = useQueryClient();
  const [editingRole, setEditingRole] = useState<any>(null);
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);

  const { data: roles, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => (await api.get('/roles')).data,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, permissions }: { id: string, permissions: string[] }) => {
      return await api.patch(`/roles/${id}`, { permissions });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setEditingRole(null);
    },
  });

  const openEditModal = (role: any) => {
    setEditingRole(role);
    setSelectedPerms(role.permissions || []);
  };

  const togglePermission = (permId: string) => {
    setSelectedPerms(prev => 
      prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]
    );
  };

  const handleSave = () => {
    updateMutation.mutate({ id: editingRole.id, permissions: selectedPerms });
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="text-sm text-gray-500">Define system roles and their access levels.</p>
        </div>

        {isLoading ? <div className="p-10 text-center text-gray-500">Loading roles...</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roles?.map((role: any) => (
              <div key={role.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#FCD34D] rounded-lg text-black"><ShieldCheck size={24}/></div>
                    <div>
                      <h2 className="font-bold text-gray-900">{role.name}</h2>
                      <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{role.id}</span>
                    </div>
                  </div>
                  <button onClick={() => openEditModal(role)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors">
                    <Edit2 size={18} />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4 flex-grow">{role.description}</p>
                
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Active Permissions</p>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.length === 0 ? (
                      <span className="text-sm text-gray-400">No permissions assigned</span>
                    ) : (
                      role.permissions.map((perm: string) => (
                        <span key={perm} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200">
                          {AVAILABLE_PERMISSIONS.find(p => p.id === perm)?.label || perm}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EDIT PERMISSIONS MODAL */}
        {editingRole && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Edit Permissions: {editingRole.name}</h2>
                <button onClick={() => setEditingRole(null)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-2">
                {AVAILABLE_PERMISSIONS.map((perm) => (
                  <label key={perm.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={selectedPerms.includes(perm.id)}
                      onChange={() => togglePermission(perm.id)}
                      className="w-5 h-5 accent-[#FCD34D] rounded"
                    />
                    <span className="text-sm text-gray-700">{perm.label}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button onClick={() => setEditingRole(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
                <button onClick={handleSave} disabled={updateMutation.isPending} className="flex items-center gap-2 px-4 py-2 bg-[#FCD34D] text-black font-semibold rounded-md hover:bg-yellow-400 disabled:opacity-50">
                  <Check size={18} /> {updateMutation.isPending ? "Saving..." : "Save Permissions"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}