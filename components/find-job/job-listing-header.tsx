interface JobListingHeaderProps {
  headline: string;
  subheading: string;
  totalCount: number | null;
}

export function JobListingHeader({
  headline,
  subheading,
  totalCount,
}: JobListingHeaderProps) {
  return (
    <header className="text-center">
      <h1 className="text-balance text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-200 to-sky-400 bg-clip-text text-transparent sm:text-4xl">
        {headline}
      </h1>

      <p className="mt-4 text-md text-gray-300 sm:text-lg max-w-2xl mx-auto">
        {subheading}
      </p>

      {/* ✅ Show ONLY after API hit (totalCount !== null)
          ✅ Allows 0 also */}
      {totalCount !== null && (
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-blue-700/50 bg-gradient-to-br from-blue-900/30 to-blue-950/20 px-5 py-2 shadow-lg shadow-blue-900/20 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-sky-400 shadow-sm shadow-sky-400/40" />
          <p className="text-sm font-semibold text-white">
            {totalCount} fresh jobs found
          </p>
        </div>
      )}
    </header>
  );
}
