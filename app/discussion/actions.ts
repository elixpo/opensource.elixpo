'use server';

import { requireAuth } from '@/lib/auth/middleware';
import { type Discussion, type DiscussionVisibility, createDiscussion } from '@/lib/data/discussions';

export async function submitDiscussionAction(
  title: string,
  body: string,
  contestSlug: string,
  tags: string[],
  visibility: string,
): Promise<Discussion> {
  const authResult = await requireAuth();
  if (authResult.error) {
    throw new Error('You must be logged in to create a discussion.');
  }

  if (!title.trim() || !body.trim() || !contestSlug) {
    throw new Error('Title, body, and contest are required.');
  }

  // Ensure visibility matches expected types
  if (!['public', 'contributors', 'project_members'].includes(visibility)) {
    throw new Error('Invalid visibility setting.');
  }

  return await createDiscussion(
    {
      title: title.trim(),
      body: body.trim(),
      contestSlug,
      tags,
      visibility: visibility as DiscussionVisibility,
    },
    authResult.user.userId,
  );
}
