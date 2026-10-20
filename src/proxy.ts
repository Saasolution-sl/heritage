import { NextResponse, type NextRequest } from 'next/server';
import { compliance } from '@/config/compliance';

// Reads the visitor's country from the hosting provider's geolocation header
// and passes it to the page in a cookie, so the trade gate can apply that
// country's rules. Vercel, Cloudflare, Netlify and CloudFront each send one of
// these headers; with none (e.g. local development) the gate applies the
// default rule and lets the visitor choose their country.
const GEO_HEADERS = ['x-vercel-ip-country', 'cf-ipcountry', 'x-country', 'x-nf-country', 'cloudfront-viewer-country'];

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const country = GEO_HEADERS.map((h) => request.headers.get(h)).find((v) => v && /^[A-Za-z]{2}$/.test(v) && v.toUpperCase() !== 'XX');
  if (country && request.cookies.get(compliance.countryCookie)?.value !== country.toUpperCase()) {
    response.cookies.set(compliance.countryCookie, country.toUpperCase(), { path: '/', sameSite: 'lax', secure: request.nextUrl.protocol === 'https:', maxAge: 60 * 60 * 24 });
  }
  return response;
}

export const config = {
  // Pages only: skip build assets, brand files and metadata routes.
  matcher: ['/((?!_next/|brand/|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest).*)'],
};
