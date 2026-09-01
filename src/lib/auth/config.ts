const normalizeBaseUrl = (value: string | undefined, fallback: string) =>
  (value || fallback).replace(/\/+$/, '');

export const SERVER_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_SERVER_URL,
  'http://localhost:5000'
);

export const API_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_API_URL,
  'http://localhost:5000/api/v1'
);

export const getAuthUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${SERVER_BASE_URL}${normalizedPath}`;
};
