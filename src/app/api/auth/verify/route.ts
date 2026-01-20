import { NextResponse } from 'next/server';
import { setAuthCookie } from '@/lib/auth';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
        return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    /* 
      We call backend VerifyMail. 
      It usually returns { token: "..." } or { user: { token: "..." } }
    */
    const backendRes = await fetch(`${baseURL}/api/Account/VerifyMail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!backendRes.ok) {
      let errorData = {};
      try {
           errorData = await backendRes.json();
      } catch (e) { }
      
      return NextResponse.json({ 
          error: (errorData as any).error || 'Verification failed' 
      }, { status: backendRes.status });
    }

    const data = await backendRes.json();
    const authToken = data?.token || data?.user?.token;

    if (authToken) {
        await setAuthCookie(authToken);
    }

    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
