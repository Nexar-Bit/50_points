const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api`;

export function getStoredToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('50points_token');
}

export function authHeaders(token) {
  const t = token ?? getStoredToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function fetchJson(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || res.statusText || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export async function fetchAuthJson(path, options = {}) {
  return fetchJson(path, {
    ...options,
    headers: {
      ...authHeaders(),
      ...options.headers,
    },
  });
}

export { API_BASE };
