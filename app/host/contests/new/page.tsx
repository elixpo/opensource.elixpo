import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Check } from '@/components/icons';
import { requireAuth } from '@/lib/auth/middleware';
import { submitNewContest } from '../actions';

const roleOptions = [
  [
    'Co-hosts',
    'Full contest-level access, including settings and role invitations.',
  ],
  [
    'Project admins',
    'Manage assigned repositories, issues, rules, and contribution verification.',
  ],
  [
    'Mentors',
    'Review contributions, guide contributors, and log mentorship activity.',
  ],
  [
    'Campus ambassadors',
    'Run outreach and onboarding, with measurable participation activity.',
  ],
  [
    'Contributors',
    'Claim issues, submit work, and see their progress and rewards.',
  ],
];

export default async function NewContestPage() {
  const authResult = await requireAuth();
  if (authResult.error) {
    redirect('/login');
  }

  return (
    <main>
      <header className="flex min-h-[62px] items-center border-b border-[var(--line)] bg-white dark:bg-neutral-900 px-5 md:px-8">
        <Link
          href="/host"
          className="text-sm font-bold no-underline text-ink dark:text-neutral-100"
        >
          ← Host panel
        </Link>
        <span className="mx-3 text-[#ddd] dark:text-neutral-600">/</span>
        <span className="text-sm text-[#777] dark:text-neutral-400">
          Create contest
        </span>
      </header>
      <div className="mx-auto max-w-4xl p-5 py-12 md:p-10 md:py-16">
        <p className="eyebrow">New contest</p>
        <h1 className="mt-2 text-4xl font-black tracking-[-.04em] text-ink dark:text-neutral-100">
          Set the foundation.
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-[#666] dark:text-neutral-400">
          Start with the contest identity, schedule, GitHub scope, and team
          structure. Rules and invitations can be refined before launch.
        </p>
        <form action={submitNewContest} className="mt-10 space-y-6">
          <fieldset className="surface p-6 md:p-8">
            <legend className="px-2 text-sm font-extrabold text-ink dark:text-neutral-100">
              01 · Contest details
            </legend>
            <div className="mt-3 grid gap-5 md:grid-cols-2">
              <label className="text-xs font-bold text-[#555] dark:text-neutral-300 md:col-span-2">
                Contest name
                <input
                  name="name"
                  className="mt-2 w-full rounded-xl border border-[var(--line)] bg-white dark:bg-neutral-950 px-4 py-3 text-sm font-normal text-ink dark:text-neutral-100 outline-none focus:border-accent"
                  placeholder="OpenCode Summer 2026"
                  required
                />
              </label>
              <label className="text-xs font-bold text-[#555] dark:text-neutral-300">
                Starts on
                <input
                  type="date"
                  name="startsAt"
                  required
                  className="mt-2 w-full rounded-xl border border-[var(--line)] bg-white dark:bg-neutral-950 px-4 py-3 text-sm font-normal text-ink dark:text-neutral-100 outline-none focus:border-accent"
                />
              </label>
              <label className="text-xs font-bold text-[#555] dark:text-neutral-300">
                Ends on
                <input
                  type="date"
                  name="endsAt"
                  required
                  className="mt-2 w-full rounded-xl border border-[var(--line)] bg-white dark:bg-neutral-950 px-4 py-3 text-sm font-normal text-ink dark:text-neutral-100 outline-none focus:border-accent"
                />
              </label>
              <label className="text-xs font-bold text-[#555] dark:text-neutral-300 md:col-span-2">
                Public summary
                <textarea
                  name="summary"
                  required
                  className="mt-2 min-h-28 w-full resize-y rounded-xl border border-[var(--line)] bg-white dark:bg-neutral-950 px-4 py-3 text-sm font-normal text-ink dark:text-neutral-100 outline-none focus:border-accent"
                  placeholder="What contributors will build and why it matters."
                />
              </label>
            </div>
          </fieldset>
          <fieldset className="surface p-6 md:p-8">
            <legend className="px-2 text-sm font-extrabold text-ink dark:text-neutral-100">
              02 · GitHub tracking
            </legend>
            <p className="mt-3 text-sm leading-6 text-[#777] dark:text-neutral-400">
              Install the Elixpo GitHub App, then choose a complete organization
              or specific repositories.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <label className="flex cursor-pointer gap-3 rounded-xl border-2 border-accent bg-accent-soft dark:bg-accent/15 p-4">
                <input
                  type="radio"
                  name="scope"
                  value="selected"
                  defaultChecked
                  className="accent-[#e53935]"
                />
                <span>
                  <b className="block text-sm text-ink dark:text-neutral-100">
                    Selected repositories
                  </b>
                  <small className="mt-1 block leading-5 text-[#777] dark:text-neutral-400">
                    Choose repositories across one or more organizations.
                  </small>
                </span>
              </label>
              <label className="flex cursor-pointer gap-3 rounded-xl border border-[var(--line)] bg-white dark:bg-neutral-950/40 p-4">
                <input
                  type="radio"
                  name="scope"
                  value="organization"
                  className="accent-[#e53935]"
                />
                <span>
                  <b className="block text-sm text-ink dark:text-neutral-100">
                    Complete organization
                  </b>
                  <small className="mt-1 block leading-5 text-[#777] dark:text-neutral-400">
                    Track every eligible repository in one GitHub org.
                  </small>
                </span>
              </label>
            </div>
          </fieldset>
          <fieldset className="surface p-6 md:p-8">
            <legend className="px-2 text-sm font-extrabold text-ink dark:text-neutral-100">
              03 · Team structure
            </legend>
            <p className="mt-3 text-sm leading-6 text-[#777] dark:text-neutral-400">
              These role groups are created for every contest. People can hold
              multiple roles where needed.
            </p>
            <div className="mt-5 divide-y divide-[var(--line)]">
              {roleOptions.map(([role, description]) => (
                <div key={role} className="flex gap-3 py-4">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-white">
                    <Check />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink dark:text-neutral-100">
                      {role}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#777] dark:text-neutral-400">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </fieldset>
          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <Link href="/host" className="button-secondary">
              Save as draft
            </Link>
            <button
              type="submit"
              className="button-primary !bg-accent hover:!bg-accent-deep"
            >
              Continue to rules →
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
