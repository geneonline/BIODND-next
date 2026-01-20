import { NextResponse } from 'next/server';
import { setAuthCookie } from '@/lib/auth';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
  try {
    const { email, password, encodedEmail, encodedPassword } = await request.json();

    // Use pre-encoded values if provided (legacy support), otherwise encoded raw inputs
    // The previous AuthContext used btoa() encoding.
    // If the client sends raw email/pass, we might need to encode them here if the backend expects it.
    // However, looking at the previous AuthContext, it sends:
    // /api/Account/Login?email=${encodedEmail}&abcd=${encodedPassword}
    
    // We will assume the AuthContext update will handle the internal consistency,
    // but let's try to pass exactly what the backend expects.
    
    // If the frontend calls this API with the query params structure, we need to adapt.
    // Let's assume the frontend sends the query string params necessary for the external API.
    
    let targetUrl = `${baseURL}/api/Account/Login`;
    const params = new URLSearchParams();
    
    if (encodedEmail && encodedPassword) {
         params.append("email", encodedEmail);
         params.append("abcd", encodedPassword);
    } else if (email && password) {
         // Fallback server-side encoding if needed, but btoa is web-api. In node we use Buffer.
         const eEmail = Buffer.from(email).toString('base64');
         const ePass = Buffer.from(password).toString('base64');
         params.append("email", eEmail);
         params.append("abcd", ePass);
    } else {
        return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    targetUrl += `?${params.toString()}`;

    const backendRes = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!backendRes.ok) {
      let errorData = {};
      try {
        errorData = await backendRes.json();
      } catch (e) {
          // ignore json parse error
      }
      return NextResponse.json({ 
          error: (errorData as any).error || 'Login failed',
          errorCode: (errorData as any).errorCode 
      }, { status: backendRes.status });
    }

    const data = await backendRes.json();
    const jwtToken = data.token; 

    await setAuthCookie(jwtToken);

    // Return the token as well for client-side syncing
    return NextResponse.json({ 
        success: true, 
        token: jwtToken,
        user: data // pass the whole response in case it contains user info like reasonForUse
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
