"use client";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { Key, ShieldCheck } from "lucide-react";

export default function RolesPage() {
  const { data: roles, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => (await api.get('/roles')).data,
  });

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
              <div key={role.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#FCD34D] rounded-lg text-black"><ShieldCheck size={24}/></div>
                  <div>
                    <h2 className="font-bold text-gray-900">{role.name}</h2>
                    <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{role.id}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{role.description}</p>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-400">
                  <Key size={14} /> Permissions are enforced by the backend.
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}