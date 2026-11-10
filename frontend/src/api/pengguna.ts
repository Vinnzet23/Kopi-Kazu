import { apiClient } from './client.js';
import type { LoginPayload, RegisterPayload, Pengguna, Cabang, ApiResponse } from '../models/akun.js';

export async function loginPengguna(payload: LoginPayload): Promise<ApiResponse<Pengguna>> {
  return apiClient<ApiResponse<Pengguna>>('/api/pengguna/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function registerPengguna(payload: RegisterPayload): Promise<ApiResponse<Pengguna>> {
  return apiClient<ApiResponse<Pengguna>>('/api/pengguna/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getAllCabang(): Promise<ApiResponse<Cabang[]>> {
  return apiClient<ApiResponse<Cabang[]>>('/api/pengguna/cabang', {
    method: 'GET',
  });
}

