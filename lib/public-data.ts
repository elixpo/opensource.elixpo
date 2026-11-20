export const PUBLIC_DEMO_NOTICE =
  'Demonstration content for public page previews. These examples are not live contest records.';

export type PublicContestStatus = 'applications_open' | 'active' | 'completed';

export interface PublicContest {
  slug: string;
  name: string;
  summary: string;
  status: PublicContestStatus;
}

export interface PublicProject {
  owner: string;
  repo: string;
  summary: string;
  technologies: string[];
}

export interface PublicContributor {
  handle: string;
  name: string;
  points: number;
  mergedPullRequests: number;
  streak: number;
  badge: string;
}

export interface PublicMentor {
  handle: string;
  name: string;
  reviews: number;
  mentees: number;
  officeHours: number;
  score: number;
}

export const publicContests: PublicContest[] = [
  {
    slug: 'community-build-week',
    name: 'Community Build Week',
    summary:
      'A sample program for building small, useful tools with an open-source community.',
    status: 'active',
  },
  {
    slug: 'docs-and-design',
    name: 'Docs & Design Jam',
    summary:
      'A sample program focused on accessible documentation and thoughtful interfaces.',
    status: 'applications_open',
  },
  {
    slug: 'maintainer-toolkit',
    name: 'Maintainer Toolkit Sprint',
    summary:
      'A sample program for exploring contributor onboarding and project maintenance.',
    status: 'completed',
  },
];

export const publicProjectsByContest: Record<string, PublicProject[]> = {
  'community-build-week': [
    {
      owner: 'sample-org',
      repo: 'community-dashboard',
      summary: 'A sample dashboard for sharing community project updates.',
      technologies: ['TypeScript', 'React'],
    },
    {
      owner: 'sample-org',
      repo: 'issue-tracker',
      summary: 'A sample tool for organizing beginner-friendly issues.',
      technologies: ['TypeScript', 'SQLite'],
    },
    {
      owner: 'sample-org',
      repo: 'contributor-guide',
      summary: 'A sample guide that helps new contributors get started.',
      technologies: ['Markdown', 'Accessibility'],
    },
  ],
  'docs-and-design': [
    {
      owner: 'sample-org',
      repo: 'design-system',
      summary: 'A sample component library with accessible design patterns.',
      technologies: ['TypeScript', 'CSS'],
    },
    {
      owner: 'sample-org',
      repo: 'documentation-site',
      summary: 'A sample site for clear, maintainable product documentation.',
      technologies: ['MDX', 'React'],
    },
    {
      owner: 'sample-org',
      repo: 'a11y-checklist',
      summary: 'A sample checklist for reviewing interface accessibility.',
      technologies: ['HTML', 'Accessibility'],
    },
  ],
  'maintainer-toolkit': [
    {
      owner: 'sample-org',
      repo: 'release-notes',
      summary: 'A sample workflow for preparing readable release notes.',
      technologies: ['TypeScript', 'Node.js'],
    },
    {
      owner: 'sample-org',
      repo: 'onboarding-kit',
      summary: 'A sample collection of contributor onboarding resources.',
      technologies: ['Markdown', 'Git'],
    },
    {
      owner: 'sample-org',
      repo: 'maintainer-bot',
      summary: 'A sample bot for routine repository maintenance tasks.',
      technologies: ['TypeScript', 'GitHub Actions'],
    },
  ],
};

export const publicContributors: PublicContributor[] = [
  {
    handle: 'sample-contributor',
    name: 'Sample Contributor',
    points: 240,
    mergedPullRequests: 6,
    streak: 3,
    badge: 'Community Builder',
  },
  {
    handle: 'sample-maintainer',
    name: 'Sample Maintainer',
    points: 180,
    mergedPullRequests: 4,
    streak: 2,
    badge: 'Helpful Reviewer',
  },
  {
    handle: 'sample-reviewer',
    name: 'Sample Reviewer',
    points: 120,
    mergedPullRequests: 3,
    streak: 1,
    badge: 'First Contributions',
  },
];

export const publicMentors: PublicMentor[] = [
  {
    handle: 'sample-mentor-one',
    name: 'Sample Mentor One',
    reviews: 4,
    mentees: 2,
    officeHours: 1,
    score: 80,
  },
  {
    handle: 'sample-mentor-two',
    name: 'Sample Mentor Two',
    reviews: 3,
    mentees: 1,
    officeHours: 1,
    score: 60,
  },
];

export function getPublicContest(slug: string): PublicContest | undefined {
  return publicContests.find((contest) => contest.slug === slug);
}

export function getPublicProjects(slug: string): PublicProject[] {
  return publicProjectsByContest[slug] ?? [];
}

export function getPublicProject(
  slug: string,
  owner: string,
  repo: string,
): PublicProject | undefined {
  return getPublicProjects(slug).find(
    (project) => project.owner === owner && project.repo === repo,
  );
}

export function getPublicContributor(
  handle: string,
): PublicContributor | undefined {
  return publicContributors.find(
    (contributor) => contributor.handle === handle,
  );
}
