function createTimeoutSignal(timeoutMs) {
  if (timeoutMs == null) return undefined;
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
    return AbortSignal.timeout(timeoutMs);
  }
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  if (controller.signal.addEventListener) {
    controller.signal.addEventListener('abort', () => clearTimeout(id), { once: true });
  }
  return controller.signal;
}

/** Resolve API base at call time (not module load) so the browser always uses the Vercel proxy. */
export function getApiBase() {
  if (typeof window !== 'undefined') {
    return '/api';
  }

  const publicUrl = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, '');
  if (publicUrl && publicUrl !== 'http://localhost:8000' && publicUrl !== 'http://127.0.0.1:8000') {
    return `${publicUrl}/api`;
  }

  const serverBackend =
    process.env.API_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:8000';
  return `${serverBackend.replace(/\/$/, '')}/api`;
}

export function getStoredToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('50points_token');
}

export function authHeaders(token) {
  const t = token ?? getStoredToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function fetchJson(path, options = {}) {
  const apiBase = getApiBase();
  const url = path.startsWith('http') ? path : `${apiBase}${path.startsWith('/') ? path : `/${path}`}`;
  const { cache, timeoutMs, signal: userSignal, ...rest } = options;
  const timeoutSignal = createTimeoutSignal(timeoutMs);

  const res = await fetch(url, {
    cache: cache ?? 'default',
    ...rest,
    signal: userSignal ?? timeoutSignal,
    headers: {
      'Content-Type': 'application/json',
      ...(cache === 'no-store' ? { 'Cache-Control': 'no-cache' } : {}),
      ...rest.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.detail || data.error || res.statusText || 'Request failed');
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

/** @deprecated use getApiBase() — kept for imports that read API_BASE at runtime */
export const API_BASE = typeof window !== 'undefined' ? '/api' : getApiBase();
