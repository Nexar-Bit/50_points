function resolveApiBase() {
  const publicUrl = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, '');
  const isLocalDefault =
    !publicUrl ||
    publicUrl === 'http://localhost:8000' ||
    publicUrl === 'http://127.0.0.1:8000';

  // Browser on Vercel/production: use same-origin proxy (src/app/api/[...path]/route.js)
  if (typeof window !== 'undefined' && isLocalDefault) {
    return '/api';
  }

  if (publicUrl) {
    return `${publicUrl}/api`;
  }

  const serverBackend =
    process.env.API_BACKEND_URL || 'http://localhost:8000';
  return `${serverBackend.replace(/\/$/, '')}/api`;
}

const API_BASE = resolveApiBase();

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
  const { cache, timeoutMs, ...rest } = options;
  const signal =
    timeoutMs != null
      ? AbortSignal.timeout(timeoutMs)
      : rest.signal;

  const res = await fetch(url, {
    cache: cache ?? 'default',
    ...rest,
    signal,
    headers: {
      'Content-Type': 'application/json',
      ...(cache === 'no-store' ? { 'Cache-Control': 'no-cache' } : {}),
      ...rest.headers,
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
