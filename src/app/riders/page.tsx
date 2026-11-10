import { fetchRiders } from '@/lib/api';
import type { Rider } from '@/types/rider';

export const dynamic = 'force-dynamic';

export default async function RidersPage() {
  let riders: Rider[] = [];
  let meta = { total: 0, page: 1, limit: 20, totalPages: 0 };
  let error: string | null = null;

  try {
    const result = await fetchRiders({ page: 1, limit: 20 });
    riders = result.data;
    meta = result.meta;
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load riders';
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Riders / Drivers</h1>
        <p className="text-red-600">Error: {error}</p>
        <p className="text-sm text-gray-500 mt-1">The backend may be waking up. Try again in ~50s.</p>
      </div>
    );
  }

  const onlineCount = riders.filter((r) => r.isOnline).length;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Riders / Drivers</h1>
          <p className="text-sm text-gray-500">{meta.total} registered · {onlineCount} online now</p>
        </div>
      </div>

      {riders.length === 0 ? (
        <p className="text-gray-500">No riders registered yet.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Trips</th>
                <th className="px-4 py-3 font-medium">Vehicle</th>
              </tr>
            </thead>
            <tbody>
              {riders.map((rider) => (
                <tr key={rider.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{rider.name}</td>
                  <td className="px-4 py-3">
                    <div>{rider.email}</div>
                    {rider.phone && <div className="text-gray-500 text-xs">{rider.phone}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${rider.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${rider.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {rider.isOnline ? 'Online' : 'Offline'}
                    </span>
                  </td>
                  <td className="px-4 py-3">{rider.rating ? `⭐ ${rider.rating.toFixed(1)}` : '—'}</td>
                  <td className="px-4 py-3">{rider.totalTrips}</td>
                  <td className="px-4 py-3 capitalize">{rider.vehicleType ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
