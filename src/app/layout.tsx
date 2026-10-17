import type { Metadata, Viewport } from 'next';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@/styles/globals.css';
import { site } from '@/config/site';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { AgeGate } from '@/components/AgeGate';
import { Reveal } from '@/components/Reveal';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — A Collection of Empires`, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
      { url: '/brand/favicons/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/brand/favicons/app-icon-180.png',
  },
  openGraph: {
    type: 'website',
    siteName: site.name,
    images: [{ url: '/brand/social/og-default.png', width: 1200, height: 630, alt: site.name }],
  },
  // Adult tobacco content: keep it out of search features aimed at general audiences.
  other: { rating: 'adult' },
};

export const viewport: Viewport = {
  themeColor: '#0b0907',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Flags that JavaScript runs, so scroll reveals never hide content without it. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <AgeGate />
        <Reveal />
      </body>
    </html>
  );
}
