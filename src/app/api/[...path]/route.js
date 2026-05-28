/**
 * Proxy /api/* to the FastAPI backend (server-side).
 * Set API_BACKEND_URL on Vercel to your Render URL (no trailing slash).
 */

const BACKEND =
  process.env.API_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8000';

function targetUrl(pathSegments, search) {
  const base = BACKEND.replace(/\/$/, '');
  const path = pathSegments.join('/');
  return `${base}/api/${path}${search}`;
}

async function proxy(request, context) {
  const { path } = await context.params;
  const segments = Array.isArray(path) ? path : [];
  const search = new URL(request.url).search;
  const url = targetUrl(segments, search);

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'host') return;
    headers.set(key, value);
  });

  const init = {
    method: request.method,
    headers,
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.arrayBuffer();
  }

  const res = await fetch(url, init);
  const outHeaders = new Headers(res.headers);
  outHeaders.delete('content-encoding');

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: outHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
