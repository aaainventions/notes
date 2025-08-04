import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/api/login', '/favicon.ico', '/_next']; // paths you allow without auth

export function middleware(request: NextRequest) {
  const auth = request.cookies.get('auth')?.value;

  const isPublic = PUBLIC_PATHS.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (!auth || auth !== 'true') {
    if (!isPublic) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}
