import { connectDB } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { User } from '@/models/user';

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies(); // ✅ await here
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const decoded = verifyToken(token) as { userId: string };

    await connectDB();
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('GET /user error:', error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
