import Link from 'next/link';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />
        <section className="shell py-20">
          <div className="surface mx-auto max-w-2xl p-10 text-center">
            <p className="eyebrow">404 · Not found</p>
            <h1 className="mt-4 text-3xl font-black text-ink dark:text-neutral-100">
              This public page is unavailable.
            </h1>
            <p className="mt-3 text-sm text-[#666] dark:text-neutral-400">
              The page may not exist or may not be published publicly.
            </p>
            <Link href="/contests" className="button-primary mt-7">
              Browse public contests
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
