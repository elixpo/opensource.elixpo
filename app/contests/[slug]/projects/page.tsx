import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/footer';
import { GitBranch } from '@/components/icons';
import { Navbar } from '@/components/navbar';
import { PaginationLinks } from '@/components/public/PaginationLinks';
import { EmptyState } from '@/components/states/EmptyState';
import { createPublicMetadata } from '@/lib/metadata';
import {
  getPublicContest,
  getPublicProjects,
  PUBLIC_DEMO_NOTICE,
} from '@/lib/public-data';

type ProjectsPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
};

const pageSize = 2;

export async function generateMetadata({
  params,
}: ProjectsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const contest = getPublicContest(slug);

  if (!contest) {
    return createPublicMetadata({
      title: 'Public contest projects',
      description: 'Browse projects participating in a public contest.',
      path: `/contests/${encodeURIComponent(slug)}/projects`,
      noIndex: true,
    });
  }

  return createPublicMetadata({
    title: `Projects — ${contest.name}`,
    description: `Explore public projects participating in ${contest.name}.`,
    path: `/contests/${contest.slug}/projects`,
  });
}

export default async function Projects({
  params,
  searchParams,
}: ProjectsPageProps) {
  const [{ slug }, { page: rawPage }] = await Promise.all([
    params,
    searchParams,
  ]);
  const contest = getPublicContest(slug);

  if (!contest) {
    notFound();
  }

  const projects = getPublicProjects(contest.slug);
  const pageValue = Array.isArray(rawPage) ? rawPage[0] : rawPage;
  const requestedPage = Number.parseInt(pageValue ?? '1', 10);
  const totalPages = Math.ceil(projects.length / pageSize);
  const currentPage = Number.isFinite(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), Math.max(totalPages, 1))
    : 1;
  const visibleProjects = projects.slice(
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
            <Link
              href={`/contests/${contest.slug}`}
              className="text-sm font-semibold text-accent hover:underline"
            >
              ← {contest.name}
            </Link>
            <p className="eyebrow mt-8">Public contest projects</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-[-.04em] md:text-6xl">
              Discover and contribute.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#666] dark:text-neutral-400">
              Browse the public demo repositories listed for {contest.name}.
            </p>
            <p className="mt-4 text-xs text-[#777] dark:text-neutral-500">
              {PUBLIC_DEMO_NOTICE}
            </p>

            {visibleProjects.length === 0 ? (
              <div className="mt-10">
                <EmptyState
                  title="No public projects yet"
                  description="Projects will appear here when they are published for this contest."
                  action={
                    <Link href="/contests" className="button-secondary">
                      Browse contests
                    </Link>
                  }
                />
              </div>
            ) : (
              <ul
                aria-label={`Public projects in ${contest.name}`}
                className="mt-10 grid list-none gap-5 p-0 md:grid-cols-2"
              >
                {visibleProjects.map((project) => (
                  <li key={`${project.owner}/${project.repo}`}>
                    <article className="surface flex h-full flex-col p-6">
                      <div className="flex items-center gap-2 font-mono text-sm font-bold text-ink dark:text-neutral-100">
                        <GitBranch />
                        {project.owner}/{project.repo}
                      </div>
                      <h2 className="mt-4 text-xl font-extrabold text-ink dark:text-neutral-100">
                        {project.repo}
                      </h2>
                      <p className="mt-3 flex-1 text-sm leading-6 text-[#666] dark:text-neutral-400">
                        {project.summary}
                      </p>
                      <ul
                        aria-label="Technologies"
                        className="mt-5 flex list-none flex-wrap gap-2 p-0"
                      >
                        {project.technologies.map((technology) => (
                          <li
                            key={technology}
                            className="rounded-full bg-accent-soft px-3 py-1 text-[10px] font-bold text-accent"
                          >
                            {technology}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={`/contests/${contest.slug}/projects/${project.owner}/${project.repo}`}
                        className="mt-6 self-start text-sm font-bold text-accent hover:underline"
                      >
                        Project details →
                      </Link>
                    </article>
                  </li>
                ))}
              </ul>
            )}

            <PaginationLinks
              basePath={`/contests/${contest.slug}/projects`}
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
