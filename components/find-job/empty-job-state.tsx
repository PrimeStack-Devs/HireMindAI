import { Search } from "lucide-react";

interface EmptyJobStateProps {
  message: string;
}

export function EmptyJobState({ message }: EmptyJobStateProps) {
  return (
    <div className="mt-16 flex flex-col items-center justify-center rounded-2xl border border-blue-700/50 bg-gradient-to-br from-blue-900/25 to-blue-950/10 py-16 px-6 text-center shadow-xl shadow-blue-900/20 backdrop-blur-md">
      <div className="rounded-full border border-sky-500/40 bg-blue-950/40 p-5 shadow-lg shadow-sky-500/10">
        <Search className="h-8 w-8 text-sky-400" />
      </div>

      <h3 className="mt-6 text-xl font-semibold text-white">
        No jobs found
      </h3>

      <p className="mt-2 max-w-md text-sm text-gray-300">
        {message}
      </p>

      <p className="mt-6 text-xs text-gray-400">
        Try changing role, adding skills, or searching again later.
      </p>
    </div>
  );
}
