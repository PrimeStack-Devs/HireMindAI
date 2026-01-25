"use client";

import { EmptyJobState } from "@/components/find-job/empty-job-state";
import { JobCard } from "@/components/find-job/job-card";
import { JobListingHeader } from "@/components/find-job/job-listing-header";
import { useState } from "react";
const meta = {
    headline: 'HireMind.AI – Jobs Matched to Your Skills',
    subheading:
        'Explore fresh opportunities aligned with your interview performance, skills, and career goals.',
    emptyStateMessage:
        'No relevant openings found right now. Refine your role or skills, or check back soon for new matches.',
};

export default function JobSearchPage() {
    const [jobRole, setJobRole] = useState("");
    const [skills, setSkills] = useState("");
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState<any[]>([]);
    const [error, setError] = useState("");
    const [totalCount, setTotalCount] = useState<number | null>(null);

    const handleSearch = async () => {
        if (!jobRole.trim()) {
            setError("Please enter a job role");
            return;
        }

        setLoading(true);
        setError("");
        setJobs([]);

        try {
            const response = await fetch("/api/find-job", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    candidateDetails: {
                        jobRole,
                        skills: skills
                            ? skills.split(",").map((s) => s.trim())
                            : [],
                    },
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to fetch jobs");
            } else if (!data.jobs || data.jobs.length === 0) {
                setError("No fresh jobs found for this role in India.");
            } else {
                setJobs(data.jobs);
                setTotalCount(data.totalCount);
            }
            
              
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

 
    
    return (
        <div className="min-h-screen flex items-center justify-center p-4 ">
            <div className="w-full max-w-4xl rounded-xl shadow p-6 pt-24 ">
                <h1 className="text-2xl font-semibold mb-4">
                    JobBridge AI – Fresh Jobs
                </h1>

                {/* Job Role */}
                <label className="block text-sm font-medium mb-1">
                    Job Role *
                </label>
                <input
                    type="text"
                    placeholder="e.g. Frontend Developer"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    className="w-full border rounded px-3 py-2 mb-4"
                />

                {/* Skills */}
                <label className="block text-sm font-medium mb-1">
                    Skills (optional)
                </label>
                <input
                    type="text"
                    placeholder="React, JavaScript, CSS"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full border rounded px-3 py-2 mb-4"
                />

                {/* Button */}
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="w-full bg-black text-white py-2 rounded hover:opacity-90 disabled:opacity-50 mb-4"
                >
                    {loading ? "Finding jobs..." : "Find Fresh Jobs"}
                </button>

                {/* Error */}
                {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}

                <main className="min-h-screen bg-background">
                    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                        <JobListingHeader
                            headline={meta.headline}
                            subheading={meta.subheading}
                            totalCount={totalCount || 0}
                        />

                        {totalCount ? (
                            <div className="mt-12 space-y-4">
                                {jobs.map((job) => (
                                    <JobCard key={job.id} job={job} />
                                ))}
                            </div>
                        ) : (
                            <EmptyJobState message={meta.emptyStateMessage} />
                        )}
                    </div>
                </main>

                {/* Jobs List */}
                {/* {totalCount !== null && (
                    <p className="text-sm text-gray-600 mb-3">
                        {totalCount}+ fresh jobs found in India
                    </p>
                )}

                <ul className="space-y-4">
                    {jobs.map((job, idx) => (
                        <li
                            key={job.id ?? idx}
                            className="border rounded-lg p-4 hover:shadow-md transition"
                        >
                            <h3 className="text-lg font-semibold">{job.title}</h3>

                            <p className="text-sm text-gray-700">
                                {job.company} • {job.location} • {job.type}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                                Source: {job.source} • Updated:{" "}
                                {new Date(job.updated).toLocaleDateString()}
                            </p>

                            <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                                {cleanSnippet(job.snippet)}
                            </p>

                            <a
                                href={job.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-3 text-blue-600 font-medium hover:underline"
                            >
                                Apply on {job.source}
                            </a>
                        </li>
                    ))}
                </ul> */}

            </div>
        </div>
    );
}
