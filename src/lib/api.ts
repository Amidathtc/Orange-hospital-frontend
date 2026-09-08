const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function getToken(): string | null {
  return localStorage.getItem('oha_token');
}

export function setToken(token: string) {
  localStorage.setItem('oha_token', token);
}

export function clearToken() {
  localStorage.removeItem('oha_token');
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

// Every screen calls this instead of raw fetch, so auth headers and
// error shapes stay identical everywhere rather than re-implemented per page.
export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(errorBody.message ?? 'Something went wrong.', res.status);
  }

  // Handles endpoints that return no body (e.g. some 200 OKs).
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}
