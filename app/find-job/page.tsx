"use client";

import { EmptyJobState } from "@/components/find-job/empty-job-state";
import { JobCard } from "@/components/find-job/job-card";
import { JobListingHeader } from "@/components/find-job/job-listing-header";
import { useState } from "react";
import { motion } from "framer-motion";

const meta = {
  headline: "Jobs Matched to Your Skills",
  subheading:
    "Explore fresh opportunities aligned with your interview performance, skills, and career goals.",
  emptyStateMessage:
    "No relevant openings found right now. Refine your role or skills, or check back soon for new matches.",
};

// --- THEME CONSTANTS ---
const PRIMARY_BUTTON_BG = "bg-blue-600";
const PRIMARY_BUTTON_TEXT = "text-white";
const PRIMARY_BUTTON_HOVER_BG = "hover:bg-blue-700";
const TEXT_GRADIENT = "from-blue-200 to-sky-400";
const ACCENT_COLOR = "text-sky-400";

export default function JobSearchPage() {
  const [jobRole, setJobRole] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState<number | null>(null);

  // ✅ NEW: Track if user searched
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!jobRole.trim()) {
      setError("Please enter a job role");
      return;
    }

    setHasSearched(true); // ✅ request started
    setLoading(true);
    setError("");
    setJobs([]);
    setTotalCount(null);

    try {
      const response = await fetch("/api/find-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateDetails: {
            jobRole,
            skills: skills ? skills.split(",").map((s) => s.trim()) : [],
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to fetch jobs");
        setTotalCount(0);
      } else if (!data.jobs || data.jobs.length === 0) {
        setJobs([]);
        setTotalCount(0);
      } else {
        setJobs(data.jobs);
        setTotalCount(data.totalCount);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen text-white">
      <div className="relative min-h-screen">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-950 via-[#040b1f] to-black" />
        <div className="absolute top-0 left-0 right-0 -z-10 h-[320px] bg-gradient-to-b from-sky-500/10 via-blue-500/5 to-transparent blur-2xl" />

        <div className="container mx-auto px-4 py-24">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-5xl"
          >
            <h1
              className={`text-4xl font-extrabold bg-gradient-to-r ${TEXT_GRADIENT} bg-clip-text text-transparent`}
            >
             Find-Job
            </h1>
            <p className="mt-2 text-gray-300 max-w-2xl">
              Find the freshest jobs based on your target role & skills — fast,
              relevant, and India-focused.
            </p>
          </motion.div>

          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="mx-auto mt-10 max-w-5xl rounded-2xl border border-blue-700/50 bg-gradient-to-br from-blue-900/30 to-blue-950/20 p-6 sm:p-8 shadow-2xl shadow-blue-900/30 backdrop-blur-md"
          >
            <div className="grid gap-6 md:grid-cols-2">
              {/* Job Role */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Job Role <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Developer"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  className="w-full rounded-lg border border-blue-700/40 bg-blue-950/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-sky-500/70 focus:ring-2 focus:ring-sky-500/20 transition"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Skills <span className="text-gray-500">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="React, JavaScript, CSS"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full rounded-lg border border-blue-700/40 bg-blue-950/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-sky-500/70 focus:ring-2 focus:ring-sky-500/20 transition"
                />
              </div>
            </div>

            {/* Button */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleSearch}
                disabled={loading}
                className={`w-full sm:w-auto rounded-lg px-8 py-3 text-sm font-bold shadow-lg shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 ${PRIMARY_BUTTON_BG} ${PRIMARY_BUTTON_TEXT} ${PRIMARY_BUTTON_HOVER_BG}`}
              >
                {loading ? "Finding jobs..." : "Find Fresh Jobs ↗"}
              </button>

              <div className="flex items-center text-sm text-gray-300">
                <span className={`${ACCENT_COLOR} font-semibold mr-2`}>Tip:</span>
                Try role + 2-3 skills for best match.
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-5 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}
          </motion.div>

          {/* Jobs List Section */}
          <div className="mx-auto max-w-5xl mt-14">
            <JobListingHeader
              headline={meta.headline}
              subheading={meta.subheading}
              totalCount={totalCount}
            />

            {/* ✅ Show jobs ONLY when jobs exist */}
            {jobs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="mt-12 space-y-4"
              >
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </motion.div>
            )}

            {/* ✅ Show EmptyJobState ONLY after search + no jobs */}
            {hasSearched && !loading && jobs.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="mt-12"
              >
                <div className="rounded-2xl border border-blue-700/40 bg-gradient-to-br from-blue-900/25 to-blue-950/10 p-8 shadow-xl shadow-blue-900/20 backdrop-blur-md">
                  <EmptyJobState message={meta.emptyStateMessage} />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
