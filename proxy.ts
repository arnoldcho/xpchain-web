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

// Every route we serve is an ASCII slug. Scanner payloads (SQLi probes,
// traversal, control chars) never match, so reject them before next-intl
// turns them into a rewrite.
const SAFE_PATHNAME = /^\/[A-Za-z0-9\-_/.~]*$/;

function isSuspiciousPathname(pathname: string): boolean {
  let decoded: string;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return true; // malformed %-encoding
  }
  if (decoded.includes('..')) return true; // path traversal
  return !SAFE_PATHNAME.test(decoded);
}

export default function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/_next/image') {
    if (isSuspiciousImageRequest(request)) {
      return new NextResponse('Bad Request', { status: 400 });
    }
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  if (isSuspiciousPathname(pathname)) {
    return new NextResponse('Bad Request', { status: 400 });
  }

  // Every route is an ASCII slug, so a %-escape here is always redundant.
  // next-intl would answer it with an absolute cross-origin rewrite that Next
  // then tries to HTTP-proxy back to itself (EPROTO/ECONNREFUSED -> 500);
  // redirecting to the canonical form keeps the request on the normal path.
  const canonical = decodeURIComponent(pathname);
  if (canonical !== pathname) {
    const target = request.nextUrl.clone();
    target.pathname = canonical;
    return NextResponse.redirect(target, 308);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/_next/image']
};
