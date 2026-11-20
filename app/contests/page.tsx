import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { PaginationLinks } from '@/components/public/PaginationLinks';
import { EmptyState } from '@/components/states/EmptyState';
import { createPublicMetadata } from '@/lib/metadata';
import {
  PUBLIC_DEMO_NOTICE,
  type PublicContestStatus,
  publicContests,
} from '@/lib/public-data';

export const metadata: Metadata = createPublicMetadata({
  title: 'Public Open Source Contests',
  description:
    'Browse public open-source contests and discover programs welcoming contributors.',
  path: '/contests',
});

const pageSize = 2;

const statusLabels: Record<PublicContestStatus, string> = {
  applications_open: 'Applications open',
  active: 'In progress',
  completed: 'Completed',
};

export default async function Contests({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const { page: rawPage } = await searchParams;
  const pageValue = Array.isArray(rawPage) ? rawPage[0] : rawPage;
  const requestedPage = Number.parseInt(pageValue ?? '1', 10);
  const totalPages = Math.ceil(publicContests.length / pageSize);
  const currentPage = Number.isFinite(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), Math.max(totalPages, 1))
    : 1;
  const contests = publicContests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <main className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="hero-grid absolute inset-0 -z-10" />
          <div className="shell">
            <p className="eyebrow">Explore</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-[-.04em] md:text-6xl">
              Public contests
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#666] dark:text-neutral-400">
              Find open-source programs, browse their projects, and see how
              community members are participating.
            </p>
            <p className="mt-4 text-xs text-[#777] dark:text-neutral-500">
              {PUBLIC_DEMO_NOTICE}
            </p>

            {contests.length === 0 ? (
              <div className="mt-10">
                <EmptyState
                  title="No public contests yet"
                  description="Check back when a contest is published."
                />
              </div>
            ) : (
              <ul
                aria-label="Public contests"
                className="mt-10 grid list-none gap-5 p-0 md:grid-cols-2"
              >
                {contests.map((contest) => (
                  <li key={contest.slug}>
                    <article className="surface flex h-full flex-col p-6">
                      <div className="flex items-center justify-between gap-4">
                        <span className="eyebrow">
                          {statusLabels[contest.status]}
                        </span>
                        <span className="rounded-full bg-accent-soft px-3 py-1 text-[10px] font-bold text-accent">
                          Public
                        </span>
                      </div>
                      <h2 className="mt-5 text-xl font-extrabold text-ink dark:text-neutral-100">
                        {contest.name}
                      </h2>
                      <p className="mt-3 flex-1 text-sm leading-6 text-[#666] dark:text-neutral-400">
                        {contest.summary}
                      </p>
                      <div className="mt-6 flex flex-wrap gap-3 border-t border-[var(--line)] pt-5">
                        <Link
                          href={`/contests/${contest.slug}`}
                          className="button-primary px-4 py-2"
                        >
                          Contest overview
                        </Link>
                        <Link
                          href={`/contests/${contest.slug}/projects`}
                          className="button-secondary px-4 py-2"
                        >
                          Browse projects
                        </Link>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            )}

            <PaginationLinks
              basePath="/contests"
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
