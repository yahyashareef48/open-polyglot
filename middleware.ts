import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // Extract subdomain
  const subdomain = hostname.split('.')[0];

  // Define supported languages
  const languages = ['german', 'french', 'spanish'];

  // If someone visits /languages/[lang] directly, redirect to subdomain
  if (url.pathname.startsWith('/languages/')) {
    const language = url.pathname.split('/')[2];

    if (languages.includes(language)) {
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
    } else {
      // Language not available, redirect to unavailable page
      url.pathname = '/languages/unavailable';
      url.searchParams.set('lang', language);
      return NextResponse.rewrite(url);
    }
  }

  // If it's a language subdomain and root path, rewrite to language page
  if (languages.includes(subdomain) && url.pathname === '/') {
    url.pathname = `/languages/${subdomain}`;
    return NextResponse.rewrite(url);
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