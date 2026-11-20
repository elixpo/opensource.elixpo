import type { Metadata } from 'next';
import Link from 'next/link';
import { DashboardPreview } from '@/components/dashboard-preview';
import { Footer } from '@/components/footer';
import {
  Arrow,
  Chart,
  Check,
  GitBranch,
  Shield,
  Trophy,
  Users,
} from '@/components/icons';
import { Navbar } from '@/components/navbar';
import { trendingEvents } from '@/lib/data/events';
import { createPublicMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPublicMetadata({
  title: 'Open Source Programs and Contests',
  description:
    'Discover public open-source contests, projects, and contributor communities with Elixpo.',
  path: '/',
});

const features = [
  {
    icon: <GitBranch />,
    title: 'GitHub-native programs',
    body: 'Connect an organization or select repositories. Issues, labels, PRs, reviews, and merges stay in sync.',
  },
  {
    icon: <Trophy />,
    title: 'Fair gamification',
    body: 'Configurable points, badges, streaks, and leaderboards backed by an append-only ledger.',
  },
  {
    icon: <Users />,
    title: 'Every role included',
    body: 'Invite co-hosts, project admins, mentors, campus ambassadors, and contributors with contest-scoped access.',
  },
  {
    icon: <Chart />,
    title: 'Program intelligence',
    body: 'See contributor funnels, issue turnaround, retention, and prize-pool health without a spreadsheet.',
  },
  {
    icon: <Shield />,
    title: 'Audit-ready by default',
    body: 'Every override, approval, label change, and payout decision records its actor and reason.',
  },
  {
    icon: <Check />,
    title: 'Managed essentials',
    body: 'Elixpo identity, notifications, and payout rails work together, so organizers can focus on community.',
  },
];

const steps = [
  [
    '01',
    'Connect GitHub',
    'Install the GitHub App for an organization or choose repositories across organizations.',
  ],
  [
    '02',
    'Shape the program',
    'Set timelines, issue labels, scoring rules, mentor access, and rewards.',
  ],
  [
    '03',
    'Run it in one place',
    'Track claims, reviews, merged work, points, and payouts as the program moves.',
  ],
];

export default function Home() {
  return (
    <main>
      <Navbar />
      <section className="relative overflow-hidden pb-20 pt-20 md:pb-28 md:pt-28">
        <div className="hero-grid absolute inset-0 -z-10" />
        <div className="shell text-center">
          <h1 className="mx-auto mt-7 max-w-5xl text-[clamp(2.8rem,7vw,6.3rem)] font-black leading-[.94] tracking-[-.055em]">
            Run developer contests.
            <br />
            <span className="font-bold italic text-[#888] dark:text-neutral-400">
              Skip the spreadsheets.
            </span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-[1.05rem] leading-7 text-[#555] dark:text-neutral-300 md:text-lg">
            Launch contributor programs, hackathons, and mentorship circles from
            one workspace. Sync GitHub repos, score work by labels, manage
            mentors, track leaderboards, and handle audit-ready payouts.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/host/contests/new" className="button-primary">
              Create a contest <Arrow />
            </Link>
            <Link href="/contests" className="button-secondary">
              View contests
            </Link>
          </div>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-[#999] dark:text-neutral-400">
            Competitions · mentorship · bounties · sustained initiatives
          </p>
          <div className="mx-auto mt-16 max-w-5xl">
            <DashboardPreview />
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-[var(--line)] bg-cream py-4">
        <div className="ticker flex w-max items-center gap-12 whitespace-nowrap font-mono text-[11px] font-bold uppercase tracking-[.12em] text-[#777] dark:text-neutral-400">
          {[...Array(2)]
            .flatMap(() => [
              'Programs',
              'Contributors',
              'Mentors',
              'Repositories',
              'Leaderboards',
              'Payouts',
            ])
            .map((item, i) => (
              <span key={`${item}-${i}`} className="flex items-center gap-12">
                {item}
                <b className="text-accent">✦</b>
              </span>
            ))}
        </div>
      </div>

      <section id="platform" className="shell py-24 md:py-32">
        <p className="eyebrow">One operating system</p>
        <div className="mt-3 grid gap-5 md:grid-cols-2">
          <h2 className="text-4xl font-black tracking-[-.04em] md:text-5xl">
            From first issue
            <br />
            to final payout.
          </h2>
          <p className="max-w-xl text-base leading-7 text-[#666] dark:text-neutral-400">
            A shared source of truth for organizers, maintainers, mentors, and
            contributors—while GitHub remains where the code gets built.
          </p>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="bg-white dark:bg-neutral-900 p-7 transition hover:bg-[#fdfdfd] dark:hover:bg-[#1a1a1a]"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft dark:bg-accent/10 text-accent">
                  {feature.icon}
                </span>
                <span className="font-mono text-[10px] text-[#bbb] dark:text-neutral-500">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-8 text-lg font-extrabold text-ink dark:text-neutral-100">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#666] dark:text-neutral-400">
                {feature.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="workflow" className="bg-[#151515] py-24 text-white md:py-32">
        <div className="shell">
          <p className="eyebrow">Simple by design</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-black tracking-[-.04em] md:text-5xl">
            Your next program,
            <br />
            <span className="italic text-white/45">live in minutes.</span>
          </h2>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
            {steps.map(([number, title, body]) => (
              <article key={number} className="bg-[#151515] p-7 md:p-9">
                <span className="font-mono text-xs font-bold text-accent">
                  {number}
                </span>
                <h3 className="mt-14 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/50">{body}</p>
              </article>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl bg-white dark:bg-neutral-900 p-7 text-ink dark:text-neutral-100 md:flex-row md:items-center md:p-10">
            <div>
              <p className="eyebrow">Phase zero</p>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-ink dark:text-neutral-100">
                The foundation is being built in public.
              </h3>
            </div>
            <a
              href="https://github.com/elixpo/opensource"
              className="button-primary"
            >
              Follow development <Arrow />
            </a>
          </div>
        </div>
      </section>

      <section className="shell py-24 md:py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Top trending events</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-.04em] md:text-4xl">
              Learn from the community
            </h2>
          </div>
          <Link
            href="/events"
            className="button-secondary whitespace-nowrap self-start md:self-auto"
          >
            View full schedule
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {trendingEvents.map((event) => (
            <div
              key={event.title}
              className="surface flex flex-col p-6 hover:border-[#bbb] dark:hover:border-neutral-700 transition"
            >
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="font-mono text-[10px] font-bold text-accent uppercase tracking-wider">
                  {event.type}
                </span>
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-[9px] font-bold text-green-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                  {event.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-ink dark:text-neutral-100 flex-1">
                {event.title}
              </h3>
              <div className="mt-5 flex flex-col gap-2 text-xs font-mono text-[#555] dark:text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <svg
                    className="h-3.5 w-3.5 text-accent shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="truncate">{event.date}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <svg
                    className="h-3.5 w-3.5 text-accent shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="truncate">{event.location}</span>
                </span>
              </div>
              <div className="mt-6">
                <button className="button-primary w-full text-xs py-2">
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
