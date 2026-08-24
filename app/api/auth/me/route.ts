import { NextResponse } from 'next/server';
import { optionalAuth } from '@/lib/auth/middleware';

/**
 * GET /api/auth/me
 * Returns the currently authenticated user profile, or 401 if not logged in.
 * Used for client-side hydration.
 */
export async function GET(): Promise<NextResponse> {
  const user = await optionalAuth();

  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  return NextResponse.json(user);
}
