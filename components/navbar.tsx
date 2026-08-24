'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AnimatedBackground } from '@/components/core/animated-background';
import { Logo } from './logo';

const navLinks = [
  { href: '/contests/opencode-summer-2026/projects', label: 'Projects' },
  { href: '/contests/opencode-summer-2026/leaderboard', label: 'Leaderboard' },
  { href: '/events', label: 'Events' },
  { href: '/discussion', label: 'Discussion' },
];

const mockNotifications = [
  {
    id: '1',
    title: 'PR #284 merged',
    desc: 'Sofia Chen merged your contribution to elixpo/opensource.',
    time: '2m ago',
    type: 'PR',
  },
  {
    id: '2',
    title: 'Points Awarded',
    desc: 'You received +200 points for verifying bug claims in elixpo/cli.',
    time: '18m ago',
    type: 'Points',
  },
  {
    id: '3',
    title: 'New Contest Draft',
    desc: 'Winter Maintainers Sprint was configured by project admin.',
    time: '34m ago',
    type: 'System',
  },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const pathname = usePathname();
  const router = useRouter();

  const notifRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }

    // Fetch real session
    fetch('/api/auth/me')
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Not logged in');
      })
      .then((data) => {
        setUser(data);
        setIsLoggedIn(true);
      })
      .catch(() => {
        setUser(null);
        setIsLoggedIn(false);
      })
      .finally(() => {
        setIsLoadingAuth(false);
      });
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setIsLoggedIn(false);
    setAvatarMenuOpen(false);
    router.push('/');
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
      if (
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setAvatarMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setNotificationsOpen(false);
    setAvatarMenuOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-white/90 backdrop-blur-xl transition-colors duration-200 dark:border-neutral-800 dark:bg-black/90">
      <div className="shell flex h-[62px] items-center justify-between gap-6">
        <Logo />

        <nav
          className="hidden items-center gap-1 xl:flex"
          aria-label="Primary navigation"
        >
          <AnimatedBackground
            defaultValue={pathname}
            className="rounded-lg bg-[rgba(136,136,136,0.8)]"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
            enableHover={true}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-id={link.href}
                className={`whitespace-nowrap px-2.5 py-2 text-[13px] tracking-wide no-underline transition-colors duration-200 hover:text-ink dark:hover:text-white ${
                  pathname === link.href
                    ? 'font-semibold text-ink dark:text-white'
                    : 'text-[#555] dark:text-neutral-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </AnimatedBackground>
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg p-2 text-[#555] hover:bg-[#f6f6f6] hover:text-ink dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white transition"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

          {!isLoadingAuth && isLoggedIn && user ? (
            <>
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`rounded-lg p-2 text-[#555] hover:bg-[#f6f6f6] hover:text-ink dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white transition relative ${
                    notificationsOpen
                      ? 'bg-[#f6f6f6] dark:bg-neutral-900 text-ink dark:text-white'
                      : ''
                  }`}
                  aria-label="Notifications"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                  </span>
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 top-full z-50 mt-1 w-80 rounded-xl border border-[var(--line)] bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-950 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="border-b border-[var(--line)] dark:border-neutral-800 p-4">
                      <h3 className="text-sm font-extrabold text-ink dark:text-neutral-200">
                        Notifications
                      </h3>
                    </div>
                    <div className="flex flex-col max-h-80 overflow-y-auto divide-y divide-[var(--line)] dark:divide-neutral-800">
                      {mockNotifications.map((n) => (
                        <div
                          key={n.id}
                          className="p-4 text-left hover:bg-[#fafafa] dark:hover:bg-neutral-900 transition"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-[9px] font-bold text-accent uppercase bg-accent-soft dark:bg-accent/10 px-1.5 py-0.5 rounded">
                              {n.type}
                            </span>
                            <span className="text-[10px] text-[#999] dark:text-neutral-400">
                              {n.time}
                            </span>
                          </div>
                          <h4 className="mt-1.5 text-xs font-bold text-ink dark:text-neutral-200">
                            {n.title}
                          </h4>
                          <p className="mt-0.5 text-[11px] text-[#666] dark:text-neutral-400 leading-normal">
                            {n.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                    <Link
                      href="/notifications"
                      className="block text-center text-xs font-bold text-accent py-3 border-t border-[var(--line)] dark:border-neutral-800 hover:bg-[#fafafa] dark:hover:bg-neutral-900 transition no-underline"
                    >
                      View all notifications
                    </Link>
                  </div>
                )}
              </div>

              <div className="relative" ref={avatarRef}>
                <button
                  type="button"
                  onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-accent text-xs font-black text-white no-underline hover:bg-accent-deep transition overflow-hidden"
                  title={`${user.displayName} Profile`}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    user.displayName.substring(0, 2).toUpperCase()
                  )}
                </button>

                {avatarMenuOpen && (
                  <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-xl border border-[var(--line)] bg-white p-2 shadow-xl dark:border-neutral-800 dark:bg-neutral-950 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2 text-left">
                      <div className="text-sm font-extrabold text-ink dark:text-neutral-200">
                        {user.displayName}
                      </div>
                      <div className="text-xs text-[#777] dark:text-neutral-400">
                        {user.email}
                      </div>
                    </div>
                    <div className="my-1 border-t border-[var(--line)] dark:border-neutral-800" />
                    <div className="flex flex-col gap-0.5">
                      <Link
                        href={`/u/${user.userId}`}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-ink dark:text-neutral-300 no-underline hover:bg-[#f6f6f6] dark:hover:bg-neutral-900 transition"
                      >
                        <svg
                          className="h-3.5 w-3.5 text-[#555] dark:text-neutral-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Profile
                      </Link>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-ink dark:text-neutral-300 no-underline hover:bg-[#f6f6f6] dark:hover:bg-neutral-900 transition"
                      >
                        <svg
                          className="h-3.5 w-3.5 text-[#555] dark:text-neutral-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/rewards"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-ink dark:text-neutral-300 no-underline hover:bg-[#f6f6f6] dark:hover:bg-neutral-900 transition"
                      >
                        <svg
                          className="h-3.5 w-3.5 text-[#555] dark:text-neutral-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3-3v8a3 3 0 003 3z"
                          />
                        </svg>
                        Wallet
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-ink dark:text-neutral-300 no-underline hover:bg-[#f6f6f6] dark:hover:bg-neutral-900 transition"
                      >
                        <svg
                          className="h-3.5 w-3.5 text-[#555] dark:text-neutral-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Settings
                      </Link>
                    </div>
                    <div className="my-1 border-t border-[var(--line)] dark:border-neutral-800" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-left text-xs font-bold text-accent hover:bg-accent-soft dark:hover:bg-accent/10 transition"
                    >
                      <svg
                        className="h-3.5 w-3.5 text-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : !isLoadingAuth ? (
            <>
              <Link
                href="/login"
                className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-[#555] dark:text-neutral-400 no-underline transition-all duration-200 hover:text-ink dark:hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="whitespace-nowrap rounded-full bg-zinc-900 px-4 py-2 text-sm font-bold text-white no-underline shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Join Now
              </Link>
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-1.5 xl:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg p-2 text-[#555] hover:bg-[#f6f6f6] hover:text-ink dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white transition"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

          {!isLoadingAuth && isLoggedIn && user ? (
            <Link
              href="/notifications"
              className="rounded-lg p-2 text-[#555] hover:bg-[#f6f6f6] hover:text-ink dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white transition relative"
              aria-label="Notifications"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute right-1.5 top-1.5 flex h-1.5 w-1.5 rounded-full bg-accent" />
            </Link>
          ) : null}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-[#555] hover:bg-[#f6f6f6] hover:text-ink dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-[var(--line)] bg-white py-4 shadow-inner dark:border-neutral-800 dark:bg-neutral-950 xl:hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="shell flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2.5 text-base no-underline transition hover:bg-[#f6f6f6] hover:text-ink dark:hover:bg-neutral-900 dark:hover:text-white ${
                  pathname === link.href
                    ? 'bg-[#f6f6f6] dark:bg-neutral-900 font-semibold text-ink dark:text-white'
                    : 'text-[#555] dark:text-neutral-400'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="my-2 border-t border-[var(--line)] dark:border-neutral-800" />

            {isLoadingAuth ? null : isLoggedIn && user ? (
              <div className="flex flex-col gap-1.5">
                <Link
                  href={`/u/${user.userId}`}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-base no-underline text-[#555] dark:text-neutral-400 hover:bg-[#f6f6f6] dark:hover:bg-neutral-900"
                >
                  <svg
                    className="h-4 w-4 text-[#555] dark:text-neutral-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profile
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-base no-underline text-[#555] dark:text-neutral-400 hover:bg-[#f6f6f6] dark:hover:bg-neutral-900"
                >
                  <svg
                    className="h-4 w-4 text-[#555] dark:text-neutral-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/rewards"
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-base no-underline text-[#555] dark:text-neutral-400 hover:bg-[#f6f6f6] dark:hover:bg-neutral-900"
                >
                  <svg
                    className="h-4 w-4 text-[#555] dark:text-neutral-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3-3v8a3 3 0 003 3z"
                    />
                  </svg>
                  Wallet
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-base no-underline text-[#555] dark:text-neutral-400 hover:bg-[#f6f6f6] dark:hover:bg-neutral-900"
                >
                  <svg
                    className="h-4 w-4 text-[#555] dark:text-neutral-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Settings
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2.5 text-left text-base font-bold text-accent hover:bg-accent-soft dark:hover:bg-accent/10 transition"
                >
                  <svg
                    className="h-4 w-4 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-2.5 text-base no-underline text-[#555] dark:text-neutral-400 hover:bg-[#f6f6f6] dark:hover:bg-neutral-900 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex w-full items-center justify-center rounded-full bg-zinc-900 px-4 py-3 text-sm font-bold text-white no-underline shadow-sm transition-all duration-200 hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:outline-zinc-100 min-h-[44px]"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
