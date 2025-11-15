import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Use X-Forwarded-Host for custom domain mapping, fallback to host
  const hostname = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // Define supported languages and known languages (that could be requested)
  const availableLanguages = ['german', 'french', 'spanish'];
  const knownLanguages = ['german', 'french', 'spanish', 'italian', 'portuguese', 'dutch', 'russian', 'japanese', 'korean', 'mandarin', 'chinese', 'arabic', 'hindi'];

  // Extract subdomain - handle different URL patterns
  let subdomain = hostname.split('.')[0];

  // For openpolyglot.org, check if we have a language subdomain
  if (hostname.includes('openpolyglot.org')) {
    const parts = hostname.split('.');
    if (parts.length >= 3) {
      // e.g., german.openpolyglot.org
      subdomain = parts[0];
    } else {
      // e.g., openpolyglot.org (main domain)
      subdomain = '';
    }
  } else if (hostname.includes('a.run.app')) {
    // Cloud Run URLs - no language subdomain
    subdomain = '';
  }

  // Define production domain mapping
  const getBaseDomain = (currentHostname: string): string => {
    if (currentHostname.includes('localhost')) {
      const port = currentHostname.includes(':') ? ':' + currentHostname.split(':')[1] : '';
      return `localhost${port}`;
    }
    // For production, always use openpolyglot.org regardless of hosting platform
    if (currentHostname.includes('openpolyglot.org')) {
      return 'openpolyglot.org';
    }
    // Handle Cloud Run URLs
    if (currentHostname.includes('a.run.app')) {
      return currentHostname; // Use the full Cloud Run domain as base
    }
    // Fallback for other domains
    return currentHostname.replace(/^[^.]+\./, '');
  };

  // Check if we're on the main domain
  const baseDomain = getBaseDomain(hostname);
  const isMainDomain = subdomain === '' ||  // No subdomain extracted
                       hostname === baseDomain ||
                       hostname === 'localhost:3000' ||
                       hostname === 'localhost' ||
                       hostname.includes('a.run.app') ||  // Treat all Cloud Run URLs as main domain
                       hostname === 'openpolyglot.org';   // Main production domain


  if (!isMainDomain) {
    // Handle subdomain requests - rewrite all paths to include /languages/[subdomain]
    if (availableLanguages.includes(subdomain)) {
      // Available language - rewrite to language page while preserving the path
      const currentPath = url.pathname;
      url.pathname = `/languages/${subdomain}${currentPath}`;
      return NextResponse.rewrite(url);
    } else if (knownLanguages.includes(subdomain)) {
      // Known but unavailable language - show unavailable page (only for root path)
      if (url.pathname === '/') {
        url.pathname = '/languages/unavailable';
        url.searchParams.set('lang', subdomain);
        return NextResponse.rewrite(url);
      }
    } else {
      // Unknown subdomain - show 404
      url.pathname = '/not-found';
      return NextResponse.rewrite(url);
    }
  }

  // If someone visits /languages/[lang] directly on main domain, redirect to subdomain
  if (isMainDomain && url.pathname.startsWith('/languages/')) {
    const pathParts = url.pathname.split('/').filter(Boolean); // ['languages', 'german', 'a1', ...]
    const language = pathParts[1]; // 'german'
    const remainingPath = pathParts.slice(2).join('/'); // 'a1/...' or ''

    if (availableLanguages.includes(language)) {
      const isLocalhost = hostname.includes('localhost');
      const targetBaseDomain = getBaseDomain(hostname);

      if (isLocalhost) {
        const port = hostname.includes(':') ? ':' + hostname.split(':')[1] : '';
        url.host = `${language}.localhost${port}`;
        url.pathname = remainingPath ? `/${remainingPath}` : '/';
        return NextResponse.redirect(url);
      } else {
        url.protocol = 'https:';
        url.host = `${language}.${targetBaseDomain}`;
        url.pathname = remainingPath ? `/${remainingPath}` : '/';
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
     * - logo (logo assets)
     * - public static assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logo|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.ico|.*\\.webp).*)',
  ],
};