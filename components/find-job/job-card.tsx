"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

 

interface Job {
  id: number | string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  source: string;
  postedDate: string;
  description: string;
  applyLink: string;
}

interface JobCardProps {
  job: Job;
}

 

export function JobCard({ job }: JobCardProps) {
  const {
    title,
    company,
    location,
    jobType,
    source,
    postedDate,
    description,
    applyLink,
  } = job;

  const cleanDescription = (description || "")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const readableJobType =
    jobType === "full_time"
      ? "Full Time"
      : jobType === "part_time"
      ? "Part Time"
      : jobType === "contract"
      ? "Contract"
      : jobType;
// console.log(job)
  return (
    <article className="group rounded-2xl border border-blue-700/50 bg-gradient-to-br from-blue-900/25 to-blue-950/10 p-6 shadow-xl shadow-blue-900/20 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/60 hover:shadow-2xl hover:shadow-sky-500/10">
      
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-white transition-colors duration-300 group-hover:text-sky-300">
            {title}
          </h2>

          <p className="mt-1 text-sm font-medium text-gray-300">
            {company}
          </p>
        </div>

        <Button
          asChild
          className="w-full sm:w-auto rounded-lg bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all duration-300"
        >
          <a href={applyLink} target="_blank" rel="noopener noreferrer">
            Apply
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>

      {/* Meta Info */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-300">
        <span className="rounded-full border border-blue-700/50 bg-blue-950/40 px-3 py-1 text-xs">
          📍 {location}
        </span>

        <span className="rounded-full border border-blue-700/50 bg-blue-950/40 px-3 py-1 text-xs">
          🕒 {readableJobType}
        </span>

        <span className="text-xs text-gray-400">
          Posted: {postedDate || "Recently"}
        </span>
      </div>

      {/* Description */}
      <p className="mt-4 line-clamp-3 text-sm text-gray-200/90 leading-relaxed">
        {cleanDescription || "No description available for this job."}
      </p>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-blue-800/40 pt-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-sky-400">
          Source: {source}
        </span>

        <span className="text-xs text-gray-400">
          Verified via Adzuna ✅
        </span>
      </div>
    </article>
  );
}
