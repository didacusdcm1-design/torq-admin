"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { Bell, Send, AlertCircle, Megaphone } from "lucide-react";

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const { data: notifications, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await api.get('/notifications');
      return response.data;
    },
  });

  const sendMutation = useMutation({
    mutationFn: async (msg: string) => {
      return await api.post('/notifications', { message: msg });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setMessage("");
      setStatusMsg("✅ Broadcast sent successfully to all riders!");
      setTimeout(() => setStatusMsg(""), 5000);
    },
    onError: () => {
      setStatusMsg("❌ Failed to send notification. Ensure you are logged in.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMutation.mutate(message);
    }
  };

  const lastUpdatedTime = new Date(dataUpdatedAt).toLocaleTimeString("en-KE", {
    timeZone: "Africa/Nairobi",
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-500">Send broadcast alerts to riders and view history.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
            <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></span>
            Last updated: {lastUpdatedTime}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Send Notification Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#FCD34D] rounded-lg text-black"><Megaphone size={20}/></div>
                <h2 className="font-bold text-gray-900">Broadcast Alert</h2>
              </div>
              
              {statusMsg && (
                <div className={`p-3 rounded-lg mb-4 text-sm font-medium ${statusMsg.includes("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                  {statusMsg}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g., Surge pricing is active in Westlands..."
                  className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#FCD34D] outline-none mb-4"
                />
                <button 
                  type="submit" 
                  disabled={sendMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  <Send size={18} />
                  {sendMutation.isPending ? "Sending..." : "Send to All Riders"}
                </button>
              </form>
            </div>
          </div>

          {/* Notification History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
                <Bell size={18} className="text-gray-500" />
                <h2 className="font-bold text-gray-700">Sent History</h2>
              </div>
              
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {isLoading && <div className="p-8 text-center text-gray-500">Loading history...</div>}
                {!isLoading && notifications?.length === 0 && <div className="p-8 text-center text-gray-500">No notifications sent yet.</div>}
                
                {notifications?.map((notif: any) => (
                  <div key={notif.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-semibold text-gray-900">
                        To: {notif.user?.phone || 'Unknown'} ({notif.user?.role || 'USER'})
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(notif.createdAt).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}