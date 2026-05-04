import axios from 'axios';
import { API_URL } from '../constants/BaseUrl';

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

/** GET public JSON — response envelope `{ success, data }`. */
export async function publicGetData<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  const { data } = await axios.get<ApiEnvelope<T>>(`${API_URL}${path}`, {
    params,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30_000,
  });

  if (!data.success) {
    throw new Error(data.message || 'Request failed');
  }

  return data.data;
}

/** POST JSON — no auth (e.g. contact form). */
export async function publicPostJson<T, B = unknown>(
  path: string,
  body: B,
): Promise<T> {
  const { data } = await axios.post<ApiEnvelope<T>>(`${API_URL}${path}`, body, {
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30_000,
  });

  if (!data.success) {
    throw new Error(data.message || 'Request failed');
  }

  return data.data;
}
