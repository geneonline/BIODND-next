import { NextResponse } from 'next/server';
import { getAuthCookie } from '@/lib/auth';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: Request) {
  const token = await getAuthCookie();

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  // Use the token to fetch user profile from backend
  // The backend might have an endpoint for 'me' or we might rely on the client-side 'useUser' approach.
  // However, for a complete BFF, we should be able to get user info server-side.
  // Let's assume there is a way to validate or get profile.
  // If no specific 'me' endpoint exists, we can try to call an endpoint that requires auth to validate it.
  
  // Based on "useUser.ts", the existing app calls "/api/Account" with token to get user data?
  // "useSWR(token ? ["/api/Account", token] : null, ...)"
  // It seems like GET /api/Account returns user data? Or maybe there's a specific route?
  // Let's assume GET /api/Account is the profile endpoint based on useUser usage.
  
  try {
      const backendRes = await fetch(`${baseURL}/api/Account`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    
      if (!backendRes.ok) {
        return NextResponse.json({ user: null }, { status: 401 });
      }
    
      const user = await backendRes.json();
      return NextResponse.json({ user });
  } catch (error) {
       console.error("Error fetching user in /api/auth/me", error);
       return NextResponse.json({ user: null }, { status: 500 });
  }
}
