import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Internal static images only (no remotePatterns configured in next.config).
// Rejects scanner payloads (SQLi probes, malformed %-encoding) before they
// reach Next's image optimizer, which otherwise throws URIError / logs noise.
const SAFE_INTERNAL_IMAGE = /^\/(?!\/)[A-Za-z0-9\-_/.]+\.(?:png|jpe?g|gif|webp|avif|svg|ico)$/i;

function isSuspiciousImageRequest(request: NextRequest): boolean {
  const url = request.nextUrl.searchParams.get('url');
  if (!url) return false; // let the optimizer return its own 400 for a missing param
  let decoded: string;
  try {
    decoded = decodeURIComponent(url);
  } catch {
    return true; // malformed %-encoding: this is the source of the URIError spam
  }
  if (decoded.includes('..')) return true; // path traversal
  return !SAFE_INTERNAL_IMAGE.test(decoded);
}

export default function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/_next/image') {
    if (isSuspiciousImageRequest(request)) {
      return new NextResponse('Bad Request', { status: 400 });
    }
    return NextResponse.next();
  }
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/_next/image']
};
