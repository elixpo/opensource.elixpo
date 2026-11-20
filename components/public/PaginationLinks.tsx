import Link from 'next/link';

export function PaginationLinks({
  basePath,
  currentPage,
  totalPages,
}: {
  basePath: string;
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages < 2) {
    return null;
  }

  const pageHref = (page: number) =>
    page === 1 ? basePath : `${basePath}?page=${page}`;

  return (
    <nav aria-label="Public results pages" className="mt-10">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>
          {currentPage > 1 ? (
            <Link
              href={pageHref(currentPage - 1)}
              aria-label="Go to previous page"
              className="button-secondary px-4 py-2"
            >
              Previous
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className="button-secondary cursor-not-allowed px-4 py-2 opacity-50"
            >
              Previous
            </span>
          )}
        </li>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <li key={page}>
              {page === currentPage ? (
                <span
                  aria-current="page"
                  className="inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-ink px-3 font-mono text-sm font-bold text-white dark:bg-neutral-100 dark:text-neutral-900"
                >
                  {page}
                </span>
              ) : (
                <Link
                  href={pageHref(page)}
                  aria-label={`Go to page ${page}`}
                  className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-[var(--line)] px-3 font-mono text-sm font-bold hover:bg-card"
                >
                  {page}
                </Link>
              )}
            </li>
          ),
        )}
        <li>
          {currentPage < totalPages ? (
            <Link
              href={pageHref(currentPage + 1)}
              aria-label="Go to next page"
              className="button-secondary px-4 py-2"
            >
              Next
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className="button-secondary cursor-not-allowed px-4 py-2 opacity-50"
            >
              Next
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
