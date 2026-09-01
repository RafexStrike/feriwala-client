const normalizeBaseUrl = (value: string | undefined) => {
  if (!value) return '';
  return value.trim().replace(/\/+$/, '');
};

const getServerRootFromApiUrl = (apiUrl: string | undefined) => {
  if (!apiUrl) return undefined;
  return apiUrl.replace(/\/api(?:\/v1)?\/?$/, '');
};

export const SERVER_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_SERVER_URL ||
    getServerRootFromApiUrl(process.env.NEXT_PUBLIC_API_URL) ||
    (process.env.NODE_ENV !== 'production' ? 'http://localhost:5000' : '')
);

export const API_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_API_URL ||
    (SERVER_BASE_URL ? `${SERVER_BASE_URL}/api/v1` : undefined) ||
    (process.env.NODE_ENV !== 'production' ? 'http://localhost:5000/api/v1' : '')
);

export const getAuthUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const base = SERVER_BASE_URL || '';
  return `${base}${normalizedPath}`;
};
