import type { NextConfig } from 'next';

// The committed `.env` is SOPS-encrypted for maintainers. Next.js loads it
// before this file runs, so without a key every value in it arrives as an
// `ENC[...]` string. Outside production, drop those values so each feature
// falls back to its default (see lib/env.ts) instead of receiving ciphertext.
if (process.env.NODE_ENV !== 'production') {
  for (const [key, value] of Object.entries(process.env)) {
    if (typeof value === 'string' && value.startsWith('ENC[')) {
      Reflect.deleteProperty(process.env, key);
    }
  }
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
