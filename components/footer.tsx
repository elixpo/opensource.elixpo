import Link from 'next/link';
import { Logo } from './logo';

type FooterItem = {
  name: string;
  href: string;
  external?: boolean;
};

type FooterSection = {
  id: string;
  title: string;
  links: FooterItem[];
};

const footerSections: FooterSection[] = [
  {
    id: 'footer-platform',
    title: 'Platform',
    links: [
      { name: 'Features', href: '/#platform' },
      { name: 'Workflow', href: '/#workflow' },
      { name: 'Host Panel', href: '/host' },
    ],
  },
  {
    id: 'footer-resources',
    title: 'Resources',
    links: [
      {
        name: 'Source Code',
        href: 'https://github.com/elixpo/opensource',
        external: true,
      },
      { name: 'License', href: '/LICENSE' },
      { name: 'FAQ', href: '/faq' },
    ],
  },
  {
    id: 'footer-community',
    title: 'Community',
    links: [
      {
        name: 'Discord Server',
        href: 'https://discord.gg/elixpo',
        external: true,
      },
      { name: 'Sponsors', href: '/sponsors' },
      { name: 'Events', href: '/events' },
      { name: 'Discussion Hub', href: '/discussion' },
    ],
  },
  {
    id: 'footer-company',
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Timeline', href: '/timeline' },
      {
        name: 'Contact Us',
        href: 'mailto:hello@elixpo.com',
        external: true,
      },
    ],
  },
];

const footerLinkClassName =
  'block py-2 text-sm text-white/65 no-underline transition-colors duration-200 hover:text-white';

function FooterLink({ item }: { item: FooterItem }) {
  if (item.external && item.href.startsWith('mailto:')) {
    return (
      <a href={item.href} className={footerLinkClassName}>
        {item.name}
      </a>
    );
  }

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        className={footerLinkClassName}
      >
        {item.name}
      </a>
    );
  }

  return (
    <Link href={item.href} className={footerLinkClassName}>
      {item.name}
    </Link>
  );
}

function FooterSection({ id, title, links }: FooterSection) {
  return (
    <section aria-labelledby={id}>
      <h2
        id={id}
        className="font-mono text-[11px] font-bold uppercase tracking-wider text-white/40"
      >
        {title}
      </h2>
      <ul className="mt-3 list-none p-0">
        {links.map((item) => (
          <li key={item.name}>
            <FooterLink item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#161616] text-white dark:bg-[#0f0f0f]">
      <div className="shell">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-12 sm:grid-cols-3 lg:grid-cols-5 lg:gap-10 lg:py-16">
          <div className="col-span-2 flex flex-col sm:col-span-3 lg:col-span-1">
            <Logo variant="inverted" />
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/60">
              Infrastructure for open-source programs that want less spreadsheet
              work and more merged contributions.
            </p>
          </div>

          {footerSections.map((section) => (
            <FooterSection key={section.id} {...section} />
          ))}
        </div>

        <div className="flex flex-col items-start gap-3 border-t border-white/10 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} Elixpo. Built in the open.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/code-of-conduct"
              className="py-1 transition-colors hover:text-white"
            >
              Code of Conduct
            </Link>
            <a
              href="https://github.com/elixpo/opensource"
              target="_blank"
              rel="noreferrer"
              className="py-1 transition-colors hover:text-white"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
