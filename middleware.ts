import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Exclude static files and favicon
    '/((?!_next/static|_next/image|favicon.ico).*)',
    // Apply to root path and API routes
    '/',
    '/api/:path*',
    '/trpc/:path*'
  ],
};
