// app/api/auth/register/route.ts

import { registerUser } from '@/lib/actions/auth.action';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const result = await registerUser(data);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
