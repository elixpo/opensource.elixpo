'use server';

import { requireAuth } from '@/lib/auth/middleware';
import { sendContestAnnouncement, subscribeToContest } from '@/lib/data/mail';

export async function sendAnnouncementAction(
  contestId: string,
  subject: string,
  markdownBody: string,
) {
  const authResult = await requireAuth();
  if (authResult.error) {
    throw new Error('Authentication required.');
  }

  if (!contestId || !subject.trim() || !markdownBody.trim()) {
    throw new Error('All fields are required.');
  }

  await sendContestAnnouncement(
    authResult.user.userId,
    contestId,
    subject,
    markdownBody,
  );
}

export async function subscribeToUpdatesAction(contestId: string) {
  const authResult = await requireAuth();
  if (authResult.error) {
    throw new Error('Authentication required.');
  }

  if (!contestId) {
    throw new Error('Contest ID is required.');
  }

  await subscribeToContest(authResult.user.userId, contestId);
}
