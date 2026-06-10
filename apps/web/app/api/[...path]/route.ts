import { NextRequest, NextResponse } from 'next/server';
import { config as loadEnv } from 'dotenv';

type RouteContext = {
  params: Promise<{
    path?: string[];
  }>;
};

const DEFAULT_API_BASE_URL = 'http://localhost:4000/api';
const PROXY_DEPTH_HEADER = 'x-biometric-api-proxy';

loadEnv({ path: '.env.local', override: false, quiet: true });
loadEnv({ path: '.env', override: false, quiet: true });


function getApiBaseUrl() {
  return (
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    DEFAULT_API_BASE_URL
  ).replace(/\/$/, '');
}

function hostMatches(value: string | null, upstreamUrl: URL) {
  if (!value) return false;
  return value
    .split(',')
    .map((host) => host.trim().toLowerCase())
    .includes(upstreamUrl.host.toLowerCase());
}

async function proxy(request: NextRequest, context: RouteContext) {
  if (request.headers.get(PROXY_DEPTH_HEADER)) {
    return NextResponse.json(
      {
        message:
          'API proxy loop detected. API_BASE_URL must point to the Nest API service, not this web service.',
      },
      { status: 502 },
    );
  }

  const { path = [] } = await context.params;
  const baseUrl = getApiBaseUrl();
  const upstreamUrl = new URL(
    `${baseUrl}/${path.map(encodeURIComponent).join('/')}`,
  );
  upstreamUrl.search = request.nextUrl.search;
  const forwardedHost = request.headers.get('x-forwarded-host');
  const host = request.headers.get('host');

  if (
    upstreamUrl.origin === request.nextUrl.origin ||
    hostMatches(host, upstreamUrl) ||
    hostMatches(forwardedHost, upstreamUrl)
  ) {
    return NextResponse.json(
      {
        message:
          'API proxy is pointing back to the web app. Set API_BASE_URL on the web service to the Nest API URL.',
      },
      { status: 502 },
    );
  }

  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('connection');
  headers.delete('content-length');
  headers.set(PROXY_DEPTH_HEADER, '1');

  let response: Response;
  try {
    response = await fetch(upstreamUrl, {
      body:
        request.method === 'GET' || request.method === 'HEAD'
          ? undefined
          : await request.arrayBuffer(),
      cache: 'no-store',
      headers,
      method: request.method,
      redirect: 'manual',
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: `Could not reach Nest API at ${baseUrl}. Check API_BASE_URL on the web service.`,
        detail: (error as Error).message,
      },
      { status: 502 },
    );
  }

  const responseHeaders = new Headers();
  for (const header of [
    'content-type',
    'content-disposition',
    'cache-control',
  ]) {
    const value = response.headers.get(header);
    if (value) responseHeaders.set(header, value);
  }

  if (
    response.status >= 500 &&
    !response.headers.get('content-type')?.includes('application/json')
  ) {
    return NextResponse.json(
      {
        message: `Nest API returned ${response.status} for /${path.join('/')}. Check the API service logs on Render.`,
      },
      { status: response.status },
    );
  }

  return new Response(response.body, {
    headers: responseHeaders,
    status: response.status,
    statusText: response.statusText,
  });
}

export function OPTIONS() {
  return new Response(null, { status: 204 });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
