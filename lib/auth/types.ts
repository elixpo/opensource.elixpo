/**
 * Type definitions for the Elixpo OAuth integration.
 * Based on accounts.elixpo/docs/OAUTH_INTEGRATION.md
 */

/** Response from POST /api/auth/token */
export interface ElixpoTokenResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token: string;
  scope: string;
}

/** Response from GET /api/auth/me */
export interface ElixpoUserProfile {
  id: string;
  userId: string;
  email: string;
  displayName: string;
  isAdmin: boolean;
  provider: string;
  avatar: string | null;
  emailVerified: boolean;
  expiresAt: string;
}

/** Stored in KV alongside the session ID */
export interface SessionData {
  userId: string;
  elixpoUserId: string;
  accessToken: string;
  refreshToken: string;
  tokenExpiresAt: number;
  displayName: string;
  email: string;
  avatar: string | null;
  createdAt: number;
}

/** Returned to callers of requireAuth / optionalAuth */
export interface AuthenticatedUser {
  userId: string;
  elixpoUserId: string;
  displayName: string;
  email: string;
  avatar: string | null;
}

/** OAuth error from accounts.elixpo */
export interface OAuthError {
  error: string;
  error_description?: string;
}
