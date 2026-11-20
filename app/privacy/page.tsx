import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { createPublicMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPublicMetadata({
  title: 'Privacy',
  description: 'Privacy information for Elixpo Open Source.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <main className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />
        <section className="shell py-16 md:py-24">
          <p className="eyebrow">Legal</p>
          <h1 className="mt-4 text-4xl font-black tracking-[-.04em] md:text-6xl">
            Privacy
          </h1>
          <div className="surface mt-8 max-w-3xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-ink dark:text-neutral-100">
              Official policy in preparation
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#666] dark:text-neutral-400">
              Elixpo Open Source is under development. The public discovery
              pages currently use demonstration contest, project, and profile
              content. This page is a route placeholder and is not an official
              privacy policy for other services or future product features.
            </p>
            <p className="mt-4 text-sm leading-7 text-[#666] dark:text-neutral-400">
              For privacy questions, contact{' '}
              <a
                href="mailto:hello@elixpo.com"
                className="font-semibold text-accent hover:underline"
              >
                hello@elixpo.com
              </a>
              .
            </p>
            <Link href="/contests" className="button-secondary mt-6">
              Return to public contests
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
