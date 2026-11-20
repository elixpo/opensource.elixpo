import type { Metadata } from 'next';
import { publicEnv } from '@/lib/env';

interface PublicMetadataOptions {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}

export function createPublicMetadata({
  title,
  description,
  path,
  noIndex = false,
}: PublicMetadataOptions): Metadata {
  const image = {
    url: '/opengraph-image',
    width: 1200,
    height: 630,
    alt: 'Elixpo Open Source',
  };

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: new URL(path, publicEnv.appUrl).toString(),
      siteName: 'Elixpo Open Source',
      type: 'website',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.url],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}
