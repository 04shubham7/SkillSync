import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// @ts-ignore
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  // Protect meeting and meetings routes
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const protectedPaths = pathname.startsWith('/meetings') || pathname.startsWith('/meeting');
  if (!protectedPaths) return NextResponse.next();

  if (!token) {
    const signInUrl = new URL('/auth/signin', req.url);
    signInUrl.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Optionally, could enforce role-based redirects here using token.role
  return NextResponse.next();
}

export const config = {
  matcher: ['/meetings/:path*', '/meeting/:path*'],
};
