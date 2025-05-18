import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware to selectively route requests to edge or node.js runtime
export function middleware(request: NextRequest) {
  // Only use Edge Runtime for specific API endpoints
  // This helps reduce the bundle size and stay within the free tier limits
  const url = request.nextUrl.pathname;
  
  // Add necessary headers here if needed
  const headers = new Headers(request.headers);
  
  return NextResponse.next({
    request: {
      headers,
    },
  });
}

// Match specific paths for middleware
export const config = {
  matcher: [
    // Only process specific API routes through middleware
    '/api/get-next-completion-stream-promise/:path*',
  ],
}; 