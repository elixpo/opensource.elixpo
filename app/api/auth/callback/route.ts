import { type NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens, fetchUserProfile } from '@/lib/auth/oauth';
import { createSession, validateOAuthState } from '@/lib/auth/session';
import { getDatabase } from '@/lib/cloudflare';
import { publicEnv } from '@/lib/env';

/**
 * GET /api/auth/callback
 * Handles the OAuth redirect from accounts.elixpo.
 *
 * 1. Validates the CSRF state
 * 2. Exchanges the authorization code for tokens
 * 3. Fetches the user profile from accounts.elixpo
 * 4. Upserts the user in the local D1 users table
 * 5. Creates a session in KV + sets the session cookie
 * 6. Redirects to /dashboard
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;

  // Handle denial
  const error = searchParams.get('error');
  if (error) {
    const desc = searchParams.get('error_description') ?? 'Access denied';
    const loginUrl = new URL('/login', publicEnv.appUrl);
    loginUrl.searchParams.set('error', desc);
    return NextResponse.redirect(loginUrl.toString());
  }

  // Validate state (CSRF protection)
  const state = searchParams.get('state');
  if (!state || !(await validateOAuthState(state))) {
    const loginUrl = new URL('/login', publicEnv.appUrl);
    loginUrl.searchParams.set(
      'error',
      'Invalid or expired login attempt. Please try again.',
    );
    return NextResponse.redirect(loginUrl.toString());
  }

  // Exchange code for tokens
  const code = searchParams.get('code');
  if (!code) {
    const loginUrl = new URL('/login', publicEnv.appUrl);
    loginUrl.searchParams.set('error', 'Missing authorization code.');
    return NextResponse.redirect(loginUrl.toString());
  }

  const redirectUri = `${publicEnv.appUrl}/api/auth/callback`;

  let tokens: Awaited<ReturnType<typeof exchangeCodeForTokens>>;
  try {
    tokens = await exchangeCodeForTokens(code, redirectUri);
  } catch (err) {
    console.error('Token exchange failed:', err);
    const loginUrl = new URL('/login', publicEnv.appUrl);
    loginUrl.searchParams.set('error', 'Login failed. Please try again.');
    return NextResponse.redirect(loginUrl.toString());
  }

  // Fetch user profile
  let profile: Awaited<ReturnType<typeof fetchUserProfile>>;
  try {
    profile = await fetchUserProfile(tokens.access_token);
  } catch (err) {
    console.error('Profile fetch failed:', err);
    const loginUrl = new URL('/login', publicEnv.appUrl);
    loginUrl.searchParams.set('error', 'Failed to retrieve your profile.');
    return NextResponse.redirect(loginUrl.toString());
  }

  // Upsert user in D1
  const db = await getDatabase();
  const localUserId = `usr_${profile.id}`;

  await db
    .prepare(
      `INSERT INTO users (id, elixpo_user_id, display_name, email, avatar_url, updated_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT (elixpo_user_id)
       DO UPDATE SET
         display_name = excluded.display_name,
         email = excluded.email,
         avatar_url = excluded.avatar_url,
         updated_at = datetime('now')`,
    )
    .bind(
      localUserId,
      profile.id,
      profile.displayName,
      profile.email,
      profile.avatar,
    )
    .run();

  // Create session
  await createSession({
    userId: localUserId,
    elixpoUserId: profile.id,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    tokenExpiresAt: Date.now() + tokens.expires_in * 1000,
    displayName: profile.displayName,
    email: profile.email,
    avatar: profile.avatar,
  });

  // Log the login in the audit log
  await db
    .prepare(
      `INSERT INTO audit_log (id, actor_user_id, action, target_type, target_id, metadata_json)
       VALUES (?, ?, 'login', 'user', ?, '{}')`,
    )
    .bind(`aud_${crypto.randomUUID()}`, localUserId, localUserId)
    .run();

  return NextResponse.redirect(
    new URL('/dashboard', publicEnv.appUrl).toString(),
  );
}
