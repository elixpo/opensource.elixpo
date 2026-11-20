'use client';

import Link from 'next/link';
import { useState } from 'react';
import { GitBranch, Shield, Users } from '@/components/icons';
import type {
  PublicContributor,
  PublicMentor,
  PublicProject,
} from '@/lib/public-data';

type TabKey = 'contributors' | 'mentors' | 'projects';

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'contributors', label: 'Contributors', icon: <Users /> },
  { key: 'mentors', label: 'Mentors', icon: <Shield /> },
  { key: 'projects', label: 'Projects', icon: <GitBranch /> },
];

export function LeaderboardClient({
  slug,
  contributors,
  mentors,
  projects,
}: {
  slug: string;
  contributors: PublicContributor[];
  mentors: PublicMentor[];
  projects: PublicProject[];
}) {
  const [activeTab, setActiveTab] = useState<TabKey>('contributors');

  return (
    <>
      <div
        role="tablist"
        aria-label="Leaderboard categories"
        className="mt-10 inline-flex flex-wrap items-center gap-1 rounded-full border border-[var(--line)] bg-[#fdfdfd] p-1 dark:bg-neutral-950"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              id={`${tab.key}-tab`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tab.key}-panel`}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
                isActive
                  ? 'bg-ink text-cream shadow-card dark:bg-neutral-100 dark:text-neutral-900'
                  : 'text-[#666] hover:bg-[#f0f0f0] dark:text-neutral-400 dark:hover:bg-neutral-800'
              }`}
            >
              <span className="[&>svg]:h-4 [&>svg]:w-4">{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        id="contributors-panel"
        role="tabpanel"
        aria-labelledby="contributors-tab"
        hidden={activeTab !== 'contributors'}
        className="mt-8 overflow-x-auto rounded-2xl border border-[var(--line)] bg-white shadow-card dark:bg-neutral-900"
      >
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Sample public contributor rankings
          </caption>
          <thead>
            <tr className="border-b border-[var(--line)] bg-[#fdfdfd] text-xs font-mono font-bold uppercase tracking-wider text-[#777] dark:bg-neutral-950 dark:text-neutral-400">
              <th scope="col" className="p-4 pl-6">
                Rank
              </th>
              <th scope="col" className="p-4">
                Contributor
              </th>
              <th scope="col" className="p-4 text-right">
                Merged PRs
              </th>
              <th scope="col" className="p-4 text-right">
                Points
              </th>
              <th scope="col" className="p-4 pr-6">
                Achievement
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)] text-sm">
            {contributors.map((contributor, index) => (
              <tr key={contributor.handle}>
                <td className="p-4 pl-6 font-mono font-bold">#{index + 1}</td>
                <th scope="row" className="p-4 font-normal">
                  <Link
                    href={`/u/${contributor.handle}`}
                    className="font-bold text-ink hover:text-accent dark:text-neutral-100"
                  >
                    {contributor.name}
                    <span className="ml-2 text-xs text-[#777] dark:text-neutral-400">
                      @{contributor.handle}
                    </span>
                  </Link>
                </th>
                <td className="p-4 text-right font-mono">
                  {contributor.mergedPullRequests}
                </td>
                <td className="p-4 text-right font-mono font-black text-accent">
                  {contributor.points}
                </td>
                <td className="p-4 pr-6">{contributor.badge}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        id="mentors-panel"
        role="tabpanel"
        aria-labelledby="mentors-tab"
        hidden={activeTab !== 'mentors'}
        className="mt-8 overflow-x-auto rounded-2xl border border-[var(--line)] bg-white shadow-card dark:bg-neutral-900"
      >
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Sample public mentor rankings</caption>
          <thead>
            <tr className="border-b border-[var(--line)] bg-[#fdfdfd] text-xs font-mono font-bold uppercase tracking-wider text-[#777] dark:bg-neutral-950 dark:text-neutral-400">
              <th scope="col" className="p-4 pl-6">
                Rank
              </th>
              <th scope="col" className="p-4">
                Mentor
              </th>
              <th scope="col" className="p-4 text-right">
                Reviews
              </th>
              <th scope="col" className="p-4 text-right">
                Mentees
              </th>
              <th scope="col" className="p-4 text-right">
                Office hours
              </th>
              <th scope="col" className="p-4 pr-6 text-right">
                Score
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)] text-sm">
            {mentors.map((mentor, index) => (
              <tr key={mentor.handle}>
                <td className="p-4 pl-6 font-mono font-bold">#{index + 1}</td>
                <th scope="row" className="p-4 text-left font-bold">
                  {mentor.name}
                  <span className="ml-2 text-xs font-normal text-[#777] dark:text-neutral-400">
                    @{mentor.handle}
                  </span>
                </th>
                <td className="p-4 text-right font-mono">{mentor.reviews}</td>
                <td className="p-4 text-right font-mono">{mentor.mentees}</td>
                <td className="p-4 text-right font-mono">
                  {mentor.officeHours}
                </td>
                <td className="p-4 pr-6 text-right font-mono font-black text-accent">
                  {mentor.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        id="projects-panel"
        role="tabpanel"
        aria-labelledby="projects-tab"
        hidden={activeTab !== 'projects'}
        className="mt-8 overflow-x-auto rounded-2xl border border-[var(--line)] bg-white shadow-card dark:bg-neutral-900"
      >
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Public demo projects in this contest
          </caption>
          <thead>
            <tr className="border-b border-[var(--line)] bg-[#fdfdfd] text-xs font-mono font-bold uppercase tracking-wider text-[#777] dark:bg-neutral-950 dark:text-neutral-400">
              <th scope="col" className="p-4 pl-6">
                Rank
              </th>
              <th scope="col" className="p-4">
                Project
              </th>
              <th scope="col" className="p-4">
                Technologies
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)] text-sm">
            {projects.map((project, index) => (
              <tr key={`${project.owner}/${project.repo}`}>
                <td className="p-4 pl-6 font-mono font-bold">#{index + 1}</td>
                <th scope="row" className="p-4 text-left font-mono">
                  <Link
                    href={`/contests/${slug}/projects/${project.owner}/${project.repo}`}
                    className="inline-flex items-center gap-2 font-bold text-ink hover:text-accent dark:text-neutral-100"
                  >
                    <GitBranch />
                    {project.owner}/{project.repo}
                  </Link>
                </th>
                <td className="p-4 text-[#666] dark:text-neutral-400">
                  {project.technologies.join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
