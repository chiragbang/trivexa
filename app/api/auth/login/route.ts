import { loginUser } from '@/lib/actions/auth.action';
import { signToken } from '@/lib/auth/jwt';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { user } = await loginUser(data);

        const token = signToken({ userId: user.id, role: user.role });

        const response = NextResponse.json({ user });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }
}
