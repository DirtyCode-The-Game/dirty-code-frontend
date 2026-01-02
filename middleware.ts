
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Check for the auth token in cookies
    const token = request.cookies.get('dirty_token')

    // Define protected routes
    if (request.nextUrl.pathname.startsWith('/game')) {
        if (!token) {
            // If valid token is missing, redirect to login/landing
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/game/:path*'],
}
