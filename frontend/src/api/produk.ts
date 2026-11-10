import { apiClient } from './client.js';
import type { ApiResponse } from '../models/akun.js';
import type {
  MenuWithResep,
  BahanBaku,
  CreateMenuPayload,
  CheckoutPayload,
  CheckoutResult
} from '../models/produk.js';

export async function fetchMenu(id_cabang: number = 1): Promise<ApiResponse<MenuWithResep[]>> {
  return apiClient<ApiResponse<MenuWithResep[]>>(`/api/produk/menu?id_cabang=${id_cabang}`, {
    method: 'GET',
  });
}

export async function fetchMenuById(id: number): Promise<ApiResponse<MenuWithResep>> {
  return apiClient<ApiResponse<MenuWithResep>>(`/api/produk/menu/${id}`, {
    method: 'GET',
  });
}

export async function createMenu(payload: CreateMenuPayload): Promise<ApiResponse<MenuWithResep>> {
  return apiClient<ApiResponse<MenuWithResep>>('/api/produk/menu', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateMenu(id: number, payload: CreateMenuPayload): Promise<ApiResponse<MenuWithResep>> {
  return apiClient<ApiResponse<MenuWithResep>>(`/api/produk/menu/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteMenu(id: number): Promise<ApiResponse<void>> {
  return apiClient<ApiResponse<void>>(`/api/produk/menu/${id}`, {
    method: 'DELETE',
  });
}

export async function fetchBahanBaku(id_cabang: number = 1): Promise<ApiResponse<BahanBaku[]>> {
  return apiClient<ApiResponse<BahanBaku[]>>(`/api/produk/bahan?id_cabang=${id_cabang}`, {
    method: 'GET',
  });
}

export async function fetchBahanKritis(id_cabang: number = 1): Promise<ApiResponse<BahanBaku[]>> {
  return apiClient<ApiResponse<BahanBaku[]>>(`/api/produk/bahan/kritis?id_cabang=${id_cabang}`, {
    method: 'GET',
  });
}

export async function checkoutPOS(payload: CheckoutPayload): Promise<ApiResponse<CheckoutResult>> {
  return apiClient<ApiResponse<CheckoutResult>>('/api/produk/checkout', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

