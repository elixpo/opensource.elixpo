import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { createPublicMetadata } from '@/lib/metadata';
import {
  getPublicContest,
  getPublicProjects,
  PUBLIC_DEMO_NOTICE,
  publicContributors,
  publicMentors,
} from '@/lib/public-data';
import { LeaderboardClient } from './LeaderboardClient';

type LeaderboardPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: LeaderboardPageProps): Promise<Metadata> {
  const { slug } = await params;
  const contest = getPublicContest(slug);

  if (!contest) {
    return createPublicMetadata({
      title: 'Public contest leaderboard',
      description: 'View rankings for a public contest.',
      path: `/contests/${encodeURIComponent(slug)}/leaderboard`,
      noIndex: true,
    });
  }

  return createPublicMetadata({
    title: `Leaderboard — ${contest.name}`,
    description: `Browse public demo rankings for ${contest.name}.`,
    path: `/contests/${contest.slug}/leaderboard`,
  });
}

export default async function Leaderboard({ params }: LeaderboardPageProps) {
  const { slug } = await params;
  const contest = getPublicContest(slug);

  if (!contest) {
    notFound();
  }

  return (
    <main className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="hero-grid absolute inset-0 -z-10" />
          <div className="shell">
            <Link
              href={`/contests/${contest.slug}`}
              className="text-sm font-semibold text-accent hover:underline"
            >
              ← {contest.name}
            </Link>
            <p className="eyebrow mt-8">Public contest leaderboard</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-[-.04em] md:text-6xl">
              Community rankings.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#666] dark:text-neutral-400">
              Explore contributor, mentor, and project examples for{' '}
              {contest.name}.
            </p>
            <p className="mt-4 text-xs text-[#777] dark:text-neutral-500">
              {PUBLIC_DEMO_NOTICE}
            </p>
            <LeaderboardClient
              slug={contest.slug}
              contributors={publicContributors}
              mentors={publicMentors}
              projects={getPublicProjects(contest.slug)}
            />
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
