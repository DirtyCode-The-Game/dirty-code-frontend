import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    const { token } = await params;

    if (!token) {
        return NextResponse.json({ error: 'Token is missing' }, { status: 400 });
    }

    const cookieStore = await cookies();
    cookieStore.set('dirty_token', token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    });

    return NextResponse.redirect(new URL('/game', request.url));
}
