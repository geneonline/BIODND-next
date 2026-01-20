import { NextResponse } from 'next/server';
import { setAuthCookie } from '@/lib/auth';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
  try {
    const { accessToken } = await request.json();

    if (!baseURL) {
        console.error("Missing NEXT_PUBLIC_API_URL environment variable");
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (!accessToken) {
        return NextResponse.json({ error: 'Missing access token' }, { status: 400 });
    }

    console.log(`BFF: verifying google token with backend: ${baseURL}/api/Account/GoogleLogin`);

    const backendRes = await fetch(`${baseURL}/api/Account/GoogleLogin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken }),
    });

    if (!backendRes.ok) {
      let errorData = {};
      try {
           errorData = await backendRes.json();
      } catch (e) {
          console.error("BFF: Failed to parse backend error response", e);
      }
      
      console.error("BFF: Backend verification failed", backendRes.status, errorData);
      
      return NextResponse.json({ 
          error: (errorData as any).error || 'Google login failed' 
      }, { status: backendRes.status });
    }

    const data = await backendRes.json();
    const jwtToken = data.token; 

    await setAuthCookie(jwtToken);

    return NextResponse.json({ 
        success: true, 
        token: jwtToken,
        user: data
    });

  } catch (error: any) {
    console.error("BFF: Internal Error", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
