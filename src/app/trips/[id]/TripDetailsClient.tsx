"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ArrowLeft, MapPin, Navigation, ShieldCheck, Wallet } from "lucide-react";

export default function TripDetailsClient() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id as string;

  const { data: trip, isLoading, isError } = useQuery({
    queryKey: ["trip", tripId],
    queryFn: async () => {
      const response = await api.get(`/trips/${tripId}`);
      return response.data;
    },
  });

  if (isLoading) return <div className="p-10 text-center">Loading trip details...</div>;
  if (isError) return <div className="p-10 text-center text-red-500">Failed to load trip. Ensure backend is awake.</div>;

  const displayTrip = trip || {
    id: tripId,
    bookingRef: "TRQ-8492A",
    status: "COMPLETED",
    pickupAddress: "Westlands, Nairobi",
    destinationAddress: "JKIA Terminal 1A",
    createdAt: new Date().toISOString(),
    fare: 1500,
    commission: 225,
    riderEarnings: 1275,
    paymentMethod: "M-PESA",
    paymentStatus: "SUCCESSFUL",
    pickupPin: "4921",
    rider: { firstName: "Chadrick", lastName: "Didacus", phone: "0712345678" },
    customer: { firstName: "Jane", lastName: "Doe", phone: "0722334455" }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            Trip {displayTrip.bookingRef}
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              displayTrip.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {displayTrip.status}
            </span>
          </h1>
          <p className="text-sm text-gray-500">Created on {new Date(displayTrip.createdAt).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Navigation size={18}/> Route Details</h2>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-green-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <MapPin size={12} />
                </div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] pl-4">
                  <div className="font-semibold text-gray-900">Pickup</div>
                  <div className="text-sm text-gray-500">{displayTrip.pickupAddress}</div>
                </div>
              </div>
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-red-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <MapPin size={12} />
                </div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] pl-4">
                  <div className="font-semibold text-gray-900">Destination</div>
                  <div className="text-sm text-gray-500">{displayTrip.destinationAddress}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
              <ShieldCheck size={28} className="text-[#FCD34D] mb-2" />
              <h3 className="font-semibold text-gray-700">Pickup PIN</h3>
              <div className="text-3xl font-mono font-bold tracking-widest mt-2 text-gray-900">{displayTrip.pickupPin}</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
              <Wallet size={28} className="text-green-500 mb-2" />
              <h3 className="font-semibold text-gray-700">Payment Status</h3>
              <div className="text-lg font-bold mt-2 text-gray-900">{displayTrip.paymentMethod}</div>
              <span className="mt-2 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">{displayTrip.paymentStatus}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4">Financial Breakdown</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Gross Trip Fare</span>
                <span className="font-semibold text-gray-900">KES {displayTrip.fare.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">TORQ Commission (15%)</span>
                <span className="font-semibold text-red-500">- KES {displayTrip.commission.toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between">
                <span className="font-bold text-gray-900">Rider Net Earnings</span>
                <span className="font-bold text-green-600 text-lg">KES {displayTrip.riderEarnings.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4">People Involved</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">C</div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{displayTrip.customer.firstName} {displayTrip.customer.lastName}</div>
                  <div className="text-xs text-gray-500">Customer • {displayTrip.customer.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FCD34D] rounded-full flex items-center justify-center font-bold text-black">R</div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{displayTrip.rider.firstName} {displayTrip.rider.lastName}</div>
                  <div className="text-xs text-gray-500">Rider • {displayTrip.rider.phone}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}