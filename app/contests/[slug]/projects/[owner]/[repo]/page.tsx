import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/footer';
import { GitBranch } from '@/components/icons';
import { Navbar } from '@/components/navbar';
import { createPublicMetadata } from '@/lib/metadata';
import {
  getPublicContest,
  getPublicProject,
  PUBLIC_DEMO_NOTICE,
} from '@/lib/public-data';

type ProjectPageProps = {
  params: Promise<{ slug: string; owner: string; repo: string }>;
};

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug, owner, repo } = await params;
  const contest = getPublicContest(slug);
  const project = getPublicProject(slug, owner, repo);

  if (!contest || !project) {
    return createPublicMetadata({
      title: 'Public project not found',
      description: 'This project is not listed on the public contest pages.',
      path: `/contests/${encodeURIComponent(slug)}/projects/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
      noIndex: true,
    });
  }

  return createPublicMetadata({
    title: `${project.owner}/${project.repo}`,
    description: project.summary,
    path: `/contests/${contest.slug}/projects/${project.owner}/${project.repo}`,
  });
}

export default async function PublicProjectPage({ params }: ProjectPageProps) {
  const { slug, owner, repo } = await params;
  const contest = getPublicContest(slug);
  const project = getPublicProject(slug, owner, repo);

  if (!contest || !project) {
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
              href={`/contests/${contest.slug}/projects`}
              className="text-sm font-semibold text-accent hover:underline"
            >
              ← All contest projects
            </Link>
            <p className="eyebrow mt-8">Public project · {contest.name}</p>
            <h1 className="mt-4 flex flex-wrap items-center gap-3 text-3xl font-black tracking-[-.04em] md:text-5xl">
              <GitBranch />
              {project.owner}/{project.repo}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#666] dark:text-neutral-400">
              {project.summary}
            </p>
            <p className="mt-4 text-xs text-[#777] dark:text-neutral-500">
              {PUBLIC_DEMO_NOTICE}
            </p>
            <ul
              aria-label="Project technologies"
              className="mt-8 flex list-none flex-wrap gap-2 p-0"
            >
              {project.technologies.map((technology) => (
                <li
                  key={technology}
                  className="rounded-full bg-accent-soft px-3 py-1.5 text-xs font-bold text-accent"
                >
                  {technology}
                </li>
              ))}
            </ul>
            <Link
              href={`/contests/${contest.slug}`}
              className="button-secondary mt-10"
            >
              Contest overview
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
