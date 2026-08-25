import { NextResponse } from 'next/server';
import { getAuthorizationUrl } from '@/lib/auth/oauth';
import { storeOAuthState } from '@/lib/auth/session';
import { publicEnv } from '@/lib/env';

/**
 * GET /api/auth/login
 * Generates a CSRF state, stores it in KV, and redirects to accounts.elixpo.
 */
export async function GET(): Promise<NextResponse> {
  const state = crypto.randomUUID();
  await storeOAuthState(state);

  const redirectUri = `${publicEnv.appUrl}/api/auth/callback`;
  const authUrl = getAuthorizationUrl(state, redirectUri);

  return NextResponse.redirect(authUrl);
}
