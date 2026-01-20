import { NextResponse } from 'next/server';
import { deleteAuthCookie } from '@/lib/auth';

export async function POST(request: Request) {
  await deleteAuthCookie();
  return NextResponse.json({ success: true });
}
