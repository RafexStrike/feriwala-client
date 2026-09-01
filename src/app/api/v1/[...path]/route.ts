import { NextRequest } from 'next/server';
import { proxyRequest } from '../../_proxy';

async function handler(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxyRequest(request, `/api/v1/${path.join('/')}${request.nextUrl.search}`);
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
