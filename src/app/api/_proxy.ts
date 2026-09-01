import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = (process.env.BACKEND_INTERNAL_URL || 'https://feriwala-server.onrender.com').replace(/\/$/, '');

export async function proxyRequest(request: NextRequest, backendPath: string) {
  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('content-length');
  headers.delete('content-encoding');

  const body = ['GET', 'HEAD'].includes(request.method) ? undefined : await request.arrayBuffer();
  const backendResponse = await fetch(`${BACKEND_URL}${backendPath}`, {
    method: request.method,
    headers,
    body,
    redirect: 'manual',
    cache: 'no-store',
  });

  const responseHeaders = new Headers(backendResponse.headers);
  responseHeaders.delete('content-encoding');
  responseHeaders.delete('content-length');
  responseHeaders.delete('transfer-encoding');

  // Preserve every Set-Cookie header so Better Auth session cookies are
  // stored on the Vercel origin rather than on the Render origin.
  responseHeaders.delete('set-cookie');
  const getSetCookie = (backendResponse.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie;
  for (const cookie of getSetCookie?.call(backendResponse.headers) || []) {
    responseHeaders.append('set-cookie', cookie);
  }

  return new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    headers: responseHeaders,
  });
}
