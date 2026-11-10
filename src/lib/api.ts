import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://torq-backend.onrender.com';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('torq_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function fetchRiders(params?: { page?: number; limit?: number; isOnline?: boolean }) {
  const search = new URLSearchParams();
  if (params?.page) search.set('page', String(params.page));
  if (params?.limit) search.set('limit', String(params.limit));
  if (params?.isOnline !== undefined) search.set('isOnline', String(params.isOnline));
  
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
  const res = await fetch(`${base}/riders?${search.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch riders: ${res.status}`);
  return res.json();
}
