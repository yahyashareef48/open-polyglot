import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // Extract subdomain
  const subdomain = hostname.split('.')[0];

  // Define supported languages and known languages (that could be requested)
  const availableLanguages = ['german', 'french', 'spanish'];
  const knownLanguages = ['german', 'french', 'spanish', 'italian', 'portuguese', 'dutch', 'russian', 'japanese', 'korean', 'mandarin', 'chinese', 'arabic', 'hindi'];

  // Skip processing for main domain (localhost or domain without subdomain)
  const isMainDomain = hostname === 'localhost:3000' || hostname === 'localhost' || !hostname.includes('.') || hostname === request.nextUrl.host;

  if (!isMainDomain && url.pathname === '/') {
    // Handle subdomain requests
    if (availableLanguages.includes(subdomain)) {
      // Available language - rewrite to language page
      url.pathname = `/languages/${subdomain}`;
      return NextResponse.rewrite(url);
    } else if (knownLanguages.includes(subdomain)) {
      // Known but unavailable language - show unavailable page
      url.pathname = '/languages/unavailable';
      url.searchParams.set('lang', subdomain);
      return NextResponse.rewrite(url);
    } else {
      // Unknown subdomain - show 404
      url.pathname = '/not-found';
      return NextResponse.rewrite(url);
    }
  }

  // If someone visits /languages/[lang] directly, redirect to subdomain
  if (url.pathname.startsWith('/languages/')) {
    const language = url.pathname.split('/')[2];

    if (availableLanguages.includes(language)) {
      const isLocalhost = hostname.includes('localhost');

      if (isLocalhost) {
        const port = hostname.includes(':') ? ':' + hostname.split(':')[1] : '';
        url.host = `${language}.localhost${port}`;
        url.pathname = '/';
        return NextResponse.redirect(url);
      } else {
        const baseDomain = hostname.replace(/^[^.]+\./, '');
        url.host = `${language}.${baseDomain}`;
        url.pathname = '/';
        return NextResponse.redirect(url);
      }
    } else if (knownLanguages.includes(language)) {
      // Language not available, redirect to unavailable page
      url.pathname = '/languages/unavailable';
      url.searchParams.set('lang', language);
      return NextResponse.rewrite(url);
    }
    // For unknown languages in /languages/ path, let Next.js handle 404
  }

  return NextResponse.next();
}

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
  ],
};