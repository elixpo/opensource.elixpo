import { publicEnv, requireServerEnv } from '@/lib/env';
import type { ElixpoTokenResponse, ElixpoUserProfile } from './types';

const ACCOUNTS_URL = publicEnv.accountsUrl;

/**
 * Build the accounts.elixpo authorization URL.
 * The caller is responsible for storing `state` for CSRF validation.
 */
export function getAuthorizationUrl(
  state: string,
  redirectUri: string,
): string {
  const clientId = process.env.NEXT_PUBLIC_ELIXPO_CLIENT_ID ?? '';
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    scope: 'openid profile email',
  });
  return `${ACCOUNTS_URL}/oauth/authorize?${params.toString()}`;
}

/**
 * Exchange an authorization code for access + refresh tokens.
 * Must be called server-side — never expose the client secret.
 */
export async function exchangeCodeForTokens(
  code: string,
  redirectUri: string,
): Promise<ElixpoTokenResponse> {
  const clientId = requireServerEnv('NEXT_PUBLIC_ELIXPO_CLIENT_ID');
  const clientSecret = requireServerEnv('ELIXPO_CLIENT_SECRET');

  const res = await fetch(`${ACCOUNTS_URL}/api/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Token exchange failed (${res.status}): ${body}`);
  }

  return res.json() as Promise<ElixpoTokenResponse>;
}

/**
 * Refresh an expired access token using a refresh token.
 * Refresh tokens are rotated on each use — store the new one.
 */
export async function refreshAccessToken(
  refreshToken: string,
): Promise<ElixpoTokenResponse> {
  const clientId = requireServerEnv('NEXT_PUBLIC_ELIXPO_CLIENT_ID');

  const res = await fetch(`${ACCOUNTS_URL}/api/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Token refresh failed (${res.status}): ${body}`);
  }

  return res.json() as Promise<ElixpoTokenResponse>;
}

/**
 * Fetch the authenticated user's profile from accounts.elixpo.
 */
export async function fetchUserProfile(
  accessToken: string,
): Promise<ElixpoUserProfile> {
  const res = await fetch(`${ACCOUNTS_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`User profile fetch failed (${res.status}): ${body}`);
  }

  return res.json() as Promise<ElixpoUserProfile>;
}
