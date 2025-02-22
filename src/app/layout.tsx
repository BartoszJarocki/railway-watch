import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Providers from '../components/context/providers';

export const dynamic = 'force-dynamic';

import './globals.css';
import { cn } from '../lib/utils';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Railway Monitor',
  description: 'Monitor your Railway applications',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="w-full h-full">
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          'w-full h-full bg-background'
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
