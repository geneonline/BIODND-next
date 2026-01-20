import { NextResponse } from 'next/server';
import { getAuthCookie } from '@/lib/auth';

// The external backend URL
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: Request, props: { params: Promise<{ path: string[] }> }) {
  const params = await props.params;
  return handleRequest(request, params.path);
}

export async function POST(request: Request, props: { params: Promise<{ path: string[] }> }) {
  const params = await props.params;
  return handleRequest(request, params.path);
}

export async function PUT(request: Request, props: { params: Promise<{ path: string[] }> }) {
  const params = await props.params;
  return handleRequest(request, params.path);
}

export async function DELETE(request: Request, props: { params: Promise<{ path: string[] }> }) {
  const params = await props.params;
  return handleRequest(request, params.path);
}

async function handleRequest(request: Request, pathSegments: string[]) {
  if (!BACKEND_URL) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  // prompt: path is /api/proxy/foo/bar -> pathSegments = ['foo', 'bar']
  // We want to target: BACKEND_URL/foo/bar
  // If the pathSegments include 'api' (e.g. /api/proxy/api/Account), it becomes BACKEND_URL/api/Account
  
  const endpoint = pathSegments.join('/');
  const url = new URL(request.url);
  const queryString = url.search; // keep query params
  
  const targetUrl = `${BACKEND_URL}/${endpoint}${queryString}`;
  
  const token = await getAuthCookie();
  
  const headers: HeadersInit = {
      'Content-Type': 'application/json',
  };
  
  if (token) {
      headers['Authorization'] = `Bearer ${token}`;
  }

  try {
      const body = request.method !== 'GET' && request.method !== 'HEAD' 
          ? await request.text() 
          : undefined;

      const response = await fetch(targetUrl, {
          method: request.method,
          headers: headers,
          body: body,
      });

      // parse response
      const data = await response.text();
      
      let jsonData;
      try {
          jsonData = JSON.parse(data);
      } catch {
          jsonData = data; // fallback to text if not json
      }

      return NextResponse.json(jsonData, { status: response.status });

  } catch (error: any) {
      console.error(`Proxy Error [${request.method} ${targetUrl}]`, error);
      return NextResponse.json({ error: error.message || 'Proxy Error' }, { status: 500 });
  }
}
