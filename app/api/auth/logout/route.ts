import { type NextRequest, NextResponse } from 'next/server';
import { destroySession, getSessionId } from '@/lib/auth/session';
import { publicEnv } from '@/lib/env';

/**
 * POST /api/auth/logout
 * Destroys the current session and redirects to the homepage.
 */
export async function POST(_request: NextRequest): Promise<NextResponse> {
  const sessionId = await getSessionId();
  if (sessionId) {
    await destroySession(sessionId);
  }

  return NextResponse.redirect(new URL('/', publicEnv.appUrl).toString());
}
