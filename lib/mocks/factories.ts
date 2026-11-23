import type {
  Contest,
  ContestMembership,
  HostOrganization,
  Notification,
  User,
} from './schema';

let idCounter = 1;
const generateId = (prefix: string) => `${prefix}_${Date.now()}_${idCounter++}`;

export const createMockUser = (overrides?: Partial<User>): User => ({
  id: generateId('usr'),
  elixpo_user_id: `elx_${Date.now()}`,
  github_login: 'mockuser',
  display_name: 'Mock User',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const createMockOrganization = (
  overrides?: Partial<HostOrganization>,
): HostOrganization => ({
  id: generateId('org'),
  name: 'Elixpo Foundation',
  slug: 'elixpo-foundation',
  owner_user_id: 'usr_1',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const createMockContest = (overrides?: Partial<Contest>): Contest => ({
  id: generateId('con'),
  host_organization_id: 'org_1',
  name: 'Winter Open Source Fest',
  slug: 'winter-os-fest',
  summary: 'A month-long open source contribution event.',
  status: 'active',
  repository_mode: 'selected',
  starts_at: new Date().toISOString(),
  ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  created_by: 'usr_1',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const createMockMembership = (
  overrides?: Partial<ContestMembership>,
): ContestMembership => ({
  id: generateId('mem'),
  contest_id: 'con_1',
  user_id: 'usr_1',
  role: 'contributor',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const createMockNotification = (
  overrides?: Partial<Notification>,
): Notification => ({
  id: generateId('notif'),
  title: 'PR #284 merged',
  desc: 'Sofia Chen merged your contribution to elixpo/opensource.',
  time: '2m ago',
  type: 'PR',
  read: false,
  ...overrides,
});
