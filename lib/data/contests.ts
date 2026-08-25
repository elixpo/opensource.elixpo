import { getDatabase } from '@/lib/cloudflare';
import type { ContestStatus } from '@/lib/domain';

function generateId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, '')}`;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

/**
 * Ensures a user has a host organization.
 * If they don't, it creates a personal workspace organization for them.
 */
export async function ensureHostOrganization(
  userId: string,
  displayName: string,
): Promise<string> {
  const db = await getDatabase();
  const existingOrg = await db
    .prepare('SELECT id FROM host_organizations WHERE owner_user_id = ? LIMIT 1')
    .bind(userId)
    .first<{ id: string }>();

  if (existingOrg) {
    return existingOrg.id;
  }

  const orgId = generateId('org');
  const slug = generateSlug(`${displayName} Workspace`);
  
  await db
    .prepare(
      `INSERT INTO host_organizations (id, name, slug, owner_user_id)
       VALUES (?, ?, ?, ?)`
    )
    .bind(orgId, `${displayName}'s Workspace`, slug, userId)
    .run();

  return orgId;
}

export interface CreateContestData {
  name: string;
  startsAt: string;
  endsAt: string;
  summary: string;
  repositoryMode: 'selected' | 'organization';
}

/**
 * Creates a new contest and automatically assigns the creator as the host_owner.
 */
export async function createContest(
  data: CreateContestData,
  userId: string,
  displayName: string,
): Promise<string> {
  const db = await getDatabase();
  const orgId = await ensureHostOrganization(userId, displayName);
  
  const contestId = generateId('con');
  let slug = generateSlug(data.name);
  
  // Basic collision check for slug (within same organization)
  const existing = await db
    .prepare('SELECT id FROM contests WHERE host_organization_id = ? AND slug = ? LIMIT 1')
    .bind(orgId, slug)
    .first();
    
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  // Use a batch to insert contest and membership atomically
  const insertContest = db.prepare(
    `INSERT INTO contests (id, host_organization_id, name, slug, summary, status, repository_mode, starts_at, ends_at, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    contestId,
    orgId,
    data.name,
    slug,
    data.summary,
    'draft',
    data.repositoryMode,
    data.startsAt,
    data.endsAt,
    userId
  );

  const membershipId = generateId('mem');
  const insertMembership = db.prepare(
    `INSERT INTO contest_memberships (id, contest_id, user_id, role, status)
     VALUES (?, ?, ?, ?, 'active')`
  ).bind(membershipId, contestId, userId, 'host_owner');

  await db.batch([insertContest, insertMembership]);

  return slug;
}

export interface HostContestStats {
  id: string;
  name: string;
  slug: string;
  startsAt: string;
  endsAt: string;
  status: ContestStatus;
  progress: number;
  people: number;
  repositories: number;
}

/**
 * Gets contests where the user is a host owner or host admin.
 */
export async function getHostContests(userId: string): Promise<HostContestStats[]> {
  const db = await getDatabase();
  
  // Note: progress calculation is simplified here for the UI
  const { results } = await db
    .prepare(
      `SELECT 
         c.id, c.name, c.slug, c.starts_at as startsAt, c.ends_at as endsAt, c.status,
         (SELECT count(*) FROM contest_memberships WHERE contest_id = c.id AND status = 'active') as people,
         (SELECT count(*) FROM repositories WHERE contest_id = c.id AND active = 1) as repositories
       FROM contests c
       JOIN contest_memberships cm ON c.id = cm.contest_id
       WHERE cm.user_id = ? AND cm.role IN ('host_owner', 'host_admin') AND cm.status = 'active'
       ORDER BY c.created_at DESC`
    )
    .bind(userId)
    .all<Omit<HostContestStats, 'progress'>>();

  const now = new Date().getTime();

  return results.map(contest => {
    const start = new Date(contest.startsAt).getTime();
    const end = new Date(contest.endsAt).getTime();
    
    let progress = 0;
    if (now >= end) progress = 100;
    else if (now > start) {
      progress = Math.round(((now - start) / (end - start)) * 100);
    }
    
    return {
      ...contest,
      progress
    };
  });
}
