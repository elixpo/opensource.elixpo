import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { publicEnv } from '@/lib/env';
import './globals.css';

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.appUrl),
  title: {
    default: 'Elixpo Open Source — Run programs that ship',
    template: '%s | Elixpo Open Source',
  },
  description:
    'Run open-source competitions, mentorship programs, and long-running initiatives with GitHub-native workflows.',
  applicationName: 'Elixpo Open Source',
  openGraph: {
    title: 'Elixpo Open Source — Run programs that ship',
    description:
      'GitHub-native programs, contribution tracking, leaderboards, mentorship, and payouts.',
    type: 'website',
    siteName: 'Elixpo Open Source',
    url: publicEnv.appUrl,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Elixpo Open Source',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Elixpo Open Source — Run programs that ship',
    description:
      'GitHub-native programs, contribution tracking, leaderboards, mentorship, and payouts.',
    images: ['/opengraph-image'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
