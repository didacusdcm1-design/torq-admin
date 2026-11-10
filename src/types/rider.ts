export interface Rider {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isOnline: boolean;
  rating: number | null;
  vehicleType: string | null;
  createdAt: string;
  totalTrips: number;
}

export interface RidersResponse {
  data: Rider[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}
