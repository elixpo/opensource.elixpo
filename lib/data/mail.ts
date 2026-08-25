import { getCloudflareBindings, getDatabase } from '@/lib/cloudflare';

export async function subscribeToContest(userId: string, contestId: string) {
  const db = await getDatabase();
  await db
    .prepare(
      `INSERT INTO contest_subscribers (contest_id, user_id)
       VALUES (?, ?)
       ON CONFLICT DO NOTHING`
    )
    .bind(contestId, userId)
    .run();
}

export async function sendContestAnnouncement(
  userId: string,
  contestId: string,
  subject: string,
  markdownBody: string
) {
  const db = await getDatabase();

  // Verify the user is a host owner or admin for this contest
  const membership = await db
    .prepare(
      `SELECT role FROM contest_memberships
       WHERE contest_id = ? AND user_id = ? AND status = 'active'
       LIMIT 1`
    )
    .bind(contestId, userId)
    .first<{ role: string }>();

  if (!membership || !['host_owner', 'host_admin'].includes(membership.role)) {
    throw new Error('You do not have permission to send announcements for this contest.');
  }

  const env = await getCloudflareBindings();
  
  if (!env.EMAIL_OUTBOUND_QUEUE) {
    throw new Error('Email outbound queue is not configured.');
  }

  // Generate payload for mails.elixpo
  const payload = {
    type: 'contest_update',
    contestId,
    subject,
    markdownBody,
  };

  await env.EMAIL_OUTBOUND_QUEUE.send(payload);
}
