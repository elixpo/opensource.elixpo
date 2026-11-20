export function PublicListLoading({ label }: { label: string }) {
  return (
    <div className="shell py-16">
      <p role="status" aria-live="polite" className="sr-only">
        Loading {label}
      </p>
      <div
        aria-hidden="true"
        className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
      >
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="surface min-h-56 animate-pulse p-6">
            <div className="h-3 w-24 rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="mt-5 h-6 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="mt-4 h-3 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="mt-2 h-3 w-2/3 rounded bg-neutral-200 dark:bg-neutral-800" />
          </div>
        ))}
      </div>
    </div>
  );
}
