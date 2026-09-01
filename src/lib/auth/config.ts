import { createAuthClient } from 'better-auth/react';

const normalizeBaseUrl = (value: string | undefined) => {
  if (!value) return '';
  return value.trim().replace(/\/+$/, '');
};

const LOCAL_BACKEND_API = 'http://localhost:5000/api/v1';
const LOCAL_BACKEND_SERVER = 'http://localhost:5000';

export const API_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV !== 'production' ? LOCAL_BACKEND_API : '')
);

export const SERVER_BASE_URL = normalizeBaseUrl(
  API_BASE_URL
    ? API_BASE_URL.replace(/\/api(?:\/v1)?\/?$/, '')
    : process.env.NODE_ENV !== 'production'
    ? LOCAL_BACKEND_SERVER
    : ''
);

export const authClient = createAuthClient({
  baseURL: SERVER_BASE_URL,
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
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'NEXT_PUBLIC_API_URL must be set in production. Set it to your backend API domain (e.g., https://api.feriwala.com/api/v1).'
      );
    }
    return normalizedPath;
  }

  return `${SERVER_BASE_URL}${normalizedPath}`;
};
