export interface User {
  id: string;
  elixpo_user_id: string;
  github_login?: string;
  display_name: string;
  avatar_url?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface HostOrganization {
  id: string;
  name: string;
  slug: string;
  owner_user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Contest {
  id: string;
  host_organization_id: string;
  name: string;
  slug: string;
  summary: string;
  status:
    | 'draft'
    | 'applications_open'
    | 'active'
    | 'review'
    | 'completed'
    | 'archived';
  repository_mode: 'selected' | 'organization';
  starts_at: string;
  ends_at: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ContestMembership {
  id: string;
  contest_id: string;
  user_id: string;
  role:
    | 'host'
    | 'co_host'
    | 'project_admin'
    | 'mentor'
    | 'campus_ambassador'
    | 'contributor';
  created_at: string;
  updated_at: string;
}

export type NotificationType = 'PR' | 'Points' | 'System' | 'Mentorship';

export interface Notification {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: NotificationType;
  read?: boolean;
}
