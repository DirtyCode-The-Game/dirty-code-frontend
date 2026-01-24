import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refresh-token') || searchParams.get('refreshToken');

    if (!token || !refreshToken) {
        return NextResponse.json({ error: 'Token is missing' }, { status: 400 });
    }

    const cookieStore = await cookies();

    cookieStore.set('dirty_token', token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    });

    cookieStore.set('dirty_refresh_token', refreshToken, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    });

    try {
        const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8080/dirty-code';

        const userRes = await fetch(`${backendUrl}/v1/users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (userRes.ok) {
            const userData = await userRes.json();

            if (userData.activeAvatar) {
                return NextResponse.redirect(new URL('/game', request.url));
            } else {
                return NextResponse.redirect(new URL('/game/onboarding', request.url));
            }
        } else {
            console.error('Failed to fetch user in login callback', await userRes.text());
            return NextResponse.redirect(new URL('/game', request.url));
        }
    } catch (error) {
        console.error('Error in login callback', error);
        return NextResponse.redirect(new URL('/game', request.url));
    }
}
