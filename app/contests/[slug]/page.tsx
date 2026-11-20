import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { createPublicMetadata } from '@/lib/metadata';
import { getPublicContest, PUBLIC_DEMO_NOTICE } from '@/lib/public-data';

type ContestPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ContestPageProps): Promise<Metadata> {
  const { slug } = await params;
  const contest = getPublicContest(slug);

  if (!contest) {
    return createPublicMetadata({
      title: 'Contest not found',
      description: 'This contest is not available as a public contest.',
      path: `/contests/${encodeURIComponent(slug)}`,
      noIndex: true,
    });
  }

  return createPublicMetadata({
    title: contest.name,
    description: contest.summary,
    path: `/contests/${contest.slug}`,
  });
}

export default async function ContestOverview({ params }: ContestPageProps) {
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
              href="/contests"
              className="text-sm font-semibold text-accent hover:underline"
            >
              ← All public contests
            </Link>
            <p className="eyebrow mt-8">Public contest</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-[-.04em] md:text-6xl">
              {contest.name}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#666] dark:text-neutral-400">
              {contest.summary}
            </p>
            <p className="mt-4 text-xs text-[#777] dark:text-neutral-500">
              {PUBLIC_DEMO_NOTICE}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href={`/contests/${contest.slug}/projects`}
                className="button-primary"
              >
                Explore projects
              </Link>
              <Link
                href={`/contests/${contest.slug}/leaderboard`}
                className="button-secondary"
              >
                View leaderboard
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
