import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';

export default function Sponsors() {
  return (
    <main className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="hero-grid absolute inset-0 -z-10" />
          <div className="shell">
            <p className="eyebrow">Funding boundary</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-[-.04em] md:text-6xl">
              Organization sponsorship is not open.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#666] dark:text-neutral-400">
              Elixpo does not currently solicit, accept, hold, or route
              organization-level sponsorship funds. This service does not sell
              contributor access, project selection, rankings, research
              outcomes, recruitment access, or placement in public records.
            </p>

            <div className="mt-12 grid gap-5 lg:grid-cols-2">
              <article className="surface p-8">
                <p className="eyebrow">Project-owned support</p>
                <h2 className="mt-4 text-2xl font-bold text-ink dark:text-neutral-100">
                  Independent projects keep their own decisions.
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#555] dark:text-neutral-300">
                  A project may publish its own funding destination when its
                  maintainers control the recipient, accounting, terms, and
                  acknowledgement. That support is not an Elixpo-wide fund.
                </p>
              </article>
              <article className="surface p-8">
                <p className="eyebrow">Event partnerships</p>
                <h2 className="mt-4 text-2xl font-bold text-ink dark:text-neutral-100">
                  Non-monetary arrangements use the public policy.
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#555] dark:text-neutral-300">
                  Approved event collaborations, including controlled sticker
                  material, are documented separately and cannot purchase
                  governance authority, contributor credit, or editorial
                  treatment.
                </p>
              </article>
            </div>

            <div className="mt-12 flex flex-wrap gap-3">
              <a
                href="https://elixpo.com/partnerships"
                className="button-primary"
              >
                Read the partnership policy
              </a>
              <a
                href="https://github.com/elixpo/elixpo/blob/main/docs/policies/sponsorship.md"
                className="button-secondary"
              >
                Review the controlling record
              </a>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
