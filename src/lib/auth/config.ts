import { createAuthClient } from 'better-auth/react';

const normalizeBaseUrl = (value: string | undefined) => {
  if (!value) return '';
  return value.trim().replace(/\/+$/, '');
};

const LOCAL_BACKEND_API = 'http://localhost:5000/api/v1';
const LOCAL_BACKEND_SERVER = 'http://localhost:5000';

export const API_BASE_URL = normalizeBaseUrl(
  process.env.NODE_ENV === 'production'
    ? '/api/v1'
    : process.env.NEXT_PUBLIC_API_URL || LOCAL_BACKEND_API
);

export const SERVER_BASE_URL = normalizeBaseUrl(
  process.env.NODE_ENV === 'production'
    ? ''
    : API_BASE_URL.replace(/\/api(?:\/v1)?\/?$/, '') || LOCAL_BACKEND_SERVER
);

export const authClient = createAuthClient({
  // In production auth is proxied by Next.js so cookies belong to Vercel.
  baseURL: SERVER_BASE_URL || undefined,
  fetchOptions: {
    credentials: 'include',
    onRequest: (ctx) => {
      try {
        console.info('[AUTH-CLIENT][DEBUG] request', ctx);
      } catch (e) {}
    },
    onResponse: (ctx) => {
      try {
        console.info('[AUTH-CLIENT][DEBUG] response', ctx);
      } catch (e) {}
    }
  },
});

export const getAuthUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (!SERVER_BASE_URL) {
    return normalizedPath;
  }

  return `${SERVER_BASE_URL}${normalizedPath}`;
};
