import { Footer } from '@/components/footer';
import { optionalAuth } from '@/lib/auth/middleware';
import { getContestOptions, getDiscussions } from '@/lib/data/discussions';
import { DiscussionClient } from './DiscussionClient';

export default async function DiscussionPage() {
  const user = await optionalAuth();
  const userId = user?.userId ?? null;

  const [discussions, contestOptions] = await Promise.all([
    getDiscussions(userId),
    getContestOptions(),
  ]);

  return (
    <main className="min-h-screen flex flex-col justify-between bg-[#FAFAFA] dark:bg-black">
      <div>
        <DiscussionClient
          initialDiscussions={discussions}
          contestOptions={contestOptions}
        />
      </div>
      <Footer />
    </main>
  );
}
