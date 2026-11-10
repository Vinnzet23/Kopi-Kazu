// API Client Configuration for Kopi Kazu POS v2.4

const BASE_URL = ''; // Relative path leverages Vite dev server proxy forwarding /api

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const rawText = await response.text();
    let data: any = null;

    if (rawText && rawText.trim().length > 0) {
      try {
        data = JSON.parse(rawText);
      } catch {
        if (!response.ok) {
          throw new Error(
            `Server error (${response.status}): ${rawText.replace(/<[^>]*>/g, '').trim().slice(0, 100) || response.statusText}`
          );
        }
        throw new Error('Format respons dari server tidak valid (bukan JSON)');
      }
    }

    if (!response.ok) {
      const errMsg =
        data?.message ||
        data?.error ||
        `Permintaan gagal (${response.status} ${response.statusText || 'Error'})`;
      throw new Error(errMsg);
    }

    return (data ?? { success: true }) as T;
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message?.toLowerCase().includes('fetch')) {
      const connErr = new Error('Gagal terhubung ke backend. Pastikan server backend sedang aktif di port 3000 (npm --prefix backend run dev).');
      console.error(`API Error on ${url}:`, connErr.message);
      throw connErr;
    }
    console.error(`API Error on ${url}:`, error.message);
    throw error;
  }
}

