'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { EmptyState } from '@/components/states/EmptyState';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { type Discussion, type ContestOption } from '@/lib/data/discussions';
import { submitDiscussionAction } from './actions';

const visibilityOptions = [
  { value: 'public', label: 'Public' },
  { value: 'contributors', label: 'All contributors' },
  { value: 'project_members', label: 'Project members' },
];

export function DiscussionClient({
  initialDiscussions,
  contestOptions,
}: {
  initialDiscussions: Discussion[];
  contestOptions: ContestOption[];
}) {
  const [discussions, setDiscussions] = useState<Discussion[]>(initialDiscussions);
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state for new discussion
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newProject, setNewProject] = useState(contestOptions[0]?.value || '');
  const [newTags, setNewTags] = useState('');
  const [newVisibility, setNewVisibility] = useState('public');

  // Filter and sort discussions
  const filtered = discussions
    .filter((d) => {
      const matchesSearch =
        search.trim() === '' ||
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.body.toLowerCase().includes(search.toLowerCase());
      const matchesProject =
        projectFilter === 'all' || d.project === projectFilter;
      return matchesSearch && matchesProject;
    })
    .sort((a, b) => {
      if (sortBy === 'active') {
        return b.commentCount - a.commentCount;
      }
      // Default: newest — pinned first, then by date descending
      if (a.status === 'Pinned' && b.status !== 'Pinned') return -1;
      if (b.status === 'Pinned' && a.status !== 'Pinned') return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  async function handleCreateDiscussion() {
    if (!newTitle.trim() || !newBody.trim() || !newProject) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      const newDiscussion = await submitDiscussionAction(
        newTitle,
        newBody,
        newProject,
        newTags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        newVisibility
      );

      setDiscussions((prev) => [newDiscussion, ...prev]);
      setNewTitle('');
      setNewBody('');
      setNewTags('');
      setNewVisibility('public');
      setDialogOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create discussion');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />

      <section className="shell py-16 md:py-24">
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight text-ink dark:text-neutral-100 md:text-5xl">
            Discussions
          </h1>
          <p className="mt-4 text-base text-[#666] dark:text-neutral-400 max-w-2xl">
            Project conversations, ideas, and help.
          </p>
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:items-center justify-between mb-8">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-1">
            <Input
              type="search"
              placeholder="Search discussions..."
              className="max-w-[300px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
            >
              <option value="all">All Contests</option>
              {contestOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="active">Most Active</option>
            </Select>
          </div>

          <Button
            variant="primary"
            className="whitespace-nowrap w-full md:w-auto"
            onClick={() => setDialogOpen(true)}
          >
            Open Discussion
          </Button>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No discussions found"
            description={
              search || projectFilter !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Be the first to start a discussion!'
            }
            action={
              <Button variant="primary" onClick={() => setDialogOpen(true)}>
                Open Discussion
              </Button>
            }
          />
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((discussion) => (
              <div
                key={discussion.id}
                className="surface p-5 hover:border-[#bbb] dark:hover:border-neutral-700 transition cursor-pointer flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300">
                      {discussion.project}
                    </span>
                    {discussion.status === 'Pinned' && (
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-accent-soft dark:bg-accent/20 text-accent">
                        Pinned
                      </span>
                    )}
                    {discussion.status === 'Resolved' && (
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 dark:bg-emerald-950/40 text-green-800 dark:text-emerald-400">
                        Resolved
                      </span>
                    )}
                    {discussion.status === 'Open' && (
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400">
                        Open
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-ink dark:text-neutral-100 truncate mb-1">
                    {discussion.title}
                  </h3>

                  <p className="text-sm text-[#666] dark:text-neutral-400 line-clamp-1 mb-3">
                    {discussion.body}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#777] dark:text-neutral-500">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-[9px] font-bold">
                        {discussion.author.avatar ? (
                          <img src={discussion.author.avatar} alt={discussion.author.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          discussion.author.name.substring(0, 2).toUpperCase()
                        )}
                      </div>
                      <span>{discussion.author.name}</span>
                    </div>
                    <span>·</span>
                    <span>{discussion.createdAt}</span>
                    <span>·</span>
                    <div className="flex items-center gap-1">
                      {discussion.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] text-[#555] dark:text-neutral-400 hover:text-ink dark:hover:text-white transition"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-[#777] dark:text-neutral-400 shrink-0">
                  <div className="flex flex-col items-end">
                    <span className="flex items-center gap-1 font-bold text-ink dark:text-neutral-200">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      {discussion.commentCount}
                    </span>
                    <span className="text-[10px]">replies</span>
                  </div>
                  <span className="text-[#ddd] dark:text-neutral-700">|</span>
                  <div className="flex flex-col items-end">
                    <span>Latest</span>
                    <span className="text-ink dark:text-neutral-300">
                      {discussion.updatedAt}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogHeader>
          <DialogTitle>Start a Discussion</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="grid gap-2">
            <label className="text-xs font-bold text-ink dark:text-neutral-300">
              Title
            </label>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What's on your mind?"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-xs font-bold text-ink dark:text-neutral-300">
                Project / Contest
              </label>
              <Select
                value={newProject}
                onChange={(e) => setNewProject(e.target.value)}
              >
                {contestOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-bold text-ink dark:text-neutral-300">
                Visibility
              </label>
              <Select
                value={newVisibility}
                onChange={(e) => setNewVisibility(e.target.value)}
              >
                {visibilityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <label className="text-xs font-bold text-ink dark:text-neutral-300">
              Tags (comma separated)
            </label>
            <Input
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              placeholder="help, setup, ideas"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs font-bold text-ink dark:text-neutral-300">
              Body
            </label>
            <textarea
              className="min-h-32 w-full resize-y rounded-xl border border-[var(--line)] bg-white dark:bg-neutral-950 px-4 py-3 text-sm font-normal text-ink dark:text-neutral-100 outline-none focus:border-accent"
              placeholder="Provide more details here..."
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateDiscussion} disabled={isSubmitting}>
            {isSubmitting ? 'Posting...' : 'Post Discussion'}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
