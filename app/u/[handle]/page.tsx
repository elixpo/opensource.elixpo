import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { EmptyState } from '@/components/states/EmptyState';
import { createPublicMetadata } from '@/lib/metadata';
import { getPublicContributor } from '@/lib/public-data';

type ProfilePageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { handle } = await params;
  const contributor = getPublicContributor(handle);

  if (!contributor) {
    return createPublicMetadata({
      title: 'Contributor profile not found',
      description: 'This contributor does not have a public demo profile.',
      path: `/u/${encodeURIComponent(handle)}`,
      noIndex: true,
    });
  }

  return createPublicMetadata({
    title: `${contributor.name} — Contributor Profile`,
    description: `View the public demo profile for @${contributor.handle}.`,
    path: `/u/${contributor.handle}`,
  });
}

export default async function UserProfile({ params }: ProfilePageProps) {
  const { handle } = await params;
  const contributor = getPublicContributor(handle);

  return (
    <main className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="hero-grid absolute inset-0 -z-10" />
          <div className="shell">
            {contributor ? (
              <>
                <p className="eyebrow">Public contributor profile</p>
                <div className="surface mt-5 flex flex-col items-center gap-6 p-8 md:flex-row">
                  <div
                    aria-hidden="true"
                    className="grid h-20 w-20 place-items-center rounded-full bg-accent text-2xl font-black text-white"
                  >
                    {contributor.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-black text-ink dark:text-neutral-100">
                      {contributor.name}
                    </h1>
                    <p className="text-sm text-[#777] dark:text-neutral-400">
                      @{contributor.handle}
                    </p>
                    <span className="mt-4 inline-flex rounded-full bg-[#f0f0f0] px-3 py-1 text-xs font-semibold text-ink dark:bg-neutral-800 dark:text-neutral-300">
                      {contributor.badge}
                    </span>
                  </div>
                  <dl className="grid w-full grid-cols-3 gap-4 border-t border-[var(--line)] pt-5 text-center md:w-auto md:border-l md:border-t-0 md:pl-8 md:pt-0">
                    <div>
                      <dt className="text-[10px] font-mono font-bold uppercase text-[#777] dark:text-neutral-400">
                        Points
                      </dt>
                      <dd className="mt-1 text-2xl font-black text-accent">
                        {contributor.points}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-mono font-bold uppercase text-[#777] dark:text-neutral-400">
                        Merged PRs
                      </dt>
                      <dd className="mt-1 text-2xl font-black text-ink dark:text-neutral-100">
                        {contributor.mergedPullRequests}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-mono font-bold uppercase text-[#777] dark:text-neutral-400">
                        Streak
                      </dt>
                      <dd className="mt-1 text-2xl font-black text-ink dark:text-neutral-100">
                        {contributor.streak}d
                      </dd>
                    </div>
                  </dl>
                </div>
                <p className="mt-4 text-xs text-[#777] dark:text-neutral-500">
                  Public profile preview using demonstration content, not live
                  contributor activity.
                </p>
              </>
            ) : (
              <EmptyState
                title="No public contributor profile"
                description={`@${handle} does not have a public demo profile.`}
                action={
                  <Link href="/contests" className="button-secondary">
                    Explore contests
                  </Link>
                }
              />
            )}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
