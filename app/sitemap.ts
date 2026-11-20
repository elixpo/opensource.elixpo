import type { MetadataRoute } from 'next';
import { publicEnv } from '@/lib/env';
import {
  getPublicProjects,
  publicContests,
  publicContributors,
} from '@/lib/public-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '/',
    '/contests',
    '/privacy',
    '/terms',
    ...publicContests.flatMap((contest) => [
      `/contests/${contest.slug}`,
      `/contests/${contest.slug}/projects`,
      `/contests/${contest.slug}/leaderboard`,
      ...getPublicProjects(contest.slug).map(
        ({ owner, repo }) =>
          `/contests/${contest.slug}/projects/${owner}/${repo}`,
      ),
    ]),
    ...publicContributors.map(({ handle }) => `/u/${handle}`),
  ];

  return paths.map((path) => ({
    url: new URL(path, publicEnv.appUrl).toString(),
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }));
}
