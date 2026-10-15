import type { FC, ReactNode } from 'react';
import type { Metadata } from 'next';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { basePath } from '@/lib/base-path';
import '@/styles/globals.css';

export const metadata: Metadata = {
  description:
    'Hyperse Logger is a powerful logging library for Node.js with a plugin architecture. It is built on Hyperse Pipeline for efficient message processing.',
  metadataBase: new URL('https://www.hyperse.net/'),
  keywords: [
    'Hyperse',
    'Logger',
    'Node.js',
    'Plugin',
    'TypeScript',
    'JavaScript',
  ],
  generator: 'Hyperse',
  applicationName: 'Hyperse Logger',
  appleWebApp: {
    title: 'Hyperse Logger',
  },
  title: {
    default: 'Hyperse Logger – Hyperse Logger',
    template: '%s | Hyperse Logger',
  },
  openGraph: {
    url: './',
    siteName: 'Hyperse Logger',
    locale: 'en_US',
    type: 'website',
  },
  other: {
    'msapplication-TileColor': '#fff',
  },
  twitter: {
    site: 'https://www.hyperse.net/',
  },
  alternates: {
    canonical: './',
  },
};

const RootLayout: FC<{
  children: ReactNode;
}> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href={`${basePath}/favicon.svg`}
          type="image/png"
          sizes="32x32"
        />
      </head>
      <body className="flex min-h-screen flex-col">
        {/*
          Fumadocs' static search client builds its URL as
          `join(BASE_PATH, api)`, and `BASE_PATH` comes from Vite's
          `import.meta.env.BASE_URL` — which does not exist in Next.js, so it is
          always `'/'`. Next.js' `basePath` is therefore NOT applied
          automatically, and omitting it makes the client request
          `/api/search` (404) instead of `${basePath}/api/search`.
        */}
        <RootProvider
          search={{
            options: { type: 'static', api: `${basePath}/api/search` },
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
};

export default RootLayout;
