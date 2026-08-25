import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/cloudflare';
import type { ContestRole } from '@/lib/domain';
import { getSession } from './session';
import type { AuthenticatedUser } from './types';

/**
 * Require a valid session. Returns the authenticated user or a 401 response.
 */
export async function requireAuth(): Promise<
  | { user: AuthenticatedUser; error?: never }
  | { user?: never; error: NextResponse }
> {
  const session = await getSession();

  if (!session) {
    return {
      error: NextResponse.json(
        { error: 'unauthorized', message: 'Authentication required' },
        { status: 401 },
      ),
    };
  }

  return { user: session.user };
}

/**
 * Optionally resolve the current user. Returns null if not logged in.
 */
export async function optionalAuth(): Promise<AuthenticatedUser | null> {
  const session = await getSession();
  return session?.user ?? null;
}

/**
 * Require a valid session AND a specific contest role.
 * Returns the user or an error response (401 if not logged in, 403 if wrong role).
 */
export async function requireContestRole(
  contestId: string,
  allowedRoles: ContestRole[],
): Promise<
  | { user: AuthenticatedUser; role: ContestRole; error?: never }
  | { user?: never; role?: never; error: NextResponse }
> {
  const authResult = await requireAuth();
  if (authResult.error) return authResult;

  const db = await getDatabase();
  const membership = await db
    .prepare(
      `SELECT role FROM contest_memberships
       WHERE contest_id = ? AND user_id = ? AND status = 'active'
       LIMIT 1`,
    )
    .bind(contestId, authResult.user.userId)
    .first<{ role: ContestRole }>();

  if (!membership || !allowedRoles.includes(membership.role)) {
    return {
      error: NextResponse.json(
        {
          error: 'forbidden',
          message: 'You do not have the required role for this contest',
        },
        { status: 403 },
      ),
    };
  }

  return { user: authResult.user, role: membership.role };
}
