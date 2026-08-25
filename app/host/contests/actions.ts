'use server';

import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth/middleware';
import { createContest } from '@/lib/data/contests';

export async function submitNewContest(formData: FormData) {
  // Enforce authentication
  const authResult = await requireAuth();
  if (authResult.error) {
    throw new Error('You must be logged in to create a contest.');
  }

  const { user } = authResult;

  // Extract form fields
  const name = formData.get('name') as string;
  const startsAt = formData.get('startsAt') as string;
  const endsAt = formData.get('endsAt') as string;
  const summary = formData.get('summary') as string;
  const scope = formData.get('scope') as string;

  // Basic validation
  if (!name || !startsAt || !endsAt || !summary) {
    throw new Error('All fields are required.');
  }

  // Determine repository mode from the selected scope
  const repositoryMode = scope === 'organization' ? 'organization' : 'selected';

  // Create the contest
  const slug = await createContest(
    {
      name,
      startsAt,
      endsAt,
      summary,
      repositoryMode,
    },
    user.userId,
    user.displayName,
  );

  // Redirect to host dashboard
  // Alternatively, we could redirect to `/host/contests/${slug}/rules`
  redirect('/host');
}
