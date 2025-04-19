import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ]
};

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    const pathname = request.nextUrl.pathname;

    // If trying to access auth pages
    if (pathname.startsWith('/auth')) {
        // If session exists, redirect to home
        if (session) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        // If no session, allow access to auth pages
        return NextResponse.next();
    }

    // For all other routes
    if (!session) {
        // If no session, redirect to login
        const url = new URL('/auth/login', request.url);
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }

    // If session exists and not on auth pages, allow access
    return NextResponse.next();
} 