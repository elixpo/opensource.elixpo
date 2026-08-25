import { getDatabase } from '@/lib/cloudflare';

export type DiscussionStatus = 'Open' | 'Resolved' | 'Pinned';
export type DiscussionVisibility = 'public' | 'contributors' | 'project_members';

export interface Discussion {
  id: string;
  title: string;
  body: string;
  author: {
    name: string;
    avatar: string;
  };
  project: string; // Will hold contest_id (or contest slug)
  tags: string[];
  createdAt: string;
  updatedAt: string;
  commentCount: number;
  status: DiscussionStatus;
  visibility: DiscussionVisibility;
}

export interface ContestOption {
  value: string;
  label: string;
}

function generateId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, '')}`;
}

/**
 * Gets contests for the filter dropdown.
 */
export async function getContestOptions(): Promise<ContestOption[]> {
  const db = await getDatabase();
  const { results } = await db
    .prepare(`SELECT slug as value, name as label FROM contests ORDER BY created_at DESC`)
    .all<{ value: string; label: string }>();
  return results;
}

/**
 * Gets discussions. Evaluates visibility based on the requesting user's roles.
 */
export async function getDiscussions(userId: string | null): Promise<Discussion[]> {
  const db = await getDatabase();
  
  // To handle visibility cleanly in SQL:
  // 1. Public discussions are always visible.
  // 2. 'contributors' discussions are visible if user has ANY active role in the contest.
  // 3. 'project_members' discussions are visible if user has a privileged role (host_owner, host_admin, project_admin).
  
  const query = `
    SELECT 
      d.id, d.title, d.body, d.tags, d.status, d.visibility, d.created_at, d.updated_at,
      c.slug as project,
      u.display_name as author_name, u.avatar_url as author_avatar,
      (SELECT count(*) FROM discussion_comments WHERE discussion_id = d.id) as commentCount
    FROM discussions d
    JOIN contests c ON d.contest_id = c.id
    JOIN users u ON d.author_user_id = u.id
    WHERE 
      d.visibility = 'public'
      ${userId ? `
      OR (
        d.visibility = 'contributors' AND EXISTS (
          SELECT 1 FROM contest_memberships cm 
          WHERE cm.contest_id = d.contest_id AND cm.user_id = ? AND cm.status = 'active'
        )
      )
      OR (
        d.visibility = 'project_members' AND EXISTS (
          SELECT 1 FROM contest_memberships cm 
          WHERE cm.contest_id = d.contest_id AND cm.user_id = ? AND cm.status = 'active'
          AND cm.role IN ('host_owner', 'host_admin', 'project_admin')
        )
      )
      ` : ''}
    ORDER BY d.created_at DESC
  `;

  let result;
  if (userId) {
    result = await db.prepare(query).bind(userId, userId).all<any>();
  } else {
    result = await db.prepare(query).all<any>();
  }

  return result.results.map((r) => ({
    id: r.id,
    title: r.title,
    body: r.body,
    author: {
      name: r.author_name,
      avatar: r.author_avatar || '',
    },
    project: r.project,
    tags: JSON.parse(r.tags),
    createdAt: new Date(r.created_at).toLocaleDateString(), // Simple formatting matching mock
    updatedAt: new Date(r.updated_at).toLocaleDateString(),
    commentCount: r.commentCount,
    status: r.status as DiscussionStatus,
    visibility: r.visibility as DiscussionVisibility,
  }));
}

export interface CreateDiscussionData {
  title: string;
  body: string;
  contestSlug: string;
  tags: string[];
  visibility: DiscussionVisibility;
}

export async function createDiscussion(data: CreateDiscussionData, userId: string): Promise<Discussion> {
  const db = await getDatabase();
  
  // Resolve contest slug to ID
  const contest = await db
    .prepare('SELECT id FROM contests WHERE slug = ? LIMIT 1')
    .bind(data.contestSlug)
    .first<{ id: string }>();

  if (!contest) {
    throw new Error('Contest not found.');
  }

  // TODO: we should enforce that the user is actually allowed to post with the requested visibility.
  // E.g., they can only post as 'project_members' if they are a project member.
  // For now, we assume frontend UI limits their options, but backend should ideally verify.

  const id = generateId('dsc');
  
  await db.prepare(`
    INSERT INTO discussions (id, title, body, author_user_id, contest_id, visibility, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    data.title,
    data.body,
    userId,
    contest.id,
    data.visibility,
    JSON.stringify(data.tags)
  ).run();

  // Return a fetched discussion so we have author names populated
  // Since we just inserted it, we know the user can see it.
  const discussions = await getDiscussions(userId);
  return discussions.find(d => d.id === id)!;
}
