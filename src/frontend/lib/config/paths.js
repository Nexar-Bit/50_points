/** App is deployed under /50points (see next.config.mjs). */

export const BASE_PATH = '/50points';

/** Brand logo file: public/Img/logo.png */
export const LOGO_PATH = '/Img/logo.png';

/** Use with next/image and next/link — basePath is applied automatically. */
export function asset(path) {
  return path.startsWith('/') ? path : `/${path}`;
}

/** Use with fetch() for API routes from the browser. */
export function api(path) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}

/** Use with plain <img> tags (browser needs the full public URL). */
export function staticFile(path) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const withBase = normalized.startsWith(BASE_PATH) ? normalized : `${BASE_PATH}${normalized}`;
  return encodeURI(withBase);
}

/** Full URL for public/Img/logo.png */
export function logoFile() {
  return staticFile(LOGO_PATH);
}

/** Path for next/image (basePath applied by Next.js). */
export function logoAsset() {
  return asset(LOGO_PATH);
}
