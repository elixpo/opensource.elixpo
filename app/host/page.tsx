import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Arrow, Chart, GitBranch, Trophy, Users } from '@/components/icons';
import { requireAuth } from '@/lib/auth/middleware';
import { getHostContests } from '@/lib/data/contests';

const roles = [
  ['Hosts', '3', 'Owner + co-hosts'],
  ['Project admins', '12', 'Across 8 repositories'],
  ['Mentors', '34', '28 active this week'],
  ['Campus ambassadors', '18', 'Across 11 campuses'],
  ['Contributors', '248', '61 joined this week'],
];

export default async function HostPage() {
  const authResult = await requireAuth();
  if (authResult.error) {
    redirect('/login');
  }
  const { user } = authResult;
  
  const contests = await getHostContests(user.userId);

  return (
    <main>
      <header className="flex min-h-[62px] items-center justify-between border-b border-[var(--line)] bg-white dark:bg-neutral-900 px-5 md:px-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#999] dark:text-neutral-400">
            Host panel
          </p>
          <p className="text-sm font-bold text-ink dark:text-neutral-100">
            Good morning, {user.displayName.split(' ')[0]}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/"
            className="button-secondary hidden !py-2 sm:inline-flex"
          >
            View public site
          </Link>
          <Link
            href="/host/contests/new"
            className="button-primary !bg-accent !py-2 hover:!bg-accent-deep"
          >
            Create contest <Arrow />
          </Link>
        </div>
      </header>
      <div className="p-5 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Workspace overview</p>
            <h1 className="mt-2 text-3xl font-black tracking-[-.035em] text-ink dark:text-neutral-100">
              Everything your contest needs.
            </h1>
            <p className="mt-2 text-sm text-[#777] dark:text-neutral-400">
              Manage contests, roles, GitHub activity, and rewards from one host
              workspace.
            </p>
          </div>
          <span className="w-fit rounded-full border border-[#bee7c8] dark:border-emerald-800 bg-[#effaf2] dark:bg-emerald-950/40 px-3 py-1.5 text-xs font-bold text-[#287d3c] dark:text-emerald-400">
            ● GitHub sync healthy
          </span>
        </div>
        <section className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            [<Trophy key="i" />, 'Active contests', '1', '+ 1 draft'],
            [<Users key="i" />, 'People', '315', '+ 61 this week'],
            [<GitBranch key="i" />, 'Tracked repos', '8', '412 events today'],
            [<Chart key="i" />, 'Merged PRs', '186', '74% verified'],
          ].map(([icon, label, value, note]) => (
            <article key={String(label)} className="surface p-5">
              <div className="flex items-center justify-between text-accent">
                {icon}
                <span className="text-[10px] text-[#999] dark:text-neutral-400">
                  30 DAYS
                </span>
              </div>
              <p className="mt-5 text-xs text-[#777] dark:text-neutral-400">
                {label}
              </p>
              <p className="mt-1 text-3xl font-black text-ink dark:text-neutral-100">
                {value}
              </p>
              <p className="mt-2 text-[11px] text-[#999] dark:text-neutral-400">
                {note}
              </p>
            </article>
          ))}
        </section>
        <section id="contests" className="mt-8 surface overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--line)] p-5">
            <div>
              <h2 className="font-extrabold text-ink dark:text-neutral-100">
                Contests
              </h2>
              <p className="mt-1 text-xs text-[#888] dark:text-neutral-400">
                Every program owned by this workspace.
              </p>
            </div>
            <Link
              href="/host/contests/new"
              className="text-sm font-bold text-accent no-underline"
            >
              New contest →
            </Link>
          </div>
          <div className="divide-y divide-[var(--line)]">
            {contests.map((contest) => (
              <div
                key={contest.name}
                className="grid gap-4 p-5 md:grid-cols-[1.5fr_1fr_1fr_auto] md:items-center"
              >
                <div>
                  <p className="font-bold text-ink dark:text-neutral-100">
                    {contest.name}
                  </p>
                  <p className="mt-1 text-xs text-[#888] dark:text-neutral-400">
                    {new Date(contest.startsAt).toLocaleDateString()} — {new Date(contest.endsAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#999] dark:text-neutral-400">
                    Timeline
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded bg-[#eee] dark:bg-neutral-800">
                    <span
                      className="block h-full rounded bg-accent"
                      style={{ width: `${contest.progress}%` }}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#999] dark:text-neutral-400">
                    People
                  </p>
                  <p className="mt-1 text-sm font-bold text-ink dark:text-neutral-100">
                    {contest.people} members
                  </p>
                </div>
                <span
                  className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-bold ${contest.status === 'active' ? 'bg-[#effaf2] dark:bg-emerald-950/40 text-[#287d3c] dark:text-emerald-400' : 'bg-[#f1f1f1] dark:bg-neutral-800 text-[#777] dark:text-neutral-400'}`}
                >
                  {contest.status}
                </span>
              </div>
            ))}
          </div>
        </section>
        <section
          id="people"
          className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_.9fr]"
        >
          <div className="surface p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-extrabold text-ink dark:text-neutral-100">
                  People & roles
                </h2>
                <p className="mt-1 text-xs text-[#888] dark:text-neutral-400">
                  Access is scoped per contest.
                </p>
              </div>
              <button type="button" className="button-secondary !py-2">
                Invite people
              </button>
            </div>
            <div className="mt-5 divide-y divide-[var(--line)]">
              {roles.map(([role, count, note]) => (
                <div key={role} className="flex items-center py-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-soft text-sm font-black text-accent">
                    {count}
                  </span>
                  <div className="ml-3">
                    <p className="text-sm font-bold text-ink dark:text-neutral-100">
                      {role}
                    </p>
                    <p className="text-[11px] text-[#999] dark:text-neutral-400">
                      {note}
                    </p>
                  </div>
                  <span className="ml-auto text-[#bbb] dark:text-neutral-500">
                    →
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div id="activity" className="surface p-5">
            <h2 className="font-extrabold text-ink dark:text-neutral-100">
              Tracked activity
            </h2>
            <p className="mt-1 text-xs text-[#888] dark:text-neutral-400">
              Across GitHub and platform actions.
            </p>
            <div className="mt-6 space-y-5">
              {[
                [
                  'PR',
                  'Contributor',
                  'Opened PR #284 linked to issue #91',
                  '2m',
                ],
                ['RV', 'Mentor', 'Reviewed 3 pending submissions', '18m'],
                [
                  'AD',
                  'Project admin',
                  'Verified points for 2 merged PRs',
                  '34m',
                ],
                [
                  'CA',
                  'Campus ambassador',
                  'Logged an onboarding session',
                  '1h',
                ],
              ].map(([initials, role, activity, time]) => (
                <div key={activity} className="flex gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#f2f2f2] dark:bg-neutral-800 text-ink dark:text-neutral-200 text-[9px] font-black">
                    {initials}
                  </span>
                  <div>
                    <p className="text-xs leading-5 text-ink dark:text-neutral-200">
                      <b>{role}</b> · {activity}
                    </p>
                    <p className="text-[10px] text-[#aaa] dark:text-neutral-400">
                      {time} ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
