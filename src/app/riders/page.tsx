'use client';

import { useEffect, useState } from 'react';
import { fetchPendingRiders, updateRiderStatus } from '@/lib/api';

export default function PendingRidersPage() {
  const [riders, setRiders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRider, setSelectedRider] = useState<any | null>(null);

  const loadRiders = async () => {
    setLoading(true);
    try {
      const res = await fetchPendingRiders();
      setRiders(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRiders();
  }, []);

  const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await updateRiderStatus(id, status);
      setSelectedRider(null); 
      loadRiders(); 
    } catch (e) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pending Rider Approvals</h1>

      {loading ? (
        <p>Loading pending registrations...</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg border-gray-700">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-800 text-left">
              <tr>
                <th className="px-4 py-3 text-gray-300">Name</th>
                <th className="px-4 py-3 text-gray-300">License Plate</th>
                <th className="px-4 py-3 text-gray-300">Bike Model</th>
                <th className="px-4 py-3 text-gray-300">Status</th>
                <th className="px-4 py-3 text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {riders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No pending registrations.
                  </td>
                </tr>
              ) : (
                riders.map((r) => (
                  <tr key={r.id} className="border-t border-gray-700 hover:bg-gray-800 cursor-pointer" onClick={() => setSelectedRider(r)}>
                    <td className="px-4 py-3 text-white">{r.riderProfile?.fullName || r.email}</td>
                    <td className="px-4 py-3 text-white">{r.riderProfile?.bikeReg || 'N/A'}</td>
                    <td className="px-4 py-3 text-white">{r.riderProfile?.bikeModel || 'N/A'}</td>
                    <td className="px-4 py-3">
                      {r.riderProfile?.rejectionReason ? (
                        <span className="text-red-500 text-xs font-bold">Rejected</span>
                      ) : (
                        <span className="text-yellow-500 text-xs font-bold">Pending</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-yellow-500 hover:underline">Review</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* --- MODAL FOR DETAILS --- */}
      {selectedRider && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Review Application</h2>
              <button onClick={() => setSelectedRider(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-400">Full Name</p>
                <p className="text-white">{selectedRider.riderProfile?.fullName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p className="text-white">{selectedRider.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">License Plate</p>
                <p className="text-white">{selectedRider.riderProfile?.bikeReg || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Bike Model</p>
                <p className="text-white">{selectedRider.riderProfile?.bikeModel || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">National ID</p>
                <p className="text-white">{selectedRider.riderProfile?.nationalId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Emergency Contact</p>
                <p className="text-white">{selectedRider.riderProfile?.emergencyContact || 'N/A'}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Uploaded Documents</h3>
              <div className="grid grid-cols-2 gap-2">
                {/* Assuming your database stores URLs for these images. You can replace the text with <img src="..." /> later */}
                {['National ID', 'Driving License', 'Bike Logbook', 'Profile Photo'].map(doc => (
                  <div key={doc} className="border border-gray-700 p-2 rounded flex flex-col items-center justify-center h-24 bg-gray-800">
                    <span className="text-gray-400 text-xs mb-1">{doc}</span>
                    <span className="text-green-500 text-sm">✓ Uploaded</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
              <button 
                onClick={() => handleAction(selectedRider.id, 'REJECTED')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium"
              >
                Reject Application
              </button>
              <button 
                onClick={() => handleAction(selectedRider.id, 'APPROVED')}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium"
              >
                Approve Rider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
