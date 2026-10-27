"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Search, RefreshCw, CheckCircle, Eye, X } from "lucide-react";

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
  const [selectedRider, setSelectedRider] = useState<any>(null);
  const [viewingImage, setViewingImage] = useState<string | null>(null); // State for the image modal

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
        setSelectedRider(null);
        refetch();
      }
    } catch (e) {
      alert('Failed to approve rider');
    }
  };

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : 'Loading...';
  const filteredRiders = riders?.filter((u: any) => (u.email || "").toLowerCase().includes(searchTerm.toLowerCase())) || [];

  const DocumentLink = ({ label, url }: { label: string, url: string | null }) => {
    if (!url) return <div className="bg-gray-50 p-3 rounded border"><span className="text-gray-500 block text-xs">{label}</span><span className="text-gray-400">Not Uploaded</span></div>;
    
    // Ensure the URL is absolute. If the database has an old relative path, we try to fix it.
    const fullUrl = url.startsWith('http') ? url : `https://torq-backend.onrender.com/uploads/${url}`;

    return (
      <div className="bg-gray-50 p-3 rounded border">
        <span className="text-gray-500 block text-xs">{label}</span>
        <button 
          onClick={() => setViewingImage(fullUrl)} 
          className="font-semibold text-blue-600 hover:underline"
        >
          View Image
        </button>
      </div>
    );
  };

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
                <th className="p-4 font-bold">OTP Code</th>
                <th className="p-4 font-bold">Verification Status</th>
                <th className="p-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading riders...</td></tr>
              ) : filteredRiders.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No riders found.</td></tr>
              ) : (
                filteredRiders.map((user: any) => (
                  <tr key={user.id} className="border-t border-[#edf1f6] text-xs hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-semibold">{user.riderProfile?.fullName || 'N/A'}</div>
                      <div className="text-slate-500">{user.email}</div>
                    </td>
                    <td className="p-4 font-mono">{user.phone || 'N/A'}</td>
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
                    <td className="p-4 flex gap-2">
                      <button 
                        onClick={() => setSelectedRider(user)}
                        className="bg-gray-200 text-gray-800 px-3 py-1 rounded flex items-center gap-1 text-[10px] font-bold hover:bg-gray-300"
                      >
                        <Eye size={12} /> View
                      </button>
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

      {/* RIDER DETAILS MODAL */}
      {selectedRider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-[#f7f9fc]">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Rider Application Details</h2>
                <p className="text-sm text-gray-500">{selectedRider.email}</p>
              </div>
              <button onClick={() => setSelectedRider(null)} className="text-gray-400 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-2 border-b pb-1">Personal Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500">Full Name:</span> {selectedRider.riderProfile?.fullName || 'N/A'}</div>
                  <div><span className="text-gray-500">Date of Birth:</span> {selectedRider.riderProfile?.dateOfBirth || 'N/A'}</div>
                  <div><span className="text-gray-500">National ID:</span> {selectedRider.riderProfile?.nationalIdNumber || 'N/A'}</div>
                  <div><span className="text-gray-500">Emergency Contact:</span> {selectedRider.riderProfile?.emergencyContact || 'N/A'}</div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-2 border-b pb-1">Motorcycle Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500">Registration:</span> {selectedRider.riderProfile?.motorcycleReg || 'N/A'}</div>
                  <div><span className="text-gray-500">Make:</span> {selectedRider.riderProfile?.motorcycleMake || 'N/A'}</div>
                  <div><span className="text-gray-500">Model:</span> {selectedRider.riderProfile?.motorcycleModel || 'N/A'}</div>
                  <div><span className="text-gray-500">Insurance Expiry:</span> {selectedRider.riderProfile?.insuranceExpiry || 'N/A'}</div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-2 border-b pb-1">Uploaded Documents</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <DocumentLink label="National ID" url={selectedRider.riderProfile?.idDocumentUrl} />
                  <DocumentLink label="Driver License" url={selectedRider.riderProfile?.licenseDocumentUrl} />
                  <DocumentLink label="Insurance Certificate" url={selectedRider.riderProfile?.insuranceDocumentUrl} />
                  <DocumentLink label="Selfie" url={selectedRider.riderProfile?.selfieUrl} />
                </div>
              </div>
            </div>

            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setSelectedRider(null)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-800">
                Close
              </button>
              {selectedRider.riderProfile?.verificationStatus === 'PENDING' && (
                <button 
                  onClick={() => approveRider(selectedRider.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded text-sm font-bold hover:bg-green-700 flex items-center gap-2"
                >
                  <CheckCircle size={16} /> Approve Rider
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* IMAGE VIEWER MODAL */}
      {viewingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60] p-4" onClick={() => setViewingImage(null)}>
          <div className="relative max-w-4xl max-h-[90vh]">
            <button 
              onClick={() => setViewingImage(null)} 
              className="absolute -top-10 right-0 text-white hover:text-gray-300 flex items-center gap-2 font-bold"
            >
              <X size={24} /> Close
            </button>
            <img 
              src={viewingImage} 
              alt="Document" 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevents closing when clicking the image itself
            />
          </div>
        </div>
      )}
    </div>
  );
}
