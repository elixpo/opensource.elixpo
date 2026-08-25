import { cookies } from 'next/headers';
import { getCache, getDatabase } from '@/lib/cloudflare';
import { fetchUserProfile, refreshAccessToken } from './oauth';
import type { AuthenticatedUser, SessionData } from './types';

const SESSION_COOKIE = 'ose_session';
const SESSION_PREFIX = 'session:';
const STATE_PREFIX = 'oauth_state:';

/** How long a session lives in KV (30 days in seconds) */
const SESSION_TTL = 30 * 24 * 60 * 60;
/** How long an OAuth state token is valid (10 minutes) */
const STATE_TTL = 10 * 60;

/**
 * Generate a cryptographically random ID.
 */
function generateId(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Store an OAuth state token in KV for CSRF validation.
 */
export async function storeOAuthState(state: string): Promise<void> {
  const kv = await getCache();
  await kv.put(`${STATE_PREFIX}${state}`, '1', {
    expirationTtl: STATE_TTL,
  });
}

/**
 * Validate and consume an OAuth state token. Returns true if valid.
 * The token is deleted after validation (single-use).
 */
export async function validateOAuthState(state: string): Promise<boolean> {
  const kv = await getCache();
  const key = `${STATE_PREFIX}${state}`;
  const value = await kv.get(key);
  if (!value) return false;
  await kv.delete(key);
  return true;
}

/**
 * Create a new session after successful OAuth callback.
 * Stores session data in KV, tracks it in D1, and sets an HTTP-only cookie.
 */
export async function createSession(
  data: Omit<SessionData, 'createdAt'>,
): Promise<string> {
  const sessionId = generateId();
  const kv = await getCache();

  const sessionData: SessionData = {
    ...data,
    createdAt: Date.now(),
  };

  // Store in KV
  await kv.put(`${SESSION_PREFIX}${sessionId}`, JSON.stringify(sessionData), {
    expirationTtl: SESSION_TTL,
  });

  // Track in D1
  const db = await getDatabase();
  await db
    .prepare(
      `INSERT INTO sessions (id, user_id, expires_at)
       VALUES (?, ?, datetime('now', '+30 days'))`,
    )
    .bind(sessionId, data.userId)
    .run();

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL,
  });

  return sessionId;
}

/**
 * Get the current session from the cookie, if any.
 * Automatically refreshes expired access tokens.
 */
export async function getSession(): Promise<{
  user: AuthenticatedUser;
  sessionId: string;
} | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const kv = await getCache();
  const raw = await kv.get(`${SESSION_PREFIX}${sessionId}`);
  if (!raw) return null;

  const data: SessionData = JSON.parse(raw);

  // Check if access token needs refresh (with 60s buffer)
  if (data.tokenExpiresAt < Date.now() - 60_000) {
    try {
      const tokens = await refreshAccessToken(data.refreshToken);
      const profile = await fetchUserProfile(tokens.access_token);

      data.accessToken = tokens.access_token;
      data.refreshToken = tokens.refresh_token;
      data.tokenExpiresAt = Date.now() + tokens.expires_in * 1000;
      data.displayName = profile.displayName;
      data.email = profile.email;
      data.avatar = profile.avatar;

      await kv.put(`${SESSION_PREFIX}${sessionId}`, JSON.stringify(data), {
        expirationTtl: SESSION_TTL,
      });
    } catch {
      // Refresh failed — session is invalid, clean up
      await destroySession(sessionId);
      return null;
    }
  }

  return {
    sessionId,
    user: {
      userId: data.userId,
      elixpoUserId: data.elixpoUserId,
      displayName: data.displayName,
      email: data.email,
      avatar: data.avatar,
    },
  };
}

/**
 * Destroy a session — remove from KV, delete from D1, and clear cookie.
 */
export async function destroySession(sessionId: string): Promise<void> {
  const kv = await getCache();
  await kv.delete(`${SESSION_PREFIX}${sessionId}`);

  const db = await getDatabase();
  await db.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();

  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/**
 * Get the raw session ID from the cookie without fetching data.
 */
export async function getSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
}
