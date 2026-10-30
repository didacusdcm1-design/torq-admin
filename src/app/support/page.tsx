"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { HeadphonesIcon, AlertCircle, CheckCircle2, Clock } from "lucide-react";

export default function SupportPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("ALL");

  const { data: tickets, isLoading } = useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const response = await api.get('/support');
      return response.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      return await api.patch(`/support/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    }
  });

  const filteredTickets = tickets?.filter((t: any) => filter === "ALL" || t.status === filter) || [];

  const openCount = tickets?.filter((t: any) => t.status === 'OPEN').length || 0;
  const inProgressCount = tickets?.filter((t: any) => t.status === 'IN_PROGRESS').length || 0;
  const resolvedCount = tickets?.filter((t: any) => t.status === 'RESOLVED').length || 0;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Support</h1>
            <p className="text-sm text-gray-500">Manage complaints and support tickets.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setFilter("ALL")} className={`px-3 py-1.5 text-sm rounded-md ${filter === 'ALL' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border'}`}>All</button>
            <button onClick={() => setFilter("OPEN")} className={`px-3 py-1.5 text-sm rounded-md ${filter === 'OPEN' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border'}`}>Open</button>
            <button onClick={() => setFilter("IN_PROGRESS")} className={`px-3 py-1.5 text-sm rounded-md ${filter === 'IN_PROGRESS' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border'}`}>In Progress</button>
            <button onClick={() => setFilter("RESOLVED")} className={`px-3 py-1.5 text-sm rounded-md ${filter === 'RESOLVED' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border'}`}>Resolved</button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg text-red-600"><AlertCircle size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Open Tickets</span>
            </div>
            <div className="text-3xl font-bold text-red-600">{openCount}</div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600"><Clock size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">In Progress</span>
            </div>
            <div className="text-3xl font-bold text-yellow-600">{inProgressCount}</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg text-green-600"><CheckCircle2 size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Resolved</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{resolvedCount}</div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Ticket Ref</th>
                <th className="p-4 font-semibold text-gray-600">Subject</th>
                <th className="p-4 font-semibold text-gray-600">Priority</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading tickets...</td></tr>}
              {!isLoading && filteredTickets.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-500">No tickets found.</td></tr>}
              
              {filteredTickets.map((ticket: any) => (
                <tr key={ticket.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{ticket.ticketRef}</td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{ticket.subject}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{ticket.description}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      ticket.priority === 'URGENT' ? 'bg-red-100 text-red-700' : 
                      ticket.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' : 
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      ticket.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 
                      ticket.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <select 
                      value={ticket.status}
                      onChange={(e) => updateStatusMutation.mutate({ id: ticket.id, status: e.target.value })}
                      className="text-sm border border-gray-300 rounded p-1 text-black"
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}