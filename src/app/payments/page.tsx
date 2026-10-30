"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { CreditCard, DollarSign, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function PaymentsPage() {
  const { data: payments, isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => (await api.get('/payments')).data,
  });

  const totalCollected = payments?.filter((p: any) => p.status === 'SUCCESSFUL').reduce((sum: number, p: any) => sum + p.amount, 0) || 0;
  const pendingAmount = payments?.filter((p: any) => p.status === 'PENDING').reduce((sum: number, p: any) => sum + p.amount, 0) || 0;
  const failedCount = payments?.filter((p: any) => p.status === 'FAILED').length || 0;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-sm text-gray-500">Detailed transaction ledger and payment status.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg text-green-600"><DollarSign size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Total Collected</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">KES {totalCollected.toFixed(2)}</div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600"><Clock size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Pending Amount</span>
            </div>
            <div className="text-3xl font-bold text-yellow-600">KES {pendingAmount.toFixed(2)}</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg text-red-600"><XCircle size={20}/></div>
              <span className="text-sm text-gray-500 font-medium">Failed Transactions</span>
            </div>
            <div className="text-3xl font-bold text-red-600">{failedCount}</div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Transaction Ref</th>
                <th className="p-4 font-semibold text-gray-600">Amount (KES)</th>
                <th className="p-4 font-semibold text-gray-600">Method</th>
                <th className="p-4 font-semibold text-gray-600">Provider Ref</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading payments...</td></tr>}
              {!isLoading && payments?.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-500">No payments found.</td></tr>}
              
              {payments?.map((payment: any) => (
                <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{payment.transactionRef}</td>
                  <td className="p-4 font-bold text-gray-900">{payment.amount.toFixed(2)}</td>
                  <td className="p-4">
                    <span className="flex items-center gap-2 text-sm text-gray-700">
                      <CreditCard size={14} className="text-gray-400" /> {payment.method}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500 font-mono">{payment.providerRef || 'N/A'}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      payment.status === 'SUCCESSFUL' ? 'bg-green-100 text-green-700' : 
                      payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                      payment.status === 'REFUNDED' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(payment.createdAt).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}
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